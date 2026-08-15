import { useMemo, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { PersonalActivityForm } from '@/components/personal/PersonalActivityForm'
import { AgendaList } from '@/components/personal/AgendaList'
import { CalendarView } from '@/components/personal/CalendarView'
import { StudyDashboard } from '@/components/personal/StudyDashboard'
import { PersonalFilters, type PersonalFiltersState } from '@/components/personal/PersonalFilters'
import { usePersonalActivities } from '@/hooks/usePersonalActivities'
import { useToast } from '@/contexts/ToastContext'
import type { PersonalActivity } from '@/types'
import { todayISO } from '@/utils/dateUtils'

export default function Personal() {
  const { activities, loading, createActivity, updateActivity, deleteActivity, toggleComplete } =
    usePersonalActivities()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingActivity, setEditingActivity] = useState<PersonalActivity | null>(null)
  const [activityToDelete, setActivityToDelete] = useState<PersonalActivity | null>(null)
  const [view, setView] = useState<'agenda' | 'calendario'>('agenda')

  const [filters, setFilters] = useState<PersonalFiltersState>({
    search: '',
    statusFilter: 'todas',
    categoryFilter: '',
  })

  const today = todayISO()

  const todayActivities = useMemo(
    () => activities.filter((a) => a.date === today).sort((a, b) => (a.start_time ?? '99').localeCompare(b.start_time ?? '99')),
    [activities, today]
  )

  const filteredActivities = useMemo(() => {
    let result = [...activities]
    if (filters.statusFilter !== 'todas') result = result.filter((a) => a.status === filters.statusFilter)
    if (filters.categoryFilter) result = result.filter((a) => a.category === filters.categoryFilter)
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (a) => a.title.toLowerCase().includes(q) || (a.description ?? '').toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => (a.date + (a.start_time ?? '')).localeCompare(b.date + (b.start_time ?? '')))
  }, [activities, filters])

  function openCreate() {
    setEditingActivity(null)
    setModalOpen(true)
  }

  function openEdit(activity: PersonalActivity) {
    setEditingActivity(activity)
    setModalOpen(true)
  }

  async function handleToggle(activity: PersonalActivity, completed: boolean) {
    const { error } = await toggleComplete(activity, completed)
    if (error) showToast('error', error)
    else showToast('success', completed ? 'Atividade concluída.' : 'Atividade reaberta.')
  }

  async function handleDeleteConfirmed() {
    if (!activityToDelete) return
    const { error } = await deleteActivity(activityToDelete.id)
    if (error) showToast('error', error)
    else showToast('info', 'Atividade excluída.')
    setActivityToDelete(null)
  }

  async function handleFormSubmit(input: Parameters<typeof createActivity>[0]) {
    if (editingActivity) {
      const result = await updateActivity(editingActivity.id, input)
      if (!result.error) showToast('success', 'Atividade atualizada.')
      return result
    }
    const result = await createActivity(input)
    if (!result.error) showToast('success', 'Atividade criada.')
    return result
  }

  return (
    <AppLayout title="Pessoal">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-navy-600">Agenda, tarefas e organização dos seus estudos e rotina.</p>
          <Button onClick={openCreate}>+ Nova atividade</Button>
        </div>

        <StudyDashboard activities={activities} />

        <div>
          <h3 className="mb-3 font-serif text-lg text-navy-900">Agenda de hoje</h3>
          <AgendaList
            activities={todayActivities}
            onToggleComplete={handleToggle}
            onEdit={openEdit}
            onDelete={setActivityToDelete}
            emptyLabel="Nenhuma atividade programada para hoje."
          />
        </div>

        <div className="flex gap-1 rounded-lg bg-mist-100 p-1 self-start">
          {(['agenda', 'calendario'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize ${
                view === v ? 'bg-white text-navy-900 shadow-sm' : 'text-navy-500'
              }`}
            >
              {v === 'agenda' ? 'Todas as atividades' : 'Calendário'}
            </button>
          ))}
        </div>

        {view === 'calendario' ? (
          <CalendarView activities={activities} onSelectActivity={openEdit} />
        ) : (
          <div className="flex flex-col gap-4">
            <PersonalFilters state={filters} onChange={setFilters} />
            {loading ? (
              <p className="text-sm text-navy-500">Carregando atividades…</p>
            ) : (
              <AgendaList
                activities={filteredActivities}
                onToggleComplete={handleToggle}
                onEdit={openEdit}
                onDelete={setActivityToDelete}
              />
            )}
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingActivity ? 'Editar atividade' : 'Nova atividade'}
      >
        <PersonalActivityForm
          initial={editingActivity}
          onSubmit={handleFormSubmit}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={Boolean(activityToDelete)}
        onClose={() => setActivityToDelete(null)}
        title="Excluir atividade"
        footer={
          <>
            <Button variant="secondary" onClick={() => setActivityToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Tem certeza que deseja excluir <strong>{activityToDelete?.title}</strong>? Esta ação não pode ser
          desfeita.
        </p>
      </Modal>
    </AppLayout>
  )
}
