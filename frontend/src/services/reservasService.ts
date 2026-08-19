import apiClient from './api'
import { createCrudService } from './crud'
import type { RecursoReservable, Reserva } from '../types'

export const recursoReservableService = createCrudService<RecursoReservable>('/reservas/recursos')
export const reservaService = createCrudService<Reserva>('/reservas/reservas')

export const reservaActions = {
  aprobar: async (id: number) => (await apiClient.post<Reserva>(`/reservas/reservas/${id}/aprobar/`)).data,
  rechazar: async (id: number, motivo_rechazo: string) =>
    (await apiClient.post<Reserva>(`/reservas/reservas/${id}/rechazar/`, { motivo_rechazo })).data,
  cancelar: async (id: number) => (await apiClient.post<Reserva>(`/reservas/reservas/${id}/cancelar/`)).data,
}
