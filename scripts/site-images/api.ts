/**
 * Minimal Higgsfield REST client shared by the site-image scripts.
 *
 * Credentials: if HF_CREDENTIALS is set (e.g. in .env.local) it is sent as
 * `Authorization: Key ...`. If it is not, no Authorization header is sent and
 * the environment's network secret for api.higgsfield.ai supplies it. Calls go
 * straight to the REST API rather than through the SDK because the SDK
 * refuses to run without a local credential.
 *
 * Node's built-in fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY is set
 * at startup, and the network secret is only added by that proxy. So when a
 * proxy is configured, importing this module re-runs the current script once
 * with the flag on.
 */

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const child = spawnSync(process.execPath, [...process.execArgv, ...process.argv.slice(1)], {
    stdio: "inherit",
    env: { ...process.env, NODE_USE_ENV_PROXY: "1" },
  });
  process.exit(child.status ?? 1);
}

const API = "https://api.higgsfield.ai";
const POLL_MS = 4000;

const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
if (process.env.HF_CREDENTIALS) headers.Authorization = `Key ${process.env.HF_CREDENTIALS}`;

export interface Result {
  status: string;
  request_id: string;
  images?: { url?: string }[];
  video?: { url?: string };
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    // The body is Higgsfield's error message; it never contains our credential.
    throw new Error(`HTTP ${res.status} from ${path.split("?")[0]}: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text) as T;
}

/** Node reports a dropped connection as "fetch failed"; the real reason is in `cause`. */
export function describe(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const cause = (error as Error & { cause?: { code?: string; message?: string } }).cause;
  const detail = cause?.code ?? cause?.message;
  return detail ? `${error.message} (${detail})` : error.message;
}

const isNetworkError = (error: unknown) => error instanceof TypeError;

/**
 * Retries a read-only step when the connection drops. Never used for the
 * request that starts a generation, so a retry can never pay twice.
 */
async function retrying<T>(what: string, step: () => Promise<T>): Promise<T> {
  const delays = [2000, 4000, 8000, 16000, 30000];
  for (let attempt = 0; ; attempt++) {
    try {
      return await step();
    } catch (error) {
      if (!isNetworkError(error) || attempt >= delays.length) throw error;
      console.log(`      connection dropped while ${what} (${describe(error)}); retrying in ${delays[attempt] / 1000}s`);
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
}

const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"]);

/**
 * Submits one generation (or, with `resumeId`, picks up one already paid for)
 * and polls until it reaches a terminal state. Throws on anything but
 * `completed`, with moderation called out because Higgsfield refunds it.
 */
export async function generate(
  model: string,
  body: object,
  maxWaitMs: number,
  resumeId?: string
): Promise<Result> {
  let result: Result;
  if (resumeId) {
    console.log(`      resuming request ${resumeId} (no new charge)`);
    result = await retrying("checking the request", () => call<Result>(`/requests/${resumeId}/status`));
  } else {
    result = await call<Result>(`/${model}`, { method: "POST", body: JSON.stringify(body) });
    console.log(`      request ${result.request_id}`);
  }

  const id = result.request_id ?? resumeId;
  const started = Date.now();
  while (!TERMINAL.has(result.status)) {
    if (Date.now() - started > maxWaitMs) {
      throw new Error(
        `still ${result.status} after ${Math.round(maxWaitMs / 60000)} minutes; resume later with --request ${id}`
      );
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
    try {
      result = await retrying("waiting for the result", () => call<Result>(`/requests/${id}/status`));
    } catch (error) {
      throw new Error(`${describe(error)}. The request is paid for; resume it with --request ${id}`);
    }
  }

  if (result.status === "nsfw") throw new Error("rejected by moderation (refunded)");
  if (result.status !== "completed") throw new Error(`status ${result.status}`);
  return result;
}

/** Downloads a generated file. Returns its bytes and a file extension. */
export async function download(url: string): Promise<{ bytes: Buffer; ext: string }> {
  const res = await retrying("downloading", () => fetch(url));
  if (!res.ok) throw new Error(`download failed with HTTP ${res.status}`);
  const type = res.headers.get("content-type") ?? "";
  const ext = type.includes("webp")
    ? "webp"
    : type.includes("jpeg")
      ? "jpg"
      : type.includes("png")
        ? "png"
        : type.includes("quicktime")
          ? "mov"
          : type.includes("video")
            ? "mp4"
            : (url.split("?")[0].split(".").pop() ?? "bin");
  const bytes = await retrying("downloading", async () => Buffer.from(await res.arrayBuffer()));
  return { bytes, ext };
}

/**
 * Uploads a local file through Higgsfield's presigned upload flow and returns
 * a public URL a model can read (for image_url and similar inputs).
 */
export async function upload(path: URL, contentType: string): Promise<string> {
  const slot = await call<{ public_url: string; upload_url: string; upload_headers: Record<string, string> }>(
    "/files/generate-upload-url",
    { method: "POST", body: JSON.stringify({ content_type: contentType }) }
  );
  // The presigned URL is storage, not the API: it gets only the headers
  // Higgsfield returned, never our credential.
  const res = await fetch(slot.upload_url, {
    method: "PUT",
    headers: slot.upload_headers,
    body: await readFile(path),
  });
  if (!res.ok) throw new Error(`upload failed with HTTP ${res.status}`);
  return slot.public_url;
}
