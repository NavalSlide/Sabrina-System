import Icon, { type IconName } from './Icon'

interface StatCardProps {
  label: string
  value: string
  icon: IconName
  color: 'rose' | 'pink' | 'peach' | 'purple' | 'lavender'
  trend?: string
}

const colorClasses = {
  rose: 'bg-rose-50 text-rose-700 border-rose-200',
  pink: 'bg-pink-50 text-pink-700 border-pink-200',
  peach: 'bg-orange-50 text-orange-700 border-orange-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
  lavender: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
}

const iconBadgeClasses = {
  rose: 'bg-rose-500 text-white',
  pink: 'bg-pink-500 text-white',
  peach: 'bg-orange-400 text-white',
  purple: 'bg-violet-500 text-white',
  lavender: 'bg-fuchsia-500 text-white',
}

export default function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className={`group p-5 rounded-2xl border shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${colorClasses[color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-black mt-2 leading-none tracking-tight">{value}</p>
          {trend && <p className="mt-2 text-xs font-medium opacity-70">{trend}</p>}
        </div>
        <span className={`rounded-xl p-2.5 shadow-sm transition-transform group-hover:scale-105 ${iconBadgeClasses[color]}`}>
          <Icon name={icon} size={22} strokeWidth={1.8} />
        </span>
      </div>
    </div>
  )
}
