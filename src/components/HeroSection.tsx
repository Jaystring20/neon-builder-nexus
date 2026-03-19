import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import heroBg from "@/assets/hero-bg.jpg";

const col1Images = [
  { src: "/images/hero/creative-director-brandboards.png", alt: "Creative director reviewing brand identity boards" },
  { src: "/images/hero/growth-spiral-metrics.png", alt: "Growth trajectory with ascending metrics" },
  { src: "/images/hero/afro-geometric-brandmark.png", alt: "Geometric brand mark with African-inspired patterns" },
  { src: "/images/hero/strategist-presenting.png", alt: "Strategist presenting with holographic data" },
];
const col2Images = [
  { src: "/images/hero/team-strategy-table.png", alt: "Diverse team collaborating around holographic strategy table" },
  { src: "/images/hero/funnel-architecture.png", alt: "Marketing funnel converting leads to golden results" },
  { src: "/images/hero/craft-meets-ai-workspace.png", alt: "Traditional craftsmanship meets AI interfaces" },
];
const col3Images = [
  { src: "/images/hero/brand-puzzle-hands.png", alt: "Hands assembling glowing brand identity puzzle" },
  { src: "/images/hero/network-afrofuturist-city.png", alt: "Interconnected network over Afrofuturist cityscape" },
  { src: "/images/hero/afro-monument-of-light.png", alt: "Monumental architecture of light and data" },
];

const allImages = [...col1Images, ...col2Images, ...col3Images];

const CarouselColumn = ({
  images,
  direction,
  duration,
  offset,
}: {
  images: { src: string; alt: string }[];
  direction: "up" | "down";
  duration: string;
  offset: string;
}) => {
  const doubled = [...images, ...images];
  return (
    <div className="flex-1 overflow-hidden relative" style={{ marginTop: offset }}>
      <div
        className="flex flex-col gap-4"
        style={{ animation: `${direction === "up" ? "scroll-up" : "scroll-down"} ${duration} linear infinite` }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden flex-shrink-0"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-48 md:h-56 object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileCarousel = () => {
  const doubled = [...allImages, ...allImages];
  return (
    <div className="relative w-full h-[180px] overflow-hidden md:hidden">
      {/* Left/right fade masks */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-4 h-full items-center hover:[animation-play-state:paused]"
        style={{ animation: "scroll-left 30s linear infinite", width: "max-content" }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden flex-shrink-0 w-[220px] h-[150px]"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative md:min-h-screen flex items-start md:items-center overflow-hidden pt-24 md:pt-20">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10 py-12 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
          {/* Left — Text */}
          <div className="flex-1 text-center md:text-left">
            <ScrollReveal animation="fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-subtle mb-4 md:mb-8 hover-glow">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Business Development Creative Agency
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={100}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight mb-4 md:mb-6">
                <span className="text-foreground">The Future is</span>{" "}
                <span className="gradient-text">Built.</span>
                <br />
                <span className="text-foreground">Not Bought.</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mb-4 leading-relaxed">
                Most brands are renting space in a digital maze they don't own.{" "}
                <span className="text-primary font-medium">We help you build the architecture of authority.</span>
              </p>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-10 leading-relaxed">
                We build growth engines that convert brand potential into{" "}
                <span className="text-secondary font-medium">measurable market velocity</span>.
              </p>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                <Button variant="hero" size="xl" className="group hover-glow">
                  Start the Build
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="heroOutline" size="xl" className="group hover-glass-shine">
                  <Download className="w-5 h-5" />
                  View the Blueprint
                </Button>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={400}>
              <div className="mt-12 pt-8 border-t border-border/30">
                <p className="text-sm text-muted-foreground mb-4">
                  Trusted by forward-thinking brands
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                  {[
                    { value: "500+", label: "Brands Built", color: "text-primary" },
                    { value: "50+", label: "Growth Engines", color: "text-secondary" },
                    { value: "15+", label: "Countries", color: "text-primary" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2 glass-card-subtle px-4 py-2 hover-lift">
                      <span className={`${stat.color} font-bold text-sm`}>{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Mobile — Horizontal Marquee */}
          <MobileCarousel />

          {/* Desktop — Vertical Carousel Grid */}
          <div className="flex-1 relative h-[600px] w-full max-w-none hidden md:block group">
            {/* Top & Bottom gradient masks */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 h-full overflow-hidden [&:hover_div]:![animation-play-state:paused]">
              <CarouselColumn images={col1Images} direction="up" duration="25s" offset="0px" />
              <CarouselColumn images={col2Images} direction="down" duration="30s" offset="-40px" />
              <CarouselColumn images={col3Images} direction="up" duration="20s" offset="20px" />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce hidden md:flex">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 glass-card-subtle">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
