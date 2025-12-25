'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineUser, 
  HiOutlineMenu, 
  HiOutlineX, 
  HiArrowLeft, 
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineSupport,
  HiOutlineTag,
  HiOutlineChevronRight,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineClock,
  HiOutlineUserGroup,
  HiOutlineShoppingCart,
  HiOutlineFire
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductsContext';
import PromoBanner from './PromoBanner';

// Animated Logo Component with shine effect
function Logo() {
  return (
    <Link href="/" className="flex items-center mt-3 mr-2  group">
     
        <div className="relative overflow-hidden">
          
          {/* Background glow effect */}
          <Image 
            src="/logo3.png" 
            alt="Logo" 
            width={140} 
            height={140}
            priority
            unoptimized
          />
      
        </div>
        
        {/* Sparkle effects */}
      
    </Link>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { getCartCount } = useCart();
  const { user } = useAuth();

  const isProductPage = pathname.startsWith('/urun/');
  const isCheckoutPage = pathname.startsWith('/checkout');
  const isAdminPage = pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/ara?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Hide navbar on admin pages
  if (isAdminPage) return null;

  // Product page navbar with back button
  if (isProductPage || isCheckoutPage) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="h-[60px] flex items-center justify-between px-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <HiArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <span className="font-semibold text-lg text-gray-900">
            {isCheckoutPage ? 'Ödeme' : 'Detaylar'}
          </span>
          <Link href="/sepet" className="relative w-10 h-10 flex items-center justify-center">
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Promo Banner - En Üstte */}
      <PromoBanner />
      
      <nav 
        className={`fixed top-[78px] left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-1">
          <div className="h-[60px] flex items-center justify-between">
            {/* Left Side - Cart Button */}
            <div className="flex items-center">
              <Link
                href="/sepet"
                className="w-10 h-10 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative"
              >
                <HiOutlineShoppingBag className="w-5 h-5" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/kategori/koltuk-takimi" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Koltuk Takımları
              </Link>
              <Link href="/kategori/yatak-odasi" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Yatak Odası
              </Link>
              <Link href="/kategori/mutfak" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Mutfak
              </Link>
              <Link href="/kategori/beyaz-esya" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Beyaz Eşya
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <HiOutlineSearch className="w-5 h-5 text-gray-700" />
              </button>

              {/* Mobile Menu */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <HiOutlineMenu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-white"
          >
            <div className="max-w-2xl mx-auto px-4 pt-6">
              <div className="flex items-center gap-4 mb-8">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Mobilya, beyaz eşya ara..."
                      autoFocus
                      className="w-full h-14 pl-12 pr-4 bg-gray-100 border-0 rounded-2xl text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                    />
                  </div>
                </form>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6 text-gray-700" />
                </button>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Popüler Aramalar</h3>
                <div className="flex flex-wrap gap-2">
                  {['Köşe Koltuk', 'Yatak', 'Buzdolabı', 'Çamaşır Makinesi', 'TV Ünitesi', 'Masa Sandalye'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/ara?q=${encodeURIComponent(term)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-60 bg-white overflow-y-auto"
          >
            {/* Header with Gradient & Stats */}
            <div className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-indigo-900 p-4 pb-6">
              {/* Close Button */}
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <HiOutlineX className="w-5 h-5 text-white" />
              </button>
              
              {/* Countdown Timer */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center animate-pulse">
                    <HiOutlineClock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs">İndirim için son</p>
                    <p className="text-white font-bold text-lg">
                      <MenuCountdown />
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <HiOutlineUserGroup className="w-4 h-4 text-green-400" />
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                    </span>
                  </div>
                  <p className="text-white font-bold text-lg">1.427</p>
                  <p className="text-white/60 text-[10px]">Bugün Alışveriş</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <HiOutlineShoppingCart className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-white font-bold text-lg">847</p>
                  <p className="text-white/60 text-[10px]">Aktif Sipariş</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <HiOutlineFire className="w-4 h-4 text-orange-400" />
                  </div>
                  <p className="text-white font-bold text-lg">2.873</p>
                  <p className="text-white/60 text-[10px]">Siteyi İnceleyen</p>
                </div>
              </div>
            </div>

              {/* Quick Actions */}
              <div className="p-4 mt-2">
                <div className="grid grid-cols-3 gap-2">
                  <Link
                    href="/favoriler"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <HiOutlineHeart className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Favoriler</span>
                  </Link>
                  <Link
                    href="/sepet"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors relative"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <HiOutlineShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    {getCartCount() > 0 && (
                      <span className="absolute top-2 right-6 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {getCartCount()}
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-700">Sepetim</span>
                  </Link>
                  <Link
                    href="/firsatlar"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <HiOutlineTag className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-gray-700">Fırsatlar</span>
                  </Link>
                </div>
              </div>

              {/* Categories Section */}
              <div className="px-4 py-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-1">Kategoriler</h3>
                <MobileCategories onClose={() => setIsMenuOpen(false)} />
              </div>

              {/* Links Section */}
              <div className="px-4 py-4 border-t border-gray-100 mt-2">
                <div className="space-y-1">
                  <Link
                    href="/destek"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <HiOutlineSupport className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">Yardım & Destek</p>
                      <p className="text-xs text-gray-500">Sorularınız için</p>
                    </div>
                    <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
                  </Link>
                  
                  {user && (
                    <Link
                      href="/hesabim"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
                        <HiOutlineCog className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">Hesap Ayarları</p>
                        <p className="text-xs text-gray-500">Profil ve siparişler</p>
                      </div>
                      <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="px-4 py-4 bg-gray-50 mx-4 rounded-2xl mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center">
                    <HiOutlinePhone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">7/24 Müşteri Hizmetleri</p>
                    <p className="font-semibold text-gray-900">+90 551 354 56 03</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                    <HiOutlineLocationMarker className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Mağazamızı Ziyaret Edin</p>
                    <p className="font-medium text-gray-900 text-sm">Keçiliköy OSB, 45030 Yunusemre/Manisa, Türkiye</p>
                  </div>
                </div>
              </div>

              {/* Bottom padding for safe area */}
              <div className="h-8" />
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Mobile Categories Component
function MobileCategories({ onClose }) {
  const { categories } = useProducts();
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {categories.slice(0, 8).map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
        >
          <Link
            href={`/kategori/${category.categoryId}`}
            onClick={onClose}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative">
              {category.image ? (
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-2xl flex items-center justify-center h-full">{category.icon}</span>
              )}
            </div>
            <span className="text-[10px] font-medium text-gray-600 text-center line-clamp-2 leading-tight">
              {category.name}
            </span>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

// Menu Countdown Component
function MenuCountdown() {
  const [time, setTime] = useState({ minutes: 20, seconds: 0 });
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          // Reset to 20 minutes when it reaches 0
          return { minutes: 20, seconds: 0 };
        }
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <span>
      {String(time.minutes).padStart(2, '0')}:{String(time.seconds).padStart(2, '0')}
    </span>
  );
}
