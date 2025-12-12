'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { apiPost } from '@/lib/api';

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
    <div className="mx-auto max-w-3xl space-y-6 rounded-2xl bg-white/70 p-8 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-sky-600">Mulai Sekarang</p>
          <h1 className="text-2xl font-bold text-gray-900">Buat akun MyShop</h1>
          <p className="text-sm text-gray-600">
            Simpan informasi pengiriman dan nikmati checkout lebih cepat.
          </p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Gratis</span>
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
        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p>
      )}
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <p className="text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="font-semibold text-sky-600 hover:text-sky-700">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}