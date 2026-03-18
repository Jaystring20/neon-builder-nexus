import { useState } from "react";
import { ExternalLink, ArrowUpRight, Layers, Globe, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { portfolioProjects, portfolioCategories } from "@/data/portfolio";
import { cn } from "@/lib/utils";

const stats = [
  { value: "10+", label: "Projects Delivered", icon: Layers },
  { value: "8+", label: "Industries Served", icon: Globe },
  { value: "100%", label: "Client Retention", icon: Zap },
];

const OurWork = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? portfolioProjects
      : portfolioProjects.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--neon-cyan)/0.08)_0%,transparent_60%)]" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[radial-gradient(circle,hsl(var(--neon-cyan)/0.06)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-40 right-1/4 w-80 h-80 bg-[radial-gradient(circle,hsl(var(--neon-orange)/0.04)_0%,transparent_70%)] blur-3xl" />

        <div className="container-narrow relative z-10 text-center">
          <ScrollReveal animation="fade-up">
            <Badge variant="outline" className="mb-6 border-primary/40 text-primary uppercase tracking-widest text-xs px-4 py-1.5">
              Portfolio
            </Badge>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              Brands We've{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                Engineered
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              From concept to conversion — we architect digital ecosystems that transform brands into market leaders.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="pb-12">
        <div className="container-narrow">
          <ScrollReveal animation="fade-up" delay={250}>
            <div className="glass-card p-6 md:p-8">
              <div className="grid grid-cols-3 divide-x divide-border/30">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="flex flex-col items-center gap-2 px-4">
                      <Icon className="w-5 h-5 text-primary/60 hidden md:block" />
                      <span className="font-heading text-2xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {stat.value}
                      </span>
                      <span className="text-muted-foreground text-[10px] md:text-xs uppercase tracking-wider text-center">
                        {stat.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="pb-10">
        <div className="container-narrow">
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {portfolioCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-300 border",
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)]"
                      : "bg-muted/30 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-primary"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Project Grid */}
      <section className="pb-24">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((project, i) => {
              const Icon = project.icon;
              return (
                <ScrollReveal key={project.id} animation="fade-up" delay={i * 80}>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block h-full"
                  >
                    <div className="h-full rounded-2xl border border-border/30 overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.12)] hover:-translate-y-2 glass-card hover-glass-shine relative">
                      {/* Gradient border on hover */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(135deg, hsl(var(--neon-cyan) / 0.15) 0%, transparent 40%, transparent 60%, hsl(var(--neon-orange) / 0.1) 100%)' }} />

                      {/* Image Placeholder */}
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/20 to-card/60" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,hsl(var(--neon-cyan)/0.06)_0%,transparent_70%)]" />
                        
                        {/* Decorative grid */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl scale-150 group-hover:bg-primary/20 transition-all duration-700" />
                            <Icon className="w-14 h-14 text-primary/25 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-700 relative z-10" />
                          </div>
                        </div>
                        
                        {/* External link badge */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                          <div className="bg-primary/90 text-primary-foreground p-1.5 rounded-lg shadow-[0_0_15px_hsl(var(--neon-cyan)/0.4)]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </div>
                        </div>

                        {/* Category overlay */}
                        <div className="absolute bottom-3 left-3">
                          <Badge className="bg-card/80 backdrop-blur-sm text-primary border-primary/20 text-[10px] uppercase tracking-wider">
                            {project.category}
                          </Badge>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3 relative z-10">
                        <h3 className="font-heading font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors duration-300">
                          {project.title}
                        </h3>
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-0.5 rounded-full bg-muted/40 text-muted-foreground text-[10px] font-medium border border-border/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        {/* View project link */}
                        <div className="pt-2 flex items-center gap-1.5 text-primary/60 group-hover:text-primary transition-colors duration-300">
                          <span className="text-xs font-semibold uppercase tracking-wider">View Project</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </a>
                </ScrollReveal>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              No projects found in this category.
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="pb-24">
        <div className="container-narrow">
          <ScrollReveal animation="fade-up">
            <div className="glass-card-elevated p-10 md:p-14 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--neon-cyan)/0.06)_0%,transparent_60%)]" />
              <div className="relative z-10">
                <h2 className="font-heading text-2xl md:text-4xl font-bold mb-4">
                  Ready to Be{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Next?
                  </span>
                </h2>
                <p className="text-muted-foreground text-sm md:text-base max-w-lg mx-auto mb-8">
                  Let's architect a digital presence that doesn't just exist — it dominates.
                </p>
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl shadow-[0_0_25px_hsl(var(--neon-cyan)/0.4)] hover:shadow-[0_0_40px_hsl(var(--neon-cyan)/0.6)] transition-all duration-300 hover:scale-105"
                >
                  Start Your Project
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default OurWork;
