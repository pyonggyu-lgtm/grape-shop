# 명명 규칙 (Naming Rules)

## 컴포넌트

```
ProductCard.tsx        ← 상품 카드
ProductOptionSelector.tsx ← 중량 옵션 선택
CartDrawer.tsx         ← 장바구니 사이드 패널
OrderForm.tsx          ← 주문서 작성 폼
OrderStatusBadge.tsx   ← 주문 상태 배지
AdminOrderTable.tsx    ← 관리자 주문 목록
```

## 훅 (Hooks)

```
useProducts.ts         ← 상품 목록 조회
useOrder.ts            ← 주문 생성/조회
usePayment.ts          ← 토스페이먼츠 결제 처리
useAdmin.ts            ← 관리자 권한 확인
```

## API 쿼리 키

```typescript
// TanStack Query 쿼리 키 네이밍
['products']                    // 상품 목록
['products', productId]         // 상품 상세
['orders']                      // 주문 목록 (관리자)
['orders', orderNumber]         // 주문 상세
```

## 라우트 구조

```
/                       ← 메인 (상품 소개)
/order                  ← 주문서 작성
/order/complete         ← 주문 완료
/admin                  ← 관리자 로그인
/admin/orders           ← 주문 관리
/admin/products         ← 상품 관리
```

## bkend.ai 컬렉션명

```
products    ← 상품 (단수 복수 혼용 금지, 복수형으로 통일)
orders      ← 주문
admins      ← 관리자 계정
```
