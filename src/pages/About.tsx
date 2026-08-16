import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Eye, ArrowRight, Quote, ExternalLink, Search, Cpu, Rocket, Sparkles, Layers, Globe2, HandshakeIcon } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import FloatingParticles from "@/components/FloatingParticles";
import jerryImage from "@/assets/jerry-strategist.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="About Us"
        description="Meet the team behind Digital Creatives Hub. We help professionals and organizations build agency, strategy, and digital presence in the AI-driven age."
        path="/about"
      />
      <Navbar />
      
      {/* Hero / Manifesto */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-breathe animation-delay-300" />
        <FloatingParticles count={12} />
        
        <div className="container-narrow relative z-10 text-center">
          <ScrollReveal animation="fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              The World Doesn't Need More Consumers.{" "}
              <span className="text-primary">It Needs Builders.</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
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
                <span className="text-foreground font-semibold">engineered execution</span>.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
                <p className="text-muted-foreground">
                  We don't just 'strategize' —{" "}
                  <span className="text-primary font-semibold">we architect</span>.
                </p>
                <div className="hidden sm:block w-px h-6 bg-border/50" />
                <p className="text-muted-foreground">
                  We don't just 'create' —{" "}
                  <span className="text-foreground font-semibold">we build the infrastructure of authority</span>.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-8">
            <ScrollReveal animation="slide-right">
              <div className="glass-card-elevated p-8 md:p-10 border-primary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To equip ambitious builders with the{" "}
                  <span className="text-primary font-semibold">strategy, AI-native systems, and execution</span>{" "}
                  needed to turn digital uncertainty into compounding, scalable growth.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="slide-left" delay={100}>
              <div className="glass-card-elevated p-8 md:p-10 border-primary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To be the{" "}
                  <span className="text-foreground font-semibold">global nexus</span> where strategy,
                  creativity, and intelligent systems converge — defining how the next generation of
                  brands gets built.
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
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                    The Innovation Lab for the{" "}
                    <span className="text-primary">Agentic Era</span>
                  </h2>
                </ScrollReveal>
                <ScrollReveal animation="fade-up" delay={100}>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Most agencies deliver projects. We deliver{" "}
                    <span className="text-primary font-semibold">systems</span> — growth operating
                    systems that run inside your business long after we've handed over the keys.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    Strategy is a map. We build the road, the vehicle, and the fuel — then we train
                    your team to drive it. You're not hiring consultants who leave you with a deck.
                    You're getting a <span className="text-foreground font-semibold">growth engine you own</span>.
                  </p>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How We Work — Diagnose / Build / Execute */}
      <section className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">
                Diagnose. Build. <span className="text-primary">Execute.</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Search,
                title: "We Diagnose",
                copy: "We pinpoint your growth opportunity — where momentum is blocked, where leverage exists, and where markets are ready but execution is absent.",
                iconWrap: "bg-primary/10 border-primary/30",
                iconColor: "text-primary",
                cardBorder: "border-primary/20",
              },
              {
                icon: Cpu,
                title: "We Build",
                copy: "We architect the intelligence layer — AI-powered workflows that turn rough ideas into production-ready briefs and strategy into operational rhythm.",
                iconWrap: "bg-primary/10 border-primary/30",
                iconColor: "text-primary",
                cardBorder: "border-primary/20",
              },
              {
                icon: Rocket,
                title: "We Execute",
                copy: "Creative, campaigns, partnerships — all of it. We run the engine while training your team, then hand it over so you own it long-term.",
                iconWrap: "bg-primary/10 border-primary/30",
                iconColor: "text-primary",
                cardBorder: "border-primary/20",
              },
            ].map((step, i) => (
              <ScrollReveal key={step.title} animation="fade-up" delay={i * 100}>
                <div className={`glass-card-elevated p-8 hover-lift hover-glass-shine h-full ${step.cardBorder}`}>
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-5 ${step.iconWrap}`}>
                    <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-heading font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">
                Diagnostic. Deliberate. <span className="text-primary">Outcome-focused.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
                The approach is never one-size-fits-all. We build for the brands ready to move.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                tag: "Startups",
                title: "Finding their footing",
                copy: "You know your product works — you just haven't cracked go-to-market. We architect the engine that gets you there.",
              },
              {
                tag: "Established Brands",
                title: "Ready to evolve",
                copy: "Scaling into new regions, launching new products, or modernizing operations that still run on spreadsheets and email threads.",
              },
              {
                tag: "Global Players",
                title: "Entering Africa",
                copy: "Enterprises that need local intelligence, strategic execution, and speed — without the cost of building full teams on the ground.",
              },
            ].map((seg, i) => (
              <ScrollReveal key={seg.tag} animation="fade-up" delay={i * 100}>
                <div className="glass-card-elevated p-8 hover-lift h-full">
                  <span className="inline-block text-xs font-semibold uppercase tracking-[0.16em] text-primary mb-3">
                    {seg.tag}
                  </span>
                  <h3 className="text-xl font-heading font-bold mb-3">{seg.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{seg.copy}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">
                Not another agency. <span className="text-primary">A growth operating partner.</span>
              </h2>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Layers,
                title: "We don't separate strategy from execution.",
                copy: "Most agencies do one or the other. We do both — connected by AI-native systems that make execution faster and strategy more durable.",
              },
              {
                icon: Sparkles,
                title: "We build capacity, not dependency.",
                copy: "We construct your growth engine, run it on your behalf while training your team, then hand over the keys. You keep the system.",
              },
              {
                icon: Globe2,
                title: "Global-standard, locally grounded.",
                copy: "Headquartered in Lagos, operating globally. We understand African market nuances and deliver with the rigor of world-class agencies.",
              },
              {
                icon: HandshakeIcon,
                title: "We align incentives with outcomes.",
                copy: "We don't just charge for time. We earn performance bonuses when we exceed your growth targets — structurally, not rhetorically.",
              },
            ].map((diff, i) => (
              <ScrollReveal key={diff.title} animation="fade-up" delay={i * 80}>
                <div className="glass-card-elevated p-7 hover-lift hover-glass-shine h-full flex gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <diff.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-bold mb-2 leading-snug">{diff.title}</h3>
                    <p className="text-muted-foreground leading-relaxed text-sm">{diff.copy}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Lead Architect */}
      <section id="founder" className="section-padding bg-muted/20">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">
                Building Agency. Bridging Gaps.{" "}
                <span className="text-primary">Empowering Growth.</span>
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="blur-in" delay={100}>
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
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-breathe animation-delay-300" />
                  
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
                        Known as <span className="text-foreground font-semibold">'The DigiTech Strategist,'</span>{" "}
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
                    <div className="glass-card-elevated p-6 hover-glow">
                      <Quote className="w-8 h-8 text-primary/50 mb-4" />
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
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Quiet Systems.{" "}
                  <span className="text-primary">Loud Results.</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={100}>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  We use smart technology and agentic AI behind the scenes so your brand can speak for itself. 
                  We aren't just another vendor; we are your{" "}
                  <span className="text-primary font-semibold">Growth Architects</span>. We navigate the maze 
                  of uncertainty to architect the engines of{" "}
                  <span className="text-foreground font-semibold">absolute clarity</span>.
                </p>
              </ScrollReveal>
              <ScrollReveal animation="fade-up" delay={200}>
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
