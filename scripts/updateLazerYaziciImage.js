// Lazer Yazıcı kategorisinin fotoğrafını güncelleyen script
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs, updateDoc, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDWrkq5-VbVbYRedB2vlqqFH1YP7wwmKT8",
  authDomain: "carsi-18a12.firebaseapp.com",
  projectId: "carsi-18a12",
  storageBucket: "carsi-18a12.firebasestorage.app",
  messagingSenderId: "317524788708",
  appId: "1:317524788708:web:7c3654c844e42b60e0f3f1",
  measurementId: "G-TN94369HG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Yeni lazer yazıcı görseli - daha modern ve profesyonel
const newImageUrl = 'https://images.unsplash.com/photo-1562408590-e32931084e23?w=800';

async function updateLazerYaziciImage() {
  try {
    console.log('🖨️ Lazer Yazıcı kategorisi güncelleniyor...\n');
    
    // Lazer yazıcı kategorisini bul
    const q = query(
      collection(db, 'categories'),
      where('categoryId', '==', 'lazer-yazici')
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ Lazer Yazıcı kategorisi bulunamadı!');
      return;
    }
    
    // Kategoriyi güncelle
    const categoryDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, 'categories', categoryDoc.id), {
      image: newImageUrl
    });
    
    console.log('✅ Lazer Yazıcı kategorisi görseli güncellendi!');
    console.log(`   Eski: ${categoryDoc.data().image}`);
    console.log(`   Yeni: ${newImageUrl}`);
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

updateLazerYaziciImage();

