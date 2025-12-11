import { apiGet } from '@/lib/api';
import { Product } from '@/types';
import Link from 'next/link';
import { AddToCartButton } from './components/AddToCartButton';

async function getProducts(): Promise<Product[]> {
  return apiGet<Product[]>('/products');
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      {products.length === 0 && <p>No products yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded p-4 flex flex-col justify-between"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover mb-2"
              />
            )}

            <div>
              <h2 className="font-semibold text-lg">
                <Link href={`/product/${product.id}`}>{product.name}</Link>
              </h2>
              <p className="text-sm text-gray-600">
                {product.description}
              </p>
              <p className="mt-2 font-bold">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
              <p className="text-xs text-gray-500">Stock: {product.stock}</p>
            </div>

            <div className="mt-3">
              <AddToCartButton product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
