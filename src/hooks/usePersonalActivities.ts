import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import type { PersonalActivity } from '@/types'
import { generateOccurrences } from '@/utils/recurrenceUtils'

export type PersonalActivityInput = Omit<
  PersonalActivity,
  'id' | 'user_id' | 'completed_at' | 'created_at' | 'updated_at' | 'recurrence_group_id'
>

export function usePersonalActivities() {
  const { user } = useAuth()
  const [activities, setActivities] = useState<PersonalActivity[]>([])
  const [loading, setLoading] = useState(true)

  const fetchActivities = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase
      .from('personal_activities')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true, nullsFirst: false })

    if (!error && data) setActivities(data as PersonalActivity[])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchActivities()
  }, [fetchActivities])

  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel('personal_activities_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personal_activities', filter: `user_id=eq.${user.id}` },
        () => fetchActivities()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, fetchActivities])

  const createActivity = useCallback(
    async (input: PersonalActivityInput) => {
      if (!user) return { error: 'Não autenticado' }

      const occurrences = generateOccurrences(input.date, input.recurrence, input.recurrence_days)
      const groupId = occurrences.length > 1 ? crypto.randomUUID() : null

      const rows = occurrences.map((date) => ({
        ...input,
        date,
        user_id: user.id,
        recurrence_group_id: groupId,
      }))

      const { error } = await supabase.from('personal_activities').insert(rows)
      if (!error) await fetchActivities()
      return { error: error?.message ?? null }
    },
    [user, fetchActivities]
  )

  const updateActivity = useCallback(
    async (id: string, input: Partial<PersonalActivityInput>) => {
      const { error } = await supabase.from('personal_activities').update(input).eq('id', id)
      if (!error) await fetchActivities()
      return { error: error?.message ?? null }
    },
    [fetchActivities]
  )

  const deleteActivity = useCallback(
    async (id: string) => {
      const { error } = await supabase.from('personal_activities').delete().eq('id', id)
      if (!error) await fetchActivities()
      return { error: error?.message ?? null }
    },
    [fetchActivities]
  )

  const toggleComplete = useCallback(
    async (activity: PersonalActivity, completed: boolean) => {
      const { error } = await supabase
        .from('personal_activities')
        .update({
          status: completed ? 'concluida' : 'pendente',
          completed_at: completed ? new Date().toISOString() : null,
        })
        .eq('id', activity.id)
      if (!error) await fetchActivities()
      return { error: error?.message ?? null }
    },
    [fetchActivities]
  )

  return {
    activities,
    loading,
    createActivity,
    updateActivity,
    deleteActivity,
    toggleComplete,
    refetch: fetchActivities,
  }
}
