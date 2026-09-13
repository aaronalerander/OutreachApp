import type { Request, Response } from "express";

export function checkServerHealth(_req: Request, res: Response) {
  res.json({ ok: true });
}
