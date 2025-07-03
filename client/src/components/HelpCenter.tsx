import { useState } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Mail, 
  Phone, 
  ExternalLink,
  BookOpen,
  Shield,
  Settings,
  Heart,
  Users,
  Camera,
  Bell,
  Lock,
  Eye,
  Trash2,
  Download,
  Upload,
  Flag,
  X
} from 'lucide-react';

interface HelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  isOpen?: boolean;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: "Bagaimana cara membuat akun GenZ Social?",
    answer: "Untuk membuat akun, klik tombol 'Daftar' di halaman utama, masukkan email dan kata sandi yang kuat, kemudian verifikasi email Anda. Setelah verifikasi berhasil, Anda dapat mulai menggunakan GenZ Social.",
    category: "Akun"
  },
  {
    id: 2,
    question: "Bagaimana cara mengganti foto profil?",
    answer: "Pergi ke halaman Profil, klik foto profil Anda, pilih 'Edit Profil', kemudian klik pada foto profil dan pilih foto baru dari galeri atau ambil foto baru dengan kamera.",
    category: "Profil"
  },
  {
    id: 3,
    question: "Bagaimana cara mengatur privasi akun?",
    answer: "Buka Menu > Privasi & Keamanan. Di sini Anda dapat mengatur siapa yang dapat melihat profil Anda, mengirim pesan, dan berinteraksi dengan postingan Anda. Anda juga dapat memblokir pengguna tertentu.",
    category: "Privasi"
  },
  {
    id: 4,
    question: "Bagaimana cara menghapus postingan?",
    answer: "Pada postingan Anda, klik tombol tiga titik (⋯) di pojok kanan atas, kemudian pilih 'Hapus'. Konfirmasi untuk menghapus postingan secara permanen.",
    category: "Postingan"
  },
  {
    id: 5,
    question: "Bagaimana cara melaporkan konten yang tidak pantas?",
    answer: "Klik tombol tiga titik (⋯) pada postingan atau profil yang ingin dilaporkan, pilih 'Laporkan', kemudian pilih alasan pelaporan. Tim kami akan meninjau laporan Anda dalam 24 jam.",
    category: "Keamanan"
  },
  {
    id: 6,
    question: "Bagaimana cara mengunduh data saya?",
    answer: "Pergi ke Menu > Unduh Data, kemudian klik 'Minta Unduhan'. Anda akan menerima email dengan link unduhan dalam 2-3 hari kerja. Data akan tersedia untuk diunduh selama 30 hari.",
    category: "Data"
  },
  {
    id: 7,
    question: "Bagaimana cara mengaktifkan notifikasi?",
    answer: "Buka Menu > Notifikasi, kemudian atur preferensi notifikasi Anda. Anda dapat memilih jenis notifikasi yang ingin diterima dan waktu aktif notifikasi.",
    category: "Notifikasi"
  },
  {
    id: 8,
    question: "Bagaimana cara memblokir pengguna?",
    answer: "Pergi ke profil pengguna yang ingin diblokir, klik tombol tiga titik (⋯), kemudian pilih 'Blokir'. Pengguna yang diblokir tidak akan dapat melihat profil atau berinteraksi dengan Anda.",
    category: "Privasi"
  }
];

const categories = [
  { name: "Semua", icon: BookOpen, gradient: "from-blue-500 to-blue-600", bgPattern: "🌟" },
  { name: "Akun", icon: Users, gradient: "from-green-500 to-emerald-600", bgPattern: "👤" },
  { name: "Profil", icon: Camera, gradient: "from-purple-500 to-violet-600", bgPattern: "📸" },
  { name: "Privasi", icon: Shield, gradient: "from-red-500 to-rose-600", bgPattern: "🔒" },
  { name: "Postingan", icon: Heart, gradient: "from-pink-500 to-rose-600", bgPattern: "💝" },
  { name: "Keamanan", icon: Lock, gradient: "from-orange-500 to-amber-600", bgPattern: "🛡️" },
  { name: "Data", icon: Download, gradient: "from-indigo-500 to-blue-600", bgPattern: "📊" },
  { name: "Notifikasi", icon: Bell, gradient: "from-yellow-500 to-orange-500", bgPattern: "🔔" }
];

