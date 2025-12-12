'use client';

import { apiGet } from '@/lib/api';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Token verifikasi tidak ditemukan.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiGet<{ message: string }>(
          `/auth/verify?token=${encodeURIComponent(token)}`,
        );
        setMessage(response.message);
      } catch (err) {
        const errMessage =
          err instanceof Error ? err.message : 'Gagal memverifikasi akun.';
        setError(errMessage);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token]);

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Verifikasi Akun</h1>
      {isLoading && <p>Memproses verifikasi...</p>}

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
    </div>
  );
}