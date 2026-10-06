/**
 * /api/studio — the backend of the /studio page.
 *
 *   Authorization: Bearer <access code>
 *
 * GET  → who the code belongs to, what they have left, and their recent jobs.
 *        The page also uses this to check a code at sign-in.
 * POST → start one generation:
 *        { "type": "image", "prompt": "...", "aspect_ratio": "1:1" }
 *        { "type": "video", "prompt": "...", "duration": 5, "resolution": "720p", "aspect_ratio": "16:9" }
 *        Answers 202 with the job at once; poll GET /api/studio/:id until it is done.
 *
 * Quota is reserved before anything is sent to Higgsfield and given back if
 * the submission fails, so a client can never spend more than their quota and
 * never loses one to an error on our side.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import { BadInputError, ValidationError } from "@higgsfield/client/v2";
import { getSupabase, missingServerEnv } from "../../src/lib/supabase.server.js";
import {
  authenticateStudio,
  describeAccount,
  missingHiggsfieldEnv,
  parseGenerationRequest,
  startGeneration,
  toPublicJob,
} from "../../src/lib/higgsfield.server.js";

const RECENT_JOBS = 30;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const missing = [...missingServerEnv(), ...missingHiggsfieldEnv()];
  if (missing.length > 0) {
    console.error("Studio is not configured, missing env:", missing.join(", "));
    return res.status(500).json({
      success: false,
      error: "The studio is not configured yet.",
      missingEnv: missing,
    });
  }

  try {
    if (req.method === "GET") return await getAccount(req, res);
    return await createJob(req, res);
  } catch (error) {
    console.error(`${req.method} /api/studio failed:`, error instanceof Error ? error.message : error);
    return res.status(500).json({ success: false, error: "Something went wrong. Please try again." });
  }
}

async function getAccount(req: VercelRequest, res: VercelResponse) {
  const account = await authenticateStudio(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: "That access code is not valid." });
  }

  const { data: jobs, error } = await getSupabase()
    .from("studio_jobs")
    .select("id, kind, prompt, settings, status, result_url, created_at")
    .eq("account_id", account.id)
    .order("created_at", { ascending: false })
    .limit(RECENT_JOBS);
  if (error) throw new Error(`studio_jobs lookup failed: ${error.message}`);

  return res.status(200).json({
    success: true,
    account: describeAccount(account),
    jobs: (jobs ?? []).map(toPublicJob),
  });
}

async function createJob(req: VercelRequest, res: VercelResponse) {
  let body: unknown;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  } catch {
    return res.status(400).json({ success: false, error: "Body must be JSON." });
  }

  const parsed = parseGenerationRequest(body);
  if ("error" in parsed) {
    return res.status(400).json({ success: false, error: parsed.error });
  }
  const { request } = parsed;

  const account = await authenticateStudio(req.headers.authorization);
  if (!account) {
    return res.status(401).json({ success: false, error: "That access code is not valid." });
  }

  const db = getSupabase();
  const { data: reserved, error: reserveError } = await db.rpc("reserve_studio_credit", {
    p_account_id: account.id,
    p_kind: request.kind,
  });
  if (reserveError) throw new Error(`reserve_studio_credit failed: ${reserveError.message}`);
  if (!reserved) {
    return res.status(402).json({
      success: false,
      error: `You have used all the ${request.kind}s on your plan. Contact us to add more.`,
    });
  }

  let requestId: string;
  let status: string;
  try {
    ({ requestId, status } = await startGeneration(request));
  } catch (error) {
    await db.rpc("release_studio_credit", { p_account_id: account.id, p_kind: request.kind });
    if (error instanceof BadInputError || error instanceof ValidationError) {
      return res.status(400).json({ success: false, error: `Rejected by the model: ${error.message}` });
    }
    // Message only: SDK/axios errors can carry the Authorization header.
    console.error("Higgsfield submission failed:", error instanceof Error ? error.message : error);
    return res.status(502).json({
      success: false,
      error: "The generation service did not accept the request. Nothing was used from your plan.",
    });
  }

  const { data: job, error: insertError } = await db
    .from("studio_jobs")
    .insert({
      account_id: account.id,
      kind: request.kind,
      model: request.model,
      hf_request_id: requestId,
      prompt: request.prompt,
      settings: request.settings,
      status,
    })
    .select("id, kind, prompt, settings, status, result_url, created_at")
    .single();

  if (insertError) {
    // The generation is running and paid for; keep the quota spent and log
    // the request id so it can be recovered by hand.
    console.error(`studio_jobs insert failed for Higgsfield request ${requestId}:`, insertError.message);
    return res.status(500).json({ success: false, error: "The generation started but could not be recorded." });
  }

  const after = {
    ...account,
    images_used: account.images_used + (request.kind === "image" ? 1 : 0),
    videos_used: account.videos_used + (request.kind === "video" ? 1 : 0),
  };
  return res.status(202).json({ success: true, job: toPublicJob(job), account: describeAccount(after) });
}
