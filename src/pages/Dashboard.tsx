import { AppLayout } from '@/components/layout/AppLayout'
import { ProfessionalStats, PersonalStats } from '@/components/dashboard/StatsCards'
import { UpcomingDeadlines } from '@/components/dashboard/UpcomingDeadlines'
import { TodayActivities } from '@/components/dashboard/TodayActivities'
import { useProfessionalTasks } from '@/hooks/useProfessionalTasks'
import { usePersonalActivities } from '@/hooks/usePersonalActivities'
import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  const { tasks, loading: loadingTasks } = useProfessionalTasks()
  const { activities, loading: loadingActivities } = usePersonalActivities()

  const firstName = (user?.user_metadata?.full_name as string | undefined)?.split(' ')[0]

  return (
    <AppLayout title="Dashboard">
      <div className="flex flex-col gap-8">
        <p className="text-sm text-navy-600">
          {firstName ? `Olá, ${firstName}.` : 'Olá.'} Aqui está sua visão geral de hoje.
        </p>

        <section>
          <h2 className="eyebrow mb-3">Profissional</h2>
          {loadingTasks ? (
            <p className="text-sm text-navy-500">Carregando…</p>
          ) : (
            <ProfessionalStats tasks={tasks} />
          )}
        </section>

        <section>
          <h2 className="eyebrow mb-3">Pessoal</h2>
          {loadingActivities ? (
            <p className="text-sm text-navy-500">Carregando…</p>
          ) : (
            <PersonalStats activities={activities} />
          )}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UpcomingDeadlines tasks={tasks} activities={activities} />
          <TodayActivities activities={activities} />
        </section>
      </div>
    </AppLayout>
  )
}
