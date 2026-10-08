/**
 * Generates the hero's looping video in two billable steps, so the look is
 * approved as a still before paying for motion:
 *
 *   npm run hero:video -- --keyframe   1. still only (Soul Cinema), check it
 *   npm run hero:video                 2. video from that still (Seedance 2.5)
 *
 * The keyframe is sent to Seedance 2.5 image-to-video as both the first and
 * the last frame, so the clip ends where it began and loops without a seam.
 *
 * Outputs (raw, full quality; scripts/site-images/encode-hero.sh makes the
 * web versions in src/assets/hero/):
 *   media-src/hero-keyframe.<ext>
 *   media-src/hero-momentum.mp4
 *
 * Existing files are reused rather than regenerated; pass --force to redo
 * the step you are running.
 *
 * If the connection drops after a request was accepted, the script prints its
 * id. Re-run the same step with --request <id> to collect the result without
 * paying again:
 *
 *   npm run hero:video -- --keyframe --request <id>
 */

import { generate, download, upload, describe } from "./api.js";
import { access, mkdir, readdir, writeFile } from "node:fs/promises";
import { parseArgs } from "node:util";

const KEYFRAME_MODEL = "higgsfield-ai/soul/cinema";
const VIDEO_MODEL = "bytedance/seedance-2.5/image-to-video";
const OUT_DIR = new URL("../../media-src/", import.meta.url);

/**
 * The still. It fixes composition, materials and light; the video can only
 * move what is here. The sculpture is the brand's three parts as one engine:
 * three rings (brand, platforms, people) driven by one core of light (AI).
 * The left of the frame stays empty because the headline sits there.
 */
export const KEYFRAME_PROMPT = [
  "Cinematic hero frame for a premium technology company.",
  "A monumental kinetic sculpture floats in a vast dark void, placed in the right half of the frame and slightly above centre.",
  "It is three thick interlocking rings nested like a gyroscope, each tilted on a different axis around one shared centre.",
  "Each ring is machined from a different material: brushed dark titanium, smoked black glass with a cyan edge glow, and polished graphite ceramic.",
  "Their surfaces carry fine engraved grooves and precise seams, and thin filaments of cyan light run inside those seams.",
  "At the exact centre hangs a dense sphere of liquid cyan light, the strongest light in the scene, its glow catching the inner bevels of every ring.",
  "One small warm amber spark sits on the outer ring.",
  "Below, a faint mirror reflection of the sculpture on a glossy black floor that fades into darkness.",
  "The left 45 percent of the frame is calm, near-black negative space with only a very subtle cool gradient.",
  "Shot like a luxury product film: 85mm lens, slight low angle, shallow depth of field.",
  "Extreme contrast: deep true-black shadows, crisp specular highlights, hard cyan rim light along every edge, thin volumetric haze catching a few light rays.",
  "Micro-detail in metal and glass, physically accurate materials and reflections, colour graded teal and black with a single amber accent.",
  "No text, no letters, no logos, no interface, no people, no hands, no holograms, no purple, no rainbow colours, no lens-flare streaks.",
].join(" ");

/**
 * The motion. Beats are timed so the ending can settle back onto the opening
 * frame. The camera is locked because any camera move would break the loop.
 */
export const VIDEO_PROMPT = [
  "Locked-off camera, one continuous shot, no cuts, no camera movement.",
  "The sculpture comes alive and builds momentum.",
  "First two seconds: the cyan core draws a slow breath and brightens, and a pulse of light travels outward along the seams of each ring.",
  "Seconds two to six: the three rings begin to turn on their own axes, slowly at first, then faster and faster, each ring driving the next like parts of one engine.",
  "Light streaks race along their edges, fine arcs of cyan energy jump between the rings, and the haze swirls in the turbulence they create.",
  "Final two seconds: the rotation stays powerful but eases, each ring completes its turn and returns precisely to its starting position, the core settles back to its opening glow, and the shot ends on the exact first frame for a seamless loop.",
  "Heavy, precise, mechanical motion with real weight and inertia.",
  "Deep black shadows throughout, crisp specular highlights sliding across metal and glass.",
  "The left side of the frame stays empty and dark.",
  "No text, no new objects, no people, no camera shake, no flicker.",
].join(" ");

