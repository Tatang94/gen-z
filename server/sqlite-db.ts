import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "../shared/sqlite-schema";

// Create SQLite database
const sqlite = new Database('database.sqlite');
export const db = drizzle(sqlite, { schema });

// Initialize tables and sample data
export async function initializeDatabase() {
  console.log('Initializing SQLite database...');
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
      music TEXT,
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

  // Populate with Indonesian users and posts
  const users = [
    {
      username: 'andi_jakarta',
      password: 'password123',
      display_name: 'Andi Pratama',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Content creator Jakarta 🇮🇩 | Mahasiswa UI | Suka traveling & kuliner',
      followers: 8750,
      following: 543,
      posts_count: 187,
      is_verified: 1,
      join_date: '2023-02-10',
      is_online: 1
    },
    {
      username: 'sari_bandung',
      password: 'password123',
      display_name: 'Sari Indah',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Photographer 📸 | Bandung vibes | Coffee lover ☕ | Aesthetic enthusiast',
      followers: 12300,
      following: 398,
      posts_count: 234,
      is_verified: 1,
      join_date: '2022-11-18',
      is_online: 1
    },
    {
      username: 'budi_surabaya',
      password: 'password123',
      display_name: 'Budi Santoso',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Entrepreneur muda 💼 | Tech startup | Surabaya | Always learning 📚',
      followers: 6890,
      following: 412,
      posts_count: 156,
      is_verified: 0,
      join_date: '2023-04-05',
      is_online: 1
    },
    {
      username: 'maya_yogya',
      password: 'password123',
      display_name: 'Maya Kusuma',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Mahasiswa UGM 🎓 | Art enthusiast 🎨 | Yogyakarta | Traditional meets modern',
      followers: 5670,
      following: 289,
      posts_count: 123,
      is_verified: 0,
      join_date: '2023-06-12',
      is_online: 0
    },
    {
      username: 'rio_bali',
      password: 'password123',
      display_name: 'Rio Mahendra',
      avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150',
      bio: 'Surfer 🏄‍♂️ | Bali life | Digital nomad | Sunset chaser 🌅',
      followers: 9450,
      following: 356,
      posts_count: 201,
      is_verified: 1,
      join_date: '2022-09-20',
      is_online: 1
    }
  ];

  const posts = [
    {
      user_id: 1,
      content: 'Pagi yang cerah di Jakarta! Sarapan dulu sebelum kuliah 🌅☕ #JakartaLife #MahasiswaUI #Morning',
      image: 'https://images.pexels.com/photos/1002703/pexels-photo-1002703.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      likes: 156,
      shares: 8
    },
    {
      user_id: 2,
      content: 'Hunting foto di Dago, Bandung! Cuaca mendukung banget hari ini 📸✨ #BandungVibes #Photography #Dago',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      likes: 234,
      shares: 15
    },
    {
      user_id: 3,
      content: 'Startup life be like... coding sampai tengah malam 💻🚀 #StartupLife #Surabaya #Entrepreneur #TechLife',
      image: null,
      music: null,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      likes: 89,
      shares: 12
    },
    {
      user_id: 4,
      content: 'Seni batik meets digital art! Bangga sama warisan budaya kita 🇮🇩🎨 #BatikModern #YogyakartaArt #Indonesia',
      image: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
      likes: 312,
      shares: 28
    },
    {
      user_id: 5,
      content: 'Sunset surf session di Uluwatu! Life is good di Pulau Dewata 🏄‍♂️🌅 #BaliLife #Surfing #Uluwatu #Paradise',
      image: 'https://images.pexels.com/photos/390051/surfer-wave-sunset-the-indian-ocean-390051.jpeg?auto=compress&cs=tinysrgb&w=600',
      music: null,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      likes: 445,
      shares: 34
    }
  ];

  const stories = [
    {
      user_id: 1,
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      is_viewed: 0
    },
    {
      user_id: 2,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      is_viewed: 0
    },
    {
      user_id: 4,
      image: 'https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      is_viewed: 0
    },
    {
      user_id: 5,
      image: 'https://images.pexels.com/photos/1032653/pexels-photo-1032653.jpeg?auto=compress&cs=tinysrgb&w=300',
      timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      is_viewed: 1
    }
  ];

  // Insert data only if tables are empty
  try {
    const userCount = sqlite.prepare('SELECT COUNT(*) as count FROM users').get()?.count;
    if (userCount === 0) {
      console.log('Populating database with Indonesian data...');
      
      // Insert users
      const insertUser = sqlite.prepare(`
        INSERT INTO users (username, password, display_name, avatar, bio, followers, following, posts_count, is_verified, join_date, is_online)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      users.forEach(user => {
        insertUser.run(
          user.username, user.password, user.display_name, user.avatar, user.bio,
          user.followers, user.following, user.posts_count, user.is_verified,
          user.join_date, user.is_online
        );
      });

      // Insert posts
      const insertPost = sqlite.prepare(`
        INSERT INTO posts (user_id, content, image, music, timestamp, likes, shares)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      posts.forEach(post => {
        insertPost.run(
          post.user_id, post.content, post.image, post.music,
          post.timestamp, post.likes, post.shares
        );
      });

      // Insert stories
      const insertStory = sqlite.prepare(`
        INSERT INTO stories (user_id, image, timestamp, is_viewed)
        VALUES (?, ?, ?, ?)
      `);
      
      stories.forEach(story => {
        insertStory.run(story.user_id, story.image, story.timestamp, story.is_viewed);
      });

      console.log('Database populated with Indonesian data successfully!');
    } else {
      console.log('Database already has data, skipping population.');
    }
  } catch (error) {
    console.error('Error populating database:', error);
  }

  console.log("Database initialized - ready for production use");
}