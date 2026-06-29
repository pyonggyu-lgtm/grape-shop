'use client'

import { useState } from 'react'
import { useCartStore } from '@/stores/cart-store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState(product.options[0]?.weight ?? 2)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const selectedOption = product.options.find((o) => o.weight === selectedWeight)

  function handleAddToCart() {
    if (!selectedOption) return
    addItem({
      productId: product.id,
      productName: product.name,
      weight: selectedOption.weight,
      quantity: 1,
      price: selectedOption.price,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className='bg-white rounded-2xl shadow-md overflow-hidden flex flex-col'>
      <div className='aspect-square bg-purple-50 flex items-center justify-center overflow-hidden'>
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className='w-full h-full object-cover' />
        ) : (
          <span className='text-6xl'>🍇</span>
        )}
      </div>
      <div className='p-5 flex flex-col gap-3 flex-1'>
        <div>
          <h3 className='text-lg font-bold text-gray-900'>{product.name}</h3>
          <p className='mt-1 text-xs text-gray-500 line-clamp-1'>{product.description}</p>
        </div>

        <div className='flex flex-wrap gap-2'>
          {product.options.map((opt) => (
            <button
              key={opt.weight}
              onClick={() => setSelectedWeight(opt.weight)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedWeight === opt.weight
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-purple-400'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className='flex items-center justify-between mt-auto'>
          <span className='text-xl font-bold text-gray-900'>
            {selectedOption ? formatPrice(selectedOption.price) : '-'}
          </span>
          <button
            onClick={handleAddToCart}
            disabled={!product.isAvailable || added}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors text-white ${
              added
                ? 'bg-green-500'
                : product.isAvailable
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-gray-300'
            }`}
          >
            {added ? '✓ 담겼어요!' : product.isAvailable ? '장바구니 담기' : '품절'}
          </button>
        </div>
      </div>
    </div>
  )
}
