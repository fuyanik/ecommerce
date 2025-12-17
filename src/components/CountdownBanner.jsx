'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiChevronRight } from 'react-icons/hi';

export default function CountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 57,
    seconds: 36
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 0
          hours = 1;
          minutes = 57;
          seconds = 36;
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mt-1 mb-3"
    >
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #ff6b6b 100%)',
          backgroundSize: '200% 200%',
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e53 25%, #ff6b9d 50%, #c44569 75%, #ff6b6b 100%)',
            backgroundSize: '200% 200%',
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut',
          }}
        />

        {/* Content */}
        <div className="relative flex items-center justify-between px-4 py-4 sm:px-6">
          {/* Left side - Lightning icon and text */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Lightning icon */}
            <motion.div
              className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-xl"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <svg 
                className="w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-lg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
              </svg>
            </motion.div>

            {/* Text content */}
            <div className="flex flex-col">
              <span className="text-white font-bold text-sm sm:text-lg tracking-tight leading-tight drop-shadow-md">
                Mükemmel Yıl Sonu İndirimleri
              </span>
              <span className="text-white/80 text-xs sm:text-sm font-medium tracking-wide">
                Hemen Al, Fırsatı Kaçırma!
              </span>
            </div>
          </div>

          {/* Right side - Countdown and arrow */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Timer section */}
            <div className="flex flex-col items-end">
              <span className="text-white/70 text-[10px] sm:text-xs font-medium uppercase tracking-wider mb-1">
                Kalan Süre
              </span>
              
              {/* Countdown boxes */}
              <div className="flex items-center gap-1">
                {/* Hours */}
                <motion.div
                  className="bg-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[32px] sm:min-w-[40px] text-center shadow-lg"
                  animate={{
                    scale: timeLeft.seconds === 59 && timeLeft.minutes === 59 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gray-900 font-bold text-sm sm:text-lg font-mono">
                    {formatNumber(timeLeft.hours)}
                  </span>
                </motion.div>

                <span className="text-white font-bold text-lg sm:text-xl mx-0.5">:</span>

                {/* Minutes */}
                <motion.div
                  className="bg-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[32px] sm:min-w-[40px] text-center shadow-lg"
                  animate={{
                    scale: timeLeft.seconds === 59 ? [1, 1.05, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-gray-900 font-bold text-sm sm:text-lg font-mono">
                    {formatNumber(timeLeft.minutes)}
                  </span>
                </motion.div>

                <span className="text-white font-bold text-lg sm:text-xl mx-0.5">:</span>

                {/* Seconds */}
                <motion.div
                  className="bg-white rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 min-w-[32px] sm:min-w-[40px] text-center shadow-lg"
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                >
                  <span className="text-gray-900 font-bold text-sm sm:text-lg font-mono">
                    {formatNumber(timeLeft.seconds)}
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Arrow button */}
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full cursor-pointer"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              <HiChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

