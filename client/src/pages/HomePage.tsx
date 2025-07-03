import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import Stories from '../components/Stories';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { mockUsers, mockStories } from '../data/mockData';
import { Post as PostType, User, Story } from '../types';

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState<User>(mockUsers[0]);

  useEffect(() => {
    fetchPosts();
    fetchStories();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const response = await fetch('/api/stories');
      const data = await response.json();
      setStories(data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
      });
      const data = await response.json();
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: data.likes, isLiked: data.isLiked }
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/share`, {
        method: 'POST',
      });
      const data = await response.json();
      
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, shares: data.shares, isShared: true }
          : post
      ));
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };

  const handleFollow = (userId: string) => {
    console.log('Follow user:', userId);
  };

  const handleCreatePost = async (content: string, image?: string) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 1,
          content,
          image,
          timestamp: new Date().toISOString(),
          likes: 0,
          shares: 0,
        }),
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleComment = async (postId: string, content: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          postId: parseInt(postId),
          userId: 1,
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
        }),
      });
      
      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleCreateStory = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('userId', '1');

      const response = await fetch('/api/stories', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchStories();
      }
    } catch (error) {
      console.error('Error creating story:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">GenZ</h1>
            </div>
            
            {/* Center - Search */}
            <div className="flex-1 max-w-md mx-4">
              <input
                type="text"
                placeholder="Cari di GenZ"
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-full border-none outline-none focus:bg-white dark:focus:bg-gray-600 focus:shadow-md transition-all text-sm"
              />
            </div>

            {/* Right - User Profile */}
            <div className="flex items-center">
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
            <Stories stories={stories.length > 0 ? stories : mockStories} onCreateStory={handleCreateStory} />
            <CreatePost onCreatePost={handleCreatePost} />
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Memuat postingan...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map(post => (
                  <Post
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onShare={handleShare}
                    onFollow={handleFollow}
                    onComment={handleComment}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>


    </div>
  );
};

export default HomePage;