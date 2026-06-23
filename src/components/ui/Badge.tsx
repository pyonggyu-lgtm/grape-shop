import { HTMLAttributes } from 'react'
import { OrderStatus } from '@/types'

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-purple-100 text-purple-800',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  error: 'bg-red-100 text-red-800',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-gray-100 text-gray-700',
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </span>
  )
}

/* ---------- Order Status Badge ---------- */

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; variant: BadgeVariant }
> = {
  pending:   { label: '결제 대기',  variant: 'warning' },
  paid:      { label: '결제 완료',  variant: 'success' },
  preparing: { label: '포장 중',    variant: 'info' },
  shipped:   { label: '발송 완료',  variant: 'default' },
  delivered: { label: '배송 완료',  variant: 'neutral' },
  cancelled: { label: '취소됨',     variant: 'error' },
}

interface OrderStatusBadgeProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusBadge({ status, className }: OrderStatusBadgeProps) {
  const { label, variant } = ORDER_STATUS_CONFIG[status]
  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  )
}
