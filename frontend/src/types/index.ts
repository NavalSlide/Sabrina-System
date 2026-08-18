// User Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'admin' | 'docente' | 'estudiante'
  avatar?: string
}

// Academic Types
export interface Clase {
  id: string
  nombre: string
  codigo: string
  docente: User
  horario: string
  aula: string
  estudiantes: number
}

export interface Evaluacion {
  id: string
  nombre: string
  clase: Clase
  fecha: string
  tipo: 'parcial' | 'final' | 'quiz'
  estado: 'pendiente' | 'activa' | 'finalizada'
}

export interface Horario {
  id: string
  diaSemana: string
  horaInicio: string
  horaFin: string
  clase: Clase
  docente: User
  aula: string
}

// Laboratory Types
export interface Laboratorio {
  id: string
  nombre: string
  capacidad: number
  ubicacion: string
  equipos: string[]
}

export interface Reserva {
  id: string
  laboratorio: Laboratorio
  fecha: string
  horaInicio: string
  horaFin: string
  usuario: User
  estado: 'pendiente' | 'confirmada' | 'cancelada'
}

// Notification Types
export interface Notificacion {
  id: string
  titulo: string
  mensaje: string
  tipo: 'info' | 'warning' | 'error' | 'success'
  fecha: string
  leida: boolean
  usuario: User
}

// Audit Types
export interface AuditoriaLog {
  id: string
  usuario: User
  accion: string
  tabla: string
  cambios: Record<string, unknown>
  fecha: string
  ip: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
}
