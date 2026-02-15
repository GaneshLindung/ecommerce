'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { apiPost } from '@/lib/api';
import { usePurchaseHistory } from '@/context/PurchaseHistoryContext';
import { BankIcon, CartIcon, CashIcon, SparkleIcon, WalletIcon } from '../components/Icons';

const shippingOptions = [
  { value: 'regular', label: 'Reguler (3-5 hari)' },
  { value: 'express', label: 'Express (1-2 hari)' },
  { value: 'pickup', label: 'Ambil di toko' },
];

const paymentOptions = [
  { value: 'bank-transfer', label: 'Transfer Bank', Icon: BankIcon },
  { value: 'ewallet', label: 'E-Wallet', Icon: WalletIcon },
  { value: 'cash', label: 'Tunai', Icon: CashIcon },
];

export default function CartPage() {
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
  const { addPurchase } = usePurchaseHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [shippingMethod, setShippingMethod] = useState(shippingOptions[0].value);
  const [paymentMethod, setPaymentMethod] = useState(paymentOptions[0].value);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const totalItems = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items],
  );

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const payload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      addressLine: address,
      city,
      postalCode,
      shippingMethod,
      paymentMethod,
      notes: notes || undefined,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);
      setSuccessMsg('');
      setErrorMsg('');
      await apiPost('/orders', payload);
      addPurchase({
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        addressLine: address,
        city,
        postalCode,
        shippingMethod,
        paymentMethod,
        notes: notes || undefined,
        items: items.map((item) => ({ ...item })),
        totalPrice,
        totalItems,
      });
      clearCart();
      setSuccessMsg('Order berhasil dibuat! Riwayat pembelian sudah tersimpan.');
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setCity('');
      setPostalCode('');
      setShippingMethod(shippingOptions[0].value);
      setPaymentMethod(paymentOptions[0].value);
      setNotes('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Gagal membuat order. Coba lagi dalam beberapa saat.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              <CartIcon className="h-4 w-4" />
              checkout nyaman
            </div>
            <h1 className="text-3xl font-black text-slate-900">Selesaikan pesanan Anda</h1>
            <p className="text-sm text-slate-600">
              Pastikan data pengiriman akurat agar kurir dapat mengantarkan paket tepat waktu.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-4 py-3 text-sm font-semibold text-white shadow-lg">
            <SparkleIcon className="h-4 w-4" />
            {totalItems} item · Rp {Number(totalPrice).toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">Ringkasan Keranjang</p>
                <h2 className="text-lg font-semibold text-gray-800">
                  {totalItems} item · Rp {Number(totalPrice).toLocaleString('id-ID')}
                </h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">Aktif</span>
            </div>

            {items.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-gray-50 px-4 py-6 text-center text-sm text-gray-600">
                Keranjang kosong. Tambahkan produk untuk melanjutkan checkout.
              </p>
            ) : (
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border px-3 py-2 shadow-sm"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs font-semibold text-red-600 transition hover:text-red-700"
                    >
                      Hapus
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Data Pengiriman</h2>
              <span className="text-xs text-gray-500">Lengkapi sebelum checkout</span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input type="email" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input type="tel" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Kode Pos</label>
                <input type="text" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <input type="text" placeholder="Nama jalan, nomor rumah, kecamatan" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Kota</label>
                <input type="text" placeholder="contoh: Jakarta" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={city} onChange={(e) => setCity(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Catatan untuk kurir</label>
                <input type="text" placeholder="Opsional" className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Metode Pengiriman</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                >
                  {shippingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
                <div className="grid gap-2">
                  {paymentOptions.map(({ value, label, Icon }) => (
                    <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${paymentMethod === value ? 'border-sky-300 bg-sky-50 text-sky-800' : 'border-slate-200 bg-white text-slate-700 hover:border-sky-200'}`}>
                      <input type="radio" name="paymentMethod" value={value} checked={paymentMethod === value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="leading-tight text-sm text-gray-600">
                <p className="font-semibold text-gray-800">Total</p>
                <p>Rp {Number(totalPrice).toLocaleString('id-ID')}</p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                {errorMsg && (
                  <p className="flex-1 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" aria-live="assertive">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading || items.length === 0}
                  className="flex-1 rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600 disabled:opacity-60"
                >
                  {loading ? 'Memproses...' : 'Buat Pesanan'}
                </button>
              </div>
            </div>

            {successMsg && (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" aria-live="polite">
                {successMsg}
              </p>
            )}
          </form>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-gray-500">Keamanan</p>
            <h3 className="text-lg font-semibold text-gray-800">Pembayaran aman & terjamin</h3>
            <p className="text-sm text-gray-600">
              Transaksi dilindungi protokol keamanan terbaru dengan beberapa opsi pembayaran tepercaya.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-gray-500">Pengiriman</p>
            <h3 className="text-lg font-semibold text-gray-800">Kirim cepat, tracking real-time</h3>
            <p className="text-sm text-gray-600">
              Semua pesanan mendapatkan nomor resi yang dapat diikuti langsung dari halaman akun Anda.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm backdrop-blur">
            <p className="text-xs uppercase tracking-wide text-gray-500">Dukungan</p>
            <h3 className="text-lg font-semibold text-gray-800">Tim bantuan siap 24/7</h3>
            <p className="text-sm text-gray-600">
              Hubungi kami kapan saja jika ada kendala pada pesanan atau pembayaran Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}