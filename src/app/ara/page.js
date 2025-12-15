'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { HiOutlineSearch } from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const { isLoading, searchProducts } = useProducts();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (query && !isLoading) {
      const searchResults = searchProducts(query);
      setResults(searchResults);
    }
  }, [query, isLoading, searchProducts]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Aranıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold mb-2">Arama Sonuçları</h1>
        <p className="text-gray-400">
          &quot;{query}&quot; için {results.length} sonuç bulundu
        </p>
      </div>

      {/* Results */}
      <div className="px-4 py-6">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <HiOutlineSearch className="w-8 h-8 text-gray-500" />
            </div>
            <p className="text-gray-400 mb-2">Aramanızla eşleşen ürün bulunamadı.</p>
            <p className="text-sm text-gray-500">Farklı anahtar kelimeler deneyin.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Yükleniyor...</div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
