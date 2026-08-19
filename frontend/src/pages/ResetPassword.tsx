import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Icon from '@components/Icon'
import { userService } from '../services/userService'
import { extractErrorMessage } from '../utils/errors'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('El enlace de recuperación no es válido. Solicita uno nuevo.')
      return
    }
    if (!passwordRegex.test(password)) {
      setError('La contraseña debe incluir mayúsculas, minúsculas, número y símbolo.')
      return
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      await userService.confirmPasswordReset(token, password)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(extractErrorMessage(err, 'El enlace vencio o no es válido.'))
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

      <div className="relative w-full max-w-md animate-riseIn">
        <div className="bg-white/90 backdrop-blur-md rounded-[32px] shadow-[0_25px_60px_rgba(190,24,93,0.18)] p-8 border border-rose-100">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-rose-300 to-pink-500 rounded-2xl shadow-lg mb-4 text-white">
              <Icon name="key" size={24} />
            </div>
            <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Nueva contraseña</p>
            <h2 className="text-2xl font-black text-slate-800 mt-2">Elige una contraseña nueva</h2>
          </div>

          {!token && (
            <div className="mb-6 flex items-start gap-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <Icon name="info-circle" size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-amber-700 text-sm font-medium">
                Este enlace no incluye un token válido. Solicita uno nuevo desde la pantalla anterior.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <Icon name="x-circle" size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success ? (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Icon name="check-circle" size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-emerald-700 text-sm font-medium">Contraseña actualizada. Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Contraseña nueva</label>
                <div className="relative">
                  <Icon name="key" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    maxLength={128}
                    className="w-full pl-11 pr-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirmar contraseña</label>
                <div className="relative">
                  <Icon name="key" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    minLength={8}
                    maxLength={128}
                    className="w-full pl-11 pr-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Restablecer contraseña'}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-rose-500 hover:text-rose-600 font-semibold text-sm">
              <Icon name="arrow-left" size={14} />
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
