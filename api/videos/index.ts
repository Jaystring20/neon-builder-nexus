/**
 * POST /api/videos — a client starts one text-to-video generation.
 *
 *   Authorization: Bearer <client access code>
 *   { "prompt": "...", "duration": 5, "resolution": "720p", "aspect_ratio": "16:9" }
 *
 * Answers 202 with the job id at once; the video itself takes minutes, so the
 * caller polls GET /api/videos/:id until the status is terminal.
 *
 * Quota is reserved before anything is sent to Higgsfield and given back if
 * the submission fails, so a client can never spend more than their quota and
 * never loses one to an error on our side.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase, missingServerEnv } from "../../src/lib/supabase.server.js";
import {
  authenticateVideoClient,
  missingHiggsfieldEnv,
  parseVideoInput,
  startVideo,
} from "../../src/lib/higgsfield.server.js";
import { BadInputError, ValidationError } from "@higgsfield/client/v2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const missing = [...missingServerEnv(), ...missingHiggsfieldEnv()];
  if (missing.length > 0) {
    console.error("Video generation is not configured, missing env:", missing.join(", "));
    return res.status(500).json({
      success: false,
      error: "Video generation is not configured yet.",
      missingEnv: missing,
    });
  }

  let body: unknown;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  } catch {
    return res.status(400).json({ success: false, error: "Body must be JSON." });
  }

  const parsed = parseVideoInput(body);
  if ("error" in parsed) {
    return res.status(400).json({ success: false, error: parsed.error });
  }
  const { input } = parsed;

  try {
    const client = await authenticateVideoClient(req.headers.authorization);
    if (!client) {
      return res.status(401).json({ success: false, error: "Missing or invalid access code." });
    }

    const db = getSupabase();

    const { data: reserved, error: reserveError } = await db.rpc("reserve_video_credit", {
      p_client_id: client.id,
    });
    if (reserveError) throw new Error(`reserve_video_credit failed: ${reserveError.message}`);
    if (!reserved) {
      return res.status(402).json({
        success: false,
        error: "You have used all the videos on your plan. Contact us to add more.",
      });
    }

    let requestId: string;
    let status: string;
    try {
      ({ requestId, status } = await startVideo(input));
    } catch (error) {
      await db.rpc("release_video_credit", { p_client_id: client.id });
      if (error instanceof BadInputError || error instanceof ValidationError) {
        return res.status(400).json({ success: false, error: `Rejected by the model: ${error.message}` });
      }
      // Message only: SDK/axios errors can carry the Authorization header.
      console.error("Higgsfield submission failed:", error instanceof Error ? error.message : error);
      return res.status(502).json({
        success: false,
        error: "The video service did not accept the request. Your quota was not used.",
      });
    }

    const { data: job, error: insertError } = await db
      .from("video_jobs")
      .insert({ client_id: client.id, hf_request_id: requestId, status, ...input })
      .select("id, status, created_at")
      .single();

    if (insertError) {
      // The generation is running and paid for; keep the quota spent and log
      // the request id so it can be recovered by hand.
      console.error(`video_jobs insert failed for Higgsfield request ${requestId}:`, insertError.message);
      return res.status(500).json({ success: false, error: "The video started but could not be recorded." });
    }

    return res.status(202).json({
      success: true,
      job: { id: job.id, status: job.status, createdAt: job.created_at },
      remaining: client.video_quota - client.videos_used - 1,
    });
  } catch (error) {
    console.error("POST /api/videos failed:", error instanceof Error ? error.message : error);
    return res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
}
