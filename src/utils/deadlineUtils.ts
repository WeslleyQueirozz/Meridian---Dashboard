import { daysBetween, todayISO } from './dateUtils'

export type DeadlineState = 'sem_prazo' | 'concluida' | 'atrasada' | 'proxima' | 'normal'

const DIAS_ALERTA_PROXIMO = 2

/**
 * Calcula o estado do prazo comparando a data atual com o prazo final.
 * Nunca depende de o usuário marcar manualmente uma demanda como atrasada.
 */
export function getDeadlineState(dueDate: string | null, isCompleted: boolean): DeadlineState {
  if (isCompleted) return 'concluida'
  if (!dueDate) return 'sem_prazo'

  const diff = daysBetween(todayISO(), dueDate)

  if (diff < 0) return 'atrasada'
  if (diff <= DIAS_ALERTA_PROXIMO) return 'proxima'
  return 'normal'
}

export const DEADLINE_LABELS: Record<DeadlineState, string> = {
  sem_prazo: 'Sem prazo',
  concluida: 'Concluída',
  atrasada: 'Atrasada',
  proxima: 'Prazo próximo',
  normal: 'No prazo',
}

export const DEADLINE_CLASSES: Record<DeadlineState, string> = {
  sem_prazo: 'bg-mist-200 text-navy-700',
  concluida: 'bg-status-done/10 text-status-done',
  atrasada: 'bg-status-late/10 text-status-late',
  proxima: 'bg-status-warn/10 text-status-warn',
  normal: 'bg-accent/10 text-accent-dim',
}
