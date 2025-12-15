'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSearch,
  HiOutlineUser,
  HiOutlineCheck,
  HiOutlineExclamation
} from 'react-icons/hi';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminUsersPage() {
  const router = useRouter();
  const [completedUsers, setCompletedUsers] = useState([]);
  const [incompleteUsers, setIncompleteUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

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

  const filteredUsers = getFilteredUsers();

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/dashboard" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10">
              <HiOutlineArrowLeft className="w-5 h-5" />
            </Link>
            <span className="font-bold">Müşteriler</span>
          </div>
        </div>
      </header>

      <main className="pt-14 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-2xl font-bold">{allUsers.length}</p>
              <p className="text-xs text-gray-400">Toplam</p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-400">{completedUsers.length}</p>
              <p className="text-xs text-green-400">Tamamlanmış</p>
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-center">
              <p className="text-2xl font-bold text-yellow-400">{incompleteUsers.length}</p>
              <p className="text-xs text-yellow-400">Tamamlanmamış</p>
            </div>
          </div>

          {/* Filters */}
          <div className="py-4 space-y-4">
            <div className="relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="İsim, telefon veya e-posta ara..."
                className="w-full h-12 pl-12 pr-4 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-white/30"
              />
            </div>
            
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'Tümü', count: allUsers.length },
                { id: 'completed', label: 'Tamamlanmış', count: completedUsers.length },
                { id: 'incomplete', label: 'Tamamlanmamış', count: incompleteUsers.length }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    activeTab === tab.id 
                      ? 'bg-white text-black' 
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Users List */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Yükleniyor...</div>
          ) : filteredUsers.length > 0 ? (
            <div className="space-y-3">
              {filteredUsers.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      user.type === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {user.type === 'completed' 
                        ? <HiOutlineCheck className="w-5 h-5" />
                        : <HiOutlineExclamation className="w-5 h-5" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">
                          {user.firstName} {user.lastName}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          user.type === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {user.type === 'completed' ? 'Tamamlandı' : 'Tamamlanmadı'}
                        </span>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <span>📱</span> {user.phone || '-'}
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <span>✉️</span> {user.email || '-'}
                        </p>
                        {user.city && (
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <span>📍</span> {user.district}, {user.city}
                          </p>
                        )}
                        {user.address && (
                          <p className="text-sm text-gray-400 flex items-center gap-2">
                            <span>🏠</span> {user.address}
                          </p>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 mt-3">
                        Kayıt: {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                <HiOutlineUser className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-gray-400">Müşteri bulunamadı</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

