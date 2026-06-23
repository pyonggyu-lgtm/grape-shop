'use client'

import { useState, useEffect } from 'react'
import { useProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/features/product/ProductCard'
import { CartDrawer } from '@/components/features/cart/CartDrawer'
import { useCartStore } from '@/stores/cart-store'

export default function HomePage() {
  const [cartOpen, setCartOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { data: products, isLoading, error } = useProducts()
  const totalCount = useCartStore((s) => s.totalCount)

  useEffect(() => setMounted(true), [])

  return (
    <div className='min-h-screen bg-[#faf9f7]'>
      <header className='sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm'>
        <div className='max-w-5xl mx-auto px-4 h-16 flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl'>🍇</span>
            <div className='flex items-baseline gap-1.5'>
              <span className='font-bold text-lg bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent'>그레이스 팜</span>
              <span className='text-xs text-gray-700'>(문의:010-9100-2244)</span>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className='relative flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors'
          >
            <span>장바구니</span>
            {mounted && totalCount() > 0 && (
              <span className='bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center'>
                {totalCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      <section className='bg-gradient-to-br from-purple-700 to-purple-500 text-white py-16 px-4 text-center'>
        <h1 className='text-3xl font-bold mb-3'>산지 직송 포도</h1>
        <p className='text-purple-100 text-lg whitespace-nowrap'>
          당일 수확한 신선한 포도를 빠르고 합리적인 가격으로 배송해 드립니다
        </p>
        <div className='mt-6 flex flex-wrap justify-center gap-3 text-sm font-medium'>
          <span className='bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full'>✓ 당일 수확 배송</span>
          <span className='bg-green-400 text-green-900 px-4 py-1.5 rounded-full'>✓ 산지 직거래 가격</span>
          <span className='bg-blue-300 text-blue-900 px-4 py-1.5 rounded-full'>✓ 안전한 포장</span>
        </div>
      </section>

      <main className='max-w-5xl mx-auto px-4 py-12'>
        <h2 className='text-2xl font-bold text-gray-900 mb-8'>판매 상품</h2>

        {isLoading && (
          <div className='flex justify-center py-20'>
            <div className='w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin' />
          </div>
        )}

        {error && (
          <div className='text-center py-20 text-gray-500'>
            상품을 불러오는 중 오류가 발생했습니다.
          </div>
        )}

        {products && products.length === 0 && (
          <div className='text-center py-20 text-gray-400'>
            <div className='text-5xl mb-4'>🌱</div>
            <p>현재 판매 중인 상품이 없습니다.</p>
            <p className='text-sm mt-1'>수확 시기에 다시 방문해 주세요.</p>
          </div>
        )}

        {products && products.length > 0 && (
          <div className={`grid gap-6 ${products.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <footer className='bg-green-50 border-t border-green-200 mt-auto'>
        <div className='max-w-5xl mx-auto px-4 pt-6 pb-2 text-center'>
          <p className='text-xs text-green-700 font-semibold uppercase tracking-widest mb-1'>💳 입금 계좌</p>
          <p className='text-lg font-bold text-green-900'>우체국 010017-02-618695 <span className='text-sm font-normal text-gray-500'>(예금주: 박용규)</span></p>
        </div>
        <p className='text-center text-xs text-gray-400 pb-4'>주문 후 위 계좌로 입금해 주시면 확인 후 발송해 드립니다.</p>
      </footer>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
