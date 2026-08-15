export function todayISO(): string {
  return formatISODate(new Date())
}

export function formatISODate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function formatDateBR(iso: string | null): string {
  if (!iso) return '—'
  const date = parseISODate(iso)
  return date.toLocaleDateString('pt-BR')
}

export function formatDateTimeShort(iso: string | null): string {
  if (!iso) return '—'
  const date = new Date(iso)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function addDays(iso: string, days: number): string {
  const date = parseISODate(iso)
  date.setDate(date.getDate() + days)
  return formatISODate(date)
}

export function addMonths(iso: string, months: number): string {
  const date = parseISODate(iso)
  date.setMonth(date.getMonth() + months)
  return formatISODate(date)
}

export function isSameDay(isoA: string, isoB: string): boolean {
  return isoA === isoB
}

export function daysBetween(fromISO: string, toISO: string): number {
  const from = parseISODate(fromISO)
  const to = parseISODate(toISO)
  const ms = to.getTime() - from.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

export function startOfWeek(iso: string): string {
  const date = parseISODate(iso)
  const day = date.getDay()
  date.setDate(date.getDate() - day)
  return formatISODate(date)
}

export function startOfMonth(iso: string): string {
  const date = parseISODate(iso)
  date.setDate(1)
  return formatISODate(date)
}

export function getMonthGrid(iso: string): string[] {
  // Retorna todas as datas (ISO) visíveis em uma grade de calendário mensal (6 semanas, começando no domingo)
  const first = parseISODate(startOfMonth(iso))
  const gridStart = parseISODate(startOfWeek(formatISODate(first)))
  const days: string[] = []
  const cursor = new Date(gridStart)
  for (let i = 0; i < 42; i++) {
    days.push(formatISODate(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }
  return days
}

export function weekDates(iso: string): string[] {
  const start = parseISODate(startOfWeek(iso))
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(formatISODate(d))
  }
  return days
}

export function monthLabel(iso: string): string {
  const date = parseISODate(iso)
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function weekdayIndex(iso: string): number {
  return parseISODate(iso).getDay()
}
