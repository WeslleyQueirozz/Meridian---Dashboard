import type { RecurrenceType } from '@/types'
import { addDays, addMonths, weekdayIndex } from './dateUtils'

const HORIZON_DIAS = 90 // janela de geração de ocorrências futuras

/**
 * Gera as datas (ISO) de ocorrência de uma atividade recorrente a partir da data inicial,
 * dentro de uma janela de HORIZON_DIAS. Usado para criar múltiplos registros ligados por
 * recurrence_group_id, já que o Supabase armazena cada ocorrência como uma linha própria
 * (facilita concluir/editar uma ocorrência isoladamente sem afetar as demais).
 */
export function generateOccurrences(
  startDate: string,
  recurrence: RecurrenceType,
  weekDays: number[] | null
): string[] {
  if (recurrence === 'nenhuma') return [startDate]

  const limit = addDays(startDate, HORIZON_DIAS)
  const dates: string[] = []
  let cursor = startDate

  if (recurrence === 'diaria') {
    while (cursor <= limit) {
      dates.push(cursor)
      cursor = addDays(cursor, 1)
    }
  } else if (recurrence === 'semanal') {
    const days = weekDays && weekDays.length > 0 ? weekDays : [weekdayIndex(startDate)]
    while (cursor <= limit) {
      if (days.includes(weekdayIndex(cursor))) {
        dates.push(cursor)
      }
      cursor = addDays(cursor, 1)
    }
  } else if (recurrence === 'mensal') {
    while (cursor <= limit) {
      dates.push(cursor)
      cursor = addMonths(cursor, 1)
    }
  }

  return dates.length > 0 ? dates : [startDate]
}
