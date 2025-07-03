import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Check if we have a database URL, but don't fail immediately
let db: ReturnType<typeof drizzle> | null = null;
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  try {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzle({ client: pool, schema });
  } catch (error) {
    console.warn("Failed to connect to database:", error);
  }
}

export { pool, db };
