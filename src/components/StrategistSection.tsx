import { Quote, Award, Target, Lightbulb, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import jerryStrategist from "@/assets/jerry-strategist.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const StrategistSection = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[150px] animate-breathe" />

      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image/Avatar Section */}
          <div className="relative order-2 lg:order-1 flex flex-col items-center">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative mx-auto w-72 h-72 md:w-96 md:h-96 group cursor-pointer opacity-0 animate-blur-in">
                  {/* Decorative Rings - animate on hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-breathe transition-all duration-500 group-hover:border-primary/60 group-hover:scale-105" />
                  <div className="absolute inset-4 rounded-full border border-secondary/20 transition-all duration-500 group-hover:border-secondary/50 group-hover:scale-105 group-hover:rotate-12" />
                  <div className="absolute inset-2 rounded-full border border-primary/10 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-110 group-hover:-rotate-6" />
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-full bg-primary/0 blur-xl transition-all duration-500 group-hover:bg-primary/20" />
                  
                  {/* Avatar Container with Photo */}
                  <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-1 overflow-hidden transition-transform duration-500 group-hover:scale-105">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img 
                        src={jerryStrategist} 
                        alt="Jeremiah Adeyemi - The DigiTech Strategist"
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent transition-opacity duration-500 group-hover:opacity-60" />
                      
                      {/* Reveal overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100 flex items-end justify-center pb-6">
                        <div className="text-center transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                          <p className="text-sm font-medium text-primary">Click to learn more</p>
                          <p className="text-xs text-muted-foreground mt-1">Strategy • Innovation • Impact</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badges - enhanced hover with glass */}
                  <div className="absolute -right-4 top-1/4 glass-card-subtle px-4 py-2 animate-float transition-all duration-300 hover-lift group-hover:scale-110 group-hover:-right-6">
                    <span className="text-sm font-medium text-primary">Lead Strategist</span>
                  </div>
                  <div className="absolute -left-4 bottom-1/4 glass-card-subtle px-4 py-2 animate-float animation-delay-300 transition-all duration-300 hover-lift group-hover:scale-110 group-hover:-left-6">
                    <span className="text-sm font-medium text-secondary">Digital Architect</span>
                  </div>
                </div>
              </DialogTrigger>

              {/* Bio Modal */}
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto glass-card-elevated border-border/50">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading gradient-text">Jeremiah Adeyemi</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6 pt-4">
                  {/* Header with image */}
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start opacity-0 animate-fade-in-up-elegant">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 flex-shrink-0 glass-border">
                      <img 
                        src={jerryStrategist} 
                        alt="Jeremiah Adeyemi"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground text-center sm:text-left">The DigiTech Strategist</h3>
                      <p className="text-sm text-muted-foreground mt-1 text-center sm:text-left">Lead Strategist & Digital Architect at Digital Creatives Hub</p>
                      <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                        <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover-glow transition-all duration-300">Digital Strategy</span>
                        <span className="px-3 py-1 text-xs rounded-full bg-secondary/10 text-secondary hover-glow transition-all duration-300">Consulting</span>
                        <span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover-glow transition-all duration-300">Education</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio content */}
                  <div className="space-y-4 opacity-0 animate-fade-in-up-elegant animation-delay-100">
                    <p className="text-muted-foreground leading-relaxed">
                      Jeremiah Adeyemi is a visionary digital strategist with a passion for transforming how people 
                      interact with technology. As the founder and Lead Strategist of Digital Creatives Hub, he has 
                      dedicated his career to shifting mindsets from passive consumerism to active creation.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      With years of experience in digital strategy, consulting, and education, Jeremiah brings a 
                      unique perspective that bridges the gap between technical innovation and human-centered design. 
                      His approach combines strategic thinking with practical implementation, helping individuals and 
                      organizations navigate the complexities of the digital landscape.
                    </p>
                  </div>

                  {/* Core values/expertise */}
                  <div className="grid grid-cols-2 gap-4 opacity-0 animate-fade-in-up-elegant animation-delay-200">
                    <div className="glass-card-subtle p-4 text-center hover-lift hover-glass-shine">
                      <Target className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Strategic Vision</h4>
                      <p className="text-xs text-muted-foreground mt-1">Turning ideas into actionable roadmaps</p>
                    </div>
                    <div className="glass-card-subtle p-4 text-center hover-lift hover-glass-shine">
                      <Lightbulb className="w-6 h-6 text-secondary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Innovation</h4>
                      <p className="text-xs text-muted-foreground mt-1">Pioneering creative digital solutions</p>
                    </div>
                    <div className="glass-card-subtle p-4 text-center hover-lift hover-glass-shine">
                      <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Community</h4>
                      <p className="text-xs text-muted-foreground mt-1">Building networks of digital creators</p>
                    </div>
                    <div className="glass-card-subtle p-4 text-center hover-lift hover-glass-shine">
                      <Award className="w-6 h-6 text-secondary mx-auto mb-2" />
                      <h4 className="text-sm font-medium text-foreground">Excellence</h4>
                      <p className="text-xs text-muted-foreground mt-1">Committed to quality and impact</p>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="glass-card-elevated p-5 border-l-4 border-l-secondary opacity-0 animate-fade-in-up-elegant animation-delay-300">
                    <Quote className="w-6 h-6 text-secondary/50 mb-3" />
                    <p className="text-foreground italic leading-relaxed">
                      "The world doesn't need more consumers. It needs builders — those who can strategically 
                      navigate, innovate, and create lasting value in the digital age."
                    </p>
                  </div>

                  {/* Connect Button */}
                  <Button variant="hero" size="lg" asChild className="w-full hover-glow opacity-0 animate-fade-in-up-elegant animation-delay-400">
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
                </div>
              </DialogContent>
            </Dialog>

            {/* Connect Button - Under Picture */}
            <Button variant="heroOutline" size="lg" asChild className="mt-8 hover-glow opacity-0 animate-fade-in-up-elegant animation-delay-200">
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
          </div>

          {/* Content Section */}
          <div className="order-1 lg:order-2">
            <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 opacity-0 animate-fade-in-up-elegant">
              Meet Your Guide
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6 opacity-0 animate-fade-in-up-elegant animation-delay-100">
              <span className="gradient-text">Jeremiah Adeyemi</span>
              <br />
              <span className="text-foreground text-2xl md:text-3xl">The DigiTech Strategist</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed opacity-0 animate-fade-in-up-elegant animation-delay-200">
              Jeremiah Adeyemi leads Digital Creatives Hub with a vision to shift mindsets 
              from consumerism to creation. As your Lead Strategist & Architect, he brings 
              deep expertise in digital strategy, consulting, and education to guide you 
              on your journey to agency and impact.
            </p>

            {/* Quote */}
            <div className="glass-card-elevated p-6 border-l-4 border-l-secondary hover-glow opacity-0 animate-fade-in-up-elegant animation-delay-300">
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
