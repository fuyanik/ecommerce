'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlinePlus,
  HiOutlineChevronRight,
  HiOutlineUserGroup,
  HiOutlineExclamation
} from 'react-icons/hi';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAllProducts, getAllCategories } from '@/lib/productService';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    completedUsers: 0,
    incompleteUsers: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }

    // Load products and categories from Firebase
    const loadProductsData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProductsData();

    // Fetch orders
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentOrders(orders);
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats(prev => ({ ...prev, totalOrders: snapshot.size, totalRevenue }));
    });

    // Fetch completed users
    const completedQuery = query(collection(db, 'completed_users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubCompleted = onSnapshot(completedQuery, (snapshot) => {
      setStats(prev => ({ ...prev, completedUsers: snapshot.size }));
      setRecentUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'completed' })));
    });

    // Fetch incomplete users
    const incompleteQuery = query(collection(db, 'incomplete_users'), orderBy('createdAt', 'desc'));
    const unsubIncomplete = onSnapshot(incompleteQuery, (snapshot) => {
      setStats(prev => ({ ...prev, incompleteUsers: snapshot.size }));
    });

    return () => {
      unsubOrders();
      unsubCompleted();
      unsubIncomplete();
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    router.push('/admin');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '-';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
            <span className="font-bold">Admin Panel</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Çıkış
          </button>
        </div>
      </header>

      <main className="pt-14 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            {[
              { icon: HiOutlineClipboardList, label: 'Toplam Sipariş', value: stats.totalOrders, color: 'text-blue-400' },
              { icon: HiOutlineCurrencyDollar, label: 'Toplam Gelir', value: formatPrice(stats.totalRevenue), color: 'text-green-400' },
              { icon: HiOutlineUsers, label: 'Tamamlanan Müşteri', value: stats.completedUsers, color: 'text-purple-400' },
              { icon: HiOutlineExclamation, label: 'Tamamlanmayan', value: stats.incompleteUsers, color: 'text-yellow-400' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 border border-white/10 rounded-2xl"
              >
                <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <Link href="/admin/products" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
              <HiOutlineShoppingBag className="w-6 h-6 mb-2" />
              <p className="font-medium">Ürünler</p>
              <p className="text-sm text-gray-400">{products.length} ürün</p>
            </Link>
            <Link href="/admin/orders" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <HiOutlineClipboardList className="w-6 h-6 mb-2" />
              <p className="font-medium">Siparişler</p>
              <p className="text-sm text-gray-400">Tüm siparişler</p>
            </Link>
            <Link href="/admin/users" className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
              <HiOutlineUserGroup className="w-6 h-6 mb-2" />
              <p className="font-medium">Müşteriler</p>
              <p className="text-sm text-gray-400">Kayıtlı kullanıcılar</p>
            </Link>
            <Link href="/admin/products/new" className="p-4 bg-white text-black rounded-2xl hover:bg-gray-100 transition-colors">
              <HiOutlinePlus className="w-6 h-6 mb-2" />
              <p className="font-medium">Yeni Ürün</p>
              <p className="text-sm text-gray-600">Ürün ekle</p>
            </Link>
          </div>

          {/* Categories Overview */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Kategoriler</h2>
              <Link href="/admin/products" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                Tümü <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.categoryId).length;
                  return (
                    <div key={cat.id} className="p-3 bg-white/5 border border-white/10 rounded-xl">
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="font-medium text-sm mt-2">{cat.name}</p>
                      <p className="text-xs text-gray-400">{count} ürün</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-white/5 border border-white/10 rounded-xl">
                {isLoading ? 'Yükleniyor...' : 'Kategori bulunamadı'}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Son Siparişler</h2>
                <Link href="/admin/orders" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                  Tümü <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-gray-400">#{order.id.slice(0, 8)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {order.status === 'pending' ? 'Beklemede' : 
                         order.status === 'completed' ? 'Tamamlandı' : order.status}
                      </span>
                    </div>
                    <p className="font-medium">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-400">{formatDate(order.createdAt)}</span>
                      <span className="font-bold">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 bg-white/5 border border-white/10 rounded-xl">
                    Henüz sipariş yok
                  </div>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Son Müşteriler</h2>
                <Link href="/admin/users" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">
                  Tümü <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user.id} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{user.firstName} {user.lastName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        user.type === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {user.type === 'completed' ? 'Tamamlandı' : 'Tamamlanmadı'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{user.phone}</p>
                    <p className="text-sm text-gray-400">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(user.createdAt)}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 bg-white/5 border border-white/10 rounded-xl">
                    Henüz müşteri yok
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
