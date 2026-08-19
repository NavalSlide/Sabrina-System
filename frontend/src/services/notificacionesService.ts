import apiClient from './api'
import type { ApiResponse, ConfiguracionNotificacion, Mensaje, Notificacion, PaginatedResponse } from '../types'

export const notificacionService = {
  list: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<PaginatedResponse<Notificacion>>('/notificaciones/notificaciones/', { params })
    return response.data
  },
  remove: async (id: number) => {
    await apiClient.delete<ApiResponse<void>>(`/notificaciones/notificaciones/${id}/`)
  },
  marcarLeida: async (id: number) => (await apiClient.post<Notificacion>(`/notificaciones/notificaciones/${id}/marcar_leida/`)).data,
  marcarTodasLeidas: async () => apiClient.post('/notificaciones/notificaciones/marcar_todas_leidas/'),
}

export const configuracionNotificacionService = {
  mia: async () => (await apiClient.get<ConfiguracionNotificacion>('/notificaciones/configuracion/mia/')).data,
  update: async (id: number, payload: Partial<ConfiguracionNotificacion>) =>
    (await apiClient.patch<ConfiguracionNotificacion>(`/notificaciones/configuracion/${id}/`, payload)).data,
}

export const mensajeService = {
  list: async (params?: Record<string, unknown>) => {
    const response = await apiClient.get<PaginatedResponse<Mensaje>>('/notificaciones/mensajes/', { params })
    return response.data
  },
  create: async (payload: { receptor: number; mensaje: string }) =>
    (await apiClient.post<Mensaje>('/notificaciones/mensajes/', payload)).data,
  marcarLeido: async (id: number) => (await apiClient.post<Mensaje>(`/notificaciones/mensajes/${id}/marcar_leido/`)).data,
}
