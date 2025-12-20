'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiOutlineChatAlt2,
  HiOutlineQuestionMarkCircle,
  HiOutlineTruck,
  HiOutlineRefresh,
  HiOutlineCreditCard,
  HiOutlineChevronDown,
  HiOutlinePhone,
  HiOutlineMail
} from 'react-icons/hi';
import { FaWhatsapp } from 'react-icons/fa';

const faqs = [
  {
    question: 'Siparişimi nasıl takip edebilirim?',
    answer: 'Siparişinizi "Hesabım" bölümünden veya size gönderilen e-postadaki takip linkinden takip edebilirsiniz.'
  },
  {
    question: 'İade ve değişim koşulları nelerdir?',
    answer: '14 gün içinde kullanılmamış ve orijinal ambalajında olan ürünleri iade edebilirsiniz. İade kargo ücreti ücretsizdir.'
  },
  {
    question: 'Kargo ücreti ne kadar?',
    answer: '2.000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Altındaki siparişlerde kargo ücreti ürüne göre değişir.'
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz. 12 aya varan taksit imkanı sunuyoruz.'
  },
  {
    question: 'Mobilya ürünlerinin teslimatı nasıl yapılır?',
    answer: 'Mobilya ürünlerimiz özel araçlarla adresinize teslim edilir. Kurulum hizmeti ekstra ücrete dahildir.'
  }
];

const categories = [
  { icon: HiOutlineTruck, title: 'Kargo & Teslimat', color: 'bg-blue-50 text-blue-600' },
  { icon: HiOutlineRefresh, title: 'İade & Değişim', color: 'bg-green-50 text-green-600' },
  { icon: HiOutlineCreditCard, title: 'Ödeme', color: 'bg-purple-50 text-purple-600' },
  { icon: HiOutlineQuestionMarkCircle, title: 'Genel Sorular', color: 'bg-amber-50 text-amber-600' }
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pb-8 pt-[10vh]">
      {/* Header */}
      <div className="bg-white px-4 py-8 text-center border-b border-gray-100">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
          <HiOutlineChatAlt2 className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Nasıl Yardımcı Olabiliriz?</h1>
        <p className="text-gray-500">7/24 müşteri desteği</p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="px-3 py-2 bg-white border border-gray-100 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                <cat.icon className="w-4 h-4" />
              </div>
              <span className="font-medium text-xs text-gray-900">{cat.title}</span>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp Contact */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Tüm sorularınız için WhatsApp üzerinden iletişime geçebilirsiniz
          </p>
          <a
            href="https://wa.me/905513545603"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 group"
          >
            <FaWhatsapp className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span className="text-md font-semibold tracking-wide">+90 551 354 56 03</span>
          </a>
        </div>
      </div>

      {/* FAQs */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Sık Sorulan Sorular</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-sm text-gray-900 pr-4">{faq.question}</span>
                <HiOutlineChevronDown 
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              {expandedFaq === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="px-4 pb-4"
                >
                  <p className="text-sm text-gray-500">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bize Ulaşın</h2>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-4 shadow-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            rows={4}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl resize-none outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all text-gray-900 placeholder-gray-400"
          />
          <button className="w-full h-12 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
            Gönder
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="tel:08501234567" className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <HiOutlinePhone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Telefon</p>
              <p className="font-medium text-gray-900">+90 551 354 56 03</p>
            </div>
          </a>
          <a href="mailto:destek@mobilya.com" className="flex-1 p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
              <HiOutlineMail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">E-posta</p>
              <p className="font-medium text-gray-900">destek@mobilya.com</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
