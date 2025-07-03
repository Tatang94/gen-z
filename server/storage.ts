import { users, posts, comments, stories, type User, type Post, type Comment, type Story, type InsertUser, type InsertPost, type InsertComment, type InsertStory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  followUser(userId: number): Promise<{ followers: number }>;
  
  // Posts
  getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]>;
  createPost(post: InsertPost): Promise<Post>;
  togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }>;
  sharePost(postId: number): Promise<{ shares: number }>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Stories
  getStories(): Promise<(Story & { user: User })[]>;
  createStory(story: InsertStory): Promise<Story>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    const postsWithUsers = await db.query.posts.findMany({
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
    const [post] = await db
      .insert(posts)
      .values(insertPost)
      .returning();
    return post;
  }

  async createComment(insertComment: InsertComment): Promise<Comment> {
    const [comment] = await db
      .insert(comments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async getStories(): Promise<(Story & { user: User })[]> {
    const storiesWithUsers = await db.query.stories.findMany({
      with: {
        user: true,
      },
      orderBy: [desc(stories.timestamp)],
    });
    
    return storiesWithUsers;
  }

  async createStory(insertStory: InsertStory): Promise<Story> {
    const [story] = await db
      .insert(stories)
      .values(insertStory)
      .returning();
    return story;
  }

  async togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }> {
    // For simplicity, we'll just increment the like count
    // In a real app, you'd track individual user likes in a separate table
    const [post] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!post) {
      throw new Error('Post not found');
    }

    const newLikes = (post.likes || 0) + 1;
    await db
      .update(posts)
      .set({ likes: newLikes })
      .where(eq(posts.id, postId));

    return { likes: newLikes, isLiked: true };
  }

  async sharePost(postId: number): Promise<{ shares: number }> {
    const [post] = await db.select().from(posts).where(eq(posts.id, postId));
    if (!post) {
      throw new Error('Post not found');
    }

    const newShares = (post.shares || 0) + 1;
    await db
      .update(posts)
      .set({ shares: newShares })
      .where(eq(posts.id, postId));

    return { shares: newShares };
  }

  async followUser(userId: number): Promise<{ followers: number }> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
      throw new Error('User not found');
    }

    const newFollowers = (user.followers || 0) + 1;
    await db
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
      username: "john_doe",
      password: "password",
      displayName: "John Doe",
      avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=john",
      bio: "Tech enthusiast and coffee lover ☕",
      followers: 1234,
      following: 567,
      postsCount: 89,
      isVerified: true,
      joinDate: new Date("2023-01-15"),
      isOnline: true
    },
    {
      id: 2,
      username: "jane_smith",
      password: "password",
      displayName: "Jane Smith",
      avatar: "https://api.dicebear.com/6.x/avataaars/svg?seed=jane",
      bio: "Artist | Designer | Nature lover 🌿",
      followers: 892,
      following: 234,
      postsCount: 156,
      isVerified: false,
      joinDate: new Date("2023-03-22"),
      isOnline: false
    }
  ];

  private posts: (Post & { user: User; comments: (Comment & { user: User })[] })[] = [];
  private stories: (Story & { user: User })[] = [];
  private nextId = 3;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.nextId++,
      password: "password",
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

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    return this.posts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createPost(insertPost: InsertPost): Promise<Post> {
    const user = this.users.find(u => u.id === insertPost.userId);
    if (!user) throw new Error('User not found');

    const post: Post = {
      id: this.nextId++,
      likes: 0,
      shares: 0,
      timestamp: new Date(),
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

// Use database if available, otherwise fall back to in-memory storage
export const storage = db ? new DatabaseStorage() : new MemStorage();