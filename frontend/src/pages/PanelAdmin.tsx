import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '@components/Card'
import Icon, { type IconName } from '@components/Icon'
import PageHeader from '@components/PageHeader'
import { cursoService, periodoLectivoService } from '../services/academicoService'
import { asignacionDocenteService, docenteService } from '../services/docentesService'
import { usuarioAdminService } from '../services/adminUsuariosService'
import { reservaService } from '../services/reservasService'

interface AttentionItem {
  icon: IconName
  label: string
  value: string
  tone: 'ok' | 'warn'
  href: string
}

interface QuickAction {
  icon: IconName
  title: string
  description: string
  href: string
}

const quickActions: QuickAction[] = [
  { icon: 'user-circle', title: 'Crear usuario', description: 'Da de alta una cuenta y asignale un rol.', href: '/usuarios' },
  { icon: 'id-card', title: 'Dar de alta un docente', description: 'Vincula un usuario existente como docente.', href: '/docentes' },
  { icon: 'clipboard-list', title: 'Asignar docente a materia/paralelo', description: 'Crea una asignacion academica para el periodo.', href: '/docentes?tab=asignaciones' },
  { icon: 'graduation-cap', title: 'Matricular estudiante', description: 'Registra un estudiante y su paralelo.', href: '/estudiantes?tab=estudiantes' },
  { icon: 'users', title: 'Vincular representante', description: 'Conecta un usuario con los estudiantes que representa.', href: '/estudiantes?tab=representantes' },
  { icon: 'key', title: 'Asignar permisos a un rol', description: 'Define que puede hacer cada rol del sistema.', href: '/usuarios?tab=roles-permisos' },
  { icon: 'calendar', title: 'Editar horarios', description: 'Programa clases evitando choques de docente o aula.', href: '/horarios?tab=horarios' },
  { icon: 'bookmark', title: 'Revisar reservas pendientes', description: 'Aprueba o rechaza solicitudes de laboratorios.', href: '/reservas?tab=reservas' },
  { icon: 'shield-check', title: 'Ver auditoria', description: 'Consulta quien creo, edito o elimino cada registro.', href: '/auditoria' },
]

export default function PanelAdmin() {
  const [items, setItems] = useState<AttentionItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const [reservasPendientes, usuarios, periodos, cursos, docentes, asignaciones] = await Promise.all([
          reservaService.list({ estado: 'pendiente', pageSize: 1 }),
          usuarioAdminService.list({ pageSize: 200 }),
          periodoLectivoService.list({ pageSize: 50 }),
          cursoService.list({ pageSize: 1 }),
          docenteService.list({ pageSize: 200 }),
          asignacionDocenteService.list({ pageSize: 500 }),
        ])
        if (cancelled) return

        const usuariosSinRol = usuarios.data.filter((u) => !u.rol).length
        const periodoActivo = periodos.data.find((p) => p.activo)
        const docentesConAsignacion = new Set(asignaciones.data.map((a) => a.docente))
        const docentesSinAsignacion = docentes.data.filter((d) => !docentesConAsignacion.has(d.id)).length

        setItems([
          {
            icon: 'bookmark',
            label: 'Reservas pendientes',
            value: String(reservasPendientes.pagination.total),
            tone: reservasPendientes.pagination.total > 0 ? 'warn' : 'ok',
            href: '/reservas?tab=reservas',
          },
          {
            icon: 'user-circle',
            label: 'Usuarios sin rol asignado',
            value: String(usuariosSinRol),
            tone: usuariosSinRol > 0 ? 'warn' : 'ok',
            href: '/usuarios',
          },
          {
            icon: 'id-card',
            label: 'Docentes sin asignaciones',
            value: String(docentesSinAsignacion),
            tone: docentesSinAsignacion > 0 ? 'warn' : 'ok',
            href: '/docentes?tab=asignaciones',
          },
          {
            icon: 'calendar',
            label: 'Periodo lectivo activo',
            value: periodoActivo ? periodoActivo.nombre : 'Ninguno definido',
            tone: periodoActivo ? 'ok' : 'warn',
            href: '/academico?tab=periodos',
          },
          {
            icon: 'book-open',
            label: 'Cursos registrados',
            value: String(cursos.pagination.total),
            tone: cursos.pagination.total > 0 ? 'ok' : 'warn',
            href: '/academico?tab=cursos',
          },
        ])
      } catch {
        if (!cancelled) setError('No se pudo cargar el resumen de administracion.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        icon="sliders"
        eyebrow="Administracion"
        title="Panel de Administración"
        description="Todo lo que requiere tu atencion y los accesos directos a las tareas de gestion mas comunes, en un solo lugar."
      />

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Requiere tu atencion</h2>
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!items && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-rose-50 animate-pulse" />
            ))}
          </div>
        )}
        {items && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {items.map((item) => (
              <Link key={item.label} to={item.href}>
                <Card className="p-4 h-full hover:-translate-y-0.5 transition-transform">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                        item.tone === 'warn' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-800 mt-3">{item.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{item.label}</p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3">Accesos directos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className="p-5 h-full flex items-start gap-4 hover:-translate-y-0.5 transition-transform">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-md">
                  <Icon name={action.icon} size={20} />
                </span>
                <div>
                  <p className="font-semibold text-slate-800">{action.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5">{action.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
