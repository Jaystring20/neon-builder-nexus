import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCtaClick = (callback: () => void) => {
    setIsLoading(true);
    callback();
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <section className="relative flex min-h-[80svh] items-center overflow-hidden pt-32 pb-20 md:min-h-[85vh] md:pt-36 md:pb-16">
      {/* Ambient glow — the site's established atmospheric device, centered behind the copy */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[38%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.06] blur-[90px] md:h-[760px] md:w-[760px] md:blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 h-[320px] w-[320px] rounded-full bg-secondary/[0.04] blur-[70px] md:h-[420px] md:w-[420px] md:blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10 w-full">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="font-display-refined hero-animate mb-7 text-[2.75rem] leading-[1.05] text-foreground [text-wrap:balance] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.25rem]"
            style={{ animationDelay: "80ms" }}
          >
            The Future is{" "}
            <span className="font-serif-display text-[3rem] leading-none text-primary sm:text-[3.75rem] md:text-[4.75rem] lg:text-[5.75rem]">
              Built.
            </span>
            <br />
            <span className="text-[2.25rem] text-foreground/90 sm:text-[2.75rem] md:text-[3.5rem] lg:text-[4rem]">
              Not Bought.
            </span>
          </h1>

          <p
            className="hero-animate mx-auto mb-9 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl"
            style={{ animationDelay: "180ms" }}
          >
            We design the brand, build the infrastructure, and wire in the AI
            systems that run it — as one connected build, not a stack of vendors.
          </p>

          <div
            className="hero-animate flex flex-col items-center gap-5 sm:flex-row sm:justify-center"
            style={{ animationDelay: "260ms" }}
          >
            <Button
              variant="pill"
              size="xl"
              isLoading={isLoading}
              onClick={() => handleCtaClick(() => scrollToId("contact"))}
              className="group w-full sm:w-auto"
            >
              {!isLoading && (
                <>
                  Start the Build
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <Link
              to="/our-work"
              className="group -m-2 inline-flex items-center gap-2 p-2 text-base font-semibold text-foreground/75 transition-all duration-300 hover:text-foreground active:scale-95 active:duration-100 sm:text-lg"
            >
              See the work
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
