import { portfolioProjects } from "@/data/portfolio";

const HeroProofSection = () => {
  const brands = portfolioProjects.slice(0, 6);

  return (
    <section className="section-inverse py-16 md:py-24">
      <div className="container-narrow">
        <p className="text-center font-heading text-base font-medium text-foreground/80 md:text-lg">
          Architected for{" "}
          <span className="font-bold text-foreground">real brands</span>{" "}
          doing real work across 8+ industries.
        </p>

        <div className="mt-10 grid grid-cols-2 items-center gap-x-10 gap-y-8 sm:grid-cols-3 md:mt-14 md:grid-cols-6">
          {brands.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                className="flex flex-col items-center gap-2 opacity-70 transition-opacity duration-300 hover:opacity-100"
              >
                <Icon className="h-7 w-7 text-foreground/70" strokeWidth={1.6} />
                <span className="text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground/60">
                  {b.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroProofSection;
