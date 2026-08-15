import { useMemo } from 'react'
import type { PersonalActivity } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import { Card } from '@/components/ui/Card'
import { startOfWeek, todayISO } from '@/utils/dateUtils'

const STUDY_CATEGORIES = ['aws_cloud', 'ingles', 'espanhol', 'programacao', 'estudos', 'curso'] as const

export function StudyDashboard({ activities }: { activities: PersonalActivity[] }) {
  const studyActivities = useMemo(
    () => activities.filter((a) => (STUDY_CATEGORIES as readonly string[]).includes(a.category)),
    [activities]
  )

  const today = todayISO()
  const weekStart = startOfWeek(today)

  const completed = studyActivities.filter((a) => a.status === 'concluida').length
  const pending = studyActivities.filter((a) => a.status !== 'concluida').length
  const todayCount = studyActivities.filter((a) => a.date === today).length
  const weekCount = studyActivities.filter((a) => a.date >= weekStart).length

  const byCategory = useMemo(() => {
    const map = new Map<string, number>()
    for (const activity of studyActivities) {
      if (activity.status !== 'concluida') continue
      map.set(activity.category, (map.get(activity.category) ?? 0) + 1)
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1])
  }, [studyActivities])

  return (
    <Card>
      <h3 className="font-serif text-lg text-navy-900">Estudos</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="Concluídas" value={completed} />
        <MiniStat label="Pendentes" value={pending} />
        <MiniStat label="Hoje" value={todayCount} />
        <MiniStat label="Esta semana" value={weekCount} />
      </div>

      {byCategory.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          {byCategory.map(([category, count]) => (
            <div key={category} className="flex items-center justify-between text-sm">
              <span className="text-navy-700">{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS]}</span>
              <span className="font-medium text-navy-900">{count} concluídas</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-mist-50 px-3 py-2.5">
      <p className="text-xl font-semibold text-navy-900">{value}</p>
      <p className="text-xs text-navy-500">{label}</p>
    </div>
  )
}
