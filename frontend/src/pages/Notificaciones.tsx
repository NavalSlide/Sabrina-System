import { useEffect, useMemo, useState } from 'react'
import DataTable from '@components/DataTable'
import Icon from '@components/Icon'
import PageHeader from '@components/PageHeader'
import Tabs from '@components/Tabs'
import { useToast } from '../hooks/useToast'
import { extractErrorMessage } from '../utils/errors'
import { configuracionNotificacionService, mensajeService, notificacionService } from '../services/notificacionesService'
import { usuarioDirectorioService } from '../services/adminUsuariosService'
import type { ConfiguracionNotificacion, Mensaje, Notificacion } from '../types'

function NotificacionesTab() {
  const [items, setItems] = useState<Notificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await notificacionService.list()
      setItems(res.data)
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudieron cargar las notificaciones.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const marcarLeida = async (id: number) => {
    try {
      await notificacionService.marcarLeida(id)
      await load()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  const marcarTodas = async () => {
    try {
      await notificacionService.marcarTodasLeidas()
      toast.push('Todas las notificaciones fueron marcadas como leidas.', 'success')
      await load()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  const eliminar = async (id: number) => {
    try {
      await notificacionService.remove(id)
      await load()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  const unreadCount = items.filter((n) => !n.leida).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          {unreadCount > 0 ? (
            <>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 text-xs font-bold text-white">{unreadCount}</span>
              sin leer
            </>
          ) : (
            <>
              <Icon name="check-circle" size={15} className="text-emerald-500" />
              Todo al dia
            </>
          )}
        </p>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={marcarTodas}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100 text-sm font-semibold"
          >
            <Icon name="check" size={14} />
            Marcar todas como leidas
          </button>
        )}
      </div>

      <DataTable<Notificacion>
        loading={loading}
        error={error}
        data={items}
        emptyMessage="No tienes notificaciones."
        emptyIcon="bell"
        columns={[
          {
            key: 'titulo',
            label: 'Notificacion',
            render: (n) => (
              <div>
                <p className={`font-semibold ${n.leida ? 'text-slate-500' : 'text-slate-800'}`}>{n.titulo}</p>
                <p className="text-xs text-slate-500">{n.mensaje}</p>
              </div>
            ),
          },
          { key: 'tipo', label: 'Tipo' },
          { key: 'fecha_creacion', label: 'Fecha', render: (n) => new Date(n.fecha_creacion).toLocaleString() },
        ]}
        renderActions={(n) => (
          <>
            {!n.leida && (
              <button
                type="button"
                onClick={() => marcarLeida(n.id)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100"
              >
                <Icon name="check" size={12} />
                Marcar leida
              </button>
            )}
          </>
        )}
        onDelete={(n) => eliminar(n.id)}
      />
    </div>
  )
}

function MensajesTab() {
  const [items, setItems] = useState<Mensaje[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [receptor, setReceptor] = useState('')
  const [texto, setTexto] = useState('')
  const [sending, setSending] = useState(false)
  const toast = useToast()

  const [directoryOptions, setDirectoryOptions] = useState<{ id: number; label: string }[]>([])

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await mensajeService.list()
      setItems(res.data)
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudieron cargar los mensajes.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    usuarioDirectorioService
      .list()
      .then((res) => setDirectoryOptions(res.data.map((u) => ({ id: u.id, label: `${u.nombres} ${u.apellidos}` }))))
      .catch(() => setDirectoryOptions([]))
  }, [])

  const enviar = async () => {
    if (!receptor || !texto.trim()) {
      toast.push('Selecciona un destinatario y escribe un mensaje.', 'error')
      return
    }
    setSending(true)
    try {
      await mensajeService.create({ receptor: Number(receptor), mensaje: texto.trim() })
      setTexto('')
      toast.push('Mensaje enviado.', 'success')
      await load()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    } finally {
      setSending(false)
    }
  }

  const marcarLeido = async (id: number) => {
    try {
      await mensajeService.marcarLeido(id)
      await load()
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/90 rounded-2xl border border-rose-100 p-4 shadow-sm">
        <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-3">
          <Icon name="send" size={15} className="text-rose-400" />
          Nuevo mensaje
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={receptor}
            onChange={(e) => setReceptor(e.target.value)}
            className="px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300 sm:w-64"
          >
            <option value="">Destinatario...</option>
            {directoryOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
          <input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button
            type="button"
            onClick={enviar}
            disabled={sending}
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold shadow-lg shadow-rose-200 disabled:opacity-50"
          >
            <Icon name="send" size={14} />
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>

      <DataTable<Mensaje>
        loading={loading}
        error={error}
        data={items}
        emptyMessage="Todavia no hay mensajes."
        emptyIcon="mail"
        columns={[
          { key: 'emisor_nombre', label: 'De' },
          { key: 'receptor_nombre', label: 'Para' },
          { key: 'mensaje', label: 'Mensaje' },
          { key: 'fecha', label: 'Fecha', render: (m) => new Date(m.fecha).toLocaleString() },
          { key: 'leido', label: 'Leido', render: (m) => (m.leido ? 'Si' : 'No') },
        ]}
        renderActions={(m) =>
          !m.leido ? (
            <button
              type="button"
              onClick={() => marcarLeido(m.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100"
            >
              <Icon name="check" size={12} />
              Marcar leido
            </button>
          ) : null
        }
      />
    </div>
  )
}

function PreferenciasTab() {
  const [config, setConfig] = useState<ConfiguracionNotificacion | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const toast = useToast()

  useEffect(() => {
    configuracionNotificacionService
      .mia()
      .then(setConfig)
      .catch(() => setConfig(null))
      .finally(() => setLoading(false))
  }, [])

  const guardar = async () => {
    if (!config) return
    setSaving(true)
    try {
      const updated = await configuracionNotificacionService.update(config.id, {
        dias_antelacion_evaluacion: config.dias_antelacion_evaluacion,
        notificar_por_correo: config.notificar_por_correo,
      })
      setConfig(updated)
      toast.push('Preferencias actualizadas.', 'success')
    } catch (err) {
      toast.push(extractErrorMessage(err), 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="h-32 rounded-2xl bg-rose-50 animate-pulse" />
  }

  if (!config) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white/90 p-8 text-center text-slate-500">
        No se pudieron cargar tus preferencias.
      </div>
    )
  }

  return (
    <div className="max-w-lg rounded-2xl border border-rose-100 bg-white/90 p-6 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <Icon name="sliders" size={18} className="text-rose-400" />
        <h3 className="font-bold text-slate-800">Preferencias de notificacion</h3>
      </div>

      <div>
        <label htmlFor="dias" className="block text-sm font-medium text-slate-700 mb-1.5">
          Avisarme con cuantos dias de anticipacion antes de una evaluacion
        </label>
        <input
          id="dias"
          type="number"
          min={0}
          value={config.dias_antelacion_evaluacion}
          onChange={(e) => setConfig({ ...config, dias_antelacion_evaluacion: Number(e.target.value) })}
          className="w-32 px-3 py-2.5 border border-rose-200 bg-rose-50/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={config.notificar_por_correo}
          onChange={(e) => setConfig({ ...config, notificar_por_correo: e.target.checked })}
          className="w-4 h-4 accent-rose-500 rounded"
        />
        Tambien notificarme por correo electronico
      </label>

      <button
        type="button"
        onClick={guardar}
        disabled={saving}
        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white text-sm font-semibold shadow-lg shadow-rose-200 disabled:opacity-50"
      >
        <Icon name="check" size={14} />
        {saving ? 'Guardando...' : 'Guardar preferencias'}
      </button>
    </div>
  )
}

export default function Notificaciones() {
  const tabs = useMemo(
    () => [
      { key: 'notificaciones', label: 'Notificaciones', content: <NotificacionesTab /> },
      { key: 'mensajes', label: 'Mensajes', content: <MensajesTab /> },
      { key: 'preferencias', label: 'Preferencias', content: <PreferenciasTab /> },
    ],
    []
  )

  return (
    <div className="space-y-6">
      <PageHeader
        icon="bell"
        eyebrow="Comunicacion"
        title="Notificaciones"
        description="Tus notificaciones del sistema, mensajes con otros usuarios y preferencias de aviso."
      />

      <Tabs tabs={tabs} />
    </div>
  )
}
