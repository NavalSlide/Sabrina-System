import { createContext } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastContextValue {
  push: (message: string, type?: ToastType) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
