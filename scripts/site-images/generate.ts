/**
 * Generates homepage story images with Higgsfield. Each one is a billable
 * request, so nothing runs unless asked for by name.
 *
 *   npm run images:generate -- --model <higgsfield-model-id> hero-blueprint-city
 *   npm run images:generate -- --model <id> --all
 *   npm run images:generate -- --list
 *
 * Files land in public/images/story/<id>.<ext>. An image that already exists
 * is skipped unless --force is passed, so a rerun never pays twice.
 */

import { mkdir, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
import { createHiggsfieldClient } from "@higgsfield/client/v2";
import { SHOTS, STYLE } from "./shots.js";

const OUT_DIR = new URL("../../public/images/story/", import.meta.url);

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    model: { type: "string" },
    all: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    list: { type: "boolean", default: false },
  },
});

if (values.list) {
  for (const s of SHOTS) console.log(`${s.id.padEnd(28)} ${s.aspect_ratio.padEnd(6)} ${s.section}`);
  process.exit(0);
}

// Required on purpose: the model decides the cost and the look, and an id
// guessed wrong would spend credits on the wrong thing.
if (!values.model) {
  console.error("Pass --model <higgsfield-model-id>. Run with --list to see the shots.");
  process.exit(1);
}
if (!process.env.HF_CREDENTIALS) {
  console.error("HF_CREDENTIALS is not set. Add it to .env.local as key-id:key-secret.");
  process.exit(1);
}

const wanted = values.all ? SHOTS : SHOTS.filter((s) => positionals.includes(s.id));
const unknown = positionals.filter((id) => !SHOTS.some((s) => s.id === id));
if (unknown.length) {
  console.error(`Unknown shot id(s): ${unknown.join(", ")}. Run with --list.`);
  process.exit(1);
}
if (wanted.length === 0) {
  console.error("Name at least one shot id, or pass --all.");
  process.exit(1);
}

const client = createHiggsfieldClient({ maxPollTime: 10 * 60 * 1000, pollInterval: 4000 });
await mkdir(OUT_DIR, { recursive: true });

const exists = (url: URL) => access(url).then(() => true, () => false);

let failures = 0;
for (const shot of wanted) {
  const already = await Promise.all(
    ["png", "jpg", "webp"].map((ext) => exists(new URL(`${shot.id}.${ext}`, OUT_DIR)))
  );
  if (already.some(Boolean) && !values.force) {
    console.log(`skip  ${shot.id} (already generated; --force to redo)`);
    continue;
  }

  console.log(`make  ${shot.id} (${shot.aspect_ratio}) ...`);
  try {
    const result = await client.subscribe(values.model, {
      input: { prompt: `${shot.prompt}\n\nStyle: ${STYLE}`, aspect_ratio: shot.aspect_ratio },
      withPolling: true,
    });
    const url = result.images?.[0]?.url;
    if (result.status !== "completed" || !url) {
      console.error(`fail  ${shot.id}: status ${result.status}${url ? "" : ", no image returned"}`);
      failures++;
      continue;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error(`download failed with HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    const ext = type.includes("webp") ? "webp" : type.includes("jpeg") ? "jpg" : "png";
    const file = new URL(`${shot.id}.${ext}`, OUT_DIR);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
    console.log(`done  ${shot.id} -> public/images/story/${shot.id}.${ext}`);
  } catch (error) {
    // Message only: SDK errors can carry the Authorization header.
    console.error(`fail  ${shot.id}: ${error instanceof Error ? error.message : String(error)}`);
    failures++;
  }
}

process.exit(failures ? 1 : 0);
