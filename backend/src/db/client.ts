import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Copy .env.example to .env for local development.",
  );
}

export const pool = new pg.Pool({ connectionString: databaseUrl });

export const db = drizzle(pool);

// If the database drops an idle connection (e.g. it restarts), pg emits an
// error on the pool. Without a listener, Node treats that as fatal and the
// server crashes. Log it instead; the pool opens a fresh connection the next time a db request comes through.
pool.on("error", (error) => {
  console.error("Idle database connection closed:", error.message);
});

