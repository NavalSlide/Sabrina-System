// These types mirror the DRF serializers in backend/Sabrina_Syste/apps/*/serializers.py.
// Field names are snake_case on purpose - they match the JSON the API actually returns.

// ---------------------------------------------------------------------------
// API envelope types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  errors?: Record<string, unknown>
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

// ---------------------------------------------------------------------------
// Usuarios y seguridad
// ---------------------------------------------------------------------------

export interface Rol {
  id: number
  nombre: string
  descripcion: string
}

export interface Permiso {
  id: number
  codigo: string
  descripcion: string
}

export interface RolPermiso {
  id: number
  rol: number
  rol_nombre: string
  permiso: number
  permiso_codigo: string
  fecha_asignacion: string
}

export interface UsuarioDirectorio {
  id: number
  nombres: string
  apellidos: string
  email: string
  rol_nombre: string | null
}

export interface Usuario {
  id: number
  email: string
  nombres: string
  apellidos: string
  telefono: string | null
  rol: number | null
  rol_nombre: string | null
  activo: boolean
  is_active: boolean
  is_staff: boolean
  password?: string
  date_joined: string
}

// ---------------------------------------------------------------------------
// Académico
// ---------------------------------------------------------------------------

export interface Especialidad {
  id: number
  nombre: string
  descripcion: string
  fecha_creacion: string
  fecha_actualizacion: string
}

export interface Jornada {
  id: number
  nombre: string
  hora_inicio: string
  hora_fin: string
}

export interface PeriodoLectivo {
  id: number
  nombre: string
  fecha_inicio: string
  fecha_fin: string
  activo: boolean
  estado: 'planificado' | 'activo' | 'cerrado'
}

export interface Curso {
  id: number
  nombre: string
  nivel: string
  especialidad: number | null
  especialidad_nombre: string | null
}

export interface Materia {
  id: number
  nombre: string
  descripcion: string
  creditos: number
}

export interface Paralelo {
  id: number
  curso: number
  curso_nombre: string
  jornada: number
  jornada_nombre: string
  nombre: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  capacidad_maxima: number
  cupo_disponible: number
}

export interface PlanEstudio {
  id: number
  especialidad: number
  especialidad_nombre: string
  curso: number
  curso_nombre: string
  materia: number
  materia_nombre: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  horas_semanales: number
}

// ---------------------------------------------------------------------------
// Docentes y asignaciones
// ---------------------------------------------------------------------------

export interface Docente {
  id: number
  usuario: number
  usuario_nombre: string
  usuario_email: string
  especialidad: number | null
  especialidad_nombre: string | null
  horas_contratadas_semanales: number
  max_horas_diarias: number
  max_horas_semanales: number
  max_horas_continuas: number
}

export interface DisponibilidadDocente {
  id: number
  docente: number
  docente_nombre: string
  dia_semana: number
  hora_inicio: string
  hora_fin: string
  disponible: boolean
}

export interface AsignacionDocente {
  id: number
  docente: number
  docente_nombre: string
  curso: number
  curso_nombre: string
  paralelo: number
  paralelo_nombre: string
  materia: number
  materia_nombre: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  horas_asignadas: number
}

export interface DocenteMateriaAutorizada {
  id: number
  docente: number
  materia: number
  materia_nombre: string
}

export interface DocenteLaboratorioAutorizado {
  id: number
  docente: number
  laboratorio: number
  laboratorio_nombre: string
}

// ---------------------------------------------------------------------------
// Horarios
// ---------------------------------------------------------------------------

export interface BloqueHorario {
  id: number
  nombre: string
  hora_inicio: string
  hora_fin: string
  es_receso: boolean
  orden: number
}

export interface Horario {
  id: number
  paralelo: number
  paralelo_nombre: string
  materia: number
  materia_nombre: string
  docente: number
  docente_nombre: string
  laboratorio: number | null
  laboratorio_nombre: string | null
  bloque_horario: number
  bloque_nombre: string
  dia_semana: number
  dia_semana_display: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  estado: 'generado_automatico' | 'editado_manual' | 'publicado'
}

// ---------------------------------------------------------------------------
// Estudiantes y seguimiento
// ---------------------------------------------------------------------------

export interface Estudiante {
  id: number
  usuario: number
  usuario_nombre: string
  usuario_email: string
  paralelo: number | null
  paralelo_nombre: string | null
  curso_nombre: string | null
  fecha_nacimiento: string | null
  fecha_ingreso: string | null
  estado: 'activo' | 'inactivo' | 'graduado' | 'retirado'
}

