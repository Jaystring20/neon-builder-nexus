import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Eye, ArrowRight, Quote, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";
import jerryImage from "@/assets/jerry-strategist.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero / Manifesto */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-breathe animation-delay-300" />
        <FloatingParticles count={12} />
        
        <div className="container-narrow relative z-10 text-center">
          <ScrollReveal animation="fade-up">
            <span className="inline-block px-4 py-2 rounded-full glass-card-subtle text-primary text-sm font-medium mb-6 border border-primary/20">
              Where Strategy Meets the Street
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              The World Doesn't Need More Consumers.{" "}
              <span className="gradient-text">It Needs Builders.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Most brands are renting space in a digital maze they don't own. They are trapped by 
              complexity, drowned by noise, and exhausted by fleeting trends. At Digital Creatives Hub, 
              we believe the 'Digital Tsunami' shouldn't drown brands — it should{" "}
              <span className="text-primary font-semibold">power them</span>.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Bridge Statement */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="blur-in">
            <div className="glass-card-elevated p-8 md:p-12 max-w-3xl mx-auto text-center hover-glow">
              <p className="text-xl md:text-2xl font-heading text-foreground leading-relaxed mb-4">
                We exist to bridge the gap between{" "}
                <span className="text-primary font-semibold">raw imagination</span> and{" "}
                <span className="text-secondary font-semibold">engineered execution</span>.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                <p className="text-muted-foreground">
                  We don't just 'strategize' —{" "}
                  <span className="text-primary font-semibold">we architect</span>.
                </p>
                <div className="hidden sm:block w-px h-6 bg-border/50" />
                <p className="text-muted-foreground">
                  We don't just 'create' —{" "}
                  <span className="text-secondary font-semibold">we build the infrastructure of authority</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">Our North Star</span>
            </ScrollReveal>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal animation="slide-right">
              <div className="glass-card-elevated p-8 md:p-10 border-primary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To equip builders with the{" "}
                  <span className="text-primary font-semibold">strategy and smart systems</span> needed 
                  to turn digital uncertainty into scalable growth.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" delay={100}>
              <div className="glass-card-elevated p-8 md:p-10 border-secondary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the{" "}
                  <span className="text-secondary font-semibold">global nexus</span> where technology 
                  and imagination converge to define the future of the digital landscape.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Innovation Lab */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="blur-in">
            <div className="glass-card-elevated p-8 md:p-12 max-w-4xl mx-auto hover-glow glass-border">
              <div className="text-center">
                <ScrollReveal animation="fade-up">
                  <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                    Business Development, Reimagined
                  </span>
                </ScrollReveal>
                <ScrollReveal animation="fade-up" delay={100}>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    The Innovation Lab for the{" "}
                    <span className="gradient-text">Agentic Era</span>
                  </h2>
                </ScrollReveal>
                <ScrollReveal animation="fade-up" delay={200}>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Digital Creatives Hub is a{" "}
                    <span className="text-primary font-semibold">Business Development Creative Agency</span>, 
                    designed to solve the crisis of digital obsolescence.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    We operate on a simple, functional truth:{" "}
                    <span className="text-foreground font-semibold">Strategy is a Map, but we build the Road.</span>{" "}
                    We are the execution powerhouse that ensures your brand doesn't just have a 'plan' — it has an{" "}
                    <span className="text-secondary font-semibold">Engine</span>.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Meet the Lead Architect */}
      <section id="founder" className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">The Lead Architect</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">
                Building Agency. Bridging Gaps.{" "}
                <span className="gradient-text">Empowering Growth.</span>
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="blur-in" delay={200}>
            <div className="glass-card-elevated p-8 md:p-12 hover-glow">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative flex flex-col items-center">
                  <ScrollReveal animation="blur-in" delay={300}>
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 glass-border max-w-sm mx-auto">
                      <img src={jerryImage} alt="Jeremiah Adeyemi - The Lead Architect" className="w-full h-full object-cover" />
                    </div>
                  </ScrollReveal>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-breathe" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-2xl animate-breathe animation-delay-300" />
                  
                  <ScrollReveal animation="fade-up" delay={400}>
                    <Button variant="hero" size="lg" asChild className="mt-8 relative z-10 hover-glow">
                      <a 
                        href="https://thedigitechstrategist.lovable.app" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group"
                      >
                        Connect with Jeremiah
                        <ExternalLink className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    </Button>
                  </ScrollReveal>
                </div>

                {/* Content */}
                <div>
                  <ScrollReveal animation="fade-up" delay={300}>
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-2">Jeremiah Adeyemi</h3>
                  </ScrollReveal>
                  <ScrollReveal animation="fade-up" delay={400}>
                    <p className="text-primary font-medium mb-6">The DigiTech Strategist · Founder & Lead Architect</p>
                  </ScrollReveal>
                  
                  <ScrollReveal animation="fade-up" delay={500}>
                    <div className="space-y-4 text-muted-foreground mb-8">
                      <p>
                        Known as <span className="text-secondary font-semibold">'The DigiTech Strategist,'</span>{" "}
                        Jeremiah founded DCH on a singular philosophy: that true growth requires both the 
                        vision of a creative and the precision of an engineer.
                      </p>
                      <p>
                        With a track record of navigating complex digital mazes for global brands, he leads 
                        the Hub in architecting the next generation of{" "}
                        <span className="text-primary font-semibold">growth engines</span>.
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Functional Pun */}
                  <ScrollReveal animation="slide-left" delay={600}>
                    <div className="glass-card-elevated p-6 border-l-4 border-l-secondary hover-glow">
                      <Quote className="w-8 h-8 text-secondary/50 mb-4" />
                      <p className="text-foreground italic font-medium leading-relaxed">
                        "Jeremiah doesn't just draw the map; he builds the road, the car, and the fuel."
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Expertise Tags */}
                  <ScrollReveal animation="fade-up" delay={700}>
                    <div className="flex flex-wrap gap-2 mt-6">
                      {["Growth Architecture", "Digital Strategy", "Agentic AI", "Business Development"].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 hover-glow transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Promise Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal animation="blur-in">
            <div className="glass-card-elevated p-8 md:p-12 text-center hover-glow glass-border max-w-3xl mx-auto">
              <ScrollReveal animation="fade-up">
                <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                  Our Promise
                </span>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={100}>
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Quiet Systems.{" "}
                  <span className="gradient-text">Loud Results.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We use smart technology and agentic AI behind the scenes so your brand can speak for itself. 
                  We aren't just another vendor; we are your{" "}
                  <span className="text-primary font-semibold">Growth Architects</span>. We navigate the maze 
                  of uncertainty to architect the engines of{" "}
                  <span className="text-secondary font-semibold">absolute clarity</span>.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={300}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="hero" size="lg" asChild className="hover-glow">
                    <Link to="/services" className="group">
                      Explore Our Services
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild className="hover-glass-shine">
                    <a href="mailto:hello@digitalcreativeshub.com">
                      Get in Touch
                    </a>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
