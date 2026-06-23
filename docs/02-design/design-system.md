# 디자인 시스템 (Design System)

포도 직거래 쇼핑몰 grape-shop의 UI 컴포넌트 라이브러리 명세.

---

## 1. 디자인 토큰

모든 토큰은 `src/app/globals.css` `:root` 블록에 CSS 변수로 정의됩니다.

### 컬러 팔레트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#6b3fa0` | 포도 보라 — CTA, 버튼, 포커스 링 |
| `--color-primary-light` | `#9b6fc4` | 호버 하이라이트 |
| `--color-primary-dark` | `#4a2875` | 버튼 hover/active |
| `--color-accent` | `#c8a951` | 황금 포도 — 포인트, secondary 버튼 |
| `--color-accent-light` | `#e8d08a` | accent hover |
| `--color-bg` | `#faf9f7` | 페이지 배경 |
| `--color-bg-card` | `#ffffff` | 카드 배경 |
| `--color-text` | `#1a1a2e` | 기본 텍스트 |
| `--color-text-muted` | `#6b7280` | 보조 텍스트, placeholder |
| `--color-border` | `#e5e7eb` | 테두리 |
| `--color-success` | `#10b981` | 성공 |
| `--color-warning` | `#f59e0b` | 경고 |
| `--color-error` | `#ef4444` | 오류, destructive |
| `--color-info` | `#3b82f6` | 정보 |

### 타이포그래피

| 토큰 | 값 |
|------|----|
| `--font-sans` | `'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-size-xs` | `12px` |
| `--font-size-sm` | `14px` |
| `--font-size-base` | `16px` |
| `--font-size-lg` | `18px` |
| `--font-size-xl` | `20px` |
| `--font-size-2xl` | `24px` |
| `--font-size-3xl` | `30px` |
| `--font-size-4xl` | `36px` |

### Border Radius

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--radius-sm` | `6px` | 인풋, 작은 요소 |
| `--radius-md` | `12px` | 카드, 버튼(md/lg) |
| `--radius-lg` | `20px` | 모달, 다이얼로그 |
| `--radius-full` | `9999px` | 뱃지, 알약형 버튼 |

### 그림자

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.08)` | 카드 기본 |
| `--shadow-md` | `0 4px 16px rgba(0,0,0,0.10)` | 카드 hover |
| `--shadow-lg` | `0 8px 32px rgba(0,0,0,0.12)` | 모달, 드로어 |

---

## 2. 컴포넌트 목록

모든 컴포넌트는 `src/components/ui/` 에 위치하며 `src/components/ui/index.ts` 에서 배럴 export됩니다.

```typescript
import { Button, Badge, Card, Input, ... } from '@/components/ui'
```

---

### Button

```typescript
import { Button } from '@/components/ui'

// variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
// size: 'sm' | 'md' | 'lg'
<Button variant='primary' size='md'>주문하기</Button>
<Button variant='secondary'>담기</Button>
<Button variant='outline' size='sm'>취소</Button>
<Button variant='destructive'>삭제</Button>
<Button isLoading>처리 중...</Button>
<Button fullWidth>전체 너비</Button>
```

| Variant | 배경 | 용도 |
|---------|------|------|
| `primary` | `--color-primary` (보라) | 주요 CTA |
| `secondary` | `--color-accent` (황금) | 보조 액션 |
| `outline` | 투명 + 보라 테두리 | 취소, 뒤로가기 |
| `ghost` | 투명 | 네비게이션, 아이콘 버튼 |
| `destructive` | `--color-error` (빨강) | 삭제, 취소 확인 |

---

### Badge / OrderStatusBadge

```typescript
import { Badge, OrderStatusBadge } from '@/components/ui'

<Badge variant='success'>결제 완료</Badge>
<OrderStatusBadge status='preparing' />  // 주문 상태 자동 레이블+색상
```

주문 상태 매핑:

| status | 레이블 | variant |
|--------|--------|---------|
| `pending` | 결제 대기 | warning |
| `paid` | 결제 완료 | success |
| `preparing` | 포장 중 | info |
| `shipped` | 발송 완료 | default |
| `delivered` | 배송 완료 | neutral |
| `cancelled` | 취소됨 | error |

