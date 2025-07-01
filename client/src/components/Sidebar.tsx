import React from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, Settings, Shield, Zap, Users } from 'lucide-react';
import { User as UserType } from '../types';

interface SidebarProps {
  currentUser: UserType;
  onAdminClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, onAdminClick }) => {
  const menuItems = [
    { icon: User, label: currentUser.displayName, active: false, avatar: currentUser.avatar },
    { icon: Users, label: 'Teman', active: false },
    { icon: Bookmark, label: 'Tersimpan', active: false },
    { icon: Bell, label: 'Grup', active: false },
    { icon: Home, label: 'Marketplace', active: false },
    { icon: Search, label: 'Watch', active: false },
    { icon: Mail, label: 'Messenger', active: false },
    { icon: Settings, label: 'Lihat Selengkapnya', active: false },
  ];

  const shortcuts = [
    { name: 'React Indonesia', avatar: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'JavaScript Community', avatar: 'https://images.pexels.com/photos/1181304/pexels-photo-1181304.jpeg?auto=compress&cs=tinysrgb&w=150' },
    { name: 'Web Developers', avatar: 'https://images.pexels.com/photos/1181311/pexels-photo-1181311.jpeg?auto=compress&cs=tinysrgb&w=150' },
  ];

  return (
    <div className="bg-white p-4">
      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-full flex items-center px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
          >
            {item.avatar ? (
              <img src={item.avatar} alt={item.label} className="w-9 h-9 rounded-full object-cover mr-3" />
            ) : (
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <item.icon className="w-5 h-5 text-gray-600" />
              </div>
            )}
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {/* Shortcuts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-500 font-semibold text-sm">Pintasan Anda</h3>
        </div>
        <div className="space-y-1">
          {shortcuts.map((shortcut, index) => (
            <button
              key={index}
              className="w-full flex items-center px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
            >
              <img
                src={shortcut.avatar}
                alt={shortcut.name}
                className="w-9 h-9 rounded-lg object-cover mr-3"
              />
              <span className="font-medium text-sm">{shortcut.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Admin Panel Button */}
      <hr className="my-4 border-gray-200" />
      <button
        onClick={onAdminClick}
        className="w-full flex items-center px-2 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-left"
      >
        <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center mr-3">
          <Shield className="w-5 h-5 text-blue-600" />
        </div>
        <span className="font-medium text-sm">Panel Admin</span>
      </button>
    </div>
  );
};

export default Sidebar;