/**
 * Generates homepage story images with Higgsfield. Each one is a billable
 * request, so nothing runs unless asked for by name.
 *
 *   npm run images:generate -- hero-blueprint-city
 *   npm run images:generate -- --all
 *   npm run images:generate -- --list
 *   npm run images:generate -- --model <higgsfield-model-id> <shot-id>
 *
 * Default model is Soul 2 (higgsfield-ai/soul/v2/standard), Higgsfield's own
 * realistic/editorial model. Its documented options: resolution 720p|1080p;
 * aspect_ratio 9:16, 16:9, 4:3, 3:4, 1:1, 2:3, 3:2.
 *
 * Credentials: if HF_CREDENTIALS is set (e.g. in .env.local) it is sent as
 * `Authorization: Key ...`. If it is not, no Authorization header is sent and
 * the environment's network secret for api.higgsfield.ai supplies it. Calls go
 * straight to the REST API rather than through the SDK because the SDK
 * refuses to run without a local credential.
 *
 * Files land in public/images/story/<id>.<ext>. An image that already exists
 * is skipped unless --force is passed, so a rerun never pays twice.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
import { SHOTS, STYLE } from "./shots.js";

const API = "https://api.higgsfield.ai";
const DEFAULT_MODEL = "higgsfield-ai/soul/v2/standard";
const POLL_MS = 4000;
const MAX_WAIT_MS = 10 * 60 * 1000;
const OUT_DIR = new URL("../../public/images/story/", import.meta.url);

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    model: { type: "string", default: DEFAULT_MODEL },
    all: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    list: { type: "boolean", default: false },
  },
});

if (values.list) {
  for (const s of SHOTS) console.log(`${s.id.padEnd(28)} ${s.aspect_ratio.padEnd(6)} ${s.section}`);
  process.exit(0);
}

const unknown = positionals.filter((id) => !SHOTS.some((s) => s.id === id));
if (unknown.length) {
  console.error(`Unknown shot id(s): ${unknown.join(", ")}. Run with --list.`);
  process.exit(1);
}
const wanted = values.all ? SHOTS : SHOTS.filter((s) => positionals.includes(s.id));
if (wanted.length === 0) {
  console.error("Name at least one shot id, or pass --all. Run with --list to see them.");
  process.exit(1);
}

const headers: Record<string, string> = { "Content-Type": "application/json", Accept: "application/json" };
if (process.env.HF_CREDENTIALS) headers.Authorization = `Key ${process.env.HF_CREDENTIALS}`;

interface StatusResponse {
  status: string;
  request_id: string;
  images?: { url?: string }[];
}

async function call(path: string, init?: RequestInit): Promise<StatusResponse> {
  const res = await fetch(`${API}${path}`, { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    // The body is Higgsfield's error message; it never contains our credential.
    throw new Error(`HTTP ${res.status} from ${path.split("?")[0]}: ${text.slice(0, 300)}`);
  }
  return JSON.parse(text) as StatusResponse;
}

const TERMINAL = new Set(["completed", "failed", "nsfw", "canceled"]);
const exists = (url: URL) => access(url).then(() => true, () => false);

await mkdir(OUT_DIR, { recursive: true });

let failures = 0;
for (const shot of wanted) {
  const already = await Promise.all(
    ["png", "jpg", "webp"].map((ext) => exists(new URL(`${shot.id}.${ext}`, OUT_DIR)))
  );
  if (already.some(Boolean) && !values.force) {
    console.log(`skip  ${shot.id} (already generated; --force to redo)`);
    continue;
  }

  console.log(`make  ${shot.id} (${shot.aspect_ratio}, ${values.model}) ...`);
  try {
    let result = await call(`/${values.model}`, {
      method: "POST",
      body: JSON.stringify({
        prompt: `${shot.prompt}\n\nStyle: ${STYLE}`,
        aspect_ratio: shot.aspect_ratio,
        resolution: "1080p",
        batch_size: 1,
        // Off so Higgsfield does not rewrite the art direction that keeps the
        // set consistent.
        enhance_prompt: false,
      }),
    });
    console.log(`      request ${result.request_id}`);

    const started = Date.now();
    while (!TERMINAL.has(result.status)) {
      if (Date.now() - started > MAX_WAIT_MS) throw new Error(`still ${result.status} after 10 minutes`);
      await new Promise((r) => setTimeout(r, POLL_MS));
      result = await call(`/requests/${result.request_id}/status`);
    }

    const url = result.images?.[0]?.url;
    if (result.status !== "completed" || !url) {
      const why = result.status === "nsfw" ? "rejected by moderation (refunded)" : `status ${result.status}`;
      console.error(`fail  ${shot.id}: ${why}${result.status === "completed" ? ", no image returned" : ""}`);
      failures++;
      continue;
    }

    const img = await fetch(url);
    if (!img.ok) throw new Error(`download failed with HTTP ${img.status}`);
    const type = img.headers.get("content-type") ?? "";
    const ext = type.includes("webp") ? "webp" : type.includes("jpeg") ? "jpg" : "png";
    await writeFile(new URL(`${shot.id}.${ext}`, OUT_DIR), Buffer.from(await img.arrayBuffer()));
    console.log(`done  ${shot.id} -> public/images/story/${shot.id}.${ext}`);
  } catch (error) {
    console.error(`fail  ${shot.id}: ${error instanceof Error ? error.message : String(error)}`);
    failures++;
  }
}

process.exit(failures ? 1 : 0);
