'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAllProducts, 
  getAllCategories, 
  getProductsByCategory as getProductsByCategoryFromDB,
  getFeaturedProducts as getFeaturedProductsFromDB,
  getDiscountedProducts as getDiscountedProductsFromDB,
  searchProducts as searchProductsFromDB,
  getProductById as getProductByIdFromDB,
  getCategoryById as getCategoryByIdFromDB
} from '@/lib/productService';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // İlk yüklemede tüm verileri çek
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProducts(),
        getAllCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verileri yenile
  const refreshData = () => {
    loadData();
  };

  // ID ile ürün getir (önce cache'den, yoksa Firebase'den)
  const getProductById = async (id) => {
    // Önce mevcut listeden bak
    const cached = products.find(p => p.id === id);
    if (cached) return cached;
    
    // Yoksa Firebase'den çek
    return await getProductByIdFromDB(id);
  };

  // Kategoriye göre ürünleri getir
  const getProductsByCategory = (categoryId) => {
    return products.filter(p => p.category === categoryId);
  };

  // Öne çıkan ürünleri getir
  const getFeaturedProducts = () => {
    return products.filter(p => p.featured === true);
  };

  // İndirimli ürünleri getir
  const getDiscountedProducts = (minDiscount = 10) => {
    return products
      .filter(p => p.discount && p.discount >= minDiscount)
      .sort((a, b) => (b.discount || 0) - (a.discount || 0));
  };

  // Ürün ara
  const searchProducts = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product => 
      product.name?.toLowerCase().includes(lowercaseQuery) ||
      product.description?.toLowerCase().includes(lowercaseQuery) ||
      product.category?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Kategori getir
  const getCategoryById = (categoryId) => {
    return categories.find(c => c.categoryId === categoryId);
  };

  const value = {
    products,
    categories,
    isLoading,
    error,
    refreshData,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getDiscountedProducts,
    searchProducts,
    getCategoryById
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
