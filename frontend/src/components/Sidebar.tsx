import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', href: '/', icon: 'dashboard' },
  { label: 'Académico', href: '/academico', icon: 'book' },
  { label: 'Docentes', href: '/docentes', icon: 'users' },
  { label: 'Evaluaciones', href: '/evaluaciones', icon: 'chart' },
  { label: 'Horarios', href: '/horarios', icon: 'calendar' },
  { label: 'Laboratorios', href: '/laboratorios', icon: 'beaker' },
  { label: 'Reservas', href: '/reservas', icon: 'bookmark' },
  { label: 'Notificaciones', href: '/notificaciones', icon: 'bell' },
  { label: 'Auditoría', href: '/auditoria', icon: 'shield' },
]

function getIcon(name: string) {
  const icons: Record<string, string> = {
    dashboard: 'M3 12l2-4m0 0l7-4 7 4M5 8v10a1 1 0 001 1h12a1 1 0 001-1V8m-9 4h4',
    book: 'M12 6.253v13m0-13C6.5 6.253 2 10.998 2 16.5S6.5 26.747 12 26.747s10-4.745 10-10.247S17.5 6.253 12 6.253z',
    users: 'M12 4.354a4 4 0 110 8 4 4 0 010-8zM3 8.5s0-1 1-1h16s1 0 1 1v10s0 1-1 1H4s-1 0-1-1v-10z',
    chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    beaker: 'M9.663 17h4.673M12 3v7m6.364 1.636l-3.536 3.536M9.172 9.172L5.636 5.636m9.172 9.172l3.536 3.536M9.172 14.828l-3.536 3.536',
    bookmark: 'M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z',
    bell: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0018 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9',
    shield: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
  }
  return icons[name] || ''
}

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-72 bg-gradient-to-b from-rose-400 via-pink-500 to-fuchsia-600 text-white shadow-[0_20px_45px_rgba(190,24,93,0.25)]">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shadow-inner">
            S
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-100">Sabrina</p>
            <h2 className="text-xl font-bold">Academia</h2>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-white text-rose-600 shadow-lg font-semibold'
                  : 'text-rose-50 hover:bg-white/10'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={getIcon(item.icon)}
                />
              </svg>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 mt-6">
        <button className="w-full px-4 py-3 bg-white/15 hover:bg-white/20 rounded-2xl text-white font-medium text-sm transition-colors border border-white/20">
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
