'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';
import { HiOutlineChevronRight, HiOutlineChevronLeft, HiOutlineTruck, HiOutlineShieldCheck, HiOutlineCreditCard, HiOutlineSupport, HiOutlineFire } from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

const heroSlides = [
  {
    title: 'Evinizi Yenileyin',
    subtitle: 'Modern koltuk takımları ve mobilyalar',
    discount: '%30\'a varan indirim',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    color: 'from-amber-600/80 to-orange-600/80',
    link: '/kategori/koltuk-takimi'
  },
  {
    title: 'Beyaz Eşya Fırsatları',
    subtitle: 'Samsung, LG, Bosch ve daha fazlası',
    discount: '%25\'e varan indirim',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=1200',
    color: 'from-blue-600/80 to-cyan-600/80',
    link: '/kategori/beyaz-esya'
  },
  {
    title: 'Yatak Odası Takımları',
    subtitle: 'Konforlu uyku için en iyi seçenekler',
    discount: '%20\'ye varan indirim',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
    color: 'from-purple-600/80 to-pink-600/80',
    link: '/kategori/yatak-odasi'
  }
];

const features = [
  { icon: HiOutlineTruck, title: 'Ücretsiz Kargo', description: '2.000 TL üzeri' },
  { icon: HiOutlineShieldCheck, title: 'Güvenli Ödeme', description: '256-bit SSL' },
  { icon: HiOutlineCreditCard, title: 'Taksit İmkanı', description: '12 aya varan' },
  { icon: HiOutlineSupport, title: '7/24 Destek', description: 'Her zaman yanınızda' },
];

export default function HomePage() {
  const { products, categories, isLoading, getFeaturedProducts, getDiscountedProducts } = useProducts();
  
  const featuredProducts = getFeaturedProducts();
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
      {/* Hero Slider */}
      <section className="relative">
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
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.color}`} />
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-4 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="max-w-lg"
                    >
                      <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold text-white mb-4">
                        {slide.discount}
                      </span>
                      <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                        {slide.title}
                      </h1>
                      <p className="text-lg text-white/90 mb-6">
                        {slide.subtitle}
                      </p>
                      <Link
                        href={slide.link}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
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

            {/* Mobile View All Button */}
            <div className="mt-4 px-4 sm:hidden">
              <Link 
                href="/firsatlar" 
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium shadow-lg shadow-red-500/30"
              >
                Tüm Ürünleri Gör <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
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
            <Link href="/kategori/koltuk-takimi" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                  alt="Koltuk Takımları"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-red-500 rounded-full text-xs font-semibold text-white mb-2">
                      Yeni Koleksiyon
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">Koltuk Takımları</h3>
                    <p className="text-white/80 text-sm">Oturma odanıza şıklık katın</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/kategori/beyaz-esya" className="group">
              <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800"
                  alt="Beyaz Eşya"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500 rounded-full text-xs font-semibold text-white mb-2">
                      Büyük Fırsatlar
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-1">Beyaz Eşya</h3>
                    <p className="text-white/80 text-sm">En iyi markalar, en iyi fiyatlar</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Discounted Products */}
      {discountedProducts.length > 0 && (
        <section className="py-8 px-4 bg-gradient-to-r from-red-50 to-orange-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Fırsat Ürünleri</h2>
                <p className="text-sm text-gray-500">Kaçırılmayacak indirimler</p>
              </div>
              <Link href="/firsatlar" className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1">
                Tümü <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {discountedProducts.slice(0, 8).map((product, index) => (
                  <div key={product.id} className="w-44 flex-shrink-0">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Products */}
      {products.length > 0 && (
        <section className="py-8 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Tüm Ürünler</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 12).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trust Section */}
      <section className="py-12 px-4 bg-gray-900 text-white">
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

      <Footer />
    </div>
  );
}
