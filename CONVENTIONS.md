# grape-shop Coding Conventions

## 1. 언어 및 포맷

- 언어: TypeScript (strict mode)
- 들여쓰기: 2 spaces
- 따옴표: single quote (`'`)
- 세미콜론: 없음 (ESLint auto-fix)
- 줄 길이: 최대 100자

## 2. 파일/폴더 명명 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ProductCard.tsx` |
| 훅 파일 | camelCase, use 접두사 | `useCart.ts` |
| 스토어 파일 | kebab-case, -store 접미사 | `cart-store.ts` |
| 유틸 파일 | kebab-case | `format-price.ts` |
| 타입 파일 | kebab-case | `order-types.ts` |
| 페이지 폴더 | kebab-case | `order-complete/` |

## 3. 컴포넌트 규칙

```typescript
// 함수형 컴포넌트만 사용
export function ProductCard({ product }: ProductCardProps) {
  return <div>...</div>
}

// Props 타입은 컴포넌트 바로 위에 선언
interface ProductCardProps {
  product: Product
  onAddToCart?: (item: CartItem) => void
}
```

## 4. 임포트 순서

```typescript
// 1. React/Next.js
import { useState } from 'react'
import Link from 'next/link'

// 2. 외부 라이브러리
import { useQuery } from '@tanstack/react-query'

// 3. 내부 모듈 (@/ 경로)
import { bkend } from '@/lib/bkend'
import { useCartStore } from '@/stores/cart-store'
import type { Product } from '@/types'

// 4. 상대 경로 (같은 폴더)
import { ProductImage } from './ProductImage'
```

## 5. 상태 관리 원칙

| 상태 종류 | 사용 도구 |
|-----------|-----------|
| 서버 데이터 (상품, 주문 목록) | TanStack Query |
| 클라이언트 전역 상태 (장바구니) | Zustand |
| 로컬 UI 상태 (모달, 폼) | useState |

## 6. 환경 변수 접두사

| 접두사 | 용도 |
|--------|------|
| `NEXT_PUBLIC_BKEND_` | bkend.ai 설정 (브라우저 노출 가능) |
| `NEXT_PUBLIC_TOSS_` | 토스페이먼츠 클라이언트 키 |
| `TOSS_` | 토스페이먼츠 시크릿 키 (서버 전용) |

## 7. 금액 표시

- 모든 금액은 원(₩) 단위 정수로 저장
- 표시할 때는 `toLocaleString('ko-KR')` 사용

```typescript
// 올바른 예
const formatted = `${price.toLocaleString('ko-KR')}원`
```

## 8. 에러 처리

- API 에러: TanStack Query의 `onError` 콜백 사용
- 폼 에러: 인라인 메시지로 표시
- 결제 에러: 토스페이먼츠 에러 코드 기반 한국어 메시지 반환
