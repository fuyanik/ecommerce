'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlinePhotograph,
  HiOutlineX,
  HiCheck,
  HiOutlineFire,
  HiOutlineAcademicCap,
  HiOutlineHeart,
  HiOutlineSparkles
} from 'react-icons/hi';
import { addProduct, getAllCategories } from '@/lib/productService';

export default function NewProductPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    stock: '',
    featured: false,
    rating: '4.5',
    reviewCount: '',
    homepageSections: []
  });

  // Homepage sections configuration
  const homepageSectionsConfig = [
    { id: 'featured', name: 'Öne Çıkan Ürünler', icon: HiOutlineFire, color: 'from-red-500 to-orange-500', bgColor: 'bg-red-50', textColor: 'text-red-600' },
    { id: 'school', name: 'Okul Alışverişi', icon: HiOutlineAcademicCap, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600' },
    { id: 'favorites', name: 'En Çok Favorilenenler', icon: HiOutlineHeart, color: 'from-pink-500 to-rose-500', bgColor: 'bg-pink-50', textColor: 'text-pink-600' },
    { id: 'selected', name: 'Sizin İçin Seçtiklerimiz', icon: HiOutlineSparkles, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-50', textColor: 'text-purple-600' }
  ];
  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }
    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const toggleHomepageSection = (sectionId) => {
    setFormData(prev => {
      const sections = prev.homepageSections || [];
      if (sections.includes(sectionId)) {
        return { ...prev, homepageSections: sections.filter(s => s !== sectionId) };
      } else {
        return { ...prev, homepageSections: [...sections, sectionId] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index, field, value) => {
    setSpecs(prev => {
      const newSpecs = [...prev];
      newSpecs[index][field] = value;
      return newSpecs;
    });
  };

  const addSpec = () => {
    setSpecs(prev => [...prev, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await addProduct({
        ...formData,
        rating: parseFloat(formData.rating) || 4.5,
        reviews: parseInt(formData.reviewCount) || 0,
        specs,
        homepageSections: formData.homepageSections || []
      }, imageFiles);

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      setError('Ürün eklenirken hata oluştu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
            <HiCheck className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-lg font-semibold text-gray-900">Ürün Eklendi!</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-screen overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/products" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900">Yeni Ürün</span>
          </div>
        </div>
      </header>

      <main className="pt-16 pb-8 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto w-full">
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            {/* Images */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Ürün Görselleri</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-red-500 transition-colors bg-gray-50">
                  <HiOutlinePhotograph className="w-8 h-8 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Ekle</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ürün Adı *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                  placeholder="Ürün adını girin"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Açıklama *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 resize-none"
                  placeholder="Ürün açıklaması"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Fiyat (TL) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Eski Fiyat (TL)</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Kategori *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 appearance-none"
                  >
                    <option value="">Seçin</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.categoryId}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Stok *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Rating & Reviews */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Ürün Puanı ⭐</label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 appearance-none"
                  >
                    <option value="4.0">4.0 ⭐</option>
                    <option value="4.1">4.1 ⭐</option>
                    <option value="4.2">4.2 ⭐</option>
                    <option value="4.3">4.3 ⭐</option>
                    <option value="4.4">4.4 ⭐</option>
                    <option value="4.5">4.5 ⭐</option>
                    <option value="4.6">4.6 ⭐</option>
                    <option value="4.7">4.7 ⭐</option>
                    <option value="4.8">4.8 ⭐</option>
                    <option value="4.9">4.9 ⭐</option>
                    <option value="5.0">5.0 ⭐</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Değerlendirme Sayısı</label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">Özellikler</label>
                <button
                  type="button"
                  onClick={addSpec}
                  className="text-sm text-red-500 hover:text-red-600 font-medium"
                >
                  + Ekle
                </button>
              </div>
              <div className="space-y-3">
                {specs.map((spec, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 p-3 bg-gray-50 rounded-xl">
                    <div className="flex gap-2 flex-1">
                      <input
                        type="text"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                        placeholder="Özellik"
                        className="flex-1 min-w-0 h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none focus:border-red-500"
                      />
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                        placeholder="Değer"
                        className="flex-1 min-w-0 h-10 sm:h-12 px-3 sm:px-4 bg-white border border-gray-200 rounded-lg text-gray-900 text-sm outline-none focus:border-red-500"
                      />
                    </div>
                    {specs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSpec(index)}
                        className="h-10 sm:h-12 px-3 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-lg text-sm font-medium sm:w-auto"
                      >
                        <HiOutlineX className="w-5 h-5" />
                        <span className="ml-1 sm:hidden">Kaldır</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Homepage Sections */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700 block">Ana Sayfada Gösterilecek Bölümler</label>
                <p className="text-xs text-gray-500 mt-1">Bu ürünün hangi ana sayfa bölümlerinde gösterileceğini seçin</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {homepageSectionsConfig.map((section) => {
                  const Icon = section.icon;
                  const isSelected = formData.homepageSections?.includes(section.id);
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => toggleHomepageSection(section.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        isSelected 
                          ? `border-transparent bg-gradient-to-r ${section.color} text-white shadow-lg` 
                          : `border-gray-200 bg-gray-50 hover:border-gray-300 text-gray-700`
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-white/20' : section.bgColor
                      }`}>
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : section.textColor}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                          {section.name}
                        </p>
                        <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                          {isSelected ? 'Seçildi' : 'Seçmek için tıklayın'}
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                          <HiCheck className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Featured - Legacy support */}
            <label className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl cursor-pointer shadow-sm hover:bg-gray-50">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded accent-red-500"
              />
              <div>
                <p className="font-medium text-gray-900">Öne Çıkan Ürün (Eski)</p>
                <p className="text-sm text-gray-500">Eski sistem için - Yukarıdaki bölümleri kullanmanız önerilir</p>
              </div>
            </label>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading || !formData.name || !formData.price || !formData.category}
              className={`w-full h-14 rounded-xl font-semibold text-lg transition-all ${
                isLoading || !formData.name || !formData.price || !formData.category
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                'Ürünü Kaydet'
              )}
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
}
