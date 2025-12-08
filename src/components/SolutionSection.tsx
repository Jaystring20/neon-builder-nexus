import { Lightbulb, Target, Users, Rocket, Shield, Zap } from "lucide-react";

const SolutionSection = () => {
  const solutions = [
    {
      icon: Shield,
      title: "Conquer Obsolescence",
      description: "Practical, future-ready skills that keep you ahead of the curve"
    },
    {
      icon: Lightbulb,
      title: "Expert-Led Guidance",
      description: "Cut through the noise with mentorship from industry strategists"
    },
    {
      icon: Users,
      title: "Vibrant Community",
      description: "Collaborate with a network of creators and innovators"
    },
    {
      icon: Rocket,
      title: "Impact-Driven Solutions",
      description: "Transform ideas into digital solutions that drive growth"
    }
  ];

  return (
    <section id="services" className="section-padding relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 -left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]" />

      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            The Lab Approach
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            A Lab for <span className="neon-text-cyan">Digital Builders</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Digital Creatives Hub is your innovation lab — a hands-on space to conquer fear, 
            build agency, and unlock your full potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {solutions.map((solution, index) => (
            <div
              key={solution.title}
              className="group relative glass-card p-8 overflow-hidden transition-all duration-500 hover:border-primary/50"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <solution.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="glass-card p-8 md:p-12 border-primary/20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, label: "Monthly Sprints", value: "Public Demos" },
              { icon: Users, label: "Mentor Programs", value: "Weekly Guidance" },
              { icon: Target, label: "Project Boards", value: "Real Outcomes" },
              { icon: Rocket, label: "Digital Outputs", value: "Portfolios & Case Studies" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className="font-heading font-semibold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
