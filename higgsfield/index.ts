/**
 * Higgsfield example: one Seedance 2.5 text-to-video generation.
 *
 * Run with `npm run higgsfield:example`. The SDK reads HF_CREDENTIALS
 * ("key-id:key-secret") from the environment; the npm script loads it from
 * .env.local, which Git ignores. Server-side only: never import this, or the
 * credentials, into anything under src/ that ships to the browser.
 *
 * This makes a billable generation request.
 */

import {
  createHiggsfieldClient,
  AuthenticationError,
  NotEnoughCreditsError,
  BadInputError,
  ValidationError,
  TimeoutError,
  APIError,
} from "@higgsfield/client/v2";

const MODEL = "bytedance/seedance-2.5/text-to-video";

async function main(): Promise<number> {
  if (!process.env.HF_CREDENTIALS) {
    console.error("HF_CREDENTIALS is not set. Add it to .env.local as key-id:key-secret.");
    return 1;
  }

  const client = createHiggsfieldClient({
    // Video takes longer than the SDK's 5-minute default polling window.
    maxPollTime: 15 * 60 * 1000,
    pollInterval: 5000,
  });

  console.log(`Submitting ${MODEL} and waiting for it to finish...`);

  // The SDK stops polling on completed, failed or nsfw. Any other terminal
  // state (e.g. canceled) keeps it polling until maxPollTime, which surfaces
  // below as a TimeoutError rather than a false success.
  const result = await client.subscribe(MODEL, {
    input: {
      prompt: "A cinematic scene at sunset",
      duration: 5,
      resolution: "720p",
      aspect_ratio: "16:9",
    },
    withPolling: true,
  });

  // Compared as a plain string: the SDK's status type omits "canceled",
  // but the API can still return it.
  const status: string = result.status;
  switch (status) {
    case "completed":
      if (!result.video?.url) {
        console.error(`Request ${result.request_id} completed but returned no video URL.`);
        return 1;
      }
      console.log(`Video URL: ${result.video.url}`);
      return 0;
    case "nsfw":
      console.error(`Request ${result.request_id} was rejected by moderation (credits refunded).`);
      return 1;
    case "failed":
      console.error(`Request ${result.request_id} failed (credits refunded).`);
      return 1;
    case "canceled":
      console.error(`Request ${result.request_id} was canceled.`);
      return 1;
    default:
      console.error(`Request ${result.request_id} ended in unexpected status "${status}".`);
      return 1;
  }
}

main()
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    if (error instanceof AuthenticationError) {
      console.error("Authentication failed: check HF_CREDENTIALS.");
    } else if (error instanceof NotEnoughCreditsError) {
      // The SDK raises this for any HTTP 403, so a proxy or firewall refusing
      // api.higgsfield.ai looks identical to an empty balance.
      console.error(
        "HTTP 403: not enough credits, or a network proxy/firewall blocked api.higgsfield.ai."
      );
    } else if (error instanceof BadInputError || error instanceof ValidationError) {
      console.error(`Invalid input: ${error.message}`);
    } else if (error instanceof TimeoutError) {
      console.error(`Gave up waiting: ${error.message}`);
    } else if (error instanceof APIError) {
      console.error(`API error ${error.statusCode}: ${error.message}`);
    } else {
      // Messages only: a raw axios error carries request headers, which
      // include the Authorization credentials.
      console.error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
    process.exit(1);
  });
