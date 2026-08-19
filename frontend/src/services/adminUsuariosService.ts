import apiClient from './api'
import { createCrudService } from './crud'
import type { PaginatedResponse, Permiso, Rol, RolPermiso, Usuario, UsuarioDirectorio } from '../types'

export const rolService = createCrudService<Rol>('/usuarios/roles')
export const permisoService = createCrudService<Permiso>('/usuarios/permisos')
export const rolPermisoService = createCrudService<RolPermiso>('/usuarios/roles-permisos')
export const usuarioAdminService = createCrudService<Usuario>('/usuarios')

export const usuarioDirectorioService = {
  list: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<PaginatedResponse<UsuarioDirectorio>>('/usuarios/directorio/', { params })
    return response.data
  },
}
