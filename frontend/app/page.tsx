import { apiGet } from '@/lib/api';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { AddToCartButton } from './components/AddToCartButton';
import { ProfileCard } from './components/ProfileCard';
import { SparkleIcon } from './components/Icons';

async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products');
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-sky-500/90 via-sky-400/80 to-emerald-400/90 p-[1px] shadow-2xl">
        <div className="flex flex-col gap-6 rounded-[22px] bg-white/90 p-6 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700 shadow-sm">
              <SparkleIcon className="h-4 w-4" />
              produk unggulan
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                Belanja nyaman dengan koleksi terbaru dari MyShop
              </h1>
              <p className="text-base text-slate-700 md:text-lg">
                Temukan produk pilihan dengan harga terbaik, checkout yang mulus,
                dan layanan pengiriman terpercaya ke seluruh Indonesia.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-700">
              <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">Gratis ongkir promo</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 font-semibold text-sky-700">Produk orisinal</span>
              <span className="rounded-full bg-purple-50 px-3 py-1 font-semibold text-purple-700">Layanan 24/7</span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/60 bg-gradient-to-br from-white/80 via-white to-white/70 p-5 shadow-xl">
            <ProfileCard />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">koleksi</p>
          <h2 className="text-2xl font-bold text-slate-900">Produk Pilihan</h2>
          <p className="text-sm text-slate-600">Pilih item favorit dan checkout dalam hitungan detik.</p>
        </div>
        <Link
          href="/cart"
          className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-sky-200 hover:text-sky-700 hover:shadow-md md:inline-flex"
        >
          Lihat keranjang
        </Link>
      </div>

      {products.length === 0 && (
        <p className="rounded-2xl border border-dashed bg-white/80 px-4 py-6 text-center text-sm text-slate-600 shadow-sm">
          Belum ada produk. Tambahkan produk untuk mulai berjualan.
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
          >
            {product.imageUrl && (
              <div className="overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={480}
                  height={320}
                  sizes="(min-width: 1280px) 384px, (min-width: 768px) 320px, 100vw"
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            )}

            <div className="mt-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-slate-900">
                  <Link href={`/product/${product.id}`} className="hover:text-sky-700">
                    {product.name}
                  </Link>
                </h3>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  Stok: {product.stock}
                </span>
              </div>
              <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
              <p className="text-xl font-bold text-slate-900">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href={`/product/${product.id}`}
                className="text-sm font-semibold text-slate-700 transition hover:text-sky-700"
              >
                Detail produk →
              </Link>
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}