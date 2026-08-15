import { useMemo, useState } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ProfessionalTaskForm } from '@/components/tasks/ProfessionalTaskForm'
import { ProfessionalTaskTable } from '@/components/tasks/ProfessionalTaskTable'
import { ProfessionalFilters, type ProfessionalFiltersState } from '@/components/tasks/ProfessionalFilters'
import { useProfessionalTasks } from '@/hooks/useProfessionalTasks'
import { useToast } from '@/contexts/ToastContext'
import type { ProfessionalTask } from '@/types'
import { getDeadlineState } from '@/utils/deadlineUtils'

const PRIORITY_ORDER = { urgente: 0, alta: 1, media: 2, baixa: 3 }

export default function Professional() {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleComplete } = useProfessionalTasks()
  const { showToast } = useToast()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<ProfessionalTask | null>(null)
  const [taskToDelete, setTaskToDelete] = useState<ProfessionalTask | null>(null)

  const [filters, setFilters] = useState<ProfessionalFiltersState>({
    search: '',
    statusFilter: 'todas',
    priorityFilter: '',
    responsibleFilter: '',
    requesterFilter: '',
    sortField: 'due_date',
  })

  const responsibles = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.responsible).filter(Boolean))) as string[],
    [tasks]
  )
  const requesters = useMemo(
    () => Array.from(new Set(tasks.map((t) => t.requester).filter(Boolean))) as string[],
    [tasks]
  )

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    if (filters.statusFilter === 'atrasadas') {
      result = result.filter((t) => getDeadlineState(t.due_date, t.status === 'concluida') === 'atrasada')
    } else if (filters.statusFilter !== 'todas') {
      result = result.filter((t) => t.status === filters.statusFilter)
    }

    if (filters.priorityFilter) result = result.filter((t) => t.priority === filters.priorityFilter)
    if (filters.responsibleFilter) result = result.filter((t) => t.responsible === filters.responsibleFilter)
    if (filters.requesterFilter) result = result.filter((t) => t.requester === filters.requesterFilter)

    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description ?? '').toLowerCase().includes(q) ||
          (t.requester ?? '').toLowerCase().includes(q) ||
          (t.responsible ?? '').toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      switch (filters.sortField) {
        case 'priority':
          return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
        case 'status':
          return a.status.localeCompare(b.status)
        case 'created_at':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'due_date':
        default:
          if (!a.due_date) return 1
          if (!b.due_date) return -1
          return a.due_date.localeCompare(b.due_date)
      }
    })

    return result
  }, [tasks, filters])

  function openCreate() {
    setEditingTask(null)
    setModalOpen(true)
  }

  function openEdit(task: ProfessionalTask) {
    setEditingTask(task)
    setModalOpen(true)
  }

  async function handleToggle(task: ProfessionalTask, completed: boolean) {
    const { error } = await toggleComplete(task, completed)
    if (error) showToast('error', error)
    else showToast('success', completed ? 'Demanda concluída.' : 'Demanda reaberta.')
  }

  async function handleDeleteConfirmed() {
    if (!taskToDelete) return
    const { error } = await deleteTask(taskToDelete.id)
    if (error) showToast('error', error)
    else showToast('info', 'Demanda excluída.')
    setTaskToDelete(null)
  }

  async function handleFormSubmit(input: Parameters<typeof createTask>[0]) {
    if (editingTask) {
      const result = await updateTask(editingTask.id, input)
      if (!result.error) showToast('success', 'Demanda atualizada.')
      return result
    }
    const result = await createTask(input)
    if (!result.error) showToast('success', 'Demanda criada.')
    return { error: result.error }
  }

  return (
    <AppLayout title="Profissional">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-navy-600">
            Controle de demandas, prazos, responsáveis e documentos do trabalho.
          </p>
          <Button onClick={openCreate}>+ Nova demanda</Button>
        </div>

        <ProfessionalFilters
          state={filters}
          onChange={setFilters}
          responsibles={responsibles}
          requesters={requesters}
        />

        {loading ? (
          <p className="text-sm text-navy-500">Carregando demandas…</p>
        ) : (
          <ProfessionalTaskTable
            tasks={filteredTasks}
            onToggleComplete={handleToggle}
            onEdit={openEdit}
            onDelete={setTaskToDelete}
          />
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Editar demanda' : 'Nova demanda'}
      >
        <ProfessionalTaskForm
          initial={editingTask}
          onSubmit={handleFormSubmit}
          onClose={() => setModalOpen(false)}
        />
      </Modal>

      <Modal
        open={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        title="Excluir demanda"
        footer={
          <>
            <Button variant="secondary" onClick={() => setTaskToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Excluir
            </Button>
          </>
        }
      >
        <p className="text-sm text-navy-700">
          Tem certeza que deseja excluir a demanda <strong>{taskToDelete?.title}</strong>? Esta ação não
          pode ser desfeita.
        </p>
      </Modal>
    </AppLayout>
  )
}
