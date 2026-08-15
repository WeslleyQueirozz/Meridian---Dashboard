import type { PersonalActivity } from '@/types'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/types'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Card'

const priorityClasses: Record<string, string> = {
  baixa: 'bg-mist-200 text-navy-700',
  media: 'bg-accent/10 text-accent-dim',
  alta: 'bg-status-warn/10 text-status-warn',
  urgente: 'bg-status-late/10 text-status-late',
}

interface Props {
  activities: PersonalActivity[]
  onToggleComplete: (activity: PersonalActivity, completed: boolean) => void
  onEdit: (activity: PersonalActivity) => void
  onDelete: (activity: PersonalActivity) => void
  emptyLabel?: string
}

export function AgendaList({ activities, onToggleComplete, onEdit, onDelete, emptyLabel }: Props) {
  if (activities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-mist-300 bg-white px-6 py-10 text-center">
        <p className="text-sm text-navy-500">{emptyLabel ?? 'Nada programado.'}</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {activities.map((activity) => {
        const completed = activity.status === 'concluida'
        return (
          <li
            key={activity.id}
            className={`flex items-center justify-between gap-3 rounded-xl border border-mist-200 bg-white px-4 py-3 shadow-soft ${
              completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex min-w-0 items-center gap-3">
              <Checkbox
                checked={completed}
                onChange={(e) => onToggleComplete(activity, e.target.checked)}
                aria-label="Marcar como concluída"
              />
              <div className="min-w-0">
                <p className={`truncate font-medium text-navy-900 ${completed ? 'line-through' : ''}`}>
                  {activity.start_time ? `${activity.start_time.slice(0, 5)} — ` : ''}
                  {activity.title}
                </p>
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-navy-500">
                  <span>{CATEGORY_LABELS[activity.category]}</span>
                  <Badge className={priorityClasses[activity.priority]}>{PRIORITY_LABELS[activity.priority]}</Badge>
                </div>
              </div>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              <button
                onClick={() => onEdit(activity)}
                className="rounded-md px-2 py-1 text-xs font-medium text-accent-dim hover:bg-accent/10"
              >
                Editar
              </button>
              <button
                onClick={() => onDelete(activity)}
                className="rounded-md px-2 py-1 text-xs font-medium text-status-late hover:bg-status-late/10"
              >
                Excluir
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
