/**
 * Generates background art for the social sharing image (Open Graph) with
 * Higgsfield. Each run of a concept is a billable request, so nothing runs
 * unless asked for by name.
 *
 *   npx tsx scripts/site-images/og.ts --list
 *   npx tsx scripts/site-images/og.ts flywheel
 *
 * The art carries no words: the headline and logo are laid over it in
 * scripts/site-images/og-compose.html, so they stay sharp and on brand.
 * Files land in media-src/og/<id>.<ext>; an existing file is skipped unless
 * --force is passed.
 */

import { generate, download, describe } from "./api.js";
import { mkdir, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
import { STYLE } from "./shots.js";

const MODEL = "higgsfield-ai/soul/v2/standard";
const MAX_WAIT_MS = 10 * 60 * 1000;
const OUT_DIR = new URL("../../media-src/og/", import.meta.url);

// Every concept keeps the left half calm and dark, where the headline sits.
const LAYOUT =
  "the subject sits in the right half of the frame; the left half is calm, dark, empty negative space for a headline";

const CONCEPTS: { id: string; prompt: string }[] = [
  {
    id: "flywheel",
    prompt:
      "a large glossy flywheel made of thick dark smoked-glass segments, spinning fast, cyan-teal light streaks tracing its rim as motion trails, one bright warm amber spark flying off the edge and continuing forward; the sense of momentum that keeps going",
  },
  {
    id: "rising-slabs",
    prompt:
      "three floating slabs of dark smoked glass and matte graphite stacked like a rising staircase, each higher and further forward than the last, cyan-teal light lines glowing along their edges, a warm amber glow on the top slab; the sense of growth gathering speed",
  },
  {
    id: "light-runs-on",
    prompt:
      "a single dark graphite platform ending in mid-air, and a thin bright cyan-teal light line that runs along it and keeps going past the edge into the dark, curving upward, with a small warm amber point of light at its tip; the project ends, the momentum continues",
  },
];

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { force: { type: "boolean", default: false }, list: { type: "boolean", default: false } },
});

if (values.list) {
  for (const c of CONCEPTS) console.log(c.id);
  process.exit(0);
}

const wanted = CONCEPTS.filter((c) => positionals.includes(c.id));
if (wanted.length === 0) {
  console.error("Name at least one concept. Run with --list to see them.");
  process.exit(1);
}

const exists = (url: URL) => access(url).then(() => true, () => false);
await mkdir(OUT_DIR, { recursive: true });

let failures = 0;
await Promise.all(
  wanted.map(async (concept) => {
    const already = await Promise.all(["png", "jpg", "webp"].map((ext) => exists(new URL(`${concept.id}.${ext}`, OUT_DIR))));
    if (already.some(Boolean) && !values.force) {
      console.log(`skip  ${concept.id} (already generated; --force to redo)`);
      return;
    }
    console.log(`make  ${concept.id} ...`);
    try {
      const result = await generate(
        MODEL,
        {
          prompt: `${concept.prompt}; ${LAYOUT}.\n\nStyle: ${STYLE}`,
          aspect_ratio: "16:9",
          resolution: "1080p",
          batch_size: 1,
          enhance_prompt: false,
        },
        MAX_WAIT_MS
      );
      const url = result.images?.[0]?.url;
      if (!url) throw new Error("completed but no image returned");
      const { bytes, ext } = await download(url);
      await writeFile(new URL(`${concept.id}.${ext}`, OUT_DIR), bytes);
      console.log(`done  ${concept.id} -> media-src/og/${concept.id}.${ext}`);
    } catch (error) {
      console.error(`fail  ${concept.id}: ${describe(error)}`);
      failures++;
    }
  })
);

process.exitCode = failures ? 1 : 0;
