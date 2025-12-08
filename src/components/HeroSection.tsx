import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";
import heroVisual from "@/assets/hero-visual.jpg";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      
      {/* Floating Particles */}
      <FloatingParticles count={20} />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-breathe" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] animate-breathe animation-delay-300" />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      <div className="container-narrow relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-subtle mb-8 hover-glow">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Your Innovation Lab for Digital Agency
              </span>
            </div>
          </ScrollReveal>

          {/* Hero Visual */}
          <ScrollReveal animation="blur-in" delay={100}>
            <div className="flex justify-center mb-8">
              <div className="relative w-64 h-40 sm:w-80 sm:h-48 md:w-[480px] md:h-72 rounded-2xl overflow-hidden glass-border hover-lift hover-glass-shine">
                <img
                  src={heroVisual}
                  alt="Digital transformation and innovation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
              </div>
            </div>
          </ScrollReveal>

          {/* Headline */}
          <ScrollReveal animation="fade-up" delay={200}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-6">
              <span className="text-foreground">Feeling Left Behind by the</span>
              <br />
              <span className="gradient-text">Digital Tsunami?</span>
            </h1>
          </ScrollReveal>

          {/* Subheadline */}
          <ScrollReveal animation="fade-up" delay={300}>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              The digital world is evolving faster than ever. Don't just adapt — 
              <span className="text-primary font-medium"> build your future</span> with agency and confidence. 
              Digital Creatives Hub empowers professionals and organizations to transform uncertainty 
              into opportunity and become <span className="text-secondary font-medium">leaders in the AI-driven age</span>.
            </p>
          </ScrollReveal>

          {/* CTA Buttons */}
          <ScrollReveal animation="fade-up" delay={400}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="xl" className="group hover-glow">
                Discover Your Path
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="xl" className="group hover-glass-shine">
                <Download className="w-5 h-5" />
                Free Builder's Blueprint
              </Button>
            </div>
          </ScrollReveal>

          {/* Trust Indicators */}
          <ScrollReveal animation="fade-up" delay={500}>
            <div className="mt-12 pt-8 pb-20 border-t border-border/30">
              <p className="text-sm text-muted-foreground mb-6">
                Trusted by forward-thinking professionals worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8">
                <div className="flex items-center gap-2 glass-card-subtle px-4 py-2 hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center">
                    <span className="text-primary font-bold">500+</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Builders</span>
                </div>
                <div className="flex items-center gap-2 glass-card-subtle px-4 py-2 hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center">
                    <span className="text-secondary font-bold">50+</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Projects</span>
                </div>
                <div className="flex items-center gap-2 glass-card-subtle px-4 py-2 hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-card/50 flex items-center justify-center">
                    <span className="text-primary font-bold">15+</span>
                  </div>
                  <span className="text-sm text-muted-foreground">Countries</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 glass-card-subtle">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
