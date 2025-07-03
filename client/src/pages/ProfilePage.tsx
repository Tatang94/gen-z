import { useState } from 'react';
import { Settings, Calendar, MapPin, Link as LinkIcon, Edit3, Camera, Grid, Bookmark, Users, Share2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  postsCount: number;
  isVerified: boolean;
  joinDate: string;
  location?: string;
  website?: string;
}

interface Post {
  id: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isEditing, setIsEditing] = useState(false);

  // In real app, get current user from context/auth
  const currentUser: User = {
    id: '1',
    username: 'sarah_chen',
    displayName: 'Sarah Chen',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Digital artist & coffee enthusiast ☕\n🎨 Creating beautiful things everyday\n📍 Jakarta, Indonesia',
    followers: 2847,
    following: 1205,
    postsCount: 89,
    isVerified: true,
    joinDate: '2023-06-15T10:30:00.000Z',
    location: 'Jakarta, Indonesia',
    website: 'https://sarahchen.art'
  };

  const { data: userPosts = [] } = useQuery<Post[]>({
    queryKey: ['/api/posts', currentUser.id],
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">@{currentUser.username}</h1>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-white dark:bg-gray-800 p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-700 profile-avatar"
            />
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{currentUser.displayName}</h2>
              {currentUser.isVerified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">@{currentUser.username}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 mb-6">
          <button
            onClick={() => setIsEditing(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            <Edit3 size={18} />
            <span>Edit Profil</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 btn-primary text-white rounded-xl font-medium">
            <Share2 size={18} />
            <span>Bagikan</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900 dark:text-white">{formatNumber(currentUser.postsCount)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Postingan</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900 dark:text-white">{formatNumber(currentUser.followers)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Pengikut</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-2xl text-gray-900 dark:text-white">{formatNumber(currentUser.following)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Mengikuti</div>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-3">
          <p className="text-gray-900 dark:text-white whitespace-pre-line leading-relaxed">{currentUser.bio}</p>
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
            {currentUser.location && (
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>{currentUser.location}</span>
              </div>
            )}
            {currentUser.website && (
              <div className="flex items-center space-x-2">
                <LinkIcon size={16} />
                <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {currentUser.website.replace('https://', '')}
                </a>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar size={16} />
              <span>Bergabung {formatDate(currentUser.joinDate)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex">
          {[
            { id: 'posts', label: 'Postingan', icon: Grid },
            { id: 'saved', label: 'Tersimpan', icon: Bookmark },
            { id: 'tagged', label: 'Tag', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <div key={post.id} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                {post.image ? (
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center p-2">
                      {post.content.substring(0, 50)}...
                    </p>
                  </div>
                )}
              </div>
            ))}
            
            {userPosts.length === 0 && (
              <div className="col-span-3 text-center py-12">
                <Grid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Belum ada postingan</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Mulai berbagi momen Anda!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="text-center py-12">
            <Bookmark className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Belum ada postingan tersimpan</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Postingan yang Anda simpan akan muncul di sini</p>
          </div>
        )}

        {activeTab === 'tagged' && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Belum ada tag foto</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Foto yang Anda di-tag akan muncul di sini</p>
          </div>
        )}
      </div>
    </div>
  );
}