import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@components/Layout'
import Dashboard from '@pages/Dashboard'
import Login from '@pages/Login'
import Register from '@pages/Register'
import ForgotPassword from '@pages/ForgotPassword'
import ResetPassword from '@pages/ResetPassword'
import Academico from '@pages/Academico'
import Docentes from '@pages/Docentes'
import Horarios from '@pages/Horarios'
import Estudiantes from '@pages/Estudiantes'
import Laboratorios from '@pages/Laboratorios'
import Reservas from '@pages/Reservas'
import Evaluaciones from '@pages/Evaluaciones'
import Notificaciones from '@pages/Notificaciones'
import Auditoria from '@pages/Auditoria'
import Usuarios from '@pages/Usuarios'
import { ToastProvider } from './context/ToastContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem('user')
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar-contrasena" element={<ForgotPassword />} />
          <Route path="/recuperar-contrasena/confirmar" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="academico" element={<Academico />} />
            <Route path="docentes" element={<Docentes />} />
            <Route path="horarios" element={<Horarios />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="laboratorios" element={<Laboratorios />} />
            <Route path="reservas" element={<Reservas />} />
            <Route path="evaluaciones" element={<Evaluaciones />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            <Route path="auditoria" element={<Auditoria />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
