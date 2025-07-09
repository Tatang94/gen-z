import { User, Post, Story } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'andi_jakarta',
    displayName: 'Andi Pratama',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Content creator Jakarta 🇮🇩 | Mahasiswa UI | Suka traveling & kuliner',
    followers: 8750,
    following: 543,
    posts: 187,
    isVerified: true,
    joinDate: '2023-02-10',
    isOnline: true
  },
  {
    id: '2',
    username: 'sari_bandung',
    displayName: 'Sari Indah',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Photographer 📸 | Bandung vibes | Coffee lover ☕ | Aesthetic enthusiast',
    followers: 12300,
    following: 398,
    posts: 234,
    isVerified: true,
    joinDate: '2022-11-18',
    isOnline: true
  },
  {
    id: '3',
    username: 'budi_surabaya',
    displayName: 'Budi Santoso',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Entrepreneur muda 💼 | Tech startup | Surabaya | Always learning 📚',
    followers: 6890,
    following: 412,
    posts: 156,
    isVerified: false,
    joinDate: '2023-04-05',
    isOnline: true
  },
  {
    id: '4',
    username: 'maya_yogya',
    displayName: 'Maya Kusuma',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Mahasiswa UGM 🎓 | Art enthusiast 🎨 | Yogyakarta | Traditional meets modern',
    followers: 5670,
    following: 289,
    posts: 123,
    isVerified: false,
    joinDate: '2023-06-12',
    isOnline: false
  },
  {
    id: '5',
    username: 'rio_bali',
    displayName: 'Rio Mahendra',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
    bio: 'Surfer 🏄‍♂️ | Bali life | Digital nomad | Sunset chaser 🌅',
    followers: 9450,
    following: 356,
    posts: 201,
    isVerified: true,
    joinDate: '2022-09-20',
    isOnline: true
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '1',
    user: mockUsers[0],
    content: 'Pagi yang cerah di Jakarta! Sarapan dulu sebelum kuliah 🌅☕ #JakartaLife #MahasiswaUI #Morning',
    image: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    likes: 156,
    comments: [],
    shares: 8,
    isLiked: false,
    isShared: false
  },
  {
    id: '2',
    userId: '2',
    user: mockUsers[1],
    content: 'Hunting foto di Dago, Bandung! Cuaca mendukung banget hari ini 📸✨ #BandungVibes #Photography #Dago',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    likes: 234,
    comments: [],
    shares: 15,
    isLiked: true,
    isShared: false
  },
  {
    id: '3',
    userId: '3',
    user: mockUsers[2],
    content: 'Startup life be like... coding sampai tengah malam 💻🚀 #StartupLife #Surabaya #Entrepreneur #TechLife',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    likes: 89,
    comments: [],
    shares: 12,
    isLiked: false,
    isShared: false
  },
  {
    id: '4',
    userId: '4',
    user: mockUsers[3],
    content: 'Seni batik meets digital art! Bangga sama warisan budaya kita 🇮🇩🎨 #BatikModern #YogyakartaArt #Indonesia',
    image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    likes: 312,
    comments: [],
    shares: 28,
    isLiked: true,
    isShared: false
  },
  {
    id: '5',
    userId: '5',
    user: mockUsers[4],
    content: 'Sunset surf session di Uluwatu! Life is good di Pulau Dewata 🏄‍♂️🌅 #BaliLife #Surfing #Uluwatu #Paradise',
    image: 'https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=600',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    likes: 445,
    comments: [],
    shares: 34,
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
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    isViewed: false
  },
  {
    id: '3',
    userId: '4',
    user: mockUsers[3],
    image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    isViewed: false
  },
  {
    id: '4',
    userId: '5',
    user: mockUsers[4],
    image: 'https://images.pexels.com/photos/1032653/pexels-photo-1032653.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    isViewed: true
  },
  {
    id: '5',
    userId: '3',
    user: mockUsers[2],
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=300',
    timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    isViewed: false
  }
];