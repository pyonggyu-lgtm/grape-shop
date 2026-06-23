import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
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

        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-2.5 text-base text-[var(--color-text)]',
            'bg-white border rounded-[var(--radius-sm)]',
            'placeholder:text-[var(--color-text-muted)]',
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
        />

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

Input.displayName = 'Input'

/* ---------- Textarea ---------- */

import { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
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

        <textarea
          ref={ref}
          id={inputId}
          className={[
            'w-full px-3 py-2.5 text-base text-[var(--color-text)]',
            'bg-white border rounded-[var(--radius-sm)] resize-y',
            'placeholder:text-[var(--color-text-muted)]',
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
        />

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

Textarea.displayName = 'Textarea'
