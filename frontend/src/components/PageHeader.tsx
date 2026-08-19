import Icon, { type IconName } from './Icon'

interface PageHeaderProps {
  icon: IconName
  eyebrow: string
  title: string
  description: string
}

export default function PageHeader({ icon, eyebrow, title, description }: PageHeaderProps) {
  return (
    <div className="flex items-start gap-4 animate-riseIn">
      <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 text-white shadow-lg shadow-rose-200/70">
        <Icon name={icon} size={26} strokeWidth={1.6} />
      </div>
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-rose-400">{eyebrow}</p>
        <h1 className="text-3xl font-black text-slate-800">{title}</h1>
        <p className="text-slate-500 mt-1">{description}</p>
      </div>
    </div>
  )
}
