// Lazer Yazıcı, Çalışma Masası, Çalışma Koltukları kategorileri ekleyen
// ve Mutfak, Yemek Odası, Ofis Mobilyaları kategorilerini silen script
// Çalıştırmak için: node scripts/seedYeniKategoriler.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, where, deleteDoc, doc } = require('firebase/firestore');

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

// Yeni kategoriler
const newCategories = [
  {
    categoryId: 'lazer-yazici',
    name: 'Lazer Yazıcı',
    icon: '🖨️',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
    description: 'HP, Canon, Brother lazer yazıcılar - hızlı ve ekonomik baskı',
    order: 5
  },
  {
    categoryId: 'calisma-masasi',
    name: 'Çalışma Masası',
    icon: '🪑',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800',
    description: 'Ergonomik çalışma masaları, ofis ve ev için ideal',
    order: 6
  },
  {
    categoryId: 'calisma-koltuklari',
    name: 'Çalışma Koltukları',
    icon: '💺',
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800',
    description: 'Ergonomik ofis koltukları, gaming sandalyeler',
    order: 7
  }
];

// Silinecek kategoriler
const categoriesToDelete = ['mutfak', 'yemek-odasi', 'ofis-mobilyalari'];

// Lazer Yazıcı ürünleri
const lazerYaziciProducts = [
  {
    name: 'HP LaserJet Pro M404dn',
    description: 'Yüksek hızlı mono lazer yazıcı, otomatik çift taraflı baskı, Ethernet bağlantısı.',
    price: 6999,
    originalPrice: 8499,
    discount: 18,
    category: 'lazer-yazici',
    stock: 30,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Mono Lazer',
      'Baskı Hızı': '40 ppm',
      'Çözünürlük': '1200 x 1200 dpi',
      'Bağlantı': 'USB, Ethernet',
      'Duplex': 'Otomatik'
    },
    rating: 4.7,
    reviews: 345
  },
  {
    name: 'Canon i-SENSYS LBP623Cdw Renkli',
    description: 'Renkli lazer yazıcı, Wi-Fi, mobil baskı desteği, düşük enerji tüketimi.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    category: 'lazer-yazici',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Lazer',
      'Baskı Hızı': '21 ppm',
      'Çözünürlük': '1200 x 1200 dpi',
      'Bağlantı': 'Wi-Fi, USB, Ethernet',
      'Mobil Baskı': 'AirPrint, Mopria'
    },
    rating: 4.6,
    reviews: 234
  },
  {
    name: 'Brother HL-L2350DW',
    description: 'Kompakt mono lazer yazıcı, kablosuz bağlantı, uygun fiyat.',
    price: 3499,
    originalPrice: 4299,
    discount: 19,
    category: 'lazer-yazici',
    stock: 50,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Mono Lazer',
      'Baskı Hızı': '30 ppm',
      'Çözünürlük': '2400 x 600 dpi',
      'Bağlantı': 'Wi-Fi, USB',
      'Duplex': 'Otomatik'
    },
    rating: 4.5,
    reviews: 567
  },
  {
    name: 'HP Color LaserJet Pro M255dw',
    description: 'Profesyonel renkli lazer yazıcı, hızlı baskı, güvenlik özellikleri.',
    price: 9499,
    originalPrice: 11999,
    discount: 21,
    category: 'lazer-yazici',
    stock: 20,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'
    ],
    specs: {
      'Baskı Tipi': 'Renkli Lazer',
      'Baskı Hızı': '22 ppm',
      'Çözünürlük': '600 x 600 dpi',
      'Bağlantı': 'Wi-Fi, USB, Ethernet',
      'Güvenlik': 'HP Smart Security'
    },
    rating: 4.8,
    reviews: 189
  }
];

