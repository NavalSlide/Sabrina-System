interface CardProps {
  children: React.ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/90 backdrop-blur-sm rounded-2xl border border-rose-100 shadow-[0_12px_30px_rgba(251,113,133,0.08)] hover:shadow-[0_16px_35px_rgba(251,113,133,0.12)] transition-shadow ${className}`}>
      {children}
    </div>
  )
}
