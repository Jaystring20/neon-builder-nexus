import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProofStory {
  id: string;
  question: string;
  shortAnswer: string;
  details: string[];
  metric: string;
  metricValue: string;
  category: "question" | "proof" | "metric";
}

const PROOF_STORIES: ProofStory[] = [
  {
    id: "fitness-religion",
    question: "Can one platform run the same event across five cities at once?",
    shortAnswer: "Yes. And the system should disappear while doing it.",
    details: [
      "Fitness Religion needed to coordinate multi-city events—not just schedule them, but turn coordination into automation. No chaos. No manual syncing.",
      "DCH built the infrastructure that handles registrations, city-specific logistics, live syncing between locations, and aftermath reporting. One registration, five cities move in parallel.",
      "The invisible part: The system never asked anyone to think about the system. Participants signup. Attend. Results come back. Done.",
      "The 2004 M00VE Challenge. 5+ Nigerian cities. One platform carrying registration, leaderboards, event management and sponsor integration.",
    ],
    metric: "Shipped",
    metricValue: "2004 M00VE Challenge · 5+ Nigerian cities · One platform",
    category: "question",
  },
  {
    id: "mh-eyewear",
    question: "How do you sell ₦1.9M Cartier frames to someone who can't see them yet?",
    shortAnswer: "You stop selling frames. You sell clarity and confidence.",
    details: [
      "M&H's problem was structural: luxury frames sell on fit, but try-on is impossible logistics. So DCH didn't build a frame catalog. It built three connected systems.",
      "AI Visual Try-On: Face mapping that shows you exactly how you look in any frame. No app, no hardware, no friction.",
      "Style Intelligence: A quiz that doesn't feel like a quiz. Matches your face shape, your vibe, your confidence level.",
      "Optical Integration: Free certified eye exams built into the purchase flow. ₦15K value that removes objection.",
      "The magic: These three systems work together. AI proves fit. Quiz proves relevance. Exam proves you're buying correctly, not just buying.",
      "145 five-star reviews. 2,800+ frames in inventory. 30-day returns because the fit was already proven before payment.",
    ],
    metric: "Proven",
    metricValue: "145 five-star reviews · 2,800+ frames · ₦15K savings per customer",
    category: "proof",
  },
  {
    id: "viera-amber",
    question: "What does a creative brand with five separate businesses look like when they actually work as one?",
    shortAnswer: "One nervous system. Five heartbeats. One pulse.",
    details: [
      "Viera Amber isn't one company. It's five: Illustrations & Design, VAGIN (impact initiative), VIVA (fashion), VAM (learning), VASH (creator commerce).",
      "Each could be standalone. But they're not supposed to be.",
      "DCH architected the infrastructure that lets these five models talk to each other. A girl in Lagos signs up for VAGIN education → discovers VIVA fashion → buys on VASH → that purchase feeds back into VAGIN's impact metrics.",
      "No handoffs. No data lost between systems. One transaction tells five stories.",
      "Why this is hard: Every business operates on different logic. DCH didn't make them the same. It made them conversational.",
      "3,000+ girls reached. 8+ countries. Five business models moving as one organism. Growth that isn't accidental—it's structural.",
    ],
    metric: "Scaled",
    metricValue: "3,000+ lives changed · 8+ countries · 5 interconnected businesses",
    category: "metric",
  },
];

interface ExpandedStoryProps {
  story: ProofStory;
  isExpanded: boolean;
}

const ExpandedStory: React.FC<ExpandedStoryProps> = ({ story, isExpanded }) => {
  return (
    <div
      className={cn(
        "overflow-hidden transition-all motion-reveal",
        isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="pt-6 pb-8 border-t border-border/30 space-y-4">
        {story.details.map((detail, idx) => (
          <p
            key={idx}
            className="text-sm leading-relaxed text-muted-foreground animate-fade-up-elegant"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {detail}
          </p>
        ))}

        {/* Metric callout */}
        <div className="mt-6 pt-6 border-t border-border/20 flex items-start gap-4">
          <div className="flex-1">
            <dt className="label-mono mb-1.5">
              {story.metric}
            </dt>
            <dd className="text-sm text-foreground font-medium">{story.metricValue}</dd>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProofStorySection = () => {
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
            Three Shipped Systems
          </h2>
          <p className="text-base text-muted-foreground">
            Each proof is a question you might ask. Click to explore the answer.
          </p>
        </div>

        {/* Proof Stories */}
        <div className="space-y-4">
          {PROOF_STORIES.map((story, idx) => (
            <div
              key={story.id}
              className="group relative rounded-none border border-border/40 bg-card/30 backdrop-blur-sm transition-all motion-snap hover:border-border/60 hover:bg-card/50"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Clickable header */}
              <button
                onClick={() => toggleExpand(story.id)}
                className="w-full text-left p-6 md:p-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded-none"
              >
                {/* Question */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors motion-snap">
                      {story.question}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {story.shortAnswer}
                    </p>
                  </div>

                  {/* Expand indicator */}
                  <div className="flex-shrink-0">
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform motion-snap",
                        expandedId === story.id && "rotate-180"
                      )}
                    />
                  </div>
                </div>
              </button>

              {/* Expanded content */}
              <ExpandedStory story={story} isExpanded={expandedId === story.id} />
            </div>
          ))}
        </div>

        {/* Pattern footer */}
        <div className="mt-16 pt-12 border-t border-border/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="label-mono mb-2">
                Fitness Religion
              </h4>
              <p className="text-sm text-foreground font-medium">
                Can we move human bodies and data in sync?
              </p>
              <span className="text-xs text-primary mt-1 inline-block">✓ Answered by infrastructure</span>
            </div>
            <div>
              <h4 className="label-mono mb-2">
                M & H Eyewear
              </h4>
              <p className="text-sm text-foreground font-medium">
                Can we sell luxury when the customer can't see it yet?
              </p>
              <span className="text-xs text-primary mt-1 inline-block">✓ Answered by three systems</span>
            </div>
            <div>
              <h4 className="label-mono mb-2">
                Viera Amber
              </h4>
              <p className="text-sm text-foreground font-medium">
                Can we run five businesses on one nervous system?
              </p>
              <span className="text-xs text-primary mt-1 inline-block">✓ Answered by architecture</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            The systems don't decorate. They solve. And they're invisible until they're not.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProofStorySection;
