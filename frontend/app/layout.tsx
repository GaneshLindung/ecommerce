import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import Providers from './providers';
import { Header } from './components/Header';

export const metadata: Metadata = {
  title: 'Ecommerce Demo',
  description: 'Simple ecommerce with Next.js + NestJS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50/70 text-gray-900">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_20%,#a5f3fc_0,transparent_25%),radial-gradient(circle_at_90%_10%,#c7d2fe_0,transparent_25%),radial-gradient(circle_at_20%_80%,#bbf7d0_0,transparent_25%),radial-gradient(circle_at_80%_80%,#fce7f3_0,transparent_25%)]" />
        <Providers>
          <Header />
          <main className="max-w-6xl mx-auto p-6 md:p-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}