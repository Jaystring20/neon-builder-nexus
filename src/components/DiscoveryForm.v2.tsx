/**
 * Discovery Form v2 - Personalized & Insightful
 *
 * This is a completely redesigned discovery experience that:
 * 1. Provides contextual insights after each answer
 * 2. Uses personalized copy that references their specific inputs
 * 3. Builds a tight narrative throughout the flow
 * 4. Delivers insights-based segment recommendations
 * 5. Creates personalized email sequences with their unique context
 *
 * Design Philosophy:
 * - Every question builds toward a deeper understanding
 * - Insights are provided in real-time, not just at the end
 * - Copy references their actual answers, not generic language
 * - The segment reveal feels like a real insight, not a categorization
 * - Emails sound like they're from someone who knows their business
 *
 * Flow:
 * 1. Intro: What brings them here?
 * 2. Vision & Values: Understanding their direction
 * 3. Insights: "This tells us X about your business"
 * 4. Capabilities: Assess management & leadership
 * 5. Business Model: Revenue, scale, advantage
 * 6. Insight: "Combined with X, you're positioned for Y"
 * 7. Gaps: Biggest challenge & 90-day priority
 * 8. Final Insight: "Here's what we're seeing..."
 * 9. Segment Reveal: Personalized with their context
 * 10. Email Capture: Why we're emailing + what they'll get
 * 11. Thank You: Personal next steps
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { DiscoveryAnswers, SegmentResult, calculateSegment } from "../data/segmentLogic";
import { getProgramBySegment } from "../data/programDefinitions";

type FormStage = "intro" | "questions" | "insight" | "result" | "email_capture" | "thank_you";

interface FormState extends Partial<DiscoveryAnswers> {
  email?: string;
}

// ============================================================
// INSIGHTS GENERATOR
// ============================================================
// Real-time insights based on their answers

const insights = {
  // After Journey question
  journey: {
    starting: "You're building from first principles. This means you have the freedom to shape your business model deliberately — most founders don't have that advantage.",
    building: "You're in the validation phase. The decisions you make now (positioning, revenue model, team) will compound over the next 18 months.",
    scaling: "You're hitting the ceiling of the model you built. Scaling isn't just hiring more; it's often redesigning the core playbook.",
    team: "Building the right team is the unlock. Many founders fail because they hire for growth before they've nailed the playbook.",
    confused: "This is actually the right place to be. Clarity comes from getting specific about your constraints (time, money, values, skills) — not from having all the answers upfront.",
  },

  // After Vision question
  vision: (vision: string) => {
    if (!vision || vision.length < 10) {
      return "The clearer your vision, the easier it is to say no. Keep refining this sentence.";
    }
    return `"${vision.substring(0, 60)}..." — This vision will determine every decision you make about positioning, pricing, and partnerships.`;
  },

  // After Values question
  values: (selected: string[]) => {
    if (selected.includes("Impact") || selected.includes("Mission")) {
      return "Mission-driven founders often undercharge and underscale because they see growth as a distraction from impact. We help you build sustainable impact (not just survival).";
    }
    if (selected.includes("Premium") || selected.includes("Excellence")) {
      return "Premium positioning requires discipline. You'll need to turn away 9/10 customers to serve the 1 you love. Most founders can't do this.";
    }
    if (selected.includes("Speed") || selected.includes("Growth")) {
      return "Growth is the goal, but growth without a defensible moat is just burning through runway. The question is: what's sustainable?";
    }
    return "Your values are the guardrail for every decision. Everything else (revenue model, team structure, pricing) flows from this.";
  },

  // After Revenue Model question
  revenue: (model: string, scale: string, expertise: number) => {
    if (model === "subscription") {
      return `Subscription = predictable revenue + recurring customer acquisition burden. ${scale === "international" ? "At international scale, this gets complex fast." : "This model rewards discipline and systems."}`;
    }
    if (model === "project") {
      return `Project-based = high-margin, low-volume OR low-margin, high-volume. Which one are you? This will determine everything else.`;
    }
    if (expertise >= 4) {
      return `With your domain expertise, you're positioned to productize or license what you know. Leverage that.`;
    }
    return `Your revenue model is the heartbeat of your business. Everything else (team, operations, pricing) flows from this choice.`;
  },

  // After Business Model section
  businessModel: (answers: Partial<FormState>) => {
    const { q6_scale, q7_revenue, q8_advantage } = answers;
    if (q7_revenue === "subscription" && q6_scale === "international") {
      return "Subscription + international scale = venture opportunity (if you want it). This is high-complexity, high-reward.";
    }
    if (q7_revenue === "project" && q6_scale === "local") {
      return "Local project-based = lifestyle business opportunity. The question is: do you want lifestyle, or do you want to scale?";
    }
    if (q8_advantage && q8_advantage.length > 0) {
      return `Your advantage is real. Now the question is: are you protecting it (premium pricing, selective customers) or giving it away (competing on price)?`;
    }
    return "The combination of your revenue model + scale + advantage determines which playbook you need.";
  },

  // After Gaps section
  gaps: (challenge: string, priority: string) => {
    const gapMap: Record<string, string> = {
      customers: "Customer acquisition is the leakiest bucket. You can have the best product in the world, but if no one knows about it, it doesn't matter.",
      team: "Team is the multiplier. One great person can 10x your output. But hiring the wrong person can slow you down 5x.",
      model: "A broken business model can't be fixed with better execution. You need to get this right before scaling.",
      scaling: "Scaling without losing control requires systems and delegation. Most founders are bad at both.",
      corporate_access: "High-value customers (corporate) have different buying cycles, RFP processes, and relationships. This is a different game.",
      cash: "Cash flow is the oxygen of the business. Profitability is optional; cash is not.",
      motivation: "Founder burnout is real. The question is: are you burnt out because the business is hard, or because it's the wrong business?",
    };
    return gapMap[challenge] || "Understanding your biggest constraint helps us recommend the right program.";
  },
};

// ============================================================
// MOTION VARIANTS
// ============================================================

const getContainerVariants = (reduce: boolean) => ({
  hidden: { opacity: 0 },
  visible: reduce ? { opacity: 1 } : {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
});

const getItemVariants = (reduce: boolean) => ({
  hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: reduce ? {} : { duration: 0.4 } },
});

const getStageVariants = (reduce: boolean) => ({
  initial: reduce ? { opacity: 1 } : { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: reduce ? {} : { duration: 0.5 } },
  exit: reduce ? { opacity: 1 } : { opacity: 0, y: -20, transition: { duration: 0.3 } },
});

// ============================================================
// MAIN COMPONENT
// ============================================================

export function DiscoveryFormV2() {
  const [formState, setFormState] = useState<FormState>({});
  const [stage, setStage] = useState<FormStage>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [segment, setSegment] = useState<SegmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentInsight, setCurrentInsight] = useState<string>("");

  const reduce = useReducedMotion();

  // Questions in a tighter, more insightful flow
  const questions = [
    {
      id: "q1_brings_you",
      question: "Where are you in your journey?",
      type: "single_select",
      options: [
        { value: "starting", label: "Starting from scratch" },
        { value: "building", label: "Building early (pre-product fit)" },
        { value: "scaling", label: "Scaling an existing business" },
        { value: "team", label: "Building / scaling the team" },
        { value: "confused", label: "Honestly not sure" },
      ],
    },
    {
      id: "q2_vision",
      question: "What are you building?",
      subtitle: "In 1-2 sentences, what's the vision?",
      type: "text_input",
      placeholder: "A premium interior design studio for high-net-worth clients...",
    },
    {
      id: "q3_values",
      question: "What matters most to you?",
      subtitle: "Pick 1-3 values that guide your decisions",
      type: "multi_select",
      options: [
        { value: "Impact", label: "Impact: Making real difference" },
        { value: "Premium", label: "Premium: Serving the best customers" },
        { value: "Excellence", label: "Excellence: Obsessive quality" },
        { value: "Mission", label: "Mission: Solving a specific problem" },
        { value: "Speed", label: "Speed: Move fast, iterate" },
        { value: "Freedom", label: "Freedom: Control time & choices" },
        { value: "Growth", label: "Growth: Relentless scaling" },
      ],
    },
    {
      id: "q4_expertise",
      question: "How would you rate your expertise in your domain?",
      type: "scale",
      labels: ["Beginner", "Some experience", "Competent", "Expert", "Master"],
    },
    {
      id: "q4_management",
      question: "How would you rate your ability to manage a team?",
      subtitle: "Be honest. Can you lead, delegate, and build culture?",
      type: "scale",
      labels: ["Never managed", "Managed 1-2", "Led small team", "Led larger team", "Built a culture"],
    },
    {
      id: "q4_leadership",
      question: "How would you rate your leadership capabilities?",
      subtitle: "Can you make hard calls and inspire confidence under pressure?",
      type: "scale",
      labels: ["Still learning", "Growing", "Solid", "Strong", "Exceptional"],
    },
    {
      id: "q5_pressure",
      question: "What's your relationship with work pressure?",
      subtitle: "How hard are you willing to push?",
      type: "single_select",
      options: [
        { value: "balance", label: "I want balance and sustainability" },
        { value: "real_but_bounded", label: "I can push hard (40-50 hrs/week)" },
        { value: "80_hours", label: "I'm ready to go all-in (60-80+ hrs)" },
        { value: "mission", label: "Mission comes first, personal comfort second" },
      ],
    },
    {
      id: "q6_scale",
      question: "What's your geographic ambition?",
      type: "single_select",
      options: [
        { value: "local", label: "Local (my city/region)" },
        { value: "national", label: "National (my country)" },
        { value: "international", label: "International (global)" },
      ],
    },
    {
      id: "q7_revenue",
      question: "How do you plan to make money?",
      subtitle: "What's your revenue model?",
      type: "single_select",
      options: [
        { value: "subscription", label: "Subscription (recurring revenue)" },
        { value: "project", label: "Project-based (one-time fees)" },
        { value: "transaction", label: "Transaction-based (per sale)" },
        { value: "upfront", label: "Upfront / retainer-based" },
        { value: "unsure", label: "I'm not sure yet" },
      ],
    },
    {
      id: "q8_advantage",
      question: "What's your unfair advantage?",
      subtitle: "Why would customers choose you over alternatives?",
      type: "text_input",
      placeholder: "Unique access to suppliers, proprietary process, deep relationships, domain expertise...",
    },
    {
      id: "q9_challenge",
      question: "What's your biggest constraint right now?",
      subtitle: "What's the bottleneck?",
      type: "single_select",
      options: [
        { value: "customers", label: "Customer acquisition" },
        { value: "team", label: "Building the right team" },
        { value: "model", label: "Business model clarity" },
        { value: "scaling", label: "Scaling without breaking things" },
        { value: "corporate_access", label: "Getting enterprise customers" },
        { value: "cash", label: "Cash flow management" },
        { value: "motivation", label: "Staying motivated & focused" },
      ],
    },
    {
      id: "q10_priority",
      question: "What would change everything in 90 days?",
      subtitle: "What's the one win that moves the needle?",
      type: "text_input",
      placeholder: "Landing 5 enterprise customers, hiring my first developer, proving product-market fit...",
    },
  ];

  // Helper: Get current question
  const currentQ = questions[currentQuestion];

  // Helper: Check if current question answered
  const isCurrentQuestionAnswered = () => {
    const answer = formState[currentQ.id as keyof FormState];
    if (currentQ.type === "multi_select") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== "";
  };

  // Helper: Generate insight for current question
  const getInsightForQuestion = () => {
    const qId = currentQ.id;
    const answer = formState[qId as keyof FormState];

    if (qId === "q1_brings_you" && answer) {
      return insights.journey[answer as keyof typeof insights.journey];
    }
    if (qId === "q2_vision" && answer) {
      return insights.vision(answer as string);
    }
    if (qId === "q3_values" && answer) {
      return insights.values(answer as string[]);
    }
    if (qId === "q7_revenue" && answer) {
      const expertise = formState.q4_expertise as number;
      const scale = formState.q6_scale as string;
      return insights.revenue(answer as string, scale, expertise);
    }
    if (qId === "q9_challenge" && answer) {
      const priority = formState.q10_priority as string;
      return insights.gaps(answer as string, priority);
    }

    return "";
  };

  // Handlers
  const handleAnswer = (questionId: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      setError("Please answer this question");
      return;
    }
    setError(null);

    // Show insight
    const insight = getInsightForQuestion();
    if (insight && currentQuestion < questions.length - 1) {
      setCurrentInsight(insight);
      setStage("insight");
    } else if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // Done with questions
      handleCalculateSegment();
    }
  };

  const handleContinueFromInsight = () => {
    setCurrentQuestion((prev) => prev + 1);
    setStage("questions");
    setCurrentInsight("");
  };

  const handleCalculateSegment = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const answers = formState as DiscoveryAnswers;
        const result = calculateSegment(answers);
        setSegment(result);
        setStage("result");
        setIsLoading(false);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        setIsLoading(false);
      }
    }, 800);
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Founder Discovery
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Let's get clear on where you are, what you're building, and what comes next.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 dark:from-cyan-400 dark:to-cyan-500"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={reduce ? {} : { duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        {/* Stages */}
        <AnimatePresence mode="wait">
          {/* Questions Stage */}
          {stage === "questions" && (
            <motion.div
              key="questions"
              variants={getStageVariants(reduce)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 mb-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                  {currentQ.question}
                </h2>
                {currentQ.subtitle && (
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {currentQ.subtitle}
                  </p>
                )}

                {/* Render question type */}
                <motion.div
                  variants={getContainerVariants(reduce)}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {currentQ.type === "single_select" && currentQ.options && (
                    <>
                      {currentQ.options.map((opt) => (
                        <motion.button
                          key={opt.value}
                          variants={getItemVariants(reduce)}
                          onClick={() => handleAnswer(currentQ.id, opt.value)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            formState[currentQ.id as keyof FormState] === opt.value
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600"
                          }`}
                        >
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {opt.label}
                          </span>
                        </motion.button>
                      ))}
                    </>
                  )}

                  {currentQ.type === "text_input" && (
                    <motion.input
                      variants={getItemVariants(reduce)}
                      type="text"
                      placeholder={currentQ.placeholder}
                      value={(formState[currentQ.id as keyof FormState] as string) || ""}
                      onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    />
                  )}

                  {currentQ.type === "scale" && (
                    <motion.div
                      variants={getItemVariants(reduce)}
                      className="space-y-4 mt-6"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {currentQ.labels[0]}
                        </span>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          {currentQ.labels[currentQ.labels.length - 1]}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {currentQ.labels.map((label, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAnswer(currentQ.id, idx + 1)}
                            className={`flex-1 py-3 rounded-lg border-2 font-medium transition-all ${
                              (formState[currentQ.id as keyof FormState] as number) === idx + 1
                                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-900 dark:text-cyan-50"
                                : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-300 dark:hover:border-cyan-600"
                            }`}
                          >
                            {idx + 1}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex gap-3">
                  {currentQuestion > 0 && (
                    <button
                      onClick={() => {
                        setCurrentQuestion((prev) => prev - 1);
                        setError(null);
                      }}
                      className="px-6 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      ← Back
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentQuestionAnswered()}
                    className="flex-1 px-6 py-3 rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-medium hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                  >
                    {currentQuestion === questions.length - 1 ? "See Your Segment →" : "Continue →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Insight Stage */}
          {stage === "insight" && currentInsight && (
            <motion.div
              key="insight"
              variants={getStageVariants(reduce)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border-2 border-cyan-200 dark:border-cyan-800 p-8 mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mt-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-2">
                      Here's what we're seeing...
                    </h3>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {currentInsight}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleContinueFromInsight}
                className="w-full px-6 py-3 rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-medium hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors active:scale-95"
              >
                Continue →
              </button>
            </motion.div>
          )}

          {/* Segment Reveal */}
          {stage === "result" && segment && (
            <motion.div
              key="result"
              variants={getStageVariants(reduce)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SegmentReveal segment={segment} formState={formState} />
            </motion.div>
          )}

          {/* Email Capture */}
          {stage === "email_capture" && (
            <motion.div
              key="email"
              variants={getStageVariants(reduce)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EmailCaptureStage
                segment={segment}
                onSubmit={(email) => {
                  // TODO: Submit to API
                  console.log("Email:", email);
                  setFormState((prev) => ({ ...prev, email }));
                  setStage("thank_you");
                }}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* Thank You */}
          {stage === "thank_you" && (
            <motion.div
              key="thankyou"
              variants={getStageVariants(reduce)}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ThankYouStage email={formState.email} segment={segment?.segment} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================

function SegmentReveal({
  segment,
  formState,
}: {
  segment: SegmentResult;
  formState: FormState;
}) {
  const reduce = useReducedMotion();

  const segmentLabels: Record<string, { title: string; emoji: string }> = {
    msme_value: {
      title: "Premium Positioning Master",
      emoji: "💎",
    },
    msme_volume: {
      title: "Market Penetration Expert",
      emoji: "📈",
    },
    startup: {
      title: "Venture Founder",
      emoji: "🚀",
    },
    professional_service: {
      title: "Expert Scaling",
      emoji: "⭐",
    },
    development_org: {
      title: "Impact Builder",
      emoji: "🌍",
    },
  };

  const label = segmentLabels[segment.segment] || {
    title: "Founder",
    emoji: "👤",
  };

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduce ? {} : { duration: 0.6 }}
        className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700 text-center"
      >
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { delay: 0.2, duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-5xl">{label.emoji}</span>
        </motion.div>

        <motion.h2
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? {} : { delay: 0.3, duration: 0.5 }}
          className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4"
        >
          {label.title}
        </motion.h2>

        <motion.p
          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? {} : { delay: 0.4, duration: 0.5 }}
          className="text-lg text-slate-700 dark:text-slate-300 mb-6 leading-relaxed"
        >
          Based on your vision, values, and constraints, here's what we're seeing:
        </motion.p>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { delay: 0.5, duration: 0.5 }}
          className="bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 p-6 rounded text-left mb-6"
        >
          <p className="text-slate-900 dark:text-slate-50 leading-relaxed">
            {segment.emailPersonalization.modelDescription}
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { delay: 0.6, duration: 0.5 }}
          className="space-y-4"
        >
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              Your Recommended Program
            </p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {segment.program}
            </p>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 italic">
            {segment.capabilityGap && (
              <span className="block mt-4 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded text-orange-900 dark:text-orange-200">
                ⚠️ {segment.capabilityGap}
              </span>
            )}
          </p>
        </motion.div>
      </motion.div>

      {/* CTA */}
      <motion.button
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? {} : { delay: 0.7, duration: 0.5 }}
        onClick={() => {}} // TODO: Proceed to email capture
        className="w-full px-6 py-4 rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-bold text-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors active:scale-95"
      >
        Learn More About This Program →
      </motion.button>
    </div>
  );
}

function EmailCaptureStage({
  segment,
  onSubmit,
  isLoading,
}: {
  segment: SegmentResult | null;
  onSubmit: (email: string) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = React.useState("");
  const reduce = useReducedMotion();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-slate-200 dark:border-slate-700">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
        Let's stay in touch
      </h2>
      <p className="text-slate-600 dark:text-slate-400 mb-6">
        We'll send you a personalized 3-email sequence with:
      </p>
      <ul className="space-y-2 mb-8 text-slate-700 dark:text-slate-300">
        <li className="flex items-center gap-2">
          <span className="text-cyan-500">✓</span> Deep dive into the {segment?.program} program
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cyan-500">✓</span> How it works + pricing tiers
        </li>
        <li className="flex items-center gap-2">
          <span className="text-cyan-500">✓</span> Next steps to apply or book a consultation
        </li>
      </ul>

      <motion.input
        variants={reduce ? {} : { initial: { opacity: 0 }, animate: { opacity: 1 } }}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 mb-4 focus:outline-none focus:border-cyan-500"
      />

      <button
        onClick={() => onSubmit(email)}
        disabled={!email || isLoading}
        className="w-full px-6 py-3 rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-bold hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 transition-colors active:scale-95"
      >
        {isLoading ? "Sending..." : "Send My Program Details →"}
      </button>
    </div>
  );
}

function ThankYouStage({
  email,
  segment,
}: {
  email?: string;
  segment?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="text-center">
      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduce ? {} : { duration: 0.6 }}
        className="text-6xl mb-6"
      >
        ✓
      </motion.div>

      <motion.h2
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? {} : { delay: 0.2, duration: 0.5 }}
        className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-4"
      >
        You're all set!
      </motion.h2>

      <motion.p
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? {} : { delay: 0.3, duration: 0.5 }}
        className="text-lg text-slate-600 dark:text-slate-400 mb-8"
      >
        Check <strong>{email}</strong> for your personalized program details.
      </motion.p>

      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? {} : { delay: 0.4, duration: 0.5 }}
        className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-6 mb-8 border border-cyan-200 dark:border-cyan-800"
      >
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          What's coming your way:
        </p>
        <ul className="text-left space-y-2 text-slate-700 dark:text-slate-300">
          <li>📧 <strong>Email 1 (Today):</strong> Your segment match + program recommendation</li>
          <li>📧 <strong>Email 2 (Tomorrow):</strong> Deep dive into the program structure & pricing</li>
          <li>📧 <strong>Email 3 (In 3 days):</strong> Application or consultation booking link</li>
        </ul>
      </motion.div>

      <motion.div
        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduce ? {} : { delay: 0.5, duration: 0.5 }}
      >
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          Questions? Reply to any email and we'll get back to you within 24 hours.
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-50 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
        >
          ← Back to Home
        </a>
      </motion.div>
    </div>
  );
}
