'use client';

import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <button
      onClick={() => addToCart(product)}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200/60 transition duration-200 hover:scale-[1.02] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 sm:w-auto"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 4h2l1 12h12l1.5-9H6.5M10 10h4m-2-2v4M9.5 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm7 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>
      Tambah ke Keranjang
    </button>
  );
}