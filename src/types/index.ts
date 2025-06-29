export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  isVerified: boolean;
  joinDate: string;
  isOnline: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: Comment[];
  shares: number;
  isLiked: boolean;
  isShared: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

export interface Story {
  id: string;
  userId: string;
  user: User;
  image: string;
  timestamp: string;
  isViewed: boolean;
}

export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  activeUsers: number;
  verifiedUsers: number;
  recentActivity: ActivityLog[];
}

export interface ActivityLog {
  id: string;
  type: 'user_joined' | 'post_created' | 'user_verified' | 'comment_posted';
  userId: string;
  username: string;
  timestamp: string;
  details: string;
}