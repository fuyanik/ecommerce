'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlineHeart, HiHeart, HiOutlineShoppingCart } from 'react-icons/hi';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';

// Pastel background colors for products
const pastelColors = [
  'bg-pink-50',
  'bg-blue-50', 
  'bg-green-50',
  'bg-amber-50',
  'bg-purple-50',
  'bg-orange-50',
  'bg-cyan-50',
  'bg-rose-50',
];

export default function ProductCard({ product, index = 0 }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const isWishlisted = isInWishlist(product.id);
  
  // Get a consistent pastel color based on product name
  const colorIndex = product.name ? product.name.charCodeAt(0) % pastelColors.length : index % pastelColors.length;
  const bgColor = pastelColors[colorIndex];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  // Sadece ilk 12 ürün için animasyon, gerisi anında görünsün
  const shouldAnimate = index < 12;
  
  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={shouldAnimate ? { delay: index * 0.03, duration: 0.2 } : { duration: 0 }}
      className="group relative"
    >
      <Link href={`/urun/${product.id}`} className="block touch-manipulation">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm md:hover:shadow-lg transition-all duration-300 border border-gray-100">
          {/* Image Container with Pastel Background */}
          <div className={`relative aspect-square ${bgColor} p-4`}>
            <Image
              src={product.images?.[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-contain md:group-hover:scale-105 transition-transform duration-500 p-2"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              unoptimized
              loader={({ src }) => src}
              onError={(e) => {
                e.target.src = '/placeholder.png';
              }}
            />
            
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg transition-all z-10"
            >
              <motion.div
                initial={false}
                animate={{ scale: isWishlisted ? [1, 1.3, 1] : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isWishlisted ? (
                  <HiHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <HiOutlineHeart className="w-5 h-5 text-gray-400" />
                )}
              </motion.div>
            </button>

            {/* Discount Badge */}
            {product.discount && (
              <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                -%{product.discount}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-gray-800 line-clamp-1 mb-2">
              {product.name}
            </h3>
            
            {/* Price and Cart Button Row */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-base text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xs text-gray-400 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              
              {/* Small Cart Icon Button */}
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={handleAddToCart}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-red-500 transition-colors shadow-sm"
              >
                <HiOutlineShoppingCart className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
