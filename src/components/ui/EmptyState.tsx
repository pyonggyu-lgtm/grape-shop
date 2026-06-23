import { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon && (
        <div className='mb-4 text-[var(--color-text-muted)] opacity-50'>{icon}</div>
      )}
      <h3 className='text-lg font-semibold text-[var(--color-text)] mb-1'>{title}</h3>
      {description && (
        <p className='text-sm text-[var(--color-text-muted)] mb-6 max-w-xs'>{description}</p>
      )}
      {action && <div>{action}</div>}
    </div>
  )
}
