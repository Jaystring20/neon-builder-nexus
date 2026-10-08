import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StoryImage from "@/components/StoryImage";
import { Button } from "@/components/ui/button";
import { storyImage } from "@/lib/storyImages";
import { trainingPartner } from "@/data/services";
import { BOOK_A_CALL } from "@/lib/contact";
import jerryImage from "@/assets/jerry-strategist.png";

// Copy: docs/about-copy.md, built from the brand brief in PRODUCT.md. The home
// page already makes the case; this page answers "who are you, and how do you
// think?" in as few words as it can, with the images carrying the rest.

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const BUILT_FOR_GROWTH = [
  {
    pillar: "Brand",
    line: "Brand identities that command rooms.",
    imageId: "capability-brand",
    href: "/services/brand-architecture",
  },
  {
    pillar: "Platforms",
    line: "SaaS platforms that scale operations.",
    imageId: "capability-platforms",
    href: "/services/digital-infrastructure",
  },
  {
    pillar: "People",
    line: "Training that turns individuals into high performers.",
    imageId: "capability-people",
    href: "/services/training",
  },
];

const APPROACH = [
  { title: "Diagnostic.", line: "We find the real problem before we build anything." },
  { title: "Deliberate.", line: "Every part is designed to work with the others." },
  { title: "Outcome-focused.", line: "We measure what moves, then keep it moving." },
];

