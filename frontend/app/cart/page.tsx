'use client';

import { useCart } from '@/context/CartContext';
import { apiPost } from '@/lib/api';
import { OrderPayload } from '@/types';
import { FormEvent, useState } from 'react';

export default function CartPage() {
  const { items, totalPrice, removeFromCart, clearCart } = useCart();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const payload: OrderPayload = {
      customerName: name,
      customerEmail: email,
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    };

    try {
      setLoading(true);
      await apiPost('/orders', payload);
      clearCart();
      setSuccessMsg('Order berhasil dibuat!');
      setName('');
      setEmail('');
    } catch (err) {
      console.error(err);
      alert('Gagal membuat order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4">Keranjang</h1>
        {items.length === 0 && <p>Keranjang kosong.</p>}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.quantity} x Rp{' '}
                  {Number(item.price).toLocaleString('id-ID')}
                </p>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-xs text-red-600"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Ringkasan</h2>
        <p className="mb-4">
          Total:{' '}
          <strong>
            Rp {Number(totalPrice).toLocaleString('id-ID')}
          </strong>
        </p>

        <form onSubmit={handleCheckout} className="space-y-3">
          <input
            type="text"
            placeholder="Nama"
            className="w-full border rounded px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="w-full border rounded px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Checkout'}
          </button>
        </form>

        {successMsg && (
          <p className="mt-3 text-sm text-green-700">{successMsg}</p>
        )}
      </div>
    </div>
  );
}
