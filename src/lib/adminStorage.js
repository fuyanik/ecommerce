// Firebase Client SDK kullanarak Storage (Credential gerektirmez)
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import app from "./firebase";

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// Default settings
const DEFAULT_SETTINGS = {
  depositTitle: "Başvuru Teminat Bedeli",
  depositAmount: "50,00 ₺",
  authorizedName: "Hakan Güler",
  iban: "TR67 0004 6013 4388 8000 1558 54",
  paymentAmount: "50,00 TL",
};

// Default pricing
const DEFAULT_PRICING = {
  sizes: [
    { size: "10 cm", price: "1.850 TL", order: 1 },
    { size: "15 cm", price: "2.999 TL", order: 2 },
    { size: "17 cm", price: "2.300 TL", order: 3 },
    { size: "20 cm", price: "3.999 TL", order: 4 },
    { size: "24 cm", price: "2.800 TL", order: 5 },
    { size: "25 cm", price: "4.999 TL", order: 6 },
    { size: "30-34 cm", price: "3.200 TL", order: 7 },
  ],
  extraPersonFee: "400 TL",
  maxPersonsIncluded: 4,
};

// Collection names
const COLLECTIONS = {
  SETTINGS: "settings",
  SUBMISSIONS: "submissions",
  USER_LOGINS: "userLogins",
  PRICING: "pricing",
};

// ============================================
// SETTINGS FUNCTIONS
// ============================================

export async function getAdminSettings() {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, "main");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create default settings if not exists
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }

    return { ...DEFAULT_SETTINGS, ...docSnap.data() };
  } catch (error) {
    console.error("Error getting admin settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function updateAdminSettings(partialSettings) {
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, "main");
    const currentSettings = await getAdminSettings();
    const nextSettings = {
      ...currentSettings,
      ...partialSettings,
    };

    await setDoc(docRef, nextSettings, { merge: true });
    return nextSettings;
  } catch (error) {
    console.error("Error updating admin settings:", error);
    throw error;
  }
}

// ============================================
// PRICING FUNCTIONS
// ============================================

export async function getPricing() {
  try {
    const docRef = doc(db, COLLECTIONS.PRICING, "main");
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      // Create default pricing if not exists
      await setDoc(docRef, DEFAULT_PRICING);
      return DEFAULT_PRICING;
    }

    return { ...DEFAULT_PRICING, ...docSnap.data() };
  } catch (error) {
    console.error("Error getting pricing:", error);
    return DEFAULT_PRICING;
  }
}

export async function updatePricing(pricingData) {
  try {
    const docRef = doc(db, COLLECTIONS.PRICING, "main");
    await setDoc(docRef, pricingData, { merge: true });
    return pricingData;
  } catch (error) {
    console.error("Error updating pricing:", error);
    throw error;
  }
}

// ============================================
// PAYMENT SUBMISSIONS FUNCTIONS
// ============================================

export async function getPaymentSubmissions() {
  try {
    const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);
    const q = query(submissionsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting payment submissions:", error);
    return [];
  }
}

export async function addPaymentSubmission(submission) {
  try {
    const submissionsRef = collection(db, COLLECTIONS.SUBMISSIONS);
    const docRef = await addDoc(submissionsRef, {
      ...submission,
      createdAt: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      ...submission,
    };
  } catch (error) {
    console.error("Error adding payment submission:", error);
    throw error;
  }
}

export async function deletePaymentSubmission(submissionId) {
  try {
    const docRef = doc(db, COLLECTIONS.SUBMISSIONS, submissionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Dekont bulunamadı.");
    }

    const submission = docSnap.data();

    // Delete file from Firebase Storage if exists
    if (submission.storedFileName) {
      try {
        const fileRef = ref(storage, submission.storedFileName);
        await deleteObject(fileRef);
      } catch (error) {
        console.error("Error deleting file from storage:", error);
        // Continue even if file deletion fails
      }
    }

    // Delete document from Firestore
    await deleteDoc(docRef);

    return { id: submissionId, ...submission };
  } catch (error) {
    console.error("Error deleting payment submission:", error);
    throw error;
  }
}

// ============================================
// USER LOGINS FUNCTIONS
// ============================================

export async function getUserLogins() {
  try {
    const loginsRef = collection(db, COLLECTIONS.USER_LOGINS);
    const q = query(loginsRef, orderBy("loginTime", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error getting user logins:", error);
    return [];
  }
}

export async function addUserLogin(loginData) {
  try {
    const loginsRef = collection(db, COLLECTIONS.USER_LOGINS);
    const docRef = await addDoc(loginsRef, {
      ...loginData,
      loginTime: new Date().toISOString(),
    });

    return {
      id: docRef.id,
      ...loginData,
    };
  } catch (error) {
    console.error("Error adding user login:", error);
    throw error;
  }
}

export async function deleteUserLogin(loginId) {
  try {
    const docRef = doc(db, COLLECTIONS.USER_LOGINS, loginId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      throw new Error("Giriş kaydı bulunamadı.");
    }

    const login = docSnap.data();

    // Delete document from Firestore
    await deleteDoc(docRef);

    return { id: loginId, ...login };
  } catch (error) {
    console.error("Error deleting user login:", error);
    throw error;
  }
}

// ============================================
// FIREBASE STORAGE HELPER FUNCTIONS
// ============================================

export async function uploadFileToStorage(file, fileName) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: file.type });
    const storageRef = ref(storage, fileName);

    // Upload file
    await uploadBytes(storageRef, blob, {
      contentType: file.type,
    });

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading file to storage:", error);
    throw error;
  }
}

export async function deleteFileFromStorage(fileName) {
  try {
    const fileRef = ref(storage, fileName);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file from storage:", error);
    throw error;
  }
}

// ============================================
// ADMIN DEFAULTS (for authentication)
// ============================================

export const ADMIN_DEFAULTS = {
  username: "",
  password: "",
  sessionCookieName: "admin_session",
  sessionCookieValue: "admin_authenticated",
};
