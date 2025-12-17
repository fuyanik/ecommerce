'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineExclamation,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineX,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlinePhone,
  HiOutlineMail,
  HiOutlineLocationMarker
} from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminUsersPage() {
  const router = useRouter();
  const [completedUsers, setCompletedUsers] = useState([]);
  const [incompleteUsers, setIncompleteUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showReceiptModal, setShowReceiptModal] = useState(null);

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }

    // Fetch completed users
    const completedQuery = query(collection(db, 'completed_users'), orderBy('createdAt', 'desc'));
    const unsubCompleted = onSnapshot(completedQuery, (snapshot) => {
      setCompletedUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'completed' })));
    });

    // Fetch incomplete users
    const incompleteQuery = query(collection(db, 'incomplete_users'), orderBy('createdAt', 'desc'));
    const unsubIncomplete = onSnapshot(incompleteQuery, (snapshot) => {
      setIncompleteUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'incomplete' })));
      setIsLoading(false);
    });

    return () => {
      unsubCompleted();
      unsubIncomplete();
    };
  }, [router]);

  // Load user's orders when a user is selected
  useEffect(() => {
    if (selectedUser?.orderId) {
      loadUserOrders(selectedUser.orderId);
    } else if (selectedUser?.phone) {
      loadUserOrdersByPhone(selectedUser.phone);
    }
  }, [selectedUser]);

  const loadUserOrders = async (orderId) => {
    try {
      const orderDoc = await getDocs(query(collection(db, 'orders'), where('__name__', '==', orderId)));
      if (!orderDoc.empty) {
        setUserOrders(orderDoc.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const loadUserOrdersByPhone = async (phone) => {
    try {
      const ordersQuery = query(collection(db, 'orders'), where('customer.phone', '==', phone));
      const ordersSnapshot = await getDocs(ordersQuery);
      setUserOrders(ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const allUsers = [...completedUsers, ...incompleteUsers];
  
  const getFilteredUsers = () => {
    let users = [];
    if (activeTab === 'all') users = allUsers;
    else if (activeTab === 'completed') users = completedUsers;
    else if (activeTab === 'incomplete') users = incompleteUsers;

    if (searchQuery) {
      users = users.filter(u =>
        u.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.phone?.includes(searchQuery) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return users.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    });
  };

  const deleteUser = async (user) => {
    if (!confirm(`${user.firstName} ${user.lastName} müşterisini silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const collectionName = user.type === 'completed' ? 'completed_users' : 'incomplete_users';
      await deleteDoc(doc(db, collectionName, user.id));
      setSelectedUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Müşteri silinirken bir hata oluştu.');
    }
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <span className="font-bold text-gray-900">Müşteriler</span>
          </div>
          <span className="text-sm text-gray-500">{allUsers.length} müşteri</span>
        </div>
      </header>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-gray-900">{allUsers.length}</p>
              <p className="text-xs text-gray-500 font-medium">Toplam Müşteri</p>
            </div>
            <div className="p-4 bg-green-50 border border-green-100 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-green-600">{completedUsers.length}</p>
              <p className="text-xs text-green-600 font-medium">Alışveriş Tamamlandı</p>
            </div>
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-sm text-center">
              <p className="text-2xl font-bold text-amber-600">{incompleteUsers.length}</p>
              <p className="text-xs text-amber-600 font-medium">Tamamlanmadı</p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 space-y-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İsim, telefon veya e-posta ara..."
                className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
              />
            </div>
            
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tümü', count: allUsers.length, color: 'gray' },
                { id: 'completed', label: 'Tamamlanmış', count: completedUsers.length, color: 'green' },
                { id: 'incomplete', label: 'Tamamlanmamış', count: incompleteUsers.length, color: 'amber' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Users List - Compact Rows */}
          {isLoading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500">Yükleniyor...</p>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.01 }}
                  className={`flex items-center px-4 py-2.5 hover:bg-blue-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/70'
                  }`}
                >
                  {/* Status Icon */}
                  <div className={`w-8 h-7 flex items-center ${
                    user.type === 'completed' 
                      ? 'text-green-600' 
                      : 'text-amber-600'
                  }`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      user.type === 'completed' 
                        ? 'bg-green-100' 
                        : 'bg-amber-100'
                    }`}>
                      {user.type === 'completed' 
                        ? <HiOutlineCheck className="w-4 h-4" />
                        : <HiOutlineExclamation className="w-4 h-4" />
                      }
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="w-[105px]">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      user.type === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.type === 'completed' ? 'Tamamlandı' : 'Tamamlanmadı'}
                    </span>
                  </div>

                  {/* Name */}
                  <div className="w-[150px]">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>

                  {/* Phone */}
                  <p className="text-xs text-gray-500 w-[125px] hidden sm:flex items-center gap-1 truncate">
                    <HiOutlinePhone className="w-3 h-3 flex-shrink-0" /> {user.phone || '-'}
                  </p>

                  {/* Location */}
                  <div className="w-[155px] hidden md:block">
                    {user.city ? (
                      <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                        <HiOutlineLocationMarker className="w-3 h-3 flex-shrink-0" /> {user.district}, {user.city}
                      </p>
                    ) : (
                      <span className="text-xs text-gray-300">-</span>
                    )}
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400 w-[85px] hidden lg:block">
                    {formatDate(user.createdAt)?.split(',')[0]}
                  </p>

                  {/* Spacer - pushes actions to the right */}
                  <div className="flex-1 min-w-[20px]" />

                  {/* Actions - Always at far right */}
                  <div className="flex gap-1">
                    {/* Call Button */}
                    {user.phone && (
                      <a
                        href={`tel:${user.phone}`}
                        className="w-7 h-7 flex items-center justify-center bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition-colors"
                        title="Ara"
                      >
                        <HiOutlinePhone className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setUserOrders([]);
                      }}
                      className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200 transition-colors"
                      title="Detay"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteUser(user)}
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <HiOutlineUser className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">Müşteri bulunamadı</p>
            </div>
          )}
        </div>
      </main>

      {/* User Detail Modal */}
      <AnimatePresence>
        {selectedUser && (
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
                <div className={`p-4 text-white flex items-center justify-between ${
                  selectedUser.type === 'completed' 
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600' 
                    : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                      {selectedUser.type === 'completed' 
                        ? <HiOutlineCheck className="w-5 h-5" />
                        : <HiOutlineExclamation className="w-5 h-5" />
                      }
                    </div>
                    <div>
                      <h2 className="font-bold">{selectedUser.firstName} {selectedUser.lastName}</h2>
                      <p className="text-white/80 text-sm">
                        {selectedUser.type === 'completed' ? 'Alışveriş Tamamlandı' : 'Alışveriş Tamamlanmadı'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => deleteUser(selectedUser)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HiOutlineX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Contact Info */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-3">İletişim Bilgileri</h3>
                    <div className="space-y-2">
                      <p className="text-gray-700 flex items-center gap-2">
                        <HiOutlinePhone className="w-4 h-4 text-gray-400" /> {selectedUser.phone || '-'}
                      </p>
                      <p className="text-gray-700 flex items-center gap-2">
                        <HiOutlineMail className="w-4 h-4 text-gray-400" /> {selectedUser.email || '-'}
                      </p>
                    </div>
                  </div>

                  {/* Address Info */}
                  {selectedUser.address && (
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">Adres Bilgileri</h3>
                      <p className="text-gray-700">{selectedUser.address}</p>
                      <p className="text-gray-500 text-sm">
                        {selectedUser.district}, {selectedUser.city} {selectedUser.postalCode}
                      </p>
                    </div>
                  )}

                  {/* User's Orders with Receipts */}
                  {userOrders.length > 0 && (
                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                      <h3 className="font-semibold text-gray-900 mb-3">Siparişler</h3>
                      <div className="space-y-3">
                        {userOrders.map((order) => (
                          <div key={order.id} className="p-3 bg-white border border-gray-200 rounded-xl">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-mono text-sm text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</span>
                              <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{formatDate(order.createdAt)}</p>
                            
                            {/* Receipt Button */}
                            {order.receiptUrl && (
                              <button
                                onClick={() => setShowReceiptModal(order.receiptUrl)}
                                className="w-full flex items-center justify-center gap-2 p-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-200 transition-colors"
                              >
                                <HiOutlineDocumentText className="w-4 h-4" />
                                Dekont Görüntüle
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Registration Date */}
                  <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 text-sm">Kayıt Tarihi</span>
                      <span className="font-medium text-gray-900">{formatDate(selectedUser.createdAt)}</span>
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
    </div>
  );
}
