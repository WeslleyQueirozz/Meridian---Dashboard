import { useRef, useState } from 'react'
import type { Attachment, AttachmentOwnerType } from '@/types'
import { useAttachments } from '@/hooks/useAttachments'
import { useToast } from '@/contexts/ToastContext'
import { Button } from './Button'

function formatSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUpload({
  ownerType,
  ownerId,
}: {
  ownerType: AttachmentOwnerType
  ownerId: string | null
}) {
  const { attachments, uploadFile, removeAttachment, getDownloadUrl, loading } = useAttachments(
    ownerType,
    ownerId
  )
  const { showToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const { error } = await uploadFile(file)
      if (error) showToast('error', `Falha ao anexar "${file.name}": ${error}`)
      else showToast('success', `Arquivo "${file.name}" anexado.`)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDownload(attachment: Attachment) {
    const url = await getDownloadUrl(attachment)
    if (!url) {
      showToast('error', 'Não foi possível gerar o link do arquivo.')
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  async function handleRemove(attachment: Attachment) {
    const { error } = await removeAttachment(attachment)
    if (error) showToast('error', `Falha ao remover: ${error}`)
    else showToast('info', `Arquivo "${attachment.file_name}" removido.`)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={!ownerId}
          loading={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Anexar arquivo
        </Button>
        {!ownerId && (
          <span className="text-xs text-mist-300">Salve o registro para habilitar anexos.</span>
        )}
      </div>

      {loading && <span className="text-xs text-mist-300">Carregando anexos…</span>}

      {attachments.length > 0 && (
        <ul className="flex flex-col gap-2">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center justify-between rounded-lg border border-mist-200 bg-mist-50 px-3 py-2"
            >
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm text-navy-800">{attachment.file_name}</span>
                <span className="text-xs text-mist-300">{formatSize(attachment.file_size)}</span>
              </div>
              <div className="flex flex-shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => handleDownload(attachment)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-accent-dim hover:bg-accent/10"
                >
                  Ver / baixar
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(attachment)}
                  className="rounded-md px-2 py-1 text-xs font-medium text-status-late hover:bg-status-late/10"
                >
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
