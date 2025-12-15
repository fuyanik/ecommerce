'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useProducts } from '@/context/ProductsContext';
import Footer from '@/components/Footer';

export default function CategoriesPage() {
  const { categories, products, isLoading } = useProducts();

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
        <h1 className="text-2xl font-bold">Kategoriler</h1>
        <p className="text-gray-400">{categories.length} kategori</p>
      </div>

      {/* Categories Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const productCount = products.filter(p => p.category === category.categoryId).length;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/kategori/${category.categoryId}`} className="block group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover opacity-60 group-hover:opacity-80 group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      <span className="text-4xl mb-2">{category.icon}</span>
                      <h3 className="font-bold text-lg text-center">{category.name}</h3>
                      <p className="text-sm text-gray-300">{productCount} ürün</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
