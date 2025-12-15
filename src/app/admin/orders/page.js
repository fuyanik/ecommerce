'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX
} from 'react-icons/hi';
import { collection, query, orderBy, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }

    // Fetch orders in real-time
    const ordersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    let filtered = [...orders];
    
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.phone?.includes(searchQuery)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  }, [searchQuery, statusFilter, orders]);

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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus });
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    processing: 'bg-blue-500/20 text-blue-400',
    shipped: 'bg-purple-500/20 text-purple-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400'
  };

  const statusLabels = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    completed: 'Tamamlandı',
    cancelled: 'İptal'
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold">Siparişler</span>
          </div>
        </div>
      </header>

      <main className="pt-14 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="py-4 space-y-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş ID, müşteri adı veya telefon ara..."
                className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/30"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-3">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="text-sm font-mono text-gray-400">#{order.id.slice(0, 8).toUpperCase()}</span>
                      <p className="font-medium mt-1">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{order.customer?.phone}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full ${statusColors[order.status] || statusColors.pending}`}>
                      {statusLabels[order.status] || 'Beklemede'}
                    </span>
                  </div>

                  {/* Items Preview */}
                  <div className="flex gap-2 mb-3 overflow-x-auto hide-scrollbar">
                    {order.items?.slice(0, 4).map((item, i) => (
                      <div key={i} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                    ))}
                    {order.items?.length > 4 && (
                      <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-xs">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                      <p className="font-bold mt-1">{formatPrice(order.total)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 flex items-center gap-1"
                      >
                        <HiOutlineEye className="w-4 h-4" />
                        Detay
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'processing')}
                            className="px-3 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30"
                          >
                            <HiOutlineCheck className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30"
                          >
                            <HiOutlineX className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              Sipariş bulunamadı
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl overflow-y-auto">
          <div className="max-w-2xl mx-auto p-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Sipariş Detayı</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <HiOutlineX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Order Info */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Sipariş No</span>
                  <span className="font-mono">#{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Tarih</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Durum</span>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm outline-none"
                  >
                    {Object.entries(statusLabels).map(([key, label]) => (
                      <option key={key} value={key} className="bg-gray-900">{label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="font-semibold mb-3">Müşteri Bilgileri</h3>
                <p className="text-sm">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                <p className="text-sm text-gray-400">{selectedOrder.customer?.phone}</p>
                <p className="text-sm text-gray-400">{selectedOrder.customer?.email}</p>
              </div>

              {/* Shipping Address */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="font-semibold mb-3">Teslimat Adresi</h3>
                <p className="text-sm">{selectedOrder.shippingAddress?.address}</p>
                <p className="text-sm text-gray-400">
                  {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                </p>
                <p className="text-sm text-gray-400">{selectedOrder.shippingAddress?.postalCode}</p>
              </div>

              {/* Items */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h3 className="font-semibold mb-3">Ürünler</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <p className="text-sm text-gray-400">x{item.quantity}</p>
                        <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-4 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Toplam</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