// Çalışma Masası ürünleri
const calismaMasasiProducts = [
  {
    name: 'IKEA BEKANT Elektrikli Masa 160x80',
    description: 'Yükseklik ayarlı elektrikli masa, otur-kalk çalışma için ideal, hafıza özellikli.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    category: 'calisma-masasi',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'
    ],
    specs: {
      'Boyut': '160 x 80 cm',
      'Yükseklik': '65-125 cm (ayarlanabilir)',
      'Motor': 'Elektrikli, çift motor',
      'Hafıza': '4 pozisyon',
      'Malzeme': 'Çelik bacak, MDF tabla'
    },
    rating: 4.8,
    reviews: 456
  },
  {
    name: 'Gaming Desk RGB LED 140cm',
    description: 'RGB LED aydınlatmalı gaming masası, kablo yönetimi, kulaklık askısı.',
    price: 3999,
    originalPrice: 4999,
    discount: 20,
    category: 'calisma-masasi',
    stock: 40,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'
    ],
    specs: {
      'Boyut': '140 x 60 cm',
      'Yükseklik': '75 cm',
      'LED': 'RGB 16.8 milyon renk',
      'Özellikler': 'Kulaklık askısı, bardak tutucu',
      'Malzeme': 'Karbon fiber kaplama'
    },
    rating: 4.6,
    reviews: 678
  },
  {
    name: 'L Şeklinde Köşe Çalışma Masası',
    description: 'Geniş çalışma alanı, köşe tasarım, raf sistemi dahil.',
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    category: 'calisma-masasi',
    stock: 35,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'
    ],
    specs: {
      'Boyut': '140 x 140 x 75 cm',
      'Malzeme': 'MDF, metal ayak',
      'Renk': 'Ceviz/Siyah',
      'Özellikler': 'Kitaplık, çekmece',
      'Taşıma Kapasitesi': '80 kg'
    },
    rating: 4.4,
    reviews: 345
  },
  {
    name: 'Minimalist Çalışma Masası 120cm',
    description: 'Sade ve şık tasarım, ev ofis için ideal, kolay montaj.',
    price: 1299,
    originalPrice: 1699,
    discount: 24,
    category: 'calisma-masasi',
    stock: 60,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800'
    ],
    specs: {
      'Boyut': '120 x 60 x 75 cm',
      'Malzeme': 'Meşe MDF, metal ayak',
      'Renk': 'Doğal Meşe',
      'Montaj': 'Kolay montaj',
      'Taşıma Kapasitesi': '50 kg'
    },
    rating: 4.3,
    reviews: 234
  }
];

// Çalışma Koltukları ürünleri
const calismaKoltuklariProducts = [
  {
    name: 'Herman Miller Aeron Remastered',
    description: 'Premium ergonomik ofis koltuğu, PostureFit SL, 12 yıl garanti.',
    price: 42999,
    originalPrice: 49999,
    discount: 14,
    category: 'calisma-koltuklari',
    stock: 10,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    specs: {
      'Malzeme': 'Pellicle örgü',
      'Ayar': 'Tam ayarlanabilir',
      'Lomber': 'PostureFit SL',
      'Kol': '4D ayarlı',
      'Garanti': '12 yıl'
    },
    rating: 4.9,
    reviews: 234
  },
  {
    name: 'Secretlab Titan Evo 2022',
    description: 'Premium gaming sandalye, 4-yönlü lomber destek, manyetik yastık.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    category: 'calisma-koltuklari',
    stock: 25,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    specs: {
      'Malzeme': 'Neo Hybrid Leatherette',
      'Lomber': '4-yönlü L-ADAPT',
      'Yastık': 'Manyetik bellek köpük',
      'Kol': '4D ayarlı',
      'Kapasite': '130 kg'
    },
    rating: 4.8,
    reviews: 567
  },
  {
    name: 'IKEA MARKUS Ofis Koltuğu',
    description: 'Popüler ergonomik koltuk, yüksek sırt, 10 yıl garanti.',
    price: 4999,
    originalPrice: 5999,
    discount: 17,
    category: 'calisma-koltuklari',
    stock: 45,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    specs: {
      'Malzeme': 'Örgü sırt, kumaş oturak',
      'Ayar': 'Yükseklik ayarlı',
      'Lomber': 'Dahili destek',
      'Kol': 'Sabit',
      'Garanti': '10 yıl'
    },
    rating: 4.5,
    reviews: 1234
  },
  {
    name: 'DXRacer Formula Series',
    description: 'Gaming sandalye, yarış koltuğu tasarımı, dayanıklı yapı.',
    price: 6999,
    originalPrice: 8499,
    discount: 18,
    category: 'calisma-koltuklari',
    stock: 35,
    featured: true,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    specs: {
      'Malzeme': 'PU Deri',
      'Çerçeve': 'Çelik iskelet',
      'Yastık': 'Boyun ve bel yastığı',
      'Kol': '3D ayarlı',
      'Kapasite': '100 kg'
    },
    rating: 4.4,
    reviews: 456
  },
  {
    name: 'Ergonomik Fileli Ofis Koltuğu',
    description: 'Uygun fiyatlı ergonomik koltuk, fileli sırt, hava sirkülasyonu.',
    price: 1999,
    originalPrice: 2699,
    discount: 26,
    category: 'calisma-koltuklari',
    stock: 80,
    featured: false,
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    specs: {
      'Malzeme': 'Mesh sırt, kumaş oturak',
      'Ayar': 'Yükseklik, eğim',
      'Lomber': 'Ayarlanabilir',
      'Kol': 'Flip-up',
      'Kapasite': '120 kg'
    },
    rating: 4.2,
    reviews: 789
  }
];

