'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineSupport, HiOutlineFire, HiOutlineUserGroup, HiOutlineEye, HiOutlineAcademicCap, HiOutlineHeart, HiOutlineSparkles } from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';
import yilsonu from '@/assets/yilsonu.png';

const heroSlides = [
  {
    title: 'Bilgisayar',
    subtitle: 'Yeni yıla güçlü bir başlangıç yapın',
    discount: '🎄 Yılbaşı Özel %40 İndirim',
    image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=1200',
    link: '/kategori/bilgisayar'
  },
  {
    title: 'Yazıcı',
    subtitle: 'Ev ve ofis için profesyonel çözümler',
    discount: '🎁 Yılbaşı Özel %35 İndirim',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=1200',
    link: '/kategori/yazici'
  },
  {
    title: 'Tablet',
    subtitle: 'Taşınabilirlik ve performans bir arada',
    discount: '❄️ Yılbaşı Özel %30 İndirim',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=1200',
    link: '/kategori/tablet'
  },
  {
    title: 'Akıllı Saat',
    subtitle: 'Teknoloji bileğinizde, sağlık kontrolünüzde',
    discount: '🎅 Yılbaşı Özel %25 İndirim',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200',
    link: '/kategori/akilli-saat'
  }
];

const features = [
  { icon: HiOutlineTruck, title: 'Ücretsiz Kargo', description: '2.000 TL üzeri' },
  { icon: HiOutlineShieldCheck, title: 'Güvenli Ödeme', description: '256-bit SSL' },
  { icon: HiOutlineCreditCard, title: 'Taksit İmkanı', description: '12 aya varan' },
  { icon: HiOutlineSupport, title: '7/24 Destek', description: 'Her zaman yanınızda' },
];

const socialProofMessages = [
  { icon: HiOutlineUserGroup, text: '1.427', label: 'kişi bugün alışveriş yaptı' },
  { icon: HiOutlineEye, text: '2.873', label: 'kişi siteyi inceliyor' },
];

function SocialProofBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % socialProofMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const current = socialProofMessages[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 py-2 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-white text-xs sm:text-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <Icon className="w-4 h-4" />
            <span className="font-medium">
              <span className="font-bold">{current.text}</span> {current.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { 
    products, 
    categories, 
    isLoading, 
    getFeaturedProducts, 
    getSchoolShoppingProducts,
    getMostFavoritedProducts,
    getSelectedForYouProducts,
    getDiscountedProducts 
  } = useProducts();
  
  const featuredProducts = getFeaturedProducts();
  const schoolShoppingProducts = getSchoolShoppingProducts();
  const mostFavoritedProducts = getMostFavoritedProducts();
  const selectedForYouProducts = getSelectedForYouProducts();
  const discountedProducts = getDiscountedProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[105px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-[8vh]">
      {/* Social Proof Banner */}
      <SocialProofBanner />

      {/* Hero Slider - Yılbaşı Teması */}
      <section className="relative overflow-hidden">
        {/* Kar yağışı efekti - CSS animation ile */}
        <style jsx>{`
          @keyframes snowfall {
            0% {
              transform: translateY(-10px) translateX(0);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) translateX(20px);
              opacity: 0;
            }
          }
        `}</style>
        <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                left: `${(i * 3.5) % 100}%`,
                top: '-10px',
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                opacity: 0.4 + (i % 3) * 0.2,
                animation: `snowfall ${4 + (i % 4)}s linear infinite`,
                animationDelay: `${(i * 0.3) % 4}s`
              }}
            />
          ))}
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full aspect-[16/10] md:aspect-[21/9]"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                {/* Yılbaşı temalı gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/85 via-red-800/70 to-emerald-900/80" />
                
                {/* Dekoratif köşe süslemeleri */}
                <div className="absolute top-4 right-4 text-4xl md:text-6xl opacity-30 z-10">🎄</div>
                <div className="absolute bottom-4 left-4 text-3xl md:text-5xl opacity-20 z-10">❄️</div>
                
                <div className="absolute inset-0 flex items-center z-20">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-lg"
                    >
                      {/* Yılbaşı indirimi etiketi */}
                      <span className="inline-block px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full text-sm font-bold text-red-900 mb-4 shadow-lg shadow-yellow-500/30 animate-pulse">
                        {slide.discount}
                      </span>
                      
                      {/* Yılbaşı Özel başlığı */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-sm font-semibold tracking-wider uppercase">
                          ✨ 2025 Yılbaşı Özel ✨
                        </span>
                      </div>
                      
                      <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">
                        {slide.title}
                      </h1>
                      <p className="text-lg text-white/90 mb-6 drop-shadow">
                        {slide.subtitle}
                      </p>
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-red-900 font-bold rounded-full hover:from-yellow-300 hover:to-amber-400 transition-all shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40 hover:scale-105 transform"
                      >
                        Keşfet
                        <HiOutlineChevronRight className="w-5 h-5" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        
      </section>

{/* Featured Products - Horizontal Scroll */}
      {featuredProducts.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <HiOutlineFire className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Öne Çıkan Ürünler</h2>
                  <p className="text-sm text-gray-500">En çok tercih edilen ürünler</p>
                </div>
              </div>
              <Link 
                href="/firsatlar" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel */}
            <div className="relative group">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                className="!px-4"
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {featuredProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Gradient Fade Effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* School Shopping - Okul Alışverişi */}
      {schoolShoppingProducts.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <HiOutlineAcademicCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Okul Alışverişi</h2>
                  <p className="text-sm text-gray-500">Okula dönüş hazırlıkları</p>
                </div>
              </div>
              <Link 
                href="/kategoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium hover:bg-blue-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel */}
            <div className="relative group">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                className="!px-4"
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {schoolShoppingProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Gradient Fade Effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* Most Favorited - En Çok Favorilenenler */}
      {mostFavoritedProducts.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-white to-pink-50/50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/30">
                  <HiOutlineHeart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">En Çok Favorilenenler</h2>
                  <p className="text-sm text-gray-500">Müşterilerimizin gözdesi</p>
                </div>
              </div>
              <Link 
                href="/favoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-pink-50 text-pink-600 rounded-full text-sm font-medium hover:bg-pink-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel */}
            <div className="relative group">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                className="!px-4"
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {mostFavoritedProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Gradient Fade Effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-pink-50/50 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </section>
      )}

       <div className='w-full h-[40vh] rounded-lg overflow-hidden flex items-center px-3'> 
        <Image className='w-full  object-contain rounded-lg' src={yilsonu} alt="yilsonu"  />
        
        </div> 

      {/* Selected For You - Sizin İçin Seçtiklerimiz */}
      {selectedForYouProducts.length > 0 && (
        <section className="py-8 bg-gradient-to-b from-pink-50/50 to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <HiOutlineSparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Sizin İçin Seçtiklerimiz</h2>
                  <p className="text-sm text-gray-500">Özel seçilmiş ürünler</p>
                </div>
              </div>
              <Link 
                href="/kategoriler" 
                className="hidden sm:flex items-center gap-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-sm font-medium hover:bg-purple-100 transition-colors"
              >
                Tümünü Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {/* Swiper Carousel */}
            <div className="relative group">
              <Swiper
                modules={[FreeMode]}
                spaceBetween={16}
                slidesPerView={2.2}
                freeMode={true}
                grabCursor={true}
                className="!px-4"
                breakpoints={{
                  480: { slidesPerView: 2.5, spaceBetween: 16 },
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  768: { slidesPerView: 3.5, spaceBetween: 20 },
                  1024: { slidesPerView: 4.5, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
                }}
              >
                {selectedForYouProducts.map((product, index) => (
                  <SwiperSlide key={product.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>
              
              {/* Gradient Fade Effects */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-pink-50/50 to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />
            </div>
          </div>
        </section>
      )}

      {/* Categories - Modern Design with Images */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Kategoriler</h2>
            <Link href="/kategoriler" className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
              Tümü <HiOutlineChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Category Cards with Images */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.slice(0, 8).map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/kategori/${category.categoryId}`}
                  className="group block"
                >
                  <div className="relative h-28 md:h-36 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-white font-semibold text-sm md:text-base">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Banner */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/kategori/bilgisayar" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800"
                  alt="Bilgisayar"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-purple-500 rounded-full text-xs font-semibold text-white mb-2">
                      Yeni Modeller
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">Bilgisayar</h3>
                    <p className="text-white/80 text-sm">Güçlü performans, uygun fiyat</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/kategori/yazici" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800"
                  alt="Yazıcı"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-cyan-500 rounded-full text-xs font-semibold text-white mb-2">
                      Özel Fırsatlar
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">Yazıcı</h3>
                    <p className="text-white/80 text-sm">Profesyonel baskı çözümleri</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

    
 {/* Features Bar */}
 <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-2">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <feature.icon className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    

      {/* Trust Section */}
      <section className="py-12  px-4 hide bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Neden Bizi Tercih Etmelisiniz?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">50K+</div>
              <div className="text-gray-400">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">1000+</div>
              <div className="text-gray-400">Ürün Çeşidi</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">99%</div>
              <div className="text-gray-400">Memnuniyet</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-400 mb-2">24/7</div>
              <div className="text-gray-400">Destek</div>
            </div>
          </div>
        </div>
      </section>

     

      <Footer />
    </div>
  );
}
