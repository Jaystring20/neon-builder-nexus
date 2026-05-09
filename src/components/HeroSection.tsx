import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden pt-28 pb-20 md:min-h-screen md:pt-0 md:pb-0">
      {/* Subtle ambient glow only — no image, no carousel */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-primary/[0.06] blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full bg-secondary/[0.05] blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10">
        <div className="mx-auto max-w-5xl text-center md:text-left">
          <h1 className="font-display-refined mb-8 text-foreground leading-[1.05] md:leading-[1] text-[3.5rem] sm:text-7xl md:text-[6.5rem] lg:text-[8rem]">
            The Future
            <br />
            <span className="text-foreground/95">is </span>
            <span className="font-serif-display text-primary text-[4rem] sm:text-[5.5rem] md:text-[7.5rem] lg:text-[9.5rem] leading-none">
              Built.
            </span>
            <br />
            Not Bought.
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl md:mx-0 md:text-2xl">
            We help ambitious brands build the architecture of authority — growth
            engines that convert potential into measurable market velocity.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button
              variant="pill"
              size="xl"
              onClick={() => scrollToId("contact")}
              className="group w-full sm:w-auto"
            >
              Start the Build
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
