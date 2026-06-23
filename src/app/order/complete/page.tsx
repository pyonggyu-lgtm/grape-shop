'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function CompleteContent() {
  const params = useSearchParams()
  const router = useRouter()
  const orderNumber = params.get('orderNumber') ?? ''

  return (
    <div className='min-h-screen bg-[#faf9f7] flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center space-y-6'>
        <div className='text-6xl'>🍇</div>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>주문이 완료됐습니다!</h1>
          <p className='text-gray-500 mt-2 text-sm'>신선한 포도를 빠르게 배송해 드릴게요</p>
        </div>
        <div className='bg-purple-50 rounded-2xl p-4'>
          <p className='text-xs text-purple-500 font-medium'>주문번호</p>
          <p className='text-lg font-bold text-purple-800 mt-1'>{orderNumber}</p>
        </div>
        <div className='text-sm text-gray-500 space-y-1'>
          <p>입금 확인 후 포장하여 발송해 드립니다.</p>
          <p>문의: 010-0000-0000</p>
        </div>
        <button
          onClick={() => router.push('/')}
          className='w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors'
        >
          쇼핑 계속하기
        </button>
      </div>
    </div>
  )
}

export default function OrderCompletePage() {
  return (
    <Suspense>
      <CompleteContent />
    </Suspense>
  )
}
