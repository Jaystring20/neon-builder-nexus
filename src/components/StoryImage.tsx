import { cn } from "@/lib/utils";
import { storyImage } from "@/lib/storyImages";

interface StoryImageProps {
  /** Id from scripts/site-images/shots.ts. */
  id: string;
  /** Describes the scene for screen readers; empty when purely decorative. */
  alt: string;
  /** Tailwind aspect class matching the generated ratio, e.g. "aspect-[3/4]". */
  aspect: string;
  className?: string;
  priority?: boolean;
  /** Render nothing until the image exists, instead of the stand-in. */
  hideIfMissing?: boolean;
}

/**
 * A generated story image, or until it exists a stand-in of the same shape:
 * the page's own drafting grid under a faint cyan light, so a missing image
 * reads as a quiet panel rather than a hole and the layout never shifts.
 */
const StoryImage = ({ id, alt, aspect, className, priority, hideIfMissing }: StoryImageProps) => {
  const src = storyImage(id);
  if (!src && hideIfMissing) return null;

  return (
    <div className={cn("relative overflow-hidden bg-card/40", aspect, className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div aria-hidden="true" className="story-standin absolute inset-0" />
      )}
      {/* Hairline edge so the dark image meets the dark page cleanly. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-foreground/[0.06]" />
    </div>
  );
};

export default StoryImage;
