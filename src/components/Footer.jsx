'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  HiOutlineMail, 
  HiOutlinePhone, 
  HiOutlineLocationMarker 
} from 'react-icons/hi';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaYoutube 
} from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-black border-t border-white/10">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="1001 Çarşı AVM"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-lg">1001 Çarşı</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Türkiye&apos;nin en güvenilir online alışveriş platformu. 
              Teknolojiden mobilyaya, binlerce ürün tek çatı altında.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Hızlı Linkler</h3>
            <ul className="space-y-2">
              {['Ana Sayfa', 'Kategoriler', 'Kampanyalar', 'Hakkımızda', 'İletişim'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {[
                { name: 'Teknoloji', href: '/kategori/teknoloji' },
                { name: 'Ev Eşyaları', href: '/kategori/ev-esyalari' },
                { name: 'Mobilya', href: '/kategori/mobilya' },
                { name: 'Bebek Ürünleri', href: '/kategori/bebek-urunleri' },
                { name: 'Beyaz Eşya', href: '/kategori/beyaz-esya' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-400">
                  İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  0850 123 45 67
                </span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineMail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <span className="text-sm text-gray-400">
                  info@1001carsi.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 1001 Çarşı AVM. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="#" className="hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

