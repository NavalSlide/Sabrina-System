import { useEffect, useState } from 'react'
import DataTable from '@components/DataTable'
import Icon from '@components/Icon'
import PageHeader from '@components/PageHeader'
import { extractErrorMessage } from '../utils/errors'
import { auditoriaService } from '../services/auditoriaService'
import type { RegistroAuditoria } from '../types'

const ACCION_BADGE: Record<RegistroAuditoria['accion'], string> = {
  crear: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  editar: 'bg-amber-50 text-amber-600 border-amber-200',
  eliminar: 'bg-red-50 text-red-600 border-red-200',
}

const ACCION_ICON: Record<RegistroAuditoria['accion'], 'plus' | 'pencil' | 'trash'> = {
  crear: 'plus',
  editar: 'pencil',
  eliminar: 'trash',
}

export default function Auditoria() {
  const [items, setItems] = useState<RegistroAuditoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accionFiltro, setAccionFiltro] = useState('')
  const [moduloFiltro, setModuloFiltro] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const load = (targetPage: number, append: boolean) => {
    setLoading(!append)
    setError(null)
    auditoriaService
      .list({ accion: accionFiltro || undefined, modulo: moduloFiltro || undefined, page: targetPage })
      .then((res) => {
        setItems((prev) => (append ? [...prev, ...res.data] : res.data))
        setTotalPages(res.pagination.totalPages)
        setTotal(res.pagination.total)
        setPage(targetPage)
      })
      .catch((err) => setError(extractErrorMessage(err, 'No se pudo cargar el registro de auditoria.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load(1, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accionFiltro, moduloFiltro])

  return (
    <div className="space-y-6">
      <PageHeader
        icon="shield-check"
        eyebrow="Seguridad"
        title="Auditoría"
        description="Registro de creaciones, ediciones y eliminaciones realizadas en el sistema. Solo administradores."
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-rose-300" />
          <input
            value={moduloFiltro}
            onChange={(e) => setModuloFiltro(e.target.value)}
            placeholder="Buscar por modulo (ej. academico.curso)"
            className="w-full pl-10 pr-3 py-2.5 border border-rose-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>
        <select
          value={accionFiltro}
          onChange={(e) => setAccionFiltro(e.target.value)}
          className="px-3 py-2.5 border border-rose-200 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="">Todas las acciones</option>
          <option value="crear">Crear</option>
          <option value="editar">Editar</option>
          <option value="eliminar">Eliminar</option>
        </select>
      </div>

      <DataTable<RegistroAuditoria>
        loading={loading}
        error={error}
        data={items}
        emptyMessage="Todavia no hay actividad registrada."
        emptyIcon="shield-check"
        columns={[
          { key: 'fecha', label: 'Fecha', render: (r) => new Date(r.fecha).toLocaleString() },
          { key: 'usuario_nombre', label: 'Usuario' },
          {
            key: 'accion',
            label: 'Accion',
            render: (r) => (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${ACCION_BADGE[r.accion]}`}>
                <Icon name={ACCION_ICON[r.accion]} size={11} />
                {r.accion}
              </span>
            ),
          },
          { key: 'modulo', label: 'Modulo' },
          { key: 'objeto_id', label: 'ID objeto' },
          { key: 'ip_origen', label: 'IP', render: (r) => r.ip_origen ?? '—' },
        ]}
      />

      {!loading && items.length > 0 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <p>
            Mostrando {items.length} de {total} registros
          </p>
          {page < totalPages && (
            <button
              type="button"
              onClick={() => load(page + 1, true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 text-sm font-semibold"
            >
              <Icon name="chevron-down" size={14} />
              Cargar mas
            </button>
          )}
        </div>
      )}
    </div>
  )
}
