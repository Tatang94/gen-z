import React, { useState, useEffect } from 'react';
import { Users, FileText, ArrowLeft, Trash2, Eye, Shield, TrendingUp, Activity, AlertTriangle, Settings, Ban, CheckCircle, XCircle, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { User, Post } from '../types';

interface AdminDashboardProps {
  onBackToHome: () => void;
  users: User[];
  posts: Post[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToHome, users, posts }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    reportedPosts: 0,
    blockedUsers: 0
  });

  useEffect(() => {
    setStats({
      totalUsers: users.length,
      totalPosts: posts.length,
      activeUsers: users.filter(u => u.isOnline).length,
      verifiedUsers: users.filter(u => u.isVerified).length,
      reportedPosts: Math.floor(posts.length * 0.1),
      blockedUsers: Math.floor(users.length * 0.02)
    });
  }, [users, posts]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'verified' && user.isVerified) ||
                         (filterType === 'online' && user.isOnline) ||
                         (filterType === 'offline' && !user.isOnline);
    return matchesSearch && matchesFilter;
  });

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      // Implement delete user logic here
      console.log('Deleting user:', userId);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus postingan ini?')) {
      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleBanUser = async (userId: string) => {
    if (window.confirm('Apakah Anda yakin ingin memblokir pengguna ini?')) {
      // Implement ban user logic here
      console.log('Banning user:', userId);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'posts', label: 'Postingan', icon: FileText },
    { id: 'reports', label: 'Laporan', icon: AlertTriangle },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Kembali ke Beranda</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <RefreshCw className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Pengguna</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <FileText className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Postingan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <Activity className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pengguna Aktif</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pengguna Terverifikasi</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Laporan</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.reportedPosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <Ban className="w-8 h-8 text-red-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pengguna Diblokir</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.blockedUsers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Aktivitas Terbaru</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {posts.slice(0, 5).map((post, index) => (
                    <div key={post.id} className="flex items-center space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{post.user.displayName}</span> membuat postingan baru
                        </p>
                        <p className="text-xs text-gray-500">{new Date(post.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari pengguna..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-400" />
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Semua Pengguna</option>
                    <option value="verified">Terverifikasi</option>
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Manajemen Pengguna ({filteredUsers.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengguna
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Followers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bergabung
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.slice(0, 20).map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-10 w-10 rounded-full object-cover" src={user.avatar} alt="" />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 flex items-center">
                                {user.displayName}
                                {user.isVerified && <CheckCircle className="w-4 h-4 text-blue-500 ml-1" />}
                              </div>
                              <div className="text-sm text-gray-500">{user.bio}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          @{user.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.isOnline ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.followers.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.joinDate).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleBanUser(user.id)}
                              className="text-orange-600 hover:text-orange-900"
                              title="Blokir Pengguna"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus Pengguna"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari postingan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Manajemen Postingan ({filteredPosts.length})</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pengguna
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Konten
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Media
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Likes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Komentar
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waktu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPosts.slice(0, 20).map((post) => (
                      <tr key={post.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img className="h-8 w-8 rounded-full object-cover" src={post.user.avatar} alt="" />
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{post.user.displayName}</div>
                              <div className="text-sm text-gray-500">@{post.user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs">
                            {post.content ? (
                              <span className="line-clamp-2">{post.content}</span>
                            ) : (
                              <span className="text-gray-400 italic">Tidak ada teks</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            {post.image && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Eye className="w-3 h-3 mr-1" />
                                Foto
                              </span>
                            )}
                            {post.music && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                <Activity className="w-3 h-3 mr-1" />
                                Musik
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.likes}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {post.comments.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString('id-ID')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => window.open(`/post/${post.id}`, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Lihat Postingan"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePost(post.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Hapus Postingan"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Laporan & Moderasi</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Laporan Konten</h3>
                  <p className="text-sm text-gray-600 mb-4">Kelola laporan konten yang tidak pantas</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Spam</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Konten Tidak Pantas</span>
                      <span className="font-medium">8</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pelecehan</span>
                      <span className="font-medium">3</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Laporan Pengguna</h3>
                  <p className="text-sm text-gray-600 mb-4">Kelola laporan terhadap pengguna</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Akun Palsu</span>
                      <span className="font-medium">5</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pelecehan</span>
                      <span className="font-medium">7</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Pelanggaran Lainnya</span>
                      <span className="font-medium">2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-medium text-gray-900 mb-4">Laporan Terbaru</h3>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Laporan Spam</p>
                        <p className="text-sm text-gray-600">Postingan dilaporkan sebagai spam oleh 3 pengguna</p>
                        <p className="text-xs text-gray-500">2 jam yang lalu</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm text-green-600 hover:text-green-800">
                        Tolak
                      </button>
                      <button className="px-3 py-1 text-sm text-red-600 hover:text-red-800">
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pengaturan Sistem</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Pengaturan Aplikasi</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Registrasi Pengguna Baru</label>
                        <p className="text-sm text-gray-500">Izinkan pengguna baru untuk mendaftar</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Verifikasi Email</label>
                        <p className="text-sm text-gray-500">Wajibkan verifikasi email untuk pengguna baru</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-700">Mode Pemeliharaan</label>
                        <p className="text-sm text-gray-500">Nonaktifkan akses untuk pemeliharaan sistem</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Pengaturan Konten</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Batas Karakter Postingan
                      </label>
                      <input
                        type="number"
                        defaultValue="280"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ukuran Maksimal File Upload (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;