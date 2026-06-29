'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { bkend } from '@/lib/bkend'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('grace@fram.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await bkend.auth.signin({ email, password })
      router.push('/admin/orders')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#faf9f7] flex items-center justify-center px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-10 max-w-sm w-full'>
        <div className='text-center mb-8'>
          <div className='text-4xl mb-3'>🍇</div>
          <h1 className='text-xl font-bold text-gray-900'>관리자 로그인</h1>
        </div>
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>이메일</label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400'
              placeholder='admin@farm.com'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>비밀번호</label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-purple-400'
            />
          </div>
          {error && <p className='text-sm text-red-500'>{error}</p>}
          <button
            type='submit'
            disabled={loading}
            className='w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-3 rounded-xl font-medium transition-colors'
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
