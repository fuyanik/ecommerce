'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineSearch, HiOutlineUser, HiOutlineMenu, HiOutlineX, HiArrowLeft } from 'react-icons/hi';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

// Animated Logo Component with shimmer effect
function AnimatedLogo() {
  return (
    <Link href="/" className="relative flex items-center overflow-hidden rounded-xl">
      {/* Main Logo Container */}
      <div className="relative flex items-center py-1 px-2">
        {/* Logo Icon */}
        <div className="relative w-8 h-8 mr-2 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
          <div className="w-full h-full rounded-[6px] bg-black flex items-center justify-center">
            <span className="text-sm font-black bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              10
            </span>
          </div>
        </div>
        
        {/* Logo Text */}
        <div className="flex flex-col leading-none">
          <span className="text-[13px] font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
            1001 ÇARŞI
          </span>
          <span className="text-[9px] font-bold tracking-[0.2em] text-gray-400 mt-px">
            AVM
          </span>
        </div>
        
        {/* Shimmer Effect - Periodic shine across the entire logo */}
        <motion.div
          className="absolute inset-0 -skew-x-12"
          initial={{ x: '-100%' }}
          animate={{ x: '200%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 4,
            ease: "easeInOut"
          }}
        >
          <div className="w-8 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent" />
        </motion.div>
      </div>
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
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="h-14 flex items-center justify-between px-4">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          >
            <HiArrowLeft className="w-6 h-6" />
          </button>
          <span className="font-semibold text-lg">
            {isCheckoutPage ? 'Ödeme' : 'Detaylar'}
          </span>
          <div className="w-10" />
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass border-b border-white/10' : 'bg-black/50 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            {/* Logo */}
            <AnimatedLogo />

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/kategori/teknoloji" className="text-sm text-gray-300 hover:text-white transition-colors">
                Teknoloji
              </Link>
              <Link href="/kategori/ev-esyalari" className="text-sm text-gray-300 hover:text-white transition-colors">
                Ev Eşyaları
              </Link>
              <Link href="/kategori/mobilya" className="text-sm text-gray-300 hover:text-white transition-colors">
                Mobilya
              </Link>
              <Link href="/kategori/bebek-urunleri" className="text-sm text-gray-300 hover:text-white transition-colors">
                Bebek
              </Link>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <HiOutlineSearch className="w-5 h-5" />
              </button>

              {/* User */}
              <Link 
                href={user ? '/hesabim' : '/giris'}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
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
                  <HiOutlineUser className="w-5 h-5" />
                )}
              </Link>

              {/* Mobile Menu */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <HiOutlineMenu className="w-5 h-5" />
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
            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl"
          >
            <div className="max-w-2xl mx-auto px-4 pt-20">
              <div className="flex items-center gap-4 mb-8">
                <form onSubmit={handleSearch} className="flex-1">
                  <div className="relative">
                    <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ürün ara..."
                      autoFocus
                      className="w-full h-14 pl-12 pr-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 outline-none focus:border-white/40 transition-colors"
                    />
                  </div>
                </form>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>
              
              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-sm text-gray-400 uppercase tracking-wider">Popüler Aramalar</h3>
                <div className="flex flex-wrap gap-2">
                  {['iPhone', 'Laptop', 'Koltuk', 'Bebek Arabası', 'Buzdolabı'].map((term) => (
                    <button
                      key={term}
                      onClick={() => {
                        setSearchQuery(term);
                        router.push(`/ara?q=${encodeURIComponent(term)}`);
                        setIsSearchOpen(false);
                      }}
                      className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-white/20 transition-colors"
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
            className="fixed inset-0 z-[60] bg-black"
          >
            <div className="h-14 flex items-center justify-between px-4 border-b border-white/10">
              <span className="font-semibold">Menü</span>
              <button 
                onClick={() => setIsMenuOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <HiOutlineX className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-2">
              {[
                { name: 'Ana Sayfa', href: '/' },
                { name: 'Teknoloji', href: '/kategori/teknoloji' },
                { name: 'Ev Eşyaları', href: '/kategori/ev-esyalari' },
                { name: 'Bebek Ürünleri', href: '/kategori/bebek-urunleri' },
                { name: 'Mobilya', href: '/kategori/mobilya' },
                { name: 'Beyaz Eşya', href: '/kategori/beyaz-esya' },
                { name: 'Küçük Ev Aletleri', href: '/kategori/kucuk-ev-aletleri' },
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
                    className="block py-4 px-4 rounded-xl hover:bg-white/10 transition-colors text-lg"
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

