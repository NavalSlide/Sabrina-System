import apiClient from './api'
import type { User, ApiResponse } from '../types'

export type AuthUser = {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
}

export type DashboardSummary = {
  stats: Array<{
    label: string
    value: number
    icon: string
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
    icon: string
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

  updateProfile: (data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>('/users/me', data),

  getUsers: (page: number = 1, pageSize: number = 10) =>
    apiClient.get<ApiResponse<User[]>>('/users', { params: { page, pageSize } }),

  getUserById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`),

  createUser: (data: Partial<User>) =>
    apiClient.post<ApiResponse<User>>('/users', data),

  updateUser: (id: string, data: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/users/${id}`, data),

  deleteUser: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/users/${id}`),
}

export default userService
