import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Checkbox({ label, className = '', id, ...rest }: CheckboxProps) {
  return (
    <label htmlFor={id} className="inline-flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        id={id}
        className={`h-4.5 w-4.5 rounded border-mist-300 text-navy-800 focus:ring-accent ${className}`}
        style={{ width: 18, height: 18 }}
        {...rest}
      />
      {label && <span className="text-sm text-navy-700">{label}</span>}
    </label>
  )
}
