import { useQuery } from '@tanstack/react-query'
import { bkend } from '@/lib/bkend'
import type { Product } from '@/types'

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => bkend.data.list('products', { isAvailable: 'true' }),
  })
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => bkend.data.get('products', id),
    enabled: !!id,
  })
}
