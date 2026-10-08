/**
 * GET /api/studio/:id — check on one generation.
 *
 *   Authorization: Bearer <access code>
 *
 * While the job is unfinished, each call asks Higgsfield for its current state
 * and records it. Once it is finished the stored row is answered directly.
 *
 * Failed, moderated and canceled jobs give the quota back, because Higgsfield
 * refunds those credits too.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase, missingServerEnv } from "../../src/lib/supabase.server.js";
import {
  authenticateStudio,
  getGenerationStatus,
  missingHiggsfieldEnv,
  toPublicJob,
} from "../../src/lib/higgsfield.server.js";
import { isTerminal, type GenerationStatus } from "../../src/data/studioOptions.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const missing = [...missingServerEnv(), ...missingHiggsfieldEnv()];
  if (missing.length > 0) {
    return res.status(500).json({
      success: false,
      error: "The studio is not configured yet.",
      missingEnv: missing,
    });
  }

  const id = String(req.query.id ?? "");
  if (!UUID.test(id)) {
    return res.status(404).json({ success: false, error: "Not found." });
  }

  try {
    const account = await authenticateStudio(req.headers.authorization);
    if (!account) {
      return res.status(401).json({ success: false, error: "That access code is not valid." });
    }

    const db = getSupabase();
    const { data: job, error } = await db
      .from("studio_jobs")
      .select("id, kind, hf_request_id, prompt, settings, status, result_url, created_at")
      .eq("id", id)
      .eq("account_id", account.id) // someone else's job answers 404, not 403
      .maybeSingle();

    if (error) throw new Error(`studio_jobs lookup failed: ${error.message}`);
    if (!job) return res.status(404).json({ success: false, error: "Not found." });

    if (!isTerminal(job.status)) {
      const latest = await getGenerationStatus(job.hf_request_id);
      let status: GenerationStatus = latest.status;
      // Never report success without something to show.
      if (status === "completed" && !latest.resultUrl) status = "failed";

      // Only the call that moves the row out of an unfinished state may give
      // quota back, so concurrent polls cannot refund twice.
      const { data: updated, error: updateError } = await db
        .from("studio_jobs")
        .update({ status, result_url: latest.resultUrl, updated_at: new Date().toISOString() })
        .eq("id", job.id)
        .in("status", ["queued", "in_progress"])
        .select("id");
      if (updateError) throw new Error(`studio_jobs update failed: ${updateError.message}`);

      const refundable = status === "failed" || status === "nsfw" || status === "canceled";
      if (refundable && updated && updated.length > 0) {
        await db.rpc("release_studio_credit", { p_account_id: account.id, p_kind: job.kind });
      }

      job.status = status;
      job.result_url = latest.resultUrl;
    }

    return res.status(200).json({ success: true, job: toPublicJob(job) });
  } catch (error) {
    console.error("GET /api/studio/:id failed:", error instanceof Error ? error.message : error);
    return res.status(500).json({ success: false, error: "Could not check this one. Please try again." });
  }
}
