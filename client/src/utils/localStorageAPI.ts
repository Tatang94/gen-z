// Local storage API untuk deployment Vercel (frontend only)
import { Post, Story, User } from '../types';
import { mockUsers, mockPosts, mockStories } from '../data/mockData';

const STORAGE_KEYS = {
  POSTS: 'genz_posts',
  STORIES: 'genz_stories',
  USERS: 'genz_users',
  CURRENT_USER: 'genz_current_user'
};

// Initialize data in localStorage
export function initializeLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(mockPosts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(mockStories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mockUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Set user pertama sebagai current user
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(mockUsers[0]));
  }
}

// Get current user
export function getCurrentUser(): User {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : mockUsers[0];
}

// Get all posts
export function getPosts(): Post[] {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  return posts ? JSON.parse(posts) : mockPosts;
}

// Get all stories
export function getStories(): Story[] {
  const stories = localStorage.getItem(STORAGE_KEYS.STORIES);
  return stories ? JSON.parse(stories) : mockStories;
}

// Create new post
export function createPost(content: string, image?: string, music?: any): Post {
  const posts = getPosts();
  const currentUser = getCurrentUser();
  
  const newPost: Post = {
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

  // Add music data if provided
  if (music) {
    (newPost as any).music = music;
  }

  const updatedPosts = [newPost, ...posts];
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(updatedPosts));
  
  return newPost;
}

// Create new story
export function createStory(imageFile: File): Promise<Story> {
  return new Promise((resolve) => {
    const stories = getStories();
    const currentUser = getCurrentUser();
    
    // Convert file to data URL for demo
    const reader = new FileReader();
    reader.onload = (e) => {
      const newStory: Story = {
        id: Date.now().toString(),
        userId: currentUser.id,
        user: currentUser,
        image: e.target?.result as string,
        timestamp: new Date().toISOString(),
        isViewed: false
      };

      const updatedStories = [newStory, ...stories];
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(updatedStories));
      
      resolve(newStory);
    };
    reader.readAsDataURL(imageFile);
  });
}

// Like post
export function likePost(postId: string): { likes: number; isLiked: boolean } {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex !== -1) {
    const post = posts[postIndex];
    post.isLiked = !post.isLiked;
    post.likes = post.isLiked ? post.likes + 1 : post.likes - 1;
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return { likes: post.likes, isLiked: post.isLiked };
  }
  
  return { likes: 0, isLiked: false };
}

// Share post
export function sharePost(postId: string): { shares: number } {
  const posts = getPosts();
  const postIndex = posts.findIndex(p => p.id === postId);
  
  if (postIndex !== -1) {
    const post = posts[postIndex];
    post.shares += 1;
    post.isShared = true;
    
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return { shares: post.shares };
  }
  
  return { shares: 0 };
}