import { createCrudService } from './crud'
import type { AsignacionDocente, Docente, DisponibilidadDocente, DocenteLaboratorioAutorizado, DocenteMateriaAutorizada } from '../types'

export const docenteService = createCrudService<Docente>('/docentes/docentes')
export const disponibilidadDocenteService = createCrudService<DisponibilidadDocente>('/docentes/disponibilidad')
export const asignacionDocenteService = createCrudService<AsignacionDocente>('/docentes/asignaciones')
export const docenteMateriaAutorizadaService = createCrudService<DocenteMateriaAutorizada>('/docentes/materias-autorizadas')
export const docenteLaboratorioAutorizadoService = createCrudService<DocenteLaboratorioAutorizado>('/docentes/laboratorios-autorizados')
