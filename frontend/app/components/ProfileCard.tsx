'use client';

import { useAuth } from '@/context/AuthContext';

export function ProfileCard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="border rounded p-4 bg-gray-50 mb-6">
        <h2 className="font-semibold mb-1">Profil</h2>
        <p className="text-sm text-gray-700">
          Masuk atau daftar dengan tombol di pojok kanan atas untuk melihat
          profil Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded p-4 bg-gray-50 mb-6">
      <h2 className="font-semibold mb-1">Profil</h2>
      <p className="text-sm text-gray-900">{user.name}</p>
      <p className="text-sm text-gray-700">{user.email}</p>
      <p className="text-xs text-green-700 mt-1">Email terverifikasi</p>
    </div>
  );
}