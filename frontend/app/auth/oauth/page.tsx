'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

type MeResponse = {
  id: number;
  name: string;
  email: string;
  googleId?: string | null;
  provider?: 'local' | 'google';
  createdAt: string;
};

export default function OAuthReceiverPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { setSessionUser } = useAuth();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const token = params.get('token');
    if (!token) {
      setError('Token OAuth tidak ditemukan.');
      return;
    }

    const run = async () => {
      try {
        window.localStorage.setItem('auth-token', token);

        const api = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(`${api}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });

        if (!res.ok) throw new Error(`Gagal mengambil profil: ${res.status}`);

        const me = (await res.json()) as MeResponse;

        setSessionUser({
          name: me.name,
          email: me.email,
          verified: true,
        });

        router.replace('/');
      } catch (e) {
        const err = e as Error;
        setError(err.message || 'OAuth gagal.');
      }
    };

    void run();
  }, [params, router, setSessionUser]);

  return (
    <div className="mx-auto max-w-lg rounded-2xl border bg-white p-6 shadow">
      <h1 className="text-xl font-bold">Memproses login Google…</h1>
      <p className="mt-2 text-sm text-gray-600">
        Mohon tunggu sebentar.
      </p>
      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
