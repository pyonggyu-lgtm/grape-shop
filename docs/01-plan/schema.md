# 데이터 스키마 설계

## 도메인 용어 (Terminology)

| 한국어 | 영어 | 설명 |
|--------|------|------|
| 상품 | Product | 판매하는 포도 |
| 옵션 | ProductOption | 중량별 선택지 (2kg, 4kg 등) |
| 주문 | Order | 고객이 결제한 구매 건 |
| 주문 항목 | OrderItem | 주문 안의 개별 상품 |
| 장바구니 | Cart | 결제 전 임시 보관 목록 |
| 배송지 | DeliveryAddress | 택배 수령 주소 |
| 주문 상태 | OrderStatus | 주문 진행 단계 |

---

## 데이터 모델

### Product (상품)

| 필드 | 타입 | 설명 |
|------|------|------|
| _id | string | 자동 생성 ID |
| name | string | 상품명 (예: "샤인머스캣") |
| variety | string | 품종 |
| description | string | 상품 설명 |
| options | ProductOption[] | 중량별 옵션 |
| imageUrl | string | 상품 이미지 URL |
| stock | number | 재고 (kg) |
| isAvailable | boolean | 판매 가능 여부 |

### ProductOption (상품 옵션)

| 필드 | 타입 | 설명 |
|------|------|------|
| weight | number | 중량 (kg) |
| price | number | 가격 (원) |
| label | string | 표시 텍스트 ("2kg", "4kg") |

### Order (주문)

| 필드 | 타입 | 설명 |
|------|------|------|
| _id | string | 자동 생성 ID |
| orderNumber | string | 주문번호 (예: ORD-20260622-0001) |
| customerName | string | 주문자 이름 |
| customerPhone | string | 주문자 연락처 |
| customerEmail | string | 주문자 이메일 |
| deliveryAddress | string | 배송지 주소 |
| deliveryDetailAddress | string | 상세 주소 |
| postalCode | string | 우편번호 |
| requestedDeliveryDate | string? | 배송 희망일 |
| deliveryNote | string? | 배송 메모 |
| items | OrderItem[] | 주문 항목 |
| totalAmount | number | 총 결제 금액 |
| paymentMethod | string | 결제 수단 |
| paymentKey | string? | 토스페이먼츠 결제 키 |
| status | OrderStatus | 주문 상태 |

### OrderStatus (주문 상태 흐름)

```
pending → paid → preparing → shipped → delivered
                    ↓
                cancelled
```

| 상태 | 의미 |
|------|------|
| pending | 결제 대기 중 |
| paid | 결제 완료 |
| preparing | 포장 중 |
| shipped | 발송 완료 |
| delivered | 배송 완료 |
| cancelled | 취소됨 |

---

## bkend.ai 컬렉션 구성

| 컬렉션명 | 설명 | 접근 권한 |
|----------|------|-----------|
| products | 상품 정보 | 읽기: 전체 / 쓰기: 관리자 |
| orders | 주문 정보 | 읽기/쓰기: 본인 주문만 / 전체: 관리자 |
