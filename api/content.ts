/**
 * GET /api/content: the website content the team has edited from /admin
 * (programmes, settings, portfolio, leaders). Public, and cached at the edge
 * for a minute, so an edit is live within about a minute of saving.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loadSiteContent } from "../src/lib/siteContent.server.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=600");
  return res.status(200).json({ content: await loadSiteContent() });
}
