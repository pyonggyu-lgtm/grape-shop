import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bkend } from '@/lib/bkend'
import type { Order, OrderStatus } from '@/types'

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')
  return `ORD-${date}-${seq}`
}

export function useCreateOrder() {
  return useMutation({
    mutationFn: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'orderNumber'>) =>
      bkend.data.create('orders', {
        ...orderData,
        orderNumber: generateOrderNumber(),
        status: 'pending',
      }),
  })
}

export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: () => bkend.data.list('orders'),
  })
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      bkend.data.update('orders', id, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  })
}
