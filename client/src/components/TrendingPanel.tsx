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
    <div className="fixed right-0 top-0 h-full w-80 p-6 overflow-y-auto">
      {/* Trending Topics */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
          <h2 className="text-lg font-bold text-gray-900">Trending Hari Ini</h2>
        </div>
        <div className="space-y-4">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors">
              <div className="flex items-center space-x-3">
                <Hash className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">{topic.tag}</p>
                  <p className="text-xs text-gray-500">{topic.posts} postingan</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-purple-500 mr-2" />
          <h2 className="text-lg font-bold text-gray-900">Saran Ikuti</h2>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center space-x-1">
                    <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                    {user.isVerified && (
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">@{user.username} • {user.followers} pengikut</p>
                </div>
              </div>
              <button className="px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full hover:shadow-lg transition-all duration-200">
                Ikuti
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPanel;