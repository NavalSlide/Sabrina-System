import { useState, type ReactNode } from 'react'
import type { CrudService } from '../services/crud'
import { useCrud } from '../hooks/useCrud'
import { useToast } from '../hooks/useToast'
import { extractErrorMessage } from '../utils/errors'
import DataTable, { type Column } from './DataTable'
import Modal from './Modal'
import ConfirmDialog from './ConfirmDialog'
import EntityForm, { type FieldConfig } from './EntityForm'
import Icon, { type IconName } from './Icon'

interface CrudSectionProps<T extends { id: number }> {
  title: string
  description?: string
  service: CrudService<T>
  columns: Column<T>[]
  fields: FieldConfig[]
  toPayload?: (values: Record<string, unknown>) => Partial<T>
  toFormValues?: (item: T) => Record<string, unknown>
  canWrite?: boolean
  emptyMessage?: string
  emptyIcon?: IconName
  extraParams?: Record<string, unknown>
  renderRowActions?: (item: T, reload: () => void) => ReactNode
  addLabel?: string
}

export default function CrudSection<T extends { id: number }>({
  title,
  description,
  service,
  columns,
  fields,
  toPayload,
  toFormValues,
  canWrite = true,
  emptyMessage,
  emptyIcon,
  extraParams,
  renderRowActions,
  addLabel,
}: CrudSectionProps<T>) {
  const { items, loading, error, saving, reload, create, update, remove } = useCrud(service, { params: extraParams })
  const toast = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null)

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (item: T) => {
    setEditing(item)
    setModalOpen(true)
  }

  const handleSubmit = async (values: Record<string, unknown>) => {
    const payload = (toPayload ? toPayload(values) : values) as Partial<T>
    try {
      if (editing) {
        await update(editing.id, payload)
        toast.push(`${title} actualizado correctamente.`, 'success')
      } else {
        await create(payload)
        toast.push(`${title} creado correctamente.`, 'success')
      }
      setModalOpen(false)
      setEditing(null)
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await remove(deleteTarget.id)
      toast.push(`${title} eliminado.`, 'success')
      setDeleteTarget(null)
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  const initialValues = editing ? (toFormValues ? toFormValues(editing) : (editing as unknown as Record<string, unknown>)) : {}

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {description && <p className="text-sm text-slate-500">{description}</p>}
        </div>
        {canWrite && (
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold shadow-lg shadow-rose-200 transition-all whitespace-nowrap"
          >
            <Icon name="plus" size={16} strokeWidth={2.25} />
            {addLabel ?? 'Nuevo'}
          </button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        error={error}
        emptyMessage={emptyMessage}
        emptyIcon={emptyIcon}
        onEdit={canWrite ? openEdit : undefined}
        onDelete={canWrite ? setDeleteTarget : undefined}
        renderActions={renderRowActions ? (item) => renderRowActions(item, reload) : undefined}
      />

      <Modal open={modalOpen} title={editing ? `Editar ${title}` : `Nuevo ${title}`} onClose={() => setModalOpen(false)}>
        <EntityForm
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
          loading={saving}
          submitLabel={editing ? 'Guardar cambios' : 'Crear'}
          isCreate={!editing}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Eliminar ${title}`}
        message="Esta accion no se puede deshacer. ¿Deseas continuar?"
        confirmLabel="Eliminar"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
