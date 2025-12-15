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
    answer: '150 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Altındaki siparişlerde 29,90 TL kargo ücreti uygulanır.'
  },
  {
    question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
    answer: 'Kredi kartı, banka kartı, havale/EFT ve kapıda ödeme seçeneklerini kabul ediyoruz.'
  },
  {
    question: 'Siparişim ne zaman teslim edilir?',
    answer: 'Siparişleriniz genellikle 1-3 iş günü içinde teslim edilir. Büyük ürünler için teslimat süresi değişebilir.'
  }
];

const categories = [
  { icon: HiOutlineTruck, title: 'Kargo & Teslimat', color: 'bg-blue-500/20 text-blue-400' },
  { icon: HiOutlineRefresh, title: 'İade & Değişim', color: 'bg-green-500/20 text-green-400' },
  { icon: HiOutlineCreditCard, title: 'Ödeme', color: 'bg-purple-500/20 text-purple-400' },
  { icon: HiOutlineQuestionMarkCircle, title: 'Genel Sorular', color: 'bg-orange-500/20 text-orange-400' }
];

export default function SupportPage() {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [message, setMessage] = useState('');

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="px-4 py-8 text-center border-b border-white/10">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
          <HiOutlineChatAlt2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Nasıl Yardımcı Olabiliriz?</h1>
        <p className="text-gray-400">7/24 müşteri desteği</p>
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat, index) => (
            <motion.button
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-3`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm">{cat.title}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Sık Sorulan Sorular</h2>
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full p-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-sm pr-4">{faq.question}</span>
                <HiOutlineChevronDown 
                  className={`w-5 h-5 flex-shrink-0 transition-transform ${
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
                  <p className="text-sm text-gray-400">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Bize Ulaşın</h2>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-4">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Mesajınızı yazın..."
            rows={4}
            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl resize-none outline-none focus:border-white/30 transition-colors text-white placeholder-gray-500"
          />
          <button className="w-full h-12 bg-white text-black font-semibold rounded-xl">
            Gönder
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="px-4 py-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="tel:08501234567" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <HiOutlinePhone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Telefon</p>
              <p className="font-medium">0850 123 45 67</p>
            </div>
          </a>
          <a href="mailto:destek@1001carsi.com" className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <HiOutlineMail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">E-posta</p>
              <p className="font-medium">destek@1001carsi.com</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

