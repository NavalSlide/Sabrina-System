import { useEffect, useState } from 'react'
import Card from '@components/Card'
import StatCard from '@components/StatCard'
import Icon from '@components/Icon'
import { userService, type DashboardSummary } from '../services/userService'

const fallbackSummary: DashboardSummary = {
  stats: [
    { label: 'Usuarios', value: 0, icon: 'user-circle', color: 'rose', trend: 'Sin datos' },
    { label: 'Docentes', value: 0, icon: 'users', color: 'pink', trend: 'Sin datos' },
    { label: 'Cursos', value: 0, icon: 'book-open', color: 'peach', trend: 'Sin datos' },
    { label: 'Laboratorios', value: 0, icon: 'flask', color: 'purple', trend: 'Sin datos' },
  ],
  summary: {
    periodoActual: 'Sin período',
    reservasAprobadas: 0,
    reservasPendientes: 0,
    evaluacionesHoy: 0,
  },
  recentActivity: [],
  nextClasses: [],
  tasks: [],
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardSummary>(fallbackSummary)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await userService.getDashboardSummary()
        if (response.data.success && response.data.data) {
          setData(response.data.data)
        }
      } catch (error) {
        console.error('No se pudo cargar el dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-rose-400">Overview</p>
          <h1 className="text-3xl font-black text-slate-800">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-rose-50 border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600">
          <Icon name="calendar" size={16} />
          {loading ? 'Cargando...' : `Periodo actual: ${data.summary.periodoActual}`}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {data.stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={String(stat.value)}
            icon={stat.icon}
            color={stat.color}
            trend={stat.trend}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-slate-800">Actividades recientes</h2>
              <span className="text-xs rounded-full bg-rose-50 text-rose-600 px-3 py-1 border border-rose-200">Hoy</span>
            </div>

            <div className="space-y-4">
              {(data.recentActivity.length ? data.recentActivity : [
                { id: 1, title: 'Sin eventos hoy', description: 'Todavía no hay actividades registradas.', time: 'Sin registro', icon: 'inbox' as const },
              ]).map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-rose-100 last:border-0 last:pb-0">
                  <div className="w-11 h-11 bg-gradient-to-br from-rose-300 to-pink-500 text-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                    <Icon name={activity.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">{activity.title}</p>
                    <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                    <p className="text-xs text-rose-400 mt-2">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">Resumen</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-rose-50 rounded-2xl p-3 border border-rose-100">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="bookmark" size={16} className="text-rose-400" />
                  Reservas aprobadas
                </span>
                <span className="font-bold text-rose-600">{data.summary.reservasAprobadas}</span>
              </div>
              <div className="flex items-center justify-between bg-pink-50 rounded-2xl p-3 border border-pink-100">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="clock" size={16} className="text-pink-400" />
                  Reservas pendientes
                </span>
                <span className="font-bold text-pink-600">{data.summary.reservasPendientes}</span>
              </div>
              <div className="flex items-center justify-between bg-violet-50 rounded-2xl p-3 border border-violet-100">
                <span className="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="flag" size={16} className="text-violet-400" />
                  Evaluaciones hoy
                </span>
                <span className="font-bold text-violet-600">{data.summary.evaluacionesHoy}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="calendar" size={18} className="text-rose-400" />
              Próximas clases
            </h3>
            <div className="space-y-3">
              {(data.nextClasses.length ? data.nextClasses : [
                { name: 'Sin clases programadas', schedule: 'Sin horario', room: 'Por definir' },
              ]).map((item) => (
                <div key={`${item.name}-${item.schedule}`} className="p-3 bg-rose-50 rounded-2xl border border-rose-100">
                  <p className="font-semibold text-slate-800">{item.name}</p>
                  <p className="text-sm text-slate-600">{item.schedule}</p>
                  <p className="text-xs text-rose-400 mt-1">{item.room}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Icon name="clipboard-list" size={18} className="text-rose-400" />
              Tareas pendientes
            </h3>
            <div className="space-y-3">
              {(data.tasks.length ? data.tasks : [
                { title: 'Todo en orden', due: 'Sin tareas', done: true },
              ]).map((task) => (
                <div key={task.title} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                      task.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 text-transparent'
                    }`}
                  >
                    <Icon name="check" size={12} strokeWidth={2.5} />
                  </span>
                  <div className="flex-1">
                    <p className={`font-medium ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p>
                    <p className="text-xs text-slate-500">Vence en {task.due}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
