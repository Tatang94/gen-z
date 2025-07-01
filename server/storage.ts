import { users, posts, comments, stories, type User, type Post, type Comment, type Story, type InsertUser, type InsertPost, type InsertComment, type InsertStory } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Posts
  getPosts(): Promise<(Post & { user: User; comments: (Comment & { user: User })[] })[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Comments
  createComment(comment: InsertComment): Promise<Comment>;
  
  // Stories
  getStories(): Promise<(Story & { user: User })[]>;
  createStory(story: InsertStory): Promise<Story>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
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
}

export const storage = new DatabaseStorage();