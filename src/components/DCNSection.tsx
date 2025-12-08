import { Heart, Globe, BookOpen, Wrench, Users, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";

const DCNSection = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Personalized Learning Paths",
      description: "Tailored guidance and training for every stage, from newbies to advanced creatives"
    },
    {
      icon: Wrench,
      title: "Real-World Projects",
      description: "Hands-on opportunities to build portfolios and gain practical experience"
    },
    {
      icon: Users,
      title: "Community & Mentorship",
      description: "A supportive network with forums, mentorship, and peer-to-peer learning"
    },
    {
      icon: Globe,
      title: "Tools & Resources",
      description: "Access to essential digital tools, AI libraries, and training resources"
    }
  ];

  return (
    <section id="dcn" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-primary/10 rounded-full blur-[150px] animate-breathe" />

      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-subtle border border-primary/20 mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Social Impact Initiative
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              Digital Creatives{" "}
              <span className="gradient-text">Network</span>
            </h2>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-lg text-muted-foreground leading-relaxed">
              The heart of our community and social impact initiatives. Born from the recognition 
              that creativity thrives in collaboration and that talent is universal.
            </p>
          </ScrollReveal>
        </div>

        {/* Mission Statement */}
        <ScrollReveal animation="blur-in" delay={100}>
          <div className="glass-card-elevated p-8 md:p-12 mb-16 text-center border-primary/30 hover-glow">
            <p className="text-sm uppercase tracking-wider text-primary mb-4">Our Mission</p>
            <p className="text-xl md:text-2xl font-heading text-foreground leading-relaxed max-w-3xl mx-auto">
              To <span className="text-primary font-semibold">democratize professional growth</span>, 
              empower underrepresented groups, and bridge the education-employment gap by providing 
              accessible tools, resources, and a supportive community.
            </p>
          </div>
        </ScrollReveal>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <ScrollReveal 
              key={feature.title} 
              animation="fade-up" 
              delay={index * 100}
            >
              <div className="group glass-card-subtle p-8 hover:border-primary/50 transition-all duration-500 hover-lift hover-glass-shine h-full">
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Impact Areas */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { 
              title: "Empower Underrepresented", 
              desc: "Prioritizing opportunities for those who face barriers in digital creative fields" 
            },
            { 
              title: "Foster Collaboration", 
              desc: "Creating spaces where diverse talents connect and co-create" 
            },
            { 
              title: "Cultivate Builders", 
              desc: "Shifting mindsets from passive consumption to active creation" 
            },
          ].map((item, index) => (
            <ScrollReveal key={index} animation="scale-in" delay={index * 100}>
              <div className="glass-card-subtle p-6 text-center group hover:border-secondary/50 transition-colors hover-lift h-full">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-secondary font-bold">{index + 1}</span>
                </div>
                <h4 className="font-heading font-semibold mb-2 text-foreground">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal animation="fade-up" delay={200}>
          <div className="mt-16 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="group hover-glow">
                Explore DCN Initiatives
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="lg" className="hover-glass-shine">
                Partner With Us
              </Button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default DCNSection;
