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
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              Why Us
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Why <span className="gradient-text">Digital Creatives Hub</span>
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {differentiators.map((item, index) => (
            <ScrollReveal key={item.title} animation="fade-up" delay={index * 150}>
              <div className="glass-card-elevated p-8 hover-lift hover-glass-shine h-full text-center group">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 ${
                  item.color === "primary" ? "bg-primary/10" : "bg-secondary/10"
                } group-hover:scale-110 transition-transform duration-500`}>
                  <item.icon className={`w-8 h-8 ${
                    item.color === "primary" ? "text-primary" : "text-secondary"
                  }`} />
                </div>
                <h3 className="text-lg font-heading font-semibold mb-3 text-foreground leading-snug">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {item.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
