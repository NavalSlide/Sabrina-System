import type { ReactNode } from 'react'
import Icon from './Icon'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  maxWidth?: string
}

export default function Modal({ open, title, onClose, children, maxWidth = 'max-w-lg' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-overlayIn" onClick={onClose} />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-[28px] shadow-[0_25px_60px_rgba(190,24,93,0.25)] border border-rose-100 max-h-[90vh] overflow-y-auto animate-modalIn`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-rose-100 sticky top-0 bg-white rounded-t-[28px]">
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
            aria-label="Cerrar"
          >
            <Icon name="x-circle" size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
