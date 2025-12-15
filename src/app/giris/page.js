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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white/10 flex items-center justify-center">
          <HiOutlineUser className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Giriş Yap</h1>
        <p className="text-gray-400 mb-8">
          Alışveriş deneyiminizi kişiselleştirin
        </p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 h-14 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          <FcGoogle className="w-6 h-6" />
          Google ile Giriş Yap
        </motion.button>

        <p className="text-xs text-gray-500 mt-6">
          Giriş yaparak, Kullanım Koşullarını ve Gizlilik Politikasını kabul etmiş olursunuz.
        </p>
      </motion.div>
    </div>
  );
}

