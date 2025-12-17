'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineEye, HiOutlineFire, HiOutlineShoppingCart } from 'react-icons/hi';

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Generate random numbers once on mount using useMemo
  const randomNumbers = useMemo(() => ({
    viewing: Math.floor(Math.random() * (30 - 15 + 1)) + 15,     // 15-30
    sold: Math.floor(Math.random() * (200 - 100 + 1)) + 100,     // 100-200
    inCart: Math.floor(Math.random() * (60 - 20 + 1)) + 20,      // 20-60
  }), []);

  const messages = [
    {
      icon: HiOutlineEye,
      text: `Bu ürünü şu anda ${randomNumbers.viewing} kişi inceliyor`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: HiOutlineFire,
      text: `Son 6 saatte ${randomNumbers.sold} adet satıldı`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: HiOutlineShoppingCart,
      text: `Şu anda ${randomNumbers.inCart} kişinin sepetinde`,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMessage = messages[currentIndex];

  return (
    <div className="h-8 flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${currentMessage.bgColor}`}
        >
          <currentMessage.icon className={`w-4 h-4 ${currentMessage.color}`} />
          <span className={`text-xs font-medium ${currentMessage.color}`}>
            {currentMessage.text}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

