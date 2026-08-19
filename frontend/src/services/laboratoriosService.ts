import { createCrudService } from './crud'
import type { EquipoLaboratorio, Laboratorio, SoftwareInstalado } from '../types'

export const laboratorioService = createCrudService<Laboratorio>('/laboratorios/laboratorios')
export const equipoLaboratorioService = createCrudService<EquipoLaboratorio>('/laboratorios/equipos')
export const softwareInstaladoService = createCrudService<SoftwareInstalado>('/laboratorios/softwares')
