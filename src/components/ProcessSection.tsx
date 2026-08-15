import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProcessStep {
  id: string;
  number: string;
  title: string;
  duration: string;
  what: string;
  details: string[];
  delivers: string[];
  decide?: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery Call",
    duration: "1 session",
    what: "You tell us the problem. We listen for the question hiding inside the problem.",
    details: [
      "Client says: 'We need an e-commerce site.'",
      "We ask: 'What does a customer need to believe before they buy from you?'",
      "Real question emerges: 'Can I actually see how this looks on me?'",
    ],
    delivers: ["A one-page brief", "One clear question", "Who needs to believe it"],
  },
  {
    id: "architecture",
    number: "02",
    title: "Architecture Sprint",
    duration: "1 week",
    what: "We sketch the brand system, diagram the infrastructure, spec the AI, define metrics.",
    details: [
      "Visual brand system (colors, typography, components)",
      "Infrastructure diagram (boxes and arrows)",
      "Rough wireframes (what the user sees)",
      "Success metrics (how we measure if it worked)",
    ],
    delivers: [
      "Design system mockup",
      "Infrastructure diagram",
      "Wireframes & flows",
      "Metric definitions",
    ],
    decide: "Is this the system you want to build?",
  },
  {
    id: "build",
    number: "03",
    title: "Build Phase",
    duration: "4–12 weeks",
    what: "Design, infrastructure, and AI build together. Real code. Real data.",
    details: [
      "Parallel streams—frontend and backend build simultaneously",
      "Weekly checkpoints on progress and learning",
      "Your team + our team making decisions together",
      "Testing with actual users as soon as there's something to test",
    ],
    delivers: [
      "Working features (not demos)",
      "Performance metrics",
      "Brand consistency audits",
      "AI behavior logs",
    ],
  },
  {
    id: "launch-prep",
    number: "04",
    title: "Launch Prep",
    duration: "2 weeks",
    what: "Stress test, audit, and set up monitoring.",
    details: [
      "Push the system to breaking point, fix what breaks",
      "Check every screen for brand consistency",
      "Detect if AI has drifted from the original intent",
      "Set up monitoring so we know if something goes wrong before you do",
    ],
    delivers: [
      "Proven-under-load system",
      "Monitoring dashboard",
      "Runbooks & response plans",
    ],
  },
  {
    id: "launch",
    number: "05",
    title: "Launch Day",
    duration: "1 day",
    what: "Monitor every transaction, every user, every metric.",
    details: [
      "Real-time issue response",
      "Document what went right (so we do it again)",
      "Celebrate with your team",
    ],
    delivers: ["Live system", "Real user data", "Confidence in the foundation"],
  },
  {
    id: "post-launch",
    number: "06",
    title: "Post-Launch",
    duration: "Ongoing",
    what: "Weekly analysis. Iterate structurally. Scale with you.",
    details: [
      "Weekly data analysis: what's the data telling us?",
      "Iterative improvements based on real usage",
      "Scaling: as you grow, the infrastructure grows with you",
      "New features: built on top of proven foundations",
    ],
    delivers: [
      "Weekly reports",
      "Structured improvements",
      "Scaling infrastructure",
      "Sustainable growth",
    ],
  },
];

interface StepCardProps {
  step: ProcessStep;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

const StepCard: React.FC<StepCardProps> = ({ step, isExpanded, onToggle, isLast }) => {
  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-12 top-24 w-px h-12 bg-gradient-to-b from-primary/40 to-transparent" />
      )}

      {/* Step card */}
      <div className="relative">
        {/* Number indicator */}
        <div className="absolute left-0 top-0 w-24 h-24 flex items-center justify-center">
          <div className="text-5xl font-light text-foreground/10 tabular-nums">{step.number}</div>
        </div>

        {/* Content */}
        <button
          onClick={onToggle}
          className="w-full text-left pl-32 pr-6 py-6 rounded-lg border border-border/30 bg-card/20 hover:bg-card/40 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  {step.duration}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{step.what}</p>
            </div>

            <ChevronDown
              className={cn(
                "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
                isExpanded && "rotate-180"
              )}
            />
          </div>
        </button>

        {/* Expanded content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500",
            isExpanded ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="pl-32 pr-6 py-6 space-y-6 border-l-2 border-primary/20">
            {/* Details */}
            {step.details.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-3">
                  What we do
                </h4>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-muted-foreground flex gap-2 animate-fade-up-elegant"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <span className="text-primary flex-shrink-0 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Delivers */}
            {step.delivers.length > 0 && (
              <div className="border-t border-primary/10 pt-6">
                <h4 className="text-xs uppercase tracking-[0.16em] text-foreground/50 mb-3">
                  You receive
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {step.delivers.map((deliver, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-sm animate-fade-up-elegant"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{deliver}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decide */}
            {step.decide && (
              <div className="border-t border-primary/10 pt-6">
                <p className="text-sm italic text-foreground">
                  {step.decide}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProcessSection = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="font-display-refined text-3xl md:text-4xl leading-tight text-foreground mb-4">
            How This Actually Works
          </h2>
          <p className="text-base text-muted-foreground">
            From question to launch. Click each phase to see what happens.
          </p>
        </div>

        {/* Process steps */}
        <div className="space-y-6 max-w-4xl">
          {PROCESS_STEPS.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              isExpanded={expandedId === step.id}
              onToggle={() => toggleExpand(step.id)}
              isLast={idx === PROCESS_STEPS.length - 1}
            />
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-16 pt-12 border-t border-border/30 max-w-2xl">
          <p className="text-sm text-muted-foreground">
            The real timeline isn't measured in weeks. It's measured in: <span className="italic">how long until your system is actually working and you know it?</span> Sometimes that's 4 weeks. Sometimes it's 6 months. It depends on complexity, not urgency.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
