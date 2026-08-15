export type Priority = 'baixa' | 'media' | 'alta' | 'urgente'

export type ProfessionalStatus = 'pendente' | 'em_andamento' | 'concluida'
export type PersonalStatus = 'pendente' | 'em_andamento' | 'concluida'

export type RecurrenceType = 'nenhuma' | 'diaria' | 'semanal' | 'mensal'

export type PersonalCategory =
  | 'trabalho'
  | 'aws_cloud'
  | 'ingles'
  | 'espanhol'
  | 'programacao'
  | 'estudos'
  | 'exercicios'
  | 'projeto_pessoal'
  | 'curso'
  | 'pessoal'
  | 'outros'

export interface ProfessionalTask {
  id: string
  user_id: string
  title: string
  description: string | null
  requester: string | null
  start_date: string | null
  due_date: string | null
  responsible: string | null
  priority: Priority
  status: ProfessionalStatus
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface PersonalActivity {
  id: string
  user_id: string
  title: string
  description: string | null
  category: PersonalCategory
  date: string
  start_time: string | null
  end_time: string | null
  priority: Priority
  status: PersonalStatus
  recurrence: RecurrenceType
  recurrence_days: number[] | null // 0=domingo ... 6=sábado, usado quando recurrence = semanal
  recurrence_group_id: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

export type AttachmentOwnerType = 'professional_task' | 'personal_activity'

export interface Attachment {
  id: string
  user_id: string
  owner_type: AttachmentOwnerType
  owner_id: string
  file_name: string
  file_path: string
  file_size: number | null
  content_type: string | null
  created_at: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
}

export const PROFESSIONAL_STATUS_LABELS: Record<ProfessionalStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const PERSONAL_STATUS_LABELS: Record<PersonalStatus, string> = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
}

export const CATEGORY_LABELS: Record<PersonalCategory, string> = {
  trabalho: 'Trabalho',
  aws_cloud: 'AWS / Cloud',
  ingles: 'Inglês',
  espanhol: 'Espanhol',
  programacao: 'Programação',
  estudos: 'Estudos',
  exercicios: 'Exercícios',
  projeto_pessoal: 'Projeto pessoal',
  curso: 'Curso',
  pessoal: 'Pessoal',
  outros: 'Outros',
}

export const RECURRENCE_LABELS: Record<RecurrenceType, string> = {
  nenhuma: 'Não repetir',
  diaria: 'Diariamente',
  semanal: 'Semanalmente',
  mensal: 'Mensalmente',
}

export const WEEKDAY_LABELS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
