/**
 * Hero video files, found at build time. They exist once the Seedance loop
 * has been encoded into src/assets/hero/ (scripts/site-images/encode-hero.sh);
 * until then everything here is undefined and the hero uses its fallback.
 */
const media = import.meta.glob("/src/assets/hero/hero-*.{webm,mp4,jpg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const pick = (name: string): string | undefined => media[`/src/assets/hero/${name}`];

export const heroVideo = {
  webm: pick("hero-momentum.webm"),
  mp4: pick("hero-momentum.mp4"),
  poster: pick("hero-poster.jpg"),
};

export const hasHeroVideo = Boolean(heroVideo.poster && (heroVideo.webm || heroVideo.mp4));
