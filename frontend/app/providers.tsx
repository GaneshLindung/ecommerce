'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { PurchaseHistoryProvider } from '@/context/PurchaseHistoryContext';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <PurchaseHistoryProvider>
        <CartProvider>{children}</CartProvider>
      </PurchaseHistoryProvider>
    </AuthProvider>
  );
}