const About = () => {
  const reduce = useReducedMotion();
  const reveal = (i = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay: i * 0.1, ease: EASE },
  });
  const hasHeroImage = Boolean(storyImage("about-beyond-borders"));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About"
        description="Digital Creatives Hub is a business development creative agency where strategy, technology and human potential meet. We go where growth needs to happen."
        path="/about"
      />
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="blueprint-grid" />
          <div
            className={`container-narrow relative z-10 ${
              hasHeroImage ? "grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-10" : ""
            }`}
          >
            <div>
              <h1 className="font-display-refined hero-animate max-w-3xl text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
                We go where growth <span className="text-primary">needs to happen.</span>
              </h1>
              <p
                className="hero-animate mt-7 max-w-xl text-lg leading-relaxed text-muted-foreground"
                style={{ animationDelay: "120ms" }}
              >
                Digital Creatives Hub is a business development creative agency, working where strategy,
                technology and human potential meet.
              </p>
            </div>
            {hasHeroImage && (
              <StoryImage
                id="about-beyond-borders"
                alt="A glass slab passing straight through a thin wall of light, trailing cyan"
                aspect="aspect-[16/9]"
                priority
                className="hero-animate [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]"
              />
            )}
          </div>
        </section>

        {/* If it connects to growth */}
        <section aria-labelledby="growth-heading" className="border-t border-border/40 py-24 md:py-32">
          <div className="container-narrow">
            <h2
              id="growth-heading"
              className="font-display-refined max-w-3xl text-balance text-4xl leading-[1.05] text-foreground sm:text-5xl"
            >
              If it connects to growth, <span className="text-primary">we&rsquo;re built for it.</span>
            </h2>

            <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
              {BUILT_FOR_GROWTH.map((item, i) => (
                <motion.div key={item.pillar} {...reveal(i)}>
                  <Link to={item.href} className="group block">
                    <StoryImage id={item.imageId} alt="" aspect="aspect-[4/5]" />
                    <p className="mt-6 text-sm font-medium text-primary">{item.pillar}</p>
                    <p className="mt-2 flex items-start justify-between gap-4 font-heading text-xl font-medium leading-snug tracking-tight text-foreground group-hover:text-primary">
                      {item.line}
                      <ArrowRight className="mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>

            <p className="mt-16 max-w-2xl border-l-2 border-secondary pl-5 text-lg text-foreground md:mt-20">
              AI runs through all of it: in the strategy, in the workflow and in everything we ship. That&rsquo;s
              why the results <span className="font-semibold text-secondary">compound</span>.
            </p>
          </div>
        </section>

        {/* Approach */}
        <section aria-labelledby="approach-heading" className="border-t border-border/40 py-24 md:py-32">
          <div className="container-narrow">
            <h2
              id="approach-heading"
              className="font-display-refined max-w-3xl text-balance text-4xl leading-[1.05] text-foreground sm:text-5xl"
            >
              Never one-size-fits-all.
            </h2>
            <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-3 md:gap-8">
              {APPROACH.map((beat, i) => (
                <motion.div
                  key={beat.title}
                  {...reveal(i)}
                  className={`border-t pt-6 ${i === APPROACH.length - 1 ? "border-secondary" : "border-primary/40"}`}
                >
                  <p className="font-heading text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
                    {beat.title}
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-muted-foreground">{beat.line}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* At the helm */}
        <section id="founder" aria-labelledby="founder-heading" className="scroll-mt-28 border-t border-border/40 py-24 md:py-32">
          <div className="container-narrow">
            <h2
              id="founder-heading"
              className="font-display-refined max-w-3xl text-balance text-4xl leading-[1.05] text-foreground sm:text-5xl"
            >
              At the helm.
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
              DCH is led by DigiTech Strategists whose work cuts across organisations, brands and individuals.
            </p>

            <div className="mt-14 grid items-center gap-10 md:mt-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
              <motion.div {...reveal()} className="relative aspect-[4/5] overflow-hidden bg-card/40">
                <img
                  src={jerryImage}
                  alt="Jeremiah Adeyemi, founder of Digital Creatives Hub"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 border border-foreground/[0.06]" />
              </motion.div>

              <motion.div {...reveal(1)}>
                <p className="text-sm font-medium text-primary">Founder &amp; Lead Architect</p>
                <h3 className="mt-3 font-display-refined text-4xl leading-[1.05] text-foreground sm:text-5xl">
                  Jeremiah Adeyemi
                </h3>
                <p className="mt-2 text-lg text-muted-foreground">The DigiTech Strategist</p>
                <p className="mt-8 max-w-lg text-xl leading-snug text-foreground/90">
                  Founded DCH on one idea: real growth needs the vision of a creative and the precision of an
                  engineer.
                </p>
                <blockquote className="mt-8 max-w-lg border-l-2 border-primary/50 pl-5 text-lg italic text-muted-foreground">
                  He doesn&rsquo;t just draw the map. He builds the road, the car and the fuel.
                </blockquote>
                <a
                  href="https://thedigitechstrategist.lovable.app"
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-10 inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary"
                >
                  Connect with Jeremiah
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Partners */}
        <section id="partners" aria-labelledby="partners-heading" className="scroll-mt-28 border-t border-border/40 py-24 md:py-32">
          <div className="container-narrow grid gap-12 md:grid-cols-[1fr_1.2fr] md:items-center md:gap-16">
            <div>
              <h2
                id="partners-heading"
                className="font-display-refined text-balance text-4xl leading-[1.05] text-foreground sm:text-5xl"
              >
                Built with partners.
              </h2>
              <div className="mt-10 border-t border-border/40 pt-6">
                <p className="text-sm font-medium text-primary">Training partner</p>
                <p className="mt-2 font-heading text-2xl font-medium tracking-tight text-foreground">
                  {trainingPartner.name} <span className="text-muted-foreground">({trainingPartner.short})</span>
                </p>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  Most of our training is co-organised with {trainingPartner.short}.
                </p>
                <Link
                  to="/services/training"
                  className="group mt-6 inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-foreground"
                >
                  See the training
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
            <StoryImage
              id="about-partnership"
              alt="Two structures, one graphite and one glass, building a bridge toward each other"
              aspect="aspect-[16/9]"
              hideIfMissing
            />
          </div>
        </section>

        {/* Close */}
        <section aria-labelledby="close-heading" className="border-t border-border/40 py-28 md:py-40">
          <div className="container-narrow">
            <h2
              id="close-heading"
              className="font-display-refined max-w-3xl text-balance text-[2.5rem] leading-[1.02] text-foreground sm:text-6xl"
            >
              We don&rsquo;t chase every brief.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              We pursue the right problems, and we solve them completely.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-5 sm:flex-row sm:items-center">
              <Button asChild variant="action" size="xl" className="group w-full sm:w-auto">
                <a href={BOOK_A_CALL}>
                  Book a call
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Link
                to="/discovery"
                className="group inline-flex items-center justify-center gap-2 text-base text-foreground/75 transition-colors hover:text-foreground sm:justify-start"
              >
                Not ready to talk? <span className="font-semibold text-foreground">Take the discovery.</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
