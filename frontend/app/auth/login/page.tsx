'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { apiPost } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CartIcon, SparkleIcon } from '../../components/Icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setSessionUser } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      setError('');
      const data = await apiPost<{ user: { name: string; email: string } }>(
        '/auth/login',
        { email, password },
      );
      setSessionUser({
        name: data.user.name,
        email: data.user.email,
        verified: true,
      });
      setMessage('Login berhasil! Anda akan dialihkan.');
      setEmail('');
      setPassword('');
      router.push('/');
    } catch (err) {
      const error = err as Error & { status?: number };
      if (error?.status === 401) {
        setError('Email atau password salah. Silakan coba lagi.');
        return;
      }
      setError(error?.message || 'Gagal masuk. Silakan coba lagi nanti.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur md:grid-cols-2 md:p-10">
      <div className="flex flex-col justify-between space-y-6 rounded-2xl bg-gradient-to-br from-sky-500 via-sky-400 to-emerald-400 p-6 text-white shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <SparkleIcon className="h-4 w-4" />
            Kembali berbelanja
          </div>
          <h1 className="text-3xl font-black leading-tight">Selamat datang kembali!</h1>
          <p className="text-sm text-white/80">
            Masuk untuk melihat pesanan, wishlist, dan promo eksklusif yang kami siapkan untuk Anda.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Metode pembayaran aman dan terpercaya
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Metode pembayaran aman dan terpercaya
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Akses riwayat belanja kapan saja
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Promo khusus member aktif
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-600">Selamat datang</p>
            <h2 className="text-2xl font-bold text-gray-900">Masuk ke akun Anda</h2>
            <p className="text-sm text-gray-600">Isi email dan password untuk mulai belanja.</p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CartIcon className="h-4 w-4" />
            Pengguna prioritas
          </span>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@contoh.com"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600 disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'Masuk Sekarang'}
          </button>
        </form>

        {message && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" aria-live="polite">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" aria-live="assertive">
            {error}
          </p>
        )}

        <p className="text-sm text-gray-600">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-semibold text-sky-600 hover:text-sky-700">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}