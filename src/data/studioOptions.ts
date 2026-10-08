/**
 * What the studio lets people generate. Shared by the /studio page (to build
 * its controls) and the server (to reject anything else), so the two cannot
 * drift apart.
 *
 * These bound the cost of a single request, so keep them deliberate. They were
 * not checked against Higgsfield's model reference pages, which were
 * unreachable from where this was written. If the model rejects a value, the
 * request fails with a clear message and the quota is given back.
 */

export type GenerationKind = "image" | "video";

export const STUDIO_MODELS: Record<GenerationKind, string> = {
  image: "flux-pro/kontext/max/text-to-image",
  video: "bytedance/seedance-2.5/text-to-video",
};

export const MAX_PROMPT_LENGTH = 2000;

export const IMAGE_ASPECT_RATIOS = ["1:1", "16:9", "9:16", "4:3", "3:4"] as const;

export const VIDEO_ASPECT_RATIOS = ["16:9", "9:16", "1:1"] as const;
export const VIDEO_DURATIONS = [5, 10] as const;
// 1080p is left out to cap the cost of one video.
export const VIDEO_RESOLUTIONS = ["480p", "720p"] as const;

export const DEFAULTS = {
  image: { aspect_ratio: "1:1" },
  video: { aspect_ratio: "16:9", duration: 5, resolution: "720p" },
} as const;

export type GenerationStatus = "queued" | "in_progress" | "completed" | "failed" | "nsfw" | "canceled";

export const TERMINAL_STATUSES: readonly GenerationStatus[] = ["completed", "failed", "nsfw", "canceled"];

export const isTerminal = (status: string) => (TERMINAL_STATUSES as readonly string[]).includes(status);
