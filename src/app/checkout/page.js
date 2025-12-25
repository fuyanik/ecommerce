'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiCheck,
  HiOutlineClipboardCopy,
  HiOutlineUpload,
  HiOutlineChevronDown,
  HiOutlineDocumentText,
  HiCheckCircle,
  HiOutlineChevronRight,
  HiOutlineUserGroup,
  HiOutlineClock,
  HiOutlineRefresh,
  HiArrowLeft
} from 'react-icons/hi';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useCart } from '@/context/CartContext';

const steps = ['Bilgiler', 'Adres', 'Ödeme', 'Tamamla'];

const turkishCities = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin',
  'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa',
  'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan',
  'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta',
  'İstanbul', 'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli',
  'Konya', 'Kütahya', 'Malatya', 'Manisa', 'Mardin', 'Mersin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya', 'Samsun', 'Siirt',
  'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak'
];

const cargoCompanies = [
  { id: 'yurtici', name: 'Yurtiçi Kargo', logo: '/assets/memleket.png', scale: 'scale-125' },
  { id: 'aras', name: 'Aras Kargo', logo: '/assets/araskargo.png', scale: 'scale-125' },
  { id: 'ptt', name: 'PTT Kargo', logo: '/assets/pttkargo.png', scale: 'scale-100' },
  { id: 'surat', name: 'Sürat Kargo', logo: '/assets/suratkargo.png', scale: 'scale-125' },
];

const faqs = [
  {
    question: 'Sipariş verdikten sonra iptal edebilir miyim?',
    answer: 'Evet, siparişiniz kargoya verilmeden önce iptal talebinde bulunabilirsiniz. Kargoya verildikten sonra ise ürün size ulaştığında iade sürecini başlatabilirsiniz.'
  },
  {
    question: 'Neden EFT/Havale ile ödeme yapmalıyım?',
    answer: 'EFT/Havale ile ödeme yaptığınızda banka komisyonlarından tasarruf edildiği için size %18 nakit indirimi sağlıyoruz. Bu sayede aynı ürünü daha uygun fiyata satın alabilirsiniz.'
  },
  {
    question: 'EFT/Havale işleminde açıklama kısmına ne yazmalıyım?',
    answer: 'Ödeme yaparken açıklama kısmına mutlaka sipariş numaranızı yazmalısınız. Bu sayede ödemeniz siparişinizle otomatik olarak eşleştirilir.'
  },
  {
    question: 'EFT/Havale güvenli mi?',
    answer: 'Evet, tamamen güvenlidir. Banka üzerinden yapılan tüm transferler kayıt altındadır ve yasal güvence altındadır. Ayrıca dekont yükleme sistemiyle ödemeniz hızlıca onaylanır.'
  }
];

// Modern Stats Component
function StatsSection() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-blue-100 flex items-center justify-center">
          <HiOutlineUserGroup className="w-4 h-4 text-blue-600" />
        </div>
        <div className="text-lg font-bold text-blue-700">703</div>
        <div className="text-[9px] text-blue-600 font-medium">Bugün ödeme yapıldı</div>
      </div>
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-green-100 flex items-center justify-center">
          <HiOutlineClock className="w-4 h-4 text-green-600" />
        </div>
        <div className="text-lg font-bold text-green-700">7 dk</div>
        <div className="text-[9px] text-green-600 font-medium">Ort. onay süresi</div>
      </div>
      <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-3 text-center">
        <div className="w-8 h-8 mx-auto mb-1.5 rounded-full bg-purple-100 flex items-center justify-center">
          <HiOutlineRefresh className="w-4 h-4 text-purple-600" />
        </div>
        <div className="text-lg font-bold text-purple-700">14 gün</div>
        <div className="text-[9px] text-purple-600 font-medium">Koşulsuz iade</div>
      </div>
    </div>
  );
}

