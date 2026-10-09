/**
 * Reads the team's website edits (site_content) on the server. Server-side
 * only. Any failure returns no edits, so callers fall back to the original
 * content rather than failing a request over it.
 */

import { CONTENT_KEYS, type SiteContent } from "../data/siteContent.js";
import { getSupabase, missingServerEnv } from "./supabase.server.js";

export async function loadSiteContent(): Promise<SiteContent> {
  if (missingServerEnv().length) return {};
  try {
    const { data, error } = await getSupabase().from("site_content").select("key,value").in("key", [...CONTENT_KEYS]);
    if (error) {
      console.error("site_content read failed:", error.message);
      return {};
    }
    return Object.fromEntries((data ?? []).map((r: { key: string; value: unknown }) => [r.key, r.value])) as SiteContent;
  } catch (err) {
    console.error("site_content read failed:", err);
    return {};
  }
}
