import { createCrudService } from './crud'
import type { Actividad, ConfiguracionEvaluacion, Evaluacion } from '../types'

export const actividadService = createCrudService<Actividad>('/evaluaciones/actividades')
export const evaluacionService = createCrudService<Evaluacion>('/evaluaciones/evaluaciones')
export const configuracionEvaluacionService = createCrudService<ConfiguracionEvaluacion>('/evaluaciones/configuracion')
