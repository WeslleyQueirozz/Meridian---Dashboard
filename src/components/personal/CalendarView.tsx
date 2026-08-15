import { useMemo, useState } from 'react'
import type { PersonalActivity } from '@/types'
import { CATEGORY_LABELS } from '@/types'
import {
  addDays,
  addMonths,
  formatISODate,
  getMonthGrid,
  monthLabel,
  parseISODate,
  todayISO,
  weekDates,
} from '@/utils/dateUtils'

type CalendarMode = 'hoje' | 'semana' | 'mes'

export function CalendarView({
  activities,
  onSelectActivity,
}: {
  activities: PersonalActivity[]
  onSelectActivity: (activity: PersonalActivity) => void
}) {
  const [mode, setMode] = useState<CalendarMode>('mes')
  const [referenceDate, setReferenceDate] = useState(todayISO())

  const activitiesByDate = useMemo(() => {
    const map = new Map<string, PersonalActivity[]>()
    for (const activity of activities) {
      const list = map.get(activity.date) ?? []
      list.push(activity)
      map.set(activity.date, list)
    }
    return map
  }, [activities])

  function navigate(direction: -1 | 1) {
    if (mode === 'mes') setReferenceDate(addMonths(referenceDate, direction))
    else if (mode === 'semana') setReferenceDate(addDays(referenceDate, direction * 7))
    else setReferenceDate(addDays(referenceDate, direction))
  }

  const referenceMonth = parseISODate(referenceDate).getMonth()

  const days =
    mode === 'mes' ? getMonthGrid(referenceDate) : mode === 'semana' ? weekDates(referenceDate) : [referenceDate]

  return (
    <div className="rounded-xl border border-mist-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="rounded-md p-1.5 text-navy-600 hover:bg-mist-100"
            aria-label="Anterior"
          >
            ‹
          </button>
          <span className="min-w-[10rem] text-center font-serif text-lg capitalize text-navy-900">
            {mode === 'mes' ? monthLabel(referenceDate) : formatISODate(parseISODate(referenceDate))}
          </span>
          <button
            onClick={() => navigate(1)}
            className="rounded-md p-1.5 text-navy-600 hover:bg-mist-100"
            aria-label="Próximo"
          >
            ›
          </button>
        </div>

        <div className="flex gap-1 rounded-lg bg-mist-100 p-1">
          {(['hoje', 'semana', 'mes'] as CalendarMode[]).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMode(m)
                if (m === 'hoje') setReferenceDate(todayISO())
              }}
              className={`rounded-md px-3 py-1 text-xs font-medium capitalize ${
                mode === m ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {mode === 'hoje' ? (
        <DayColumn date={days[0]} activities={activitiesByDate.get(days[0]) ?? []} onSelect={onSelectActivity} />
      ) : (
        <div className="grid grid-cols-7 gap-1.5 text-xs sm:gap-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((d) => (
            <div key={d} className="pb-1 text-center font-medium text-navy-500">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dayActivities = activitiesByDate.get(day) ?? []
            const isToday = day === todayISO()
            const isOtherMonth = mode === 'mes' && parseISODate(day).getMonth() !== referenceMonth
            return (
              <div
                key={day}
                className={`min-h-[5.5rem] rounded-lg border p-1.5 sm:min-h-[6.5rem] ${
                  isToday ? 'border-accent bg-accent/5' : 'border-mist-200'
                } ${isOtherMonth ? 'opacity-40' : ''}`}
              >
                <span className={`text-[0.7rem] ${isToday ? 'font-semibold text-accent-dim' : 'text-navy-500'}`}>
                  {parseISODate(day).getDate()}
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {dayActivities.slice(0, 3).map((activity) => (
                    <button
                      key={activity.id}
                      onClick={() => onSelectActivity(activity)}
                      className={`w-full truncate rounded px-1 py-0.5 text-left text-[0.68rem] ${
                        activity.status === 'concluida'
                          ? 'bg-status-done/10 text-status-done line-through'
                          : 'bg-accent/10 text-accent-dim'
                      }`}
                      title={activity.title}
                    >
                      {activity.start_time ? `${activity.start_time.slice(0, 5)} ` : ''}
                      {activity.title}
                    </button>
                  ))}
                  {dayActivities.length > 3 && (
                    <span className="text-[0.65rem] text-navy-400">+{dayActivities.length - 3} mais</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function DayColumn({
  date,
  activities,
  onSelect,
}: {
  date: string
  activities: PersonalActivity[]
  onSelect: (activity: PersonalActivity) => void
}) {
  if (activities.length === 0) {
    return <p className="py-6 text-center text-sm text-navy-500">Nenhuma atividade programada para este dia.</p>
  }
  const sorted = [...activities].sort((a, b) => (a.start_time ?? '99:99').localeCompare(b.start_time ?? '99:99'))
  return (
    <ul className="flex flex-col gap-2">
      {sorted.map((activity) => (
        <li key={activity.id}>
          <button
            onClick={() => onSelect(activity)}
            className={`flex w-full items-center justify-between rounded-lg border border-mist-200 px-3 py-2.5 text-left hover:bg-mist-50 ${
              activity.status === 'concluida' ? 'opacity-60' : ''
            }`}
          >
            <span className={activity.status === 'concluida' ? 'line-through' : ''}>
              {activity.start_time ? `${activity.start_time.slice(0, 5)} — ` : ''}
              {activity.title}
            </span>
            <span className="text-xs text-navy-500">{CATEGORY_LABELS[activity.category]}</span>
          </button>
        </li>
      ))}
    </ul>
  )
}
