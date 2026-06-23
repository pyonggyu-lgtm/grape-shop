interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-10 w-10',
}

export function Spinner({ size = 'md', label = '로딩 중...' }: SpinnerProps) {
  return (
    <div role='status' className='inline-flex items-center gap-2'>
      <svg
        className={[
          'animate-spin text-[var(--color-primary)]',
          sizeClasses[size],
        ].join(' ')}
        xmlns='http://www.w3.org/2000/svg'
        fill='none'
        viewBox='0 0 24 24'
        aria-hidden='true'
      >
        <circle
          className='opacity-25'
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='4'
        />
        <path
          className='opacity-75'
          fill='currentColor'
          d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
        />
      </svg>
      <span className='sr-only'>{label}</span>
    </div>
  )
}

export function FullPageSpinner() {
  return (
    <div className='flex items-center justify-center min-h-[200px]'>
      <Spinner size='lg' />
    </div>
  )
}
