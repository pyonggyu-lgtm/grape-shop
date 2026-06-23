import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: '포도 직거래 — 신선한 포도를 농장에서 바로',
  description: '산지 직송 포도 온라인 쇼핑몰. 신선한 포도를 합리적인 가격에 만나보세요.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='ko' className='h-full'>
      <body className='min-h-full flex flex-col antialiased'>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
