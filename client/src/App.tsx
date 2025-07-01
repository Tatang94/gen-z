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
          users={users}
          posts={posts}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <Sidebar 
          currentUser={currentUser} 
          onAdminClick={() => setCurrentView('admin')}
        />
        
        <main className="flex-1 max-w-2xl mx-auto px-4 py-6">
          <Stories stories={mockStories} />
          <CreatePost onCreatePost={handleCreatePost} />
          
          <div className="space-y-6">
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
        </main>

        <TrendingPanel />
      </div>
    </div>
  );
}

export default App;