import React from 'react';
import { TrendingUp, Hash, Users } from 'lucide-react';

const TrendingPanel: React.FC = () => {
  const trendingTopics = [
    { tag: '#ReactJS', posts: '125K posts' },
    { tag: '#WebDevelopment', posts: '89K posts' },
    { tag: '#JavaScript', posts: '234K posts' },
    { tag: '#TailwindCSS', posts: '67K posts' },
    { tag: '#OpenSource', posts: '156K posts' }
  ];

  const suggestedUsers = [
    { name: 'Sarah Chen', handle: '@sarahdev', followers: '12.5K' },
    { name: 'Alex Rodriguez', handle: '@alexcodes', followers: '8.9K' },
    { name: 'Maya Patel', handle: '@mayatech', followers: '15.2K' }
  ];

  return (
    <div className="space-y-6">
      {/* Trending Topics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Trending Topics</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">{topic.tag}</span>
                </div>
                <span className="text-sm text-gray-500">{topic.posts}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Who to Follow</h3>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {suggestedUsers.map((user, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.handle}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors">
                  Follow
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">{user.followers} followers</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingPanel;
