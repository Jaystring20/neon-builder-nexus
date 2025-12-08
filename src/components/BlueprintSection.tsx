import { Download, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import blueprintCover from "@/assets/blueprint-book-cover.jpg";
const BlueprintSection = () => {
  const days = [
    { day: "1-2", title: "Consumer to Creator", description: "Shift your mindset from passive consumption to active creation" },
    { day: "3-4", title: "Builder's Identity", description: "Identify your unique strengths and builder persona" },
    { day: "5-6", title: "10-Year Vision", description: "Craft your long-term vision and actionable first steps" },
    { day: "7", title: "Agency & Resilience", description: "Commit to a path of urgency and internal resilience" },
  ];

  return (
    <section id="lab" className="section-padding relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-transparent to-transparent" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-secondary/15 rounded-full blur-[120px]" />

      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
              Free Resource
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
              The Professional{" "}
              <span className="neon-text-orange">Builder's Blueprint</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              7 Days to Start Building Agency in the AI Age — a free, actionable guide 
              designed to help you break free from passivity and start creating real value immediately.
            </p>

            <div className="space-y-4 mb-8">
              {[
                "Shift from consumer to creator mindset",
                "Identify your unique builder's identity",
                "Create your 10-year strategic vision",
                "Build lasting agency and resilience"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0" />
                  <span className="text-foreground">{item}</span>
                </div>
              ))}
            </div>

            <Button variant="secondary" size="xl" className="group">
              <Download className="w-5 h-5" />
              Download Free Blueprint
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          {/* Right Content - Book Cover & Timeline */}
          <div className="relative">
            {/* Book Cover */}
            <div className="mb-8 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative rounded-lg overflow-hidden shadow-2xl shadow-secondary/20 border border-border/30 transform transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-1">
                  <img 
                    src={blueprintCover} 
                    alt="The Professional Builder's Blueprint - 7 Days to Start Building Agency in the AI Age"
                    className="w-64 md:w-72 h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-secondary via-secondary/50 to-transparent" />
              
              <div className="space-y-4">
                {days.map((item, index) => (
                  <div
                    key={index}
                    className="relative pl-16 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-0 w-12 h-12 rounded-full bg-card border-2 border-secondary flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                      <span className="text-secondary font-bold text-sm">
                        D{item.day}
                      </span>
                    </div>

                    <div className="glass-card p-4 group-hover:border-secondary/30 transition-colors">
                      <h3 className="font-heading font-semibold text-base mb-1 text-foreground">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlueprintSection;
