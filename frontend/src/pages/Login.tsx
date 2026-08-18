import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const normalizedEmail = email.trim().toLowerCase()
    if (!emailRegex.test(normalizedEmail)) {
      setError('Ingresa un correo válido.')
      setLoading(false)
      return
    }

    if (password.length < 8 || password.length > 128) {
      setError('La contraseña debe tener entre 8 y 128 caracteres.')
      setLoading(false)
      return
    }

    try {
      const response = await userService.login(normalizedEmail, password)

      if (response.data.success) {
        const user = response.data.data?.user
        if (!user) {
          setError('La respuesta del servidor no incluye información del usuario.')
          return
        }
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/')
        return
      }

      setError(response.data.error || 'Email o contraseña incorrectos')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffe4ec,_#fdf2f8_30%,_#f5f3ff_65%,_#fdf2f8_100%)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 left-20 w-72 h-72 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-10 right-16 w-80 h-80 rounded-full bg-violet-200/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
        <div className="hidden lg:block p-8 text-slate-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-500 rounded-[28px] shadow-lg mb-6">
            <span className="text-4xl font-bold text-white">S</span>
          </div>
          <h1 className="text-5xl font-black text-rose-500 mb-4">Sabrina</h1>
          <p className="text-xl text-slate-600 max-w-md">Tu espacio para gestionar clases, docentes, horarios y la vida académica con calma y estilo.</p>

          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="bg-white/70 rounded-2xl p-4 shadow-sm border border-rose-100">
              <p className="text-2xl font-bold text-rose-500">24/7</p>
              <p className="text-sm text-slate-600">Atención escolar</p>
            </div>
            <div className="bg-white/70 rounded-2xl p-4 shadow-sm border border-rose-100">
              <p className="text-2xl font-bold text-violet-500">99%</p>
              <p className="text-sm text-slate-600">Organización</p>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-[32px] shadow-[0_25px_60px_rgba(190,24,93,0.18)] p-8 border border-rose-100">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Bienvenido</p>
            <h2 className="text-3xl font-black text-slate-800 mt-2">Iniciar sesión</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                minLength={6}
                maxLength={254}
                className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                maxLength={128}
                className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="w-4 h-4 accent-rose-500 rounded" />
                Recordarme
              </label>
              <a href="#" className="text-rose-500 hover:text-rose-600 font-medium">¿Olvidaste tu contraseña?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="text-rose-500 hover:text-rose-600 font-semibold">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
