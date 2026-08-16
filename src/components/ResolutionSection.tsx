import { Rocket } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const ResolutionSection = () => {
  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[70px] md:blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container-narrow relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal animation="fade-up">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              We Build the Systems That{" "}
              <span className="text-primary">Grow the Brand.</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-12">
              At Digital Creatives Hub, we are an execution powerhouse. We architect the 
              high-performance systems and smart frameworks that ensure measurable growth. 
              We take you from uncertainty to{" "}
              <span className="text-primary font-semibold">absolute clarity</span> by building the 
              infrastructure your brand needs to{" "}
              <span className="text-secondary font-semibold">lead the market</span>.
            </p>
          </ScrollReveal>

          <ScrollReveal animation="blur-in" delay={200}>
            <div className="glass-card-elevated p-8 md:p-12 border-primary/20 hover-glow">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
              <p className="text-xl md:text-2xl font-heading font-semibold text-foreground leading-relaxed">
                We don't just strategize.{" "}
                <span className="text-secondary">We build the infrastructure of authority.</span>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ResolutionSection;
