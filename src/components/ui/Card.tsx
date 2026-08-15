import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-mist-200 bg-white p-5 shadow-soft ${className}`}>
      {children}
    </div>
  )
}

export function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string
  value: number | string
  tone?: 'default' | 'late' | 'warn' | 'done' | 'progress'
}) {
  const toneClasses: Record<string, string> = {
    default: 'text-navy-900',
    late: 'text-status-late',
    warn: 'text-status-warn',
    done: 'text-status-done',
    progress: 'text-accent',
  }
  return (
    <Card className="flex flex-col gap-1">
      <span className="eyebrow">{label}</span>
      <span className={`text-3xl font-semibold ${toneClasses[tone]}`}>{value}</span>
    </Card>
  )
}

export function Badge({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  )
}
