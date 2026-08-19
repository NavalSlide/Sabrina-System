import { createCrudService } from './crud'
import type { Curso, Especialidad, Jornada, Materia, Paralelo, PeriodoLectivo, PlanEstudio } from '../types'

export const especialidadService = createCrudService<Especialidad>('/academico/especialidades')
export const jornadaService = createCrudService<Jornada>('/academico/jornadas')
export const periodoLectivoService = createCrudService<PeriodoLectivo>('/academico/periodos')
export const cursoService = createCrudService<Curso>('/academico/cursos')
export const materiaService = createCrudService<Materia>('/academico/materias')
export const paraleloService = createCrudService<Paralelo>('/academico/paralelos')
export const planEstudioService = createCrudService<PlanEstudio>('/academico/plan-estudio')
