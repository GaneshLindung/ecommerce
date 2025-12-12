'use client';

import Link from 'next/link';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-6 py-4 border-b bg-white/70 sticky top-0 z-40">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="font-bold text-xl">
          MyShop
        </Link>
        <nav className="space-x-4 text-sm">
          <Link href="/">Home</Link>
          <Link href="/cart">Cart</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3 self-end md:self-auto">
        {user && (
          <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-2 rounded-full border">
            <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-xs font-semibold">
              {initials}
            </div>
            <div>
              <p className="font-semibold leading-tight">{user.name}</p>
              <p className="text-xs text-green-700">{user.email}</p>
            </div>
          </div>
        )}
        <AuthButton />
      </div>
    </header>
  );
}