import { 
  Lightbulb, 
  GraduationCap, 
  FlaskConical, 
  Rocket, 
  Users, 
  Target, 
  Zap, 
  Clock,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Services = () => {
  const services = [
    {
      icon: Lightbulb,
      title: "Strategic Consulting",
      description: "Navigate digital transformation with expert guidance tailored to your organization's unique challenges and opportunities.",
      features: [
        "Digital transformation roadmaps",
        "AI integration strategies",
        "Organizational change management",
        "Technology stack assessment"
      ],
      color: "primary"
    },
    {
      icon: GraduationCap,
      title: "Professional Training",
      description: "Future-ready skills development programs designed to transform passive consumers into active digital creators.",
      features: [
        "AI-powered productivity tools",
        "No-code/low-code platforms",
        "Digital content creation",
        "Personal branding & positioning"
      ],
      color: "secondary"
    },
    {
      icon: FlaskConical,
      title: "Innovation Lab",
      description: "Hands-on experimental learning environment where ideas are tested, refined, and launched into the world.",
      features: [
        "Sprint-based workshops",
        "Mentorship programs",
        "Prototype development",
        "Go-to-market guidance"
      ],
      color: "primary"
    },
    {
      icon: Rocket,
      title: "Digital Solutions",
      description: "Transform your ideas into impactful digital products with our end-to-end development and deployment services.",
      features: [
        "Web & mobile applications",
        "AI-powered automation",
        "Brand identity & design",
        "Growth strategy execution"
      ],
      color: "secondary"
    }
  ];

  const labApproach = [
    { icon: Target, title: "Discovery Sprint", description: "Define your vision, validate ideas, and map your digital journey" },
    { icon: Users, title: "Expert Mentorship", description: "1-on-1 guidance from industry professionals who've walked the path" },
    { icon: Zap, title: "Rapid Prototyping", description: "Build, test, and iterate quickly using modern no-code tools" },
    { icon: Clock, title: "Launch Ready", description: "Go from concept to market-ready product in weeks, not months" }
  ];

  const tiers = [
    {
      name: "Individual",
      tagline: "For professionals & creators",
      description: "Build your digital agency and create your first projects",
      features: ["Builder's Blueprint access", "Community membership", "Self-paced courses", "Monthly office hours"]
    },
    {
      name: "Team",
      tagline: "For organizations & startups",
      description: "Transform your team with structured training and consulting",
      features: ["Custom training programs", "Strategy workshops", "Dedicated account manager", "Priority support"]
    },
    {
      name: "Enterprise",
      tagline: "For large organizations",
      description: "Full-scale digital transformation partnerships",
      features: ["Executive consulting", "Change management", "Custom solution development", "On-site training"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="section-padding pt-32 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500" />
        </div>

        <div className="container-narrow relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6 animate-fade-in">
              Our Services
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
              <span className="gradient-text">Build</span> With{" "}
              <span className="text-secondary font-semibold">Purpose</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
              Empowering professionals and organizations to thrive in the digital age through strategic guidance, hands-on training, and innovative solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="lg">
                Explore Programs
              </Button>
              <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Services Grid */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Core <span className="text-primary font-semibold">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive offerings designed to transform how you create, build, and grow in the digital economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="glass-card p-8 group hover:border-primary/30 transition-all duration-500 glow-effect"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${
                  service.color === "primary" 
                    ? "bg-primary/10 border-primary/30" 
                    : "bg-secondary/10 border-secondary/30"
                }`}>
                  <service.icon className={`w-8 h-8 ${
                    service.color === "primary" ? "text-primary" : "text-secondary"
                  }`} />
                </div>

                <h3 className="text-2xl font-heading font-bold mb-3 text-foreground">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {service.description}
                </p>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${
                        service.color === "primary" ? "text-primary" : "text-secondary"
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button variant="ghost" className="group/btn">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab Approach Section */}
      <section className="section-padding bg-card/30">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 text-secondary text-sm font-medium mb-6">
              Our Methodology
            </span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              The <span className="text-secondary font-semibold">Lab</span> Approach
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A proven framework that takes you from idea to launch, with hands-on guidance at every step.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {labApproach.map((step, index) => (
              <div
                key={step.title}
                className="relative group"
              >
                {/* Connector Line */}
                {index < labApproach.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-secondary/50 to-transparent z-0" />
                )}

                <div className="glass-card p-6 text-center relative z-10 h-full hover:border-secondary/30 transition-colors">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 border-2 border-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <step.icon className="w-7 h-7 text-secondary" />
                  </div>
                  <span className="text-xs text-secondary font-medium uppercase tracking-wider">Step {index + 1}</span>
                  <h3 className="text-lg font-heading font-bold mt-2 mb-2 text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Tiers */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Choose Your <span className="text-primary font-semibold">Path</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tailored programs designed to meet you where you are and take you where you want to go.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <div
                key={tier.name}
                className={`glass-card p-8 relative ${
                  index === 1 ? "border-primary/50 md:-mt-4 md:mb-4" : ""
                }`}
              >
                {index === 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-primary">{tier.tagline}</p>
                </div>

                <p className="text-muted-foreground mb-6">
                  {tier.description}
                </p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={index === 1 ? "hero" : "outline"} 
                  className={`w-full ${index !== 1 ? "border-primary/50 hover:bg-primary/10" : ""}`}
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-card/30">
        <div className="container-narrow">
          <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to <span className="text-secondary font-semibold">Build</span>?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Let's discuss how we can help you or your organization thrive in the digital age. Schedule a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Schedule Consultation
                </Button>
                <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                  Join the Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
