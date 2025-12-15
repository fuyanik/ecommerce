'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlinePhotograph,
  HiOutlineX,
  HiCheck,
  HiOutlineTrash
} from 'react-icons/hi';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { getProductById, updateProduct, getAllCategories, deleteProduct } from '@/lib/productService';

export default function EditProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
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
    featured: false
  });
  const [images, setImages] = useState([]);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }
    loadData();
  }, [id, router]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [product, categoriesData] = await Promise.all([
        getProductById(id),
        getAllCategories()
      ]);

      setCategories(categoriesData);

      if (product) {
        setFormData({
          name: product.name || '',
          description: product.description || '',
          price: product.price?.toString() || '',
          originalPrice: product.originalPrice?.toString() || '',
          category: product.category || '',
          stock: product.stock?.toString() || '',
          featured: product.featured || false
        });
        setImages(product.images || []);
        
        if (product.specs && typeof product.specs === 'object') {
          const specsArray = Object.entries(product.specs).map(([key, value]) => ({ key, value }));
          setSpecs(specsArray.length > 0 ? specsArray : [{ key: '', value: '' }]);
        }
      } else {
        setError('Ürün bulunamadı');
      }
    } catch (err) {
      setError('Veriler yüklenirken hata oluştu: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImageFiles(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeExistingImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
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
    setIsSaving(true);
    setError(null);

    try {
      // Upload new images
      const uploadedImageUrls = [];
      
      if (newImageFiles.length > 0) {
        console.log('Uploading', newImageFiles.length, 'new images...');
        
        for (const file of newImageFiles) {
          try {
            const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
            const fileRef = ref(storage, fileName);
            
            console.log('Uploading file:', file.name);
            const snapshot = await uploadBytes(fileRef, file);
            console.log('Upload complete:', snapshot.metadata.fullPath);
            
            const url = await getDownloadURL(fileRef);
            console.log('Download URL:', url);
            uploadedImageUrls.push(url);
          } catch (uploadErr) {
            console.error('Image upload error:', uploadErr);
            throw new Error(`Görsel yüklenemedi: ${file.name} - ${uploadErr.message}`);
          }
        }
      }

      const allImages = [...images, ...uploadedImageUrls];
      console.log('All images:', allImages);

      // Prepare specs object
      const specsObj = {};
      specs.forEach(spec => {
        if (spec.key && spec.value) {
          specsObj[spec.key] = spec.value;
        }
      });

      // Update product
      await updateProduct(id, {
        ...formData,
        images: allImages,
        specs: specsObj
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin/products');
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      setError('Ürün güncellenirken hata oluştu: ' + err.message);
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setIsSaving(true);
    try {
      await deleteProduct(id);
      router.push('/admin/products');
    } catch (err) {
      setError('Ürün silinirken hata oluştu: ' + err.message);
      setIsSaving(false);
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
          <p className="text-lg font-semibold text-gray-900">Ürün Güncellendi!</p>
        </motion.div>
      </div>
    );
  }

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

  if (error && !formData.name) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Link href="/admin/products" className="text-red-500 underline">
            Ürünlere Dön
          </Link>
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
            <Link href="/admin/products" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900 text-sm sm:text-base">Ürünü Düzenle</span>
          </div>
          <button
            onClick={handleDelete}
            disabled={isSaving}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors"
          >
            <HiOutlineTrash className="w-4 h-4" />
            <span className="hidden sm:inline">Sil</span>
          </button>
        </div>
      </header>

      <main className="pt-16 pb-8 px-3 sm:px-4">
        <div className="max-w-2xl mx-auto w-full">
          {error && (
            <div className="my-4 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 py-6">
            {/* Images */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <label className="text-sm font-medium text-gray-700 mb-3 block">Ürün Görselleri</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                {images.map((img, index) => (
                  <div key={`existing-${index}`} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                
                {newImagePreviews.map((img, index) => (
                  <div key={`new-${index}`} className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-500">
                    <Image src={img} alt="" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                    >
                      <HiOutlineX className="w-4 h-4" />
                    </button>
                    <span className="absolute bottom-1 left-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded">Yeni</span>
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

            {/* Featured */}
            <label className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl cursor-pointer shadow-sm hover:bg-gray-50">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 rounded accent-red-500"
              />
              <div>
                <p className="font-medium text-gray-900">Öne Çıkan Ürün</p>
                <p className="text-sm text-gray-500">Ana sayfada gösterilsin</p>
              </div>
            </label>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isSaving}
              className={`w-full h-14 rounded-xl font-semibold text-lg transition-all ${
                isSaving
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30'
              }`}
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </span>
              ) : (
                'Değişiklikleri Kaydet'
              )}
            </motion.button>
          </form>
        </div>
      </main>
    </div>
  );
}
