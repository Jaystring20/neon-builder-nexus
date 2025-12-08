import { ArrowRight, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";

const CTASection = () => {
  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-full blur-[120px] animate-breathe" />
      </div>

      {/* Floating Particles */}
      <FloatingParticles count={8} />

      <div className="container-narrow relative z-10">
        <ScrollReveal animation="blur-in">
          <div className="glass-card-elevated p-8 md:p-16 text-center overflow-hidden relative hover-glow glass-border">
            <div className="relative z-10">
              <ScrollReveal animation="fade-up">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
                  Ready to <span className="gradient-text">Build Your Future?</span>
                </h2>
              </ScrollReveal>
              
              <ScrollReveal animation="fade-up" delay={100}>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                  Whether you're a professional, entrepreneur, or organization, Digital Creatives Hub 
                  is your essential partner in building agency, bridging gaps, and empowering growth 
                  in the digital age.
                </p>
              </ScrollReveal>

              <ScrollReveal animation="fade-up" delay={200}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                  <Button variant="hero" size="xl" className="group hover-glow">
                    Join Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button variant="heroOutline" size="xl" className="hover-glass-shine">
                    Contact Us
                  </Button>
                </div>
              </ScrollReveal>

              {/* Contact Info */}
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-muted-foreground">
                  <a href="mailto:hello@digitalcreativeshub.com" className="flex items-center gap-2 hover:text-primary transition-all duration-300 glass-card-subtle px-4 py-2 hover-lift">
                    <Mail className="w-5 h-5" />
                    <span>hello@digitalcreativeshub.com</span>
                  </a>
                  <a href="tel:+44123456789" className="flex items-center gap-2 hover:text-secondary transition-all duration-300 glass-card-subtle px-4 py-2 hover-lift">
                    <Phone className="w-5 h-5" />
                    <span>+44 123 456 789</span>
                  </a>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CTASection;