async function checkCategoryExists(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

async function deleteCategory(categoryId) {
  const q = query(collection(db, 'categories'), where('categoryId', '==', categoryId));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    for (const docSnapshot of snapshot.docs) {
      await deleteDoc(doc(db, 'categories', docSnapshot.id));
      console.log(`🗑️ ${categoryId} kategorisi silindi.`);
    }
    return true;
  }
  return false;
}

async function deleteProductsByCategory(categoryId) {
  const q = query(collection(db, 'products'), where('category', '==', categoryId));
  const snapshot = await getDocs(q);
  let count = 0;
  for (const docSnapshot of snapshot.docs) {
    await deleteDoc(doc(db, 'products', docSnapshot.id));
    count++;
  }
  if (count > 0) {
    console.log(`🗑️ ${categoryId} kategorisinden ${count} ürün silindi.`);
  }
  return count;
}

async function seedData() {
  console.log('🚀 Kategori güncelleme işlemi başlıyor...\n');

  try {
    // Önce silinecek kategorileri ve ürünlerini sil
    console.log('🗑️ Kategoriler siliniyor...\n');
    for (const catId of categoriesToDelete) {
      await deleteProductsByCategory(catId);
      const deleted = await deleteCategory(catId);
      if (!deleted) {
        console.log(`⚠️ ${catId} kategorisi bulunamadı.`);
      }
    }

    // Yeni kategorileri ekle
    console.log('\n📁 Yeni kategoriler ekleniyor...\n');
    for (const cat of newCategories) {
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

    // Lazer Yazıcı ürünlerini ekle
    console.log('\n🖨️ Lazer Yazıcı ürünleri ekleniyor...\n');
    for (const product of lazerYaziciProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi`);
    }

    // Çalışma Masası ürünlerini ekle
    console.log('\n🪑 Çalışma Masası ürünleri ekleniyor...\n');
    for (const product of calismaMasasiProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi`);
    }

    // Çalışma Koltukları ürünlerini ekle
    console.log('\n💺 Çalışma Koltukları ürünleri ekleniyor...\n');
    for (const product of calismaKoltuklariProducts) {
      const productRef = await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log(`✅ ${product.name} eklendi`);
    }

    console.log('\n🎉 Tüm işlemler başarıyla tamamlandı!');
    console.log('\n📋 Özet:');
    console.log('   - 3 kategori silindi (Mutfak, Yemek Odası, Ofis Mobilyaları)');
    console.log('   - 3 kategori eklendi (Lazer Yazıcı, Çalışma Masası, Çalışma Koltukları)');
    console.log('   - 13 ürün eklendi');
    console.log('\n📊 Güncel Kategori Sıralaması:');
    console.log('   1. 💻 Bilgisayar (order: 0)');
    console.log('   2. 📱 Tablet (order: 1)');
    console.log('   3. 🖨️ Tanklı Yazıcı (order: 2)');
    console.log('   4. ⌚ Akıllı Saat (order: 3)');
    console.log('   5. 🥤 Suluklar (order: 4)');
    console.log('   6. 🖨️ Lazer Yazıcı (order: 5) ← YENİ');
    console.log('   7. 🪑 Çalışma Masası (order: 6) ← YENİ');
    console.log('   8. 💺 Çalışma Koltukları (order: 7) ← YENİ');
    
  } catch (error) {
    console.error('❌ Hata:', error);
  }
  
  process.exit(0);
}

seedData();

