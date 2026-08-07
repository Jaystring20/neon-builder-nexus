import { portfolioProjects } from "@/data/portfolio";

const TrustBar = () => {
  // Duplicated 2x: the scroll-left keyframe animates to translateX(-50%),
  // which only loops seamlessly when the second half mirrors the first.
  // Note: this component is not currently mounted anywhere (superseded by
  // HeroProofSection); kept correct here in case it's reintroduced.
  const items = [...portfolioProjects, ...portfolioProjects];
  return (
    <section aria-label="Trusted by" className="relative border-y border-border/30 bg-card/30 py-8 backdrop-blur-sm">
      <div className="container-narrow">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-10">
          <p className="flex-shrink-0 text-center text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground lg:text-left">
            Trusted by builders <br className="hidden lg:block" />
            <span className="text-primary">shaping what's next</span>
          </p>

          <div className="relative w-full overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />
            <div className="flex w-max items-center gap-10" style={{ animation: "scroll-left 45s linear infinite" }}>
              {items.map((p, i) => {
                const Icon = p.icon;
                return (
                  <a
                    key={i}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-shrink-0 items-center gap-2.5 opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                    <span className="whitespace-nowrap font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
                      {p.title.split("—")[0].trim().split("|")[0].trim()}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustBar;
