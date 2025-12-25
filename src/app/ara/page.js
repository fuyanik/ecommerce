'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { HiOutlineSearch } from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const { isLoading, searchProducts } = useProducts();
  const results = searchProducts(query);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[138px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Aranıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[138px]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <HiOutlineSearch className="w-6 h-6 text-gray-400" />
            <h1 className="text-xl font-bold text-gray-900">
              &quot;{query}&quot; için sonuçlar
            </h1>
          </div>
          <p className="text-gray-500">{results.length} ürün bulundu</p>
        </div>

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <HiOutlineSearch className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Sonuç Bulunamadı</h2>
            <p className="text-gray-500 mb-6">
              &quot;{query}&quot; ile eşleşen ürün bulamadık.<br />
              Farklı anahtar kelimeler deneyebilirsiniz.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Koltuk', 'Yatak', 'Buzdolabı', 'Masa', 'Sandalye'].map((suggestion) => (
                <a
                  key={suggestion}
                  href={`/ara?q=${suggestion}`}
                  className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  {suggestion}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[138px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
