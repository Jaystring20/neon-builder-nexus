/**
 * GET /api/videos/:id — a client checks on one of their generations.
 *
 *   Authorization: Bearer <client access code>
 *
 * While the job is unfinished, each call asks Higgsfield for its current state
 * and records it. Once it is terminal the stored row is answered directly.
 * Poll every 5–10 seconds; a 5-second video usually takes a few minutes.
 *
 * Failed, moderated and canceled jobs give the client's quota back, because
 * Higgsfield refunds those credits too.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase, missingServerEnv } from "../../src/lib/supabase.server.js";
import {
  TERMINAL_STATUSES,
  authenticateVideoClient,
  getVideoStatus,
  missingHiggsfieldEnv,
  type VideoStatus,
} from "../../src/lib/higgsfield.server.js";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const MESSAGES: Partial<Record<VideoStatus, string>> = {
  failed: "The generation failed. Your quota was given back.",
  nsfw: "The prompt was rejected by content moderation. Your quota was given back.",
  canceled: "The generation was canceled. Your quota was given back.",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const missing = [...missingServerEnv(), ...missingHiggsfieldEnv()];
  if (missing.length > 0) {
    return res.status(500).json({
      success: false,
      error: "Video generation is not configured yet.",
      missingEnv: missing,
    });
  }

  const id = String(req.query.id ?? "");
  if (!UUID.test(id)) {
    return res.status(404).json({ success: false, error: "Video not found." });
  }

  try {
    const client = await authenticateVideoClient(req.headers.authorization);
    if (!client) {
      return res.status(401).json({ success: false, error: "Missing or invalid access code." });
    }

    const db = getSupabase();
    const { data: job, error } = await db
      .from("video_jobs")
      .select("id, hf_request_id, status, video_url, prompt, created_at")
      .eq("id", id)
      .eq("client_id", client.id) // another client's id answers 404, not 403
      .maybeSingle();

    if (error) throw new Error(`video_jobs lookup failed: ${error.message}`);
    if (!job) return res.status(404).json({ success: false, error: "Video not found." });

    let status = job.status as VideoStatus;
    let videoUrl: string | null = job.video_url;

    if (!TERMINAL_STATUSES.includes(status)) {
      const latest = await getVideoStatus(job.hf_request_id);
      status = latest.status;
      videoUrl = latest.videoUrl;

      if (status === "completed" && !videoUrl) {
        // Never report success without something to show.
        status = "failed";
      }

      // Only the call that moves the row out of an unfinished state may
      // release quota, so concurrent polls cannot refund twice.
      const { data: updated, error: updateError } = await db
        .from("video_jobs")
        .update({ status, video_url: videoUrl, updated_at: new Date().toISOString() })
        .eq("id", job.id)
        .in("status", ["queued", "in_progress"])
        .select("id");
      if (updateError) throw new Error(`video_jobs update failed: ${updateError.message}`);

      const refundable = status === "failed" || status === "nsfw" || status === "canceled";
      if (refundable && updated && updated.length > 0) {
        await db.rpc("release_video_credit", { p_client_id: client.id });
      }
    }

    return res.status(200).json({
      success: true,
      job: {
        id: job.id,
        status,
        done: TERMINAL_STATUSES.includes(status),
        videoUrl: status === "completed" ? videoUrl : null,
        message: MESSAGES[status] ?? null,
        prompt: job.prompt,
        createdAt: job.created_at,
      },
    });
  } catch (error) {
    console.error("GET /api/videos/:id failed:", error instanceof Error ? error.message : error);
    return res.status(500).json({ success: false, error: "Could not check the video. Please try again." });
  }
}
