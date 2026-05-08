import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";
import { portfolioProjects } from "@/data/portfolio";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const mosaic = portfolioProjects.slice(0, 9);
const col1 = [mosaic[0], mosaic[3], mosaic[6]];
const col2 = [mosaic[1], mosaic[4], mosaic[7]];
const col3 = [mosaic[2], mosaic[5], mosaic[8]];

const ProofTile = ({ p }: { p: typeof portfolioProjects[number] }) => (
  <a
    href={p.url}
    target="_blank"
    rel="noopener noreferrer"
    className="group relative block flex-shrink-0 overflow-hidden rounded-xl border border-border/30 transition-all duration-500 hover:border-primary/40 hover:shadow-[0_0_30px_hsl(var(--primary)/0.25)]"
  >
    <img
      src={p.image}
      alt={p.title}
      className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105 md:h-56"
      loading="lazy"
    />
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent px-3 py-3">
      <p className="text-xs font-semibold text-foreground line-clamp-1">{p.category}</p>
      <p className="text-[10px] uppercase tracking-wider text-primary line-clamp-1">{p.tags[0]}</p>
    </div>
  </a>
);

const ProofColumn = ({
  items,
  direction,
  duration,
  offset,
}: {
  items: typeof portfolioProjects;
  direction: "up" | "down";
  duration: string;
  offset: string;
}) => {
  const doubled = [...items, ...items];
  return (
    <div className="relative flex-1 overflow-hidden" style={{ marginTop: offset }}>
      <div
        className="flex flex-col gap-4"
        style={{ animation: `${direction === "up" ? "scroll-up" : "scroll-down"} ${duration} linear infinite` }}
      >
        {doubled.map((img, i) => (
          <ProofTile key={i} p={img} />
        ))}
      </div>
    </div>
  );
};

const MobileProofRail = () => {
  const doubled = [...mosaic, ...mosaic];
  return (
    <div className="relative mt-6 w-full overflow-hidden lg:hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max items-center gap-3" style={{ animation: "scroll-left 40s linear infinite" }}>
        {doubled.map((p, i) => (
          <a
            key={i}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-[124px] w-[186px] flex-shrink-0 overflow-hidden rounded-xl border border-border/30 sm:h-[140px] sm:w-[210px]"
          >
            <img src={p.image} alt={p.title} className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background to-transparent px-2 py-1.5">
              <p className="text-[10px] font-semibold text-foreground line-clamp-1">{p.category}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative flex items-start overflow-hidden pb-12 pt-24 lg:min-h-screen lg:items-center lg:py-0 lg:pt-0">
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
        <div className="flex flex-col items-stretch gap-8 lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full flex-1 text-center md:text-left">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 glass-card-subtle hover-glow sm:mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                Business Development Creative Agency
              </span>
            </div>

            <h1 className="mb-5 font-heading text-4xl font-bold leading-tight sm:text-5xl md:text-5xl lg:mb-6 lg:text-6xl">
              <span className="text-foreground">The Future is</span>{" "}
              <span className="gradient-text">Built.</span>
              <br />
              <span className="text-foreground">Not Bought.</span>
            </h1>

            <p className="mb-4 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Most brands are renting space in a digital maze they don't own.{" "}
              <span className="font-medium text-primary">We help you build the architecture of authority.</span>
            </p>
            <p className="mb-8 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg lg:mb-10">
              We build growth engines that convert brand potential into{" "}
              <span className="font-medium text-secondary">measurable market velocity</span>.
            </p>

            <div className="flex flex-col items-center gap-3 md:items-start">
              <Button
                variant="hero"
                size="xl"
                onClick={() => scrollToId("contact")}
                className="group hover-glow"
              >
                Start the Build
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <button
                type="button"
                onClick={() => scrollToId("blueprint")}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-secondary"
              >
                Or download the Builder's Blueprint
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <MobileProofRail />
          </div>

          <div className="group relative hidden h-[600px] w-full max-w-none flex-1 lg:block">
            <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-background to-transparent" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-background to-transparent" />

            <div className="flex h-full gap-4 overflow-hidden [&:hover_div]:![animation-play-state:paused]">
              <ProofColumn items={col1} direction="up" duration="28s" offset="0px" />
              <ProofColumn items={col2} direction="down" duration="34s" offset="-40px" />
              <ProofColumn items={col3} direction="up" duration="22s" offset="20px" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 animate-bounce md:flex">
        <div className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-primary/30 p-2 glass-card-subtle">
          <div className="h-2 w-1 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
