import { Link } from 'react-router-dom'
import type { PersonalActivity } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { Card } from '@/components/ui/Card'
import { todayISO } from '@/utils/dateUtils'

export function TodayActivities({ activities }: { activities: PersonalActivity[] }) {
  const today = todayISO()
  const items = activities
    .filter((a) => a.date === today)
    .sort((a, b) => (a.start_time ?? '99').localeCompare(b.start_time ?? '99'))

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-lg text-navy-900">Atividades de hoje</h3>
        <Link to="/pessoal" className="text-xs text-accent-dim hover:underline">
          Ver agenda
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-navy-500">Nada programado para hoje.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {items.map((activity) => (
            <li key={activity.id} className="flex items-center justify-between text-sm">
              <span className={activity.status === 'concluida' ? 'text-navy-400 line-through' : 'text-navy-800'}>
                {activity.start_time ? `${activity.start_time.slice(0, 5)} — ` : ''}
                {activity.title}
              </span>
              <span className="text-xs text-navy-400">{CATEGORY_LABELS[activity.category]}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
