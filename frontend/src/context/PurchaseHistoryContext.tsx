'use client';

import { PurchaseHistoryItem } from '@/types';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

interface PurchaseHistoryContextValue {
  history: PurchaseHistoryItem[];
  addPurchase: (item: PurchaseHistoryItem) => void;
  isHydrated: boolean;
}

const HISTORY_STORAGE_KEY = 'demo-purchase-history';

const PurchaseHistoryContext = createContext<PurchaseHistoryContextValue | undefined>(undefined);

function getStorageKey(userEmail?: string | null) {
  const identityKey = userEmail?.trim().toLowerCase() || 'guest';
  return `${HISTORY_STORAGE_KEY}:${identityKey}`;
}

export function PurchaseHistoryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [history, setHistory] = useState<PurchaseHistoryItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const storageKey = useMemo(() => getStorageKey(user?.email), [user?.email]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHistory([]);
      setIsHydrated(true);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as PurchaseHistoryItem[];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.warn('Failed to parse purchase history', err);
      setHistory([]);
    }

    setIsHydrated(true);
  }, [storageKey]);

  useEffect(() => {
    if (!isHydrated || typeof window === 'undefined') return;
    window.localStorage.setItem(storageKey, JSON.stringify(history));
  }, [history, isHydrated, storageKey]);

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