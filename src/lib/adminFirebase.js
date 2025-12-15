// Admin Firebase Functions - Payment Settings ve User Management
import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';

// =====================
// PAYMENT SETTINGS
// =====================

// Default payment settings - ilk kurulum için
export const defaultPaymentSettings = {
  // Crypto Wallets
  trc20: {
    id: 'trc20',
    name: 'TRC20',
    type: 'crypto',
    enabled: true,
    walletAddress: 'TXkMkrYv9m5BLX4gRBZCzABLk3xJNdQpFW',
    minAmount: 250,
    maxAmount: 50000000000
  },
  bitcoin: {
    id: 'bitcoin',
    name: 'Bitcoin',
    type: 'crypto',
    enabled: true,
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    minAmount: 100,
    maxAmount: 10000000000
  },
  ethereum: {
    id: 'ethereum',
    name: 'Ethereum',
    type: 'crypto',
    enabled: true,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD8e',
    minAmount: 100,
    maxAmount: 10000000000
  },
  tron: {
    id: 'tron',
    name: 'Tron',
    type: 'crypto',
    enabled: true,
    walletAddress: 'TXkMkrYv9m5BLX4gRBZCzABLk3xJNdQpFW',
    minAmount: 100,
    maxAmount: 50000000000
  },
  erc20: {
    id: 'erc20',
    name: 'ERC20',
    type: 'crypto',
    enabled: true,
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD8e',
    minAmount: 250,
    maxAmount: 50000000000
  },
  doge: {
    id: 'doge',
    name: 'Dogecoin',
    type: 'crypto',
    enabled: true,
    walletAddress: 'DRSqEwcnJX3GZWH9Twtwk8D5ewqdJzi13k',
    minAmount: 250,
    maxAmount: 50000000000
  },
  // Bank Transfers (Havale)
  'havale-1': {
    id: 'havale-1',
    name: 'Havale - Ziraat',
    type: 'bank',
    enabled: true,
    bankName: 'Ziraat Bankası',
    accountHolder: 'ABC Teknoloji Ltd. Şti.',
    iban: 'TR12 0001 0012 3456 7890 1234 56',
    branch: 'Merkez Şube',
    minAmount: 5000,
    maxAmount: 10000000000
  },
  'havale-2': {
    id: 'havale-2',
    name: 'Havale - Garanti',
    type: 'bank',
    enabled: true,
    bankName: 'Garanti BBVA',
    accountHolder: 'XYZ Holding A.Ş.',
    iban: 'TR33 0006 2000 1234 5678 9012 34',
    branch: 'Levent Şube',
    minAmount: 5000,
    maxAmount: 10000000000
  },
  'havale-3': {
    id: 'havale-3',
    name: 'Havale - İş Bankası',
    type: 'bank',
    enabled: true,
    bankName: 'Türkiye İş Bankası',
    accountHolder: 'DEF Yatırım Ltd.',
    iban: 'TR45 0006 4000 0012 3456 7890 12',
    branch: 'Kadıköy Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-4': {
    id: 'havale-4',
    name: 'Havale - Akbank',
    type: 'bank',
    enabled: true,
    bankName: 'Akbank',
    accountHolder: 'GHI Finans A.Ş.',
    iban: 'TR56 0004 6000 1234 5678 9012 34',
    branch: 'Beşiktaş Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-5': {
    id: 'havale-5',
    name: 'Havale - Yapı Kredi',
    type: 'bank',
    enabled: true,
    bankName: 'Yapı Kredi',
    accountHolder: 'JKL Teknoloji Ltd.',
    iban: 'TR67 0006 7010 0000 1234 5678 90',
    branch: 'Taksim Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-6': {
    id: 'havale-6',
    name: 'Havale - QNB',
    type: 'bank',
    enabled: true,
    bankName: 'QNB Finansbank',
    accountHolder: 'MNO Yatırım Ltd.',
    iban: 'TR78 0011 1000 0000 1234 5678 90',
    branch: 'Şişli Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-7': {
    id: 'havale-7',
    name: 'Havale - Denizbank',
    type: 'bank',
    enabled: true,
    bankName: 'Denizbank',
    accountHolder: 'PQR Holding A.Ş.',
    iban: 'TR89 0013 4000 0012 3456 7890 12',
    branch: 'Ataşehir Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-8': {
    id: 'havale-8',
    name: 'Havale - Halkbank',
    type: 'bank',
    enabled: true,
    bankName: 'Halkbank',
    accountHolder: 'STU Finans Ltd.',
    iban: 'TR90 0001 2009 8765 4321 0987 65',
    branch: 'Bakırköy Şube',
    minAmount: 100,
    maxAmount: 50000000000
  },
  'havale-9': {
    id: 'havale-9',
    name: 'Havale - VakıfBank',
    type: 'bank',
    enabled: true,
    bankName: 'VakıfBank',
    accountHolder: 'VWX Yatırım A.Ş.',
    iban: 'TR01 0001 5001 5800 7290 1234 56',
    branch: 'Mecidiyeköy Şube',
    minAmount: 1000,
    maxAmount: 50000000000
  },
  'kredi-karti': {
    id: 'kredi-karti',
    name: 'Kredi Kartı',
    type: 'card',
    enabled: true,
    minAmount: 100,
    maxAmount: 50000000000
  }
};

// Payment settings'i Firebase'den çek
export const getPaymentSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'paymentMethods');
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // İlk kez oluştur
      await setDoc(docRef, defaultPaymentSettings);
      return defaultPaymentSettings;
    }
  } catch (error) {
    console.error('Payment settings getirilemedi:', error);
    return defaultPaymentSettings;
  }
};

// Tek bir payment method'u getir
export const getPaymentMethod = async (methodId) => {
  try {
    const settings = await getPaymentSettings();
    return settings[methodId] || null;
  } catch (error) {
    console.error('Payment method getirilemedi:', error);
    return null;
  }
};

// Payment settings'i güncelle
export const updatePaymentSettings = async (methodId, data) => {
  try {
    const docRef = doc(db, 'settings', 'paymentMethods');
    await updateDoc(docRef, {
      [methodId]: data
    });
    return true;
  } catch (error) {
    console.error('Payment settings güncellenemedi:', error);
    return false;
  }
};

// Payment settings için real-time listener
export const subscribeToPaymentSettings = (callback) => {
  const docRef = doc(db, 'settings', 'paymentMethods');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    } else {
      callback(defaultPaymentSettings);
    }
  });
};

// =====================
// USER MANAGEMENT
// =====================

// Tüm kullanıcıları getir (extracted_data collection'ından)
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, 'extracted_data');
    const querySnapshot = await getDocs(usersRef);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return users;
  } catch (error) {
    console.error('Kullanıcılar getirilemedi:', error);
    return [];
  }
};

// Kullanıcı verilerini güncelle
export const updateUserData = async (username, data) => {
  try {
    const docRef = doc(db, 'extracted_data', username);
    await updateDoc(docRef, data);
    return true;
  } catch (error) {
    console.error('Kullanıcı güncellenemedi:', error);
    return false;
  }
};

// Kullanıcılar için real-time listener
export const subscribeToUsers = (callback) => {
  const usersRef = collection(db, 'extracted_data');
  return onSnapshot(usersRef, (querySnapshot) => {
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    callback(users);
  });
};

// Initialize payment settings (if not exists)
export const initializePaymentSettings = async () => {
  try {
    const docRef = doc(db, 'settings', 'paymentMethods');
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      await setDoc(docRef, defaultPaymentSettings);
      console.log('Payment settings initialized');
    }
    return true;
  } catch (error) {
    console.error('Payment settings initialize edilemedi:', error);
    return false;
  }
};
