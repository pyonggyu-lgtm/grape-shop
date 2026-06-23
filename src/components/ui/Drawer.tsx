'use client'

import { ReactNode, useEffect, useCallback } from 'react'

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  side?: 'right' | 'left'
}

export function Drawer({ isOpen, onClose, title, children, side = 'right' }: DrawerProps) {
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

  const translateClass = isOpen
    ? 'translate-x-0'
    : side === 'right'
      ? 'translate-x-full'
      : '-translate-x-full'

  const positionClass = side === 'right' ? 'right-0' : 'left-0'

  return (
    <div className='fixed inset-0 z-50' aria-modal='true' role='dialog'>
      {/* Backdrop */}
      <div
        className={[
          'absolute inset-0 bg-black/50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Drawer Panel */}
      <div
        className={[
          'absolute top-0 bottom-0 w-full max-w-sm',
          'bg-white shadow-[var(--shadow-lg)]',
          'flex flex-col',
          'transform transition-transform duration-300 ease-in-out',
          positionClass,
          translateClass,
        ].join(' ')}
      >
        {/* Header */}
        <div className='flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]'>
          {title && (
            <h2 className='text-lg font-bold text-[var(--color-text)]'>{title}</h2>
          )}
          <button
            onClick={onClose}
            className='ml-auto p-2 rounded-[var(--radius-sm)] text-[var(--color-text-muted)] hover:bg-gray-100 transition-colors'
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

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-5 py-4'>{children}</div>
      </div>
    </div>
  )
}
