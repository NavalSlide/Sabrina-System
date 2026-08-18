import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { userService } from '../services/userService'

export default function Register() {
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,128}$/
  const nameRegex = /^[A-Za-zÀ-ÿ\s'\-]+$/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const normalizedFirstName = firstName.trim()
    const normalizedLastName = lastName.trim()
    const normalizedEmail = email.trim().toLowerCase()

    if (normalizedFirstName.length < 2 || normalizedFirstName.length > 60 || !nameRegex.test(normalizedFirstName)) {
      setError('El nombre debe tener entre 2 y 60 caracteres y solo letras.')
      setLoading(false)
      return
    }

    if (normalizedLastName.length < 2 || normalizedLastName.length > 60 || !nameRegex.test(normalizedLastName)) {
      setError('El apellido debe tener entre 2 y 60 caracteres y solo letras.')
      setLoading(false)
      return
    }

    if (!emailRegex.test(normalizedEmail)) {
      setError('Ingresa un correo electrónico válido.')
      setLoading(false)
      return
    }

    if (!passwordRegex.test(password)) {
      setError('La contraseña debe incluir mayúsculas, minúsculas, número y símbolo.')
      setLoading(false)
      return
    }

    try {
      const response = await userService.register({
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
        email: normalizedEmail,
        password,
      })

      if (response.data.success) {
        setSuccess('Cuenta creada correctamente. Inicia sesión.')
        setTimeout(() => navigate('/login'), 800)
        return
      }

      setError(response.data.error || 'No se pudo registrar el usuario.')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#ffe4ec,_#fdf2f8_26%,_#f5f3ff_70%,_#fff1f2_100%)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 right-20 w-72 h-72 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-violet-200/50 blur-3xl" />
      </div>

      <div className="relative w-full max-w-5xl grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
        <div className="hidden lg:block p-8 text-slate-700">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-300 to-pink-500 rounded-[28px] shadow-lg mb-6">
            <span className="text-4xl font-bold text-white">S</span>
          </div>
          <h1 className="text-5xl font-black text-rose-500 mb-4">Únete a Sabrina</h1>
          <p className="text-xl text-slate-600 max-w-md">Crea tu cuenta y disfruta de una experiencia más ordenada, bonita y eficiente para tu comunidad escolar.</p>

          <div className="mt-8 space-y-4">
            {['Seguimiento académico claro', 'Horarios y evaluaciones organizados', 'Acceso a todo el equipo en un clic'].map((item) => (
              <div key={item} className="flex items-center gap-3 bg-white/70 rounded-2xl p-3 border border-rose-100 shadow-sm">
                <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">✓</div>
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-[32px] shadow-[0_25px_60px_rgba(190,24,93,0.18)] p-8 border border-rose-100">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-rose-400">Registro</p>
            <h2 className="text-3xl font-black text-slate-800 mt-2">Crear cuenta</h2>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
              <p className="text-emerald-700 text-sm font-medium">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-2">Nombre</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  pattern="^[A-Za-zÀ-ÿ\s'\-]+$"
                  minLength={2}
                  maxLength={60}
                  className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-2">Apellido</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  pattern="^[A-Za-zÀ-ÿ\s'\-]+$"
                  minLength={2}
                  maxLength={60}
                  className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                minLength={6}
                maxLength={254}
                className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300"
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
                className="w-full px-4 py-3 border border-rose-200 bg-rose-50/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-300"
                minLength={8}
                maxLength={128}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white rounded-2xl font-semibold shadow-lg shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-rose-500 hover:text-rose-600 font-semibold">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
