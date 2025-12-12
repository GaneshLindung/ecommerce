'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiPost } from '@/lib/api';
import { CartIcon, SparkleIcon } from '../../components/Icons';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMessage('');
      setError('');
      await apiPost('/auth/register', { name, email, password });
      setMessage('Pendaftaran berhasil! Silakan login untuk melanjutkan.');
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError('Gagal mendaftar. Pastikan email belum terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-2xl backdrop-blur md:grid-cols-2 md:p-10">
      <div className="flex flex-col justify-between space-y-6 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-400 to-sky-400 p-6 text-white shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
            <SparkleIcon className="h-4 w-4" />
            Akun baru
          </div>
          <h1 className="text-3xl font-black leading-tight">Buat akun MyShop</h1>
          <p className="text-sm text-white/80">
            Simpan informasi pengiriman, dapatkan promo terbaru, dan nikmati pengalaman belanja yang personal.
          </p>
        </div>
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Registrasi gratis tanpa biaya tambahan
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Simpan beberapa alamat pengiriman
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white" />
            Pantau status pesanan real-time
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-sky-600">Mulai Sekarang</p>
            <h2 className="text-2xl font-bold text-gray-900">Daftar dan mulai belanja</h2>
            <p className="text-sm text-gray-600">Isi data di bawah untuk membuat akun baru.</p>
          </div>
          <span className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <CartIcon className="h-4 w-4" />
            Semua fitur gratis
          </span>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tuliskan nama Anda"
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
            />
          </div>
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
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
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
          Sudah punya akun?{' '}
          <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}