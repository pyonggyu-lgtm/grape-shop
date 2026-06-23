# 목업 명세서 (Mockup Specification)

## 개요

포도 직거래 쇼핑몰의 HTML/CSS/JS 정적 프로토타입.  
Next.js 컴포넌트 전환을 고려한 구조로 설계되었습니다.

---

## 화면 목록

| 파일 | 라우트 (Next.js) | 설명 |
|------|-----------------|------|
| `mockup/pages/index.html` | `/` | 메인 — 상품 목록, 히어로 섹션 |
| `mockup/pages/order.html` | `/order` | 주문서 작성 |
| `mockup/pages/order-complete.html` | `/order/complete` | 주문 완료 |
| `mockup/pages/admin-login.html` | `/admin` | 관리자 로그인 |
| `mockup/pages/admin-orders.html` | `/admin/orders` | 주문 관리 |
| `mockup/pages/admin-products.html` | `/admin/products` | 상품 관리 |

---

## 디자인 토큰

### 컬러 팔레트

| 토큰 | 값 | 용도 |
|------|-----|------|
| `--color-primary` | `#6b3fa0` | 포도 보라 — CTA, 강조 |
| `--color-primary-dark` | `#4a2875` | 호버 상태 |
| `--color-accent` | `#c8a951` | 황금 포도 — 포인트 |
| `--color-bg` | `#faf9f7` | 페이지 배경 |
| `--color-text` | `#1a1a2e` | 기본 텍스트 |

### 타이포그래피

- **폰트**: Pretendard (한국어 최적화) → `system-ui` fallback
- **Hero**: 36px / 800 weight
- **Section Title**: 30px / 700 weight
- **Body**: 16px / 400 weight

### 간격 체계

4px 베이스 (`--space-1` ~ `--space-16`)

---

## 컴포넌트 매핑 (Mockup → Next.js)

| 목업 `data-component` | Next.js 파일 | Props 인터페이스 |
|-----------------------|-------------|----------------|
| `Header` | `src/components/layout/Header.tsx` | `cartCount: number` |
| `Hero` | `src/components/features/product/Hero.tsx` | (static) |
| `ProductGrid` | `src/components/features/product/ProductGrid.tsx` | `products: Product[]` |
| `ProductCard` | `src/components/features/product/ProductCard.tsx` | `product: Product, onAddToCart` |
| `ProductOptionSelector` | `src/components/features/product/ProductOptionSelector.tsx` | `options: ProductOption[], selectedWeight, onChange` |
| `CartDrawer` | `src/components/features/cart/CartDrawer.tsx` | `isOpen, onClose, items, onUpdateQty, onRemove` |
| `OrderForm` | `src/components/features/order/OrderForm.tsx` | `cart: CartItem[], onSubmit` |
| `OrderComplete` | `src/components/features/order/OrderComplete.tsx` | `orderNumber: string` |
| `AdminOrderTable` | `src/components/features/admin/AdminOrderTable.tsx` | `orders: Order[], onStatusChange` |
| `OrderStatusBadge` | `src/components/ui/Badge.tsx` | `status: OrderStatus` |

---

## 데이터 흐름 (Mock → API)

### 장바구니 상태
```
mockup: window.state.cart (변수)
  ↓ Phase 6
Next.js: Zustand cart-store.ts
```

### 상품 데이터
```
mockup: fetch('../data/products.json')
  ↓ Phase 4
Next.js: useProducts() → TanStack Query → bkend.ai GET /products
```

### 주문 생성
```
mockup: form submit → sessionStorage → order-complete.html
  ↓ Phase 4
Next.js: useOrder() → POST /orders → 토스페이먼츠 결제창 → confirm
```

### 관리자 상태 변경
```
mockup: alert('Phase 4 구현 예정')
  ↓ Phase 4
Next.js: PATCH /orders/:id { status } → bkend.ai
```

---

## JSON 데이터 구조 → API 스키마

### `mockup/data/products.json`

Phase 4 API 설계 기준:
- `GET /products` → `{ data: Product[], pagination }`
- `Product.options[]` → `ProductOption[]` (인라인 서브도큐먼트)

### `mockup/data/orders.json`

Phase 4 API 설계 기준:
- `GET /orders` → `{ data: Order[], pagination }` (관리자 전용)
- `PATCH /orders/:id` → `{ status: OrderStatus }`

---

## 인터랙션 목록

| 인터랙션 | 구현 위치 | 비고 |
|---------|----------|------|
| 중량 옵션 선택 | `selectOption()` in app.js | 가격 실시간 업데이트 |
| 장바구니 담기 | `addToCart()` | 드로어 자동 열림 |
| 수량 변경 | `changeQty()` | 최소 1개 |
| 장바구니 삭제 | `removeFromCart()` | 즉시 반영 |
| 주소 검색 | `handlePostcode()` | mock alert — 실제: 카카오 API |
| 주문 제출 | form submit → `order-complete.html` | mock — 실제: 토스페이먼츠 |
| 관리자 상태 변경 | `updateOrderStatus()` | mock alert — 실제: bkend.ai PATCH |

---

## UI/UX 결정 사항

### 레이아웃 패턴
- **상품 목록**: CSS Grid (`auto-fill, minmax(300px, 1fr)`) — Bento 느낌
- **주문서**: 2컬럼 (폼 + sticky 요약)
- **관리자**: Sidebar + Main 레이아웃

### 컬러 전략
- Primary: 포도 보라 (`#6b3fa0`) — 자연스럽고 프리미엄한 이미지
- Accent: 황금 포도 (`#c8a951`) — 신뢰/품질 강조

### 모바일 대응
- 768px 미만: 1컬럼 상품 그리드
- 주문서: 요약 블록이 폼 아래로 이동
- 관리자: 사이드바 숨김 (모바일 admin은 Phase 7에서 추가 검토)

---

## Phase 4 연동 체크리스트

- [ ] `useProducts` hook → `GET /products` (bkend.ai)
- [ ] `useOrder` hook → `POST /orders` + 토스페이먼츠 confirm
- [ ] `useAdmin` hook → bkend.ai 관리자 인증
- [ ] 카카오 우편번호 API 연동 (`OrderForm`)
- [ ] 관리자 `PATCH /orders/:id` 상태 변경
