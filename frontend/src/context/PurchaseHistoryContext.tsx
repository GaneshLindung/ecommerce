'use client';

import { PurchaseHistoryItem } from '@/types';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

interface PurchaseHistoryContextValue {
  history: PurchaseHistoryItem[];
  addPurchase: (item: PurchaseHistoryItem) => void;
  isHydrated: boolean;
}

const HISTORY_STORAGE_KEY = 'demo-purchase-history';

const PurchaseHistoryContext = createContext<PurchaseHistoryContextValue | undefined>(undefined);

function loadHistory(): PurchaseHistoryItem[] {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as PurchaseHistoryItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn('Failed to parse purchase history', err);
    return [];
  }
}

export function PurchaseHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHistory(loadHistory());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  }, [history, isHydrated]);

  const addPurchase = (item: PurchaseHistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const value = useMemo(() => ({ history, addPurchase, isHydrated }), [history, isHydrated]);

  return (
    <PurchaseHistoryContext.Provider value={value}>
      {children}
    </PurchaseHistoryContext.Provider>
  );
}

export function usePurchaseHistory() {
  const ctx = useContext(PurchaseHistoryContext);
  if (!ctx) throw new Error('usePurchaseHistory must be used within PurchaseHistoryProvider');
  return ctx;
}