---

### Card

```typescript
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui'

<Card hoverable>
  <CardHeader>
    <h3>상품명</h3>
  </CardHeader>
  <CardBody>내용</CardBody>
  <CardFooter>
    <Button>담기</Button>
  </CardFooter>
</Card>
```

`hoverable` prop을 추가하면 마우스 오버 시 `--shadow-md` 그림자로 상승합니다.

---

### Input / Textarea

```typescript
import { Input, Textarea } from '@/components/ui'

<Input
  label='수령인 이름'
  placeholder='홍길동'
  required
  error='이름을 입력해주세요'
/>

<Textarea
  label='배송 메모'
  hint='경비실 앞 무인택배함 이용'
  rows={3}
/>
```

---

### Select

```typescript
import { Select } from '@/components/ui'

<Select
  label='결제 수단'
  options={[
    { value: 'card', label: '신용카드' },
    { value: 'kakaopay', label: '카카오페이' },
    { value: 'tosspay', label: '토스페이' },
  ]}
  placeholder='선택해주세요'
  required
/>
```

---

### Spinner / FullPageSpinner

```typescript
import { Spinner, FullPageSpinner } from '@/components/ui'

<Spinner size='sm' />
<Spinner size='lg' label='상품 불러오는 중...' />
<FullPageSpinner />  // 200px 최소 높이 중앙 정렬
```

---

### Dialog

```typescript
import { Dialog } from '@/components/ui'

<Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} title='주문 확인'>
  <p>정말 주문하시겠습니까?</p>
  <Button onClick={confirm}>확인</Button>
</Dialog>
```

ESC 키 및 외부 클릭으로 닫힙니다. `size`: `'sm' | 'md' | 'lg'`

---

### Drawer

```typescript
import { Drawer } from '@/components/ui'

<Drawer isOpen={cartOpen} onClose={() => setCartOpen(false)} title='장바구니' side='right'>
  {/* 장바구니 내용 */}
</Drawer>
```

---

### EmptyState

```typescript
import { EmptyState } from '@/components/ui'

<EmptyState
  title='장바구니가 비었습니다'
  description='상품을 담아 주문해 보세요'
  action={<Button onClick={() => router.push('/')}>쇼핑 계속하기</Button>}
/>
```

---

## 3. 유틸리티

### cn — 클래스 병합

```typescript
import { cn } from '@/lib/utils'

className={cn('base-class', condition && 'conditional-class', props.className)}
```

---

## 4. 컴포넌트 구조 (Phase 6 대상)

```
src/components/
├── ui/                         # 디자인 시스템 — 이 문서
│   ├── Button.tsx
│   ├── Badge.tsx               # OrderStatusBadge 포함
│   ├── Card.tsx                # CardHeader, CardBody, CardFooter
│   ├── Input.tsx               # Textarea 포함
│   ├── Select.tsx
│   ├── Spinner.tsx             # FullPageSpinner 포함
│   ├── Dialog.tsx
│   ├── Drawer.tsx
│   ├── EmptyState.tsx
│   └── index.ts                # 배럴 export
└── features/                   # Phase 6에서 구현
    ├── product/
    │   ├── ProductGrid.tsx
    │   ├── ProductCard.tsx
    │   └── ProductOptionSelector.tsx
    ├── cart/
    │   └── CartDrawer.tsx
    ├── order/
    │   ├── OrderForm.tsx
    │   └── OrderComplete.tsx
    └── admin/
        └── AdminOrderTable.tsx
```

---

## 5. Phase 6 체크리스트

- [ ] `Header` 레이아웃 컴포넌트 (장바구니 아이콘 + 카운트)
- [ ] `ProductGrid` — `Card` + `ProductCard` 조합
- [ ] `ProductCard` — `Card`, `Badge`, `Button` 조합
- [ ] `CartDrawer` — `Drawer` + `EmptyState` 조합
- [ ] `OrderForm` — `Input`, `Select`, `Textarea`, `Button` 조합
- [ ] `AdminOrderTable` — `OrderStatusBadge`, `Select`, `Button` 조합
