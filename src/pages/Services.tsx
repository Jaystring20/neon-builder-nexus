import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryImage from "@/components/StoryImage";
import ServicesCTA from "@/components/ServicesCTA";
import { serviceCategories, pillarOrder, type Pillar } from "@/data/services";
import { storyImage } from "@/lib/storyImages";
import { BOOK_A_CALL } from "@/lib/contact";

// Copy: docs/services-copy.md. The page reads in the same order as the home
// page's "Brand. Platforms. People.": the pillar map first, then one block per
// practice, each a door to its own page.
const PILLARS: Record<Pillar, { line: string; imageId: string; alt: string }> = {
  Brand: {
    line: "Be understood, then be chosen.",
    imageId: "capability-brand",
    alt: "A mark cut into dark stone, repeated across smaller slabs",
  },
  Platforms: {
    line: "Software that carries the business.",
    imageId: "capability-platforms",
    alt: "An exploded stack of glass layers aligned on pins of light",
  },
  People: {
    line: "Teams that can run what we build.",
    imageId: "capability-people",
    alt: "A staircase of glass slabs rising toward a warm light",
  },
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const Services = () => {
  const reduce = useReducedMotion();
  const hasEngine = Boolean(storyImage("services-engine"));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Services"
        description="Brand, platforms and people, built together and powered by AI: Brand Architecture, Growth Operations, Digital Infrastructure, Agentic AI & Automation, and Training."
        path="/services"
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="blueprint-grid" />
          <div
            className={`container-narrow relative z-10 ${
              hasEngine ? "grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-10" : ""
            }`}
          >
            <div>
              <h1 className="font-display-refined hero-animate max-w-3xl text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
                Five practices. <span className="text-primary">One engine.</span>
              </h1>
              <p
                className="hero-animate mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
                style={{ animationDelay: "120ms" }}
              >
                Brand, platforms and people, built together and powered by AI. Start where you need to; we
                connect the rest.
              </p>
              <div className="hero-animate mt-10" style={{ animationDelay: "220ms" }}>
                <Button asChild variant="action" size="xl" className="group w-full sm:w-auto">
                  <a href={BOOK_A_CALL}>
                    Book a call
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </a>
                </Button>
              </div>
            </div>
            {hasEngine && (
              <StoryImage
                id="services-engine"
                alt="Five glass and graphite slabs joined in a ring around a warm core, like the parts of one machine"
                aspect="aspect-[16/9]"
                priority
                className="hero-animate [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
              />
            )}
          </div>
        </section>

        {/* Pillar map: which practice belongs to which part of the engine */}
        <section aria-label="Brand, Platforms and People" className="pb-24 md:pb-32">
          <div className="container-narrow grid gap-10 md:grid-cols-3 md:gap-8">
            {pillarOrder.map((pillar, i) => (
              <motion.div
                key={pillar}
                initial={reduce ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              >
                <StoryImage id={PILLARS[pillar].imageId} alt={PILLARS[pillar].alt} aspect="aspect-[4/5]" />
                <h2 className="mt-6 font-heading text-2xl font-medium tracking-tight text-foreground">{pillar}</h2>
                <p className="mt-2 text-base text-muted-foreground">{PILLARS[pillar].line}</p>
                <ul className="mt-4 space-y-2">
                  {serviceCategories
                    .filter((c) => c.pillar === pillar)
                    .map((c) => (
                      <li key={c.slug}>
                        <a
                          href={`#${c.slug}`}
                          className="group inline-flex items-center gap-2 text-base font-medium text-primary hover:text-foreground"
                        >
                          {c.title}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </a>
                      </li>
                    ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* One block per practice */}
        <section aria-label="Practices" className="border-t border-border/40">
          <div className="container-narrow">
            {serviceCategories.map((category) => (
              <article
                key={category.slug}
                id={category.slug}
                className="grid scroll-mt-28 gap-10 border-b border-border/40 py-16 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-20"
              >
                <div>
                  <StoryImage
                    id={`practice-${category.slug}`}
                    alt=""
                    aspect="aspect-[4/3]"
                    hideIfMissing
                    className="mb-8"
                  />
                  <p className="text-sm font-medium text-primary">{category.pillar}</p>
                  <h2 className="mt-3 font-display-refined text-4xl leading-[1.05] text-foreground sm:text-5xl">
                    {category.title}
                  </h2>
                  <p className="mt-5 text-xl leading-snug text-foreground/90">{category.tagline}</p>
                  <p className="mt-3 max-w-md text-base leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                  <Link
                    to={`/services/${category.slug}`}
                    className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary"
                  >
                    Explore {category.title}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>

                <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
                  {(category.menu ?? category.subServices).map((item) => {
                    const sub = category.subServices.find((s) => s.title === item.title);
                    const count = category.subServices.filter((s) => s.track === item.title).length;
                    return (
                      <li key={item.title} className="border-t border-border/40 pt-4">
                        <item.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                        <h3 className="mt-3 font-heading text-lg font-medium tracking-tight text-foreground">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {sub ? sub.description : `${count} ${count === 1 ? "programme" : "courses"}`}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <ServicesCTA />
      </main>

      <Footer />
    </div>
  );
};

export default Services;
