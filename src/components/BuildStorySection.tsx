import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

/**
 * The proof, told by the artifact instead of about it.
 *
 * This replaced a stack of prose. Each build gets one "act": the section is
 * N viewports tall, a panel pins for the whole run, and scroll position picks
 * which act is showing. Within an act the live capture scrolls inside its
 * frame while the three systems we built assemble in the column beside it —
 * so the reader watches the site play through at the same time as reading
 * what it took. The claim and the evidence occupy the same moment.
 *
 * Why not a carousel: a carousel asks for a click before it shows anything,
 * and gives no sense of how much there is. Scroll position doubles as the
 * progress indicator here, and the rail on the left makes the length of the
 * body of work legible without a single number.
 */

const ACTS = portfolioProjects;

const BuildStorySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [index, setIndex] = useState(0);

  /**
   * Progress *within* the current act, 0→1. Kept as a motion value rather
   * than state: it changes every frame, and putting it through React would
   * re-render the whole section sixty times a second to move one image.
   */
  const local = useMotionValue(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Nudge off the exact end so the final act doesn't tip into index N.
    const raw = Math.min(p * ACTS.length, ACTS.length - 0.0001);
    const i = Math.max(0, Math.min(ACTS.length - 1, Math.floor(raw)));
    setIndex((prev) => (prev === i ? prev : i));
    local.set(raw - i);
  });

  /**
   * Travel is read through a ref rather than captured in the transform, so a
   * newly measured image takes effect immediately. Closing over the value
   * would freeze whatever it was when the transform was created — which, on
   * the first act, is zero.
   */
  const travelRef = useRef(0);
  const y = useTransform(local, (v) => -v * travelRef.current);

  const measure = (img: HTMLImageElement | null) => {
    if (!img || !img.naturalWidth) return;
    const frame = img.parentElement;
    if (!frame) return;
    const rendered = (img.naturalHeight / img.naturalWidth) * frame.clientWidth;
    travelRef.current = Math.max(0, rendered - frame.clientHeight);
  };

  const act = ACTS[index];

  return (
    <section
      ref={sectionRef}
      aria-labelledby="build-story-heading"
      style={{ height: `${ACTS.length * 100}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden pt-20 md:pt-24">
        <div className="container-narrow w-full">
          <h2 id="build-story-heading" className="sr-only">
            What we built, and what it had to solve
          </h2>

          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
            {/* ---- Narrative column ---------------------------------- */}
            <div className="flex gap-5 md:gap-7">
              {/* Progress rail. Length is the body of work; the filled tick
                  is where you are. No counter needed. */}
              <ul
                aria-hidden="true"
                className="hidden shrink-0 flex-col justify-center gap-2 pt-1 sm:flex"
              >
                {ACTS.map((a, i) => (
                  <li
                    key={a.id}
                    className={
                      "h-px transition-all duration-500 " +
                      (i === index ? "w-9 bg-primary" : "w-4 bg-foreground/20")
                    }
                  />
                ))}
              </ul>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={act.id}
                    initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="label-mono mb-3">{act.category}</p>

                    <h3 className="font-display-refined mb-4 text-3xl leading-[1.05] text-foreground md:text-[2.75rem]">
                      {act.title}
                    </h3>

                    {/* The constraint first. A build only reads as work once
                        you know what made it hard. */}
                    <p className="mb-6 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                      {act.story.problem}
                    </p>

                    {/* The systems, as chips. Three short nouns carry more
                        than a paragraph claiming the same thing, and they
                        stagger in so the build reads as assembling. */}
                    <ul className="mb-7 flex flex-wrap gap-2">
                      {act.story.built.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: reduceMotion ? 0 : 0.1 + i * 0.07,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="border border-primary/25 bg-primary/[0.07] px-3 py-1.5 text-xs font-medium text-primary"
                        >
                          {item}
                        </motion.li>
                      ))}
                    </ul>

                    {/* The outcome, in the brand's own words where possible. */}
                    <p className="mb-6 border-l-2 border-primary/40 pl-4 text-base font-medium leading-snug text-foreground md:text-lg">
                      {act.story.outcome}
                    </p>

                    <a
                      href={act.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors motion-snap hover:text-primary/80"
                    >
                      {/* The brand's own name, never the host it happens to
                          sit on. */}
                      {act.displayDomain}
                      <ArrowUpRight className="h-4 w-4 transition-transform motion-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* ---- Artifact column ----------------------------------- */}
            {/* A browser chrome rather than a bare screenshot: it frames the
                capture as a live site being scrolled, which is what it is. */}
            <div className="border border-border/50 bg-card/40 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 border-b border-border/40 px-3 py-2.5">
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
                <span className="h-2 w-2 rounded-full bg-foreground/20" />
                <span className="ml-3 truncate text-[10px] tracking-wider text-muted-foreground">
                  {act.displayDomain}
                </span>
              </div>

              <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
                {act.image ? (
                  <motion.img
                    key={act.id}
                    ref={measure}
                    src={act.image}
                    alt={`${act.title} — live site`}
                    onLoad={(e) => measure(e.currentTarget)}
                    style={reduceMotion ? undefined : { y }}
                    className="absolute inset-x-0 top-0 w-full"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <act.icon className="h-12 w-12 text-primary/25" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BuildStorySection;
