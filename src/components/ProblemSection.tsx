import { AlertTriangle, TrendingDown, Clock, Users } from "lucide-react";

const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingDown,
      title: "Rapid Obsolescence",
      description: "Skills and strategies becoming outdated at an unprecedented pace"
    },
    {
      icon: Clock,
      title: "Overwhelming Change",
      description: "Struggling to keep up with the constant evolution of digital tools and AI"
    },
    {
      icon: Users,
      title: "Passive Consumption",
      description: "Stuck as consumers in a world that demands active builders and creators"
    },
    {
      icon: AlertTriangle,
      title: "Missed Opportunities",
      description: "Watching others thrive while growth remains stalled"
    }
  ];

  return (
    <section id="about" className="section-padding relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-destructive/5 rounded-full blur-[100px]" />

      <div className="container-narrow relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full bg-destructive/10 text-destructive text-sm font-medium mb-6">
            The Silent Threat
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-6">
            Why "Business as Usual" is{" "}
            <span className="text-destructive">No Longer Enough</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Are you overwhelmed by the rapid pace of digital change? Do you fear your skills 
            or your organization's capabilities are becoming obsolete? You're not alone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((problem, index) => (
            <div
              key={problem.title}
              className="group glass-card p-8 hover:border-destructive/30 transition-all duration-500 glow-effect"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center group-hover:bg-destructive/20 transition-colors">
                  <problem.icon className="w-7 h-7 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-semibold mb-2 text-foreground">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {problem.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 glass-card p-8 md:p-12 text-center border-secondary/30">
          <p className="text-xl md:text-2xl font-heading text-foreground leading-relaxed">
            This isn't just about learning new tools; it's about a{" "}
            <span className="text-secondary font-semibold">fundamental shift</span> in mindset 
            and capability. The world doesn't need more consumers.{" "}
            <span className="text-primary font-semibold">It needs builders.</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
