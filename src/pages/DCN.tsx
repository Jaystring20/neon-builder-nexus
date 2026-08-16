import SEO from "@/components/SEO";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DCNSection from "@/components/DCNSection";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Target, Rocket } from "lucide-react";
import { Link } from "react-router-dom";

const DCN = () => {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Digital Creatives Network"
        description="Join the Digital Creatives Network — a community for digital creators, strategists, and builders shaping the future of work."
        path="/dcn"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] md:blur-[150px]" />
        
        <div className="container-narrow relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
              Digital Creatives{" "}
              <span className="text-primary">Network</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
              A thriving community dedicated to empowering digital creators, fostering collaboration, 
              and bridging the gap between learning and professional success.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="group">
                Join the Network
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Button variant="heroOutline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main DCN Content */}
      <DCNSection />

      {/* Additional Section: How It Works */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
        
        <div className="container-narrow relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How DCN <span className="text-primary">Works</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple pathway to growth and opportunity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Lightbulb,
                title: "Join & Learn",
                description: "Access personalized learning paths, resources, and training materials tailored to your skill level and goals."
              },
              {
                step: "02",
                icon: Target,
                title: "Build & Create",
                description: "Work on real-world projects, build your portfolio, and gain hands-on experience with guidance from mentors."
              },
              {
                step: "03",
                icon: Rocket,
                title: "Connect & Grow",
                description: "Network with fellow creatives, find collaboration opportunities, and advance your professional career."
              }
            ].map((item, index) => (
              <div key={index} className="glass-card p-8 text-center group hover:border-primary/50 transition-all duration-300">
                <div className="text-5xl font-heading font-bold text-primary/20 mb-4">
                  {item.step}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                  <item.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3 text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
        
        <div className="container-narrow relative z-10">
          <div className="glass-card p-12 md:p-16 text-center border-primary/30">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Join the <span className="text-primary">Movement</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Whether you're a beginner looking to learn or an experienced creative wanting to give back, 
              there's a place for you in the Digital Creatives Network.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="hero" size="lg" className="group">
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg" className="border-primary/50 hover:bg-primary/10">
                  Learn About DCH
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default DCN;
