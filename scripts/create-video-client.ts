/**
 * Issues a client an access code for /api/videos.
 *
 *   npm run video:create-client -- "Client name" 10
 *
 * The second argument is how many videos they may generate (default 10).
 * Needs SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in
 * .env.local. The code is printed once and only its hash is stored, so send it
 * to the client straight away; a lost code is replaced by issuing a new one.
 */

import { randomBytes } from "node:crypto";
import { getSupabase } from "../src/lib/supabase.server.js";
import { hashAccessCode } from "../src/lib/higgsfield.server.js";

const [name, quotaArg] = process.argv.slice(2);
if (!name) {
  console.error('Usage: npm run video:create-client -- "Client name" [video quota]');
  process.exit(1);
}

const quota = quotaArg === undefined ? 10 : Number(quotaArg);
if (!Number.isInteger(quota) || quota < 0) {
  console.error("Video quota must be a whole number of 0 or more.");
  process.exit(1);
}

const code = `dch_${randomBytes(32).toString("base64url")}`;

const { error } = await getSupabase()
  .from("video_clients")
  .insert({ name, access_code_hash: hashAccessCode(code), video_quota: quota });

if (error) {
  console.error(`Could not create the client: ${error.message}`);
  process.exit(1);
}

console.log(`Created "${name}" with ${quota} videos.`);
console.log(`Access code (shown once): ${code}`);
