import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Target, Eye, Lightbulb, Users, Award, Heart, Zap, Shield, ArrowRight, Quote, ExternalLink } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import jerryImage from "@/assets/jerry-strategist.png";

const About = () => {
  const coreValues = [{
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing cutting-edge solutions to solve real-world problems",
    color: "primary"
  }, {
    icon: Users,
    title: "Community",
    description: "Building meaningful connections that foster growth and collaboration",
    color: "secondary"
  }, {
    icon: Award,
    title: "Excellence",
    description: "Striving for the highest standards in everything we create",
    color: "primary"
  }, {
    icon: Heart,
    title: "Empowerment",
    description: "Equipping individuals with tools and knowledge to succeed",
    color: "secondary"
  }, {
    icon: Shield,
    title: "Integrity",
    description: "Operating with transparency, honesty, and ethical practices",
    color: "primary"
  }, {
    icon: Zap,
    title: "Impact",
    description: "Creating lasting change through purposeful digital solutions",
    color: "secondary"
  }];

  const differentiators = [{
    stat: "1000+",
    label: "Digital Builders Empowered",
    description: "Professionals transformed from consumers to creators"
  }, {
    stat: "50+",
    label: "Projects Launched",
    description: "Real solutions built by our community members"
  }, {
    stat: "24/7",
    label: "Community Support",
    description: "Round-the-clock access to resources and mentorship"
  }];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-breathe" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-breathe animation-delay-300" />
        
        <div className="container-narrow relative z-10 text-center">
          <ScrollReveal animation="fade-up">
            <span className="inline-block px-4 py-2 rounded-full glass-card-subtle text-primary text-sm font-medium mb-6 border border-primary/20">
              About Us
            </span>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Empowering <span className="gradient-text">Digital Builders</span> Worldwide
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're on a mission to transform professionals from passive digital consumers 
              into active creators who build meaningful solutions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section id="mission" className="section-padding">
        <div className="container-narrow">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <ScrollReveal animation="slide-right">
              <div className="glass-card-elevated p-8 md:p-10 border-primary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To <span className="text-primary font-semibold">democratize professional growth</span> by 
                  shifting mindsets from passive consumerism to active digital creation. We equip individuals 
                  with the tools, skills, and community they need to build solutions that matter.
                </p>
              </div>
            </ScrollReveal>

            {/* Vision Card */}
            <ScrollReveal animation="slide-left" delay={100}>
              <div className="glass-card-elevated p-8 md:p-10 border-secondary/20 hover-lift hover-glass-shine h-full">
                <div className="w-14 h-14 rounded-2xl bg-secondary/10 border border-secondary/30 flex items-center justify-center mb-6">
                  <Eye className="w-7 h-7 text-secondary" />
                </div>
                <h2 className="text-2xl font-heading font-bold mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  A world where <span className="text-secondary font-semibold">every professional</span> has 
                  the power to create digital solutions that solve real problems. We envision a global community 
                  of builders who transform industries and uplift communities.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">Our Journey</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">The Story Behind DCH</h2>
            </ScrollReveal>
          </div>
          
          <ScrollReveal animation="blur-in" delay={200}>
            <div className="glass-card-elevated p-8 md:p-12 max-w-3xl mx-auto hover-glow">
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  Digital Creatives Hub was born from a simple yet powerful observation: too many talented professionals were stuck in the cycle of consuming digital content rather than creating it.
                </p>
                <p>
                  Our founder, <span className="text-primary font-semibold">Jeremiah Adeyemi</span>, 
                  recognized that the gap between consuming and creating wasn't about talent or intelligence—it 
                  was about <span className="text-secondary font-semibold">mindset and access</span>.
                </p>
                <p>
                  What started as mentorship sessions and small workshops has grown into a comprehensive 
                  ecosystem designed to transform how professionals approach the digital landscape. Today, 
                  DCH stands as a beacon for those ready to make the shift from consumer to creator.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Values Section */}
      <section id="values" className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">What Drives Us</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-4">Our Core Values</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These principles guide every decision we make and every solution we build.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <ScrollReveal 
                key={value.title} 
                animation="scale-in" 
                delay={index * 100}
              >
                <div className="glass-card-subtle p-6 hover-lift hover-glass-shine transition-all duration-300 h-full">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 border ${value.color === "primary" ? "bg-primary/10 border-primary/30" : "bg-secondary/10 border-secondary/30"}`}>
                    <value.icon className={`w-6 h-6 ${value.color === "primary" ? "text-primary" : "text-secondary"}`} />
                  </div>
                  <h3 className="text-xl font-heading font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Founder Section */}
      <section id="founder" className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="text-center mb-12">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">Leadership</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4">Meet The Founder</h2>
            </ScrollReveal>
          </div>

          <ScrollReveal animation="blur-in" delay={200}>
            <div className="glass-card-elevated p-8 md:p-12 hover-glow">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Image */}
                <div className="relative flex flex-col items-center">
                  <ScrollReveal animation="blur-in" delay={300}>
                    <div className="aspect-square rounded-2xl overflow-hidden border-2 border-primary/20 glass-border">
                      <img src={jerryImage} alt="Jeremiah Adeyemi - Founder of Digital Civics Hub" className="w-full h-full object-cover" />
                    </div>
                  </ScrollReveal>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl animate-breathe" />
                  <div className="absolute -top-4 -left-4 w-20 h-20 bg-secondary/20 rounded-full blur-2xl animate-breathe animation-delay-300" />
                  
                  {/* Connect Button - Under Picture */}
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
                    <p className="text-primary font-medium mb-6">Founder & Chief Strategist</p>
                  </ScrollReveal>
                  
                  <ScrollReveal animation="fade-up" delay={500}>
                    <div className="space-y-4 text-muted-foreground mb-8">
                      <p>
                        Known as <span className="text-secondary font-semibold">"The DigiTech Strategist"</span>, 
                        Jeremiah has dedicated his career to bridging the gap between traditional 
                        professionalism and digital innovation.
                      </p>
                      <p>
                        With over a decade of experience in digital transformation, he has guided 
                        countless professionals through their journey from digital consumers to 
                        confident creators and builders.
                      </p>
                      <p>
                        His unique approach combines strategic thinking with practical implementation, 
                        ensuring that every individual he mentors gains not just knowledge, but the 
                        ability to apply it effectively.
                      </p>
                    </div>
                  </ScrollReveal>

                  {/* Expertise Tags */}
                  <ScrollReveal animation="fade-up" delay={600}>
                    <div className="flex flex-wrap gap-2 mb-8">
                      {["Digital Strategy", "Leadership", "Community Building", "Tech Innovation"].map(tag => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20 hover-glow transition-all duration-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </ScrollReveal>

                  {/* Quote */}
                  <ScrollReveal animation="slide-left" delay={700}>
                    <div className="relative p-6 glass-card-subtle hover-glow">
                      <Quote className="absolute top-4 left-4 w-8 h-8 text-primary/20" />
                      <p className="italic text-foreground pl-8">
                        "In the digital age, the greatest competitive advantage isn't just knowing—it's 
                        <span className="text-primary font-semibold"> building</span>."
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Choose DCH Section */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <ScrollReveal animation="fade-up">
              <span className="text-primary font-medium uppercase tracking-wider text-sm">Our Impact</span>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mt-4 mb-4">Why Choose DCH</h2>
            </ScrollReveal>
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We measure our success by the success of our community members.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {differentiators.map((item, index) => (
              <ScrollReveal 
                key={item.label} 
                animation="scale-in" 
                delay={index * 100}
              >
                <div className="text-center glass-card-subtle p-8 hover-lift h-full">
                  <div className="text-4xl md:text-5xl font-heading font-bold gradient-text mb-2">
                    {item.stat}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <ScrollReveal animation="blur-in">
            <div className="glass-card-elevated p-12 md:p-16 text-center relative overflow-hidden hover-glow glass-border">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Ready to Start Your <span className="gradient-text">Journey</span>?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Join thousands of professionals who are transforming from digital consumers 
                  to confident creators and builders.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="hero" size="lg" asChild className="hover-glow">
                    <Link to="/services" className="group">
                      Explore Services
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild className="hover-glass-shine">
                    <a href="mailto:hello@digitalcivicshub.com">
                      Get in Touch
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
