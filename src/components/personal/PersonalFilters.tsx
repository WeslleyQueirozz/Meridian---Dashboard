import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { CATEGORY_LABELS } from '@/types'

export type PersonalStatusFilter = 'todas' | 'pendente' | 'em_andamento' | 'concluida'

export interface PersonalFiltersState {
  search: string
  statusFilter: PersonalStatusFilter
  categoryFilter: string
}

const statusOptions: { value: PersonalStatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'pendente', label: 'Pendentes' },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluídas' },
]

export function PersonalFilters({
  state,
  onChange,
}: {
  state: PersonalFiltersState
  onChange: (state: PersonalFiltersState) => void
}) {
  function set<K extends keyof PersonalFiltersState>(key: K, value: PersonalFiltersState[K]) {
    onChange({ ...state, [key]: value })
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-mist-200 bg-white p-4 shadow-soft">
      <Input
        placeholder="Pesquisar atividades…"
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
      <Select value={state.categoryFilter} onChange={(e) => set('categoryFilter', e.target.value)}>
        <option value="">Categoria (todas)</option>
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </div>
  )
}
