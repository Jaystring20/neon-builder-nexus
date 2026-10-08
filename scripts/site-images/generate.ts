/**
 * Generates homepage story images with Higgsfield. Each one is a billable
 * request, so nothing runs unless asked for by name.
 *
 *   npm run images:generate -- capability-brand
 *   npm run images:generate -- --all
 *   npm run images:generate -- --list
 *   npm run images:generate -- --model <higgsfield-model-id> <shot-id>
 *
 * Default model is Soul 2 (higgsfield-ai/soul/v2/standard), Higgsfield's own
 * realistic/editorial model (pass --model to try another). Its documented
 * options: resolution 720p|1080p;
 * aspect_ratio 9:16, 16:9, 4:3, 3:4, 1:1, 2:3, 3:2.
 *
 * Credentials and proxy handling live in ./api.ts.
 *
 * Full-size files land in media-src/story/<id>.<ext>. They are too heavy
 * for the page (3-4 MB each), so scripts/site-images/optimize-story.sh turns
 * them into the WebP files in src/assets/story/ that the page loads. An image that already exists
 * is skipped unless --force is passed, so a rerun never pays twice.
 */

import { generate, download, describe } from "./api.js";
import { mkdir, writeFile, access } from "node:fs/promises";
import { parseArgs } from "node:util";
import { SHOTS, STYLE } from "./shots.js";

const DEFAULT_MODEL = "higgsfield-ai/soul/v2/standard";
const MAX_WAIT_MS = 10 * 60 * 1000;
const OUT_DIR = new URL("../../media-src/story/", import.meta.url);

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
    const result = await generate(
      values.model,
      {
        prompt: `${shot.prompt}\n\nStyle: ${STYLE}`,
        aspect_ratio: shot.aspect_ratio,
        resolution: "1080p",
        batch_size: 1,
        // Off so Higgsfield does not rewrite the art direction that keeps the
        // set consistent.
        enhance_prompt: false,
      },
      MAX_WAIT_MS
    );

    const url = result.images?.[0]?.url;
    if (!url) throw new Error("completed but no image returned");
    const { bytes, ext } = await download(url);
    await writeFile(new URL(`${shot.id}.${ext}`, OUT_DIR), bytes);
    console.log(`done  ${shot.id} -> media-src/story/${shot.id}.${ext}`);
  } catch (error) {
    console.error(`fail  ${shot.id}: ${describe(error)}`);
    failures++;
  }
}

process.exitCode = failures ? 1 : 0;
