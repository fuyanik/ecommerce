// Bilgisayar kategorisi ve örnek ürünleri Firebase'e ekleyen script
// Çalıştırmak için: node scripts/seedBilgisayar.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDWrkq5-VbVbYRedB2vlqqFH1YP7wwmKT8",
  authDomain: "carsi-18a12.firebaseapp.com",
  projectId: "carsi-18a12",
  storageBucket: "carsi-18a12.firebasestorage.app",
  messagingSenderId: "317524788708",
  appId: "1:317524788708:web:7c3654c844e42b60e0f3f1",
  measurementId: "G-TN94369HG0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Bilgisayar kategorisi
const bilgisayarCategory = {
  categoryId: 'bilgisayar',
  name: 'Bilgisayar',
  icon: '💻',
  image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
  description: 'Laptop, masaüstü bilgisayar ve bilgisayar aksesuarları',
  order: 0 // En başta gösterilecek
};

// Örnek bilgisayar ürünleri
const bilgisayarProducts = [
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'Apple M3 Pro çip, 18GB RAM, 512GB SSD, 14.2" Liquid Retina XDR ekran. Profesyonel işler için mükemmel performans.',
    price: 89999,
    originalPrice: 99999,
    discount: 10,
    category: 'bilgisayar',
    stock: 15,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
    ],
    specs: {
      'İşlemci': 'Apple M3 Pro',
      'RAM': '18GB',
      'Depolama': '512GB SSD',
      'Ekran': '14.2" Liquid Retina XDR',
      'Batarya': '17 saat'
    },
    rating: 4.9,
    reviews: 234
  },
  {
    name: 'ASUS ROG Strix Gaming Laptop',
    description: 'Intel Core i9-13900H, NVIDIA RTX 4070, 32GB RAM, 1TB SSD, 17.3" 240Hz QHD ekran. Oyuncular için üstün performans.',
    price: 64999,
    originalPrice: 74999,
    discount: 13,
    category: 'bilgisayar',
    stock: 8,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800',
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'
    ],
    specs: {
      'İşlemci': 'Intel Core i9-13900H',
      'Ekran Kartı': 'NVIDIA RTX 4070 8GB',
      'RAM': '32GB DDR5',
      'Depolama': '1TB NVMe SSD',
      'Ekran': '17.3" 240Hz QHD'
    },
    rating: 4.7,
    reviews: 156
  },
  {
    name: 'HP Pavilion All-in-One PC',
    description: '27" FHD dokunmatik ekran, Intel Core i7-13700T, 16GB RAM, 512GB SSD. Ev ve ofis kullanımı için ideal.',
    price: 32999,
    originalPrice: 38999,
    discount: 15,
    category: 'bilgisayar',
    stock: 12,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
      'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=800'
    ],
    specs: {
      'İşlemci': 'Intel Core i7-13700T',
      'RAM': '16GB DDR4',
      'Depolama': '512GB SSD',
      'Ekran': '27" FHD Dokunmatik',
      'Webcam': '5MP IR Kamera'
    },
    rating: 4.5,
    reviews: 89
  }
];

async function checkCategoryExists(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function seedData() {
  console.log('🚀 Bilgisayar kategorisi ve ürünleri ekleniyor...\n');

  try {
    // Kategori kontrolü
    const categoryExists = await checkCategoryExists('bilgisayar');
    
    if (categoryExists) {
      console.log('⚠️ Bilgisayar kategorisi zaten mevcut, kategori ekleme atlanıyor.');
    } else {
      // Kategori ekle
      const categoryRef = await addDoc(collection(db, 'categories'), {
        ...bilgisayarCategory,
        createdAt: serverTimestamp()
      });
      console.log('✅ Bilgisayar kategorisi eklendi:', categoryRef.id);
    }

    // Ürünleri ekle
    console.log('\n📦 Ürünler ekleniyor...\n');
    
    for (const product of bilgisayarProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi:`, productRef.id);
    }

    console.log('\n🎉 Tüm veriler başarıyla eklendi!');
    console.log('\n📋 Özet:');
    console.log('   - 1 kategori (Bilgisayar - order: 0, en başta)');
    console.log('   - 3 ürün (MacBook Pro, ASUS ROG, HP Pavilion)');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

seedData();

