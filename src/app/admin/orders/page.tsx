'use client'

import * as XLSX from 'xlsx'
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrder'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/lib/utils'
import type { Order, OrderStatus } from '@/types'

const STATUS_FLOW: OrderStatus[] = ['pending', 'paid', 'preparing', 'shipped', 'delivered']

function exportToExcel(orders: Order[]) {
  const rows = orders.flatMap((order) => {
    const recipientName = order.recipientName || order.customerName
    const recipientPhone = order.recipientPhone || order.customerPhone
    const totalQty = order.items.reduce((sum, i) => sum + i.quantity, 0)
    const fullAddress = [order.deliveryAddress, order.deliveryDetailAddress].filter(Boolean).join(' ')
    return [{
      '수하인이름': recipientName,
      '수하인주소': fullAddress,
      '수하인연락처': recipientPhone,
      '수량': totalQty,
      '송하인이름': '그레이스팜',
      '송하인연락처': order.customerPhone,
      '송하인주소': '경북 김천시 봉산면 284-1',
    }]
  })
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '주문목록')
  XLSX.writeFile(wb, `로젠택배_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

export default function AdminOrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const updateStatus = useUpdateOrderStatus()

  function nextStatus(current: OrderStatus): OrderStatus | null {
    const idx = STATUS_FLOW.indexOf(current)
    return idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : null
  }

  return (
    <div className='min-h-screen bg-[#faf9f7]'>
      <header className='bg-white border-b px-6 h-16 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-xl'>🍇</span>
          <span className='font-bold text-purple-700'>그레이스 팜 — 주문 관리</span>
        </div>
        {orders && orders.length > 0 && (
          <button
            onClick={() => exportToExcel(orders)}
            className='flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors'
          >
            <span>📦</span>
            <span>로젠택배 엑셀 다운로드</span>
          </button>
        )}
      </header>

      <main className='max-w-5xl mx-auto px-4 py-8'>
        {isLoading && (
          <div className='flex justify-center py-20'>
            <div className='w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin' />
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className='text-center py-20 text-gray-400'>
            <p className='text-4xl mb-3'>📦</p>
            <p>아직 주문이 없습니다.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className='space-y-4'>
            {orders.map((order) => {
              const next = nextStatus(order.status)
              return (
                <div key={order.id} className='bg-white rounded-2xl shadow-sm p-6'>
                  <div className='flex flex-wrap items-start justify-between gap-3 mb-4'>
                    <div>
                      <p className='text-xs text-gray-400'>{formatDate(order.createdAt)}</p>
                      <p className='font-bold text-gray-900'>{order.orderNumber}</p>
                      <p className='text-sm text-gray-600 mt-0.5'>
                        {order.customerName} · {order.customerPhone}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLOR[order.status]}`}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                      {next && (
                        <button
                          onClick={() => updateStatus.mutate({ id: order.id, status: next })}
                          disabled={updateStatus.isPending}
                          className='text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full transition-colors'
                        >
                          {ORDER_STATUS_LABEL[next]}으로 변경
                        </button>
                      )}
                    </div>
                  </div>

                  <div className='border-t pt-4 space-y-1'>
                    {order.items.map((item, i) => (
                      <div key={i} className='flex justify-between text-sm text-gray-600'>
                        <span>{item.productName} {item.weight}kg × {item.quantity}</span>
                        <span>{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                    <div className='flex justify-between text-sm font-bold pt-2 border-t mt-2'>
                      <span>합계</span>
                      <span className='text-purple-700'>{formatPrice(order.totalAmount)}</span>
                    </div>
                  </div>

                  <div className='mt-3 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2 space-y-0.5'>
                    {order.recipientName && order.recipientName !== order.customerName && (
                      <p>🎁 받는 분: {order.recipientName} · {order.recipientPhone}</p>
                    )}
                    <p>📦 {order.deliveryAddress} {order.deliveryDetailAddress}</p>
                    {order.deliveryNote && <p>💬 "{order.deliveryNote}"</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
