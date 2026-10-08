import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroBackdrop, HeroInline } from "@/components/HeroMedia";
import { hasHeroVideo } from "@/lib/heroMedia";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Copy lives in docs/landing-copy.md (section 1). The headline opens the
// story; the sub-line answers "momentum of what, for whom"; the flywheel
// shows the rest.
const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);

  const handleCtaClick = (callback: () => void) => {
    setIsLoading(true);
    callback();
    setTimeout(() => setIsLoading(false), 500);
  };

  // Subtle magnetic pull toward the cursor — bounded, dampened, resets on leave.
  // Transition is controlled imperatively (not via Tailwind classes) so mousemove
  // tracking stays instant while the release still eases smoothly — the shared
  // Button component's own `transition-all duration-300` would otherwise fight
  // for the same `transform` property and make tracking feel laggy.
  const handleCtaMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ctaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transition = "none";
    el.style.transform = `translate(${x * 0.25}px, ${y * 0.25 - 2}px)`;
  };

  const handleCtaMouseLeave = () => {
    const el = ctaRef.current;
    if (!el) return;
    el.style.transition = "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
    el.style.transform = "";
  };

  return (
    <section className="relative flex items-center overflow-hidden pt-28 pb-8 md:pt-32 md:pb-16 lg:min-h-[100svh] lg:pb-20">
      {/* Drafting substrate and grain, unchanged: the flywheel sits on the
          same ruled plane the rest of the site is drawn on. */}
      <div className="blueprint-grid" />
      <HeroBackdrop />
      <div className="grain-overlay" />

      <div className="container-narrow relative z-10 w-full">
        <div
          className={
            hasHeroVideo
              ? "grid items-center gap-10"
              : "grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8"
          }
        >
          <div className="max-w-[40rem]">
            {/* Two short lines in one family. The turn ("Momentum doesn't.")
                carries the brand colour; weight and colour do the emphasis,
                not a second typeface. */}
            <h1
              className="font-display-refined hero-animate mb-7 text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-[3.5rem] lg:text-[3.75rem] xl:text-[4.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              <span className="block">Projects end.</span>
              <span className="block text-primary sm:whitespace-nowrap">Momentum doesn&rsquo;t.</span>
            </h1>

            <p
              className="hero-animate mb-9 max-w-[34rem] text-base leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              We build the brand, platforms and people behind your growth, with AI
              in every layer. For startups, established brands and people
              outgrowing where they are.
            </p>

            <div
              className="hero-animate flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-start"
              style={{ animationDelay: "260ms" }}
            >
              <Button
                ref={ctaRef}
                variant="action"
                size="xl"
                isLoading={isLoading}
                onClick={() => handleCtaClick(() => scrollToId("contact"))}
                onMouseMove={handleCtaMouseMove}
                onMouseLeave={handleCtaMouseLeave}
                className="group w-full sm:w-auto"
              >
                {!isLoading && (
                  <>
                    Book a call
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <Link
                to="/our-work"
                className="group -m-2 inline-flex items-center justify-center gap-2 p-2 text-base font-semibold text-foreground/75 transition-all duration-300 hover:text-foreground active:scale-95 active:duration-100 sm:justify-start sm:text-lg"
              >
                See the work
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <HeroInline />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
