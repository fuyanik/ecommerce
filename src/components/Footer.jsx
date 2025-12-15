'use client';

import Link from 'next/link';
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
    <footer className="bg-white border-t border-gray-100">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-400 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">M</span>
              </div>
              <div>
                <span className="font-bold text-lg text-gray-900">Mobilya</span>
                <span className="text-xs text-gray-500 block">EV & DEKOR</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Eviniz için en kaliteli mobilya ve beyaz eşya ürünleri.
              Güvenilir alışveriş, hızlı teslimat.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaYoutube].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-500 hover:text-white text-gray-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kurumsal</h3>
            <ul className="space-y-2">
              {['Hakkımızda', 'Kariyer', 'Blog', 'Basın', 'İletişim'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Kategoriler</h3>
            <ul className="space-y-2">
              {[
                { name: 'Koltuk Takımları', href: '/kategori/koltuk-takimi' },
                { name: 'Yatak Odası', href: '/kategori/yatak-odasi' },
                { name: 'Yemek Odası', href: '/kategori/yemek-odasi' },
                { name: 'Beyaz Eşya', href: '/kategori/beyaz-esya' },
                { name: 'Küçük Ev Aletleri', href: '/kategori/kucuk-ev-aletleri' },
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-red-500 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">İletişim</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <HiOutlineLocationMarker className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-500">
                  İstanbul, Türkiye
                </span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlinePhone className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-500">
                  0850 123 45 67
                </span>
              </li>
              <li className="flex items-center gap-2">
                <HiOutlineMail className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-500">
                  info@mobilya.com
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © 2024 Mobilya Ev & Dekor. Tüm hakları saklıdır.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
              <Link href="#" className="hover:text-red-500 transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="#" className="hover:text-red-500 transition-colors">
                Kullanım Koşulları
              </Link>
              <Link href="#" className="hover:text-red-500 transition-colors">
                KVKK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
