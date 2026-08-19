import apiClient from './api'
import type { ApiResponse } from '../types'
import type { IconName } from '../components/Icon'

export type AuthUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  rol: string | null
  is_admin: boolean
}

export type DashboardSummary = {
  stats: Array<{
    label: string
    value: number
    icon: IconName
    color: 'rose' | 'pink' | 'peach' | 'purple'
    trend: string
  }>
  summary: {
    periodoActual: string
    reservasAprobadas: number
    reservasPendientes: number
    evaluacionesHoy: number
  }
  recentActivity: Array<{
    id: number
    title: string
    description: string
    time: string
    icon: IconName
  }>
  nextClasses: Array<{
    name: string
    schedule: string
    room: string
  }>
  tasks: Array<{
    title: string
    due: string
    done: boolean
  }>
}

export const userService = {
  login: (email: string, password: string) =>
    apiClient.post<ApiResponse<{ user: AuthUser }>>('/login/', { email, password }),

  register: (data: { first_name: string; last_name: string; email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: AuthUser }>>('/register/', data),

  getDashboardSummary: () =>
    apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary/'),

  logout: async () => {
    localStorage.removeItem('user')
    try {
      await apiClient.post('/logout/')
    } catch {
      // Ignorar error de logout si el backend responde con 401
    }
    return Promise.resolve()
  },

  getCurrentUser: () =>
    apiClient.get<ApiResponse<{ user: AuthUser }>>('/me/'),

  requestPasswordReset: (email: string) =>
    apiClient.post<ApiResponse<null>>('/password-reset/', { email }),

  confirmPasswordReset: (token: string, password: string) =>
    apiClient.post<ApiResponse<null>>('/password-reset/confirm/', { token, password }),
}

export default userService
