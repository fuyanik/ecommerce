'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch,
  HiOutlineX,
  HiOutlineAdjustments
} from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

const sortOptions = [
  { id: 'popular', name: 'En Popüler' },
  { id: 'price-asc', name: 'Fiyat: Düşükten Yükseğe' },
  { id: 'price-desc', name: 'Fiyat: Yüksekten Düşüğe' },
  { id: 'rating', name: 'En Yüksek Puan' },
  { id: 'discount', name: 'En Yüksek İndirim' },
];

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const { isLoading, getCategoryById, getProductsByCategory } = useProducts();
  
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    if (!isLoading) {
      const foundCategory = getCategoryById(slug);
      if (foundCategory) {
        setCategory(foundCategory);
        const categoryProducts = getProductsByCategory(slug);
        setProducts(categoryProducts);
        setFilteredProducts(categoryProducts);
      }
    }
  }, [slug, isLoading, getCategoryById, getProductsByCategory]);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Sort
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      default:
        filtered.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, sortBy, priceRange]);

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

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Kategori bulunamadı</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{category.icon}</span>
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-sm text-gray-400">{filteredProducts.length} ürün</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Bu kategoride ara..."
            className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 outline-none focus:border-white/30 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <HiOutlineX className="w-5 h-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Sort & Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm"
          >
            <HiOutlineAdjustments className="w-4 h-4" />
            Filtrele
          </button>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none appearance-none cursor-pointer"
          >
            {sortOptions.map((option) => (
              <option key={option.id} value={option.id} className="bg-gray-900">
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">Bu kriterlere uygun ürün bulunamadı.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setPriceRange({ min: 0, max: 100000 });
              }}
              className="text-white underline"
            >
              Filtreleri temizle
            </button>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl"
        >
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold">Filtreler</h2>
              <button onClick={() => setShowFilters(false)}>
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 p-4 space-y-6 overflow-y-auto">
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-4">Fiyat Aralığı</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Min</label>
                    <input
                      type="number"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-xs text-gray-400 mb-1 block">Max</label>
                    <input
                      type="number"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white outline-none"
                      placeholder="100000"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div>
                <h3 className="font-semibold mb-4">Hızlı Filtreler</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setPriceRange({ min: 0, max: 5000 })}
                    className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    5.000 TL altı
                  </button>
                  <button
                    onClick={() => setPriceRange({ min: 5000, max: 20000 })}
                    className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    5.000 - 20.000 TL
                  </button>
                  <button
                    onClick={() => setPriceRange({ min: 20000, max: 50000 })}
                    className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    20.000 - 50.000 TL
                  </button>
                  <button
                    onClick={() => setPriceRange({ min: 50000, max: 100000 })}
                    className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    50.000 TL üstü
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full h-12 bg-white text-black font-semibold rounded-xl"
              >
                Uygula ({filteredProducts.length} ürün)
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
