'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { HiOutlineUser } from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { user, signInWithGoogle, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-[138px]">
        <div className="animate-pulse text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 pt-[138px]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-red-50 flex items-center justify-center">
            <HiOutlineUser className="w-8 h-8 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Giriş Yap</h1>
          <p className="text-gray-500 mb-8">
            Alışveriş deneyiminizi kişiselleştirin
          </p>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 h-14 bg-white text-gray-900 font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
          >
            <FcGoogle className="w-6 h-6" />
            Google ile Giriş Yap
          </motion.button>

          <p className="text-xs text-gray-400 mt-6">
            Giriş yaparak, Kullanım Koşullarını ve Gizlilik Politikasını kabul etmiş olursunuz.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
