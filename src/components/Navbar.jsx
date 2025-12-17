'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import PromoBanner from './PromoBanner';
import logosaydam from '../assets/logosaydam.png';

// Animated Logo Component with shine effect
function Logo() {
  return (
    <Link href="/" className="flex items-center mt-3 mr-2  group">
     
        <div className="relative overflow-hidden">
          {/* Background glow effect */}
        
          
          <Image  src={logosaydam} alt="Logo" width={150} height={140} />
      
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
      {/* Promo Banner */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <PromoBanner />
      </div>
      
      <nav 
        className={`fixed top-[45px] left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/80 backdrop-blur-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-1">
          <div className="h-[60px] flex items-center justify-between">
            {/* Logo */}
            <Logo />

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

              {/* Cart */}
              <Link 
                href="/sepet"
                className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <HiOutlineShoppingBag className="w-5 h-5 text-gray-700" />
                {getCartCount() > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* User */}
              <Link 
                href={user ? '/hesabim' : '/giris'}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                {user?.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <HiOutlineUser className="w-5 h-5 text-gray-700" />
                )}
              </Link>

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
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-0 z-60 bg-white"
          >
            <div className="h-[60px] flex items-center justify-between px-4 border-b border-gray-100">
              <span className="font-semibold text-gray-900">Menü</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <HiOutlineX className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            
            <div className="p-4 space-y-1">
              {[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Koltuk Takımları', href: '/kategori/koltuk-takimi' },
                { name: 'Yatak Odası', href: '/kategori/yatak-odasi' },
                { name: 'Yemek Odası', href: '/kategori/yemek-odasi' },
                { name: 'Mutfak', href: '/kategori/mutfak' },
                { name: 'Beyaz Eşya', href: '/kategori/beyaz-esya' },
                { name: 'Küçük Ev Aletleri', href: '/kategori/kucuk-ev-aletleri' },
                { name: 'Dekorasyon', href: '/kategori/dekorasyon' },
              ].map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center py-4 px-4 rounded-xl hover:bg-gray-50 transition-colors text-gray-800 font-medium"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
