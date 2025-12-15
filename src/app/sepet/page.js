'use client';

import { useState } from 'react';
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
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <HiOutlineShoppingCart className="w-12 h-12 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Sepetiniz Boş</h1>
        <p className="text-gray-400 mb-8">
          Sepetinizde henüz ürün bulunmuyor. Alışverişe başlayın!
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Sepetim</h1>
        <p className="text-gray-400">{getCartCount()} ürün</p>
      </div>

      {/* Cart Items */}
      <div className="px-4 py-4 space-y-4">
        <AnimatePresence>
          {cart.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl"
            >
              {/* Image */}
              <Link href={`/urun/${item.id}`} className="flex-shrink-0">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src={item.images[0]}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </Link>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link href={`/urun/${item.id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{item.name}</h3>
                </Link>
                <p className="text-lg font-bold mb-3">{formatPrice(item.price)}</p>

                {/* Quantity & Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center bg-white/5 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-l-lg transition-colors"
                    >
                      <HiOutlineMinus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-r-lg transition-colors"
                    >
                      <HiOutlinePlus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 flex items-center justify-center text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
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
        <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-3">
          <div className="flex justify-between text-gray-400">
            <span>Ara Toplam</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
          <div className="flex justify-between text-gray-400">
            <span>Kargo</span>
            <span className="text-green-400">Ücretsiz</span>
          </div>
          <div className="h-px bg-white/10" />
          <div className="flex justify-between font-bold text-lg">
            <span>Toplam</span>
            <span>{formatPrice(getCartTotal())}</span>
          </div>
        </div>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 p-4 safe-area-bottom">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-400">Toplam</span>
          <span className="text-2xl font-bold">{formatPrice(getCartTotal())}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/checkout')}
          className="w-full h-14 bg-white text-black font-semibold text-lg rounded-2xl hover:bg-gray-100 transition-colors"
        >
          Devam Et
        </motion.button>
      </div>
    </div>
  );
}

