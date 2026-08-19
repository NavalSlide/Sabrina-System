import { createCrudService } from './crud'
import type { BloqueHorario, Horario } from '../types'

export const bloqueHorarioService = createCrudService<BloqueHorario>('/horarios/bloques')
export const horarioService = createCrudService<Horario>('/horarios/horarios')
