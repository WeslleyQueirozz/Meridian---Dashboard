import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import type { ProfessionalTask } from '@/types'

export type ProfessionalTaskInput = Omit<
  ProfessionalTask,
  'id' | 'user_id' | 'completed_at' | 'created_at' | 'updated_at'
>

export function useProfessionalTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<ProfessionalTask[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('professional_tasks')
      .select('*')
      .order('due_date', { ascending: true, nullsFirst: false })

    if (!error && data) setTasks(data as ProfessionalTask[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('professional_tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'professional_tasks', filter: `user_id=eq.${user.id}` },
        () => fetchTasks()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchTasks])

  const createTask = useCallback(
    async (input: ProfessionalTaskInput) => {
      if (!user) return { error: 'Não autenticado', data: null }
      const { data, error } = await supabase
        .from('professional_tasks')
        .insert({ ...input, user_id: user.id })
        .select()
        .single()
      if (!error) await fetchTasks()
      return { error: error?.message ?? null, data: data as ProfessionalTask | null }
    },
    [user, fetchTasks]
  )

  const updateTask = useCallback(
    async (id: string, input: Partial<ProfessionalTaskInput>) => {
      const { error } = await supabase.from('professional_tasks').update(input).eq('id', id)
      if (!error) await fetchTasks()
      return { error: error?.message ?? null }
    },
    [fetchTasks]
  )

  const deleteTask = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('professional_tasks').delete().eq('id', id)
      if (!error) await fetchTasks()
      return { error: error?.message ?? null }
    },
    [fetchTasks]
  )

  const toggleComplete = useCallback(
    async (task: ProfessionalTask, completed: boolean) => {
      const { error } = await supabase
        .from('professional_tasks')
        .update({
          status: completed ? 'concluida' : 'pendente',
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', task.id)
      if (!error) await fetchTasks()
      return { error: error?.message ?? null }
    },
    [fetchTasks]
  )

  return { tasks, loading, createTask, updateTask, deleteTask, toggleComplete, refetch: fetchTasks }
}
