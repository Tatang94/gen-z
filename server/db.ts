import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";
import { db as sqliteDb, initializeDatabase } from './sqlite-db';

// Check if we have a database URL, but fall back to SQLite
let db: ReturnType<typeof drizzle> | typeof sqliteDb = sqliteDb;
let pool: Pool | null = null;

if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('supabase.co')) {
  try {
    pool = new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    db = drizzle(pool, { schema });
    console.log("PostgreSQL database connection established");
  } catch (error) {
    console.warn("Failed to connect to PostgreSQL, using SQLite:", error.message);
    db = sqliteDb;
    initializeDatabase();
  }
} else {
  console.log("Using SQLite database");
  db = sqliteDb;
  initializeDatabase();
}

export { pool, db };
