import { existsSync } from "node:fs";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

// Applies any migrations in drizzle/ that haven't run against this database yet.
export async function runDBMigrations(
  db: NodePgDatabase<Record<string, unknown>>,
) {
  if (!existsSync("drizzle/meta/_journal.json")) return;
  await migrate(db, { migrationsFolder: "drizzle" });
}