export interface Asistencia {
  id: number
  estudiante: number
  estudiante_nombre: string
  paralelo: number
  paralelo_nombre: string
  fecha: string
  estado: 'presente' | 'ausente' | 'atraso' | 'justificado'
  registrado_por: number
  registrado_por_nombre: string
}

export interface Calificacion {
  id: number
  estudiante: number
  estudiante_nombre: string
  materia: number
  materia_nombre: string
  paralelo: number
  paralelo_nombre: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  docente: number
  docente_nombre: string
  nota: string
  tipo_evaluacion: number | null
  fecha_registro: string
}

export interface Representante {
  id: number
  usuario: number
  usuario_nombre: string
  estudiantes: number[]
  estudiantes_nombres: string[]
  parentesco: string
}

export interface IndicadorAcademico {
  id: number
  paralelo: number | null
  paralelo_nombre: string | null
  docente: number | null
  docente_nombre: string | null
  materia: number | null
  materia_nombre: string | null
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  promedio: string
  indice_reprobacion: string
  indice_asistencia: string
  fecha_calculo: string
}

// ---------------------------------------------------------------------------
// Laboratorios
// ---------------------------------------------------------------------------

export interface EquipoLaboratorio {
  id: number
  laboratorio: number
  nombre: string
  cantidad: number
  estado: string
}

export interface SoftwareInstalado {
  id: number
  laboratorio: number
  nombre: string
  version: string
}

export interface Laboratorio {
  id: number
  nombre: string
  capacidad: number
  estado: 'disponible' | 'mantenimiento' | 'inhabilitado'
  ubicacion: string
  equipos: EquipoLaboratorio[]
  softwares: SoftwareInstalado[]
}

// ---------------------------------------------------------------------------
// Reservas
// ---------------------------------------------------------------------------

export interface RecursoReservable {
  id: number
  tipo: 'aula' | 'proyector' | 'kit_robotica'
  nombre: string
  estado: string
}

export interface Reserva {
  id: number
  docente: number
  docente_nombre: string
  laboratorio: number | null
  laboratorio_nombre: string | null
  recurso: number | null
  recurso_nombre: string | null
  fecha: string
  bloque_horario: number
  bloque_nombre: string
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada'
  motivo_rechazo: string | null
  aprobado_por: number | null
  aprobado_por_nombre: string | null
  fecha_solicitud: string
  fecha_resolucion: string | null
}

// ---------------------------------------------------------------------------
// Evaluaciones
// ---------------------------------------------------------------------------

export interface Actividad {
  id: number
  nombre: string
  fecha: string
  descripcion: string
}

export interface Evaluacion {
  id: number
  paralelo: number
  paralelo_nombre: string
  materia: number
  materia_nombre: string
  docente: number
  docente_nombre: string
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  tipo: 'parcial' | 'final' | 'quiz' | 'proyecto'
  fecha: string
  descripcion: string
}

export interface ConfiguracionEvaluacion {
  id: number
  periodo_lectivo: number
  periodo_lectivo_nombre: string
  max_evaluaciones_por_dia: number
}

// ---------------------------------------------------------------------------
// Notificaciones y mensajes
// ---------------------------------------------------------------------------

export interface Notificacion {
  id: number
  usuario_destino: number
  tipo: 'cambio_horario' | 'reserva_aprobada' | 'reserva_rechazada' | 'conflicto' | 'evaluacion_proxima'
  titulo: string
  mensaje: string
  leida: boolean
  fecha_creacion: string
}

export interface ConfiguracionNotificacion {
  id: number
  usuario: number
  dias_antelacion_evaluacion: number
  notificar_por_correo: boolean
}

export interface Mensaje {
  id: number
  emisor: number
  emisor_nombre: string
  receptor: number
  receptor_nombre: string
  mensaje: string
  fecha: string
  leido: boolean
}

// ---------------------------------------------------------------------------
// Auditoría
// ---------------------------------------------------------------------------

export interface RegistroAuditoria {
  id: number
  usuario: number | null
  usuario_nombre: string
  accion: 'crear' | 'editar' | 'eliminar'
  modulo: string
  objeto_id: number
  detalle: Record<string, unknown>
  ip_origen: string | null
  fecha: string
}
