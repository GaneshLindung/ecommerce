'use client';

import { apiPost } from '@/lib/api';
import Link from 'next/link';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await apiPost<{ message: string }>('/auth/register', {
        name,
        email,
        password,
      });
      setMessage(response.message);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : 'Gagal mendaftar.';
      setError(errMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Registrasi</h1>
        <p className="text-gray-600">
          Daftar untuk mulai berbelanja dan cek email Anda untuk verifikasi akun.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium">Nama</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
        >
          {isSubmitting ? 'Mengirim...' : 'Daftar'}
        </button>
      </form>

      {message && (
        <div className="p-3 rounded bg-green-50 text-green-800 border border-green-200">
          {message}
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-800 border border-red-200">
          {error}
        </div>
      )}

      <p className="text-sm text-gray-600">
        Sudah punya akun?{' '}
        <Link href="/" className="text-blue-600 underline">
          Kembali ke beranda
        </Link>
      </p>
    </div>
  );
}