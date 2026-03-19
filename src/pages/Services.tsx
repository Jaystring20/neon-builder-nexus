import { ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { serviceCategories } from "@/data/services";

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Our Services"
        description="Brand strategy, digital products, and growth systems — explore the full range of services Digital Creatives Hub offers to help you build and scale."
        path="/services"
      />
      <Navbar />

      {/* Hero */}
      <section className="section-padding pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow animation-delay-500" />
        </div>

        <div className="container-narrow relative z-10">
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block px-4 py-2 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-medium mb-6">
                The Growth Architect's Toolkit
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                We Build the <span className="gradient-text">Systems</span> That{" "}
                <span className="text-secondary font-semibold">Grow</span> the Brand
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Four pillars of execution. One unified engine. From brand architecture to AI-powered automation — we engineer the infrastructure that turns vision into velocity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg">
                  Start the Build
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                  Book a Strategy Call
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Service Categories */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-16">
            {serviceCategories.map((category, index) => {
              const colorClass = category.color === "primary" ? "text-primary" : "text-secondary";
              const borderColor = category.color === "primary" ? "border-primary/30" : "border-secondary/30";
              const bgColor = category.color === "primary" ? "bg-primary/10" : "bg-secondary/10";

              return (
                <ScrollReveal key={category.slug}>
                  <div className="glass-card p-8 md:p-12 hover:border-primary/20 transition-all duration-500">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                      {/* Left: Info */}
                      <div>
                        <span className={`inline-block px-3 py-1 rounded-full border ${borderColor} ${bgColor} ${colorClass} text-xs font-medium mb-4 uppercase tracking-wider`}>
                          {category.tagline}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-foreground">
                          {category.title}
                        </h2>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {category.description}
                        </p>
                        <Link to={`/services/${category.slug}`}>
                          <Button variant="ghost" className="group/btn p-0 h-auto hover:bg-transparent">
                            <span className={colorClass}>Explore {category.title}</span>
                            <ArrowRight className={`w-4 h-4 ml-2 ${colorClass} group-hover/btn:translate-x-1 transition-transform`} />
                          </Button>
                        </Link>
                      </div>

                      {/* Right: Sub-services */}
                      <div className="space-y-4">
                        {category.subServices.map((sub) => (
                          <div key={sub.title} className="flex items-start gap-3">
                            <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colorClass}`} />
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">{sub.title}</h3>
                              <p className="text-xs text-muted-foreground">{sub.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Ready to <span className="text-secondary font-semibold">Architect</span> Your Growth?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Every empire starts with a blueprint. Let's build yours.
                </p>
                <Button variant="hero" size="lg">
                  Book a Strategy Call
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
