'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
  HiCheck
} from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductsContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  const isWishlisted = isInWishlist(product.id);

  return (
    <div className="min-h-screen pb-24">
      {/* Image Gallery */}
      <div className="relative bg-gradient-to-b from-gray-900 to-black">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          className="w-full aspect-square"
        >
          {product.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full p-4">
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => toggleWishlist(product)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
          >
            {isWishlisted ? (
              <HiHeart className="w-5 h-5 text-red-500" />
            ) : (
              <HiOutlineHeart className="w-5 h-5 text-white" />
            )}
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm"
          >
            <HiOutlineShare className="w-5 h-5 text-white" />
          </motion.button>
        </div>

        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 rounded-full text-sm font-bold">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="px-4 py-6 space-y-6">
        {/* Title & Rating */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <HiStar className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">{product.rating || 0}</span>
              <span className="text-gray-400">({product.reviews || 0} değerlendirme)</span>
            </div>
            <span className={`text-sm ${product.stock > 10 ? 'text-green-400' : product.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {product.stock > 10 ? 'Stokta' : product.stock > 0 ? `Son ${product.stock} ürün` : 'Tükendi'}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-lg text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="font-semibold mb-2">Ürün Açıklaması</h3>
          <p className="text-gray-400 leading-relaxed">{product.description}</p>
        </div>

        {/* Specs */}
        {product.specs && Object.keys(product.specs).length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Özellikler</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">{key}</p>
                  <p className="font-medium text-sm">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div>
          <h3 className="font-semibold mb-3">Adet</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors rounded-l-xl"
              >
                <HiOutlineMinus className="w-5 h-5" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                className="w-12 h-12 flex items-center justify-center hover:bg-white/10 transition-colors rounded-r-xl"
              >
                <HiOutlinePlus className="w-5 h-5" />
              </button>
            </div>
            <span className="text-gray-400 text-sm">
              Toplam: {formatPrice(product.price * quantity)}
            </span>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="pt-6">
            <h3 className="font-semibold mb-4">Benzer Ürünler</h3>
            <div className="grid grid-cols-2 gap-3">
              {relatedProducts.map((relProduct, index) => (
                <ProductCard key={relProduct.id} product={relProduct} index={index} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 p-4 safe-area-bottom">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full h-14 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
            product.stock === 0 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-white text-black hover:bg-gray-100'
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
                <HiCheck className="w-6 h-6 text-green-600" />
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
