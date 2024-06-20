import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL) {
  throw new Error("Database URL not found in environment variables");
}

let sql;
try {
  sql = neon(process.env.DATABASE_URL);
  console.log("Successfully connected to database.");
} catch (error) {
  console.error("Failed to create a database connection:");
  process.exit(1); // Exit the process with an error code
}

// let db;
// try {
//   db = drizzle(sql);
// } catch (error) {
//   console.error("Failed to initialize Drizzle ORM:");
//   process.exit(1); // Exit the process with an error code
// }

export const db = drizzle(sql);
