import { Search, LayoutGrid, Cog, Rocket } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const PillarsSection = () => {
  const pillars = [
    {
      icon: Search,
      number: "01",
      title: "The Extraction",
      subtitle: "The Soul",
      description: "We strip away the noise to find the 'Builder' inside your brand.",
      color: "primary" as const,
    },
    {
      icon: LayoutGrid,
      number: "02",
      title: "The Architecture",
      subtitle: "The Skeleton",
      description: "We design the high-conversion platforms that hold your growth together.",
      color: "secondary" as const,
    },
    {
      icon: Cog,
      number: "03",
      title: "The Engine",
      subtitle: "The Muscle",
      description: "We build the content systems and smart tools that run while you sleep.",
      color: "primary" as const,
    },
    {
      icon: Rocket,
      number: "04",
      title: "The Velocity",
      subtitle: "The Fuel",
      description: "We deploy the performance campaigns that turn attention into an empire.",
      color: "secondary" as const,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[80px] md:blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/8 rounded-full blur-[70px] md:blur-[120px]" />

      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              The 4 Pillars of{" "}
              <span className="text-primary">Momentum</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="mx-auto max-w-2xl">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} animation="fade-up" delay={index * 100}>
              <div className="group relative flex gap-6 pb-12 last:pb-0">
                {/* Connecting line down to the next pillar */}
                {index < pillars.length - 1 && (
                  <div className="absolute left-7 top-16 bottom-0 w-px bg-border/60" />
                )}

                {/* Icon marker */}
                <div
                  className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl border transition-all duration-500 group-hover:scale-105 ${
                    pillar.color === "primary"
                      ? "border-primary/30 bg-primary/10 group-hover:border-primary/60"
                      : "border-secondary/30 bg-secondary/10 group-hover:border-secondary/60"
                  }`}
                >
                  <pillar.icon
                    className={`h-6 w-6 ${pillar.color === "primary" ? "text-primary" : "text-secondary"}`}
                  />
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <p
                    className={`mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] ${
                      pillar.color === "primary" ? "text-primary/70" : "text-secondary/70"
                    }`}
                  >
                    {pillar.number} · {pillar.subtitle}
                  </p>
                  <h3 className="mb-2 font-heading text-2xl font-bold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="max-w-xl leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
