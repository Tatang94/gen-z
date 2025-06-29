import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, Shield, Zap } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentUser: UserType;
  onAdminClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onAdminClick }) => {
  const menuItems = [
    { icon: Home, label: 'Beranda', active: true },
    { icon: Search, label: 'Jelajahi', active: false },
    { icon: Bell, label: 'Notifikasi', active: false },
    { icon: Mail, label: 'Pesan', active: false },
    { icon: Bookmark, label: 'Tersimpan', active: false },
    { icon: User, label: 'Profil', active: false },
    { icon: Settings, label: 'Pengaturan', active: false },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-6 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center mb-8">
        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          GEN-Z
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-2 mb-8">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
              item.active
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Admin Panel Button */}
      <button
        onClick={onAdminClick}
        className="w-full flex items-center px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 mb-6"
      >
        <Shield className="w-5 h-5 mr-3" />
        <span className="font-medium">Panel Admin</span>
      </button>

      {/* User Profile */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center">
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="ml-3 flex-1">
            <p className="font-semibold text-gray-900 text-sm">{currentUser.displayName}</p>
            <p className="text-gray-500 text-xs">@{currentUser.username}</p>
          </div>
          {currentUser.isVerified && (
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;