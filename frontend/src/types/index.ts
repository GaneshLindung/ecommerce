export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderItemPayload {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
}

export interface OrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  items: OrderItemPayload[];
}

export interface PurchaseHistoryItem {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  shippingMethod: string;
  paymentMethod: string;
  notes?: string;
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}