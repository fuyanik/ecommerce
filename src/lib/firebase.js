// Client-side Firebase Configuration
import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDWrkq5-VbVbYRedB2vlqqFH1YP7wwmKT8",
  authDomain: "carsi-18a12.firebaseapp.com",
  projectId: "carsi-18a12",
  storageBucket: "carsi-18a12.firebasestorage.app",
  messagingSenderId: "317524788708",
  appId: "1:317524788708:web:7c3654c844e42b60e0f3f1",
  measurementId: "G-TN94369HG0"
};

// Initialize Firebase (only once)
let app;
let analytics = null;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics (only in browser and if supported)
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
        console.log("🔥 Firebase Analytics aktif!");
      }
    });
  }
} else {
  app = getApps()[0];
}

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

// Export analytics
export { analytics };

export default app;
