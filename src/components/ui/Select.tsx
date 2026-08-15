import { forwardRef, type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className = '', children, ...rest },
  ref
) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-navy-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={id}
        className={`rounded-lg border border-mist-300 bg-white px-3 py-2 text-sm text-navy-900 focus:border-accent focus:outline-none ${
          error ? 'border-status-late' : ''
        } ${className}`}
        {...rest}
      >
        {children}
      </select>
      {error && <span className="text-xs text-status-late">{error}</span>}
    </div>
  )
})
