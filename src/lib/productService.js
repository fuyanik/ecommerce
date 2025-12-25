// Firebase Product Service - Tüm ürün CRUD operasyonları
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';

// ==================== PRODUCTS ====================

// Tüm ürünleri getir
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// ID ile ürün getir
export const getProductById = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Kategoriye göre ürünleri getir
export const getProductsByCategory = async (categoryId) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      where('category', '==', categoryId)
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
};

// Öne çıkan ürünleri getir
export const getFeaturedProducts = async () => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      where('featured', '==', true)
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting featured products:', error);
    throw error;
  }
};

// İndirimli ürünleri getir
export const getDiscountedProducts = async (minDiscount = 10) => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION), 
      where('discount', '>=', minDiscount),
      orderBy('discount', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const products = [];
    querySnapshot.forEach((doc) => {
      products.push({ id: doc.id, ...doc.data() });
    });
    return products;
  } catch (error) {
    console.error('Error getting discounted products:', error);
    throw error;
  }
};

// Ürün ara
export const searchProducts = async (searchQuery) => {
  try {
    // Firebase'de full-text search olmadığı için tüm ürünleri çekip client-side filtreleme yapıyoruz
    const products = await getAllProducts();
    const lowercaseQuery = searchQuery.toLowerCase();
    
    return products.filter(product => 
      product.name?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

// Yeni ürün ekle
export const addProduct = async (productData, imageFiles = []) => {
  try {
    // Görselleri yükle
    const imageUrls = [];
    
    if (imageFiles.length > 0) {
      console.log('Uploading', imageFiles.length, 'images for new product...');
      
      for (const file of imageFiles) {
        try {
          const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(7)}_${file.name}`;
          const fileRef = ref(storage, fileName);
          
          console.log('Uploading file:', file.name);
          const snapshot = await uploadBytes(fileRef, file);
          console.log('Upload complete:', snapshot.metadata.fullPath);
          
          const url = await getDownloadURL(fileRef);
          console.log('Download URL:', url);
          imageUrls.push(url);
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          throw new Error(`Görsel yüklenemedi: ${file.name} - ${uploadErr.message}`);
        }
      }
    }

    // İndirim hesapla
    const price = parseFloat(productData.price);
    const originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;

    // Specs objesini hazırla
    let specsObj = {};
    if (productData.specs) {
      if (Array.isArray(productData.specs)) {
        productData.specs.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      } else {
        specsObj = productData.specs;
      }
    }

    const newProduct = {
      name: productData.name,
      description: productData.description,
      price,
      originalPrice,
      discount,
      category: productData.category,
      stock: parseInt(productData.stock),
      featured: productData.featured || false,
      images: imageUrls.length > 0 ? imageUrls : (productData.images || ['https://picsum.photos/400']),
      specs: specsObj,
      rating: productData.rating || 0,
      reviews: productData.reviews || 0,
      homepageSections: productData.homepageSections || [],
      homepageSectionOrder: productData.homepageSectionOrder || {},
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), newProduct);
    return { id: docRef.id, ...newProduct };
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Ürün güncelle
export const updateProduct = async (id, productData, newImageFiles = []) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    
    // Yeni görseller varsa yükle
    let newImageUrls = [];
    for (const file of newImageFiles) {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      newImageUrls.push(url);
    }

    // İndirim hesapla
    const price = parseFloat(productData.price);
    const originalPrice = productData.originalPrice ? parseFloat(productData.originalPrice) : null;
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : null;

    // Specs objesini hazırla
    let specsObj = {};
    if (productData.specs) {
      if (Array.isArray(productData.specs)) {
        productData.specs.forEach(spec => {
          if (spec.key && spec.value) {
            specsObj[spec.key] = spec.value;
          }
        });
      } else {
        specsObj = productData.specs;
      }
    }

    // Görselleri birleştir (mevcut + yeni)
    const existingImages = productData.images || [];
    const allImages = [...existingImages, ...newImageUrls];

    const updatedProduct = {
      name: productData.name,
      description: productData.description,
      price,
      originalPrice,
      discount,
      category: productData.category,
      stock: parseInt(productData.stock),
      featured: productData.featured || false,
      images: allImages.length > 0 ? allImages : ['https://picsum.photos/400'],
      specs: specsObj,
      rating: parseFloat(productData.rating) || 4.5,
      reviews: parseInt(productData.reviewCount) || 0,
      homepageSections: productData.homepageSections || [],
      homepageSectionOrder: productData.homepageSectionOrder || {},
      updatedAt: serverTimestamp()
    };

    await updateDoc(docRef, updatedProduct);
    return { id, ...updatedProduct };
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Ürün sil
export const deleteProduct = async (id) => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== CATEGORIES ====================

// Tüm kategorileri getir
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
    const categories = [];
    querySnapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...doc.data() });
    });
    return categories;
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// ID ile kategori getir
export const getCategoryById = async (categoryId) => {
  try {
    // categoryId ile eşleşen dokümanı bul
    const q = query(
      collection(db, CATEGORIES_COLLECTION), 
      where('categoryId', '==', categoryId)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting category:', error);
    throw error;
  }
};

// Yeni kategori ekle
export const addCategory = async (categoryData) => {
  try {
    const newCategory = {
      categoryId: categoryData.id || categoryData.categoryId,
      name: categoryData.name,
      icon: categoryData.icon,
      image: categoryData.image,
      description: categoryData.description,
      order: categoryData.order ?? 999, // Sıralama için (düşük = önce)
      createdAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), newCategory);
    return { id: docRef.id, ...newCategory };
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};
