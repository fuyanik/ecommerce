'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlinePlus,
  HiOutlineSearch,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineRefresh
} from 'react-icons/hi';
import { getAllProducts, getAllCategories, deleteProduct } from '@/lib/productService';

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
    }
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setFilteredProducts(productsData);
    } catch (err) {
      setError('Veriler yüklenirken bir hata oluştu: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];
    
    if (searchQuery) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getCategoryName = (categoryId) => {
    const cat = categories.find(c => c.categoryId === categoryId);
    return cat?.name || categoryId;
  };

  const getCategoryIcon = (categoryId) => {
    const cat = categories.find(c => c.categoryId === categoryId);
    return cat?.icon || '📦';
  };

  const handleDelete = async (productId, productName) => {
    if (!confirm(`"${productName}" ürününü silmek istediğinize emin misiniz?`)) {
      return;
    }

    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      alert('Ürün silinirken bir hata oluştu: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteAllInCategory = async () => {
    const categoryName = getCategoryName(selectedCategory);
    const productsInCategory = products.filter(p => p.category === selectedCategory);
    
    if (productsInCategory.length === 0) {
      alert('Bu kategoride silinecek ürün bulunmuyor.');
      return;
    }

    const confirmed = confirm(
      `"${categoryName}" kategorisindeki ${productsInCategory.length} ürünü silmek istediğinize emin misiniz?\n\nBu işlem geri alınamaz!`
    );
    
    if (!confirmed) return;

    setIsDeletingCategory(true);
    
    try {
      for (const product of productsInCategory) {
        await deleteProduct(product.id);
      }
      
      setProducts(prev => prev.filter(p => p.category !== selectedCategory));
      setSelectedCategory('all');
      
      alert(`${productsInCategory.length} ürün başarıyla silindi.`);
    } catch (err) {
      alert('Ürünler silinirken bir hata oluştu: ' + err.message);
      fetchData();
    } finally {
      setIsDeletingCategory(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900">Ürünler</span>
            <span className="text-sm text-gray-500">({products.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              title="Yenile"
            >
              <HiOutlineRefresh className="w-5 h-5 text-gray-600" />
            </button>
            <Link 
              href="/admin/products/new"
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
            >
              <HiOutlinePlus className="w-4 h-4" />
              Yeni Ürün
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
              {error}
              <button 
                onClick={fetchData}
                className="ml-4 underline hover:no-underline"
              >
                Tekrar dene
              </button>
            </div>
          )}

          {/* No Products Warning */}
          {products.length === 0 && !error && (
            <div className="my-8 text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 mb-4">Henüz ürün bulunmuyor.</p>
              <Link
                href="/admin/products/new"
                className="px-6 py-3 bg-red-500 text-white hover:bg-red-600 rounded-xl font-semibold transition-colors inline-block"
              >
                Yeni Ürün Ekle
              </Link>
            </div>
          )}

          {/* Filters */}
          {products.length > 0 && (
            <div className="py-4 space-y-4">
              <div className="relative">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                />
              </div>
              
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Tümü ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.categoryId).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.categoryId)}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === cat.categoryId 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {cat.icon} {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Delete All in Category Button */}
              {selectedCategory !== 'all' && filteredProducts.length > 0 && (
                <button
                  onClick={handleDeleteAllInCategory}
                  disabled={isDeletingCategory}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isDeletingCategory
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {isDeletingCategory ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Siliniyor...
                    </>
                  ) : (
                    <>
                      <HiOutlineTrash className="w-4 h-4" />
                      Bu Kategorideki Tüm Ürünleri Sil ({filteredProducts.length})
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Products List */}
          <div className="space-y-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm ${
                  deletingId === product.id ? 'opacity-50' : ''
                }`}
              >
                <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                  {product.images?.[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {getCategoryIcon(product.category)} {getCategoryName(product.category)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600"
                      >
                        <HiOutlinePencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                      {product.discount && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-full font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
                      Stok: {product.stock}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && products.length > 0 && (
            <div className="text-center py-12 text-gray-500">
              Arama kriterlerine uygun ürün bulunamadı
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
