'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  HiOutlineHeart, 
  HiHeart, 
  HiOutlineShare,
  HiOutlineMinus,
  HiOutlinePlus,
  HiStar,
  HiCheck,
  HiOutlineTruck,
  HiOutlineShieldCheck
} from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const { isLoading, getProductById, getProductsByCategory } = useProducts();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showAddedAnimation, setShowAddedAnimation] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      if (!isLoading) {
        const foundProduct = await getProductById(id);
        if (foundProduct) {
          setProduct(foundProduct);
          const related = getProductsByCategory(foundProduct.category)
            .filter(p => p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      }
    };
    loadProduct();
  }, [id, isLoading, getProductById, getProductsByCategory]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedAnimation(true);
      setTimeout(() => setShowAddedAnimation(false), 2000);
    }
  };

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Image Gallery */}
      <div className="bg-white">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full aspect-square"
        >
          {product.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full bg-gray-100 p-8">
                <Image
                  src={image}
                  alt={`${product.name} - ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleWishlist(product)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
          >
            {isWishlisted ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-gray-600" />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md"
          >
            <HiOutlineShare className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="bg-white mt-2 px-4 py-6">
        {/* Title & Rating */}
        <h1 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h1>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1">
            <HiStar className="w-5 h-5 text-yellow-400" />
            <span className="font-semibold text-gray-900">{product.rating || 0}</span>
            <span className="text-gray-500">({product.reviews || 0} değerlendirme)</span>
          </div>
          <span className={`text-sm font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
            {product.stock > 10 ? 'Stokta' : product.stock > 0 ? `Son ${product.stock} ürün` : 'Tükendi'}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.discount && (
            <span className="px-2 py-1 bg-red-100 text-red-600 text-sm font-semibold rounded">
              %{product.discount} İndirim
            </span>
          )}
        </div>

        {/* Features */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineTruck className="w-5 h-5 text-green-600" />
            <span>Ücretsiz Kargo</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
            <span>2 Yıl Garanti</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-white mt-2 px-4 py-6">
        <h3 className="font-semibold text-gray-900 mb-3">Ürün Açıklaması</h3>
        <p className="text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Specs */}
      {product.specs && Object.keys(product.specs).length > 0 && (
        <div className="bg-white mt-2 px-4 py-6">
          <h3 className="font-semibold text-gray-900 mb-4">Özellikler</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(product.specs).map(([key, value]) => (
              <div key={key} className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{key}</p>
                <p className="font-medium text-sm text-gray-900">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="bg-white mt-2 px-4 py-6">
        <h3 className="font-semibold text-gray-900 mb-3">Adet</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-gray-100 rounded-xl">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-l-xl"
            >
              <HiOutlineMinus className="w-5 h-5 text-gray-600" />
            </button>
            <span className="w-12 text-center font-semibold text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
              className="w-12 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors rounded-r-xl"
            >
              <HiOutlinePlus className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <span className="text-gray-500 text-sm">
            Toplam: <span className="font-bold text-gray-900">{formatPrice(product.price * quantity)}</span>
          </span>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="bg-white mt-2 px-4 py-6">
          <h3 className="font-semibold text-gray-900 mb-4">Benzer Ürünler</h3>
          <div className="grid grid-cols-2 gap-3">
            {relatedProducts.map((relProduct, index) => (
              <ProductCard key={relProduct.id} product={relProduct} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 shadow-lg">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full h-14 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
            product.stock === 0 
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          <AnimatePresence mode="wait">
            {showAddedAnimation ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="flex items-center gap-2"
              >
                <HiCheck className="w-6 h-6" />
                Sepete Eklendi!
              </motion.span>
            ) : (
              <motion.span
                key="add"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                {product.stock === 0 ? 'Tükendi' : 'Sepete Ekle'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
