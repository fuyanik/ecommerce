'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../assets/bottomNavbarLogo2.png"
import { 
  HiOutlineShoppingCart, 
  HiShoppingCart,
  HiOutlineHeart, 
  HiHeart,
  HiOutlineChatAlt2, 
  HiChatAlt2,
  HiOutlineHome,
  HiHome
} from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

const navItems = [
  { 
    id: 'home',
    href: '/', 
    label: 'Home', 
    icon: HiOutlineHome,
    activeIcon: HiHome
  },
  { 
    id: 'wishlist',
    href: '/favoriler', 
    label: 'Favoriler', 
    icon: HiOutlineHeart,
    activeIcon: HiHeart
  },
  { 
    id: 'logo',
    href: '/', 
    label: 'Ana Sayfa', 
    isLogo: true 
  },
  { 
    id: 'cart',
    href: '/sepet', 
    label: 'Sepet', 
    icon: HiOutlineShoppingCart,
    activeIcon: HiShoppingCart
  },
  { 
    id: 'chat',
    href: '/destek', 
    label: 'Destek', 
    icon: HiOutlineChatAlt2,
    activeIcon: HiChatAlt2
  },
];

export default function BottomNavbar() {
  const pathname = usePathname();
  const { getCartCount, isLoaded: cartLoaded } = useCart();
  const { getWishlistCount, isLoaded: wishlistLoaded } = useWishlist();
  const [activeTab, setActiveTab] = useState('home');

  // Hide on admin, checkout, product, and cart pages
  const isAdminPage = pathname.startsWith('/admin');
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isProductPage = pathname.startsWith('/urun/');
  const isCartPage = pathname.startsWith('/sepet');

  useEffect(() => {
    if (pathname === '/') setActiveTab('home');
    else if (pathname === '/favoriler') setActiveTab('wishlist');
    else if (pathname === '/sepet') setActiveTab('cart');
    else if (pathname === '/destek') setActiveTab('chat');
  }, [pathname]);

  if (isAdminPage || isCheckoutPage || isProductPage || isCartPage) return null;

  const cartCount = cartLoaded ? getCartCount() : 0;
  const wishlistCount = wishlistLoaded ? getWishlistCount() : 0;

  const leftItems = navItems.filter(item => item.id === 'home' || item.id === 'wishlist');
  const rightItems = navItems.filter(item => item.id === 'cart' || item.id === 'chat');

  const renderNavItem = (item) => {
    const isActive = activeTab === item.id;
    const Icon = isActive ? item.activeIcon : item.icon;

    return (
      <Link 
        key={item.id}
        href={item.href}
        onClick={() => setActiveTab(item.id)}
        className="relative flex flex-col items-center gap-1 py-2 flex-1"
      >
        <motion.div
          initial={false}
          animate={{ 
            scale: isActive ? 1.1 : 1,
            y: isActive ? -2 : 0
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="relative"
        >
          <Icon className={`w-6 h-6 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`} />
          
          {/* Badge for cart */}
          {item.id === 'cart' && cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="badge"
            >
              {cartCount > 99 ? '99+' : cartCount}
            </motion.span>
          )}
          
          {/* Badge for wishlist */}
          {item.id === 'wishlist' && wishlistCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="badge"
            >
              {wishlistCount > 99 ? '99+' : wishlistCount}
            </motion.span>
          )}
        </motion.div>
        
        <motion.span 
          initial={false}
          animate={{ 
            opacity: isActive ? 1 : 0.6,
            scale: isActive ? 1.05 : 1
          }}
          className={`text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}
        >
          {item.label}
        </motion.span>

        {/* Active indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              layoutId="activeTab"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-1 w-1 h-1 rounded-full bg-white"
            />
          )}
        </AnimatePresence>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10 safe-area-bottom">
      <div className="h-20 max-w-lg mx-auto px-4 flex items-center">
        {/* Left side - 2 items */}
        <div className="flex-1 flex items-center justify-around">
          {leftItems.map(renderNavItem)}
        </div>

        {/* Center - Logo */}
        <div className="flex items-center justify-center px-4">
          <Link 
            href="/"
            className="relative -mt-2"
            onClick={() => setActiveTab('home')}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-black/50 border-2 border-white/20"
            >
              <Image
                src={logo}
                alt="1001 Çarşı AVM"
                width={64}
                height={64}
                className="object-cover"
              />
            </motion.div>
          </Link>
        </div>

        {/* Right side - 2 items */}
        <div className="flex-1 flex items-center justify-around">
          {rightItems.map(renderNavItem)}
        </div>
      </div>
      
      {/* Safe area spacer */}
      <div className="h-safe-area-bottom bg-transparent" />
    </nav>
  );
}

