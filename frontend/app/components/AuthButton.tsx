'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function AuthButton() {
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm font-semibold text-slate-700 sm:inline">
          Hi, {user.name}
        </span>
        <button
          onClick={logout}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          Keluar
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/auth/login"
        className="rounded-full bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-3 py-1.5 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600"
      >
        Masuk
      </Link>
      <Link
        href="/auth/register"
        className="rounded-full border border-sky-200 bg-white px-3 py-1.5 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
      >
        Daftar
      </Link>
    </div>
  );
}