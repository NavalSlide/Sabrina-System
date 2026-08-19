import apiClient from './api'
import type { PaginatedResponse, RegistroAuditoria } from '../types'

export const auditoriaService = {
  list: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<PaginatedResponse<RegistroAuditoria>>('/auditoria/registros/', { params })
    return response.data
  },
}
