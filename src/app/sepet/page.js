'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineTrash, 
  HiOutlineMinus, 
  HiOutlinePlus,
  HiOutlineShoppingCart
} from 'react-icons/hi';
import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <HiOutlineShoppingCart className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Sepetiniz Boş</h1>
        <p className="text-gray-500 mb-8">
          Sepetinizde henüz ürün bulunmuyor. Alışverişe başlayın!
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">Sepetim</h1>
        <p className="text-gray-500">{getCartCount()} ürün</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-3">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
            >
              {/* Image */}
              <Link href={`/urun/${item.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={item.images?.[0] || '/placeholder.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/urun/${item.id}`}>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">{item.name}</h3>
                </Link>
                <p className="text-lg font-bold text-gray-900 mb-3">{formatPrice(item.price)}</p>

                {/* Quantity & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-l-lg transition-colors"
                    >
                      <HiOutlineMinus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 rounded-r-lg transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Order Summary */}
      <div className="px-4 py-4">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-3">
          <div className="flex justify-between text-gray-500">
            <span>Ara Toplam</span>
            <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Kargo</span>
            <span className="text-green-600 font-medium">Ücretsiz</span>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between font-bold text-lg text-gray-900">
            <span>Toplam</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-500">Toplam</span>
          <span className="text-2xl font-bold text-gray-900">{formatPrice(getCartTotal())}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/checkout')}
          className="w-full h-14 bg-red-500 text-white font-semibold text-lg rounded-xl hover:bg-red-600 transition-colors"
        >
          Ödemeye Geç
        </motion.button>
      </div>
    </div>
  );
}
