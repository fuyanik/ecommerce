'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  HiOutlineShieldCheck, 
  HiOutlineTruck, 
  HiOutlineCreditCard, 
  HiOutlineSupport,
  HiOutlineChevronRight
} from 'react-icons/hi';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';
import { useProducts } from '@/context/ProductsContext';

const heroSlides = [
  {
    title: 'Teknolojide Büyük İndirim',
    subtitle: 'iPhone, Samsung ve daha fazlası',
    discount: '%30\'a varan',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200',
    color: 'from-blue-900/80 to-purple-900/80'
  },
  {
    title: 'Evinizi Yenileyin',
    subtitle: 'Mobilya ve ev dekorasyonu',
    discount: '%40\'a varan',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
    color: 'from-amber-900/80 to-orange-900/80'
  },
  {
    title: 'Bebeğiniz İçin En İyisi',
    subtitle: 'Güvenli ve kaliteli ürünler',
    discount: '%25\'e varan',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200',
    color: 'from-pink-900/80 to-rose-900/80'
  }
];

const features = [
  {
    icon: HiOutlineShieldCheck,
    title: 'Güvenli Alışveriş',
    description: '256-bit SSL şifreleme'
  },
  {
    icon: HiOutlineTruck,
    title: 'Hızlı Teslimat',
    description: '1-3 iş günü içinde'
  },
  {
    icon: HiOutlineCreditCard,
    title: 'Güvenli Ödeme',
    description: 'Tüm kartlar geçerli'
  },
  {
    icon: HiOutlineSupport,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız'
  }
];

export default function HomePage() {
  const { products, categories, isLoading, getFeaturedProducts, getDiscountedProducts } = useProducts();
  
  const featuredProducts = getFeaturedProducts();
  const discountedProducts = getDiscountedProducts();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-8">
      {/* Hero Slider */}
      <section className="relative -mt-14 pt-14 rounded-lg">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="w-full aspect-[16/10] md:aspect-[21/9] rounded-lg"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full rounded-lg">
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
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
                        {slide.discount} indirim
                      </span>
                      <h1 className="text-3xl md:text-5xl font-bold mb-2">
                        {slide.title}
                      </h1>
                      <p className="text-lg text-gray-200 mb-6">
                        {slide.subtitle}
                      </p>
                      <Link
                        href="/kategori/teknoloji"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-100 transition-colors"
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

      {/* Categories */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Kategoriler</h2>
            <Link href="/kategoriler" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
              Tümü <HiOutlineChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/kategori/${category.categoryId}`}
                  className="block group"
                >
                  <div className="relative aspect-square rounded-2xl overflow-hidden mb-2 bg-gradient-to-br from-gray-800 to-gray-900">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl">{category.icon}</span>
                    </div>
                  </div>
                  <p className="text-center text-sm font-medium truncate">
                    {category.name}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Deals */}
      {discountedProducts.length > 0 && (
        <section className="py-8 px-4 bg-gradient-to-r from-red-900/20 to-orange-900/20">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🔥</span>
                <div>
                  <h2 className="text-xl font-bold">Fırsat Ürünleri</h2>
                  <p className="text-sm text-gray-400">Kaçırılmayacak indirimler</p>
                </div>
              </div>
              <Link href="/firsatlar" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                Tümü <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="overflow-x-auto hide-scrollbar -mx-4 px-4">
              <div className="flex gap-4" style={{ width: 'max-content' }}>
                {discountedProducts.slice(0, 6).map((product, index) => (
                  <div key={product.id} className="w-44 flex-shrink-0">
                    <ProductCard product={product} index={index} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Öne Çıkan Ürünler</h2>
              <Link href="/firsatlar" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                Tümü <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Banner */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/kategori/teknoloji" className="group">
              <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800"
                  alt="Teknoloji"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-blue-500/80 rounded-full text-xs font-medium mb-2">
                      Yeni Sezon
                    </span>
                    <h3 className="text-2xl font-bold mb-1">Teknoloji</h3>
                    <p className="text-gray-300 text-sm">En son teknoloji ürünleri</p>
                  </div>
                </div>
              </div>
            </Link>
            
            <Link href="/kategori/mobilya" className="group">
              <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800"
                  alt="Mobilya"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-amber-500/80 rounded-full text-xs font-medium mb-2">
                      Özel Fırsatlar
                    </span>
                    <h3 className="text-2xl font-bold mb-1">Mobilya</h3>
                    <p className="text-gray-300 text-sm">Modern tasarımlar</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* All Products */}
      {products.length > 0 && (
        <section className="py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Tüm Ürünler</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.slice(0, 12).map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why 1001 Çarşı */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Neden 1001 Çarşı AVM?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Türkiye&apos;nin en güvenilir online alışveriş deneyimi için doğru adrestesiniz.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-white/5 to-white/10 border border-white/10">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
              <div>
                <div className="text-3xl font-bold text-white">1M+</div>
                <div className="text-sm text-gray-400">Mutlu Müşteri</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div className="text-sm text-gray-400">Ürün Çeşidi</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">99%</div>
                <div className="text-sm text-gray-400">Müşteri Memnuniyeti</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Destek</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
