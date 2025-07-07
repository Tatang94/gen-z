import { useState } from 'react';
import { useLocation } from 'wouter';
import SettingsModal from '../components/SettingsModal';
import HelpCenter from '../components/HelpCenter';
import AccountManager from '../components/AccountManager';
import { 
  Settings, 
  Moon, 
  Sun, 
  Bell, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight,
  User,
  Heart,
  Bookmark,
  Clock,
  Users,
  Star,
  Download,
  Share2,
  X
} from 'lucide-react';

export default function MorePage() {
  const [, setLocation] = useLocation();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') !== 'false';
  });
  const [showModal, setShowModal] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelpCenter, setShowHelpCenter] = useState(false);
  const [showAccountManager, setShowAccountManager] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Show feedback
    const message = newDarkMode ? 'Mode gelap diaktifkan' : 'Mode terang diaktifkan';
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg z-50 transition-opacity';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
  };

  const handleEditProfile = () => {
    setShowAccountManager(true);
  };

  const handleYourActivity = () => {
    setShowModal('activity');
  };

  const handleSaved = () => {
    // Show saved posts modal
    setShowModal('saved');
  };

  const handleArchive = () => {
    setShowModal('archive');
  };

  const handleCloseFriends = () => {
    setShowModal('closeFriends');
  };

  const handleFavorites = () => {
    setShowModal('favorites');
  };

  const handleNotifications = () => {
    const newNotifications = !notifications;
    setNotifications(newNotifications);
    localStorage.setItem('notifications', newNotifications.toString());
    
    // Show feedback
    const message = newNotifications ? 'Notifikasi diaktifkan' : 'Notifikasi dinonaktifkan';
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-black text-white px-4 py-2 rounded-lg z-50 transition-opacity';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2000);
    
    // Simulate requesting notification permission
    if (newNotifications && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('GenZ Social', {
            body: 'Notifikasi berhasil diaktifkan!',
            icon: '/favicon.ico'
          });
        }
      });
    }
  };

  const handlePrivacy = () => {
    setShowModal('privacy');
  };

  const handleSettings = () => {
    setShowSettings(true);
  };

  const handleHelp = () => {
    setShowHelpCenter(true);
  };

  const handleAbout = () => {
    setShowModal('about');
  };

  const handleDownloadData = () => {
    // Create a mock data file for download
    const userData = {
      profile: {
        username: 'sarah_chen',
        displayName: 'Sarah Chen',
        email: 'sarah@example.com',
        joinDate: '2024-01-01',
        postsCount: 42,
        followers: 128,
        following: 89
      },
      posts: [],
      comments: [],
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `genz_social_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert('Data Anda telah berhasil diunduh!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GenZ Social',
        text: 'Join me on GenZ Social - the coolest social media app!',
        url: window.location.origin
      });
    } else {
      setShowModal('share');
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.clear();
    setLocation('/');
    setShowLogoutConfirm(false);
  };

  const menuSections = [
    {
      title: 'Akun',
      items: [
        { icon: User, label: 'Edit Profil', action: handleEditProfile },
        { icon: Heart, label: 'Aktivitas Anda', action: handleYourActivity },
        { icon: Bookmark, label: 'Tersimpan', action: handleSaved },
        { icon: Clock, label: 'Arsip', action: handleArchive },
        { icon: Users, label: 'Teman Dekat', action: handleCloseFriends },
        { icon: Star, label: 'Favorit', action: handleFavorites }
      ]
    },
    {
      title: 'Pengaturan',
      items: [
        { 
          icon: isDarkMode ? Sun : Moon, 
          label: 'Mode Gelap', 
          action: toggleDarkMode,
          toggle: true,
          enabled: isDarkMode
        },
        { 
          icon: Bell, 
          label: 'Notifikasi', 
          action: handleNotifications,
          toggle: true,
          enabled: notifications
        },
        { icon: Shield, label: 'Privasi & Keamanan', action: handlePrivacy },
        { icon: Settings, label: 'Pengaturan Umum', action: handleSettings }
      ]
    },
    {
      title: 'Bantuan',
      items: [
        { icon: HelpCircle, label: 'Pusat Bantuan', action: handleHelp },
        { icon: Info, label: 'Tentang GenZ', action: handleAbout },
        { icon: Download, label: 'Unduh Data', action: handleDownloadData },
        { icon: Share2, label: 'Bagikan App', action: handleShare }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Menu</h1>
      </div>

      {/* Profile Quick Access */}
      <div className="bg-white dark:bg-gray-800 p-4 mb-4">
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Sarah Chen</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">@sarah_chen</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Lihat profil Anda</p>
          </div>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="space-y-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white dark:bg-gray-800">
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                return (
                  <button
                    key={itemIndex}
                    onClick={item.action}
                    className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} className="text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{item.label}</span>
                    </div>
                    
                    {item.toggle ? (
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors ${
                        item.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          item.enabled ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </div>
                    ) : (
                      <ChevronRight size={20} className="text-gray-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 mt-4 p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">G</span>
          </div>
          <h3 className="font-semibold text-gray-900 dark:text-white">GenZ Social</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Versi 1.0.0</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            © 2025 GenZ. Semua hak dilindungi.
          </p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="bg-white dark:bg-gray-800 mt-4">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-4 flex items-center justify-center space-x-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>

      {/* Modal Dialogs */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {showModal === 'activity' && 'Aktivitas Anda'}
                {showModal === 'archive' && 'Arsip'}
                {showModal === 'closeFriends' && 'Teman Dekat'}
                {showModal === 'favorites' && 'Favorit'}
                {showModal === 'saved' && 'Postingan Tersimpan'}
                {showModal === 'privacy' && 'Privasi & Keamanan'}
                {showModal === 'settings' && 'Pengaturan Umum'}
                {showModal === 'help' && 'Pusat Bantuan'}
                {showModal === 'about' && 'Tentang GenZ'}
                {showModal === 'downloadData' && 'Unduh Data'}
                {showModal === 'share' && 'Bagikan App'}
              </h3>
              <button
                onClick={() => setShowModal(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-gray-600 dark:text-gray-400">
              {showModal === 'activity' && (
                <div>
                  <p>Lihat semua aktivitas Anda di GenZ Social:</p>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Aktivitas Terbaru</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Postingan disukai</span>
                          <span className="text-blue-600">23 hari ini</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Komentar dibuat</span>
                          <span className="text-blue-600">8 hari ini</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Profil dikunjungi</span>
                          <span className="text-blue-600">12 hari ini</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pencarian dilakukan</span>
                          <span className="text-blue-600">15 hari ini</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Pencarian Terbaru</h4>
                      <div className="space-y-1 text-sm">
                        <div>• "resep viral tiktok"</div>
                        <div>• "outfit casual 2025"</div>
                        <div>• "tips fotografi"</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {showModal === 'archive' && (
                <div>
                  <p>Arsip berisi postingan yang Anda sembunyikan dari profil. Postingan yang diarsipkan hanya dapat dilihat oleh Anda.</p>
                  <p className="mt-3 text-sm">Belum ada postingan yang diarsipkan.</p>
                </div>
              )}
              
              {showModal === 'closeFriends' && (
                <div>
                  <p>Teman dekat adalah orang-orang yang paling dekat dengan Anda di GenZ Social. Mereka akan melihat konten khusus yang Anda bagikan.</p>
                  <p className="mt-3 text-sm">Belum ada teman dekat yang dipilih.</p>
                </div>
              )}
              
              {showModal === 'saved' && (
                <div>
                  <p>Postingan yang telah Anda simpan untuk dibaca nanti.</p>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">SC</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tips fotografi untuk Gen Z</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">2 hari yang lalu</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">JD</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Resep masakan viral TikTok</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">1 minggu yang lalu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {showModal === 'favorites' && (
                <div>
                  <p>Postingan dan konten favorit Anda akan disimpan di sini untuk akses mudah.</p>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">⭐</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Playlist musik favorit bulan ini</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Ditandai 3 hari yang lalu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {showModal === 'privacy' && (
                <div>
                  <p>Kelola pengaturan privasi dan keamanan akun Anda:</p>
                  <ul className="mt-3 space-y-2">
                    <li>• Visibilitas profil</li>
                    <li>• Kontrol pesan</li>
                    <li>• Blokir pengguna</li>
                    <li>• Autentikasi dua faktor</li>
                  </ul>
                </div>
              )}
              
              {showModal === 'settings' && (
                <div>
                  <p>Pengaturan umum aplikasi:</p>
                  <ul className="mt-3 space-y-2">
                    <li>• Bahasa</li>
                    <li>• Kualitas media</li>
                    <li>• Autoplay video</li>
                    <li>• Penggunaan data</li>
                  </ul>
                </div>
              )}
              
              {showModal === 'help' && (
                <div>
                  <p>Butuh bantuan? Kami siap membantu Anda:</p>
                  <ul className="mt-3 space-y-2">
                    <li>• FAQ</li>
                    <li>• Panduan penggunaan</li>
                    <li>• Hubungi support</li>
                    <li>• Laporkan masalah</li>
                  </ul>
                </div>
              )}
              
              {showModal === 'about' && (
                <div>
                  <p><strong>GenZ Social v1.0.0</strong></p>
                  <p className="mt-2">Platform media sosial yang dirancang khusus untuk generasi Z dengan fitur-fitur modern dan antarmuka yang intuitif.</p>
                  <p className="mt-3 text-sm">© 2025 GenZ Social. Semua hak dilindungi.</p>
                </div>
              )}
              
              {showModal === 'downloadData' && (
                <div>
                  <p>Unduh salinan data Anda termasuk:</p>
                  <ul className="mt-3 space-y-2">
                    <li>• Postingan dan komentar</li>
                    <li>• Foto dan video</li>
                    <li>• Informasi profil</li>
                    <li>• Daftar teman</li>
                  </ul>
                  <p className="mt-3 text-sm">Proses ini dapat memakan waktu beberapa menit.</p>
                </div>
              )}
              
              {showModal === 'share' && (
                <div>
                  <p>Bagikan GenZ Social dengan teman-teman Anda!</p>
                  <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-mono break-all">{window.location.origin}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.origin);
                        alert('Link berhasil disalin!');
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Salin Link
                    </button>
                    <button
                      onClick={() => {
                        const text = `Ayo join GenZ Social! Platform media sosial terbaru dan terkeren untuk generasi Z. ${window.location.origin}`;
                        if (navigator.share) {
                          navigator.share({
                            title: 'GenZ Social',
                            text: text,
                            url: window.location.origin
                          });
                        } else {
                          navigator.clipboard.writeText(text);
                          alert('Pesan berhasil disalin! Bagikan ke media sosial lain.');
                        }
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Bagikan Sekarang
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Konfirmasi Keluar
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Apakah Anda yakin ingin keluar dari akun Anda?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />

      {/* Help Center */}
      <HelpCenter
        isOpen={showHelpCenter}
        onClose={() => setShowHelpCenter(false)}
      />

      {/* Account Manager */}
      <AccountManager
        isOpen={showAccountManager}
        onClose={() => setShowAccountManager(false)}
      />
    </div>
  );
}