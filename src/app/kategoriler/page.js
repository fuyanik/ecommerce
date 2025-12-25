'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

export default function CategoriesPage() {
  const { categories, isLoading, getProductsByCategory } = useProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[138px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-[138px]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Kategoriler</h1>
          <p className="text-gray-500">Mobilya ve beyaz eşya ürünlerimizi keşfedin</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => {
            const productCount = getProductsByCategory(category.categoryId).length;
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  href={`/kategori/${category.categoryId}`}
                  className="block group"
                >
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{category.icon}</span>
                        <div>
                          <h3 className="text-lg font-bold text-white">{category.name}</h3>
                          <p className="text-sm text-white/80">{productCount} ürün</p>
                        </div>
                      </div>
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
