import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import * as schema from "@shared/schema";
import { users, posts, comments, stories } from "@shared/schema";
import type { 
  IStorage, 
  User, 
  InsertUser, 
  Post, 
  InsertPost, 
  Comment, 
  InsertComment, 
  Story, 
  InsertStory 
} from "./storage";

export class PostgreSQLStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
    this.db = drizzle(pool, { schema });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user || undefined;
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

  async followUser(userId: number): Promise<{ followers: number }> {
    // For now, just increment the followers count
    const [user] = await this.db
      .update(users)
      .set({ followers: (users.followers || 0) + 1 })
      .where(eq(users.id, userId))
      .returning();
    
    return { followers: user.followers || 0 };
  }

  async getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]> {
    const result = await this.db.query.posts.findMany({
      with: {
        user: true,
        comments: {
          with: {
            user: true
          }
        }
      }
    });
    
    return result as (Post & { user: User; comments: (Comment & { user: User })[] })[];
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await this.db
      .insert(posts)
      .values(post)
      .returning();
    return newPost;
  }

  async togglePostLike(postId: number): Promise<{ likes: number; isLiked: boolean }> {
    const [post] = await this.db
      .update(posts)
      .set({ likes: (posts.likes || 0) + 1 })
      .where(eq(posts.id, postId))
      .returning();
    
    return { likes: post.likes || 0, isLiked: true };
  }

  async sharePost(postId: number): Promise<{ shares: number }> {
    const [post] = await this.db
      .update(posts)
      .set({ shares: (posts.shares || 0) + 1 })
      .where(eq(posts.id, postId))
      .returning();
    
    return { shares: post.shares || 0 };
  }

  async createComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await this.db
      .insert(comments)
      .values(comment)
      .returning();
    return newComment;
  }

  async getStories(): Promise<(Story & { user: User })[]> {
    const result = await this.db.query.stories.findMany({
      with: {
        user: true
      }
    });
    
    return result as (Story & { user: User })[];
  }

  async createStory(story: InsertStory): Promise<Story> {
    const [newStory] = await this.db
      .insert(stories)
      .values(story)
      .returning();
    return newStory;
  }
}