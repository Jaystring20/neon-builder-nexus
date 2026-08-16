import ScrollReveal from "@/components/ScrollReveal";

const FrictionSection = () => {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-destructive/5 rounded-full blur-[100px]" />

      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Strategy is a Map.{" "}
              <span className="text-destructive">Most Brands are Just Lost.</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A beautiful website is a map to nowhere without an engine to drive it. 
              In the age of rapid obsolescence, 'pretty' is a commodity.
            </p>
          </ScrollReveal>
        </div>

        {/* Bold Statements */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          <ScrollReveal animation="slide-right" delay={300}>
            <div className="glass-card p-8 md:p-10 hover:border-primary/50 transition-all duration-500 glow-effect h-full">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">What others do</p>
              <p className="text-xl md:text-2xl font-heading text-muted-foreground/60 line-through mb-4">
                We don't just 'create.'
              </p>
              <p className="text-2xl md:text-3xl font-heading font-bold text-primary">
                We Architect.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="slide-left" delay={400}>
            <div className="glass-card p-8 md:p-10 hover:border-secondary/50 transition-all duration-500 glow-effect h-full">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">What others do</p>
              <p className="text-xl md:text-2xl font-heading text-muted-foreground/60 line-through mb-4">
                We don't just 'post.'
              </p>
              <p className="text-2xl md:text-3xl font-heading font-bold text-secondary">
                We Propel.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom statement */}
        <ScrollReveal animation="blur-in" delay={500}>
          <div className="glass-card p-8 md:p-12 text-center border-secondary/30">
            <p className="text-xl md:text-2xl font-heading text-foreground leading-relaxed">
              <span className="text-secondary font-semibold">Performance</span> is the prize.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FrictionSection;
