import express from "express";
import { sql } from "drizzle-orm";
import { db, runDBMigrations } from "./db/client.js";

//Apply any new DB migrations to the DB before listing for new requests. 
await runDBMigrations();

const app = express();
app.use(express.json());

app.get("/health", async (_req, res) => {
  await db.execute(sql`select 1`);
  res.json({ ok: true });
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
