import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { db as sqliteDb, initializeDatabase } from './sqlite-db';

// Check if we have a database URL, but fall back to SQLite
let db: ReturnType<typeof drizzle> | typeof sqliteDb = sqliteDb;
let pool: Pool | null = null;

async function initializeDB() {
  if (process.env.DATABASE_URL) {
    try {
      console.log("Attempting to connect to PostgreSQL...");
      pool = new Pool({ 
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_URL.includes('supabase.co') || process.env.DATABASE_URL.includes('neon.tech') 
          ? { rejectUnauthorized: false } 
          : false
      });
      
      // Test connection
      await pool.query('SELECT 1');
      
      db = drizzle(pool, { schema });
      console.log("PostgreSQL database connection established");
    } catch (error: any) {
      console.warn("Failed to connect to PostgreSQL, using SQLite:", error.message);
      db = sqliteDb;
      initializeDatabase();
    }
  } else {
    console.log("Using SQLite database");
    db = sqliteDb;
    initializeDatabase();
  }
}

// Initialize database connection
initializeDB();

export { pool, db };