// FAQ Component
function FAQSection({ expandedFaq, setExpandedFaq }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-900 text-sm mb-3">Sıkça Sorulan Sorular</h3>
      <div className="space-y-1.5">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
              className="w-full p-2.5 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-xs font-medium text-gray-800 pr-2">{faq.question}</span>
              <HiOutlineChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${
                expandedFaq === index ? 'rotate-180' : ''
              }`} />
            </button>
            {expandedFaq === index && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-2.5 bg-white"
              >
                <p className="text-xs text-gray-600">{faq.answer}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Order Summary Component
function OrderSummary({ cart, formatPrice, getCartTotal, paymentMethod, showExpanded = true }) {
  const [expanded, setExpanded] = useState(false);
  const discountedTotal = getCartTotal() * 0.82;
  const visibleItems = expanded ? cart : cart.slice(0, 1);

  return (
    <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Sipariş Özeti</span>
        <div className="flex items-center gap-2">
          {paymentMethod === 'eft' && (
            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded">%18 indirim</span>
          )}
          <span className="font-bold text-gray-900">
            {paymentMethod === 'eft' ? formatPrice(discountedTotal) : formatPrice(getCartTotal())}
          </span>
        </div>
      </div>
      
      <div className="space-y-2">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-2 bg-white rounded-lg border border-gray-100">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <Image
                src={item.images?.[0] || '/placeholder.png'}
                alt={item.name}
                fill
                className="object-contain p-1"
                unoptimized
                priority
                loader={({ src }) => src}
                onError={(e) => { e.target.src = '/placeholder.png'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{item.quantity} adet</span>
                <span className="text-sm font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showExpanded && cart.length > 1 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full mt-2 flex items-center justify-center gap-1 text-xs text-indigo-600 font-medium py-1.5 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          {expanded ? 'Daha az göster' : `+${cart.length - 1} ürün daha`}
          <HiOutlineChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [selectedCargo, setSelectedCargo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [copied, setCopied] = useState('');
  const [showCardError, setShowCardError] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [districts, setDistricts] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const pageRef = useRef(null);
  
  const generatedOrderNumber = useMemo(() => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  }, []);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    orderNote: ''
  });

  const [paymentSettings, setPaymentSettings] = useState({
    iban: '',
    accountHolder: '',
    bankName: ''
  });

  const [bannerMessageIndex, setBannerMessageIndex] = useState(0);
  const bannerMessages = [
    { text: '1427 kişi bugün alışveriş yaptı', number: '1427' },
    { text: '2873 kişi siteyi inceliyor', number: '2873' }
  ];

  useEffect(() => {
    if (cart.length === 0 && !orderComplete) {
    router.push('/sepet');
  }
  }, [cart, orderComplete, router]);

  // Fetch payment settings from Firebase
  useEffect(() => {
    const fetchPaymentSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'payment'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setPaymentSettings({
            iban: data.iban || 'TR12 3456 7890 1234 5678 9012 34',
            accountHolder: data.accountHolder || '1001 ÇARŞI TİCARET A.Ş.',
            bankName: data.bankName || ''
          });
        }
      } catch (error) {
        console.error('Error fetching payment settings:', error);
      }
    };

    fetchPaymentSettings();
  }, []);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Banner message rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerMessageIndex((prev) => (prev + 1) % bannerMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [bannerMessages.length]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const validateEmail = (email) => {
    if (!email) return true; // Email is optional, so empty is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Fetch districts when city is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!formData.city) {
        setDistricts([]);
        setFormData(prev => ({ ...prev, district: '' }));
        return;
      }

      setLoadingDistricts(true);
      try {
        // Fetch all provinces - each province already contains districts array
        const provincesResponse = await fetch('https://turkiyeapi.dev/api/v1/provinces');
        
        if (!provincesResponse.ok) {
          throw new Error('Provinces API failed');
        }
        
        const provincesData = await provincesResponse.json();
        
        // Find the selected city - districts are already in the province object
        const selectedProvince = provincesData.data?.find(
          (province) => province.name === formData.city
        );

        if (selectedProvince && selectedProvince.districts && Array.isArray(selectedProvince.districts)) {
          const districtNames = selectedProvince.districts
            .map((district) => district.name)
            .filter(Boolean)
            .sort();
          setDistricts(districtNames);
        } else {
          setDistricts([]);
        }
      } catch (error) {
        console.error('Error fetching districts:', error);
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [formData.city]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear email error when user starts typing
    if (name === 'email') {
      setEmailError('');
    }
    
    // Reset district when city changes
    if (name === 'city') {
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };

  const handleEmailBlur = () => {
    if (formData.email && !validateEmail(formData.email)) {
      setEmailError('Lütfen geçerli bir e-posta adresi girin (örn: ornek@email.com)');
    } else {
      setEmailError('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Validate email before proceeding from step 0
    if (currentStep === 0) {
      if (formData.email && !validateEmail(formData.email)) {
        setEmailError('Lütfen geçerli bir e-posta adresi girin (örn: ornek@email.com)');
        return;
      }
      await saveIncompleteUser();
    }
    setCurrentStep(prev => prev + 1);
    scrollToTop();
  };

  const handleSubmit = async () => {
    // Show error if credit card is selected
    if (paymentMethod === 'card') {
      setShowCardError(true);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const orderRef = await addDoc(collection(db, 'orders'), {
        orderNumber: generatedOrderNumber,
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
          postalCode: formData.postalCode,
          orderNote: formData.orderNote
        },
        items: cart.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.images?.[0]
        })),
        total: paymentMethod === 'eft' ? getCartTotal() * 0.82 : getCartTotal(),
        originalTotal: getCartTotal(),
        discount: paymentMethod === 'eft' ? 18 : 0,
        cargoCompany: selectedCargo,
        paymentMethod: paymentMethod,
        status: 'pending',
        paymentStatus: 'awaiting',
        createdAt: serverTimestamp()
      });

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
          createdAt: serverTimestamp(),
          status: 'completed'
        });
      }

      setOrderId(orderRef.id);
      
      if (paymentMethod === 'eft') {
        setCurrentStep(3);
        setTimeout(() => {
          scrollToTop();
        }, 100);
      } else {
      setOrderComplete(true);
      clearCart();
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Sipariş oluşturulurken bir hata oluştu.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = async () => {
    setIsProcessing(true);
    
    try {
      let receiptUrl = null;
      
      // Upload receipt to Firebase Storage
      if (receiptFile && orderId) {
        const fileName = `receipts/${orderId}_${Date.now()}_${receiptFile.name}`;
        const fileRef = ref(storage, fileName);
        await uploadBytes(fileRef, receiptFile);
        receiptUrl = await getDownloadURL(fileRef);
        
        // Update order with receipt URL
        await updateDoc(doc(db, 'orders', orderId), {
          receiptUrl: receiptUrl,
          paymentStatus: 'pending_verification',
          receiptUploadedAt: serverTimestamp()
        });
      }
      
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error uploading receipt:', error);
      alert('Dekont yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(''), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptFile(file);
    }
  };

  const isStep1Valid = formData.firstName && formData.lastName && formData.phone && !emailError && (formData.email === '' || validateEmail(formData.email));
  const isStep2Valid = formData.address && formData.city && formData.district;
  const isStep3Valid = selectedCargo && paymentMethod;

  const discountedTotal = getCartTotal() * 0.82;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-gray-50">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
        >
          <HiCheck className="w-10 h-10 text-green-600" />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Siparişiniz Alındı!</h1>
        <p className="text-gray-500 mb-2">
          Sipariş numaranız: <span className="text-gray-900 font-mono font-bold">{generatedOrderNumber}</span>
        </p>
        <p className="text-gray-500 mb-8">
          Siparişinizle ilgili bilgiler alınmıştır. Siparişiniz incelendikten sonra işleme alınacaktır.
        </p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-xl"
        >
          Alışverişe Devam Et
        </motion.button>
      </div>
    );
  }

  const inputClass = "w-full h-11 px-3 bg-white border border-gray-200 rounded-xl text-gray-900 outline-none focus:border-slate-800 focus:ring-2 focus:ring-indigo-900/20 transition-all text-sm";

  return (
    <div ref={pageRef} className="min-h-screen bg-gray-50 pb-24">
      {/* Credit Card Error Popup */}
      <AnimatePresence>
        {showCardError && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCardError(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-3xl">⚠️</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ödeme Yöntemi Geçersiz</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Kampanyalı ürünlerde yalnızca <span className="font-semibold text-green-600">Banka Havale / EFT / FAST</span> ödeme yöntemi geçerlidir.
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Lütfen ödeme yönteminizi değiştirerek %18 nakit indiriminden faydalanın.
                </p>
                <button
                  onClick={() => {
                    setShowCardError(false);
                    setPaymentMethod('eft');
                  }}
                  className="w-full h-11 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl mb-2"
                >
                  Havale/EFT ile Devam Et
                </button>
                <button
                  onClick={() => setShowCardError(false)}
                  className="w-full h-10 bg-gray-100 text-gray-600 font-medium rounded-xl text-sm"
                >
                  Geri Dön
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Progress Steps - 4 Steps with more spacing - Fixed below Navbar */}
      <div className="fixed top-[8vh] left-0 right-0 z-40 bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-center max-w-lg mx-auto">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  index <= currentStep 
                    ? 'bg-gradient-to-r from-gray-900 to-indigo-900 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {index < currentStep ? <HiCheck className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-[10px] mt-0.5 ${index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 sm:w-16 h-0.5 mx-2 sm:mx-3 self-start mt-3.5 ${
                  index < currentStep ? 'bg-gradient-to-r from-gray-900 to-indigo-900' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout Info Banner - Fixed below Stepper */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-[17vh] left-0 right-0 z-40 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white h-[45px] px-3 overflow-hidden flex items-center justify-center"
      >
        {/* Animated background shine */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
          animate={{
            x: ['-200%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatDelay: 2,
            ease: 'easeInOut',
          }}
        />
        
        {/* Content */}
        <div className="relative flex items-center justify-center gap-2">
          <HiCheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
          
          {/* Rotating Message */}
          <div className="relative h-5 flex items-center overflow-hidden min-w-[180px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={bannerMessageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] sm:text-xs font-medium whitespace-nowrap absolute left-0"
              >
                <span className="font-bold text-green-400">{bannerMessages[bannerMessageIndex].number}</span>{' '}
                {bannerMessages[bannerMessageIndex].text.replace(bannerMessages[bannerMessageIndex].number + ' ', '')}
              </motion.span>
            </AnimatePresence>
          </div>
          
          <span className="text-white/50">•</span>
          <span className="text-[11px] sm:text-xs font-medium whitespace-nowrap">
            Güvenli Ödeme <span className="font-bold text-yellow-400">%100</span>
          </span>
          <HiCheckCircle className="w-4 h-4 text-green-400 animate-pulse" />
        </div>
      </motion.div>

      {/* Form Steps */}
      <div className="px-3 py-4 max-w-lg mx-auto pt-[16vh]">
        <AnimatePresence mode="wait">
          {/* Step 1: Personal Info */}
          {currentStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <OrderSummary cart={cart} formatPrice={formatPrice} getCartTotal={getCartTotal} paymentMethod={paymentMethod} />

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Kişisel Bilgiler</h2>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Ad *</label>
                      <div className="relative">
                        <HiOutlineUser className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={`${inputClass} pl-8`}
                          placeholder="Adınız"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">Soyad *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={inputClass}
                        placeholder="Soyadınız"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Telefon *</label>
                    <div className="relative">
                      <HiOutlinePhone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData(prev => ({ ...prev, phone: value }));
                        }}
                        className={`${inputClass} pl-8`}
                        placeholder="Telefon"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">E-posta</label>
                    <div className="relative">
                      <HiOutlineMail className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 ${emailError ? 'text-red-400' : 'text-gray-400'}`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        className={`${inputClass} pl-8 ${emailError ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                        placeholder="ornek@email.com"
                      />
                    </div>
                    {emailError && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-xs text-red-500 mt-1 flex items-center gap-1"
                      >
                        <span>⚠️</span> {emailError}
                      </motion.p>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
            </motion.div>
          )}

          {/* Step 2: Address */}
          {currentStep === 1 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Order Summary */}
              <OrderSummary cart={cart} formatPrice={formatPrice} getCartTotal={getCartTotal} paymentMethod={paymentMethod} />

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Teslimat Adresi</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Adres *</label>
                    <div className="relative">
                      <HiOutlineLocationMarker className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className={`${inputClass} h-auto py-2 pl-8 resize-none`}
                        placeholder="Sokak, mahalle, bina no, daire no..."
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">İl *</label>
                      <div className="relative">
                        <select
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                        >
                          <option value="">İl seçin</option>
                          {turkishCities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-700 mb-1 block">İlçe *</label>
                      <div className="relative">
                        <select
                          name="district"
                          value={formData.district}
                          onChange={handleInputChange}
                          disabled={!formData.city || loadingDistricts}
                          className={`${inputClass} appearance-none pr-10 cursor-pointer ${
                            !formData.city || loadingDistricts ? 'bg-gray-100 cursor-not-allowed' : ''
                          }`}
                        >
                          <option value="">
                            {loadingDistricts ? 'Yükleniyor...' : !formData.city ? 'Önce il seçin' : 'İlçe seçin'}
                          </option>
                          {districts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </select>
                        <HiOutlineChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Posta Kodu</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={inputClass}
                      placeholder="34000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Sipariş Notu</label>
                    <div className="relative">
                      <HiOutlineDocumentText className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
                      <textarea
                        name="orderNote"
                        value={formData.orderNote}
                        onChange={handleInputChange}
                        rows={2}
                        className={`${inputClass} h-auto py-2 pl-8 resize-none`}
                        placeholder="Teslimat için özel notunuz varsa yazın..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
            </motion.div>
          )}

          {/* Step 3: Payment Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* Cargo Selection */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Kargo Seçimi</h2>
                <div className="grid grid-cols-4 gap-2">
                  {cargoCompanies.map((cargo) => (
                    <button
                      key={cargo.id}
                      onClick={() => setSelectedCargo(cargo.id)}
                      className={`relative h-14 rounded-xl border-2 transition-all overflow-hidden ${
                        selectedCargo === cargo.id
                          ? 'border-indigo-600 bg-white shadow-md'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Image
                        src={cargo.logo}
                        alt={cargo.name}
                        fill
                        className={`object-contain ${cargo.scale}`}
                        unoptimized
                        priority
                        loader={({ src }) => src}
                        onError={(e) => { e.target.src = '/placeholder.png'; }}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-500 mt-2">Lütfen tercih ettiğiniz kargo firmasını seçin</p>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h2 className="text-base font-semibold text-gray-900 mb-3">Ödeme Yöntemi</h2>
                <div className="space-y-2">
                  {/* EFT Option - Recommended */}
                  <button
                    onClick={() => setPaymentMethod('eft')}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all relative overflow-hidden ${
                      paymentMethod === 'eft'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {paymentMethod === 'eft' && (
                      <div className="absolute top-2 right-2">
                        <HiCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    )}
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">₺</span>
                  </div>
                  <div>
                        <div className="font-semibold text-gray-900 text-sm">Banka Havale / EFT / FAST</div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">%18 nakit indirimi</span>
                          <motion.span 
                            className="text-[10px] text-orange-600 font-medium"
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            %89 tercih ediyor
                          </motion.span>
                        </div>
                  </div>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-1.5 leading-relaxed">
                      Bankalarla yaptığımız anlaşma sayesinde Havale/EFT/FAST ödemelerinde %18 nakit indirimi uygulanmaktadır.
                    </p>
                    {paymentMethod === 'eft' && (
                      <div className="mt-2 p-1.5 bg-green-100 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-green-800">İndirimli Toplam:</span>
                          <span className="font-bold text-green-700 text-sm">{formatPrice(discountedTotal)}</span>
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Credit Card Option */}
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-3 rounded-xl border-2 text-left transition-all relative ${
                      paymentMethod === 'card'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {paymentMethod === 'card' && (
                      <div className="absolute top-2 right-2">
                        <HiCheckCircle className="w-5 h-5 text-indigo-500" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center">
                        <span className="text-white text-sm">💳</span>
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900 text-sm">Kredi Kartı ile Ödeme</div>
                      </div>
                    </div>
                    <p className="text-[10px] text-orange-600 mt-1.5">
                      ⚠️ Kampanyalı ürünlerde yalnızca Havale/EFT/FAST ile ödeme kabul edilmektedir.
                    </p>
                  </button>
                </div>
              </div>

              {/* Stats & FAQ */}
              <StatsSection />
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
            </motion.div>
          )}

          {/* Step 4: EFT Details */}
          {currentStep === 3 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-3"
            >
              {/* Important Notice */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                <h3 className="font-bold text-amber-800 text-sm mb-1">⚠️ Önemli Bilgilendirme</h3>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Ödeme işlemi sırasında,  
                  açıklama alanına <strong>sipariş numaranızın</strong> eksiksiz şekilde yazılması zorunludur.
                </p>
                </div>

              {/* Order & Payment Info */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="text-center mb-3">
                  <p className="text-gray-600 text-xs">
                    <span className="font-bold text-gray-900 text-base">{generatedOrderNumber}</span> sipariş numaranıza ait
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-0.5">{formatPrice(discountedTotal)}</p>
                  <p className="text-gray-500 text-xs">ödeme yapmanız gerekmektedir</p>
                </div>

                <div className="space-y-2">
                  {/* IBAN */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">IBAN</div>
                      <div className="font-mono font-medium text-gray-900 text-xs">{paymentSettings.iban}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(paymentSettings.iban.replace(/\s/g, ''), 'iban')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'iban' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'iban' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
              </div>

                  {/* Account Holder */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">Hesap Sahibi</div>
                      <div className="font-medium text-gray-900 text-xs">{paymentSettings.accountHolder}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(paymentSettings.accountHolder, 'holder')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'holder' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'holder' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Bank Name (if provided) */}
                  {paymentSettings.bankName && (
                    <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-[10px] text-gray-500">Banka</div>
                        <div className="font-medium text-gray-900 text-xs">{paymentSettings.bankName}</div>
                      </div>
                    </div>
                  )}

                  {/* Order Number */}
                  <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-[10px] text-gray-500">Sipariş Numarası (Açıklamaya yazın)</div>
                      <div className="font-mono font-bold text-gray-900 text-sm">{generatedOrderNumber}</div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(generatedOrderNumber, 'order')}
                      className={`p-1.5 rounded-lg transition-colors ${copied === 'order' ? 'bg-green-100 text-green-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'}`}
                    >
                      {copied === 'order' ? <HiCheck className="w-4 h-4" /> : <HiOutlineClipboardCopy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Dekont Yükle</h3>
                <label className="block">
                  <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                    receiptFile ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                  }`}>
                    {receiptFile ? (
                      <div className="flex items-center justify-center gap-2 text-green-600">
                        <HiCheck className="w-5 h-5" />
                        <span className="font-medium text-sm">{receiptFile.name}</span>
                      </div>
                    ) : (
                      <>
                        <HiOutlineUpload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-600">Dekont dosyasını yüklemek için tıklayın</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG veya PDF</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*,.pdf" onChange={handleFileUpload} />
                </label>
                <p className="text-[10px] text-gray-500 mt-1.5">
                  📋 Dekont yükledikten sonra ödeme inceleme birimi tarafından incelenecektir.
                </p>
              </div>

              {/* Stats */}
              <StatsSection />

              {/* FAQ Section */}
              <FAQSection expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed Bottom - Steps 0-2 */}
      {currentStep < 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 shadow-lg">
          <div className="flex gap-2 max-w-lg mx-auto">
          {currentStep > 0 && (
            <button
                onClick={() => { setCurrentStep(prev => prev - 1); scrollToTop(); }}
                className="flex-1 h-10 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
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
              className={`relative flex-1 h-10 font-semibold text-sm rounded-xl transition-all overflow-hidden ${
              ((currentStep === 0 && !isStep1Valid) ||
               (currentStep === 1 && !isStep2Valid) ||
               (currentStep === 2 && !isStep3Valid) ||
               isProcessing)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-900 via-slate-800 to-indigo-900 text-white shadow-lg'
            }`}
          >
            {/* Shine effect */}
            {!((currentStep === 0 && !isStep1Valid) ||
               (currentStep === 1 && !isStep2Valid) ||
               (currentStep === 2 && !isStep3Valid) ||
               isProcessing) && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: 'easeInOut',
                }}
              />
            )}
            <span className="relative z-10">
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  İşleniyor...
                </span>
              ) : currentStep === 2 ? (
                  'Siparişi Onayla'
              ) : (
                'Devam Et'
              )}
            </span>
          </motion.button>
        </div>
      </div>
      )}

      {/* Fixed Bottom - Step 3 (Tamamla) with Back Button */}
      {currentStep === 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 p-3 shadow-lg">
          <div className="flex gap-2 max-w-lg mx-auto">
            {/* Back Button - 20% width */}
            <button
              onClick={() => { setCurrentStep(2); scrollToTop(); }}
              className="w-[20%] h-10 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            
            {/* Complete Payment Button - 80% width */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handlePaymentComplete}
              className="w-[80%] h-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                animate={{
                  x: ['-200%', '200%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: 'easeInOut',
                }}
              />
              <HiCheckCircle className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Ödemeyi Tamamladım</span>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
