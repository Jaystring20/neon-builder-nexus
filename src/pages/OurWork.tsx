import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { portfolioProjects, portfolioCategories } from "@/data/portfolio";
import { cn } from "@/lib/utils";

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
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--neon-cyan)/0.08)_0%,transparent_60%)]" />
        <div className="container-narrow relative z-10 text-center">
          <ScrollReveal animation="fade-up">
            <Badge variant="outline" className="mb-6 border-primary/40 text-primary uppercase tracking-widest text-xs">
              Portfolio
            </Badge>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={100}>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Work
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" delay={200}>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              10 digital platforms we've architected — from community ecosystems and e-commerce storefronts to wellness brands and non-profit foundations.
            </p>
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
                    <div className="h-full rounded-xl border border-border/30 bg-card/30 backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--neon-cyan)/0.1)] hover:scale-[1.02]">
                      {/* Image Placeholder */}
                      <div className="aspect-video bg-muted/20 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        <Icon className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors duration-500" />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ExternalLink className="w-4 h-4 text-primary" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <Badge
                          variant="outline"
                          className="border-primary/30 bg-primary/5 text-primary text-[10px] uppercase tracking-wider"
                        >
                          {project.category}
                        </Badge>
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
                              className="px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground text-[10px] font-medium"
                            >
                              {tag}
                            </span>
                          ))}
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

      <Footer />
    </main>
  );
};

export default OurWork;
