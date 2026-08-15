import { useCallback, useEffect, useState } from 'react'
import { supabase, ATTACHMENTS_BUCKET } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthContext'
import type { Attachment, AttachmentOwnerType } from '@/types'

export function useAttachments(ownerType: AttachmentOwnerType, ownerId: string | null) {
  const { user } = useAuth()
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(false)

  const fetchAttachments = useCallback(async () => {
    if (!ownerId) {
      setAttachments([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('owner_type', ownerType)
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: true })

    if (!error && data) setAttachments(data as Attachment[])
    setLoading(false)
  }, [ownerType, ownerId])

  useEffect(() => {
    fetchAttachments()
  }, [fetchAttachments])

  const uploadFile = useCallback(
    async (file: File): Promise<{ error: string | null }> => {
      if (!ownerId || !user) return { error: 'Salve o registro antes de anexar arquivos.' }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${user.id}/${ownerType}/${ownerId}/${Date.now()}-${safeName}`

      const { error: uploadError } = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(path, file)
      if (uploadError) return { error: uploadError.message }

      const { error: insertError } = await supabase.from('attachments').insert({
        user_id: user.id,
        owner_type: ownerType,
        owner_id: ownerId,
        file_name: file.name,
        file_path: path,
        file_size: file.size,
        content_type: file.type,
      })

      if (insertError) return { error: insertError.message }

      await fetchAttachments()
      return { error: null }
    },
    [ownerType, ownerId, user, fetchAttachments]
  )

  const removeAttachment = useCallback(
    async (attachment: Attachment): Promise<{ error: string | null }> => {
      const { error: storageError } = await supabase.storage
        .from(ATTACHMENTS_BUCKET)
        .remove([attachment.file_path])
      if (storageError) return { error: storageError.message }

      const { error: dbError } = await supabase.from('attachments').delete().eq('id', attachment.id)
      if (dbError) return { error: dbError.message }

      await fetchAttachments()
      return { error: null }
    },
    [fetchAttachments]
  )

  const getDownloadUrl = useCallback(async (attachment: Attachment): Promise<string | null> => {
    const { data, error } = await supabase.storage
      .from(ATTACHMENTS_BUCKET)
      .createSignedUrl(attachment.file_path, 60 * 5)
    if (error) return null
    return data.signedUrl
  }, [])

  return { attachments, loading, uploadFile, removeAttachment, getDownloadUrl, refetch: fetchAttachments }
}
