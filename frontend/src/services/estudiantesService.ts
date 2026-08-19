import { createCrudService } from './crud'
import type { Asistencia, Calificacion, Estudiante, Representante } from '../types'

export const estudianteService = createCrudService<Estudiante>('/estudiantes/estudiantes')
export const asistenciaService = createCrudService<Asistencia>('/estudiantes/asistencias')
export const calificacionService = createCrudService<Calificacion>('/estudiantes/calificaciones')
export const representanteService = createCrudService<Representante>('/estudiantes/representantes')
