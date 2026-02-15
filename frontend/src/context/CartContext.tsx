'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { CartItem, Product } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  totalPrice: number;
  isHydrated: boolean;
}

const CART_STORAGE_KEY = 'demo-cart-items';

const CartContext = createContext<CartContextValue | undefined>(undefined);

function getStorageKey(userEmail?: string | null) {
  const identityKey = userEmail?.trim().toLowerCase() || 'guest';
  return `${CART_STORAGE_KEY}:${identityKey}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const storageKey = useMemo(() => getStorageKey(user?.email), [user?.email]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setItems([]);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CartItem[];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.warn('Failed to parse cart items', err);
      setItems([]);
    }

    setIsHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [isHydrated, items, storageKey]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCart = () => setItems([]);

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, clearCart, totalPrice, isHydrated }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
