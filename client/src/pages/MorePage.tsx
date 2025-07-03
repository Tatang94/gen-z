import { useState } from 'react';
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
  Share2
} from 'lucide-react';

export default function MorePage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuSections = [
    {
      title: 'Akun',
      items: [
        { icon: User, label: 'Edit Profil', action: () => console.log('Edit Profile') },
        { icon: Heart, label: 'Aktivitas Anda', action: () => console.log('Your Activity') },
        { icon: Bookmark, label: 'Tersimpan', action: () => console.log('Saved') },
        { icon: Clock, label: 'Arsip', action: () => console.log('Archive') },
        { icon: Users, label: 'Teman Dekat', action: () => console.log('Close Friends') },
        { icon: Star, label: 'Favorit', action: () => console.log('Favorites') }
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
          action: () => setNotifications(!notifications),
          toggle: true,
          enabled: notifications
        },
        { icon: Shield, label: 'Privasi & Keamanan', action: () => console.log('Privacy') },
        { icon: Settings, label: 'Pengaturan Umum', action: () => console.log('General Settings') }
      ]
    },
    {
      title: 'Bantuan',
      items: [
        { icon: HelpCircle, label: 'Pusat Bantuan', action: () => console.log('Help Center') },
        { icon: Info, label: 'Tentang GenZ', action: () => console.log('About') },
        { icon: Download, label: 'Unduh Data', action: () => console.log('Download Data') },
        { icon: Share2, label: 'Bagikan App', action: () => console.log('Share App') }
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
          onClick={() => console.log('Logout')}
          className="w-full px-4 py-4 flex items-center justify-center space-x-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Keluar</span>
        </button>
      </div>
    </div>
  );
}