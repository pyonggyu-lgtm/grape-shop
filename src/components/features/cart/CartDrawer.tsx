'use client'

import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import { useRouter } from 'next/navigation'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, totalAmount } = useCartStore()
  const router = useRouter()

  function handleOrder() {
    onClose()
    router.push('/order')
  }

  return (
    <>
      {open && (
        <div className='fixed inset-0 bg-black/40 z-40' onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className='flex items-center justify-between p-5 border-b'>
          <h2 className='text-lg font-bold'>장바구니</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-gray-600 text-2xl leading-none'>
            ✕
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-5 space-y-4'>
          {items.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full text-gray-400 gap-3'>
              <span className='text-5xl'>🛒</span>
              <p className='text-sm'>장바구니가 비어있습니다</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.weight}`} className='flex gap-3 items-start'>
                <div className='w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl shrink-0'>
                  🍇
                </div>
                <div className='flex-1 min-w-0'>
                  <p className='font-medium text-sm truncate'>{item.productName}</p>
                  <p className='text-xs text-gray-500'>{item.weight}kg</p>
                  <div className='flex items-center gap-2 mt-1.5'>
                    <button
                      onClick={() => item.quantity > 1
                        ? updateQuantity(item.productId, item.weight, item.quantity - 1)
                        : removeItem(item.productId, item.weight)
                      }
                      className='w-6 h-6 rounded-full border border-gray-300 text-sm flex items-center justify-center hover:bg-gray-50'
                    >
                      -
                    </button>
                    <span className='text-sm w-4 text-center'>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.weight, item.quantity + 1)}
                      className='w-6 h-6 rounded-full border border-gray-300 text-sm flex items-center justify-center hover:bg-gray-50'
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className='text-right shrink-0'>
                  <p className='text-sm font-semibold'>{formatPrice(item.price * item.quantity)}</p>
                  <button
                    onClick={() => removeItem(item.productId, item.weight)}
                    className='text-xs text-gray-400 hover:text-red-500 mt-1'
                  >
                    삭제
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className='p-5 border-t space-y-3'>
            <div className='flex justify-between text-base font-bold'>
              <span>합계</span>
              <span className='text-purple-700'>{formatPrice(totalAmount())}</span>
            </div>
            <button
              onClick={handleOrder}
              className='w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors'
            >
              주문하기
            </button>
          </div>
        )}
      </div>
    </>
  )
}
