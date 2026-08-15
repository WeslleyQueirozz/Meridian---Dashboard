import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, id, className = '', ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={`rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-mist-300 focus:border-accent focus:outline-none ${
          error ? 'border-status-late' : ''
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-status-late">{error}</span>}
    </div>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, id, className = '', ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-700">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={`rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm text-navy-900 placeholder:text-mist-300 focus:border-accent focus:outline-none ${
          error ? 'border-status-late' : ''
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-status-late">{error}</span>}
    </div>
  )
})
