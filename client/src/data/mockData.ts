import { User, Post, Story } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'sarah_gen',
    displayName: 'Sarah Gen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Gen-Z content creator 🎨 | Coffee addict ☕ | Living my best life ✨',
    followers: 12500,
    following: 890,
    posts: 234,
    isVerified: true,
    joinDate: '2023-01-15',
    isOnline: true
  },
  {
    id: '2',
    username: 'alex_vibes',
    displayName: 'Alex Vibes',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Music producer 🎵 | Tech enthusiast 💻 | Always creating',
    followers: 8900,
    following: 456,
    posts: 189,
    isVerified: false,
    joinDate: '2023-03-22',
    isOnline: true
  },
  {
    id: '3',
    username: 'maya_aesthetic',
    displayName: 'Maya Aesthetic',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Aesthetic vibes only 🌸 | Photography lover 📸 | Minimalist',
    followers: 15600,
    following: 234,
    posts: 456,
    isVerified: true,
    joinDate: '2022-11-08',
    isOnline: false
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Just dropped my new art piece! What do you think? 🎨✨ #GenZArt #Creative',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    comments: [],
    shares: 12,
    isLiked: false,
    isShared: false
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    content: 'New beat dropping soon! Been working on this for weeks 🔥🎵 #MusicProducer #GenZMusic',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    likes: 189,
    comments: [],
    shares: 8,
    isLiked: true,
    isShared: false
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    content: 'Minimalist setup complete! Sometimes less is more ✨ #Minimalist #Aesthetic #CleanVibes',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    likes: 456,
    comments: [],
    shares: 23,
    isLiked: false,
    isShared: true
  }
];

export const mockStories: Story[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    isViewed: false
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    isViewed: true
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    isViewed: false
  }
];