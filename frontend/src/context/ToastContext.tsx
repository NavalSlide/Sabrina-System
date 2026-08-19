import { useCallback, useState, type ReactNode } from 'react'
import Icon, { type IconName } from '../components/Icon'
import { ToastContext, type ToastType } from './toastStore'

interface Toast {
  id: number
  message: string
  type: ToastType
}

let nextId = 1

const styles: Record<ToastType, string> = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
  error: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-violet-50 border-violet-200 text-violet-700',
}

const iconBadge: Record<ToastType, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-red-500 text-white',
  info: 'bg-violet-500 text-white',
}

const icons: Record<ToastType, IconName> = {
  success: 'check-circle',
  error: 'x-circle',
  info: 'info-circle',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm animate-fadeIn ${styles[toast.type]}`}
          >
            <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${iconBadge[toast.type]}`}>
              <Icon name={icons[toast.type]} size={14} strokeWidth={2.2} />
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
