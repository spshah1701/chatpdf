import { neon } from "@neondatabase/serverless";
import { drizzle } from 'drizzle-orm/neon-http';
import type { NeonQueryFunction } from "@neondatabase/serverless";




// neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL not found!");
}

const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL!);
// console.log(sql)

export const db = drizzle(sql);