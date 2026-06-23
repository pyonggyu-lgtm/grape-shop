import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { paymentKey, orderId, amount } = await req.json()

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ success: false, message: '필수 정보가 누락됐습니다.' }, { status: 400 })
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ success: false, message: '결제 설정 오류입니다.' }, { status: 500 })
  }

  const encoded = Buffer.from(`${secretKey}:`).toString('base64')

  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  if (!tossRes.ok) {
    const err = await tossRes.json()
    console.error('[결제 승인 실패]', err)
    return NextResponse.json(
      { success: false, message: err.message || '결제에 실패했습니다.' },
      { status: 400 }
    )
  }

  return NextResponse.json({ success: true, orderNumber: orderId })
}
