// Server-side Firebase Admin Configuration
import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { firebaseConfig } from "./firebaseConfig";

// Initialize Firebase Admin (only once)
// ⚠️ TEST MODU: Credential olmadan çalışıyor
// Production'da mutlaka Service Account Key ekleyin!
let app;
if (!getApps().length) {
  console.log("🔥 Firebase Admin: Test modunda başlatılıyor (credential YOK)");
  console.log("⚠️  Firestore ve Storage kurallarının 'allow read, write: if true' olması gerekiyor!");
  
  app = initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
  });
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const bucket = getStorage(app).bucket();

// Collection names
export const COLLECTIONS = {
  SETTINGS: "settings",
  SUBMISSIONS: "submissions",
  USER_LOGINS: "userLogins",
};


export default app;
