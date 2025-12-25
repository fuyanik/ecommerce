'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineLogout,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineChevronRight
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { icon: HiOutlineShoppingBag, label: 'Siparişlerim', href: '/siparislerim' },
  { icon: HiOutlineHeart, label: 'Favorilerim', href: '/favoriler' },
  { icon: HiOutlineLocationMarker, label: 'Adreslerim', href: '/adreslerim' },
  { icon: HiOutlineCog, label: 'Ayarlar', href: '/ayarlar' },
];

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!user && !loading) {
      router.push('/giris');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[138px]">
        <div className="animate-pulse text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8 pt-[138px]">
      {/* Header */}
      <div className="bg-white px-4 py-8 text-center border-b border-gray-100">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 shadow-sm">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt={user.displayName || 'User'}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl text-gray-400">
              {user.displayName?.[0] || user.email?.[0] || '?'}
            </div>
          )}
        </div>
        <h1 className="text-xl font-bold text-gray-900">{user.displayName || 'Kullanıcı'}</h1>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>

      {/* Menu */}
      <div className="px-4 py-6">
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => router.push(item.href)}
              className="w-full flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-gray-500" />
                <span className="text-gray-900">{item.label}</span>
              </div>
              <HiOutlineChevronRight className="w-5 h-5 text-gray-400" />
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 mt-4 bg-red-50 border border-red-100 rounded-xl text-red-600 hover:bg-red-100 transition-colors"
        >
          <HiOutlineLogout className="w-5 h-5" />
          <span>Çıkış Yap</span>
        </motion.button>
      </div>
    </div>
  );
}
