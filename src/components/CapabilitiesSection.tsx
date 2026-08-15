import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Capability {
  id: "brand" | "infrastructure" | "ai";
  question: string;
  shortAnswer: string;
  sections: {
    title: string;
    content: string;
  }[];
  realExample: {
    title: string;
    description: string;
  };
  userQuestion: string;
  cta: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: "brand",
    question: "Does this brand actually mean something?",
    shortAnswer: "A brand without infrastructure is just marketing noise.",
    sections: [
      {
        title: "What we build",
        content:
          "Visual identity that doesn't need to shout. Narrative that proves itself through action, not copy. Systems that make the brand hard to misuse.",
      },
      {
        title: "Why it matters",
        content:
          "Your brand lives in three places: in design files, in code, in user behavior. Most agencies stop at the files. We architect the code so the brand enforces itself. A color changes in one place, it changes everywhere. A tone shifts, the entire experience shifts with it.",
      },
    ],
    realExample: {
      title: "M & H Eyewear",
      description:
        "When M & H Eyewear ships 'Sharp eyes. Sharper style.' in their brand voice, it's not just a tagline. It's the DNA of every interface decision—the quiz pacing, the copy in error states, the way reviews are structured. One voice, everywhere.",
    },
    userQuestion: "Does your brand mean something to the system, or just to the marketing deck?",
    cta: "Explore: How brand architecture affects infrastructure decisions",
  },
  {
    id: "infrastructure",
    question: "Will this hold when you scale?",
    shortAnswer: "Scale breaks what wasn't built for it.",
    sections: [
      {
        title: "What we build",
        content:
          "Systems that separate concerns. Databases that assume you'll grow 10x this year. APIs that let you add new features without touching old code. Monitoring that catches problems before customers do.",
      },
      {
        title: "Why it matters",
        content:
          "A smooth homepage at 100 users is not a smooth homepage at 100,000 users. The difference isn't effort—it's architecture. You either built for scale or you'll rebuild under fire.",
      },
    ],
    realExample: {
      title: "Fitness Religion",
      description:
        "Fitness Religion's system moved 10,000 people across 5 cities simultaneously. That's not a bigger database. That's a different architecture—one that syncs city-to-city in real time, doesn't wait for one location to finish before another starts, and still gives you accurate reporting after everyone's gone home.",
    },
    userQuestion: "If we 10x in 6 months, does the system still work, or do we rebuild?",
    cta: "Explore: How we stress-test infrastructure before launch",
  },
  {
    id: "ai",
    question: "Can the AI actually represent this brand?",
    shortAnswer: "AI is a tool that makes your worst instincts faster.",
    sections: [
      {
        title: "What we build",
        content:
          "AI that follows your brand voice, not replaces it. Guardrails that keep AI inside your positioning. Systems that use AI to automate the right things (personalization, diagnostics, routing) and leave the brand to humans. Monitoring that catches when AI drifts from the brand.",
      },
      {
        title: "Why it matters",
        content:
          "AI is seductive. It can sound like your brand after training on 10,000 examples. But 'sounds like' isn't 'is'. We use AI as a lever—it makes decisions faster, personalizes at scale, catches patterns humans miss. But it never speaks for the brand. It only surfaces what the brand already decided.",
      },
    ],
    realExample: {
      title: "M & H Eyewear",
      description:
        "M & H Eyewear's virtual try-on uses AI face mapping to show you frames. But it doesn't recommend frames. That's the quiz—human insight about what frames match your confidence level. AI powers the seeing. Humans do the meaning.",
    },
    userQuestion: "Is AI making us move faster in the right direction, or just making us move faster?",
    cta: "Explore: How we architect AI without losing the brand",
  },
];

interface CapabilityDisplayProps {
  capability: Capability;
  isActive: boolean;
}

const CapabilityDisplay: React.FC<CapabilityDisplayProps> = ({ capability, isActive }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 transition-all duration-500",
        isActive
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <div className="space-y-8">
        {/* Intro section */}
        <div>
          <p className="text-base leading-relaxed text-muted-foreground mb-4">
            {capability.shortAnswer} We design the identity that can hold weight when scale hits it.
          </p>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          {capability.sections.map((section, idx) => (
            <div key={idx} className="space-y-2 animate-fade-up-elegant" style={{ animationDelay: `${idx * 100}ms` }}>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider">
                {section.title}
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Real example */}
        <div className="border-t border-border/30 pt-8 animate-fade-up-elegant" style={{ animationDelay: "200ms" }}>
          <h4 className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-2">Real example</h4>
          <p className="text-sm font-medium text-foreground mb-2">{capability.realExample.title}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{capability.realExample.description}</p>
        </div>

        {/* Question & CTA */}
        <div className="border-t border-border/30 pt-8 animate-fade-up-elegant" style={{ animationDelay: "300ms" }}>
          <p className="text-sm font-medium text-foreground mb-3 italic">
            {capability.userQuestion}
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            {capability.cta}
            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

const CapabilitiesSection = () => {
  const [activeCapability, setActiveCapability] = useState<"brand" | "infrastructure" | "ai">(
    "brand"
  );

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="font-display-refined text-3xl md:text-4xl leading-tight text-foreground mb-4">
            What We Actually Do
          </h2>
          <p className="text-base text-muted-foreground">
            Three nested capabilities. Click to explore the architecture.
          </p>
        </div>

        {/* Capability selector */}
        <div className="flex gap-3 mb-12 pb-8 border-b border-border/30">
          {CAPABILITIES.map((cap) => (
            <button
              key={cap.id}
              onClick={() => setActiveCapability(cap.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCapability === cap.id
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "text-muted-foreground hover:text-foreground border border-border/30 hover:border-border/60"
              )}
            >
              {cap.question.split("?")[0].substring(0, 20)}...
            </button>
          ))}
        </div>

        {/* Content display (stacked, only one visible) */}
        <div className="relative min-h-[600px] md:min-h-[500px]">
          {CAPABILITIES.map((capability) => (
            <CapabilityDisplay
              key={capability.id}
              capability={capability}
              isActive={activeCapability === capability.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CapabilitiesSection;
