'use client';

import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function DealsPage() {
  const { isLoading, getDiscountedProducts } = useProducts();
  const discountedProducts = getDiscountedProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <div>
            <h1 className="text-2xl font-bold">Fırsat Ürünleri</h1>
            <p className="text-gray-400">{discountedProducts.length} ürün</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        {discountedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {discountedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            Şu anda indirimli ürün bulunmuyor.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