export default function HelpCenter({ isOpen, onClose }: HelpCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the contact form
    alert('Pesan Anda telah dikirim! Tim support kami akan menghubungi Anda dalam 1-2 hari kerja.');
    setShowContactForm(false);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative border-b border-gray-200/50 dark:border-gray-700/50 p-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-4 left-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 right-8 w-24 h-24 bg-purple-300/20 rounded-full blur-lg"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-blue-300/10 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🎯</span>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Pusat Bantuan GenZ</h2>
                  <p className="text-blue-100 text-sm">Temukan jawaban untuk semua pertanyaan Anda</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/20 backdrop-blur-sm rounded-xl transition-all duration-300 hover:scale-105"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl">
              <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-white/70" />
                <input
                  type="text"
                  placeholder="🔍 Cari pertanyaan, topik, atau kata kunci..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-6 py-4 bg-transparent text-white placeholder-white/70 border-2 border-white/30 rounded-2xl focus:outline-none focus:border-white/60 backdrop-blur-sm transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={16} className="text-white/70" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Categories Sidebar */}
            <div className="w-80 border-r border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
              <div className="mb-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Kategori Bantuan
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pilih kategori untuk bantuan spesifik</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                        selectedCategory === category.name
                          ? 'ring-2 ring-blue-500 shadow-lg transform scale-105'
                          : 'hover:shadow-md'
                      }`}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-90`}></div>
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                      <div className="relative z-10 text-center">
                        <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                          <Icon size={20} className="text-white drop-shadow-sm" />
                        </div>
                        <div className="text-2xl mb-1">{category.bgPattern}</div>
                        <span className="text-xs font-semibold text-white drop-shadow-sm">{category.name}</span>
                      </div>
                      {selectedCategory === category.name && (
                        <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-lg"></div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h4 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  🚀 Bantuan Langsung
                </h4>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full group relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                    <div className="relative flex items-center space-x-3 text-white">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <MessageCircle size={18} />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-sm">Chat dengan Support</div>
                        <div className="text-xs opacity-90">Respons cepat 24/7</div>
                      </div>
                    </div>
                  </button>
                  
                  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <Mail size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">help@genz.social</span>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-700 dark:text-gray-300">
                        <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <Phone size={12} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">+62 21 1234 5678</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 p-8 bg-gradient-to-br from-white/80 to-blue-50/80 dark:from-gray-900/80 dark:to-gray-800/80 backdrop-blur-sm">
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 dark:from-white dark:to-blue-300 bg-clip-text text-transparent">
                      FAQ & Bantuan
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      💡 Temukan jawaban cepat untuk pertanyaan umum
                    </p>
                  </div>
                </div>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center">
                    <BookOpen size={32} className="text-gray-500" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tidak ada hasil ditemukan
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Coba kata kunci lain untuk pencarian "{searchTerm}" atau pilih kategori berbeda
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq, index) => (
                    <div
                      key={faq.id}
                      className="group relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="relative w-full px-6 py-5 text-left transition-all duration-300 flex items-center justify-between group-hover:bg-white/50 dark:group-hover:bg-gray-800/50"
                      >
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-lg">{categories.find(cat => cat.name === faq.category)?.bgPattern || '❓'}</span>
                            <span className="text-xs font-semibold px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                              {faq.category}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-base leading-relaxed">
                            {faq.question}
                          </h4>
                        </div>
                        <div className={`flex-shrink-0 p-2 rounded-full transition-all duration-300 ${
                          expandedItems.includes(faq.id) 
                            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                        }`}>
                          {expandedItems.includes(faq.id) ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </div>
                      </button>
                      {expandedItems.includes(faq.id) && (
                        <div className="relative border-t border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20">
                          <div className="px-6 py-5">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-white text-sm">💡</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
                                {faq.answer}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Hubungi Support</h3>
                <button
                  onClick={() => setShowContactForm(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nama
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pesan
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Kirim Pesan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}