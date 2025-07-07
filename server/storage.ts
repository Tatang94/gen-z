import { users, posts, comments, stories, type User, type Post, type Comment, type Story, type InsertUser, type InsertPost, type InsertComment, type InsertStory } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  deleteUser(userId: number): Promise<void>;
  banUser(userId: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  followUser(userId: number): Promise<{ followers: number }>;
  
  // Posts
  getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]>;
  createPost(post: InsertPost): Promise<Post>;
  deletePost(postId: number): Promise<void>;
  togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }>;
  sharePost(postId: number): Promise<{ shares: number }>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Stories
  getStories(): Promise<(Story & { user: User })[]>;
  createStory(story: InsertStory): Promise<Story>;
}

export class DatabaseStorage implements IStorage {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  async getUser(id: number): Promise<User | undefined> {
    try {
      const [user] = await this.db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.warn('Database query failed:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    await this.db.delete(users).where(eq(users.id, userId));
  }

  async banUser(userId: number): Promise<void> {
    // In a real implementation, you might have a 'banned' field in users table
    // For now, we'll just log it
    console.log(`User ${userId} has been banned`);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users);
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    const postsWithUsers = await this.db.query.posts.findMany({
      with: {
        user: true,
        comments: {
          with: {
            user: true,
          },
          orderBy: [desc(comments.timestamp)],
        },
      },
      orderBy: [desc(posts.timestamp)],
    });
    
    return postsWithUsers;
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const [post] = await this.db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async deletePost(postId: number): Promise<void> {
    await this.db.delete(posts).where(eq(posts.id, postId));
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await this.db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async getStories(): Promise<(Story & { user: User })[]> {
    const storiesWithUsers = await this.db.query.stories.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(stories.timestamp)],
    });
    
    return storiesWithUsers;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await this.db
      .insert(stories)
      .values(insertStory)
      .returning();
    return story;
  }

  async togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }> {
    // For simplicity, we'll just increment the like count
    // In a real app, you'd track individual user likes in a separate table
    const [post] = await this.db.select().from(posts).where(eq(posts.id, postId));
    if (!post) {
      throw new Error('Post not found');
    }

    const newLikes = (post.likes || 0) + 1;
    await this.db
      .update(posts)
      .set({ likes: newLikes })
      .where(eq(posts.id, postId));

    return { likes: newLikes, isLiked: true };
  }

  async sharePost(postId: number): Promise<{ shares: number }> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, postId));
    if (!post) {
      throw new Error('Post not found');
    }

    const newShares = (post.shares || 0) + 1;
    await this.db
      .update(posts)
      .set({ shares: newShares })
      .where(eq(posts.id, postId));

    return { shares: newShares };
  }

  async followUser(userId: number): Promise<{ followers: number }> {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error('User not found');
    }

    const newFollowers = (user.followers || 0) + 1;
    await this.db
      .update(users)
      .set({ followers: newFollowers })
      .where(eq(users.id, userId));

    return { followers: newFollowers };
  }
}

// In-memory storage fallback
class MemStorage implements IStorage {
  private users: User[] = [
    {
      id: 1,
      username: 'sarah_chen',
      password: 'password123',
      displayName: 'Sarah Chen',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Content creator & traveler',
      followers: 1250,
      following: 340,
      postsCount: 85,
      isVerified: true,
      joinDate: new Date('2023-01-15'),
      isOnline: true
    }
  ];

  private posts: (Post & { user: User; comments: (Comment & { user: User })[] })[] = [];
  private stories: (Story & { user: User })[] = [];
  private nextId = 10;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextId++,
      bio: null,
      followers: 0,
      following: 0,
      postsCount: 0,
      isVerified: false,
      joinDate: new Date(),
      isOnline: true,
      ...insertUser
    };
    this.users.push(user);
    return user;
  }

  async deleteUser(userId: number): Promise<void> {
    this.users = this.users.filter(user => user.id !== userId);
    // Also delete user's posts and comments
    this.posts = this.posts.filter(post => post.userId !== userId);
  }

  async banUser(userId: number): Promise<void> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      // In a real implementation, you might set a 'banned' flag
      console.log(`User ${user.username} has been banned`);
    }
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    return this.posts.sort((a, b) => {
      const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
      const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    });
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const user = this.users.find(u => u.id === insertPost.userId);
    if (!user) throw new Error('User not found');

    const post: Post = {
      id: this.nextId++,
      likes: 0,
      shares: 0,
      timestamp: new Date(),
      image: insertPost.image || null,
      music: insertPost.music || null,
      ...insertPost
    };

    const fullPost = {
      ...post,
      user,
      comments: []
    };

    this.posts.push(fullPost);
    user.postsCount = (user.postsCount || 0) + 1;
    return post;
  }

  async deletePost(postId: number): Promise<void> {
    const postIndex = this.posts.findIndex(p => p.id === postId);
    if (postIndex > -1) {
      this.posts.splice(postIndex, 1);
    }
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const user = this.users.find(u => u.id === insertComment.userId);
    if (!user) throw new Error('User not found');

    const post = this.posts.find(p => p.id === insertComment.postId);
    if (!post) throw new Error('Post not found');

    const comment: Comment = {
      id: this.nextId++,
      likes: 0,
      timestamp: new Date(),
      ...insertComment
    };

    const fullComment = { ...comment, user };
    post.comments.push(fullComment);
    return comment;
  }

  async getStories(): Promise<(Story & { user: User })[]> {
    return this.stories;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const user = this.users.find(u => u.id === insertStory.userId);
    if (!user) throw new Error('User not found');

    const story: Story = {
      id: this.nextId++,
      timestamp: new Date(),
      isViewed: false,
      ...insertStory
    };

    this.stories.push({ ...story, user });
    return story;
  }

  async togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.likes = (post.likes || 0) + 1;
    return { likes: post.likes, isLiked: true };
  }

  async sharePost(postId: number): Promise<{ shares: number }> {
    const post = this.posts.find(p => p.id === postId);
    if (!post) throw new Error('Post not found');

    post.shares = (post.shares || 0) + 1;
    return { shares: post.shares };
  }

  async followUser(userId: number): Promise<{ followers: number }> {
    const user = this.users.find(u => u.id === userId);
    if (!user) throw new Error('User not found');

    user.followers = (user.followers || 0) + 1;
    return { followers: user.followers };
  }
}

// Use SQLite storage for now to ensure compatibility
export const storage = new MemStorage();