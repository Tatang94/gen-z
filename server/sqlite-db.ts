import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "../shared/sqlite-schema";

// Create SQLite database
const sqlite = new Database('database.sqlite');
export const db = drizzle(sqlite, { schema });

// Initialize tables and sample data
export async function initializeDatabase() {
  // Create tables
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar TEXT NOT NULL,
      bio TEXT DEFAULT '',
      followers INTEGER DEFAULT 0,
      following INTEGER DEFAULT 0,
      posts_count INTEGER DEFAULT 0,
      is_verified INTEGER DEFAULT 0,
      join_date TEXT DEFAULT '2024-01-01',
      is_online INTEGER DEFAULT 1
    );
    
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      image TEXT,
      timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
      likes INTEGER DEFAULT 0,
      shares INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
    
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
      likes INTEGER DEFAULT 0,
      FOREIGN KEY (post_id) REFERENCES posts (id),
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
    
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      image TEXT NOT NULL,
      timestamp TEXT DEFAULT '2024-01-01T00:00:00.000Z',
      is_viewed INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);

  // Insert sample users if not exists
  const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  
  if (userCount.count === 0) {
    sqlite.exec(`
      INSERT INTO users (username, password, display_name, avatar, bio, followers, following, posts_count, is_verified, join_date, is_online) VALUES
      ('john_doe', 'password', 'John Doe', 'https://api.dicebear.com/6.x/avataaars/svg?seed=john', 'Tech enthusiast and coffee lover ☕', 1234, 567, 3, 1, '2023-01-15', 1),
      ('jane_smith', 'password', 'Jane Smith', 'https://api.dicebear.com/6.x/avataaars/svg?seed=jane', 'Artist | Designer | Nature lover 🌿', 892, 234, 2, 0, '2023-03-22', 0),
      ('alex_dev', 'password', 'Alex Dev', 'https://api.dicebear.com/6.x/avataaars/svg?seed=alex', 'Full-stack developer building amazing apps', 456, 123, 1, 0, '2023-06-10', 1);
      
      INSERT INTO posts (user_id, content, image, timestamp, likes, shares) VALUES
      (1, 'Just launched my new project! Excited to share it with everyone 🚀', 'https://picsum.photos/400/300?random=1', '2024-01-15T10:30:00.000Z', 24, 5),
      (1, 'Beautiful sunset today! Nature never fails to amaze me 🌅', 'https://picsum.photos/400/300?random=2', '2024-01-14T18:45:00.000Z', 18, 3),
      (2, 'Working on a new design project. Here''s a sneak peek! ✨', 'https://picsum.photos/400/300?random=3', '2024-01-14T14:20:00.000Z', 31, 7),
      (2, 'Just finished reading an amazing book on creativity. Highly recommend! 📚', NULL, '2024-01-13T09:15:00.000Z', 12, 2),
      (3, 'Debugging code at 2 AM... the developer life 😅', NULL, '2024-01-13T02:00:00.000Z', 45, 8),
      (1, 'Coffee and code - the perfect combination ☕️💻', 'https://picsum.photos/400/300?random=4', '2024-01-12T08:30:00.000Z', 27, 4);
      
      INSERT INTO stories (user_id, image, timestamp, is_viewed) VALUES
      (1, 'https://picsum.photos/300/500?random=5', '2024-01-15T12:00:00.000Z', 0),
      (2, 'https://picsum.photos/300/500?random=6', '2024-01-15T11:30:00.000Z', 0),
      (3, 'https://picsum.photos/300/500?random=7', '2024-01-15T10:45:00.000Z', 1);
      
      INSERT INTO comments (post_id, user_id, content, timestamp, likes) VALUES
      (1, 2, 'Congratulations! Can''t wait to try it out!', '2024-01-15T11:00:00.000Z', 3),
      (1, 3, 'Looks amazing! Great work 👏', '2024-01-15T11:15:00.000Z', 2),
      (3, 1, 'Love the design aesthetic! Very clean and modern.', '2024-01-14T15:00:00.000Z', 5),
      (5, 2, 'We''ve all been there! 😂', '2024-01-13T02:30:00.000Z', 8);
    `);
    
    console.log("Database initialized with sample data");
  }
}