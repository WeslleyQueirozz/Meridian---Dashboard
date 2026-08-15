import { useState, type FormEvent } from 'react'
import type { ProfessionalTask, Priority, ProfessionalStatus } from '@/types'
import { PRIORITY_LABELS, PROFESSIONAL_STATUS_LABELS } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import type { ProfessionalTaskInput } from '@/hooks/useProfessionalTasks'

interface Props {
  initial?: ProfessionalTask | null
  onSubmit: (input: ProfessionalTaskInput) => Promise<{ error: string | null }>
  onClose: () => void
}

export function ProfessionalTaskForm({ initial, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [requester, setRequester] = useState(initial?.requester ?? '')
  const [responsible, setResponsible] = useState(initial?.responsible ?? '')
  const [startDate, setStartDate] = useState(initial?.start_date ?? '')
  const [dueDate, setDueDate] = useState(initial?.due_date ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'media')
  const [status, setStatus] = useState<ProfessionalStatus>(initial?.status ?? 'pendente')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Informe o nome da demanda.')
      return
    }
    setError(null)
    setLoading(true)
    const { error } = await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      requester: requester.trim() || null,
      responsible: responsible.trim() || null,
      start_date: startDate || null,
      due_date: dueDate || null,
      priority,
      status,
    })
    setLoading(false)
    if (error) setError(error)
    else onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="title" label="Nome da demanda" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        id="description"
        label="Descrição"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="requester"
          label="Solicitante"
          value={requester}
          onChange={(e) => setRequester(e.target.value)}
        />
        <Input
          id="responsible"
          label="Responsável"
          value={responsible}
          onChange={(e) => setResponsible(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startDate"
          label="Data de início"
          type="date"
          value={startDate ?? ''}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          id="dueDate"
          label="Prazo final"
          type="date"
          value={dueDate ?? ''}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select id="priority" label="Prioridade" value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value as ProfessionalStatus)}>
          {Object.entries(PROFESSIONAL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium text-navy-700">Anexos</span>
        <FileUpload ownerType="professional_task" ownerId={initial?.id ?? null} />
      </div>

      {error && <p className="text-sm text-status-late">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Salvar alterações' : 'Criar demanda'}
        </Button>
      </div>
    </form>
  )
}
