'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function HPAuthorizedBanner() {
  const pathname = usePathname();
  const isCheckoutPage = pathname.startsWith('/checkout');

  // Checkout sayfasında banner'ı gizle
  if (isCheckoutPage) {
    return null;
  }

  return (
    <div className="fixed top-[46px] left-0 right-0 z-50 bg-[rgb(219,250,124)] h-[32px] px-4 overflow-hidden flex items-center">
      <div className="max-w-7xl gap-2 mx-auto flex items-center justify-center text-black text-xs sm:text-sm">
        <Image 
          src="/hp.png" 
          alt="HP Yetkili Satıcısı" 
          width={20} 
          height={20}
          priority
          unoptimized
        />
        <span className="font-semibold tracking-wide">
          HP Yetkili Satıcısı
        </span>
      </div>
    </div>
  );
}

