import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Play } from "lucide-react";
import type { PortfolioProject } from "@/data/portfolio";

/**
 * Plays an adaptive stream (HLS: public/media/<project>/<video>/master.m3u8,
 * made by scripts/site-images/encode-hls.sh). The stream starts on its
 * lightest quality and steps up or down with the connection, so it starts
 * quickly and keeps playing on a weak network. Safari plays HLS natively;
 * everywhere else hls.js is loaded on first play, so it costs nothing until
 * someone presses play.
 */
const StreamVideo = ({
  src,
  poster,
  autoPlay,
  label,
  className,
}: {
  src: string;
  poster: string;
  autoPlay?: boolean;
  label?: string;
  className?: string;
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }
    let destroy: (() => void) | undefined;
    let cancelled = false;
    import("hls.js/light").then(({ default: Hls }) => {
      if (cancelled) return;
      if (!Hls.isSupported()) return setFailed(true);
      // Read the playlist now, but fetch no video until the visitor presses play.
      const hls = new Hls({ capLevelToPlayerSize: true, autoStartLoad: false });
      const start = () => hls.startLoad();
      video.addEventListener("play", start, { once: true });
      hls.loadSource(src);
      hls.attachMedia(video);
      destroy = () => {
        video.removeEventListener("play", start);
        hls.destroy();
      };
    });
    return () => {
      cancelled = true;
      destroy?.();
    };
  }, [src]);

  if (failed) {
    return (
      <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Your browser can&rsquo;t play this video.
      </p>
    );
  }
  return (
    <video
      ref={ref}
      poster={poster}
      controls
      autoPlay={autoPlay}
      playsInline
      preload="none"
      aria-label={label}
      className={className}
    />
  );
};

/**
 * A project's film (ours, or the client's own: see `film.credit`): a silent teaser loop until the visitor
 * asks for the full film, which then streams in place with sound and
 * controls, with the vertical reel beside it when there is one. With reduced
 * motion the teaser does not autoplay; the poster stands in.
 */
const ProjectFilm = ({ film }: { film: NonNullable<PortfolioProject["film"]> }) => {
  const reduce = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  // A 4:3 film at full column width would be taller than the screen.
  const frame = film.aspect === "4/3" ? "aspect-[4/3] md:max-w-3xl" : "aspect-video";

  return (
    <figure>
      {/* The reel column is sized so a 9:16 reel matches the 16:9 film's height. */}
      <div className={film.reel ? "grid gap-4 md:grid-cols-[1fr_0.3164fr]" : undefined}>
        <div className={`relative overflow-hidden border border-foreground/[0.08] bg-card/40 ${frame}`}>
          {playing && film.src ? (
            <StreamVideo
              src={film.src}
              poster={film.poster}
              autoPlay
              className="absolute inset-0 h-full w-full bg-black object-contain"
            />
          ) : (
            <>
              <video
                poster={film.poster}
                autoPlay={!reduce}
                muted
                loop
                playsInline
                preload={reduce ? "none" : "metadata"}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={film.teaser.webm} type="video/webm" />
                <source src={film.teaser.mp4} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              {film.src && (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  className="absolute bottom-3 left-3 inline-flex items-center gap-2 bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:bottom-5 sm:left-5 sm:px-5 sm:py-3"
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Watch the film ({film.duration})
                </button>
              )}
            </>
          )}
        </div>
        {film.reel && (
          <div className="relative mx-auto aspect-[9/16] w-3/5 overflow-hidden border border-foreground/[0.08] bg-card/40 md:aspect-auto md:w-full">
            <StreamVideo
              src={film.reel.src}
              poster={film.reel.poster}
              label={film.reel.label}
              className="absolute inset-0 h-full w-full bg-black object-cover"
            />
          </div>
        )}
      </div>
      <figcaption className="mt-4 text-base text-muted-foreground">{film.caption}</figcaption>
    </figure>
  );
};

export default ProjectFilm;
