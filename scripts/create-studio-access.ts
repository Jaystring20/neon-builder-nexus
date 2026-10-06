/**
 * Issues an access code for the /studio page.
 *
 *   npm run studio:create-access -- "Client name" --images 50 --videos 10
 *   npm run studio:create-access -- "Jerry (DCH team)" --team
 *
 * Client codes get the image and video allowances given (default 0 each).
 * Team codes generate without limit.
 *
 * Needs SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in
 * .env.local. The code is printed once and only its hash is stored, so pass
 * it on straight away; a lost code is replaced by issuing a new one.
 */

import { randomBytes } from "node:crypto";
import { parseArgs } from "node:util";
import { getSupabase } from "../src/lib/supabase.server.js";
import { hashAccessCode } from "../src/lib/higgsfield.server.js";

const usage = 'Usage: npm run studio:create-access -- "Name" [--images N] [--videos N] [--team]';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    images: { type: "string", default: "0" },
    videos: { type: "string", default: "0" },
    team: { type: "boolean", default: false },
  },
});

const name = positionals[0]?.trim();
if (!name) {
  console.error(usage);
  process.exit(1);
}

const imageQuota = Number(values.images);
const videoQuota = Number(values.videos);
if (![imageQuota, videoQuota].every((n) => Number.isInteger(n) && n >= 0)) {
  console.error("--images and --videos must be whole numbers of 0 or more.");
  process.exit(1);
}
if (!values.team && imageQuota === 0 && videoQuota === 0) {
  console.error(`A client code needs --images or --videos (or use --team).\n${usage}`);
  process.exit(1);
}

const code = `dch_${randomBytes(32).toString("base64url")}`;

const { error } = await getSupabase().from("studio_accounts").insert({
  name,
  access_code_hash: hashAccessCode(code),
  is_team: values.team,
  image_quota: imageQuota,
  video_quota: videoQuota,
});

if (error) {
  console.error(`Could not create the access code: ${error.message}`);
  process.exit(1);
}

console.log(
  values.team
    ? `Created team access for "${name}" (no limits).`
    : `Created "${name}" with ${imageQuota} images and ${videoQuota} videos.`
);
console.log(`Access code (shown once): ${code}`);
console.log("They sign in at https://www.digitalcreativeshubltd.com/studio");
