import { useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

export default function Header() {
  const navigate = useNavigate()
  const rawUser = localStorage.getItem('user')
  const user = rawUser ? JSON.parse(rawUser) : null

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
          <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-pink-500 rounded-2xl flex items-center justify-center text-lg font-bold text-white shadow-md">
            S
          </div>
          <div>
            <h1 className="text-2xl font-bold text-rose-600">Sabrina</h1>
            <p className="text-xs text-rose-400 uppercase tracking-[0.2em]">Gestión académica</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
            </svg>
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
