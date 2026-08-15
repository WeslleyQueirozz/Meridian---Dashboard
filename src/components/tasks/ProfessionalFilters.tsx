import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PRIORITY_LABELS } from '@/types'

export type StatusFilter = 'todas' | 'pendente' | 'em_andamento' | 'concluida' | 'atrasadas'
export type SortField = 'due_date' | 'created_at' | 'priority' | 'status'

export interface ProfessionalFiltersState {
  search: string
  statusFilter: StatusFilter
  priorityFilter: string
  responsibleFilter: string
  requesterFilter: string
  sortField: SortField
}

interface Props {
  state: ProfessionalFiltersState
  onChange: (state: ProfessionalFiltersState) => void
  responsibles: string[]
  requesters: string[]
}

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluídas' },
  { value: 'atrasadas', label: 'Atrasadas' },
]

export function ProfessionalFilters({ state, onChange, responsibles, requesters }: Props) {
  function set<K extends keyof ProfessionalFiltersState>(key: K, value: ProfessionalFiltersState[K]) {
    onChange({ ...state, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-mist-200 bg-white p-4 shadow-soft">
      <Input
        placeholder="Pesquisar por demanda, descrição, solicitante ou responsável…"
        value={state.search}
        onChange={(e) => set('search', e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => set('statusFilter', opt.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              state.statusFilter === opt.value
                ? 'bg-navy-800 text-white'
                : 'bg-mist-100 text-navy-600 hover:bg-mist-200'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Select value={state.priorityFilter} onChange={(e) => set('priorityFilter', e.target.value)}>
          <option value="">Prioridade (todas)</option>
          {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        <Select value={state.responsibleFilter} onChange={(e) => set('responsibleFilter', e.target.value)}>
          <option value="">Responsável (todos)</option>
          {responsibles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Select value={state.requesterFilter} onChange={(e) => set('requesterFilter', e.target.value)}>
          <option value="">Solicitante (todos)</option>
          {requesters.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>

        <Select value={state.sortField} onChange={(e) => set('sortField', e.target.value as SortField)}>
          <option value="due_date">Ordenar por prazo</option>
          <option value="created_at">Ordenar por criação</option>
          <option value="priority">Ordenar por prioridade</option>
          <option value="status">Ordenar por status</option>
        </Select>
      </div>
    </div>
  )
}
