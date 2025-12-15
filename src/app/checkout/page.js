'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiCheck,
  HiOutlineLockClosed
} from 'react-icons/hi';
import { FcGoogle } from 'react-icons/fc';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const steps = ['Bilgiler', 'Adres', 'Ödeme'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, signInWithGoogle } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.displayName?.split(' ')[0] || '',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
      router.push('/sepet');
    }
  }, [cart, orderComplete, router]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      // User data will be updated via useEffect
    }
  };

  const saveIncompleteUser = async () => {
    try {
      await addDoc(collection(db, 'incomplete_users'), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        createdAt: serverTimestamp(),
        status: 'incomplete',
        step: currentStep
      });
    } catch (error) {
      console.error('Error saving incomplete user:', error);
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      // Save incomplete user when they fill basic info
      await saveIncompleteUser();
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    try {
      // Create order in Firebase
      const orderRef = await addDoc(collection(db, 'orders'), {
        userId: user?.uid || null,
        customer: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images[0]
        })),
        total: getCartTotal(),
        status: 'pending',
        paymentStatus: 'paid',
        createdAt: serverTimestamp()
      });

      // If user completed checkout, update their status
      if (formData.email) {
        await addDoc(collection(db, 'completed_users'), {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          postalCode: formData.postalCode,
          orderId: orderRef.id,
          userId: user?.uid || null,
          createdAt: serverTimestamp(),
          status: 'completed'
        });
      }

      setOrderId(orderRef.id);
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.phone;
  const isStep2Valid = formData.address && formData.city && formData.district;
  const isStep3Valid = formData.cardNumber && formData.cardName && formData.expiry && formData.cvv;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
        >
          <HiCheck className="w-10 h-10 text-green-500" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2">Siparişiniz Alındı!</h1>
        <p className="text-gray-400 mb-2">
          Sipariş numaranız: <span className="text-white font-mono">{orderId.slice(0, 8).toUpperCase()}</span>
        </p>
        <p className="text-gray-400 mb-8">
          Siparişinizle ilgili bilgiler e-posta adresinize gönderilecektir.
        </p>
        <button
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-black font-semibold rounded-xl"
        >
          Alışverişe Devam Et
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {/* Progress Steps */}
      <div className="px-4 py-6 border-b border-white/10">
        <div className="flex items-center justify-between max-w-md mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                  index <= currentStep 
                    ? 'bg-white text-black' 
                    : 'bg-white/10 text-gray-400'
                }`}>
                  {index < currentStep ? <HiCheck className="w-5 h-5" /> : index + 1}
                </div>
                <span className={`text-xs mt-1 ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-2 ${
                  index < currentStep ? 'bg-white' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Steps */}
      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {!user && (
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-sm text-gray-400 mb-3">
                    Hızlı ödeme için giriş yapın veya misafir olarak devam edin
                  </p>
                  <button
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center gap-3 h-12 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <FcGoogle className="w-5 h-5" />
                    Google ile Giriş Yap
                  </button>
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold mb-4">Kişisel Bilgiler</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Ad *</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="input-field pl-10"
                          placeholder="Adınız"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Soyad *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Telefon *</label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="05XX XXX XX XX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">E-posta</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Address */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold mb-4">Teslimat Adresi</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Adres *</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="input-field pl-10 resize-none"
                        placeholder="Sokak, mahalle, bina no, daire no..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">İl *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="İstanbul"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">İlçe *</label>
                      <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="Kadıköy"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Posta Kodu</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="34000"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Payment */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg font-semibold mb-4">Ödeme Bilgileri</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Kart Numarası *</label>
                    <div className="relative">
                      <HiOutlineCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="input-field pl-10"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400 mb-1 block">Kart Üzerindeki İsim *</label>
                    <input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="AD SOYAD"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">Son Kullanma *</label>
                      <input
                        type="text"
                        name="expiry"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        className="input-field"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-1 block">CVV *</label>
                      <div className="relative">
                        <input
                          type="password"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="input-field"
                          placeholder="***"
                          maxLength={4}
                        />
                        <HiOutlineLockClosed className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                  <HiOutlineLockClosed className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <p className="text-xs text-green-400">
                    Ödeme bilgileriniz 256-bit SSL şifreleme ile korunmaktadır.
                  </p>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                <h3 className="font-semibold mb-3">Sipariş Özeti</h3>
                <div className="space-y-2 text-sm">
                  {cart.slice(0, 3).map(item => (
                    <div key={item.id} className="flex justify-between">
                      <span className="text-gray-400 truncate flex-1 mr-2">{item.name} x{item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {cart.length > 3 && (
                    <div className="text-gray-500 text-xs">
                      +{cart.length - 3} ürün daha
                    </div>
                  )}
                  <div className="h-px bg-white/10 my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Toplam</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-white/10 p-4">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="flex-1 h-14 bg-white/10 text-white font-semibold rounded-2xl"
            >
              Geri
            </button>
          )}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={currentStep === 2 ? handleSubmit : handleNextStep}
            disabled={
              (currentStep === 0 && !isStep1Valid) ||
              (currentStep === 1 && !isStep2Valid) ||
              (currentStep === 2 && !isStep3Valid) ||
              isProcessing
            }
            className={`flex-1 h-14 font-semibold text-lg rounded-2xl transition-colors ${
              ((currentStep === 0 && !isStep1Valid) ||
               (currentStep === 1 && !isStep2Valid) ||
               (currentStep === 2 && !isStep3Valid) ||
               isProcessing)
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                İşleniyor...
              </span>
            ) : currentStep === 2 ? (
              `Öde ${formatPrice(getCartTotal())}`
            ) : (
              'Devam Et'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

