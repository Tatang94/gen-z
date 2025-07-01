import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import Sidebar from './components/Sidebar';
import Stories from './components/Stories';
import CreatePost from './components/CreatePost';
import Post from './components/Post';
import TrendingPanel from './components/TrendingPanel';
import AdminDashboard from './components/AdminDashboard';
import { mockPosts, mockUsers, mockStories } from './data/mockData';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Post as PostType, User } from './types';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'admin'>('home');
  const [posts, setPosts] = useLocalStorage<PostType[]>('posts', mockPosts);
  const [users, setUsers] = useLocalStorage<User[]>('users', mockUsers);
  const [currentUser] = useState<User>(mockUsers[0]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isShared: !post.isShared, shares: post.isShared ? post.shares - 1 : post.shares + 1 }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, followers: user.followers + 1 }
        : user
    ));
  };

  const handleCreatePost = (content: string, image?: string) => {
    const newPost: PostType = {
      id: Date.now().toString(),
      userId: currentUser.id,
      user: currentUser,
      content,
      image,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      shares: 0,
      isLiked: false,
      isShared: false
    };
    setPosts([newPost, ...posts]);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminDashboard 
          onBackToHome={() => setCurrentView('home')}
          users={users as any}
          posts={posts as any}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">f</span>
              </div>
              <h1 className="text-xl font-bold text-blue-600">GenZ</h1>
            </div>
            
            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Cari di GenZ"
                className="w-full px-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:shadow-md transition-all text-sm"
              />
            </div>

            {/* Right - User Profile */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCurrentView('admin')}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              >
                <span className="text-sm font-medium">Admin</span>
              </button>
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Main Content */}
      <div className="pt-14 pb-20">
        {/* Mobile Layout - Single Column */}
        <main className="max-w-lg mx-auto px-4 py-4">
          <div className="space-y-4">
            <Stories stories={mockStories} />
            <CreatePost onCreatePost={handleCreatePost} />
            
            <div className="space-y-4">
              {posts.map(post => (
                <Post
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onShare={handleShare}
                  onFollow={handleFollow}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around py-2">
          <button className="flex flex-col items-center py-2 px-3 text-blue-600">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-xs mt-1">Beranda</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <span className="text-xs mt-1">Cari</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"/>
            </svg>
            <span className="text-xs mt-1">Teman</span>
          </button>
          
          <button className="flex flex-col items-center py-2 px-3 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7h-5z"/>
            </svg>
            <span className="text-xs mt-1">Chat</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('admin')}
            className="flex flex-col items-center py-2 px-3 text-gray-600"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs mt-1">Profil</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

export default App;