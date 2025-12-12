'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { Product } from '@/types';
import Image from 'next/image';
import { AddToCartButton } from '../../components/AddToCartButton';

export default function ProductPage() {
  // Ambil ID dari URL: /product/[id]
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // kalau belum ada id, jangan fetch dulu

    async function load() {
      try {
        const data = await apiGet<Product>(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError('Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>{error ?? 'Produk tidak ditemukan'}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">detail produk</p>
            <h1 className="text-3xl font-black text-slate-900">{product.name}</h1>
            <p className="text-sm text-slate-600">Lihat detail lengkap sebelum menambahkan ke keranjang.</p>
          </div>
          <div className="rounded-full bg-gradient-to-r from-sky-500/90 to-emerald-500/90 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            Stok tersedia: {product.stock}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-sm">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={720}
              height={540}
              sizes="(min-width: 1024px) 640px, 100vw"
              className="h-96 w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-96 items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 text-slate-500">
              Foto produk belum tersedia
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm text-slate-600">{product.description}</p>
            <p className="text-3xl font-black text-slate-900">
              Rp {Number(product.price).toLocaleString('id-ID')}
            </p>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">tersedia</p>
          </div>

          <div className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Pengiriman cepat ke seluruh Indonesia
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Pembayaran aman dan terlindungi
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Garansi pengembalian sesuai kebijakan
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AddToCartButton product={product} />
            <span className="text-sm text-slate-600">Tersisa {product.stock} unit di gudang kami.</span>
          </div>
        </div>
      </div>
    </div>
  );
}