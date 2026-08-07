import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";

const AboutSnippetSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] md:blur-[150px] animate-breathe" />

      <FloatingParticles count={8} />

      <div className="container-narrow relative z-10">
        <div className="glass-card-elevated p-8 md:p-16 text-center relative overflow-hidden hover-glow glass-border">
          <div className="relative z-10">
            <ScrollReveal animation="fade-up">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                The Innovation Lab
              </span>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                Where Strategy Meets{" "}
                <span className="gradient-text">the Street.</span>
              </h2>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
                Digital Creatives Hub is an Innovation Lab for the Agentic Era. Founded by The DigiTech 
                Strategist, we exist at the intersection of human imagination and engineered execution.
              </p>
              <p className="text-base text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                We don't believe in 'digital marketing.' We believe in{" "}
                <span className="text-primary font-semibold">Business Development</span>. 
                We don't believe in 'content.' We believe in{" "}
                <span className="text-secondary font-semibold">Momentum</span>.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <Button variant="hero" size="xl" asChild className="group hover-glow">
                <Link to="/about">
                  Learn More
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSnippetSection;
