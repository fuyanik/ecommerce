'use client';

import { motion } from 'framer-motion';
import { HiSparkles } from 'react-icons/hi';

export default function PromoBanner() {
  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-blue-900 text-white h-[46px] px-3 overflow-hidden"
    >
      {/* Animated background shine */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
        animate={{
          x: ['-200%', '200%'],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
      />

      {/* Animated snowflakes for New Year theme */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/30 text-[10px]"
            style={{
              left: `${(i * 12.5) % 100}%`,
              top: '-5px',
            }}
            animate={{
              y: [0, 50],
              rotate: [0, 360],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + (i % 2),
              repeat: Infinity,
              delay: (i * 0.4) % 3,
              ease: 'linear',
            }}
          >
            ❄
          </motion.div>
        ))}
      </div>
      
      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center">
        {/* Center - Main Message - Absolutely Centered with New Year Theme */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center">
          {/* Decorative New Year elements */}
          <div className="flex items-center gap-1.5 mb-0.5">
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-[10px] sm:text-xs"
            >
              🎄
            </motion.span>
            <HiSparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
            <h2 className="text-[10px] sm:text-xs font-bold tracking-wide bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent">
              YIL SONUNA ÖZEL
            </h2>
            <HiSparkles className="w-2.5 h-2.5 text-yellow-300 animate-pulse" />
            <motion.span
              animate={{ rotate: [360, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="text-[10px] sm:text-xs"
            >
              🎅
            </motion.span>
          </div>
          <p className="text-[8px] sm:text-[9px] font-medium text-white/95 tracking-wider flex items-center gap-1">
            <span className="text-yellow-300">✨</span>
            %45'e varan kampanyalı ürünler
            <span className="text-yellow-300">✨</span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
