// Tanklı Yazıcı kategorisi ve örnek ürünleri Firebase'e ekleyen script
// Çalıştırmak için: node scripts/seedTankliYazici.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, updateDoc, doc } = require('firebase/firestore');

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

// Tanklı Yazıcı kategorisi
const category = {
  categoryId: 'tankli-yazici',
  name: 'Tanklı Yazıcı',
  icon: '🖨️',
  image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
  description: 'Epson EcoTank, Canon MegaTank ve HP Smart Tank yazıcılar',
  order: 2 // Bilgisayar (0) ve Tablet (1) sonrası
};

// Tanklı Yazıcı ürünleri
const tankliYaziciProducts = [
  {
    name: 'Epson EcoTank L3250 Wi-Fi Yazıcı',
    description: 'Kablosuz bağlantılı, yüksek kapasiteli mürekkep tankı. Düşük maliyetli baskı için ideal. Tarayıcı ve fotokopi özellikli.',
    price: 5499,
    originalPrice: 6999,
    discount: 21,
    category: 'tankli-yazici',
    stock: 45,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, USB',
      'Baskı Hızı': '33 ppm (siyah), 15 ppm (renkli)',
      'Çözünürlük': '5760 x 1440 dpi',
      'Fonksiyonlar': 'Baskı, Tarama, Kopyalama'
    },
    rating: 4.7,
    reviews: 892
  },
  {
    name: 'Canon PIXMA MegaTank G3420',
    description: 'Sürekli mürekkep beslemeli, ekonomik baskı. 6000 sayfa siyah, 7700 sayfa renkli baskı kapasitesi.',
    price: 4799,
    originalPrice: 5999,
    discount: 20,
    category: 'tankli-yazici',
    stock: 60,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, USB',
      'Baskı Hızı': '9.1 ipm (siyah), 5 ipm (renkli)',
      'Çözünürlük': '4800 x 1200 dpi',
      'Tank Kapasitesi': '135ml siyah, 70ml renkli'
    },
    rating: 4.6,
    reviews: 567
  },
  {
    name: 'HP Smart Tank 515 Wireless',
    description: 'Akıllı kablosuz yazıcı, HP Smart App ile kolay bağlantı. 8000 sayfa siyah, 6000 sayfa renkli baskı.',
    price: 5199,
    originalPrice: 6499,
    discount: 20,
    category: 'tankli-yazici',
    stock: 35,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, Bluetooth, USB',
      'Baskı Hızı': '11 ppm (siyah), 5 ppm (renkli)',
      'Çözünürlük': '1200 x 1200 dpi',
      'Özellikler': 'HP Smart App, AirPrint'
    },
    rating: 4.5,
    reviews: 423
  },
  {
    name: 'Epson EcoTank L5290 Faks Özellikli',
    description: 'Faks özellikli 4-in-1 yazıcı. ADF ile otomatik belge besleyici. Ofis kullanımı için ideal.',
    price: 7999,
    originalPrice: 9499,
    discount: 16,
    category: 'tankli-yazici',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, Ethernet, USB, Faks',
      'Baskı Hızı': '33 ppm (siyah), 20 ppm (renkli)',
      'ADF': '30 sayfa kapasiteli',
      'Fonksiyonlar': 'Baskı, Tarama, Kopyalama, Faks'
    },
    rating: 4.8,
    reviews: 234
  },
  {
    name: 'Canon PIXMA MegaTank G6040',
    description: 'Profesyonel tanklı yazıcı, çift taraflı otomatik baskı. Ethernet bağlantısı ile ofis ağına entegre.',
    price: 8499,
    originalPrice: 10499,
    discount: 19,
    category: 'tankli-yazici',
    stock: 20,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, Ethernet, USB',
      'Baskı Hızı': '13 ipm (siyah), 6.8 ipm (renkli)',
      'Çift Taraflı': 'Otomatik Duplex',
      'Fonksiyonlar': 'Baskı, Tarama, Kopyalama'
    },
    rating: 4.7,
    reviews: 189
  },
  {
    name: 'Brother DCP-T520W InkBenefit Plus',
    description: 'Ekonomik mürekkep tüketimi, yüksek hacimli baskı için tasarlandı. Mobil baskı desteği.',
    price: 4299,
    originalPrice: 5199,
    discount: 17,
    category: 'tankli-yazici',
    stock: 55,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Mürekkep Püskürtmeli',
      'Bağlantı': 'Wi-Fi, USB',
      'Baskı Hızı': '17 ipm (siyah), 9.5 ipm (renkli)',
      'Çözünürlük': '1200 x 6000 dpi',
      'Tank Kapasitesi': '6500 sayfa siyah'
    },
    rating: 4.4,
    reviews: 312
  }
];

async function checkCategoryExists(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function updateCategoryOrder(categoryId, newOrder) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    const docRef = doc(db, 'categories', snapshot.docs[0].id);
    await updateDoc(docRef, { order: newOrder });
    console.log(`📝 ${categoryId} kategorisinin sırası ${newOrder} olarak güncellendi.`);
  }
}

async function seedData() {
  console.log('🚀 Tanklı Yazıcı kategorisi ekleniyor...\n');

  try {
    // Önce mevcut kategorilerin sırasını güncelle
    console.log('📋 Kategori sıralaması güncelleniyor...\n');
    
    // Akıllı saat order: 2 -> 3
    await updateCategoryOrder('akilli-saat', 3);
    
    // Suluklar order: 3 -> 4
    await updateCategoryOrder('suluklar', 4);

    // Tanklı Yazıcı kategorisini ekle
    const exists = await checkCategoryExists(category.categoryId);
    
    if (exists) {
      console.log(`⚠️ ${category.name} kategorisi zaten mevcut, atlanıyor.`);
    } else {
      const categoryRef = await addDoc(collection(db, 'categories'), {
        ...category,
        createdAt: serverTimestamp()
      });
      console.log(`✅ ${category.name} kategorisi eklendi:`, categoryRef.id);
    }

    // Tanklı Yazıcı ürünlerini ekle
    console.log('\n🖨️ Tanklı Yazıcı ürünleri ekleniyor...\n');
    for (const product of tankliYaziciProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi:`, productRef.id);
    }

    console.log('\n🎉 Tüm veriler başarıyla eklendi!');
    console.log('\n📋 Özet:');
    console.log('   - 1 kategori eklendi (Tanklı Yazıcı)');
    console.log('   - 6 ürün eklendi');
    console.log('\n📊 Güncel Kategori Sıralaması:');
    console.log('   1. 💻 Bilgisayar (order: 0)');
    console.log('   2. 📱 Tablet (order: 1)');
    console.log('   3. 🖨️ Tanklı Yazıcı (order: 2) ← YENİ');
    console.log('   4. ⌚ Akıllı Saat (order: 3)');
    console.log('   5. 🥤 Suluklar (order: 4)');
    console.log('   6. Diğer kategoriler...');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

seedData();

