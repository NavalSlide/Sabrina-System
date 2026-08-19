import { useState, type FormEvent } from 'react'
import Icon from './Icon'

export interface SelectOption {
  value: string | number
  label: string
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'time' | 'select' | 'multiselect' | 'textarea' | 'checkbox' | 'email' | 'password'
  options?: SelectOption[]
  required?: boolean
  /** Only enforced when creating a new record (e.g. password: required to create a login-capable account, optional when editing - blank keeps the current one). */
  requiredOnCreate?: boolean
  step?: string
  min?: number
  placeholder?: string
  helpText?: string
}

interface EntityFormProps {
  fields: FieldConfig[]
  initialValues?: Record<string, unknown>
  onSubmit: (values: Record<string, unknown>) => Promise<void> | void
  onCancel: () => void
  submitLabel?: string
  loading?: boolean
  isCreate?: boolean
}

function toInputValue(value: unknown) {
  if (value === null || value === undefined) return ''
  return value as string | number
}

export default function EntityForm({ fields, initialValues = {}, onSubmit, onCancel, submitLabel = 'Guardar', loading = false, isCreate = true }: EntityFormProps) {
  const [values, setValues] = useState<Record<string, unknown>>(initialValues)
  const [error, setError] = useState('')

  const setField = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    for (const field of fields) {
      if (field.type === 'multiselect') continue
      const isRequired = field.required || (field.requiredOnCreate && isCreate)
      if (isRequired && field.type !== 'checkbox' && !values[field.name] && values[field.name] !== 0) {
        setError(`${field.label} es obligatorio.`)
        return
      }
    }
    await onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium">
          <Icon name="x-circle" size={16} className="shrink-0 mt-0.5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => {
          const isRequired = field.required || (field.requiredOnCreate && isCreate)
          return (
          <div key={field.name} className={field.type === 'textarea' || field.type === 'multiselect' ? 'sm:col-span-2' : ''}>
            <label htmlFor={field.name} className="block text-sm font-medium text-slate-700 mb-1.5">
              {field.label}
              {isRequired && <span className="text-rose-400"> *</span>}
            </label>

            {field.type === 'multiselect' && (
              <div className="max-h-40 overflow-y-auto rounded-xl border border-rose-200 bg-rose-50/40 p-2 space-y-0.5">
                {field.options?.length ? (
                  field.options.map((opt) => {
                    const current = Array.isArray(values[field.name]) ? (values[field.name] as Array<string | number>) : []
                    const checked = current.includes(opt.value)
                    return (
                      <label key={opt.value} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-slate-700 hover:bg-white cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const next = e.target.checked ? [...current, opt.value] : current.filter((v) => v !== opt.value)
                            setField(field.name, next)
                          }}
                          className="w-4 h-4 accent-rose-500 rounded"
                        />
                        {opt.label}
                      </label>
                    )
                  })
                ) : (
                  <p className="px-2 py-1.5 text-sm text-slate-400">No hay opciones disponibles.</p>
                )}
              </div>
            )}

            {field.type === 'select' && (
              <select
                id={field.name}
                value={toInputValue(values[field.name])}
                onChange={(e) => setField(field.name, e.target.value ? Number(e.target.value) || e.target.value : '')}
                required={isRequired}
                className="w-full px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
              >
                <option value="">Selecciona...</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'textarea' && (
              <textarea
                id={field.name}
                value={toInputValue(values[field.name]) as string}
                onChange={(e) => setField(field.name, e.target.value)}
                required={isRequired}
                placeholder={field.placeholder}
                rows={3}
                className="w-full px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
              />
            )}

            {field.type === 'checkbox' && (
              <div className="flex items-center h-[42px]">
                <input
                  id={field.name}
                  type="checkbox"
                  checked={Boolean(values[field.name])}
                  onChange={(e) => setField(field.name, e.target.checked)}
                  className="w-4 h-4 accent-rose-500 rounded mr-2"
                />
                <span className="text-sm text-slate-500">{field.helpText}</span>
              </div>
            )}

            {['text', 'number', 'date', 'time', 'email', 'password'].includes(field.type) && (
              <input
                id={field.name}
                type={field.type}
                value={toInputValue(values[field.name])}
                onChange={(e) =>
                  setField(field.name, field.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value)
                }
                required={isRequired}
                step={field.step}
                min={field.min}
                placeholder={field.placeholder}
                className="w-full px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
              />
            )}

            {field.helpText && field.type !== 'checkbox' && <p className="text-xs text-slate-400 mt-1">{field.helpText}</p>}
          </div>
          )
        })}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
        >
          {loading ? 'Guardando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
