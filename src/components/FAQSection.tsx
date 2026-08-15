import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string[];
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "different-agency",
    question: "How is this different from hiring an agency?",
    answer: [
      "An agency executes your brief. We architect your system.",
      "Most agencies ask: 'What do you want?' We ask: 'What are you trying to prove?'",
      "Most agencies hand off at launch. We stay—measuring, learning, iterating.",
      "Most agencies optimize for project completion. We optimize for whether the system is actually working.",
    ],
  },
  {
    id: "existing-team",
    question: "What if we already have a designer/engineer?",
    answer: [
      "Great. We'll work with them, not replace them.",
      "We function as architects, not a replacement team. If you have designers, we pair with them. If you have engineers, we collaborate.",
      "The output is better when your team's knowledge combines with our approach.",
    ],
  },
  {
    id: "cost",
    question: "How much does this cost?",
    answer: [
      "It depends on the scope of what you're building:",
      "Small system (one core question, limited scope): Starting at $40K–$80K",
      "Medium system (multiple connected capabilities, multi-team): Starting at $120K–$250K",
      "Complex system (five+ integrated businesses, scale from day one): Starting at $300K+",
      "We'll know the real cost after the discovery call. We never estimate before we understand the question.",
    ],
  },
  {
    id: "timeline",
    question: "How long does it take?",
    answer: [
      "From question to launch, usually 8–14 weeks.",
      "But that's not the real timeline. The real timeline is: how long until your system is actually working and you know it?",
      "Sometimes that's 4 weeks. Sometimes it's 6 months. It depends on complexity, not urgency.",
    ],
  },
  {
    id: "change-direction",
    question: "What if we need to change direction mid-build?",
    answer: [
      "We expect you to.",
      "Real information about what works comes from building and testing, not from planning. If the data says the direction should change, we change it.",
      "The architecture is designed for that—it bends without breaking.",
    ],
  },
  {
    id: "guarantee",
    question: "Can you guarantee it will work?",
    answer: [
      "No. We can guarantee it will be built on sound architecture, measured constantly, and iterated based on real data.",
      "Things fail. Users surprise you. Markets shift. What matters is whether the system is designed to adapt, not whether it was perfect from day one.",
    ],
  },
];

interface FAQItemComponentProps {
  item: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemComponentProps> = ({ item, isExpanded, onToggle }) => {
  return (
    <div className="border-b border-border/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full text-left py-6 flex items-start justify-between gap-4 hover:text-primary transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded px-1"
      >
        <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors flex-1">
          {item.question}
        </h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300",
            isExpanded && "rotate-180"
          )}
        />
      </button>

      {/* Expanded answer */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          isExpanded ? "max-h-[1000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        )}
      >
        <div className="space-y-3">
          {item.answer.map((paragraph, idx) => (
            <p
              key={idx}
              className="text-sm leading-relaxed text-muted-foreground animate-fade-up-elegant"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
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
            Asked Questions
          </h2>
          <p className="text-base text-muted-foreground">
            The questions we hear most. Click to expand.
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl border-t border-border/30">
          {FAQ_ITEMS.map((item) => (
            <FAQItemComponent
              key={item.id}
              item={item}
              isExpanded={expandedId === item.id}
              onToggle={() => toggleExpand(item.id)}
            />
          ))}
        </div>

        {/* Follow-up CTA */}
        <div className="mt-16 pt-12 border-t border-border/30 max-w-2xl">
          <p className="text-sm text-muted-foreground mb-4">
            Have a different question? Let's talk about it.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors group"
          >
            Start a conversation
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
