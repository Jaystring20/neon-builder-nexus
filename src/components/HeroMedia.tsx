import { useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import MomentumFlywheel from "@/components/MomentumFlywheel";
import { hasHeroVideo, heroVideo } from "@/lib/heroMedia";

/**
 * The hero's visual. When the Seedance loop has been encoded into
 * src/assets/hero/ (see scripts/site-images/encode-hero.sh) it plays that;
 * until then it falls back to the code-driven flywheel. Nothing to switch by
 * hand: dropping the files in is enough.
 */
const { webm, mp4, poster } = heroVideo;

// The sculpture sits in the right of the frame and the left is empty dark
// space, so on wide screens the video fills the section and the copy sits on
// that space. The mask dissolves its edges into the page instead of a box.
const BACKDROP_MASK =
  "linear-gradient(to right, transparent 0%, black 38%), linear-gradient(to bottom, black 78%, transparent 100%)";
const INLINE_MASK =
  "linear-gradient(to bottom, transparent 0%, black 14%, black 86%, transparent 100%)";

const LoopingVideo = ({ className, style }: { className: string; style: React.CSSProperties }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { margin: "100px" });

  // Only spend decode time while the hero is on screen.
  useEffect(() => {
    const video = ref.current;
    if (!video || reduce) return;
    if (inView) void video.play().catch(() => undefined);
    else video.pause();
  }, [inView, reduce]);

  if (reduce) {
    return <img src={poster} alt="" aria-hidden="true" className={className} style={style} fetchPriority="high" />;
  }

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      disablePictureInPicture
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  );
};

/** Full-bleed layer behind the copy, desktop only. Renders nothing without the video. */
export const HeroBackdrop = () => {
  if (!hasHeroVideo) return null;
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] lg:block">
      <LoopingVideo
        className="h-full w-full object-cover object-[65%_50%]"
        style={{ maskImage: BACKDROP_MASK, WebkitMaskImage: BACKDROP_MASK, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
      />
    </div>
  );
};

/** In-flow visual next to or below the copy: the video on small screens, the flywheel when there is no video. */
export const HeroInline = () => {
  if (!hasHeroVideo) return <MomentumFlywheel />;
  return (
    <div className="-mx-4 sm:-mx-6 lg:hidden">
      <LoopingVideo
        className="aspect-[4/3] w-full object-cover object-[72%_50%] sm:aspect-[16/9]"
        style={{ maskImage: INLINE_MASK, WebkitMaskImage: INLINE_MASK }}
      />
    </div>
  );
};
