import type { Request, Response } from "express";
import { sql } from "drizzle-orm";
import { db } from "#src/db/client.js";

export async function checkDbHealth(_req: Request, res: Response) {
  try {
    await db.execute(sql`select 1`);
    res.json({ ok: true });
  } catch (error) {
    console.error("Database health check failed:", error);
    res.status(503).json({ ok: false, error: "Database unreachable" });
  }
}
