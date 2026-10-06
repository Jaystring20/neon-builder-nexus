/**
 * Higgsfield image and video generation for serverless functions.
 *
 * Like supabase.server.ts, this module reads secrets from process.env and must
 * never be imported by anything that ships to the browser: HF_CREDENTIALS
 * spends real money.
 *
 * Generations can take minutes, longer than a Vercel function may run, so
 * nothing here waits for a result. startGeneration() submits and returns the
 * request id at once; getGenerationStatus() asks Higgsfield where it is now.
 */

import { createHash } from "node:crypto";
import { createHiggsfieldClient, type HiggsfieldClient } from "@higgsfield/client/v2";
import { getSupabase } from "./supabase.server.js";
import {
  DEFAULTS,
  IMAGE_ASPECT_RATIOS,
  MAX_PROMPT_LENGTH,
  STUDIO_MODELS,
  VIDEO_ASPECT_RATIOS,
  VIDEO_DURATIONS,
  VIDEO_RESOLUTIONS,
  type GenerationKind,
  type GenerationStatus,
} from "../data/studioOptions.js";

const HF_API = "https://api.higgsfield.ai";

export interface GenerationRequest {
  kind: GenerationKind;
  model: string;
  prompt: string;
  /** Model input minus the prompt; stored with the job. */
  settings: Record<string, string | number>;
}

/** Names of missing variables, never values. */
export function missingHiggsfieldEnv(): string[] {
  return process.env.HF_CREDENTIALS ? [] : ["HF_CREDENTIALS"];
}

const oneOf = (name: string, value: unknown, allowed: readonly (string | number)[]) =>
  allowed.includes(value as never) ? null : `'${name}' must be one of: ${allowed.join(", ")}.`;

/** Checks a request body. Returns the cleaned request, or a message for the caller. */
export function parseGenerationRequest(body: unknown): { request: GenerationRequest } | { error: string } {
  const raw = (body ?? {}) as Record<string, unknown>;

  const kind = raw.type;
  if (kind !== "image" && kind !== "video") {
    return { error: "'type' must be \"image\" or \"video\"." };
  }

  const prompt = typeof raw.prompt === "string" ? raw.prompt.trim() : "";
  if (!prompt) return { error: "'prompt' is required." };
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return { error: `'prompt' must be at most ${MAX_PROMPT_LENGTH} characters.` };
  }

  if (kind === "image") {
    const aspect_ratio = raw.aspect_ratio === undefined ? DEFAULTS.image.aspect_ratio : String(raw.aspect_ratio);
    const error = oneOf("aspect_ratio", aspect_ratio, IMAGE_ASPECT_RATIOS);
    if (error) return { error };
    // safety_tolerance 2 is the value Higgsfield's own SDK examples use.
    return { request: { kind, model: STUDIO_MODELS.image, prompt, settings: { aspect_ratio, safety_tolerance: 2 } } };
  }

  const aspect_ratio = raw.aspect_ratio === undefined ? DEFAULTS.video.aspect_ratio : String(raw.aspect_ratio);
  const duration = raw.duration === undefined ? DEFAULTS.video.duration : Number(raw.duration);
  const resolution = raw.resolution === undefined ? DEFAULTS.video.resolution : String(raw.resolution);
  const error =
    oneOf("aspect_ratio", aspect_ratio, VIDEO_ASPECT_RATIOS) ??
    oneOf("duration", duration, VIDEO_DURATIONS) ??
    oneOf("resolution", resolution, VIDEO_RESOLUTIONS);
  if (error) return { error };
  return { request: { kind, model: STUDIO_MODELS.video, prompt, settings: { aspect_ratio, duration, resolution } } };
}

export function hashAccessCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export interface StudioAccount {
  id: string;
  name: string;
  is_team: boolean;
  image_quota: number;
  images_used: number;
  video_quota: number;
  videos_used: number;
}

/**
 * Resolves `Authorization: Bearer <access code>` to an active account, or null.
 * Codes are 32 random bytes, so a hash lookup is enough; there is nothing to
 * guess.
 */
export async function authenticateStudio(authorization: string | undefined): Promise<StudioAccount | null> {
  const match = /^Bearer\s+(\S+)$/i.exec(authorization ?? "");
  if (!match) return null;

  const { data, error } = await getSupabase()
    .from("studio_accounts")
    .select("id, name, is_team, image_quota, images_used, video_quota, videos_used")
    .eq("access_code_hash", hashAccessCode(match[1]))
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(`studio_accounts lookup failed: ${error.message}`);
  return (data as StudioAccount) ?? null;
}

/** What the page shows about an account. Remaining is null for team accounts. */
export function describeAccount(account: StudioAccount) {
  return {
    name: account.name,
    isTeam: account.is_team,
    imagesRemaining: account.is_team ? null : Math.max(account.image_quota - account.images_used, 0),
    videosRemaining: account.is_team ? null : Math.max(account.video_quota - account.videos_used, 0),
  };
}

/** A job as the page sees it: no Higgsfield ids, and a URL only once it is done. */
export const toPublicJob = (job: Record<string, unknown>) => ({
  id: job.id,
  type: job.kind,
  prompt: job.prompt,
  settings: job.settings,
  status: job.status,
  resultUrl: job.status === "completed" ? job.result_url : null,
  createdAt: job.created_at,
});

let cachedClient: HiggsfieldClient | null = null;

// Built on first use so a missing variable surfaces as a named 500 from the
// handler instead of a crash at import time.
function higgsfield(): HiggsfieldClient {
  if (!cachedClient) cachedClient = createHiggsfieldClient();
  return cachedClient;
}

/** Submits a generation without waiting for it. Returns Higgsfield's request id. */
export async function startGeneration(
  request: GenerationRequest
): Promise<{ requestId: string; status: GenerationStatus }> {
  const response = await higgsfield().subscribe(request.model, {
    input: { prompt: request.prompt, ...request.settings },
    withPolling: false,
  });
  return { requestId: response.request_id, status: response.status as GenerationStatus };
}

/** Asks Higgsfield for the current state of one request. */
export async function getGenerationStatus(
  requestId: string
): Promise<{ status: GenerationStatus; resultUrl: string | null }> {
  const res = await fetch(`${HF_API}/requests/${encodeURIComponent(requestId)}/status`, {
    headers: { Authorization: `Key ${process.env.HF_CREDENTIALS}` },
  });
  if (!res.ok) {
    throw new Error(`Higgsfield status check failed with HTTP ${res.status}`);
  }
  const body = (await res.json()) as {
    status: GenerationStatus;
    video?: { url?: string };
    images?: { url?: string }[];
  };
  return { status: body.status, resultUrl: body.video?.url ?? body.images?.[0]?.url ?? null };
}
