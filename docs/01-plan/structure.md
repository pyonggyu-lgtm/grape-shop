# 폴더 구조 규칙

## 전체 구조

```
grape-shop/
├── src/
│   ├── app/                        # Next.js App Router 페이지
│   │   ├── (shop)/                 # 고객용 페이지 그룹
│   │   │   ├── page.tsx            # 메인 (상품 소개)
│   │   │   ├── order/
│   │   │   │   ├── page.tsx        # 주문서 작성
│   │   │   │   └── complete/
│   │   │   │       └── page.tsx    # 주문 완료
│   │   ├── (admin)/                # 관리자 페이지 그룹
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx        # 관리자 로그인
│   │   │   │   ├── orders/
│   │   │   │   │   └── page.tsx    # 주문 관리
│   │   │   │   └── products/
│   │   │   │       └── page.tsx    # 상품 관리
│   │   ├── api/                    # API Routes (결제 승인 등)
│   │   │   └── payment/
│   │   │       └── confirm/
│   │   │           └── route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── ui/                     # 재사용 공통 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   └── features/               # 기능별 컴포넌트
│   │       ├── product/
│   │       │   ├── ProductCard.tsx
│   │       │   └── ProductOptionSelector.tsx
│   │       ├── cart/
│   │       │   └── CartDrawer.tsx
│   │       ├── order/
│   │       │   └── OrderForm.tsx
│   │       └── admin/
│   │           └── AdminOrderTable.tsx
│   │
│   ├── hooks/                      # 커스텀 훅
│   │   ├── useProducts.ts
│   │   ├── useOrder.ts
│   │   └── usePayment.ts
│   │
│   ├── stores/                     # Zustand 전역 상태
│   │   └── cart-store.ts
│   │
│   ├── lib/                        # 유틸리티
│   │   ├── bkend.ts               # bkend.ai 클라이언트
│   │   └── utils.ts               # 공통 유틸 (금액 포맷 등)
│   │
│   └── types/                      # TypeScript 타입
│       └── index.ts
│
└── docs/
    ├── 01-plan/                    # Phase 1-2 산출물
    │   ├── schema.md
    │   ├── naming.md
    │   └── structure.md
    ├── 02-design/                  # Phase 3-7 산출물
    ├── 03-analysis/                # Gap 분석
    └── 04-report/                  # 완료 보고서
```

## 레이어 의존 규칙

```
app/ (페이지)
  └── 의존 가능 → components/, hooks/, stores/, lib/, types/

components/ (컴포넌트)
  └── 의존 가능 → hooks/, stores/, lib/, types/
  └── 의존 불가 → app/ (순환 금지)

hooks/ (훅)
  └── 의존 가능 → lib/, types/
  └── 의존 불가 → components/, app/

stores/ (상태)
  └── 의존 가능 → types/
  └── 의존 불가 → components/, hooks/, app/

lib/ (유틸)
  └── 의존 가능 → types/
  └── 의존 불가 → 나머지 모두
```
