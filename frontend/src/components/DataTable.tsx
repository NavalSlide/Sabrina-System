import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

export interface Column<T> {
  key: string
  label: string
  render?: (item: T) => ReactNode
  className?: string
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[]
  data: T[]
  loading: boolean
  error?: string | null
  emptyMessage?: string
  emptyIcon?: IconName
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
  renderActions?: (item: T) => ReactNode
}

export default function DataTable<T extends { id: number }>({
  columns,
  data,
  loading,
  error,
  emptyMessage = 'Todavia no hay registros.',
  emptyIcon = 'inbox',
  onEdit,
  onDelete,
  renderActions,
}: DataTableProps<T>) {
  const hasActions = Boolean(onEdit || onDelete || renderActions)

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-[0_12px_30px_rgba(251,113,133,0.08)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-rose-50/60 border-b border-rose-100">
              {columns.map((col) => (
                <th key={col.key} className={`text-left font-semibold text-rose-500 uppercase text-xs tracking-wider px-4 py-3 ${col.className ?? ''}`}>
                  {col.label}
                </th>
              ))}
              {hasActions && <th className="px-4 py-3 text-right text-xs font-semibold text-rose-500 uppercase tracking-wider">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="border-b border-rose-50 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 bg-rose-50 rounded-full animate-pulse" />
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="h-4 bg-rose-50 rounded-full animate-pulse" />
                    </td>
                  )}
                </tr>
              ))}

            {!loading && error && (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-10 text-center">
                  <div className="inline-flex items-center gap-2 text-red-500">
                    <Icon name="x-circle" size={18} />
                    <p className="font-medium">{error}</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && data.length === 0 && (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="px-4 py-14 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-300">
                    <Icon name={emptyIcon} size={24} />
                  </div>
                  <p className="text-slate-500 font-medium">{emptyMessage}</p>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="border-b border-rose-50 last:border-0 hover:bg-rose-50/40 transition-colors animate-fadeIn"
                  style={{ animationDelay: `${Math.min(index, 8) * 25}ms` }}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-slate-700 ${col.className ?? ''}`}>
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {renderActions?.(item)}
                        {onEdit && (
                          <button
                            type="button"
                            onClick={() => onEdit(item)}
                            aria-label="Editar"
                            title="Editar"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors border border-violet-100"
                          >
                            <Icon name="pencil" size={13} />
                            Editar
                          </button>
                        )}
                        {onDelete && (
                          <button
                            type="button"
                            onClick={() => onDelete(item)}
                            aria-label="Eliminar"
                            title="Eliminar"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
                          >
                            <Icon name="trash" size={13} />
                            Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
