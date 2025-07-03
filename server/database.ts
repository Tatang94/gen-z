import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

let db: ReturnType<typeof drizzle>;
let pool: Pool | null = null;

export async function initializeDatabase() {
  if (process.env.DATABASE_URL) {
    try {
      console.log("Connecting to PostgreSQL database...");
      
      pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('supabase.co') || 
             process.env.DATABASE_URL.includes('neon.tech') || 
             process.env.DATABASE_URL.includes('railway.app')
          ? { rejectUnauthorized: false } 
          : false
      });
      
      // Test connection
      await pool.query('SELECT 1');
      
      db = drizzle(pool, { schema });
      console.log("✅ PostgreSQL database connected successfully");
      
      // Create tables if they don't exist
      await createTables();
      
      return { db, pool };
    } catch (error: any) {
      console.error("❌ Failed to connect to PostgreSQL:", error.message);
      throw error;
    }
  } else {
    throw new Error("DATABASE_URL environment variable is required");
  }
}

async function createTables() {
  if (!pool) return;
  
  try {
    // Create tables using raw SQL
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        display_name VARCHAR(255) NOT NULL,
        avatar TEXT,
        bio TEXT,
        followers INTEGER DEFAULT 0,
        following INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        is_verified BOOLEAN DEFAULT false,
        join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_online BOOLEAN DEFAULT false
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        image TEXT,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0,
        shares INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id SERIAL PRIMARY KEY,
        post_id INTEGER REFERENCES posts(id),
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        likes INTEGER DEFAULT 0
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        image TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ Database tables created/verified");
    
    // Insert sample data if tables are empty
    await insertSampleData();
    
  } catch (error: any) {
    console.error("Error creating tables:", error.message);
  }
}

async function insertSampleData() {
  if (!pool) return;
  
  try {
    // Check if users table has data
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    
    if (parseInt(userCount.rows[0].count) === 0) {
      console.log("Inserting sample data...");
      
      // Insert sample users
      await pool.query(`
        INSERT INTO users (username, password, display_name, avatar, bio, followers, following, posts_count, is_verified, is_online) VALUES
        ('sarah_chen', 'password123', 'Sarah Chen', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', 'UI/UX Designer • Coffee lover ☕', 1247, 892, 23, true, true),
        ('alex_dev', 'password123', 'Alex Rodriguez', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', 'Full-stack developer 💻 | Tech enthusiast', 856, 1034, 15, false, true),
        ('emma_art', 'password123', 'Emma Wilson', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', 'Digital artist 🎨 | Creative soul', 2103, 467, 45, true, false),
        ('mike_photo', 'password123', 'Mike Johnson', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', 'Photographer 📸 | Travel addict', 1876, 723, 67, false, true)
      `);
      
      // Insert sample posts
      await pool.query(`
        INSERT INTO posts (user_id, content, image, likes, shares) VALUES
        (1, 'Just launched my new design project! 🚀 Really excited to share this with everyone. What do you think?', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop', 234, 45),
        (2, 'Working on a new React component library. The developer experience is getting so much better! 💻', null, 187, 23),
        (3, 'New digital artwork completed! Spent 3 days perfecting every detail. Art is my passion ❤️', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop', 456, 78),
        (4, 'Captured this amazing sunset during my trip to Bali. Nature never fails to amaze me! 🌅', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', 892, 156)
      `);
      
      // Insert sample comments
      await pool.query(`
        INSERT INTO comments (post_id, user_id, content, likes) VALUES
        (1, 2, 'This looks amazing! Great work Sarah 👏', 12),
        (1, 3, 'Love the color scheme you chose!', 8),
        (2, 1, 'Can''t wait to try this out in my next project!', 15),
        (3, 4, 'Your art always inspires me. Keep it up!', 23),
        (4, 1, 'Wow! This is breathtaking. Bali is on my bucket list now!', 34)
      `);
      
      // Insert sample stories
      await pool.query(`
        INSERT INTO stories (user_id, image) VALUES
        (1, 'https://picsum.photos/400/600?random=1'),
        (2, 'https://picsum.photos/400/600?random=2'),
        (3, 'https://picsum.photos/400/600?random=3'),
        (4, 'https://picsum.photos/400/600?random=4')
      `);
      
      console.log("✅ Sample data inserted successfully");
    }
  } catch (error: any) {
    console.error("Error inserting sample data:", error.message);
  }
}

export { db, pool };