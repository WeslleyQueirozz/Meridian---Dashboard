import type { ProfessionalTask } from '@/types'
import { PRIORITY_LABELS, PROFESSIONAL_STATUS_LABELS } from '@/types'
import { Checkbox } from '@/components/ui/Checkbox'
import { Badge } from '@/components/ui/Card'
import { formatDateBR } from '@/utils/dateUtils'
import { getDeadlineState, DEADLINE_LABELS, DEADLINE_CLASSES } from '@/utils/deadlineUtils'

const priorityClasses: Record<string, string> = {
  baixa: 'bg-mist-200 text-navy-700',
  media: 'bg-accent/10 text-accent-dim',
  alta: 'bg-status-warn/10 text-status-warn',
  urgente: 'bg-status-late/10 text-status-late',
}

interface Props {
  tasks: ProfessionalTask[]
  onToggleComplete: (task: ProfessionalTask, completed: boolean) => void
  onEdit: (task: ProfessionalTask) => void
  onDelete: (task: ProfessionalTask) => void
}

export function ProfessionalTaskTable({ tasks, onToggleComplete, onEdit, onDelete }: Props) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-mist-300 bg-white px-6 py-14 text-center">
        <p className="font-serif text-lg text-navy-800">Nenhuma demanda encontrada.</p>
        <p className="mt-1 text-sm text-navy-500">Ajuste os filtros ou cadastre uma nova demanda.</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-mist-200 bg-white shadow-soft lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-mist-200 bg-mist-50 text-xs uppercase tracking-wide text-navy-500">
            <tr>
              <th className="px-4 py-3 font-medium"></th>
              <th className="px-4 py-3 font-medium">Demanda</th>
              <th className="px-4 py-3 font-medium">Solicitante</th>
              <th className="px-4 py-3 font-medium">Responsável</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Prazo</th>
              <th className="px-4 py-3 font-medium">Prioridade</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const deadlineState = getDeadlineState(task.due_date, task.status === 'concluida')
              const completed = task.status === 'concluida'
              return (
                <tr
                  key={task.id}
                  className={`border-b border-mist-100 last:border-0 hover:bg-mist-50/60 ${
                    completed ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={completed}
                      onChange={(e) => onToggleComplete(task, e.target.checked)}
                      aria-label="Marcar como concluída"
                    />
                  </td>
                  <td className={`px-4 py-3 font-medium text-navy-900 ${completed ? 'line-through' : ''}`}>
                    {task.title}
                  </td>
                  <td className="px-4 py-3 text-navy-600">{task.requester || '—'}</td>
                  <td className="px-4 py-3 text-navy-600">{task.responsible || '—'}</td>
                  <td className="px-4 py-3 text-navy-600">{formatDateBR(task.start_date)}</td>
                  <td className="px-4 py-3 text-navy-600">
                    <div className="flex flex-col gap-1">
                      <span>{formatDateBR(task.due_date)}</span>
                      <Badge className={DEADLINE_CLASSES[deadlineState]}>{DEADLINE_LABELS[deadlineState]}</Badge>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={priorityClasses[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-navy-600">{PROFESSIONAL_STATUS_LABELS[task.status]}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-accent-dim hover:bg-accent/10"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="rounded-md px-2 py-1 text-xs font-medium text-status-late hover:bg-status-late/10"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden">
        {tasks.map((task) => {
          const deadlineState = getDeadlineState(task.due_date, task.status === 'concluida')
          const completed = task.status === 'concluida'
          return (
            <div
              key={task.id}
              className={`rounded-xl border border-mist-200 bg-white p-4 shadow-soft ${completed ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={completed}
                    onChange={(e) => onToggleComplete(task, e.target.checked)}
                    aria-label="Marcar como concluída"
                  />
                  <div>
                    <p className={`font-medium text-navy-900 ${completed ? 'line-through' : ''}`}>{task.title}</p>
                    <p className="text-xs text-navy-500">
                      {task.requester ? `Solicitado por ${task.requester}` : 'Sem solicitante'}
                    </p>
                  </div>
                </div>
                <Badge className={priorityClasses[task.priority]}>{PRIORITY_LABELS[task.priority]}</Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-navy-600">
                <span>Prazo: {formatDateBR(task.due_date)}</span>
                <Badge className={DEADLINE_CLASSES[deadlineState]}>{DEADLINE_LABELS[deadlineState]}</Badge>
                <span>· {PROFESSIONAL_STATUS_LABELS[task.status]}</span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => onEdit(task)}
                  className="rounded-md bg-mist-100 px-3 py-1.5 text-xs font-medium text-accent-dim"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="rounded-md bg-mist-100 px-3 py-1.5 text-xs font-medium text-status-late"
                >
                  Excluir
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
