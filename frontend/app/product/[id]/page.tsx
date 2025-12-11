'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiGet } from '@/lib/api';
import { Product } from '@/types';
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="mb-2 text-gray-700">{product.description}</p>
        <p className="text-xl font-bold mb-2">
          Rp {Number(product.price).toLocaleString('id-ID')}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Stok tersedia: {product.stock}
        </p>

        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
