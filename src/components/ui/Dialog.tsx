'use client'

import { ReactNode, useEffect, useCallback } from 'react'

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-2xl',
}

export function Dialog({ isOpen, onClose, title, children, size = 'md' }: DialogProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      role='dialog'
      aria-modal='true'
      aria-labelledby={title ? 'dialog-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/50'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Panel */}
      <div
        className={[
          'relative w-full bg-white rounded-[var(--radius-lg)]',
          'shadow-[var(--shadow-lg)] p-6',
          sizeClasses[size],
        ].join(' ')}
      >
        {/* Header */}
        <div className='flex items-center justify-between mb-4'>
          {title && (
            <h2
              id='dialog-title'
              className='text-lg font-bold text-[var(--color-text)]'
            >
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className='ml-auto -mt-1 -mr-1 p-2 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-gray-100 transition-colors'
            aria-label='닫기'
          >
            <svg
              className='h-5 w-5'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
              fill='currentColor'
              aria-hidden='true'
            >
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {children}
      </div>
    </div>
  )
}
