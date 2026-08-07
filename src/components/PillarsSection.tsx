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
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              The Method
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              The 4 Pillars of{" "}
              <span className="gradient-text">Momentum</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} animation="scale-in" delay={index * 100}>
              <div className="group glass-card p-8 hover:border-primary/40 transition-all duration-500 glow-effect h-full relative overflow-hidden">
                {/* Large number watermark */}
                <span className="absolute top-4 right-6 text-7xl font-heading font-bold text-foreground/[0.03] select-none">
                  {pillar.number}
                </span>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 ${
                    pillar.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                  } group-hover:scale-110 transition-transform duration-500`}>
                    <pillar.icon className={`w-7 h-7 ${
                      pillar.color === "primary" ? "text-primary" : "text-secondary"
                    }`} />
                  </div>
                  
                  <p className={`text-xs uppercase tracking-widest mb-2 ${
                    pillar.color === "primary" ? "text-primary/70" : "text-secondary/70"
                  }`}>
                    {pillar.subtitle}
                  </p>
                  <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
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
