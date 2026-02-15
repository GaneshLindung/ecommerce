'use client';

import { usePurchaseHistory } from '@/context/PurchaseHistoryContext';
import { BankIcon, CashIcon, HistoryIcon, WalletIcon } from '../components/Icons';

const paymentLabelMap: Record<string, string> = {
  'bank-transfer': 'Transfer Bank',
  ewallet: 'E-Wallet',
  cash: 'Tunai',
};

const shippingLabelMap: Record<string, string> = {
  regular: 'Reguler (3-5 hari)',
  express: 'Express (1-2 hari)',
  pickup: 'Ambil di toko',
};

function PaymentIcon({ method }: { method: string }) {
  if (method === 'bank-transfer') return <BankIcon className="h-4 w-4" />;
  if (method === 'ewallet') return <WalletIcon className="h-4 w-4" />;
  return <CashIcon className="h-4 w-4" />;
}

export default function PurchaseHistoryPage() {
  const { history } = usePurchaseHistory();

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
        <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
          <HistoryIcon className="h-4 w-4" />
          Riwayat Pembelian
        </div>
        <h1 className="mt-3 text-3xl font-black text-slate-900">Daftar transaksi Anda</h1>
        <p className="text-sm text-slate-600">Semua pesanan yang berhasil checkout akan muncul di halaman ini.</p>
      </div>

      {history.length === 0 ? (
        <p className="rounded-2xl border border-dashed bg-white/80 px-4 py-6 text-center text-sm text-slate-600 shadow-sm">
          Belum ada riwayat pembelian. Silakan checkout produk terlebih dahulu.
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((order) => (
            <article key={order.id} className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500">Order ID</p>
                  <p className="font-semibold text-slate-800">{order.id}</p>
                </div>
                <p className="text-sm text-slate-600">
                  {new Date(order.createdAt).toLocaleString('id-ID', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>

              <div className="mt-3 grid gap-2 text-sm text-slate-700 md:grid-cols-2">
                <p><span className="font-semibold">Nama:</span> {order.customerName}</p>
                <p><span className="font-semibold">Email:</span> {order.customerEmail}</p>
                <p><span className="font-semibold">Telepon:</span> {order.customerPhone}</p>
                <p><span className="font-semibold">Pengiriman:</span> {shippingLabelMap[order.shippingMethod] ?? order.shippingMethod}</p>
                <p className="md:col-span-2"><span className="font-semibold">Alamat:</span> {order.addressLine}, {order.city}, {order.postalCode}</p>
                <p className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 w-fit">
                  <PaymentIcon method={order.paymentMethod} />
                  <span className="font-semibold">{paymentLabelMap[order.paymentMethod] ?? order.paymentMethod}</span>
                </p>
              </div>

              <ul className="mt-3 space-y-2">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.id}`} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2 text-sm">
                    <span>{item.name} ({item.quantity}x)</span>
                    <span className="font-semibold">Rp {(Number(item.price) * item.quantity).toLocaleString('id-ID')}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex justify-end text-sm font-semibold text-emerald-700">
                Total: Rp {Number(order.totalPrice).toLocaleString('id-ID')}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}