import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServicesCTA from "@/components/ServicesCTA";
import { serviceCategories, steamLinks, trainingPartner, type ServiceCategory, type SubService } from "@/data/services";
import { BOOK_A_CALL } from "@/lib/contact";

// Copy: docs/services-copy.md. Four practices list their services; Training
// groups its courses into tracks and points each AI course at the practice
// that builds the same thing for clients.

const practiceTitle = (slug: string) => serviceCategories.find((c) => c.slug === slug)?.title ?? slug;

const ServiceRow = ({ sub }: { sub: SubService }) => (
  <li className="grid gap-4 border-t border-border/40 py-8 md:grid-cols-[1fr_1.4fr] md:gap-12">
    <div className="flex items-start gap-4">
      <sub.icon aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
      <h3 className="font-heading text-xl font-medium tracking-tight text-foreground sm:text-2xl">{sub.title}</h3>
    </div>
    <div>
      <p className="text-lg leading-snug text-foreground/90">{sub.description}</p>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{sub.detail}</p>
      {sub.audience && <p className="mt-3 text-sm text-primary">For: {sub.audience}</p>}
      {sub.pairsWith && (
        <p className="mt-3 text-sm text-muted-foreground">
          Pairs with{" "}
          {sub.pairsWith.map((slug, i) => (
            <span key={slug}>
              {i > 0 && " and "}
              <Link to={`/services/${slug}`} className="font-medium text-primary hover:text-foreground">
                {practiceTitle(slug)}
              </Link>
            </span>
          ))}
          : we build it, then train your team to run it.
        </p>
      )}
    </div>
  </li>
);

const TrackHeading = ({ title, line }: { title: string; line: string }) => (
  <div className="max-w-2xl pt-16 md:pt-20">
    <h2 className="font-display-refined text-3xl leading-[1.05] text-foreground sm:text-4xl">{title}</h2>
    <p className="mt-3 text-lg text-muted-foreground">{line}</p>
  </div>
);

const TrainingBody = ({ category }: { category: ServiceCategory }) => {
  const ai = category.subServices.filter((s) => s.track === "AI Training");
  const stages = ["Foundations", "Automate", "Create & build"] as const;
  const workforce = category.subServices.filter((s) => s.track === "Workforce Development");
  const steam = category.subServices.filter((s) => s.track === "STEAM Training");

  return (
    <>
      {/* Partner credit: most of the training is co-organised by DCH and
          AIRS, so the partnership sits over all three tracks, not one. */}
      <div className="mt-12 flex flex-col gap-2 border-y border-border/40 py-6 sm:flex-row sm:items-baseline sm:gap-6">
        <p className="text-sm font-medium text-primary">Co-organised with</p>
        <p className="font-heading text-xl font-medium tracking-tight text-foreground">
          {trainingPartner.name} <span className="text-muted-foreground">({trainingPartner.short})</span>
        </p>
      </div>

      <TrackHeading title="AI Training" line="From first steps to building, in three stages." />
      {stages.map((stage) => (
        <div key={stage} className="mt-10">
          <h3 className="text-sm font-medium text-primary">{stage}</h3>
          <ul className="mt-2">
            {ai.filter((s) => s.stage === stage).map((sub) => (
              <ServiceRow key={sub.title} sub={sub} />
            ))}
          </ul>
        </div>
      ))}

      <TrackHeading
        title="Workforce Development"
        line="AI capability for the people who teach, lead and do the work."
      />
      <ul className="mt-8">
        {workforce.map((sub) => (
          <ServiceRow key={sub.title} sub={sub} />
        ))}
      </ul>

      <TrackHeading title="STEAM Training" line="AI and robotics for young innovators aged 6 to 20, and for youths." />
      <ul className="mt-8">
        {steam.map((sub) => (
          <ServiceRow key={sub.title} sub={sub} />
        ))}
      </ul>
      <div className="mt-2 flex flex-col gap-4 border-t border-border/40 pt-8 sm:flex-row sm:items-center sm:gap-8">
        <Button asChild variant="pill" size="lg" className="group w-full sm:w-auto">
          <a href={steamLinks.foundry} target="_blank" rel="noreferrer">
            Explore STEAM Foundry
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </Button>
      </div>

      <p className="mt-16 border-l-2 border-secondary pl-5 text-lg text-foreground md:mt-20">
        Every course runs as a cohort, workshop or one-to-one, online or in person.
      </p>
    </>
  );
};

const ServiceCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = serviceCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container-narrow pt-40 pb-24">
          <h1 className="font-display-refined text-4xl text-foreground sm:text-5xl">We couldn&rsquo;t find that service.</h1>
          <Link
            to="/services"
            className="group mt-8 inline-flex items-center gap-2 text-base font-semibold text-primary hover:text-foreground"
          >
            See all services
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const others = serviceCategories.filter((c) => c.slug !== category.slug);

  return (
    <div className="min-h-screen bg-background">
      <SEO title={category.title} description={`${category.tagline} ${category.description}`} path={`/services/${category.slug}`} />
      <Navbar />

      <main>
        <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
          <div className="blueprint-grid" />
          <div className="container-narrow relative z-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              All services
            </Link>
            <p className="mt-10 text-sm font-medium text-primary">{category.pillar}</p>
            <h1 className="font-display-refined hero-animate mt-3 max-w-4xl text-balance text-[2.6rem] leading-[1.02] text-foreground sm:text-6xl lg:text-7xl">
              {category.title}
            </h1>
            <p className="hero-animate mt-6 max-w-2xl text-2xl leading-snug text-foreground/90" style={{ animationDelay: "100ms" }}>
              {category.tagline}
            </p>
            <p className="hero-animate mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground" style={{ animationDelay: "160ms" }}>
              {category.description}
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
        </section>

        <section aria-label={`${category.title} services`} className="pb-8">
          <div className="container-narrow">
            {category.slug === "training" ? (
              <TrainingBody category={category} />
            ) : (
              <ul className="mt-8">
                {category.subServices.map((sub) => (
                  <ServiceRow key={sub.title} sub={sub} />
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* The rest of the engine */}
        <section aria-labelledby="others-heading" className="mt-16 border-t border-border/40 pt-16 md:mt-24">
          <div className="container-narrow">
            <h2 id="others-heading" className="font-heading text-2xl font-medium tracking-tight text-foreground">
              The rest of the engine
            </h2>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {others.map((c) => (
                <li key={c.slug}>
                  <Link to={`/services/${c.slug}`} className="group block border-t border-border/40 pt-4">
                    <span className="text-sm text-primary">{c.pillar}</span>
                    <span className="mt-1 flex items-center gap-2 font-heading text-lg font-medium text-foreground group-hover:text-primary">
                      {c.title}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{c.tagline}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ServicesCTA />
      </main>

      <Footer />
    </div>
  );
};

export default ServiceCategoryPage;
