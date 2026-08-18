interface StatCardProps {
  label: string
  value: string
  icon: string
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

export default function StatCard({ label, value, icon, color, trend }: StatCardProps) {
  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${colorClasses[color]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium opacity-75">{label}</p>
          <p className="text-3xl font-bold mt-2 leading-none">{value}</p>
          {trend && <p className="mt-2 text-xs font-medium opacity-70">{trend}</p>}
        </div>
        <span className="text-3xl bg-white/60 rounded-xl p-2 shadow-sm">{icon}</span>
      </div>
    </div>
  )
}
