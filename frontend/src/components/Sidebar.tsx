import { Link, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { visibleNavItems } from '../config/nav'
import { useAuthUser } from '../hooks/useAuthUser'
import { userService } from '../services/userService'

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthUser()
  const items = visibleNavItems(user)

  const handleLogout = async () => {
    try {
      await userService.logout()
    } finally {
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <aside className="w-72 bg-gradient-to-b from-rose-400 via-pink-500 to-fuchsia-600 text-white shadow-[0_20px_45px_rgba(190,24,93,0.25)] flex flex-col">
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-xl font-bold shadow-inner font-serif">
            S
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-rose-100">Sabrina</p>
            <h2 className="text-xl font-bold">Academia</h2>
            {user?.rol && <p className="text-[11px] text-rose-100/80">{user.rol}</p>}
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {items.map((item) => {
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
              <Icon name={item.icon} size={19} strokeWidth={isActive ? 2 : 1.75} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-white/15 hover:bg-white/20 rounded-2xl text-white font-medium text-sm transition-colors border border-white/20"
        >
          <Icon name="logout" size={17} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
