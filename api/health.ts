/**
 * GET /api/health: is the site's backend alive?
 *
 * Point a free uptime monitor (UptimeRobot, Better Stack) here. Each check
 * makes one tiny database read, which also keeps a free Supabase project from
 * being paused for inactivity, and the monitor emails DCH if it ever fails.
 *
 * Says only "up" or "down": it is public, so it never returns data.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase, missingServerEnv } from "../src/lib/supabase.server.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (missingServerEnv().length > 0) return res.status(503).json({ ok: false, db: "not configured" });

  const started = Date.now();
  try {
    const { error } = await getSupabase().from("leads").select("id", { count: "exact", head: true });
    if (error) {
      console.error("Health check: database error:", error.message);
      return res.status(503).json({ ok: false, db: "down" });
    }
    return res.status(200).json({ ok: true, db: "up", ms: Date.now() - started });
  } catch (err) {
    console.error("Health check failed:", err);
    return res.status(503).json({ ok: false, db: "down" });
  }
}
