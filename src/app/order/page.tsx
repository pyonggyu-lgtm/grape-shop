'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useCartStore } from '@/stores/cart-store'
import { useCreateOrder } from '@/hooks/useOrder'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { zonecode: string; roadAddress: string; jibunAddress: string }) => void
      }) => { open: () => void }
    }
  }
}

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

export default function OrderPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCartStore()
  const createOrder = useCreateOrder()

  const [form, setForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    postalCode: '',
    deliveryAddress: '',
    deliveryDetailAddress: '',
    requestedDeliveryDate: '',
    deliveryNote: '',
    recipientName: '',
    recipientPhone: '',
  })
  const [isGift, setIsGift] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (items.length === 0 && !createOrder.isSuccess) {
      router.replace('/')
    }
  }, [items.length, router, createOrder.isSuccess])

  if (items.length === 0 && !createOrder.isSuccess) return null

  function openPostcode() {
    new window.daum.Postcode({
      oncomplete(data) {
        setForm((f) => ({
          ...f,
          postalCode: data.zonecode,
          deliveryAddress: data.roadAddress || data.jibunAddress,
        }))
        setErrors((e) => ({ ...e, postalCode: '', deliveryAddress: '' }))
      },
    }).open()
  }

  function validate() {
    const e: Record<string, string> = {}
    if (!form.customerName) e.customerName = '이름을 입력해주세요'
    if (!form.customerPhone) e.customerPhone = '연락처를 입력해주세요'
    if (!form.postalCode) e.postalCode = '우편번호를 입력해주세요'
    if (!form.deliveryAddress) e.deliveryAddress = '주소를 입력해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    try {
      const order = await createOrder.mutateAsync({
        ...form,
        recipientName: isGift ? form.recipientName : form.customerName,
        recipientPhone: isGift ? form.recipientPhone : form.customerPhone,
        items,
        totalAmount: totalAmount(),
        paymentMethod: 'transfer',
        status: 'pending',
      } as Parameters<typeof createOrder.mutateAsync>[0])

      clearCart()
      router.push(`/order/complete?orderNumber=${order.orderNumber}`)
    } catch {
      alert('주문 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  function field(label: string, key: keyof typeof form, type = 'text', placeholder = '', optional = false) {
    return (
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
          {optional && <span className='text-gray-400 font-normal ml-1'>(선택)</span>}
        </label>
        <input
          type={type}
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 ${
            errors[key] ? 'border-red-400' : 'border-gray-300'
          }`}
        />
        {errors[key] && <p className='text-xs text-red-500 mt-1'>{errors[key]}</p>}
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#faf9f7]'>
      <Script src='https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js' />
      <header className='bg-white border-b px-4 h-16 flex items-center gap-3'>
        <button onClick={() => router.back()} className='text-gray-500 hover:text-gray-700'>
          ← 뒤로
        </button>
        <h1 className='font-bold text-lg'>주문서 작성</h1>
      </header>

      <div className='max-w-2xl mx-auto px-4 py-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* 주문자 정보 */}
          <section className='bg-white rounded-2xl p-6 shadow-sm space-y-4'>
            <h2 className='font-bold text-base'>주문자 정보</h2>
            {field('이름', 'customerName', 'text', '홍길동')}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>연락처</label>
              <input
                type='tel'
                value={form.customerPhone}
                onChange={(e) => setForm((f) => ({ ...f, customerPhone: formatPhone(e.target.value) }))}
                placeholder='010-0000-0000'
                className={`w-full border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400 ${
                  errors.customerPhone ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {errors.customerPhone && <p className='text-xs text-red-500 mt-1'>{errors.customerPhone}</p>}
            </div>
          </section>

          {/* 선물 옵션 */}
          <section className='bg-white rounded-2xl p-6 shadow-sm'>
            <label className='flex items-center gap-3 cursor-pointer'>
              <input
                type='checkbox'
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className='w-5 h-5 accent-purple-600'
              />
              <div>
                <p className='font-medium bg-gradient-to-r from-green-800 to-emerald-700 bg-clip-text text-transparent'>다른 분께 선물하기</p>
                <p className='text-xs text-gray-400 mt-0.5'>받는 분이 주문자와 다른 경우 체크해주세요</p>
              </div>
            </label>
            {isGift && (
              <div className='mt-4 space-y-4 border-t pt-4'>
                {field('받는 분 이름', 'recipientName', 'text', '홍길동')}
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>받는 분 연락처</label>
                  <input
                    type='tel'
                    value={form.recipientPhone}
                    onChange={(e) => setForm((f) => ({ ...f, recipientPhone: formatPhone(e.target.value) }))}
                    placeholder='010-0000-0000'
                    className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400'
                  />
                </div>
              </div>
            )}
          </section>

          {/* 배송지 */}
          <section className='bg-white rounded-2xl p-6 shadow-sm space-y-4'>
            <h2 className='font-bold text-base'>배송지</h2>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>주소</label>
              <div className='flex gap-2 mb-2'>
                <input
                  readOnly
                  value={form.postalCode}
                  placeholder='우편번호'
                  className={`w-32 border rounded-xl px-4 py-2.5 text-sm bg-gray-50 ${
                    errors.postalCode ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type='button'
                  onClick={openPostcode}
                  className='flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors'
                >
                  주소 찾기
                </button>
              </div>
              <input
                readOnly
                value={form.deliveryAddress}
                placeholder='주소를 검색해주세요'
                className={`w-full border rounded-xl px-4 py-2.5 text-sm bg-gray-50 ${
                  errors.deliveryAddress ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {(errors.postalCode || errors.deliveryAddress) && (
                <p className='text-xs text-red-500 mt-1'>주소를 검색해주세요</p>
              )}
            </div>
            {field('상세주소', 'deliveryDetailAddress', 'text', '101호', true)}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                배송 메모 <span className='text-gray-400 font-normal'>(선택)</span>
              </label>
              <input
                type='text'
                value={form.deliveryNote}
                onChange={(e) => setForm((f) => ({ ...f, deliveryNote: e.target.value }))}
                placeholder='부재시 경비실에 맡겨주세요'
                className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400'
              />
            </div>
          </section>

          {/* 주문 요약 */}
          <section className='bg-white rounded-2xl p-6 shadow-sm'>
            <h2 className='font-bold text-base mb-4'>주문 상품</h2>
            <div className='space-y-3'>
              {items.map((item) => (
                <div key={`${item.productId}-${item.weight}`} className='flex justify-between text-sm'>
                  <span className='text-gray-700'>
                    {item.productName} {item.weight}kg × {item.quantity}
                  </span>
                  <span className='font-medium'>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className='border-t pt-3 flex justify-between font-bold'>
                <span>합계</span>
                <span className='text-purple-700 text-lg'>{formatPrice(totalAmount())}</span>
              </div>
            </div>
          </section>

          {/* 입금 계좌 안내 */}
          <section className='bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center'>
            <p className='text-sm font-semibold text-green-700 mb-2'>💳 주문 후 아래 계좌로 입금해 주세요</p>
            <p className='text-lg font-bold text-green-900'>우체국 010017-02-618695</p>
            <p className='text-sm text-gray-500 mt-1'>예금주: 박용규</p>
            <p className='text-xs text-gray-400 mt-2'>입금 확인 후 발송해 드립니다</p>
          </section>

          <button
            type='submit'
            disabled={createOrder.isPending}
            className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-4 rounded-2xl font-bold text-base transition-colors'
          >
            {createOrder.isPending ? '처리 중...' : '주문 완료하기'}
          </button>
        </form>
      </div>
    </div>
  )
}
