'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineFire,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineSearch,
  HiOutlinePlus,
  HiOutlineX,
  HiOutlineTrash,
  HiCheck
} from 'react-icons/hi';
import { getAllProducts, updateProduct } from '@/lib/productService';

const homepageSectionsConfig = [
  { id: 'featured', name: 'Öne Çıkan Ürünler', icon: HiOutlineFire, color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', textColor: 'text-red-600', borderColor: 'border-red-200' },
  { id: 'school', name: 'Okul Alışverişi', icon: HiOutlineAcademicCap, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
  { id: 'favorites', name: 'En Çok Favorilenenler', icon: HiOutlineHeart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-600', borderColor: 'border-pink-200' },
  { id: 'selected', name: 'Sizin İçin Seçtiklerimiz', icon: HiOutlineSparkles, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200' }
];

export default function HomepageSectionsPage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }
    loadProducts();
  }, [router]);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const productsData = await getAllProducts();
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getSectionProducts = (sectionId) => {
    const sectionProducts = products.filter(p => p.homepageSections && p.homepageSections.includes(sectionId));
    // Sıralamaya göre sırala
    return sectionProducts.sort((a, b) => {
      const orderA = a.homepageSectionOrder?.[sectionId] ?? 999;
      const orderB = b.homepageSectionOrder?.[sectionId] ?? 999;
      return orderA - orderB;
    });
  };

  const getAvailableProducts = () => {
    const query = searchQuery.toLowerCase();
    return products.filter(p => {
      const notInSection = !p.homepageSections || !p.homepageSections.includes(activeSection);
      const matchesSearch = p.name?.toLowerCase().includes(query) || p.category?.toLowerCase().includes(query);
      return notInSection && (searchQuery === '' || matchesSearch);
    });
  };

  const addProductToSection = async (productId) => {
    setIsSaving(true);
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const currentSections = product.homepageSections || [];
      const newSections = [...currentSections, activeSection];
      
      // Yeni ürün için sıra numarası belirle (en sona ekle)
      const sectionProducts = getSectionProducts(activeSection);
      const maxOrder = sectionProducts.length > 0 
        ? Math.max(...sectionProducts.map(p => p.homepageSectionOrder?.[activeSection] ?? 0))
        : -1;
      
      const newOrder = {
        ...(product.homepageSectionOrder || {}),
        [activeSection]: maxOrder + 1
      };

      await updateProduct(productId, {
        ...product,
        homepageSections: newSections,
        homepageSectionOrder: newOrder
      });

      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, homepageSections: newSections, homepageSectionOrder: newOrder }
          : p
      ));
    } catch (err) {
      console.error('Error adding product to section:', err);
      alert('Ürün eklenirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const removeProductFromSection = async (productId) => {
    setIsSaving(true);
    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newSections = (product.homepageSections || []).filter(s => s !== activeSection);
      const newOrder = { ...(product.homepageSectionOrder || {}) };
      delete newOrder[activeSection];

      await updateProduct(productId, {
        ...product,
        homepageSections: newSections,
        homepageSectionOrder: newOrder
      });

      setProducts(prev => prev.map(p => 
        p.id === productId 
          ? { ...p, homepageSections: newSections, homepageSectionOrder: newOrder }
          : p
      ));
    } catch (err) {
      console.error('Error removing product from section:', err);
      alert('Ürün kaldırılırken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDragStart = (e, productId) => {
    setDraggedProduct(productId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', productId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetProductId) => {
    e.preventDefault();
    if (!draggedProduct || draggedProduct === targetProductId) {
      setDraggedProduct(null);
      return;
    }

    setIsSaving(true);
    try {
      const sectionProducts = getSectionProducts(activeSection);
      const draggedIndex = sectionProducts.findIndex(p => p.id === draggedProduct);
      const targetIndex = sectionProducts.findIndex(p => p.id === targetProductId);

      if (draggedIndex === -1 || targetIndex === -1) {
        setDraggedProduct(null);
        setIsSaving(false);
        return;
      }

      // Yeni sıralamayı hesapla
      const newOrderedProducts = [...sectionProducts];
      const [removed] = newOrderedProducts.splice(draggedIndex, 1);
      newOrderedProducts.splice(targetIndex, 0, removed);

      // Tüm ürünlerin sırasını güncelle
      const updatePromises = newOrderedProducts.map((product, index) => {
        const newOrder = {
          ...(product.homepageSectionOrder || {}),
          [activeSection]: index
        };
        return updateProduct(product.id, {
          ...product,
          homepageSectionOrder: newOrder
        });
      });

      await Promise.all(updatePromises);

      // State'i güncelle
      setProducts(prev => prev.map(product => {
        const updatedProduct = newOrderedProducts.find(p => p.id === product.id);
        if (updatedProduct) {
          const newOrder = {
            ...(product.homepageSectionOrder || {}),
            [activeSection]: newOrderedProducts.indexOf(updatedProduct)
          };
          return { ...product, homepageSectionOrder: newOrder };
        }
        return product;
      }));

      setDraggedProduct(null);
    } catch (err) {
      console.error('Error reordering products:', err);
      alert('Sıralama güncellenirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const activeSectionConfig = homepageSectionsConfig.find(s => s.id === activeSection);
  const sectionProducts = getSectionProducts(activeSection);
  const availableProducts = getAvailableProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900 text-sm sm:text-base">Ana Sayfa Bölümlerini Düzenle</span>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Tabs */}
          <div className="flex gap-3 overflow-x-auto pb-4 hide-scrollbar mb-6">
            {homepageSectionsConfig.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              const count = getSectionProducts(section.id).length;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                    isActive 
                      ? `bg-gradient-to-r ${section.color} text-white shadow-lg` 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{section.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Section Content */}
          <div className={`bg-white rounded-2xl border-2 ${activeSectionConfig?.borderColor} shadow-sm overflow-hidden`}>
            {/* Section Header */}
            <div className={`bg-gradient-to-r ${activeSectionConfig?.color} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {activeSectionConfig && <activeSectionConfig.icon className="w-8 h-8" />}
                  <div>
                    <h2 className="text-xl font-bold">{activeSectionConfig?.name}</h2>
                    <p className="text-white/80 text-sm">{sectionProducts.length} ürün</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium text-sm transition-colors"
                >
                  <HiOutlinePlus className="w-5 h-5" />
                  Ürün Ekle
                </button>
              </div>
              {sectionProducts.length > 0 && (
                <p className="text-white/70 text-xs mt-3 flex items-center gap-1">
                  💡 Ürünleri sürükleyip bırakarak sıralayabilirsiniz
                </p>
              )}
            </div>

            {/* Products Grid */}
            <div className="p-6">
              {sectionProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${activeSectionConfig?.bgColor} flex items-center justify-center`}>
                    {activeSectionConfig && <activeSectionConfig.icon className={`w-8 h-8 ${activeSectionConfig?.textColor}`} />}
                  </div>
                  <p className="text-gray-500 mb-4">Bu bölümde henüz ürün yok</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${activeSectionConfig?.color} text-white rounded-xl font-medium text-sm`}
                  >
                    <HiOutlinePlus className="w-4 h-4" />
                    Ürün Ekle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {sectionProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, product.id)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, product.id)}
                      className={`bg-gray-50 rounded-xl overflow-hidden group relative cursor-move transition-all ${
                        draggedProduct === product.id ? 'opacity-50 scale-95' : 'hover:shadow-lg'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={product.images?.[0] || 'https://picsum.photos/200'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <button
                          onClick={() => removeProductFromSection(product.id)}
                          disabled={isSaving}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-red-600 mt-1">{product.price?.toLocaleString('tr-TR')} TL</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white rounded-t-3xl sm:rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className={`bg-gradient-to-r ${activeSectionConfig?.color} p-4 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeSectionConfig && <activeSectionConfig.icon className="w-5 h-5" />}
                    <h3 className="font-bold">{activeSectionConfig?.name} - Ürün Ekle</h3>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="p-4 border-b border-gray-100">
                <div className="relative">
                  <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ürün ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Products List */}
              <div className="overflow-y-auto max-h-[50vh] p-4">
                {availableProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Eklenebilecek ürün bulunamadı</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableProducts.slice(0, 20).map((product) => (
                      <button
                        key={product.id}
                        onClick={() => addProductToSection(product.id)}
                        disabled={isSaving}
                        className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
                      >
                        <div className="w-14 h-14 relative rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.images?.[0] || 'https://picsum.photos/200'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <p className="text-sm font-bold text-red-600">{product.price?.toLocaleString('tr-TR')} TL</p>
                        </div>
                        <div className={`w-8 h-8 rounded-full ${activeSectionConfig?.bgColor} flex items-center justify-center`}>
                          <HiOutlinePlus className={`w-4 h-4 ${activeSectionConfig?.textColor}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

