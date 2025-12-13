'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export function ProfileCard() {
  const { user } = useAuth();
  const initials = user?.name?.charAt(0)?.toUpperCase() ?? 'P';

  if (!user) {
    return (
      <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-sky-50 via-white to-emerald-50 p-4 shadow-sm">
        <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-sky-100 blur-2xl" />
        <div className="absolute -bottom-8 right-2 h-12 w-12 rounded-full bg-emerald-100 blur-2xl" />
        <div className="relative space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-700 shadow-sm">
            Profil belum aktif
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">Masuk dulu, belanja jadi lebih mudah</h2>
            <p className="text-sm text-slate-600">Simpan pesanan, alamat, dan rekomendasi produk.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/auth/login"
              className="inline-flex items-center justify-center rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200/70 transition hover:scale-[1.01] hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Masuk
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center rounded-full border border-sky-100 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-gradient-to-br from-white via-sky-50 to-emerald-50 p-4 shadow-sm">
      <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-sky-100 blur-2xl" />
      <div className="absolute -bottom-8 right-2 h-12 w-12 rounded-full bg-emerald-100 blur-2xl" />

      <div className="relative space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 text-base font-bold text-white shadow-md shadow-sky-200/80">
            {initials}
          </div>
          <div className="space-y-0.5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Profil</p>
            <h3 className="text-lg font-semibold text-slate-900">{user.name}</h3>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Email terverifikasi
            </span>
          </div>
        </div>

        <div className="grid gap-2 rounded-lg bg-white/80 p-3 text-sm text-slate-700">
          <div className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-sky-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 12c2.761 0 5-2.015 5-4.5S14.761 3 12 3 7 5.015 7 7.5 9.239 12 12 12z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 19.25c0-2.9 3.134-4.75 7-4.75s7 1.85 7 4.75"
              />
            </svg>
            <span className="font-medium text-slate-900">{user.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-sky-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6c0-1.105.895-2 2-2h12c1.105 0 2 .895 2 2v12c0 1.105-.895 2-2 2H6c-1.105 0-2-.895-2-2V6z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8l7.382 4.319a2 2 0 001.999 0L21 8" />
            </svg>
            <span className="truncate" title={user.email}>
              {user.email}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-4 w-4 text-sky-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6v6l3.5 2"
              />
              <circle cx="12" cy="12" r="9" />
            </svg>
            <span className="text-slate-600">Aktif sejak {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}