import { portfolioProjects } from "@/data/portfolio";

const HeroVisualSection = () => {
  const featured = portfolioProjects[0];

  return (
    <section className="section-inverse pb-20 md:pb-28">
      <div className="container-narrow">
        <figure className="overflow-hidden rounded-3xl border border-border shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]">
          <div className="aspect-[16/10] w-full overflow-hidden bg-muted md:aspect-[21/9]">
            {featured.image && (
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            )}
          </div>
          <figcaption className="flex flex-col items-start gap-2 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Featured Build · {featured.category}
              </p>
              <p className="mt-1 font-heading text-base font-bold text-foreground md:text-lg">
                {featured.title}
              </p>
            </div>
            <a
              href={featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
            >
              View live →
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default HeroVisualSection;
