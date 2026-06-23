import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className='flex flex-col gap-1'>
        {label && (
          <label
            htmlFor={inputId}
            className='text-sm font-medium text-[var(--color-text)]'
          >
            {label}
            {props.required && (
              <span className='ml-1 text-[var(--color-error)]' aria-hidden='true'>
                *
              </span>
            )}
          </label>
        )}

        <div className='relative'>
          <select
            ref={ref}
            id={inputId}
            className={[
              'w-full px-3 py-2.5 text-base text-[var(--color-text)] appearance-none',
              'bg-white border rounded-[var(--radius-sm)]',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-0',
              error
                ? 'border-[var(--color-error)] focus:ring-red-400'
                : 'border-[var(--color-border)] hover:border-gray-400',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {placeholder && (
              <option value='' disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Chevron icon */}
          <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center'>
            <svg
              className='h-4 w-4 text-[var(--color-text-muted)]'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </div>
        </div>

        {error && (
          <p className='text-xs text-[var(--color-error)]' role='alert'>
            {error}
          </p>
        )}
        {!error && hint && (
          <p className='text-xs text-[var(--color-text-muted)]'>{hint}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
