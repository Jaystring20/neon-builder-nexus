import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RevealElement {
  id: string;
  visible: boolean;
}

const OriginStorySection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [revealedElements, setRevealedElements] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-reveal-id");
            if (id) {
              setRevealedElements((prev) => new Set(prev).add(id));
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current?.querySelectorAll("[data-reveal-id]");
    elements?.forEach((el) => observer.observe(el));

    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const isRevealed = (id: string) => revealedElements.has(id);

  return (
    <section ref={sectionRef} className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="font-display-refined text-3xl md:text-4xl leading-tight text-foreground mb-6">
            Why We Built It This Way
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            Digital Creatives Hub started in Lagos. Not because we wanted to be "authentic" or "ground-up." Because Lagos taught us something specific.
          </p>
        </div>

        {/* Content blocks - reveal on scroll */}
        <div className="space-y-12 max-w-3xl">
          {/* Block 1: Constraints */}
          <div
            data-reveal-id="constraints"
            className={cn(
              "pb-8 border-b border-border/30 transition-all duration-700",
              isRevealed("constraints")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Constraints Force Architecture
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              In Lagos, you can't assume stable internet, so you build for intermittent sync. You can't assume one payment method works, so you build for multiple rails. You can't assume one visual language, so you design in HSL. You can't assume one voice, so you listen to how people actually talk.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Every constraint became a principle.
            </p>
          </div>

          {/* Block 2: The insight */}
          <div
            data-reveal-id="insight"
            className={cn(
              "pb-8 border-b border-border/30 transition-all duration-700",
              isRevealed("insight")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              What If We Optimized for Meaning?
            </h3>
            <p className="text-base leading-relaxed text-muted-foreground mb-4">
              Most design agencies optimize for aesthetics. Most engineering firms optimize for performance. We started by asking: what if we optimized for meaning?
            </p>
            <div className="mt-4 pl-4 border-l-2 border-primary/30 space-y-2">
              <p className="text-sm text-muted-foreground">
                Design that works at any viewport, any connection speed, any language.
              </p>
              <p className="text-sm text-muted-foreground">
                Infrastructure that doesn't break when someone's internet cuts out mid-purchase.
              </p>
              <p className="text-sm text-muted-foreground">
                AI that understands context, not just patterns.
              </p>
              <p className="text-sm text-muted-foreground">
                Teams that see the brand as alive, not as a checklist.
              </p>
            </div>
          </div>

          {/* Block 3: The proof */}
          <div
            data-reveal-id="proof"
            className={cn(
              "pb-8 border-b border-border/30 transition-all duration-700",
              isRevealed("proof")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              How Lagos Built These Systems
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Fitness Religion</h4>
                <p className="text-sm text-muted-foreground">
                  Works because Lagos taught us to assume nothing is guaranteed. Multi-city sync isn't a nice-to-have—it's load-bearing. The system doesn't wait for perfect conditions.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">M & H Eyewear</h4>
                <p className="text-sm text-muted-foreground">
                  Works because we built for actual Nigerian conditions: slow internet, varied devices, a visual culture that talks back. The virtual try-on is fast even on 4G.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-1">Viera Amber</h4>
                <p className="text-sm text-muted-foreground">
                  Works because we stopped treating separate businesses like one problem. Conversational systems are more resilient than monolithic ones.
                </p>
              </div>
            </div>
          </div>

          {/* Block 4: Operating principle */}
          <div
            data-reveal-id="principle"
            className={cn(
              "transition-all duration-700",
              isRevealed("principle")
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            )}
          >
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                The Operating Principle
              </h3>
              <p className="text-base leading-relaxed text-muted-foreground mb-4">
                We don't export a template from Lagos to New York and call it global. We listen to where we're building, understand the constraints, and let those constraints force the architecture.
              </p>
              <p className="text-sm text-primary font-medium">
                That's how you end up with systems that don't break. Not because they're over-engineered. Because they're under-assumed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OriginStorySection;
