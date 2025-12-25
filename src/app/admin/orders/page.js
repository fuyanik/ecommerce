'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlinePhotograph,
  HiOutlinePhone
} from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReceiptModal, setShowReceiptModal] = useState(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }

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

  const deleteOrder = async (orderId) => {
    if (!confirm('Bu siparişi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Sipariş silinirken bir hata oluştu.');
    }
  };

  const statusColors = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    processing: 'bg-blue-100 text-blue-700 border-blue-200',
    shipped: 'bg-purple-100 text-purple-700 border-purple-200',
    completed: 'bg-green-100 text-green-700 border-green-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200'
  };

  const statusLabels = {
    pending: 'Beklemede',
    processing: 'İşleniyor',
    shipped: 'Kargoda',
    completed: 'Tamamlandı',
    cancelled: 'İptal'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900">Siparişler</span>
          </div>
          <span className="text-sm text-gray-500">{orders.length} sipariş</span>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            {[
              { label: 'Toplam', count: orders.length, color: 'bg-gray-100 text-gray-700' },
              { label: 'Beklemede', count: orders.filter(o => o.status === 'pending').length, color: 'bg-amber-100 text-amber-700' },
              { label: 'İşleniyor', count: orders.filter(o => o.status === 'processing').length, color: 'bg-blue-100 text-blue-700' },
              { label: 'Kargoda', count: orders.filter(o => o.status === 'shipped').length, color: 'bg-purple-100 text-purple-700' },
              { label: 'Tamamlandı', count: orders.filter(o => o.status === 'completed').length, color: 'bg-green-100 text-green-700' },
            ].map((stat) => (
              <div key={stat.label} className={`p-3 rounded-xl ${stat.color}`}>
                <p className="text-2xl font-bold">{stat.count}</p>
                <p className="text-xs font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sipariş ID, müşteri adı veya telefon ara..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {['all', 'pending', 'processing', 'shipped', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    statusFilter === status 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : statusLabels[status]}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List - Compact Rows */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`flex items-center gap-4 px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'
                  }`}
                >
                  {/* Order ID */}
                  <span className="text-xs font-mono text-gray-400 w-[70px]">#{order.id.slice(0, 6).toUpperCase()}</span>
                  
                  {/* Status */}
                  <div className="w-[90px]">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[order.status] || statusColors.pending}`}>
                      {statusLabels[order.status] || 'Beklemede'}
                    </span>
                  </div>

                  {/* Customer */}
                  <div className="w-[130px]">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                  </div>

                  {/* Phone */}
                  <p className="text-xs text-gray-400 w-[110px] hidden sm:block truncate">{order.customer?.phone}</p>

                  {/* Items Preview */}
                  <div className="w-[100px] hidden md:flex gap-1">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <div key={i} className="relative w-7 h-7 rounded-md overflow-hidden bg-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <div className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-[9px] text-gray-500 font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400 w-[75px] hidden lg:block">{formatDate(order.createdAt)?.split(',')[0]}</p>

                  {/* Price */}
                  <p className="font-bold text-gray-900 text-sm w-[90px] text-right">{formatPrice(order.total)}</p>

                  {/* Spacer - pushes actions to the right */}
                  <div className="flex-1" />

                  {/* Receipt */}
                  <div className="w-8">
                    {order.receiptUrl && (
                      <button
                        onClick={() => setShowReceiptModal(order.receiptUrl)}
                        className="w-7 h-7 flex items-center justify-center bg-emerald-100 text-emerald-600 rounded-md hover:bg-emerald-200 transition-colors"
                        title="Dekont Görüntüle"
                      >
                        <HiOutlineDocumentText className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Actions - Always at far right */}
                  <div className="flex gap-1">
                    {/* Call Button */}
                    {order.customer?.phone && (
                      <a
                        href={`tel:${order.customer.phone}`}
                        className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                        title="Ara"
                      >
                        <HiOutlinePhone className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Detay"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'processing')}
                          className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                          title="Onayla"
                        >
                          <HiOutlineCheck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="w-7 h-7 flex items-center justify-center bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                          title="İptal"
                        >
                          <HiOutlineX className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 text-gray-400 rounded-md hover:bg-red-100 hover:text-red-600 transition-colors"
                      title="Sil"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <p className="text-gray-400">Sipariş bulunamadı</p>
            </div>
          )}
        </div>
      </main>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm overflow-y-auto"
          >
            <div className="min-h-screen flex items-start justify-center p-4 py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-gray-900 to-slate-800 p-4 text-white flex items-center justify-between">
                  <h2 className="text-lg font-bold">Sipariş Detayı</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteOrder(selectedOrder.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-300 transition-colors"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Order Info */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Sipariş No</span>
                      <span className="font-mono font-bold text-gray-900">#{selectedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">Tarih</span>
                      <span className="text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Durum</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-red-500"
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Receipt Section */}
                  {selectedOrder.receiptUrl && (
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                            <HiOutlineDocumentText className="w-5 h-5 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-emerald-800">Dekont Yüklendi</p>
                            <p className="text-xs text-emerald-600">
                              {selectedOrder.receiptUploadedAt ? formatDate(selectedOrder.receiptUploadedAt) : 'Tarih bilinmiyor'}
                            </p>
                          </div>
                        </div>
                        <a
                          href={selectedOrder.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors"
                        >
                          <HiOutlineExternalLink className="w-4 h-4" />
                          Görüntüle
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Müşteri Bilgileri</h3>
                    <p className="text-gray-900">{selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.phone}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.customer?.email}</p>
                  </div>

                  {/* Shipping Address */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Teslimat Adresi</h3>
                    <p className="text-gray-900">{selectedOrder.shippingAddress?.address}</p>
                    <p className="text-sm text-gray-500">
                      {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
                    </p>
                    <p className="text-sm text-gray-500">{selectedOrder.shippingAddress?.postalCode}</p>
                  </div>

                  {/* Items */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">Ürünler</h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white">
                            <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">x{item.quantity}</p>
                            <p className="text-sm font-bold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between font-bold text-lg text-gray-900">
                        <span>Toplam</span>
                        <span>{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Receipt Modal */}
      <AnimatePresence>
        {showReceiptModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReceiptModal(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden"
            >
              <div className="bg-gray-900 p-4 text-white flex items-center justify-between">
                <h3 className="font-bold">Dekont Görüntüle</h3>
                <div className="flex items-center gap-2">
                  <a
                    href={showReceiptModal}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
                  >
                    <HiOutlineExternalLink className="w-4 h-4" />
                    Yeni Sekmede Aç
                  </a>
                  <button
                    onClick={() => setShowReceiptModal(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <HiOutlineX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[calc(90vh-80px)] overflow-auto">
                <img
                  src={showReceiptModal}
                  alt="Dekont"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
