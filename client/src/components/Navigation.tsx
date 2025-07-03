import { Home, Search, MessageCircle, User, MoreHorizontal } from 'lucide-react';
import { Link, useLocation } from 'wouter';

interface NavigationProps {
  currentUser: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
  };
}

export default function Navigation({ currentUser }: NavigationProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: 'Beranda', path: '/' },
    { icon: Search, label: 'Cari Teman', path: '/search' },
    { icon: MessageCircle, label: 'Chat', path: '/chat' },
    { icon: User, label: 'Profil', path: '/profile' },
    { icon: MoreHorizontal, label: 'Lainnya', path: '/more' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          return (
            <Link key={item.path} href={item.path}>
              <div className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}>
                <Icon size={24} />
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}