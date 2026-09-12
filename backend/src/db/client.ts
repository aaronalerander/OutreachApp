import { existsSync } from "node:fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env for local development.",
  );
}

export const pool = new pg.Pool({ connectionString: databaseUrl });
export const db = drizzle(pool);

// Applies any migrations in drizzle/ that haven't run against this database yet.
// Skips until the first migration is generated (drizzle-kit creates the journal).
export async function runDBMigrations() {
  if (!existsSync("drizzle/meta/_journal.json")) return;
  await migrate(db, { migrationsFolder: "drizzle" });
}
