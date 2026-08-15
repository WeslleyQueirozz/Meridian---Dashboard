import { useState, type FormEvent } from 'react'
import type { PersonalActivity, PersonalCategory, Priority, PersonalStatus, RecurrenceType } from '@/types'
import { CATEGORY_LABELS, PRIORITY_LABELS, PERSONAL_STATUS_LABELS, RECURRENCE_LABELS, WEEKDAY_LABELS } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { todayISO } from '@/utils/dateUtils'
import type { PersonalActivityInput } from '@/hooks/usePersonalActivities'

interface Props {
  initial?: PersonalActivity | null
  defaultDate?: string
  onSubmit: (input: PersonalActivityInput) => Promise<{ error: string | null }>
  onClose: () => void
}

export function PersonalActivityForm({ initial, defaultDate, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState<PersonalCategory>(initial?.category ?? 'pessoal')
  const [date, setDate] = useState(initial?.date ?? defaultDate ?? todayISO())
  const [startTime, setStartTime] = useState(initial?.start_time ?? '')
  const [endTime, setEndTime] = useState(initial?.end_time ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'media')
  const [status, setStatus] = useState<PersonalStatus>(initial?.status ?? 'pendente')
  const [recurrence, setRecurrence] = useState<RecurrenceType>(initial?.recurrence ?? 'nenhuma')
  const [weekDays, setWeekDays] = useState<number[]>(initial?.recurrence_days ?? [])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function toggleWeekDay(day: number) {
    setWeekDays((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Informe o nome da atividade.')
      return
    }
    if (!date) {
      setError('Informe a data da atividade.')
      return
    }
    setError(null)
    setLoading(true)
    const { error } = await onSubmit({
      title: title.trim(),
      description: description.trim() || null,
      category,
      date,
      start_time: startTime || null,
      end_time: endTime || null,
      priority,
      status,
      recurrence,
      recurrence_days: recurrence === 'semanal' ? weekDays : null,
    })
    setLoading(false)
    if (error) setError(error)
    else onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input id="title" label="Nome da atividade" required value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        id="description"
        label="Descrição"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="category"
          label="Categoria"
          value={category}
          onChange={(e) => setCategory(e.target.value as PersonalCategory)}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Input id="date" label="Data" type="date" required value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="startTime"
          label="Horário inicial (opcional)"
          type="time"
          value={startTime ?? ''}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <Input
          id="endTime"
          label="Horário final (opcional)"
          type="time"
          value={endTime ?? ''}
          onChange={(e) => setEndTime(e.target.value)}
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
        <Select id="status" label="Status" value={status} onChange={(e) => setStatus(e.target.value as PersonalStatus)}>
          {Object.entries(PERSONAL_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>

      <Select
        id="recurrence"
        label="Repetir"
        value={recurrence}
        onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
        disabled={Boolean(initial)}
      >
        {Object.entries(RECURRENCE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
      {initial && (
        <p className="-mt-2 text-xs text-mist-300">A recorrência só pode ser definida na criação da atividade.</p>
      )}

      {recurrence === 'semanal' && (
        <div>
          <span className="mb-1.5 block text-sm font-medium text-navy-700">Dias da semana</span>
          <div className="flex flex-wrap gap-2">
            {WEEKDAY_LABELS.map((label, index) => (
              <button
                type="button"
                key={label}
                onClick={() => toggleWeekDay(index)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  weekDays.includes(index) ? 'bg-navy-800 text-white' : 'bg-mist-100 text-navy-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <span className="mb-1.5 block text-sm font-medium text-navy-700">Anexos</span>
        <FileUpload ownerType="personal_activity" ownerId={initial?.id ?? null} />
      </div>

      {error && <p className="text-sm text-status-late">{error}</p>}

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          {initial ? 'Salvar alterações' : 'Criar atividade'}
        </Button>
      </div>
    </form>
  )
}
