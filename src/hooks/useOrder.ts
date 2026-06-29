import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bkend } from '@/lib/bkend'
import type { Order, OrderStatus } from '@/types'

function generateOrderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const seq = (Date.now() % 9000 + 1000).toString()
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
