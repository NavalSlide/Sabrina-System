import apiClient from './api'
import type { ApiResponse, PaginatedResponse } from '../types'

export interface CrudService<T> {
  list: (params?: Record<string, unknown>) => Promise<PaginatedResponse<T>>
  get: (id: number | string) => Promise<T>
  create: (payload: Partial<T>) => Promise<T>
  update: (id: number | string, payload: Partial<T>) => Promise<T>
  remove: (id: number | string) => Promise<void>
}

/** Builds a standard list/get/create/update/remove service for a DRF ModelViewSet
 * mounted at `basePath` (e.g. '/academico/especialidades/'). */
export function createCrudService<T>(basePath: string): CrudService<T> {
  const url = basePath.endsWith('/') ? basePath : `${basePath}/`

  return {
    async list(params) {
      const response = await apiClient.get<PaginatedResponse<T>>(url, { params })
      return response.data
    },
    async get(id) {
      const response = await apiClient.get<T>(`${url}${id}/`)
      return response.data
    },
    async create(payload) {
      const response = await apiClient.post<T>(url, payload)
      return response.data
    },
    async update(id, payload) {
      const response = await apiClient.patch<T>(`${url}${id}/`, payload)
      return response.data
    },
    async remove(id) {
      await apiClient.delete<ApiResponse<void>>(`${url}${id}/`)
    },
  }
}
