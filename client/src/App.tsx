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
    <div className="min-h-screen bg-gray-100 overflow-x-hidden">
      {/* Facebook-style Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="w-full px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo and Search */}
            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-lg">f</span>
                </div>
                <h1 className="text-2xl font-bold text-blue-600">GenZ</h1>
              </div>
              <div className="flex-shrink-0">
                <input
                  type="text"
                  placeholder="Cari di GenZ"
                  className="w-64 px-4 py-2 bg-gray-100 rounded-full border-none outline-none focus:bg-white focus:shadow-md transition-all"
                />
              </div>
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

      {/* Main Content - Fixed Layout Container */}
      <div className="pt-14 w-full overflow-hidden">
        <div className="w-[1200px] mx-auto flex relative fixed-layout-container">
          {/* Left Sidebar - Fixed Width */}
          <div className="w-[280px] h-[calc(100vh-56px)] overflow-y-auto bg-white border-r border-gray-200 flex-shrink-0 fixed left-[calc(50%-600px)] top-14">
            <Sidebar 
              currentUser={currentUser} 
              onAdminClick={() => setCurrentView('admin')}
            />
          </div>

          {/* Center Feed - Fixed Width */}
          <main className="w-[640px] mx-auto px-4 py-6 flex-shrink-0 relative z-10">
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

          {/* Right Sidebar - Fixed Width */}
          <div className="w-[280px] h-[calc(100vh-56px)] overflow-y-auto bg-white border-l border-gray-200 flex-shrink-0 fixed right-[calc(50%-600px)] top-14">
            <TrendingPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;