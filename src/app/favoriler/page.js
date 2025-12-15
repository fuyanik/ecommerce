'use client';

import Link from 'next/link';
import { HiOutlineHeart } from 'react-icons/hi';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ProductCard';
import Footer from '@/components/Footer';

export default function FavoritesPage() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
          <HiOutlineHeart className="w-12 h-12 text-gray-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Favori Listeniz Boş</h1>
        <p className="text-gray-400 mb-8">
          Beğendiğiniz ürünleri favorilere ekleyin, daha sonra kolayca ulaşın.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          Alışverişe Başla
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="px-4 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold">Favorilerim</h1>
        <p className="text-gray-400">{wishlist.length} ürün</p>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

