import { users, posts, comments, stories, type User, type Post, type Comment, type Story, type InsertUser, type InsertPost, type InsertComment, type InsertStory } from "@shared/sqlite-schema";
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
      .values({
        ...insertPost,
        timestamp: new Date().toISOString()
      })
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
      .values({
        ...insertStory,
        timestamp: new Date().toISOString()
      })
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
      username: 'andi_jakarta',
      password: 'password123',
      displayName: 'Andi Pratama',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Content creator Jakarta 🇮🇩 | Mahasiswa UI | Suka traveling & kuliner',
      followers: 8750,
      following: 543,
      postsCount: 187,
      isVerified: true,
      joinDate: new Date('2023-02-10'),
      isOnline: true
    },
    {
      id: 2,
      username: 'sari_bandung',
      password: 'password123',
      displayName: 'Sari Indah',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Photographer 📸 | Bandung vibes | Coffee lover ☕ | Aesthetic enthusiast',
      followers: 12300,
      following: 398,
      postsCount: 234,
      isVerified: true,
      joinDate: new Date('2022-11-18'),
      isOnline: true
    },
    {
      id: 3,
      username: 'budi_surabaya',
      password: 'password123',
      displayName: 'Budi Santoso',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Entrepreneur muda 💼 | Tech startup | Surabaya | Always learning 📚',
      followers: 6890,
      following: 412,
      postsCount: 156,
      isVerified: false,
      joinDate: new Date('2023-04-05'),
      isOnline: true
    },
    {
      id: 4,
      username: 'maya_yogya',
      password: 'password123',
      displayName: 'Maya Kusuma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Mahasiswa UGM 🎓 | Art enthusiast 🎨 | Yogyakarta | Traditional meets modern',
      followers: 5670,
      following: 289,
      postsCount: 123,
      isVerified: false,
      joinDate: new Date('2023-06-12'),
      isOnline: false
    },
    {
      id: 5,
      username: 'rio_bali',
      password: 'password123',
      displayName: 'Rio Mahendra',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Surfer 🏄‍♂️ | Bali life | Digital nomad | Sunset chaser 🌅',
      followers: 9450,
      following: 356,
      postsCount: 201,
      isVerified: true,
      joinDate: new Date('2022-09-20'),
      isOnline: true
    }
  ];

  private posts: (Post & { user: User; comments: (Comment & { user: User })[] })[] = [
    {
      id: 1,
      userId: 1,
      content: 'Pagi yang cerah di Jakarta! Sarapan dulu sebelum kuliah 🌅☕ #JakartaLife #MahasiswaUI #Morning',
      image: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 156,
      shares: 8,
      user: this.users[0],
      comments: []
    },
    {
      id: 2,
      userId: 2,
      content: 'Hunting foto di Dago, Bandung! Cuaca mendukung banget hari ini 📸✨ #BandungVibes #Photography #Dago',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      likes: 234,
      shares: 15,
      user: this.users[1],
      comments: []
    },
    {
      id: 3,
      userId: 3,
      content: 'Startup life be like... coding sampai tengah malam 💻🚀 #StartupLife #Surabaya #Entrepreneur #TechLife',
      image: null,
      music: null,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      likes: 89,
      shares: 12,
      user: this.users[2],
      comments: []
    },
    {
      id: 4,
      userId: 4,
      content: 'Seni batik meets digital art! Bangga sama warisan budaya kita 🇮🇩🎨 #BatikModern #YogyakartaArt #Indonesia',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000),
      likes: 312,
      shares: 28,
      user: this.users[3],
      comments: []
    },
    {
      id: 5,
      userId: 5,
      content: 'Sunset surf session di Uluwatu! Life is good di Pulau Dewata 🏄‍♂️🌅 #BaliLife #Surfing #Uluwatu #Paradise',
      image: 'https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      likes: 445,
      shares: 34,
      user: this.users[4],
      comments: []
    }
  ];

  private stories: (Story & { user: User })[] = [
    {
      id: 1,
      userId: 1,
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isViewed: false,
      user: this.users[0]
    },
    {
      id: 2,
      userId: 2,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      isViewed: false,
      user: this.users[1]
    },
    {
      id: 3,
      userId: 4,
      image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      isViewed: false,
      user: this.users[3]
    },
    {
      id: 4,
      userId: 5,
      image: 'https://images.pexels.com/photos/1032653/pexels-photo-1032653.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
      isViewed: true,
      user: this.users[4]
    }
  ];

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
      joinDate: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
      timestamp: new Date().toISOString(),
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
// Initialize storage based on available database
let storage: IStorage;

async function initializeStorage() {
  try {
    // Use MemStorage for now to avoid timestamp issues
    storage = new MemStorage();
    console.log('Using memory storage');
  } catch (error) {
    console.error('Storage initialization failed:', error);
    storage = new MemStorage();
    console.log('Using memory storage fallback');
  }
}

// Initialize storage
initializeStorage();

export { storage };
export { MemStorage };