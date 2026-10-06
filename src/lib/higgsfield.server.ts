/**
 * Higgsfield video generation for serverless functions.
 *
 * Like supabase.server.ts, this module reads secrets from process.env and must
 * never be imported by anything that ships to the browser: HF_CREDENTIALS
 * spends real money.
 *
 * Generations take minutes, far longer than a Vercel function may run, so
 * nothing here waits for a video. startVideo() submits and returns the request
 * id at once; getVideoStatus() asks Higgsfield where that request is now.
 */

import { createHash } from "node:crypto";
import { createHiggsfieldClient, type HiggsfieldClient } from "@higgsfield/client/v2";
import { getSupabase } from "./supabase.server.js";

export const VIDEO_MODEL = "bytedance/seedance-2.5/text-to-video";
const HF_API = "https://api.higgsfield.ai";

/*
 * What clients may ask for. These bound the cost of a single request, so keep
 * them deliberate. The values were not checked against the model's reference
 * page (unreachable from where this was written); if Higgsfield rejects one,
 * the request fails with a 400 and the client's quota is given back.
 */
export const ALLOWED_DURATIONS = [5, 10] as const;
export const ALLOWED_RESOLUTIONS = ["480p", "720p"] as const;
export const ALLOWED_ASPECT_RATIOS = ["16:9", "9:16", "1:1"] as const;
export const MAX_PROMPT_LENGTH = 2000;

export type VideoStatus = "queued" | "in_progress" | "completed" | "failed" | "nsfw" | "canceled";
export const TERMINAL_STATUSES: VideoStatus[] = ["completed", "failed", "nsfw", "canceled"];

export interface VideoInput {
  prompt: string;
  duration: number;
  resolution: string;
  aspect_ratio: string;
}

/** Names of missing variables, never values. */
export function missingHiggsfieldEnv(): string[] {
  return process.env.HF_CREDENTIALS ? [] : ["HF_CREDENTIALS"];
}

/**
 * Checks a request body. Returns the cleaned input, or a message for the client.
 * Defaults match the original example: 5 seconds, 720p, 16:9.
 */
export function parseVideoInput(body: unknown): { input: VideoInput } | { error: string } {
  const raw = (body ?? {}) as Record<string, unknown>;

  const prompt = typeof raw.prompt === "string" ? raw.prompt.trim() : "";
  if (!prompt) return { error: "'prompt' is required." };
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { error: `'prompt' must be at most ${MAX_PROMPT_LENGTH} characters.` };
  }

  const duration = raw.duration === undefined ? 5 : Number(raw.duration);
  if (!(ALLOWED_DURATIONS as readonly number[]).includes(duration)) {
    return { error: `'duration' must be one of: ${ALLOWED_DURATIONS.join(", ")}.` };
  }

  const resolution = raw.resolution === undefined ? "720p" : String(raw.resolution);
  if (!(ALLOWED_RESOLUTIONS as readonly string[]).includes(resolution)) {
    return { error: `'resolution' must be one of: ${ALLOWED_RESOLUTIONS.join(", ")}.` };
  }

  const aspect_ratio = raw.aspect_ratio === undefined ? "16:9" : String(raw.aspect_ratio);
  if (!(ALLOWED_ASPECT_RATIOS as readonly string[]).includes(aspect_ratio)) {
    return { error: `'aspect_ratio' must be one of: ${ALLOWED_ASPECT_RATIOS.join(", ")}.` };
  }

  return { input: { prompt, duration, resolution, aspect_ratio } };
}

export function hashAccessCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export interface VideoClient {
  id: string;
  name: string;
  video_quota: number;
  videos_used: number;
}

/**
 * Resolves `Authorization: Bearer <access code>` to an active client, or null.
 * Codes are 32 random bytes, so a hash lookup is enough; there is nothing to
 * guess.
 */
export async function authenticateVideoClient(
  authorization: string | undefined
): Promise<VideoClient | null> {
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? "");
  if (!match) return null;

  const { data, error } = await getSupabase()
    .from("video_clients")
    .select("id, name, video_quota, videos_used")
    .eq("access_code_hash", hashAccessCode(match[1]))
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`video_clients lookup failed: ${error.message}`);
  return (data as VideoClient) ?? null;
}

let cachedClient: HiggsfieldClient | null = null;

// Built on first use so a missing variable surfaces as a named 500 from the
// handler instead of a crash at import time.
function higgsfield(): HiggsfieldClient {
  if (!cachedClient) cachedClient = createHiggsfieldClient();
  return cachedClient;
}

/** Submits a generation without waiting for it. Returns Higgsfield's request id. */
export async function startVideo(input: VideoInput): Promise<{ requestId: string; status: VideoStatus }> {
  const response = await higgsfield().subscribe(VIDEO_MODEL, { input, withPolling: false });
  return { requestId: response.request_id, status: response.status as VideoStatus };
}

/** Asks Higgsfield for the current state of one request. */
export async function getVideoStatus(
  requestId: string
): Promise<{ status: VideoStatus; videoUrl: string | null }> {
  const res = await fetch(`${HF_API}/requests/${encodeURIComponent(requestId)}/status`, {
    headers: { Authorization: `Key ${process.env.HF_CREDENTIALS}` },
  });
  if (!res.ok) {
    throw new Error(`Higgsfield status check failed with HTTP ${res.status}`);
  }
  const body = (await res.json()) as { status: VideoStatus; video?: { url?: string } };
  return { status: body.status, videoUrl: body.video?.url ?? null };
}
