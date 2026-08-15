import { Link } from 'react-router-dom'
import type { ProfessionalTask, PersonalActivity } from '@/types'
import { Card, Badge } from '@/components/ui/Card'
import { formatDateBR, todayISO } from '@/utils/dateUtils'
import { getDeadlineState, DEADLINE_CLASSES, DEADLINE_LABELS } from '@/utils/deadlineUtils'

interface UpcomingItem {
  id: string
  title: string
  date: string
  type: 'profissional' | 'pessoal'
}

export function UpcomingDeadlines({
  tasks,
  activities,
}: {
  tasks: ProfessionalTask[]
  activities: PersonalActivity[]
}) {
  const today = todayISO()

  const taskItems: UpcomingItem[] = tasks
    .filter((t) => t.status !== 'concluida' && t.due_date)
    .map((t) => ({ id: t.id, title: t.title, date: t.due_date as string, type: 'profissional' }))

  const activityItems: UpcomingItem[] = activities
    .filter((a) => a.status !== 'concluida' && a.date >= today)
    .map((a) => ({ id: a.id, title: a.title, date: a.date, type: 'pessoal' }))

  const items = [...taskItems, ...activityItems].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8)

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-lg text-navy-900">Próximos prazos</h3>
        <div className="flex gap-2 text-xs">
          <Link to="/profissional" className="text-accent-dim hover:underline">
            Profissional
          </Link>
          <Link to="/pessoal" className="text-accent-dim hover:underline">
            Pessoal
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-navy-500">Nenhum prazo próximo. Você está em dia.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const state = getDeadlineState(item.date, false)
            return (
              <li key={`${item.type}-${item.id}`} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate text-navy-800">{item.title}</p>
                  <span className="text-xs text-navy-400 capitalize">{item.type}</span>
                </div>
                <div className="flex flex-shrink-0 items-center gap-2">
                  <span className="text-xs text-navy-500">{formatDateBR(item.date)}</span>
                  <Badge className={DEADLINE_CLASSES[state]}>{DEADLINE_LABELS[state]}</Badge>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Card>
  )
}
