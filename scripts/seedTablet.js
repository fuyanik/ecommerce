// Tablet kategorisi ve örnek ürünleri Firebase'e ekleyen script
// Çalıştırmak için: node scripts/seedTablet.js

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

// Tablet kategorisi
const tabletCategory = {
  categoryId: 'tablet',
  name: 'Tablet',
  icon: '📱',
  image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
  description: 'iPad, Android tablet ve tablet aksesuarları',
  order: 1 // 2. sırada gösterilecek (Bilgisayar = 0)
};

// Örnek tablet ürünleri
const tabletProducts = [
  {
    name: 'iPad Pro 12.9" M2 Chip',
    description: 'Apple M2 çip, 12.9" Liquid Retina XDR ekran, 256GB depolama, Wi-Fi + Cellular. Profesyoneller için en güçlü iPad.',
    price: 54999,
    originalPrice: 59999,
    discount: 8,
    category: 'tablet',
    stock: 20,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'
    ],
    specs: {
      'Çip': 'Apple M2',
      'Ekran': '12.9" Liquid Retina XDR',
      'Depolama': '256GB',
      'Bağlantı': 'Wi-Fi + 5G Cellular',
      'Batarya': '10 saat'
    },
    rating: 4.9,
    reviews: 312
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra',
    description: 'Snapdragon 8 Gen 2, 14.6" Dynamic AMOLED 2X ekran, 512GB, S Pen dahil. Android tabletlerin zirvesi.',
    price: 42999,
    originalPrice: 49999,
    discount: 14,
    category: 'tablet',
    stock: 12,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1632634711513-3a78e4d6d98a?w=800',
      'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=800'
    ],
    specs: {
      'İşlemci': 'Snapdragon 8 Gen 2',
      'Ekran': '14.6" Dynamic AMOLED 2X',
      'RAM': '12GB',
      'Depolama': '512GB',
      'Kalem': 'S Pen Dahil'
    },
    rating: 4.7,
    reviews: 189
  },
  {
    name: 'iPad Air 5. Nesil M1',
    description: 'Apple M1 çip, 10.9" Liquid Retina ekran, 64GB. Güç ve taşınabilirlik bir arada.',
    price: 24999,
    originalPrice: 28999,
    discount: 14,
    category: 'tablet',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=800',
      'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=800'
    ],
    specs: {
      'Çip': 'Apple M1',
      'Ekran': '10.9" Liquid Retina',
      'Depolama': '64GB',
      'Bağlantı': 'Wi-Fi 6',
      'Touch ID': 'Üst Düğmede'
    },
    rating: 4.8,
    reviews: 256
  }
];

async function checkCategoryExists(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function seedData() {
  console.log('🚀 Tablet kategorisi ve ürünleri ekleniyor...\n');

  try {
    // Kategori kontrolü
    const categoryExists = await checkCategoryExists('tablet');
    
    if (categoryExists) {
      console.log('⚠️ Tablet kategorisi zaten mevcut, kategori ekleme atlanıyor.');
    } else {
      // Kategori ekle
      const categoryRef = await addDoc(collection(db, 'categories'), {
        ...tabletCategory,
        createdAt: serverTimestamp()
      });
      console.log('✅ Tablet kategorisi eklendi:', categoryRef.id);
    }

    // Ürünleri ekle
    console.log('\n📦 Ürünler ekleniyor...\n');
    
    for (const product of tabletProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi:`, productRef.id);
    }

    console.log('\n🎉 Tüm veriler başarıyla eklendi!');
    console.log('\n📋 Özet:');
    console.log('   - 1 kategori (Tablet - order: 1, 2. sırada)');
    console.log('   - 3 ürün (iPad Pro, Galaxy Tab S9 Ultra, iPad Air)');
    console.log('\n📊 Kategori Sıralaması:');
    console.log('   1. Bilgisayar (order: 0)');
    console.log('   2. Tablet (order: 1)');
    console.log('   3. Diğer kategoriler...');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

seedData();

