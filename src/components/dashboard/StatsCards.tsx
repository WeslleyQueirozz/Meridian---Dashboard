import { StatCard } from '@/components/ui/Card'
import type { ProfessionalTask, PersonalActivity } from '@/types'
import { getDeadlineState } from '@/utils/deadlineUtils'
import { todayISO } from '@/utils/dateUtils'

export function ProfessionalStats({ tasks }: { tasks: ProfessionalTask[] }) {
  const total = tasks.length
  const pendentes = tasks.filter((t) => t.status === 'pendente').length
  const emAndamento = tasks.filter((t) => t.status === 'em_andamento').length
  const concluidas = tasks.filter((t) => t.status === 'concluida').length
  const atrasadas = tasks.filter((t) => getDeadlineState(t.due_date, t.status === 'concluida') === 'atrasada').length

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Total de demandas" value={total} />
      <StatCard label="Pendentes" value={pendentes} />
      <StatCard label="Em andamento" value={emAndamento} tone="progress" />
      <StatCard label="Concluídas" value={concluidas} tone="done" />
      <StatCard label="Atrasadas" value={atrasadas} tone="late" />
    </div>
  )
}

export function PersonalStats({ activities }: { activities: PersonalActivity[] }) {
  const today = todayISO()
  const todayActivities = activities.filter((a) => a.date === today)
  const pendencias = activities.filter((a) => a.status !== 'concluida').length
  const concluidasHoje = todayActivities.filter((a) => a.status === 'concluida').length
  const proximas = activities.filter((a) => a.date > today && a.status !== 'concluida').length

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard label="Atividades de hoje" value={todayActivities.length} />
      <StatCard label="Pendências" value={pendencias} />
      <StatCard label="Concluídas hoje" value={concluidasHoje} tone="done" />
      <StatCard label="Próximas atividades" value={proximas} tone="progress" />
    </div>
  )
}
