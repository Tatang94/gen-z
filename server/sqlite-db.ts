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

  // Database tables are now clean and ready for use
  console.log("Database initialized - ready for production use");
}