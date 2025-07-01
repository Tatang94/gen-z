import React from 'react';
import { TrendingUp, Users, Hash } from 'lucide-react';

const TrendingPanel: React.FC = () => {
  const trendingTopics = [
    { tag: '#GenZ', posts: '12.5K' },
    { tag: '#TechTrends', posts: '8.2K' },
    { tag: '#Indonesia', posts: '15.3K' },
    { tag: '#SocialMedia', posts: '6.7K' },
    { tag: '#Viral', posts: '25.1K' },
  ];

  const suggestedUsers = [
    {
      id: '1',
      name: 'Andi Pratama',
      username: 'andipratama',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '1.2K',
      isVerified: true,
    },
    {
      id: '2',
      name: 'Sari Dewi',
      username: 'saridewi',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '856',
      isVerified: false,
    },
    {
      id: '3',
      name: 'Budi Santoso',
      username: 'budisantoso',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      followers: '2.1K',
      isVerified: true,
    },
  ];

  return (
    <div className="bg-white p-4">
      {/* Sponsored */}
      <div className="mb-6">
        <h3 className="text-gray-500 font-semibold text-sm mb-3">Disponsori</h3>
        <div className="space-y-3">
          <div className="flex space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
            <img
              src="https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=150"
              alt="Sponsor"
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h4 className="font-medium text-sm text-gray-900">Kursus Web Development</h4>
              <p className="text-xs text-gray-600">Belajar coding dari nol hingga mahir</p>
              <span className="text-xs text-gray-500">webdev.id</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Kontak */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-500 font-semibold text-sm">Kontak</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Users className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="font-medium text-sm text-gray-900">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Grup Percakapan */}
      <div>
        <h3 className="text-gray-500 font-semibold text-sm mb-3">Grup Percakapan</h3>
        <div className="space-y-2">
          {trendingTopics.slice(0, 3).map((topic, index) => (
            <div key={index} className="flex items-center space-x-3 p-1 hover:bg-gray-50 rounded-lg cursor-pointer">
              <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
                <Hash className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-sm text-gray-900">{topic.tag.replace('#', '')}</p>
                <p className="text-xs text-gray-500">{topic.posts} anggota</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPanel;