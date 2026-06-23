# API 설계 명세

## bkend.ai 컬렉션 API (자동 생성)

### 상품 (products)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| GET | `/data/products` | 상품 목록 | 전체 |
| GET | `/data/products/:id` | 상품 상세 | 전체 |
| POST | `/data/products` | 상품 등록 | 관리자 |
| PATCH | `/data/products/:id` | 상품 수정 | 관리자 |

**목록 조회 파라미터:**
```
GET /data/products?isAvailable=true
```

**응답 예시:**
```json
{
  "_id": "prod_001",
  "name": "샤인머스캣",
  "variety": "샤인머스캣",
  "description": "당도 높고 씨 없는 프리미엄 청포도",
  "options": [
    { "weight": 2, "price": 35000, "label": "2kg" },
    { "weight": 4, "price": 65000, "label": "4kg" }
  ],
  "imageUrl": "/images/shine-muscat.jpg",
  "stock": 200,
  "isAvailable": true
}
```

---

### 주문 (orders)

| Method | Endpoint | 설명 | 권한 |
|--------|----------|------|------|
| POST | `/data/orders` | 주문 생성 (결제 전) | 전체 |
| GET | `/data/orders` | 주문 목록 | 관리자 |
| GET | `/data/orders/:id` | 주문 상세 | 관리자 |
| PATCH | `/data/orders/:id` | 주문 상태 변경 | 관리자 |

**주문 생성 요청:**
```json
{
  "orderNumber": "ORD-20260622-0001",
  "customerName": "홍길동",
  "customerPhone": "010-1234-5678",
  "customerEmail": "hong@example.com",
  "deliveryAddress": "경기도 수원시 팔달구 매산로 1",
  "deliveryDetailAddress": "101호",
  "postalCode": "16234",
  "requestedDeliveryDate": "2026-06-25",
  "deliveryNote": "부재시 경비실에 맡겨주세요",
  "items": [
    {
      "productId": "prod_001",
      "productName": "샤인머스캣",
      "weight": 2,
      "quantity": 1,
      "price": 35000
    }
  ],
  "totalAmount": 35000,
  "paymentMethod": "card",
  "status": "pending"
}
```

---

## Next.js API Routes (서버 전용)

### 결제 승인 — POST /api/payment/confirm

토스페이먼츠 결제 승인을 처리하는 서버 전용 엔드포인트.

**요청:**
```json
{
  "paymentKey": "5zJ4xY7m0kODnyRpQWGrN2xqGlA...",
  "orderId": "ORD-20260622-0001",
  "amount": 35000
}
```

**응답 (성공):**
```json
{
  "success": true,
  "orderNumber": "ORD-20260622-0001"
}
```

**응답 (실패):**
```json
{
  "success": false,
  "message": "결제에 실패했습니다. 다시 시도해 주세요."
}
```

---

## 주문 번호 생성 규칙

```
ORD-{YYYYMMDD}-{4자리 순번}
예: ORD-20260622-0001
```

## 에러 코드

| 코드 | 의미 |
|------|------|
| 400 | 잘못된 요청 (필수 필드 누락) |
| 401 | 인증 필요 (관리자 전용 엔드포인트) |
| 404 | 리소스 없음 |
| 409 | 재고 부족 |
| 500 | 서버 오류 |
