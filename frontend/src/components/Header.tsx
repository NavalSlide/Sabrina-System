import { useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { useAuthUser } from '../hooks/useAuthUser'
import { userService } from '../services/userService'

export default function Header() {
  const navigate = useNavigate()
  const user = useAuthUser()

  const handleLogout = async () => {
    try {
      await userService.logout()
    } finally {
      localStorage.removeItem('user')
      navigate('/login')
    }
  }

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-pink-500 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-md font-serif">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold text-rose-600">Sabrina</h1>
            <p className="text-xs text-rose-400 uppercase tracking-[0.2em]">Gestión académica</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {user?.rol && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-600">
              <Icon name="tag" size={13} />
              {user.rol}
            </span>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <Icon name="logout" size={16} />
            Cerrar sesión
          </button>

          <div className="flex items-center gap-3 pl-6 border-l border-rose-100">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-pink-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || 'Usuario'}
              </p>
              <p className="text-xs text-rose-400">{user?.email || 'Admin'}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
