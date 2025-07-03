import { useState, useEffect } from 'react';
import { Search, UserPlus, MessageCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  isVerified: boolean;
  isOnline: boolean;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  // Fetch users from API
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  useEffect(() => {
    if (users.length > 0) {
      const filtered = users.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleFollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        // Update UI or refetch data
        console.log('User followed successfully');
      }
    } catch (error) {
      console.error('Error following user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Cari Teman</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, username, atau bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="p-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Mencari pengguna...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{user.displayName}</h3>
                        {user.isVerified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.bio}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{user.followers} pengikut</span>
                        <span>{user.following} mengikuti</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleFollow(user.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <UserPlus size={16} />
                      <span>Ikuti</span>
                    </button>
                    <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <MessageCircle size={16} />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredUsers.length === 0 && searchTerm && (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Tidak ada pengguna yang ditemukan</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Coba kata kunci yang berbeda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}