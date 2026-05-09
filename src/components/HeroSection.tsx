import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroVisual from "@/assets/hero-3d-architecture.png";
import jerryAvatar from "@/assets/jerry-strategist.png";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const TRUST_LOGOS = [
  "NORTHWIND",
  "ATLAS&CO",
  "VANTAGE",
  "MERIDIAN",
  "HELIX LABS",
  "ORBIT",
  "KINETIC",
  "FOUNDRY",
];

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[88svh] items-center overflow-hidden pt-28 pb-16 md:min-h-screen md:pt-0 md:pb-0">
      {/* Ambient page glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/[0.04] blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10 w-full">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          {/* LEFT — Copy */}
          <div className="text-center lg:text-left">
            <h1 className="font-display-refined hero-animate mb-6 text-foreground leading-[1.05] md:leading-[1] text-[3.25rem] sm:text-6xl md:text-[5.5rem] lg:text-[6.5rem]"
              style={{ animationDelay: "80ms" }}>
              The Future
              <br />
              <span className="text-foreground/95">is </span>
              <span className="font-serif-display text-primary text-[3.75rem] sm:text-[4.75rem] md:text-[6.25rem] lg:text-[7.5rem] leading-none">
                Built.
              </span>
              <br />
              Not Bought.
            </h1>

            <p className="hero-animate mx-auto mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:text-xl"
              style={{ animationDelay: "180ms" }}>
              We help ambitious brands build the architecture of authority —
              growth engines that convert potential into measurable market velocity.
            </p>

            <div className="hero-animate flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
              style={{ animationDelay: "260ms" }}>
              <Button
                variant="pill"
                size="xl"
                onClick={() => scrollToId("contact")}
                className="group w-full sm:w-auto"
              >
                Start the Build
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="w-full rounded-full border-border/70 bg-transparent hover:bg-card/60 sm:w-auto"
              >
                <Link to="/our-work">See the Work</Link>
              </Button>
            </div>
          </div>

          {/* RIGHT — 3D visual */}
          <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
            <div className="hero-glow-halo" />
            <div className="hero-animate relative animate-float" style={{ animationDelay: "120ms" }}>
              <img
                src={heroVisual}
                alt="Abstract 3D architectural sculpture representing brand foundations being built"
                width={1024}
                height={1024}
                className="relative z-10 mx-auto h-auto w-full max-h-[300px] object-contain drop-shadow-[0_30px_60px_rgba(0,255,255,0.15)] sm:max-h-[380px] lg:max-h-[560px]"
              />
            </div>

            {/* Floating persona chip */}
            <div
              className="hero-animate animate-float absolute right-0 top-6 z-20 hidden w-[230px] items-center gap-3 rounded-2xl border border-border/60 bg-card/80 p-3 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] sm:flex lg:right-2 lg:top-12"
              style={{ animationDelay: "320ms", animationDuration: "8s" }}
            >
              <img
                src={jerryAvatar}
                alt="Jeremiah, Lead Strategist"
                className="h-10 w-10 flex-shrink-0 rounded-full object-cover ring-2 ring-primary/40"
              />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  Architected by builders
                </p>
                <p className="mt-0.5 text-xs leading-snug text-foreground/85">
                  40+ brands shipped &amp; growing.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted-by logo strip */}
        <div className="hero-animate mt-12 lg:mt-16" style={{ animationDelay: "360ms" }}>
          <p className="mb-5 text-center text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground/80 lg:text-left">
            Trusted by builders shipping at
          </p>
          <div className="logo-strip-fade relative w-full overflow-hidden">
            <div
              className="flex w-max gap-12 md:gap-16"
              style={{ animation: "scroll-left 45s linear infinite" }}
            >
              {[...TRUST_LOGOS, ...TRUST_LOGOS].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="shrink-0 font-heading text-lg font-bold tracking-[0.18em] text-muted-foreground/60 transition-colors hover:text-foreground/80 md:text-xl"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
