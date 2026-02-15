'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthButton } from './AuthButton';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { usePurchaseHistory } from '../../src/context/PurchaseHistoryContext';
import { CartIcon, HistoryIcon, HomeIcon, SparkleIcon } from './Icons';

export function Header() {
  const { user } = useAuth();
  const { items } = useCart();
  const { history } = usePurchaseHistory();
  const pathname = usePathname();

  const initials = user?.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const totalItems = items.reduce((count, item) => count + item.quantity, 0);

  const navLinkClass = (active: boolean) =>
    `group relative inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold transition ${
      active
        ? 'bg-white text-sky-700 shadow-md'
        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-4 py-2 text-lg font-bold text-white shadow-lg transition hover:shadow-xl"
          >
            <SparkleIcon className="h-5 w-5" />
            <span>MyShop</span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className={navLinkClass(pathname === '/')} aria-label="Beranda">
              <HomeIcon className="h-5 w-5" />
              <span className="sr-only">Home</span>
            </Link>
            <Link href="/cart" className={navLinkClass(pathname === '/cart')} aria-label="Keranjang">
              <div className="relative">
                <CartIcon className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="sr-only">Cart</span>
            </Link>
            <Link
              href="/purchase-history"
              className={navLinkClass(pathname === '/purchase-history')}
              aria-label="Riwayat Pembelian"
            >
              <div className="relative">
                <HistoryIcon className="h-5 w-5" />
                {history.length > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-sky-500 px-1 text-[10px] font-bold text-white shadow-sm">
                    {history.length}
                  </span>
                )}
              </div>
              <span className="sr-only">Riwayat Pembelian</span>
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {user && (
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-2 text-sm shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 text-xs font-semibold text-white">
                {initials}
              </div>
              <div className="leading-tight">
                <p className="font-semibold text-slate-900">{user.name}</p>
                <p className="text-xs text-emerald-700">{user.email}</p>
              </div>
            </div>
          )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}