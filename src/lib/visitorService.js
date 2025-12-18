// Visitor Tracking Service
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp,
  updateDoc,
  getDocs,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

// Collection reference
const VISITORS_COLLECTION = 'active_visitors';
const VISITOR_HISTORY_COLLECTION = 'visitor_history';

// Generate unique visitor ID
export const generateVisitorId = () => {
  return 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get device info
export const getDeviceInfo = () => {
  if (typeof window === 'undefined') return {};
  
  const ua = navigator.userAgent;
  let device = 'Bilinmiyor';
  let browser = 'Bilinmiyor';
  let os = 'Bilinmiyor';
  
  // Detect OS
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  
  // Detect Browser
  if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome';
  else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox')) browser = 'Firefox';
  else if (ua.includes('Edg')) browser = 'Edge';
  else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
  
  // Detect Device Type
  if (/Mobi|Android/i.test(ua)) device = 'Mobil';
  else if (/Tablet|iPad/i.test(ua)) device = 'Tablet';
  else device = 'Masaüstü';
  
  return {
    device,
    browser,
    os,
    userAgent: ua,
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    language: navigator.language || 'tr-TR'
  };
};

// Get IP address using external service
export const getIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('IP alınamadı:', error);
    return 'Bilinmiyor';
  }
};

// Get location from IP
export const getLocationFromIP = async (ip) => {
  try {
    if (ip === 'Bilinmiyor') return { city: 'Bilinmiyor', country: 'Bilinmiyor' };
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    return {
      city: data.city || 'Bilinmiyor',
      country: data.country_name || 'Bilinmiyor',
      region: data.region || 'Bilinmiyor'
    };
  } catch (error) {
    console.error('Lokasyon alınamadı:', error);
    return { city: 'Bilinmiyor', country: 'Bilinmiyor' };
  }
};

// Register visitor as active
export const registerVisitor = async (visitorId) => {
  try {
    const deviceInfo = getDeviceInfo();
    const ip = await getIPAddress();
    const location = await getLocationFromIP(ip);
    
    const visitorData = {
      visitorId,
      ip,
      ...deviceInfo,
      ...location,
      currentPage: window.location.pathname,
      referrer: document.referrer || 'Doğrudan',
      enteredAt: serverTimestamp(),
      lastActivity: serverTimestamp(),
      isActive: true
    };
    
    await setDoc(doc(db, VISITORS_COLLECTION, visitorId), visitorData);
    
    // Also save to history
    await setDoc(doc(db, VISITOR_HISTORY_COLLECTION, visitorId), {
      ...visitorData,
      exitedAt: null
    });
    
    return visitorData;
  } catch (error) {
    console.error('Ziyaretçi kaydedilemedi:', error);
    return null;
  }
};

// Update visitor activity
export const updateVisitorActivity = async (visitorId, currentPage) => {
  try {
    const visitorRef = doc(db, VISITORS_COLLECTION, visitorId);
    await updateDoc(visitorRef, {
      currentPage,
      lastActivity: serverTimestamp()
    });
  } catch (error) {
    console.error('Ziyaretçi aktivitesi güncellenemedi:', error);
  }
};

// Remove visitor (on page close)
export const removeVisitor = async (visitorId) => {
  try {
    // Update history with exit time
    const historyRef = doc(db, VISITOR_HISTORY_COLLECTION, visitorId);
    await updateDoc(historyRef, {
      exitedAt: serverTimestamp(),
      isActive: false
    });
    
    // Remove from active visitors
    await deleteDoc(doc(db, VISITORS_COLLECTION, visitorId));
  } catch (error) {
    console.error('Ziyaretçi kaldırılamadı:', error);
  }
};

// Listen to active visitors (real-time)
export const subscribeToActiveVisitors = (callback) => {
  const q = query(
    collection(db, VISITORS_COLLECTION),
    orderBy('enteredAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const visitors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(visitors);
  });
};

// Get visitor history (last 24 hours)
export const getVisitorHistory = async () => {
  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);
    
    const q = query(
      collection(db, VISITOR_HISTORY_COLLECTION),
      where('enteredAt', '>=', Timestamp.fromDate(twentyFourHoursAgo)),
      orderBy('enteredAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Ziyaretçi geçmişi alınamadı:', error);
    return [];
  }
};

// Clean up stale visitors (older than 5 minutes without activity)
export const cleanupStaleVisitors = async () => {
  try {
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);
    
    const q = query(
      collection(db, VISITORS_COLLECTION),
      where('lastActivity', '<', Timestamp.fromDate(fiveMinutesAgo))
    );
    
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('Eski ziyaretçiler temizlenemedi:', error);
  }
};

