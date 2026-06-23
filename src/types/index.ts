export interface BaseDocument {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product extends BaseDocument {
  name: string;
  variety: string;
  description: string;
  pricePerKg: number;
  options: ProductOption[];
  imageUrl: string;
  stock: number;
  isAvailable: boolean;
}

export interface ProductOption {
  weight: number; // kg
  price: number;
  label: string;  // "2kg", "4kg" 등
}

export interface Order extends BaseDocument {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryAddress: string;
  deliveryDetailAddress: string;
  postalCode: string;
  requestedDeliveryDate?: string;
  deliveryNote?: string;
  recipientName?: string;
  recipientPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: 'card' | 'kakaopay' | 'tosspay';
  paymentKey?: string;
  status: OrderStatus;
}

export type OrderStatus =
  | 'pending'    // 결제 대기
  | 'paid'       // 결제 완료
  | 'preparing'  // 포장 중
  | 'shipped'    // 발송 완료
  | 'delivered'  // 배송 완료
  | 'cancelled'; // 취소

export interface OrderItem {
  productId: string;
  productName: string;
  weight: number;
  quantity: number;
  price: number;
}

export interface CartItem {
  productId: string;
  productName: string;
  weight: number;
  quantity: number;
  price: number;
}
