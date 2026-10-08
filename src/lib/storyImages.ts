/**
 * Generated section images (scripts/site-images, ids in shots.ts), found at
 * build time. Each one is optional: until it has been generated the section
 * shows a quiet stand-in of the same shape, so nothing breaks and nothing
 * shifts when the real image lands.
 */
const files = import.meta.glob("/src/assets/story/*.{png,jpg,jpeg,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const byId: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const id = path.split("/").pop()!.replace(/\.[a-z]+$/, "");
  byId[id] = url;
}

export const storyImage = (id: string): string | undefined => byId[id];
