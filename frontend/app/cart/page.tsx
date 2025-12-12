'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { apiPost } from '@/lib/api';

const shippingOptions = [
  { value: 'regular', label: 'Reguler (3-5 hari)' },
  { value: 'express', label: 'Express (1-2 hari)' },
  { value: 'pickup', label: 'Ambil di toko' },
];

const paymentOptions = [
  { value: 'bank-transfer', label: 'Transfer Bank' },
  { value: 'ewallet', label: 'E-Wallet' },
  { value: 'cod', label: 'Bayar di Tempat (COD)' },
];

export default function CartPage() {
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
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
      await apiPost('/orders', payload);
      clearCart();
      setSuccessMsg('Order berhasil dibuat! Kami telah mengirim detail ke email Anda.');
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
      alert('Gagal membuat order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-sky-50 via-white to-emerald-50 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
        <p className="mt-1 text-sm text-gray-600">
          Lengkapi data pelanggan dan pilih metode pengiriman serta pembayaran
          favorit Anda.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur">
            <div className="flex items-center justify-between pb-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Ringkasan Keranjang
                </p>
                <h2 className="text-lg font-semibold text-gray-800">
                  {totalItems} item · Rp {Number(totalPrice).toLocaleString('id-ID')}
                </h2>
              </div>
              <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                Aktif
              </span>
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
                      className="text-xs font-semibold text-red-600 hover:text-red-700"
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
            className="space-y-4 rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Data Pelanggan
                </p>
                <h2 className="text-lg font-semibold text-gray-800">
                  Informasi kontak & alamat
                </h2>
              </div>
              <span className="text-xs text-gray-500">Wajib diisi *</span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  placeholder="Masukkan nama"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  placeholder="nama@email.com"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Kode Pos</label>
                <input
                  type="text"
                  placeholder="contoh: 12345"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <input
                  type="text"
                  placeholder="Nama jalan, nomor rumah, patokan"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Kota/Kabupaten</label>
                <input
                  type="text"
                  placeholder="contoh: Jakarta"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Metode Pengiriman</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  required
                >
                  {shippingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Metode Pembayaran</label>
                <select
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  required
                >
                  {paymentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Catatan untuk pesanan</label>
                <textarea
                  placeholder="Tuliskan permintaan khusus (opsional)"
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="space-y-3 rounded-xl border bg-white/70 p-4 shadow-sm backdrop-blur">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Pembayaran
              </p>
              <h2 className="text-lg font-semibold text-gray-800">Ringkasan akhir</h2>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Aman & terjamin
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Total produk</span>
              <span>{totalItems} item</span>
            </div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rp {Number(totalPrice).toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Biaya pengiriman</span>
              <span>Ditentukan oleh metode pengiriman</span>
            </div>
          </div>

          <button
            type="submit"
            form="checkout-form"
            disabled={loading || items.length === 0}
            className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-sky-600 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Memproses pesanan...' : 'Buat Pesanan'}
          </button>

          {successMsg && (
            <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              {successMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}