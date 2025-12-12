import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import Link from 'next/link';

function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m3.75 9 7.5-6 7.5 6v9.75a.75.75 0 0 1-.75.75h-3.75v-6h-6v6H4.5a.75.75 0 0 1-.75-.75z"
      />
    </svg>
  );
}

function CartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      aria-hidden
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386a.75.75 0 0 1 .733.568l.383 1.532m0 0 1.158 4.63a2.25 2.25 0 0 0 2.186 1.72h6.535a2.25 2.25 0 0 0 2.186-1.72l1.101-4.43a.75.75 0 0 0-.728-.93H4.852m-.75 0-.383-1.532M9 21.75A1.125 1.125 0 0 1 7.875 20.625 1.125 1.125 0 0 1 9 19.5a1.125 1.125 0 0 1 1.125 1.125A1.125 1.125 0 0 1 9 21.75Zm8.25 0A1.125 1.125 0 0 1 16.125 20.625 1.125 1.125 0 0 1 17.25 19.5a1.125 1.125 0 0 1 1.125 1.125A1.125 1.125 0 0 1 17.25 21.75Z"
      />
    </svg>
  );
}

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
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded p-2 hover:bg-gray-100"
                aria-label="Beranda"
              >
                <HomeIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center rounded p-2 hover:bg-gray-100"
                aria-label="Keranjang"
              >
                <CartIcon className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded px-3 py-2 bg-blue-600 text-white hover:bg-blue-700"
              >
                Daftar
              </Link>
            </nav>
          </header>
          <main className="max-w-5xl mx-auto p-6">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
