import { supabase } from './supabase'
import type { Product, Order, OrderStatus } from '@/types'

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: row.id as string,
    name: row.name as string,
    variety: row.variety as string,
    description: row.description as string,
    pricePerKg: row.price_per_kg as number,
    options: row.options as Product['options'],
    imageUrl: row.image_url as string,
    stock: row.stock as number,
    isAvailable: row.is_available as boolean,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function toOrder(row: Record<string, unknown>): Order {
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    customerName: row.customer_name as string,
    customerPhone: row.customer_phone as string,
    customerEmail: row.customer_email as string,
    deliveryAddress: row.delivery_address as string,
    deliveryDetailAddress: row.delivery_detail_address as string,
    postalCode: row.postal_code as string,
    requestedDeliveryDate: row.requested_delivery_date as string | undefined,
    deliveryNote: row.delivery_note as string | undefined,
    recipientName: row.recipient_name as string | undefined,
    recipientPhone: row.recipient_phone as string | undefined,
    items: row.items as Order['items'],
    totalAmount: row.total_amount as number,
    paymentMethod: row.payment_method as Order['paymentMethod'],
    paymentKey: row.payment_key as string | undefined,
    status: row.status as OrderStatus,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  }
}

function fromOrderInput(obj: Record<string, unknown>): Record<string, unknown> {
  return {
    order_number: obj.orderNumber,
    customer_name: obj.customerName,
    customer_phone: obj.customerPhone,
    customer_email: obj.customerEmail,
    delivery_address: obj.deliveryAddress,
    delivery_detail_address: obj.deliveryDetailAddress,
    postal_code: obj.postalCode,
    requested_delivery_date: obj.requestedDeliveryDate || null,
    delivery_note: obj.deliveryNote || null,
    recipient_name: obj.recipientName || null,
    recipient_phone: obj.recipientPhone || null,
    items: obj.items,
    total_amount: obj.totalAmount,
    payment_method: obj.paymentMethod,
    payment_key: obj.paymentKey || null,
    status: obj.status,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const bkend = {
  auth: {
    signin: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      return { accessToken: data.session?.access_token ?? '' }
    },
    signout: async () => {
      await supabase.auth.signOut()
    },
  },

  data: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    list: async (table: string, params?: Record<string, string>): Promise<any[]> => {
      if (table === 'products') {
        let q = supabase.from('products').select('*')
        if (params?.isAvailable === 'true') q = q.eq('is_available', true)
        const { data, error } = await q.order('created_at', { ascending: false })
        if (error) throw new Error(error.message)
        return (data ?? []).map(toProduct)
      }
      if (table === 'orders') {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false })
        if (error) throw new Error(error.message)
        return (data ?? []).map(toOrder)
      }
      return []
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get: async (table: string, id: string): Promise<any> => {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
      if (error) throw new Error(error.message)
      if (table === 'products') return toProduct(data)
      return toOrder(data)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: async (table: string, body: Record<string, unknown>): Promise<any> => {
      const row = table === 'orders' ? fromOrderInput(body) : body
      const { data, error } = await supabase.from(table).insert(row).select().single()
      if (error) throw new Error(error.message)
      if (table === 'orders') return toOrder(data)
      return toProduct(data)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update: async (table: string, id: string, body: Record<string, unknown>): Promise<any> => {
      const { data, error } = await supabase.from(table).update(body).eq('id', id).select().single()
      if (error) throw new Error(error.message)
      if (table === 'orders') return toOrder(data)
      return toProduct(data)
    },

    delete: async (table: string, id: string): Promise<void> => {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw new Error(error.message)
    },
  },
}
