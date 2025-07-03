import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Globe, 
  Edit3, 
  Camera, 
  Save, 
  X,
  Eye,
  EyeOff,
  Shield,
  Check,
  AlertCircle,
  Lock,
  Smartphone,
  Key
} from 'lucide-react';

interface AccountManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  email: string;
  phone: string;
  bio: string;
  location: string;
  website: string;
  avatar: string;
  joinDate: string;
  isVerified: boolean;
  isPrivate: boolean;
  followers: number;
  following: number;
  postsCount: number;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  sessionTimeout: number;
  trustedDevices: string[];
}

export default function AccountManager({ isOpen, onClose }: AccountManagerProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'privacy'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    username: 'sarah_chen',
    displayName: 'Sarah Chen',
    email: 'sarah.chen@gmail.com',
    phone: '+62 812 3456 7890',
    bio: 'UI/UX Designer | Coffee lover ☕ | Currently working on amazing projects',
    location: 'Jakarta, Indonesia',
    website: 'https://sarahchen.design',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    joinDate: '2024-01-15',
    isVerified: true,
    isPrivate: false,
    followers: 1254,
    following: 892,
    postsCount: 47
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30,
    trustedDevices: ['iPhone 15 Pro', 'MacBook Pro']
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    if (isOpen) {
      setEditForm(profile);
    }
  }, [isOpen, profile]);

  const handleSaveProfile = async () => {
    try {
      if (!editForm.displayName.trim() || !editForm.email.trim()) {
        alert('Nama dan email harus diisi!');
        return;
      }
      
      setProfile(editForm);
      setIsEditing(false);
      
      localStorage.setItem('userProfile', JSON.stringify(editForm));
      alert('Profil berhasil diperbarui!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Gagal memperbarui profil!');
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      alert('Password minimal 8 karakter!');
      return;
    }
    
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setShowPasswordChange(false);
    alert('Password berhasil diubah!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setEditForm({
            ...editForm,
            avatar: e.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggle2FA = () => {
    setSecurity({
      ...security,
      twoFactorEnabled: !security.twoFactorEnabled
    });
    alert(`2FA ${!security.twoFactorEnabled ? 'diaktifkan' : 'dinonaktifkan'}!`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-t-3xl md:rounded-2xl w-full md:max-w-4xl h-[95vh] md:max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            Kelola Akun
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row h-full">
          {/* Tab Navigation - Mobile Horizontal, Desktop Vertical */}
          <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700">
            <nav className="flex md:flex-col p-3 md:p-4 space-x-3 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-shrink-0 md:w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <User className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                <span className="text-sm md:text-base">Profil</span>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`flex-shrink-0 md:w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Shield className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                <span className="text-sm md:text-base">Keamanan</span>
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-shrink-0 md:w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === 'privacy'
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Lock className="w-4 h-4 md:w-5 md:h-5 mr-2 md:mr-3" />
                <span className="text-sm md:text-base">Privasi</span>
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto max-h-[calc(95vh-140px)] md:max-h-[calc(90vh-80px)]">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Informasi Profil
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? 'Batal' : 'Edit'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={isEditing ? editForm.avatar : profile.avatar}
                      alt="Avatar"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover"
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 p-1.5 sm:p-2 bg-blue-600 text-white rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {profile.displayName}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">@{profile.username}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-2">
                      <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                      <span className="text-xs sm:text-sm text-gray-500">
                        Bergabung sejak {new Date(profile.joinDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                  <div className="space-y-3 md:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nama Lengkap
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.displayName}
                          onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.displayName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Nomor Telepon
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.bio}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Lokasi
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.location}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Website
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={editForm.website}
                          onChange={(e) => setEditForm({...editForm, website: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
                        />
                      ) : (
                        <p className="text-gray-900 dark:text-white">{profile.website}</p>
                      )}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="w-full sm:w-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="w-full sm:w-auto flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Keamanan Akun
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 mr-3 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Autentikasi Dua Faktor
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Tambahkan lapisan keamanan ekstra
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggle2FA}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        security.twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-3 text-green-600" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Notifikasi Login
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Beri tahu saya saat ada login baru
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSecurity({...security, loginNotifications: !security.loginNotifications})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        security.loginNotifications ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          security.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Ubah Password
                      </h4>
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {showPasswordChange ? 'Tutup' : 'Ubah'}
                      </button>
                    </div>
                    
                    {showPasswordChange && (
                      <form onSubmit={handlePasswordChange} className="space-y-3">
                        <input
                          type="password"
                          placeholder="Password saat ini"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Password baru"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <input
                          type="password"
                          placeholder="Konfirmasi password baru"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Ubah Password
                        </button>
                      </form>
                    )}
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Perangkat Terpercaya
                    </h4>
                    <div className="space-y-2">
                      {security.trustedDevices.map((device, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-2 text-gray-500" />
                            <span className="text-sm text-gray-900 dark:text-white">{device}</span>
                          </div>
                          <span className="text-xs text-green-600 dark:text-green-400">Aktif</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pengaturan Privasi
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Akun Privat
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Hanya follower yang dapat melihat konten Anda
                      </p>
                    </div>
                    <button
                      onClick={() => setProfile({...profile, isPrivate: !profile.isPrivate})}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        profile.isPrivate ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                          profile.isPrivate ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                      Kontrol Data
                    </h4>
                    <div className="space-y-2">
                      <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900 dark:text-white">Download Data Saya</span>
                          <span className="text-xs text-blue-600 dark:text-blue-400">Unduh</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900 dark:text-white">Hapus Riwayat Pencarian</span>
                          <span className="text-xs text-red-600 dark:text-red-400">Hapus</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-900 dark:text-white">Deaktivasi Akun</span>
                          <span className="text-xs text-red-600 dark:text-red-400">Deaktivasi</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}