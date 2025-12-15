// Firebase Migration Script
// Bu script bir kerelik çalıştırılıp products.js'deki verileri Firebase'e aktarır

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, writeBatch, doc } from 'firebase/firestore';

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

// Categories data
const categories = [
  {
    id: 'teknoloji',
    name: 'Teknoloji',
    icon: '📱',
    image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400',
    description: 'En son teknoloji ürünleri'
  },
  {
    id: 'ev-esyalari',
    name: 'Ev Eşyaları',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    description: 'Eviniz için her şey'
  },
  {
    id: 'bebek-urunleri',
    name: 'Bebek Ürünleri',
    icon: '👶',
    image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400',
    description: 'Bebeğiniz için en iyisi'
  },
  {
    id: 'mobilya',
    name: 'Mobilya',
    icon: '🛋️',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    description: 'Modern mobilya koleksiyonu'
  },
  {
    id: 'beyaz-esya',
    name: 'Beyaz Eşya',
    icon: '🧊',
    image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400',
    description: 'Kaliteli beyaz eşyalar'
  },
  {
    id: 'kucuk-ev-aletleri',
    name: 'Küçük Ev Aletleri',
    icon: '☕',
    image: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=400',
    description: 'Pratik ev aletleri'
  }
];

// Products data
const products = [
  // Teknoloji
  {
    name: 'iPhone 15 Pro Max',
    description: 'Apple\'ın en güçlü iPhone\'u. A17 Pro çip, titanium tasarım ve gelişmiş kamera sistemi ile.',
    price: 64999,
    originalPrice: 69999,
    discount: 7,
    category: 'teknoloji',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800'
    ],
    rating: 4.9,
    reviews: 1250,
    stock: 15,
    featured: true,
    specs: {
      'Ekran': '6.7 inç Super Retina XDR',
      'İşlemci': 'A17 Pro',
      'RAM': '8 GB',
      'Depolama': '256 GB',
      'Kamera': '48 MP + 12 MP + 12 MP'
    }
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI ile donatılmış, S Pen destekli premium akıllı telefon.',
    price: 54999,
    originalPrice: 59999,
    discount: 8,
    category: 'teknoloji',
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800',
      'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800'
    ],
    rating: 4.8,
    reviews: 890,
    stock: 20,
    featured: true,
    specs: {
      'Ekran': '6.8 inç Dynamic AMOLED',
      'İşlemci': 'Snapdragon 8 Gen 3',
      'RAM': '12 GB',
      'Depolama': '256 GB',
      'Kamera': '200 MP + 12 MP + 50 MP + 10 MP'
    }
  },
  {
    name: 'MacBook Pro 14" M3 Pro',
    description: 'M3 Pro çip ile inanılmaz performans. Profesyoneller için tasarlandı.',
    price: 84999,
    originalPrice: 89999,
    discount: 6,
    category: 'teknoloji',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
    ],
    rating: 4.9,
    reviews: 567,
    stock: 8,
    featured: true,
    specs: {
      'Ekran': '14.2 inç Liquid Retina XDR',
      'İşlemci': 'Apple M3 Pro',
      'RAM': '18 GB',
      'SSD': '512 GB',
      'Pil': '18 saat'
    }
  },
  {
    name: 'Apple Watch Ultra 2',
    description: 'En dayanıklı ve yetenekli Apple Watch. Maceraperestler için.',
    price: 29999,
    originalPrice: 32999,
    discount: 9,
    category: 'teknoloji',
    images: [
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800',
      'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=800'
    ],
    rating: 4.7,
    reviews: 423,
    stock: 25,
    featured: false,
    specs: {
      'Ekran': '49mm Always-On',
      'Dayanıklılık': '100m su geçirmez',
      'GPS': 'Çift frekanslı',
      'Pil': '36 saat'
    }
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Sektör lideri gürültü engelleme teknolojisi ile kablosuz kulaklık.',
    price: 9999,
    originalPrice: 11999,
    discount: 17,
    category: 'teknoloji',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
    rating: 4.8,
    reviews: 2156,
    stock: 50,
    featured: true,
    specs: {
      'Tip': 'Over-ear',
      'Gürültü Engelleme': 'Aktif',
      'Pil': '30 saat',
      'Bağlantı': 'Bluetooth 5.2'
    }
  },

  // Ev Eşyaları
  {
    name: 'Dyson V15 Detect',
    description: 'Lazer toz algılama özellikli akıllı kablosuz süpürge.',
    price: 24999,
    originalPrice: 27999,
    discount: 11,
    category: 'ev-esyalari',
    images: [
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800',
      'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800'
    ],
    rating: 4.9,
    reviews: 678,
    stock: 12,
    featured: true,
    specs: {
      'Güç': '230 AW',
      'Çalışma Süresi': '60 dakika',
      'Teknoloji': 'Lazer Detect',
      'Filtre': 'HEPA'
    }
  },
  {
    name: 'iRobot Roomba j7+',
    description: 'Engel algılama ve otomatik boşaltma özellikli robot süpürge.',
    price: 18999,
    originalPrice: 21999,
    discount: 14,
    category: 'ev-esyalari',
    images: [
      'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=800'
    ],
    rating: 4.6,
    reviews: 892,
    stock: 18,
    featured: false,
    specs: {
      'Navigasyon': 'PrecisionVision',
      'Harita': 'Akıllı haritalama',
      'Pil': '75 dakika',
      'Wi-Fi': 'Evet'
    }
  },
  {
    name: 'Philips Hue Starter Kit',
    description: 'Akıllı ev aydınlatma sistemi. 3 ampul + köprü.',
    price: 3999,
    originalPrice: 4499,
    discount: 11,
    category: 'ev-esyalari',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'
    ],
    rating: 4.7,
    reviews: 1456,
    stock: 35,
    featured: false,
    specs: {
      'Ampul Sayısı': '3 adet',
      'Renk': '16 milyon renk',
      'Kontrol': 'Uygulama + Sesli',
      'Uyumluluk': 'Alexa, Google, Apple'
    }
  },
  {
    name: 'De\'Longhi Magnifica S',
    description: 'Tam otomatik espresso makinesi. Taze çekilmiş kahve keyfi.',
    price: 14999,
    originalPrice: 17999,
    discount: 17,
    category: 'ev-esyalari',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
    ],
    rating: 4.8,
    reviews: 567,
    stock: 10,
    featured: true,
    specs: {
      'Basınç': '15 bar',
      'Değirmen': 'Çelik konik',
      'Tank': '1.8 L',
      'İçecek': 'Espresso, Cappuccino, Latte'
    }
  },
  {
    name: 'Ninja Foodi 11-in-1',
    description: 'Çok fonksiyonlu pişirici. Basınçlı, airfryer, yavaş pişirme.',
    price: 6999,
    originalPrice: 7999,
    discount: 13,
    category: 'ev-esyalari',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'
    ],
    rating: 4.7,
    reviews: 2341,
    stock: 28,
    featured: false,
    specs: {
      'Kapasite': '6 L',
      'Fonksiyon': '11 farklı',
      'Güç': '1760 W',
      'Aksesuarlar': '5 parça'
    }
  },

  // Bebek Ürünleri
  {
    name: 'Cybex Priam Bebek Arabası',
    description: 'Premium bebek arabası. Şık tasarım ve üstün konfor.',
    price: 29999,
    originalPrice: 34999,
    discount: 14,
    category: 'bebek-urunleri',
    images: [
      'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800'
    ],
    rating: 4.9,
    reviews: 234,
    stock: 6,
    featured: true,
    specs: {
      'Ağırlık': '9.7 kg',
      'Max Yük': '22 kg',
      'Katlanabilir': 'Evet',
      'Şase': 'Alüminyum'
    }
  },
  {
    name: 'Maxi-Cosi Pebble 360',
    description: '360° döner oto koltuğu. I-Size güvenlik standardı.',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    category: 'bebek-urunleri',
    images: [
      'https://images.unsplash.com/photo-1594071216656-c5e08c1f4be4?w=800'
    ],
    rating: 4.8,
    reviews: 567,
    stock: 14,
    featured: true,
    specs: {
      'Yaş': '0-4 yaş',
      'Dönüş': '360°',
      'ISOFIX': 'Evet',
      'Güvenlik': 'I-Size onaylı'
    }
  },
  {
    name: 'Philips Avent Göğüs Pompası',
    description: 'Elektrikli çift göğüs pompası. Sessiz ve verimli.',
    price: 4999,
    originalPrice: 5699,
    discount: 12,
    category: 'bebek-urunleri',
    images: [
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'
    ],
    rating: 4.6,
    reviews: 892,
    stock: 22,
    featured: false,
    specs: {
      'Tip': 'Elektrikli çift',
      'Mod': '8 ayar',
      'Pil': 'Şarj edilebilir',
      'Sessizlik': '50 dB'
    }
  },
  {
    name: 'Stokke Tripp Trapp',
    description: 'Büyüyen mama sandalyesi. Bebeklikten yetişkinliğe.',
    price: 5999,
    originalPrice: 6499,
    discount: 8,
    category: 'bebek-urunleri',
    images: [
      'https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=800'
    ],
    rating: 4.9,
    reviews: 1234,
    stock: 18,
    featured: false,
    specs: {
      'Malzeme': 'Kayın ağacı',
      'Max Yük': '136 kg',
      'Ayarlanabilir': 'Evet',
      'Garanti': '7 yıl'
    }
  },
  {
    name: 'Baby Björn Bouncer Bliss',
    description: 'Ergonomik bebek hamağı. Doğal sallanma.',
    price: 3999,
    originalPrice: 4499,
    discount: 11,
    category: 'bebek-urunleri',
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    rating: 4.7,
    reviews: 678,
    stock: 25,
    featured: false,
    specs: {
      'Yaş': '0-2 yaş',
      'Pozisyon': '3 ayar',
      'Kumaş': 'Mesh',
      'Max Yük': '13 kg'
    }
  },

  // Mobilya
  {
    name: 'Chester Koltuk Takımı',
    description: 'Klasik Chester tasarım. Lüks deri görünümlü kumaş.',
    price: 45999,
    originalPrice: 54999,
    discount: 16,
    category: 'mobilya',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800'
    ],
    rating: 4.8,
    reviews: 189,
    stock: 4,
    featured: true,
    specs: {
      'Takım': '3+2+1',
      'Malzeme': 'Deri görünümlü',
      'Renk': 'Kahverengi',
      'Garanti': '5 yıl'
    }
  },
  {
    name: 'Minimalist TV Ünitesi',
    description: 'Modern tasarım. LED aydınlatmalı, geniş depolama.',
    price: 8999,
    originalPrice: 10999,
    discount: 18,
    category: 'mobilya',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'
    ],
    rating: 4.6,
    reviews: 423,
    stock: 12,
    featured: false,
    specs: {
      'Boyut': '180x45x50 cm',
      'Malzeme': 'MDF + Meşe',
      'LED': 'Dahil',
      'TV Max': '75 inç'
    }
  },
  {
    name: 'Yemek Masası Seti',
    description: 'Masif meşe masa + 6 sandalye. Rustik tasarım.',
    price: 24999,
    originalPrice: 29999,
    discount: 17,
    category: 'mobilya',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?w=800'
    ],
    rating: 4.9,
    reviews: 156,
    stock: 5,
    featured: true,
    specs: {
      'Boyut': '180x90 cm',
      'Kişi': '6-8',
      'Malzeme': 'Masif meşe',
      'Sandalye': '6 adet'
    }
  },
  {
    name: 'Ergonomik Ofis Koltuğu',
    description: 'Tam ayarlanabilir. Bel ve baş desteği dahil.',
    price: 7999,
    originalPrice: 9499,
    discount: 16,
    category: 'mobilya',
    images: [
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'
    ],
    rating: 4.7,
    reviews: 892,
    stock: 20,
    featured: false,
    specs: {
      'Max Yük': '150 kg',
      'Malzeme': 'Mesh + Deri',
      'Ayar': '4D kol',
      'Garanti': '3 yıl'
    }
  },
  {
    name: 'Yatak Odası Takımı',
    description: 'Modern yatak odası. Karyola, komodin, gardırop.',
    price: 35999,
    originalPrice: 42999,
    discount: 16,
    category: 'mobilya',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'
    ],
    rating: 4.8,
    reviews: 234,
    stock: 3,
    featured: false,
    specs: {
      'Takım': 'Karyola + 2 Komodin + Şifonyer',
      'Yatak': '180x200 cm',
      'Malzeme': 'MDF + Lake',
      'Renk': 'Beyaz'
    }
  },

  // Beyaz Eşya
  {
    name: 'Samsung Bespoke Buzdolabı',
    description: 'Özelleştirilebilir renk panelli, Family Hub akıllı buzdolabı.',
    price: 54999,
    originalPrice: 62999,
    discount: 13,
    category: 'beyaz-esya',
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800'
    ],
    rating: 4.8,
    reviews: 345,
    stock: 7,
    featured: true,
    specs: {
      'Kapasite': '623 L',
      'Tip': 'French Door',
      'Özellik': 'Family Hub',
      'Enerji': 'A++'
    }
  },
  {
    name: 'LG TWINWash Çamaşır Makinesi',
    description: 'İkiz tambur sistemi. Aynı anda 2 yıkama.',
    price: 42999,
    originalPrice: 49999,
    discount: 14,
    category: 'beyaz-esya',
    images: [
      'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800'
    ],
    rating: 4.7,
    reviews: 567,
    stock: 9,
    featured: true,
    specs: {
      'Kapasite': '12 + 2 kg',
      'Devir': '1400 rpm',
      'Özellik': 'AI DD',
      'Enerji': 'A+++'
    }
  },
  {
    name: 'Bosch Serie 8 Bulaşık Makinesi',
    description: 'PerfectDry teknolojisi. Zeolith kurutma.',
    price: 26999,
    originalPrice: 29999,
    discount: 10,
    category: 'beyaz-esya',
    images: [
      'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800'
    ],
    rating: 4.9,
    reviews: 1234,
    stock: 15,
    featured: false,
    specs: {
      'Kapasite': '14 kişilik',
      'Program': '8 program',
      'Kurutma': 'Zeolith',
      'Ses': '42 dB'
    }
  },
  {
    name: 'Siemens iQ700 Fırın',
    description: 'Dahili yapay zeka, otomatik pişirme programları.',
    price: 34999,
    originalPrice: 39999,
    discount: 13,
    category: 'beyaz-esya',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ],
    rating: 4.8,
    reviews: 456,
    stock: 11,
    featured: false,
    specs: {
      'Kapasite': '71 L',
      'Program': '15+ program',
      'Özellik': 'activeClean',
      'Tip': 'Ankastre'
    }
  },
  {
    name: 'Arçelik Neo Ocak',
    description: 'İndüksiyon ocak. Dokunmatik kontrol, flex zone.',
    price: 14999,
    originalPrice: 16999,
    discount: 12,
    category: 'beyaz-esya',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800'
    ],
    rating: 4.6,
    reviews: 789,
    stock: 18,
    featured: false,
    specs: {
      'Gözlü': '4 gözlü',
      'Tip': 'İndüksiyon',
      'Kontrol': 'Dokunmatik',
      'FlexZone': 'Evet'
    }
  },

  // Küçük Ev Aletleri
  {
    name: 'Vitamix A3500',
    description: 'Profesyonel blender. Self-detect teknolojisi.',
    price: 18999,
    originalPrice: 21999,
    discount: 14,
    category: 'kucuk-ev-aletleri',
    images: [
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'
    ],
    rating: 4.9,
    reviews: 567,
    stock: 12,
    featured: true,
    specs: {
      'Güç': '2.2 HP',
      'Program': '5 otomatik',
      'Kapasite': '2 L',
      'Garanti': '10 yıl'
    }
  },
  {
    name: 'KitchenAid Artisan Mikser',
    description: 'Klasik stand mikser. 10 aşamalı hız kontrolü.',
    price: 12999,
    originalPrice: 14999,
    discount: 13,
    category: 'kucuk-ev-aletleri',
    images: [
      'https://images.unsplash.com/photo-1594385208974-2e75f8d7bb48?w=800'
    ],
    rating: 4.8,
    reviews: 1234,
    stock: 15,
    featured: true,
    specs: {
      'Güç': '300 W',
      'Kase': '4.8 L',
      'Hız': '10 aşama',
      'Aksesuarlar': '3 parça'
    }
  },
  {
    name: 'Sage Barista Express',
    description: 'Espresso makinesi + değirmen. Barista kalitesi.',
    price: 16999,
    originalPrice: 18999,
    discount: 11,
    category: 'kucuk-ev-aletleri',
    images: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'
    ],
    rating: 4.7,
    reviews: 678,
    stock: 8,
    featured: false,
    specs: {
      'Basınç': '15 bar',
      'Değirmen': 'Konik çelik',
      'Tank': '2 L',
      'Mod': 'Manuel + Auto'
    }
  },
  {
    name: 'Dyson Airwrap Complete',
    description: 'Saç şekillendirici. Aşırı ısı olmadan şekillendirme.',
    price: 13999,
    originalPrice: 15999,
    discount: 13,
    category: 'kucuk-ev-aletleri',
    images: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800'
    ],
    rating: 4.6,
    reviews: 2345,
    stock: 25,
    featured: false,
    specs: {
      'Teknoloji': 'Coanda effect',
      'Başlık': '6 farklı',
      'Isı': 'Akıllı kontrol',
      'Güç': '1300 W'
    }
  },
  {
    name: 'Philips Pasta Maker',
    description: 'Otomatik makarna makinesi. 7 şekil kalıbı dahil.',
    price: 5999,
    originalPrice: 6999,
    discount: 14,
    category: 'kucuk-ev-aletleri',
    images: [
      'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800'
    ],
    rating: 4.5,
    reviews: 432,
    stock: 20,
    featured: false,
    specs: {
      'Kalıp': '7 adet',
      'Kapasite': '200g',
      'Süre': '10 dakika',
      'Temizlik': 'Kolay söküm'
    }
  }
];

