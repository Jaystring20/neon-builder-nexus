import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="relative flex-1 overflow-hidden" style={{ marginTop: offset }}>
      <div
        className="flex flex-col gap-4"
        style={{ animation: `${direction === "up" ? "scroll-up" : "scroll-down"} ${duration} linear infinite` }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl flex-shrink-0"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-48 w-full object-cover md:h-56"
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
    <div className="relative my-6 w-full overflow-hidden lg:hidden">
      <div className="absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

      <div
        className="flex h-full w-max items-center gap-4"
        style={{ animation: "scroll-left 30s linear infinite" }}
      >
        {doubled.map((img, i) => (
          <div
            key={i}
            className="h-[150px] w-[220px] flex-shrink-0 overflow-hidden rounded-xl"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="h-full w-full object-cover"
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
    <section className="relative flex min-h-screen items-start overflow-hidden pt-24 lg:items-center lg:pt-0">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />

      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-1/4 h-[600px] w-[600px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute bottom-1/4 -right-1/4 h-[500px] w-[500px] rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-16">
          <div className="flex-1 text-center md:text-left">
            <div className="hero-animate" style={{ animationDelay: "0ms" }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card-subtle mb-8 hover-glow">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">
                  Business Development Creative Agency
                </span>
              </div>
            </div>

            <div className="hero-animate" style={{ animationDelay: "100ms" }}>
              <h1 className="mb-6 font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-5xl lg:text-6xl">
                <span className="text-foreground">The Future is</span>{" "}
                <span className="gradient-text">Built.</span>
                <br />
                <span className="text-foreground">Not Bought.</span>
              </h1>
            </div>

            <div className="hero-animate" style={{ animationDelay: "200ms" }}>
              <p className="mb-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                Most brands are renting space in a digital maze they don't own.{" "}
                <span className="font-medium text-primary">We help you build the architecture of authority.</span>
              </p>
              <p className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
                We build growth engines that convert brand potential into{" "}
                <span className="font-medium text-secondary">measurable market velocity</span>.
              </p>
            </div>

            <MobileCarousel />

            <div className="hero-animate" style={{ animationDelay: "300ms" }}>
              <div className="flex flex-col items-center gap-4 sm:flex-row md:items-start">
                <Button variant="hero" size="xl" className="group hover-glow">
                  Start the Build
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button variant="heroOutline" size="xl" className="group hover-glass-shine">
                  <Download className="w-5 h-5" />
                  View the Blueprint
                </Button>
              </div>
            </div>

            <div className="hero-animate" style={{ animationDelay: "400ms" }}>
              <div className="mt-12 border-t border-border/30 pt-8">
                <p className="mb-4 text-sm text-muted-foreground">
                  Trusted by forward-thinking brands
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
                  {[
                    { value: "500+", label: "Brands Built", color: "text-primary" },
                    { value: "50+", label: "Growth Engines", color: "text-secondary" },
                    { value: "15+", label: "Countries", color: "text-primary" },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center gap-2 px-4 py-2 glass-card-subtle hover-lift">
                      <span className={`${stat.color} text-sm font-bold`}>{stat.value}</span>
                      <span className="text-xs text-muted-foreground">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden h-[600px] w-full max-w-none flex-1 lg:block group">
            <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />

            <div className="flex h-full gap-4 overflow-hidden [&:hover_div]:![animation-play-state:paused]">
              <CarouselColumn images={col1Images} direction="up" duration="25s" offset="0px" />
              <CarouselColumn images={col2Images} direction="down" duration="30s" offset="-40px" />
              <CarouselColumn images={col3Images} direction="up" duration="20s" offset="20px" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 animate-bounce md:flex">
        <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 glass-card-subtle">
          <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
