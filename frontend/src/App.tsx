import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@components/Layout'
import RoleGuard from '@components/RoleGuard'
import Dashboard from '@pages/Dashboard'
import Login from '@pages/Login'
import Register from '@pages/Register'
import ForgotPassword from '@pages/ForgotPassword'
import ResetPassword from '@pages/ResetPassword'
import PanelAdmin from '@pages/PanelAdmin'
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
            <Route path="panel" element={<RoleGuard navKey="panel"><PanelAdmin /></RoleGuard>} />
            <Route path="academico" element={<RoleGuard navKey="academico"><Academico /></RoleGuard>} />
            <Route path="docentes" element={<RoleGuard navKey="docentes"><Docentes /></RoleGuard>} />
            <Route path="horarios" element={<Horarios />} />
            <Route path="estudiantes" element={<Estudiantes />} />
            <Route path="laboratorios" element={<RoleGuard navKey="laboratorios"><Laboratorios /></RoleGuard>} />
            <Route path="reservas" element={<RoleGuard navKey="reservas"><Reservas /></RoleGuard>} />
            <Route path="evaluaciones" element={<Evaluaciones />} />
            <Route path="notificaciones" element={<Notificaciones />} />
            <Route path="auditoria" element={<RoleGuard navKey="auditoria"><Auditoria /></RoleGuard>} />
            <Route path="usuarios" element={<RoleGuard navKey="usuarios"><Usuarios /></RoleGuard>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
