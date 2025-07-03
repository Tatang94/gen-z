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
  { name: "Semua", icon: BookOpen, color: "bg-blue-500" },
  { name: "Akun", icon: Users, color: "bg-green-500" },
  { name: "Profil", icon: Camera, color: "bg-purple-500" },
  { name: "Privasi", icon: Shield, color: "bg-red-500" },
  { name: "Postingan", icon: Heart, color: "bg-pink-500" },
  { name: "Keamanan", icon: Lock, color: "bg-orange-500" },
  { name: "Data", icon: Download, color: "bg-indigo-500" },
  { name: "Notifikasi", icon: Bell, color: "bg-yellow-500" }
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
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pusat Bantuan</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari bantuan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="flex">
            {/* Categories Sidebar */}
            <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Kategori</h3>
              <div className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.name}
                      onClick={() => setSelectedCategory(category.name)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.name
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${category.color} flex items-center justify-center`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Bantuan Cepat</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">Hubungi Support</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Mail size={16} />
                    <span className="text-sm">Email: help@genz.social</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    <Phone size={16} />
                    <span className="text-sm">Tel: +62 21 1234 5678</span>
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Pertanyaan yang Sering Diajukan
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Temukan jawaban untuk pertanyaan umum tentang GenZ Social
                </p>
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Tidak ada hasil yang ditemukan untuk pencarian "{searchTerm}"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFAQs.map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleExpanded(faq.id)}
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {faq.question}
                          </h4>
                          <span className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                            {faq.category}
                          </span>
                        </div>
                        {expandedItems.includes(faq.id) ? (
                          <ChevronUp size={20} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={20} className="text-gray-500" />
                        )}
                      </button>
                      {expandedItems.includes(faq.id) && (
                        <div className="px-6 pb-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                            {faq.answer}
                          </p>
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