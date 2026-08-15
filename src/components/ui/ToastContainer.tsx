import { useToast } from '@/contexts/ToastContext'

const typeStyles: Record<string, string> = {
  success: 'border-status-done/30 bg-white text-status-done',
  error: 'border-status-late/30 bg-white text-status-late',
  warning: 'border-status-warn/30 bg-white text-status-warn',
  info: 'border-accent/30 bg-white text-accent-dim',
}

const typeIcon: Record<string, string> = {
  success: '✓',
  error: '✕',
  warning: '!',
  info: 'i',
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex w-80 max-w-[90vw] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-card ${typeStyles[toast.type]}`}
        >
          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-current/10 text-xs font-bold">
            {typeIcon[toast.type]}
          </span>
          <p className="flex-1 text-sm text-navy-800">{toast.message}</p>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dispensar"
            className="text-navy-400 hover:text-navy-700"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
