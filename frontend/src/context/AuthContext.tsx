'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

interface AccountRecord {
  name: string;
  email: string;
  password: string;
  verified: boolean;
}

interface AuthContextValue {
  user: AccountRecord | null;
  pendingVerificationEmail: string | null;
  register: (name: string, email: string, password: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const ACCOUNTS_KEY = 'demo-auth-accounts';
const SESSION_KEY = 'demo-auth-session';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function loadAccounts(): AccountRecord[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AccountRecord[];
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.warn('Failed to parse accounts from localStorage', err);
  }
  return [];
}

function loadSession(): AccountRecord | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AccountRecord;
  } catch (err) {
    console.warn('Failed to parse auth session', err);
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<AccountRecord[]>(() => loadAccounts());
  const [user, setUser] = useState<AccountRecord | null>(() => loadSession());
  const [pendingVerificationEmail, setPendingVerificationEmail] =
    useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Safe hydration marker to avoid mismatches when client-only data (localStorage) becomes available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (user) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [user]);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const normalizedEmail = normalizeEmail(email);
      const existing = accounts.find((acc) => acc.email === normalizedEmail);

      if (existing && existing.verified) {
        throw new Error('Email sudah terdaftar. Silakan login.');
      }

      const updatedAccounts = accounts.filter(
        (acc) => acc.email !== normalizedEmail,
      );

      const newAccount: AccountRecord = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        verified: false,
      };

      setAccounts([...updatedAccounts, newAccount]);
      setPendingVerificationEmail(normalizedEmail);
      setUser(null);
    },
    [accounts],
  );

  const verifyEmail = useCallback(async () => {
    if (!pendingVerificationEmail) {
      throw new Error('Tidak ada pendaftaran yang perlu diverifikasi.');
    }

    const normalizedEmail = normalizeEmail(pendingVerificationEmail);
    const updatedAccounts = accounts.map((acc) =>
      acc.email === normalizedEmail ? { ...acc, verified: true } : acc,
    );

    const verifiedAccount = updatedAccounts.find(
      (acc) => acc.email === normalizedEmail,
    );

    if (!verifiedAccount) {
      throw new Error('Akun tidak ditemukan. Silakan daftar ulang.');
    }

    setAccounts(updatedAccounts);
    setUser(verifiedAccount);
    setPendingVerificationEmail(null);
  }, [accounts, pendingVerificationEmail]);

  const login = useCallback(
    async (email: string, password: string) => {
      const normalizedEmail = normalizeEmail(email);
      const account = accounts.find((acc) => acc.email === normalizedEmail);

      if (!account) {
        throw new Error('Email belum terdaftar. Silakan daftar terlebih dahulu.');
      }

      if (!account.verified) {
        setPendingVerificationEmail(account.email);
        throw new Error('Akun belum diverifikasi. Silakan cek email Anda.');
      }

      if (account.password !== password) {
        throw new Error('Password tidak sesuai.');
      }

      setUser(account);
    },
    [accounts],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user: isHydrated ? user : null,
      pendingVerificationEmail,
      register,
      verifyEmail,
      login,
      logout,
    }),
    [
      isHydrated,
      login,
      logout,
      pendingVerificationEmail,
      register,
      user,
      verifyEmail,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}