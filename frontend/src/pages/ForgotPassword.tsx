import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@components/Icon'
import { userService } from '../services/userService'
import { extractErrorMessage } from '../utils/errors'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!emailRegex.test(email.trim().toLowerCase())) {
      setError('Ingresa un correo válido.')
      return
    }

    setLoading(true)
    try {
      await userService.requestPasswordReset(email.trim().toLowerCase())
      setSent(true)
    } catch (err) {
      setError(extractErrorMessage(err, 'No se pudo procesar la solicitud.'))
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
            <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Recuperar acceso</p>
            <h2 className="text-2xl font-black text-slate-800 mt-2">¿Olvidaste tu contraseña?</h2>
            <p className="text-sm text-slate-500 mt-2">Escribe tu correo y te enviaremos un enlace para restablecerla.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
              <Icon name="x-circle" size={18} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {sent ? (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <Icon name="check-circle" size={20} className="text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-emerald-700 text-sm font-medium">
                Si el correo existe en el sistema, enviamos un enlace de recuperación válido por 1 hora.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
                <div className="relative">
                  <Icon name="mail" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-300" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
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
