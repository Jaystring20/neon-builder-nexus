import { Link, useParams } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { serviceCategories } from "@/data/services";

const ServiceCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = serviceCategories.find((c) => c.slug === slug);

  if (!category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold mb-4">Service Not Found</h1>
          <Link to="/services">
            <Button variant="hero">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const colorClass = category.color === "primary" ? "text-primary" : "text-secondary";
  const borderColor = category.color === "primary" ? "border-primary/30" : "border-secondary/30";
  const bgColor = category.color === "primary" ? "bg-primary/10" : "bg-secondary/10";
  const bgAccent = category.color === "primary" ? "bg-primary/5" : "bg-secondary/5";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="section-padding pt-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-1/4 left-1/4 w-96 h-96 ${category.color === "primary" ? "bg-primary/10" : "bg-secondary/10"} rounded-full blur-3xl animate-pulse-slow`} />
        </div>

        <div className="container-narrow relative z-10">
          <ScrollReveal>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              All Services
            </Link>

            <div className="max-w-4xl">
              <span className={`inline-block px-4 py-2 rounded-full border ${borderColor} ${bgAccent} ${colorClass} text-sm font-medium mb-6`}>
                {category.tagline}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                <span className={colorClass}>{category.title}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                {category.description}
              </p>
              <Button variant="hero" size="lg">
                Start the Build
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Sub-services */}
      <section className="section-padding">
        <div className="container-narrow">
          <div className="space-y-20">
            {category.subServices.map((sub, index) => (
              <ScrollReveal key={sub.title}>
                <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                  <div className={index % 2 === 1 ? "md:order-2" : ""}>
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border ${borderColor} ${bgColor}`}>
                      <sub.icon className={`w-8 h-8 ${colorClass}`} />
                    </div>
                    <h2 className="text-3xl font-heading font-bold mb-4 text-foreground">
                      {sub.title}
                    </h2>
                    <p className={`text-lg ${colorClass} font-medium mb-4`}>
                      {sub.description}
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {sub.detail}
                    </p>
                  </div>

                  <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className={`glass-card p-12 flex items-center justify-center aspect-square max-w-sm mx-auto`}>
                      <sub.icon className={`w-24 h-24 ${colorClass} opacity-20`} />
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ${category.color === "primary" ? "bg-primary/10" : "bg-secondary/10"} rounded-full blur-3xl`} />
              </div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                  Ready to Build Your{" "}
                  <span className={colorClass}>{category.title}</span>?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                  Let's architect the systems that will drive your next phase of growth.
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

export default ServiceCategoryPage;
