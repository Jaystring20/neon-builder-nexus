import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { portfolioProjects } from "@/data/portfolio";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

// Proof as plain type rather than imagery — naming real shipped work is a
// quieter, more confident claim than showing screenshots. Names are derived
// from the portfolio data so they can't drift out of sync with reality.
//
// These are the same builds ProofStorySection tells the story of, in the same
// order. The hero naming one set of work while the section directly below it
// discusses another reads as carelessness, so the two lists move together.
// Viera Amber is the third proof story but has no portfolio entry yet, so it
// cannot be named here; adding it to portfolio.ts is what makes it appear.
const PROOF_IDS = ["fitness-religion", "soteria-mh-eyewear"];

const proofNames = PROOF_IDS.map((id) => portfolioProjects.find((p) => p.id === id))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))
  .map((p) => p.title.split("—")[0].trim().split("|")[0].trim());

// Counted from the portfolio source rather than hardcoded, so the title block
// can never overstate the record. (HeroProofSection's "8+ industries" actually
// understates it — the real figure is computed here.)
const buildCount = portfolioProjects.length;
const sectorCount = new Set(portfolioProjects.map((p) => p.category)).size;

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
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20 md:min-h-[85vh] md:pt-36 md:pb-16">
      {/* Drafting substrate — replaces the soft radial glow that used to sit here.
          The glow was the most category-generic element left in the fold; a ruled
          plane says "engineered" in a way a blur cannot, and it earns its place
          by carrying the brand cyan through structure rather than atmosphere. */}
      <div className="blueprint-grid" />

      {/* Tactile grain — adds depth to the flat dark gradient without adding visual clutter */}
      <div className="grain-overlay" />

      <div className="container-narrow relative z-10 w-full">
        {/* Left-aligned, not centred. Centred symmetry is the safest composition
            there is and reads as template; the reference sites measured for this
            brief (Superside, Instrument) are both left-aligned, which lets the
            headline start on a hard vertical edge like a drawing does. */}
        <div className="max-w-3xl">
          <h1
            className="font-display-refined hero-animate mb-7 text-[2.75rem] leading-[1.05] text-foreground sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem]"
            style={{ animationDelay: "80ms" }}
          >
            {/* Both lines carry equal weight. "Not Bought." is the argument —
                "the future is built" alone is a platitude — so it was previously
                undercut by being set 24% smaller and dimmer than the line above
                it. One accent (the serif "Built.") is enough articulation for a
                five-word headline; three sizes and three colours read as fussy
                rather than confident. */}
            The Future is{" "}
            <span className="font-serif-display text-[3rem] leading-none text-primary sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.75rem]">
              Built.
            </span>
            <br />
            Not Bought.
          </h1>

          <p
            className="hero-animate mb-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            We design the brand, build the infrastructure, and wire in the AI
            systems that run it — as one connected build, not a stack of vendors.
          </p>

          <div
            className="hero-animate flex flex-col items-stretch gap-5 sm:flex-row sm:items-center sm:justify-start"
            style={{ animationDelay: "260ms" }}
          >
            <Button
              ref={ctaRef}
              variant="pill"
              size="xl"
              isLoading={isLoading}
              onClick={() => handleCtaClick(() => scrollToId("contact"))}
              onMouseMove={handleCtaMouseMove}
              onMouseLeave={handleCtaMouseLeave}
              className="group w-full sm:w-auto"
            >
              {!isLoading && (
                <>
                  Start the Build
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

        {/* Title block — the strip an architect rules along the bottom of a
            drawing sheet to record who built it, where, and to what spec. It is
            what gives the drafting grid behind it a reason to exist, and unlike
            decoration it carries only checkable facts: the base is stated on the
            About page, the counts are computed from the portfolio source. */}
        <dl
          className="hero-animate mt-16 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-border/40 pt-5 text-[0.7rem] uppercase tracking-[0.16em] sm:gap-x-14 sm:text-xs md:mt-20"
          style={{ animationDelay: "340ms" }}
        >
          <div>
            <dt className="text-foreground/50">Base</dt>
            <dd className="mt-1.5 text-foreground/90">Lagos → Global</dd>
          </div>

          <div>
            <dt className="text-foreground/50">Shipped</dt>
            <dd className="mt-1.5 text-foreground/90">
              {buildCount} builds · {sectorCount} sectors
            </dd>
          </div>

          {/* Always full width. A three-column variant was tried, but the names
              need ~600px to hold one line and a third column only clears that
              past ~1400px — below which the field wrapped and left the block
              ragged. A wide field spanning its own row is also closer to how a
              real title block is ruled. */}
          <div className="col-span-2">
            <dt className="text-foreground/50">Selected work</dt>
            <dd className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-foreground/90 sm:gap-x-4">
              {proofNames.map((name, i) => (
                <span key={name} className="flex items-center gap-x-3 sm:gap-x-4">
                  {i > 0 && (
                    <>
                      {/* Divider is decorative; the comma keeps the names from
                          running together for screen readers and on copy-paste. */}
                      <span className="sr-only">, </span>
                      <span aria-hidden="true" className="h-3 w-px bg-foreground/20" />
                    </>
                  )}
                  {name}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

export default HeroSection;
