import { Map, Volume2, TrendingUp } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const WhyUsSection = () => {
  const differentiators = [
    {
      icon: Map,
      title: "Strategy is a Map. We Build the Road.",
      description: "Plans are useless without the infrastructure to drive them.",
      color: "primary" as const,
    },
    {
      icon: Volume2,
      title: "Quiet Systems. Loud Results.",
      description: "We use smart technology (AI) behind the scenes so your brand speaks for itself.",
      color: "secondary" as const,
    },
    {
      icon: TrendingUp,
      title: "Business Development, Reimagined.",
      description: "We aren't a vendor. We are your Growth Architects.",
      color: "primary" as const,
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/20 to-transparent" />

      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Why <span className="text-secondary">Digital Creatives Hub</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="mx-auto max-w-3xl divide-y divide-border/40">
          {differentiators.map((item, index) => (
            <ScrollReveal key={item.title} animation="fade-up" delay={index * 100}>
              <div
                className={`group flex flex-col gap-5 py-8 first:pt-0 last:pb-0 sm:flex-row sm:items-center ${
                  index % 2 === 1 ? "sm:flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-105 ${
                    item.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                  }`}
                >
                  <item.icon
                    className={`h-8 w-8 ${item.color === "primary" ? "text-primary" : "text-secondary"}`}
                  />
                </div>
                <div>
                  <h3 className="mb-2 font-heading text-xl font-bold text-foreground sm:text-2xl">
                    {item.title}
                  </h3>
                  <p className="max-w-md leading-relaxed text-muted-foreground">
                    {item.description}
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

export default WhyUsSection;
