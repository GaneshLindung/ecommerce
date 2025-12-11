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
  items: OrderItemPayload[];
}
