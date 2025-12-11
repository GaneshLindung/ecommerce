'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="w-full border rounded px-3 py-2 text-sm hover:bg-gray-100"
    >
      Tambah ke Keranjang
    </button>
  );
}
