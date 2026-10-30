import { ArrowUpRight } from 'lucide-react'

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  color = 'blue',
}) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            colors[color] || colors.blue
          }`}
        >
          {Icon && <Icon size={22} />}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
        <ArrowUpRight size={15} className="shrink-0" />
        <span>{description}</span>
      </div>
    </div>
  )
}