const { values } = parseArgs({
  options: {
    keyframe: { type: "boolean", default: false },
    force: { type: "boolean", default: false },
    duration: { type: "string", default: "8" },
    request: { type: "string" },
  },
});

const exists = (url: URL) => access(url).then(() => true, () => false);

async function findKeyframe(): Promise<URL | null> {
  const files = await readdir(OUT_DIR).catch(() => [] as string[]);
  const name = files.find((f) => /^hero-keyframe\.(png|jpe?g|webp)$/.test(f));
  return name ? new URL(name, OUT_DIR) : null;
}

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

async function run(): Promise<number> {
  await mkdir(OUT_DIR, { recursive: true });

  // Step 1: the still.
  let keyframe = await findKeyframe();
  let keyframeUrl: string | null = null;

  if (!keyframe || (values.keyframe && (values.force || values.request))) {
    console.log(`make  hero keyframe (${KEYFRAME_MODEL}, 16:9, 1080p) ...`);
    const result = await generate(
      KEYFRAME_MODEL,
      { prompt: KEYFRAME_PROMPT, aspect_ratio: "16:9", resolution: "1080p", batch_size: 1, enhance_prompt: false },
      10 * 60 * 1000,
      values.keyframe ? values.request : undefined
    );
    const url = result.images?.[0]?.url;
    if (!url) throw new Error("keyframe completed but no image returned");
    const { bytes, ext } = await download(url);
    keyframe = new URL(`hero-keyframe.${ext}`, OUT_DIR);
    await writeFile(keyframe, bytes);
    // Higgsfield's own URL is public, so the video step can use it directly.
    keyframeUrl = url;
    console.log(`done  keyframe -> media-src/hero-keyframe.${ext}`);
  } else {
    console.log("skip  keyframe (media-src has one; --keyframe --force to redo)");
  }

  if (values.keyframe) {
    console.log("\nOpen the keyframe and check it. When it is right, run: npm run hero:video");
    return 0;
  }

  // Step 2: the video.
  const video = new URL("hero-momentum.mp4", OUT_DIR);
  if ((await exists(video)) && !values.force) {
    console.log("skip  video (media-src/hero-momentum.mp4 exists; --force to redo)");
    return 0;
  }

  if (!keyframeUrl && !values.request) {
    const ext = keyframe.pathname.split(".").pop() ?? "png";
    console.log("send  keyframe to Higgsfield storage ...");
    keyframeUrl = await upload(keyframe, CONTENT_TYPES[ext] ?? "image/png");
  }

  const duration = Number(values.duration);
  console.log(`make  hero video (${VIDEO_MODEL}, ${duration}s, 1080p, looped) ...`);
  const result = await generate(
    VIDEO_MODEL,
    {
      prompt: VIDEO_PROMPT,
      image_url: keyframeUrl ?? undefined,
      end_image_url: keyframeUrl ?? undefined,
      duration,
      resolution: "1080p",
      bitrate_mode: "high",
      generate_audio: false,
    },
    20 * 60 * 1000,
    values.request
  );
  const url = result.video?.url;
  if (!url) throw new Error("video completed but no video returned");
  const { bytes } = await download(url);
  await writeFile(video, bytes);
  console.log(`done  video -> media-src/hero-momentum.mp4 (${(bytes.length / 1e6).toFixed(1)} MB)`);
  console.log("\nPush media-src/ and the web versions will be encoded from it.");
  return 0;
}

run().then(
  (code) => {
    process.exitCode = code;
  },
  (error: unknown) => {
    console.error(`fail  ${describe(error)}`);
    process.exitCode = 1;
  }
);
