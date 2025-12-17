'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

export default function PromoBanner() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 20, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else {
          // Reset timer
          minutes = 20;
          seconds = 0;
        }
        
        return { minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white h-[45px] px-3 relative overflow-hidden flex items-center justify-center"
    >
      {/* Animated background shine */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        <HiSparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse flex-shrink-0" />
        <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
          İlk müşterilere özel kısıtlı süre <span className="font-bold text-yellow-400">%20 indirim</span>
        </span>
        <div className="flex items-center gap-1 ml-1">
          <div className="bg-white/20 rounded px-1.5 py-0.5">
            <span className="text-[11px] sm:text-xs font-bold font-mono">{formatNumber(timeLeft.minutes)}</span>
          </div>
          <span className="text-[11px] font-bold">:</span>
          <div className="bg-white/20 rounded px-1.5 py-0.5">
            <span className="text-[11px] sm:text-xs font-bold font-mono">{formatNumber(timeLeft.seconds)}</span>
          </div>
        </div>
        <HiSparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse flex-shrink-0" />
      </div>
    </motion.div>
  );
}

