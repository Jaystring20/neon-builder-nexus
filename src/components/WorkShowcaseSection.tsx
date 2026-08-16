import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { portfolioProjects } from "@/data/portfolio";

/**
 * Scroll-driven horizontal gallery.
 *
 * The section is tall; the viewport-height panel inside it is sticky. As you
 * scroll the tall section, the panel stays put and the card track translates
 * sideways — so vertical scrolling reads as horizontal travel. This is the
 * pattern from the reference: a headline pinned on the left while the work
 * moves past it.
 *
 * It exists because the page was a column of prose. A reader scrolling past
 * six text sections has nothing to look at; this gives the work itself a
 * turn, and it is the one place the portfolio is shown rather than described.
 *
 * Scroll travel is derived from the card count rather than hardcoded, so
 * adding a project lengthens the section instead of speeding the track up.
 */

// Screenshots first — a card with a real capture is doing the actual work of
// this section, so the ones without an asset yet fall to the back rather than
// interrupting the run of images.
const SHOWCASE = [...portfolioProjects]
  .sort((a, b) => Number(Boolean(b.image)) - Number(Boolean(a.image)))
  .slice(0, 8);

const CARD_W = 460; // px — card width; the gap is set in the flex container

const WorkShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Track from the moment the panel pins to the moment it unpins, so the
    // track starts moving exactly when the section takes over the viewport.
    offset: ["start start", "end end"],
  });

  /**
   * Travel is measured, not calculated in CSS.
   *
   * The obvious version interpolates to a calc() string mixing px, vw and rem.
   * Framer-motion interpolates plain numbers reliably and mixed-unit calc()
   * strings unreliably, so this measures the real track and viewport and hands
   * useTransform two numbers. It also self-corrects: the measurement re-runs on
   * resize, so the last card lands flush at any width instead of overshooting
   * on wide displays and stopping short on narrow ones.
   */
  const [travel, setTravel] = useState(0);

  useLayoutEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      // scrollWidth is the full content width including the trailing link;
      // clientWidth is what fits. The difference is exactly how far to move.
      const overflow = track.scrollWidth - track.clientWidth;
      setTravel(overflow > 0 ? overflow : 0);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Images arriving late change scrollWidth, so re-measure once they settle
  // rather than trusting the first-paint number.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const imgs = Array.from(track.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);
    if (pending.length === 0) return;

    const remeasure = () => {
      const t = trackRef.current;
      if (!t) return;
      const overflow = t.scrollWidth - t.clientWidth;
      setTravel(overflow > 0 ? overflow : 0);
    };
    pending.forEach((img) => img.addEventListener("load", remeasure, { once: true }));
    return () => pending.forEach((img) => img.removeEventListener("load", remeasure));
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="work-showcase-heading"
      // Height drives how long the pin lasts. One viewport per card is the
      // ratio that felt right in the reference — less and the track whips
      // past, more and it drags.
      style={{ height: `${SHOWCASE.length * 60}vh` }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="container-narrow mb-10">
          <div className="max-w-md">
            <p className="label-mono mb-3">Selected work</p>
            <h2
              id="work-showcase-heading"
              className="font-display-refined mb-3 text-3xl leading-tight text-foreground md:text-4xl"
            >
              Things we shipped, running in production.
            </h2>
            <p className="text-sm text-muted-foreground">
              Every tile is a live site. Keep scrolling.
            </p>
          </div>
        </div>

        {/* The moving track. Padding-left matches the container so the first
            card starts on the same vertical edge as the headline above it. */}
        <motion.ul
          ref={trackRef}
          style={reduceMotion ? undefined : { x }}
          className={
            "flex list-none gap-6 pl-4 sm:pl-6 lg:pl-8 " +
            // Reduced motion gets a plain horizontal scroller — same content,
            // same order, driven by the reader instead of by the page.
            (reduceMotion ? "overflow-x-auto pb-4" : "")
          }
        >
          {SHOWCASE.map((project) => {
            const Icon = project.icon;
            return (
              <li key={project.id} className="shrink-0" style={{ width: CARD_W }}>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block border border-border/40 bg-card/30 backdrop-blur-sm transition-colors motion-snap hover:border-primary/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted/20">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} — screenshot`}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Icon className="h-12 w-12 text-primary/25" aria-hidden="true" />
                      </div>
                    )}

                    <div className="absolute right-3 top-3 translate-y-1 opacity-0 transition-all motion-snap group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="bg-primary p-1.5 text-primary-foreground">
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border/30 p-5">
                    <p className="label-mono mb-2">{project.category}</p>
                    <h3 className="text-base font-semibold leading-snug text-foreground transition-colors motion-snap group-hover:text-primary">
                      {project.title.split("—")[0].trim()}
                    </h3>
                  </div>
                </a>
              </li>
            );
          })}

          <li className="flex shrink-0 items-center pr-8" style={{ width: 280 }}>
            <Link
              to="/our-work"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors motion-snap hover:text-primary/80"
            >
              See all work
              <ArrowUpRight className="h-4 w-4 transition-transform motion-snap group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </li>
        </motion.ul>
      </div>
    </section>
  );
};

export default WorkShowcaseSection;
