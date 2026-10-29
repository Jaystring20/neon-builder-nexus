import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { HeroBackdrop, HeroInline } from "@/components/HeroMedia";
import { hasHeroVideo } from "@/lib/heroMedia";

// Copy lives in docs/landing-copy.md (section 1). The headline opens the
// story; the sub-line answers "momentum of what, for whom"; the flywheel
// shows the rest.
const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
    <section className="relative flex items-center overflow-hidden pt-24 pb-4 sm:pt-28 sm:pb-8 md:pt-32 md:pb-16 lg:min-h-[100svh] lg:pb-20">
      <div className="blueprint-grid" />
      <HeroBackdrop />
      <div className="grain-overlay" />

      <div className="container-narrow relative z-10 w-full">
        <div
          className={
            hasHeroVideo
              ? "grid items-center gap-2 sm:gap-10"
              : "grid items-center gap-2 sm:gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8"
          }
        >
          <div className="max-w-[40rem]">
            <p
              className="hero-animate mb-3 text-sm font-medium text-muted-foreground sm:hidden"
              style={{ animationDelay: "40ms" }}
            >
              For founders and growing brands
            </p>
            <h1
              className="font-display-refined hero-animate mb-5 text-balance text-[3.4rem] leading-[1] text-foreground sm:mb-7 sm:text-[3.5rem] sm:leading-[1.02] lg:text-[3.75rem] xl:text-[4.25rem]"
              style={{ animationDelay: "80ms" }}
            >
              <span className="block">
                Growth made <span className="text-primary">possible.</span>
              </span>
            </h1>

            <p
              className="hero-animate mb-7 max-w-[34rem] text-base leading-relaxed text-muted-foreground sm:mb-9 sm:text-lg"
              style={{ animationDelay: "180ms" }}
            >
              We build the brand, platforms and people behind your growth, with AI
              in every layer.
              <span className="hidden sm:inline">
                {" "}For startups, established brands and people outgrowing where they are.
              </span>
            </p>

            <div
              className="hero-animate flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-start sm:gap-5"
              style={{ animationDelay: "260ms" }}
            >
              <Button
                ref={ctaRef}
                variant="action"
                size="xl"
                isLoading={isLoading}
                onClick={() => handleCtaClick(() => navigate("/diagnostic"))}
                onMouseMove={handleCtaMouseMove}
                onMouseLeave={handleCtaMouseLeave}
                className="group w-full sm:w-auto"
              >
                {!isLoading && (
                  <>
                    Take the free diagnostic
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>

              <Button asChild variant="subtle" size="xl" className="group hidden sm:inline-flex sm:w-auto">
                <Link to="/book">
                  Book a call
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Link
                to="/book"
                className="group inline-flex min-h-11 items-center justify-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline sm:hidden"
              >
                Book a call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <p className="hero-animate mt-2 text-center text-xs text-muted-foreground sm:mt-4 sm:text-left sm:text-sm" style={{ animationDelay: "320ms" }}>
              <span className="sm:hidden">Free, 4 minutes, no sales call</span>
              <span className="hidden sm:inline">Free · 4 minutes · see where you stand before you talk to anyone</span>
            </p>
          </div>

          <HeroInline />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
