import { portfolioProjects } from "@/data/portfolio";
import LazyImage from "@/components/LazyImage";

const HeroVisualSection = () => {
  // Split into two rows for opposing-direction marquees.
  // Each row's content is duplicated (2x) because the scroll-left/scroll-right
  // keyframes animate to translateX(-50%) — the loop only reads as seamless
  // if the second half exactly mirrors the first. This is the standard
  // infinite-marquee technique (same as Stripe/GitHub logo strips), not a bug.
  const rowA = [...portfolioProjects, ...portfolioProjects];
  const rowB = [...portfolioProjects.slice().reverse(), ...portfolioProjects.slice().reverse()];

  return (
    <section className="section-inverse py-16 md:py-24 overflow-hidden">
      <div className="container-narrow mb-10 md:mb-14">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <h2 className="font-display-bold text-3xl uppercase text-foreground sm:text-4xl md:text-5xl">
            Builds that <span className="font-serif-display normal-case text-primary">ship.</span>
          </h2>
          <p className="max-w-md text-sm text-muted-foreground md:text-base">
            A live look at brands we've architected — every tile is a real, shipped product.
          </p>
        </div>
      </div>

      {/* Row 1 — left */}
      <Marquee items={rowA} direction="left" duration={50} />

      {/* Row 2 — right (opposite) */}
      <div className="mt-5 md:mt-6">
        <Marquee items={rowB} direction="right" duration={60} />
      </div>
    </section>
  );
};

const Marquee = ({
  items,
  direction,
  duration,
}: {
  items: typeof import("@/data/portfolio").portfolioProjects;
  direction: "left" | "right";
  duration: number;
}) => {
  return (
    <div className="relative w-full overflow-hidden">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[hsl(var(--surface-inverse))] to-transparent md:w-32" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[hsl(var(--surface-inverse))] to-transparent md:w-32" />

      <div
        className="flex w-max gap-4 md:gap-6"
        style={{
          animation: `${direction === "left" ? "scroll-left" : "scroll-right"} ${duration}s linear infinite`,
        }}
      >
        {items.map((p, i) => (
          <a
            key={`${p.id}-${i}`}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block h-[200px] w-[300px] shrink-0 overflow-hidden rounded-2xl border border-border bg-muted shadow-[0_20px_50px_-25px_rgba(0,0,0,0.35)] transition-all duration-500 hover:-translate-y-1 active:scale-[0.98] active:duration-100 md:h-[280px] md:w-[440px]"
          >
            {p.image && (
              <LazyImage
                src={p.image}
                alt={p.title}
                containerClassName="h-full w-full"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 md:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                {p.category}
              </p>
              <p className="mt-1 line-clamp-1 font-heading text-sm font-bold text-white md:text-base">
                {p.title}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default HeroVisualSection;
