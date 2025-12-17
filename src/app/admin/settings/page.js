'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineArrowLeft,
  HiOutlineSave,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlineOfficeBuilding,
  HiOutlineCheck,
  HiCheckCircle
} from 'react-icons/hi';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [settings, setSettings] = useState({
    iban: '',
    accountHolder: '',
    bankName: ''
  });

  useEffect(() => {
    const adminAuth = localStorage.getItem('admin_auth');
    if (adminAuth !== 'true') {
      router.push('/admin');
      return;
    }

    // Fetch existing settings
    const fetchSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'payment'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setSettings({
            iban: data.iban || '',
            accountHolder: data.accountHolder || '',
            bankName: data.bankName || ''
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const formatIban = (value) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    // Add spaces every 4 characters
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleIbanChange = (e) => {
    const formatted = formatIban(e.target.value);
    setSettings(prev => ({ ...prev, iban: formatted }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'payment'), {
        iban: settings.iban,
        accountHolder: settings.accountHolder,
        bankName: settings.bankName,
        updatedAt: serverTimestamp()
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast - Fixed at top */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md"
          >
            <div className="bg-green-500 text-white p-4 rounded-2xl shadow-2xl shadow-green-500/30 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <HiCheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg">Başarıyla Kaydedildi! ✓</p>
                <p className="text-sm text-green-100">IBAN bilgileri Firebase&apos;e güncellendi.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard"
              className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <span className="font-bold text-gray-900">Ödeme Ayarları</span>
              <p className="text-xs text-gray-500">IBAN & Banka Bilgileri (Firebase)</p>
            </div>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Settings Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <HiOutlineCreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">EFT/Havale Bilgileri</h2>
                <p className="text-sm text-gray-500">Müşterilere gösterilecek banka bilgileri</p>
              </div>
            </div>

            <div className="space-y-5">
              {/* IBAN */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  IBAN Numarası
                </label>
                <div className="relative">
                  <HiOutlineCreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="iban"
                    value={settings.iban}
                    onChange={handleIbanChange}
                    className={`${inputClass} pl-12 font-mono tracking-wider`}
                    placeholder="TR00 0000 0000 0000 0000 0000 00"
                    maxLength={32}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Örnek: TR12 3456 7890 1234 5678 9012 34</p>
              </div>

              {/* Account Holder */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Hesap Sahibi
                </label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="accountHolder"
                    value={settings.accountHolder}
                    onChange={handleInputChange}
                    className={`${inputClass} pl-12`}
                    placeholder="Ad Soyad veya Şirket Adı"
                  />
                </div>
              </div>

              {/* Bank Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Banka Adı (Opsiyonel)
                </label>
                <div className="relative">
                  <HiOutlineOfficeBuilding className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="bankName"
                    value={settings.bankName}
                    onChange={handleInputChange}
                    className={`${inputClass} pl-12`}
                    placeholder="Banka adı"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Önizleme (Müşteri Görünümü)</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-500">IBAN</div>
                    <div className="font-mono font-medium text-gray-900 text-sm">
                      {settings.iban || 'TR00 0000 0000 0000 0000 0000 00'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div>
                    <div className="text-[10px] text-gray-500">Hesap Sahibi</div>
                    <div className="font-medium text-gray-900 text-sm">
                      {settings.accountHolder || 'Hesap sahibi adı'}
                    </div>
                  </div>
                </div>
                {settings.bankName && (
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                    <div>
                      <div className="text-[10px] text-gray-500">Banka</div>
                      <div className="font-medium text-gray-900 text-sm">
                        {settings.bankName}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving || !settings.iban || !settings.accountHolder}
              className={`w-full h-14 rounded-xl font-semibold text-lg mt-6 flex items-center justify-center gap-2 transition-all ${
                isSaving || !settings.iban || !settings.accountHolder
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30 hover:shadow-xl'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <HiOutlineSave className="w-5 h-5" />
                  Değişiklikleri Kaydet
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold text-blue-800 mb-1">💡 Bilgi</h3>
            <p className="text-sm text-blue-700">
              Bu bilgiler <strong>Firebase</strong>&apos;de saklanır ve müşteriler EFT/Havale ile ödeme yapmak istediklerinde checkout sayfasında gösterilir.
              Publish ettikten sonra da bu ayarlar geçerli olacaktır.
            </p>
          </div>

          {/* Firebase Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Firebase Firestore ile senkronize
          </div>
        </div>
      </main>
    </div>
  );
}

