import React, { useState, useEffect } from 'react';
import { Users, FileText, ArrowLeft, Trash2, Eye, Shield, TrendingUp, Activity, AlertTriangle, Settings, Ban, CheckCircle, XCircle, Search, Filter, Download, RefreshCw, Home, BarChart3, UserCheck, Mail, Calendar, Globe, Menu, X } from 'lucide-react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      console.log('Banning user:', userId);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Pengguna', icon: Users },
    { id: 'posts', label: 'Postingan', icon: FileText },
    { id: 'reports', label: 'Laporan', icon: AlertTriangle },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <button
                onClick={onBackToHome}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm hidden sm:inline">Kembali</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block" />
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-600 hidden lg:inline">
                <Calendar className="w-4 h-4 inline mr-1" />
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'short', 
                  day: 'numeric',
                  month: 'short'
                })}
              </span>
              <button className="text-gray-600 hover:text-gray-900 p-2">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* AdminLTE Style Sidebar */}
        <aside className={`
          bg-gray-900 w-64 min-h-screen shadow-lg z-50 transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static fixed inset-y-0 left-0
        `}>
          {/* Brand Logo */}
          <div className="bg-gray-800 p-4 border-b border-gray-700">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-white text-lg font-semibold">
                GenZ Admin
              </span>
            </div>
          </div>

          {/* Admin User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-white text-sm font-medium">Administrator</div>
                <div className="text-gray-400 text-xs">Online</div>
              </div>
            </div>
          </div>

          {/* Sidebar Menu */}
          <nav className="mt-2">
            <ul className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white border-r-3 border-blue-400'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Content Wrapper */}
        <div className="flex-1 md:ml-0 w-full">
          {/* Content Header */}
          <section className="bg-white border-b">
            <div className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                    {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                  </h1>
                  <nav className="text-sm text-gray-600 mt-1">
                    <span>Admin</span>
                    <span className="mx-2">/</span>
                    <span className="text-blue-600">
                      {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
                    </span>
                  </nav>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700">
                    <Download className="w-4 h-4 inline mr-1" />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="p-3 sm:p-6">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalUsers}</div>
                        <div className="text-blue-100 text-sm sm:text-base">Total Pengguna</div>
                      </div>
                      <Users className="w-8 h-8 sm:w-12 sm:h-12 text-blue-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.totalPosts}</div>
                        <div className="text-green-100 text-sm sm:text-base">Total Postingan</div>
                      </div>
                      <FileText className="w-8 h-8 sm:w-12 sm:h-12 text-green-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.activeUsers}</div>
                        <div className="text-purple-100 text-sm sm:text-base">Pengguna Aktif</div>
                      </div>
                      <Activity className="w-8 h-8 sm:w-12 sm:h-12 text-purple-200" />
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg text-white p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold">{stats.reportedPosts}</div>
                        <div className="text-orange-100 text-sm sm:text-base">Laporan</div>
                      </div>
                      <AlertTriangle className="w-8 h-8 sm:w-12 sm:h-12 text-orange-200" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                  <div className="bg-white rounded-lg shadow border">
                    <div className="border-b px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-800">Aktivitas Terbaru</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {posts.slice(0, 5).map((post, index) => (
                          <div key={post.id} className="flex items-center space-x-4">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
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

                  <div className="bg-white rounded-lg shadow border">
                    <div className="border-b px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-800">Statistik Cepat</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pengguna Terverifikasi</span>
                          <span className="font-semibold">{stats.verifiedUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Postingan Hari Ini</span>
                          <span className="font-semibold">{Math.floor(stats.totalPosts * 0.1)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Pengguna Diblokir</span>
                          <span className="font-semibold">{stats.blockedUsers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tingkat Pertumbuhan</span>
                          <span className="font-semibold text-green-600">+12%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                {/* Search and Filter */}
                <div className="bg-white rounded-lg shadow border p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-gray-400" />
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="all">Semua</option>
                        <option value="verified">Terverifikasi</option>
                        <option value="online">Online</option>
                        <option value="offline">Offline</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-lg shadow border overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Manajemen Pengguna ({filteredUsers.length})</h2>
                  </div>
                  <div className="overflow-x-auto min-w-full">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pengguna
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Username
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                            Followers
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Bergabung
                          </th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.slice(0, 20).map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover" src={user.avatar} alt="" />
                                <div className="ml-2 sm:ml-4">
                                  <div className="text-sm font-medium text-gray-900 flex items-center">
                                    <span className="truncate max-w-24 sm:max-w-none">{user.displayName}</span>
                                    {user.isVerified && <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 ml-1" />}
                                  </div>
                                  <div className="text-xs sm:text-sm text-gray-500 truncate max-w-20 sm:max-w-xs sm:block hidden">
                                    {user.bio}
                                  </div>
                                  <div className="text-xs text-gray-500 sm:hidden">
                                    @{user.username}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 hidden sm:table-cell">
                              @{user.username}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                user.isOnline ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.isOnline ? 'Online' : 'Offline'}
                              </span>
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                              {user.followers.toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {new Date(user.joinDate).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-1 sm:space-x-2">
                                <button
                                  onClick={() => handleBanUser(user.id)}
                                  className="text-orange-600 hover:text-orange-900 p-1"
                                  title="Blokir Pengguna"
                                >
                                  <Ban className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Hapus Pengguna"
                                >
                                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
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
                <div className="bg-white rounded-lg shadow border p-6">
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
                <div className="bg-white rounded-lg shadow border overflow-hidden">
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
                <div className="bg-white rounded-lg shadow border p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Laporan & Moderasi</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Laporan Konten</h3>
                      <p className="text-sm text-gray-600 mb-4">Kelola laporan konten yang tidak pantas</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Spam</span>
                          <span className="font-medium text-red-600">12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Konten Tidak Pantas</span>
                          <span className="font-medium text-orange-600">8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pelecehan</span>
                          <span className="font-medium text-red-600">3</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Laporan Pengguna</h3>
                      <p className="text-sm text-gray-600 mb-4">Kelola laporan terhadap pengguna</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Akun Palsu</span>
                          <span className="font-medium text-orange-600">5</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pelecehan</span>
                          <span className="font-medium text-red-600">7</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Pelanggaran Lainnya</span>
                          <span className="font-medium text-yellow-600">2</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow border p-6">
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
                          <button className="px-3 py-1 text-sm bg-green-100 text-green-600 hover:bg-green-200 rounded">
                            Tolak
                          </button>
                          <button className="px-3 py-1 text-sm bg-red-100 text-red-600 hover:bg-red-200 rounded">
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
                <div className="bg-white rounded-lg shadow border p-6">
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;