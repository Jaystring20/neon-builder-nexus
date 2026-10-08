import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactCTASection from "@/components/ContactCTASection";
import { portfolioProjects, type PortfolioProject } from "@/data/portfolio";

// Copy: docs/our-work-copy.md. Real screenshots only (PRODUCT.md, principle
// 2): projects with a story are told as problem, what we built, and what
// exists now; the rest sit in a grid. No totals or percentages, because the
// list is hand-picked rather than complete.

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const featured = portfolioProjects.filter((p) => p.story && p.image);
const more = portfolioProjects.filter((p) => !featured.includes(p));

// A link to the live site when there is one, otherwise a plain frame.
const Screenshot = ({
  project,
  className,
  position = "object-left-top",
}: {
  project: PortfolioProject;
  className?: string;
  /** Which part of the screenshot survives the crop. */
  position?: string;
}) => {
  const Frame = project.url ? "a" : "div";
  return (
    <Frame
      {...(project.url
        ? { href: project.url, target: "_blank", rel: "noreferrer", "aria-label": `Visit ${project.title}` }
        : {})}
      className={`group/shot relative block overflow-hidden border border-foreground/[0.08] bg-card/40 ${className ?? ""}`}
    >
      {project.image ? (
        <img
          src={project.image}
          alt={`${project.title} website`}
          loading="lazy"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover ${project.imagePosition ?? position} transition-transform duration-700 group-hover/shot:scale-[1.03]`}
        />
      ) : (
        <div aria-hidden="true" className="story-standin absolute inset-0" />
      )}
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-background/95 to-transparent px-5 pb-4 pt-14 text-sm font-medium text-foreground">
        {project.displayDomain}
        {project.url && (
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover/shot:-translate-y-0.5 group-hover/shot:translate-x-0.5" />
        )}
      </span>
    </Frame>
  );
};

const OurWork = () => {
  const reduce = useReducedMotion();
  const reveal = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Work"
        description="Brands and platforms built by Digital Creatives Hub: the problem each one had, what we built, and what exists now."
        path="/our-work"
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="blueprint-grid" />
          <div className="container-narrow relative z-10">
            <h1 className="font-display-refined hero-animate max-w-4xl text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              Built to move. <span className="text-primary">Still moving.</span>
            </h1>
            <p
              className="hero-animate mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
              style={{ animationDelay: "120ms" }}
            >
              A hand-picked selection of the brands and platforms we&rsquo;ve shipped.
            </p>
          </div>
        </section>

        {/* Featured: the problem, what we built, what exists now */}
        <section aria-label="Featured work" className="border-t border-border/40">
          <div className="container-narrow">
            {featured.map((project, i) => (
              <motion.article
                key={project.id}
                {...reveal()}
                className="grid gap-10 border-b border-border/40 py-16 md:grid-cols-2 md:items-center md:gap-16 md:py-24"
              >
                <Screenshot
                  project={project}
                  className={`aspect-[16/10] ${i % 2 === 1 ? "md:order-2" : ""}`}
                />
                <div>
                  <p className="text-sm font-medium text-primary">{project.category}</p>
                  <h2 className="mt-3 font-display-refined text-4xl leading-[1.05] text-foreground sm:text-5xl">
                    {project.title}
                  </h2>
                  <p className="mt-6 text-lg leading-snug text-foreground/90">{project.story!.problem}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {project.story!.built.map((item) => (
                      <li
                        key={item}
                        className="border border-primary/30 bg-primary/5 px-3 py-1.5 text-sm text-foreground"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-l-2 border-secondary pl-4 text-base text-muted-foreground">
                    {project.story!.outcome}
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* More work */}
        {more.length > 0 && (
          <section aria-labelledby="more-heading" className="py-24 md:py-32">
            <div className="container-narrow">
              <h2
                id="more-heading"
                className="font-display-refined text-4xl leading-[1.05] text-foreground sm:text-5xl"
              >
                More we&rsquo;ve shipped.
              </h2>
              <ul className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((project, i) => (
                  <motion.li key={project.id} {...reveal(i)}>
                    <Screenshot project={project} className="aspect-[16/10]" />
                    <p className="mt-5 text-sm font-medium text-primary">{project.category}</p>
                    <h3 className="mt-1 font-heading text-xl font-medium tracking-tight text-foreground">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-base leading-relaxed text-muted-foreground">{project.description}</p>
                  </motion.li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <ContactCTASection />
      </main>

      <Footer />
    </div>
  );
};

export default OurWork;
