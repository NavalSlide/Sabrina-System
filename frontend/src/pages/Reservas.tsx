import { useMemo, useState } from 'react'
import CrudSection from '@components/CrudSection'
import Icon from '@components/Icon'
import Modal from '@components/Modal'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useAuthUser } from '../hooks/useAuthUser'
import { useCrud } from '../hooks/useCrud'
import { useToast } from '../hooks/useToast'
import { extractErrorMessage } from '../utils/errors'
import { docenteService } from '../services/docentesService'
import { bloqueHorarioService } from '../services/horariosService'
import { laboratorioService } from '../services/laboratoriosService'
import { recursoReservableService, reservaActions, reservaService } from '../services/reservasService'
import type { RecursoReservable, Reserva } from '../types'

const ESTADO_BADGE: Record<Reserva['estado'], string> = {
  pendiente: 'bg-amber-50 text-amber-600 border-amber-200',
  aprobada: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rechazada: 'bg-red-50 text-red-600 border-red-200',
  cancelada: 'bg-slate-100 text-slate-500 border-slate-200',
}

function RechazarModal({ open, onClose, onConfirm, loading }: { open: boolean; onClose: () => void; onConfirm: (motivo: string) => void; loading: boolean }) {
  const [motivo, setMotivo] = useState('')

  return (
    <Modal open={open} title="Rechazar reserva" onClose={onClose} maxWidth="max-w-sm">
      <div className="space-y-4">
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium text-slate-700 mb-1.5">Motivo del rechazo</label>
          <textarea
            id="motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            rows={3}
            placeholder="Explica brevemente por que se rechaza..."
            className="w-full px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => onConfirm(motivo)}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-rose-500 hover:from-red-500 hover:to-rose-600 text-white text-sm font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
          >
            <Icon name="x-circle" size={15} />
            {loading ? 'Rechazando...' : 'Confirmar rechazo'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function ReservaAcciones({ reserva, reload }: { reserva: Reserva; reload: () => void }) {
  const user = useAuthUser()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [rechazando, setRechazando] = useState(false)
  const isAdmin = Boolean(user?.is_admin)
  const isOwner = user?.rol === 'Docente'

  const run = async (action: () => Promise<unknown>, successMessage: string) => {
    setBusy(true)
    try {
      await action()
      toast.push(successMessage, 'success')
      reload()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    } finally {
      setBusy(false)
    }
  }

  if (reserva.estado === 'pendiente' && isAdmin) {
    return (
      <>
        <button
          type="button"
          disabled={busy}
          onClick={() => run(() => reservaActions.aprobar(reserva.id), 'Reserva aprobada.')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 disabled:opacity-50"
        >
          <Icon name="check-circle" size={13} />
          Aprobar
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => setRechazando(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 disabled:opacity-50"
        >
          <Icon name="x-circle" size={13} />
          Rechazar
        </button>
        <RechazarModal
          open={rechazando}
          loading={busy}
          onClose={() => setRechazando(false)}
          onConfirm={async (motivo) => {
            await run(() => reservaActions.rechazar(reserva.id, motivo), 'Reserva rechazada.')
            setRechazando(false)
          }}
        />
      </>
    )
  }

  if ((reserva.estado === 'pendiente' || reserva.estado === 'aprobada') && (isAdmin || isOwner)) {
    return (
      <button
        type="button"
        disabled={busy}
        onClick={() => run(() => reservaActions.cancelar(reserva.id), 'Reserva cancelada.')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200 disabled:opacity-50"
      >
        <Icon name="ban" size={13} />
        Cancelar
      </button>
    )
  }

  return null
}

export default function Reservas() {
  const user = useAuthUser()
  const canWrite = Boolean(user?.is_admin) || user?.rol === 'Docente'
  const isAdmin = Boolean(user?.is_admin)

  const docentes = useCrud(docenteService)
  const laboratorios = useCrud(laboratorioService)
  const bloques = useCrud(bloqueHorarioService)
  const recursos = useCrud(recursoReservableService)

  const docenteOptions = useMemo(() => docentes.items.map((d) => ({ value: d.id, label: d.usuario_nombre })), [docentes.items])
  const laboratorioOptions = useMemo(() => laboratorios.items.map((l) => ({ value: l.id, label: l.nombre })), [laboratorios.items])
  const bloqueOptions = useMemo(() => bloques.items.map((b) => ({ value: b.id, label: `${b.nombre} (${b.hora_inicio}-${b.hora_fin})` })), [bloques.items])
  const recursoOptions = useMemo(() => recursos.items.map((r) => ({ value: r.id, label: `${r.nombre} (${r.tipo})` })), [recursos.items])

  const reloadAll = () => {
    docentes.reload()
    laboratorios.reload()
    bloques.reload()
    recursos.reload()
  }

  return (
    <div className="space-y-6">
      <PageHeader
        icon="bookmark"
        eyebrow="Gestion"
        title="Reservas"
        description="Solicitudes de laboratorios y recursos. Los administradores aprueban o rechazan."
      />

      <Tabs
        onChange={reloadAll}
        tabs={[
          {
            key: 'reservas',
            label: 'Reservas',
            content: (
              <CrudSection<Reserva>
                title="Reserva"
                service={reservaService}
                columns={[
                  { key: 'docente_nombre', label: 'Docente' },
                  { key: 'laboratorio_nombre', label: 'Recurso', render: (r) => r.laboratorio_nombre ?? r.recurso_nombre ?? '—' },
                  { key: 'fecha', label: 'Fecha' },
                  { key: 'bloque_nombre', label: 'Bloque' },
                  {
                    key: 'estado',
                    label: 'Estado',
                    render: (r) => (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${ESTADO_BADGE[r.estado]}`}>{r.estado}</span>
                    ),
                  },
                ]}
                fields={[
                  { name: 'docente', label: 'Docente (opcional)', type: 'select', options: docenteOptions, helpText: 'Si eres docente se completa automaticamente al dejarlo vacio.' },
                  { name: 'laboratorio', label: 'Laboratorio', type: 'select', options: laboratorioOptions, helpText: 'Elige un laboratorio o un recurso (al menos uno).' },
                  { name: 'recurso', label: 'Recurso (aula, proyector, kit)', type: 'select', options: recursoOptions, helpText: 'Elige un laboratorio o un recurso (al menos uno).' },
                  { name: 'fecha', label: 'Fecha', type: 'date', required: true },
                  { name: 'bloque_horario', label: 'Bloque horario', type: 'select', required: true, options: bloqueOptions },
                ]}
                canWrite={canWrite}
                emptyMessage="Todavia no hay reservas registradas."
                emptyIcon="bookmark"
                renderRowActions={(reserva, reload) => <ReservaAcciones reserva={reserva} reload={reload} />}
              />
            ),
          },
          {
            key: 'recursos',
            label: 'Recursos reservables',
            content: (
              <CrudSection<RecursoReservable>
                title="Recurso"
                service={recursoReservableService}
                columns={[
                  { key: 'nombre', label: 'Nombre' },
                  { key: 'tipo', label: 'Tipo' },
                  { key: 'estado', label: 'Estado' },
                ]}
                fields={[
                  { name: 'nombre', label: 'Nombre', type: 'text', required: true },
                  {
                    name: 'tipo',
                    label: 'Tipo',
                    type: 'select',
                    required: true,
                    options: [
                      { value: 'aula', label: 'Aula' },
                      { value: 'proyector', label: 'Proyector' },
                      { value: 'kit_robotica', label: 'Kit Robotica' },
                    ],
                  },
                  { name: 'estado', label: 'Estado', type: 'text', placeholder: 'disponible' },
                ]}
                canWrite={isAdmin}
                emptyMessage="Todavia no hay recursos reservables registrados."
                emptyIcon="box"
              />
            ),
          },
        ]}
      />
    </div>
  )
}
