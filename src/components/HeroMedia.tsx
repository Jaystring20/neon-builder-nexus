import { lazy, Suspense, useEffect, useRef } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { hasHeroVideo, heroVideo } from "@/lib/heroMedia";

/**
 * The hero's visual. When the Seedance loop has been encoded into
 * src/assets/hero/ (see scripts/site-images/encode-hero.sh) it plays that;
 * until then it shows the real-time 3D engine (three.js, loaded after the
 * copy so it never delays the headline). Nothing to switch by hand: dropping
 * the video files in is enough.
 */
const MomentumEngine3D = lazy(() => import("@/components/MomentumEngine3D"));
const { webm, mp4, poster } = heroVideo;

// The film's blacks are pure black and the page is a deep navy, so every edge
// is dissolved with a radial mask: no edge of the frame is ever visible.
// Ellipse centred where the sculpture sits in the frame (right of centre).
const BACKDROP_MASK = "radial-gradient(ellipse 50% 46% at 62% 50%, black 50%, transparent 100%)";
const INLINE_MASK = "radial-gradient(ellipse 58% 46% at 60% 50%, black 50%, transparent 100%)";

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
    // At its natural 16:9 shape, right-aligned and vertically centred: the
    // sculpture lands right of the copy at a size that reads whole, not cropped.
    <div className="pointer-events-none absolute right-0 top-1/2 hidden w-[78%] -translate-y-1/2 lg:block">
      <LoopingVideo
        className="aspect-video w-full object-cover"
        style={{ maskImage: BACKDROP_MASK, WebkitMaskImage: BACKDROP_MASK }}
      />
    </div>
  );
};

/** In-flow visual next to or below the copy: the video on small screens, the 3D engine when there is no video. */
export const HeroInline = () => {
  if (!hasHeroVideo) {
    return (
      // Wider than its column on desktop so the engine has room to breathe;
      // the section clips the overflow.
      <div className="-mx-4 sm:mx-0 lg:-mr-[14%] lg:-ml-[4%]">
        <Suspense fallback={<div className="mx-auto aspect-square w-full max-w-[420px] sm:max-w-[520px] lg:max-w-none" />}>
          <MomentumEngine3D />
        </Suspense>
      </div>
    );
  }
  return (
    <div className="-mx-4 sm:-mx-6 lg:hidden">
      <LoopingVideo
        className="aspect-[4/3] w-full object-cover object-[62%_50%] sm:aspect-[16/9]"
        style={{ maskImage: INLINE_MASK, WebkitMaskImage: INLINE_MASK }}
      />
    </div>
  );
};
