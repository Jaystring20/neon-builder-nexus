import { Quote } from "lucide-react";
import jerryStrategist from "@/assets/jerry-strategist.png";

const StrategistSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px]" />

      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image/Avatar Section */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto w-72 h-72 md:w-96 md:h-96">
              {/* Decorative Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-pulse-slow" />
              <div className="absolute inset-4 rounded-full border border-secondary/20" />
              
              {/* Avatar Container with Photo */}
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-1 overflow-hidden">
                <div className="w-full h-full rounded-full overflow-hidden relative">
                  <img 
                    src={jerryStrategist} 
                    alt="Jeremiah Adeyemi - The DigiTech Strategist"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -right-4 top-1/4 glass-card px-4 py-2 animate-float">
                <span className="text-sm font-medium text-primary">Lead Strategist</span>
              </div>
              <div className="absolute -left-4 bottom-1/4 glass-card px-4 py-2 animate-float animation-delay-300">
                <span className="text-sm font-medium text-secondary">Digital Architect</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Meet Your Guide
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              <span className="neon-text-cyan">Jeremiah Adeyemi</span>
              <br />
              <span className="text-foreground text-2xl md:text-3xl">The DigiTech Strategist</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Jeremiah Adeyemi leads Digital Creatives Hub with a vision to shift mindsets 
              from consumerism to creation. As your Lead Strategist & Architect, he brings 
              deep expertise in digital strategy, consulting, and education to guide you 
              on your journey to agency and impact.
            </p>

            {/* Quote */}
            <div className="glass-card p-6 border-l-4 border-l-secondary">
              <Quote className="w-8 h-8 text-secondary/50 mb-4" />
              <p className="text-foreground italic font-medium leading-relaxed">
                "The world doesn't need more consumers. It needs builders — those who can 
                strategically navigate, innovate, and create lasting value in the digital age."
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                — From "The Professional Builder's Blueprint"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategistSection;
