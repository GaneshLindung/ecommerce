import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ecommerce Demo',
  description: 'Simple ecommerce with Next.js + NestJS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <header className="flex items-center justify-between px-6 py-4 border-b">
            <Link href="/" className="font-bold text-xl">
              MyShop
            </Link>
            <nav className="space-x-4">
              <Link href="/">Home</Link>
              <Link href="/cart">Cart</Link>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
