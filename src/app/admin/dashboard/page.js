'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(5));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentOrders(orders);
      const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
      setStats(prev => ({ ...prev, totalOrders: snapshot.size, totalRevenue }));
    });

    const completedQuery = query(collection(db, 'completed_users'), orderBy('createdAt', 'desc'), limit(5));
    const unsubCompleted = onSnapshot(completedQuery, (snapshot) => {
      setStats(prev => ({ ...prev, completedUsers: snapshot.size }));
      setRecentUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'completed' })));
    });

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center">
              <span className="text-white font-black">M</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Admin Panel</span>
              <p className="text-xs text-gray-500">Mobilya Ev & Dekor</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            Çıkış
          </button>
        </div>
      </header>

      <main className="pt-16 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6">
            {[
              { icon: HiOutlineClipboardList, label: 'Toplam Sipariş', value: stats.totalOrders, color: 'bg-blue-500', lightColor: 'bg-blue-50', textColor: 'text-blue-600' },
              { icon: HiOutlineCurrencyDollar, label: 'Toplam Gelir', value: formatPrice(stats.totalRevenue), color: 'bg-green-500', lightColor: 'bg-green-50', textColor: 'text-green-600' },
              { icon: HiOutlineUsers, label: 'Tamamlanan', value: stats.completedUsers, color: 'bg-purple-500', lightColor: 'bg-purple-50', textColor: 'text-purple-600' },
              { icon: HiOutlineExclamation, label: 'Tamamlanmayan', value: stats.incompleteUsers, color: 'bg-amber-500', lightColor: 'bg-amber-50', textColor: 'text-amber-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
              >
                <div className={`w-10 h-10 ${stat.lightColor} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4">
            <Link href="/admin/products" className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <HiOutlineShoppingBag className="w-6 h-6 text-gray-400 group-hover:text-red-500 mb-2 transition-colors" />
              <p className="font-semibold text-gray-900">Ürünler</p>
              <p className="text-sm text-gray-500">{products.length} ürün</p>
            </Link>
            <Link href="/admin/orders" className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <HiOutlineClipboardList className="w-6 h-6 text-gray-400 group-hover:text-red-500 mb-2 transition-colors" />
              <p className="font-semibold text-gray-900">Siparişler</p>
              <p className="text-sm text-gray-500">Tüm siparişler</p>
            </Link>
            <Link href="/admin/users" className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <HiOutlineUserGroup className="w-6 h-6 text-gray-400 group-hover:text-red-500 mb-2 transition-colors" />
              <p className="font-semibold text-gray-900">Müşteriler</p>
              <p className="text-sm text-gray-500">Kayıtlı kullanıcılar</p>
            </Link>
            <Link href="/admin/products/new" className="p-4 bg-gradient-to-br from-red-500 to-orange-400 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-white">
              <HiOutlinePlus className="w-6 h-6 mb-2" />
              <p className="font-semibold">Yeni Ürün</p>
              <p className="text-sm text-white/80">Ürün ekle</p>
            </Link>
          </div>

          {/* Categories Overview */}
          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Kategoriler</h2>
              <Link href="/admin/products" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                Tümü <HiOutlineChevronRight className="w-4 h-4" />
              </Link>
            </div>
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.categoryId).length;
                  return (
                    <div key={cat.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="font-medium text-sm text-gray-900 mt-2">{cat.name}</p>
                      <p className="text-xs text-gray-500">{count} ürün</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 bg-white border border-gray-100 rounded-xl">
                {isLoading ? 'Yükleniyor...' : 'Kategori bulunamadı'}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 py-4">
            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Son Siparişler</h2>
                <Link href="/admin/orders" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                  Tümü <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.length > 0 ? recentOrders.map((order) => (
                  <div key={order.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-mono text-gray-400">#{order.id.slice(0, 8)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        order.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {order.status === 'pending' ? 'Beklemede' : 
                         order.status === 'completed' ? 'Tamamlandı' : order.status}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{order.customer?.firstName} {order.customer?.lastName}</p>
                    <div className="flex items-center justify-between mt-2 text-sm">
                      <span className="text-gray-500">{formatDate(order.createdAt)}</span>
                      <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 bg-white border border-gray-100 rounded-xl">
                    Henüz sipariş yok
                  </div>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Son Müşteriler</h2>
                <Link href="/admin/users" className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                  Tümü <HiOutlineChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentUsers.length > 0 ? recentUsers.map((user) => (
                  <div key={user.id} className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user.type === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {user.type === 'completed' ? 'Tamamlandı' : 'Beklemede'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(user.createdAt)}</p>
                  </div>
                )) : (
                  <div className="p-8 text-center text-gray-400 bg-white border border-gray-100 rounded-xl">
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