async function clearCollection(collectionName) {
  console.log(`🗑️  ${collectionName} koleksiyonu temizleniyor...`);
  const snapshot = await getDocs(collection(db, collectionName));
  
  if (snapshot.empty) {
    console.log(`   ${collectionName} zaten boş.`);
    return;
  }

  const batch = writeBatch(db);
  snapshot.docs.forEach((document) => {
    batch.delete(doc(db, collectionName, document.id));
  });
  await batch.commit();
  console.log(`   ✅ ${snapshot.size} kayıt silindi.`);
}

async function migrateCategories() {
  console.log('\n📁 Kategoriler aktarılıyor...');
  
  for (const category of categories) {
    await addDoc(collection(db, 'categories'), {
      categoryId: category.id,
      name: category.name,
      icon: category.icon,
      image: category.image,
      description: category.description,
      createdAt: new Date()
    });
    console.log(`   ✅ ${category.name}`);
  }
  
  console.log(`\n✅ ${categories.length} kategori aktarıldı!`);
}

async function migrateProducts() {
  console.log('\n📦 Ürünler aktarılıyor...');
  
  for (const product of products) {
    await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log(`   ✅ ${product.name}`);
  }
  
  console.log(`\n✅ ${products.length} ürün aktarıldı!`);
}

async function main() {
  console.log('🚀 Firebase Migration Başlıyor...\n');
  console.log('=' .repeat(50));
  
  try {
    // Önce mevcut verileri temizle
    await clearCollection('categories');
    await clearCollection('products');
    
    // Sonra yeni verileri ekle
    await migrateCategories();
    await migrateProducts();
    
    console.log('\n' + '=' .repeat(50));
    console.log('🎉 Migration tamamlandı!');
    console.log('\nArtık products.js dosyasını silebilirsiniz.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Hata:', error);
    process.exit(1);
  }
}

main();
