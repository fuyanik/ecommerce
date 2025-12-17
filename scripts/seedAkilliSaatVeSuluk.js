// Akıllı Saat ve Suluklar kategorileri ve örnek ürünleri Firebase'e ekleyen script
// Çalıştırmak için: node scripts/seedAkilliSaatVeSuluk.js

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

// Kategoriler
const categories = [
  {
    categoryId: 'akilli-saat',
    name: 'Akıllı Saat',
    icon: '⌚',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
    description: 'Apple Watch, Samsung Galaxy Watch ve daha fazlası',
    order: 2 // Bilgisayar (0) ve Tablet (1) sonrası
  },
  {
    categoryId: 'suluklar',
    name: 'Suluklar',
    icon: '🥤',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
    description: 'Spor suluğu, termos ve matara çeşitleri',
    order: 3
  }
];

// Akıllı Saat ürünleri
const akilliSaatProducts = [
  {
    name: 'Apple Watch Series 9 GPS 45mm',
    description: 'Always-on Retina ekran, S9 SiP çip, kan oksijeni ve EKG sensörü. Sağlık ve fitness için en gelişmiş Apple Watch.',
    price: 18999,
    originalPrice: 21999,
    discount: 14,
    category: 'akilli-saat',
    stock: 30,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'
    ],
    specs: {
      'Ekran': '45mm Always-on Retina',
      'Çip': 'S9 SiP',
      'Bağlantı': 'GPS + Cellular',
      'Su Geçirmezlik': '50m',
      'Batarya': '18 saat'
    },
    rating: 4.9,
    reviews: 456
  },
  {
    name: 'Samsung Galaxy Watch 6 Classic 47mm',
    description: 'Döner çerçeve, Super AMOLED ekran, gelişmiş uyku takibi. Premium tasarım ve akıllı özellikler.',
    price: 12999,
    originalPrice: 15999,
    discount: 19,
    category: 'akilli-saat',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'
    ],
    specs: {
      'Ekran': '1.5" Super AMOLED',
      'İşlemci': 'Exynos W930',
      'RAM': '2GB',
      'Depolama': '16GB',
      'Batarya': '425mAh'
    },
    rating: 4.7,
    reviews: 289
  },
  {
    name: 'Xiaomi Watch 2 Pro',
    description: 'AMOLED ekran, HyperOS, 150+ spor modu, GPS. Uygun fiyata premium özellikler.',
    price: 4999,
    originalPrice: 5999,
    discount: 17,
    category: 'akilli-saat',
    stock: 50,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=800',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
    ],
    specs: {
      'Ekran': '1.43" AMOLED',
      'İşletim Sistemi': 'HyperOS',
      'Spor Modları': '150+',
      'GPS': 'Dahili',
      'Batarya': '65 saat'
    },
    rating: 4.5,
    reviews: 567
  }
];

// Suluk ürünleri
const sulukProducts = [
  {
    name: 'Stanley Adventure Termos 1L',
    description: 'Paslanmaz çelik, çift cidarlı vakum izolasyon. 24 saat soğuk, 20 saat sıcak tutar. Outdoor için ideal.',
    price: 899,
    originalPrice: 1199,
    discount: 25,
    category: 'suluklar',
    stock: 100,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800',
      'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=800'
    ],
    specs: {
      'Kapasite': '1 Litre',
      'Malzeme': '18/8 Paslanmaz Çelik',
      'İzolasyon': 'Vakum Çift Cidar',
      'Sıcak Tutma': '20 saat',
      'Soğuk Tutma': '24 saat'
    },
    rating: 4.8,
    reviews: 1234
  },
  {
    name: 'Nalgene Tritan Matara 1L',
    description: 'BPA içermeyen Tritan plastik, hafif ve dayanıklı. Outdoor ve günlük kullanım için mükemmel.',
    price: 349,
    originalPrice: 449,
    discount: 22,
    category: 'suluklar',
    stock: 150,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800',
      'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800'
    ],
    specs: {
      'Kapasite': '1 Litre',
      'Malzeme': 'Tritan (BPA Free)',
      'Ağırlık': '180g',
      'Ağız Genişliği': 'Geniş',
      'Bulaşık Makinesi': 'Uygun'
    },
    rating: 4.6,
    reviews: 892
  },
  {
    name: 'Hydro Flask Spor Suluğu 710ml',
    description: 'TempShield izolasyon, toz kaplama. Sporculara özel tasarım, tek elle açılır kapak.',
    price: 649,
    originalPrice: 799,
    discount: 19,
    category: 'suluklar',
    stock: 75,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1556011308-7d88c0d67d04?w=800',
      'https://images.unsplash.com/photo-1625708458528-802ec79b1ed8?w=800'
    ],
    specs: {
      'Kapasite': '710ml',
      'Malzeme': 'Paslanmaz Çelik',
      'İzolasyon': 'TempShield',
      'Kapak': 'Flex Cap',
      'Garanti': 'Ömür Boyu'
    },
    rating: 4.7,
    reviews: 678
  }
];

async function checkCategoryExists(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function seedData() {
  console.log('🚀 Akıllı Saat ve Suluklar kategorileri ekleniyor...\n');

  try {
    // Kategorileri ekle
    for (const cat of categories) {
      const exists = await checkCategoryExists(cat.categoryId);
      
      if (exists) {
        console.log(`⚠️ ${cat.name} kategorisi zaten mevcut, atlanıyor.`);
      } else {
        const categoryRef = await addDoc(collection(db, 'categories'), {
          ...cat,
          createdAt: serverTimestamp()
        });
        console.log(`✅ ${cat.name} kategorisi eklendi:`, categoryRef.id);
      }
    }

    // Akıllı Saat ürünlerini ekle
    console.log('\n⌚ Akıllı Saat ürünleri ekleniyor...\n');
    for (const product of akilliSaatProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi:`, productRef.id);
    }

    // Suluk ürünlerini ekle
    console.log('\n🥤 Suluk ürünleri ekleniyor...\n');
    for (const product of sulukProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi:`, productRef.id);
    }

    console.log('\n🎉 Tüm veriler başarıyla eklendi!');
    console.log('\n📋 Özet:');
    console.log('   - 2 kategori eklendi');
    console.log('   - 6 ürün eklendi (3 akıllı saat + 3 suluk)');
    console.log('\n📊 Kategori Sıralaması:');
    console.log('   1. 💻 Bilgisayar (order: 0)');
    console.log('   2. 📱 Tablet (order: 1)');
    console.log('   3. ⌚ Akıllı Saat (order: 2)');
    console.log('   4. 🥤 Suluklar (order: 3)');
    console.log('   5. Diğer kategoriler...');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

seedData();

