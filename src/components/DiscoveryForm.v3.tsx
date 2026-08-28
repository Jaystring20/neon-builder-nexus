/**
 * Discovery Form v3 - Integrated Multi-Segment System
 *
 * Complete rebuild based on multi-segment audit.
 *
 * Key Principles:
 * 1. Segment-agnostic questions (work equally for all 5 models)
 * 2. Verification logic (catches contradictions and mismatches)
 * 3. Discovery pathways (helps confused founders find clarity)
 * 4. No AI slop (direct, specific, human language)
 * 5. Hybrid detection (captures real-world complexity)
 *
 * The form's job is NOT to force founders into a segment.
 * The form's job is to help them DISCOVER their actual model,
 * VERIFY their thinking, and CLARIFY their goals.
 *
 * Questions are structured:
 * 1. Primary question (discovery)
 * 2. Conditional follow-up (verification or depth)
 * 3. "I'm not sure" branch (discovery pathway for confused)
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { DiscoveryAnswers, SegmentResult, calculateSegment } from "../data/segmentLogic";
import { getProgramBySegment } from "../data/programDefinitions";

type FormStage = "intro" | "questions" | "verification" | "result" | "email_capture" | "thank_you";

interface FormState extends Partial<DiscoveryAnswers> {
  email?: string;
  // Added for v3
  clarityScore?: number; // How clear are they about their model? 1-10
  hasContradictions?: boolean; // Does their model have contradictions?
  isHybrid?: boolean; // Operating multiple models?
}

// ============================================================
// QUESTION STRUCTURE v3
// ============================================================

interface DiscoveryQuestion {
  id: string;
  section: string;

  // Primary question
  question: string;
  subtitle?: string;
  type: "single_select" | "multi_select" | "text_input" | "scale" | "discovery_branch";

  // Options or inputs
  options?: Array<{ value: string; label: string }>;
  labels?: string[];
  placeholder?: string;

  // Follow-up (verification logic)
  followUpTrigger?: (answer: any) => boolean; // When to show follow-up?
  followUp?: {
    question: string;
    type: "single_select" | "text_input";
    options?: Array<{ value: string; label: string }>;
  };

  // Insight
  getInsight?: (answer: any) => string;

  // Help pathway (for "I'm not sure")
  helpPathway?: {
    question: string;
    prompts: string[];
  };
}

// ============================================================
// QUESTIONS: SEGMENT-AGNOSTIC & DISCOVERY-FOCUSED
// ============================================================

const questions: DiscoveryQuestion[] = [
  {
    id: "q1_brings_you",
    section: "Foundation",
    question: "Where are you in your journey?",
    subtitle: "What stage are you at right now?",
    type: "single_select",
    options: [
      { value: "starting", label: "Starting from scratch" },
      { value: "building", label: "Building early (pre-product fit)" },
      { value: "scaling", label: "Scaling (product-market fit, growing fast)" },
      { value: "team", label: "Building a team / hiring" },
      { value: "confused", label: "Honestly, I'm confused about where I am" },
    ],
    followUpTrigger: (answer) => answer === "confused",
    followUp: {
      question: "Tell us more about what's confusing:",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        starting: "Starting gives you freedom. You can shape your business model deliberately.",
        building: "Building early is the hardest phase. Decisions now ripple forever.",
        scaling: "Scaling means your model works. Now it's about systems and team.",
        team: "Building a team changes everything. It requires different skills.",
        confused: "Confusion is real. Let's get specific about what's actually happening.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q2_vision",
    section: "Foundation",
    question: "What are you building?",
    subtitle: "In 1-2 sentences, what's the vision?",
    type: "text_input",
    placeholder: "A premium interior design studio for high-net-worth clients...",
    getInsight: (answer: string) => {
      if (answer.length < 20) return "Tell us more. What problem does this solve?";
      return "This is the foundation. Everything flows from this vision.";
    },
  },

  {
    id: "q3_values",
    section: "Foundation",
    question: "What matters most to you?",
    subtitle: "Pick 1-3 values that guide your decisions",
    type: "multi_select",
    options: [
      { value: "Impact", label: "Impact: Making real difference" },
      { value: "Quality", label: "Quality: Obsessive excellence" },
      { value: "Growth", label: "Growth: Expanding reach or revenue" },
      { value: "Freedom", label: "Freedom: Autonomy and control" },
      { value: "Money", label: "Money: Profitability" },
      { value: "Speed", label: "Speed: Move fast" },
      { value: "Sustainability", label: "Sustainability: Long-term viability" },
    ],
    getInsight: (answer: string[]) => {
      if (answer?.includes("Growth") && answer?.includes("Freedom")) {
        return "Growth and freedom can conflict. Scaling usually requires giving up some autonomy.";
      }
      if (answer?.includes("Impact")) {
        return "Impact-driven founders often struggle with the money conversation. You need both.";
      }
      return "Your values reveal what you'll protect. Everything else is negotiable.";
    },
  },

  {
    id: "q4_expertise",
    section: "Capabilities",
    question: "How would you rate your domain expertise?",
    subtitle: "What's your actual domain knowledge?",
    type: "scale",
    labels: ["Beginner", "Some", "Good", "Strong", "Master"],
    getInsight: (answer: number) => {
      if (answer <= 1) return "You're learning as you go. That works for some models, not others.";
      if (answer <= 2) return "Domain basics are there. Growth depends on deepening this.";
      if (answer >= 3) return "You have real expertise. The question is: are you protecting or scaling it?";
      return "";
    },
  },

  {
    id: "q4_management",
    section: "Capabilities",
    question: "How would you rate your team management ability?",
    subtitle: "Can you lead, delegate, and build culture?",
    type: "scale",
    labels: ["Never", "Once", "Few times", "Several", "Built culture"],
    // Only ask the follow-up of founders with some management experience.
    // `() => true` fired it for every answer, including "Never".
    followUpTrigger: (answer) => answer >= 2,
    followUp: {
      question: "Do you want to build a team?",
      type: "single_select",
      options: [
        { value: "solo", label: "Keep it solo/small" },
        { value: "scale", label: "Scale with a team" },
        { value: "unsure", label: "Unsure" },
      ],
    },
  },

  {
    id: "q4_leadership",
    section: "Capabilities",
    question: "How would you rate your leadership capability?",
    subtitle: "Can you make hard calls and inspire confidence?",
    type: "scale",
    labels: ["Developing", "Growing", "Solid", "Strong", "Exceptional"],
  },

  {
    id: "q5_pressure",
    section: "Constraints",
    question: "What's your work capacity right now?",
    subtitle: "How much can you work without burning out?",
    type: "single_select",
    options: [
      { value: "balance", label: "I want balance and sustainability" },
      { value: "real_but_bounded", label: "I can push hard, but with limits (40-50 hrs/week)" },
      { value: "80_hours", label: "I'm ready to go all-in (60-80+ hrs/week)" },
      { value: "mission", label: "Varies by what matters most that season" },
    ],
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        balance: "Balance is sustainable. Some models support it; others don't.",
        real_but_bounded: "Realistic intensity. You can do a lot in those hours.",
        "80_hours": "High intensity is normal early on. Not sustainable forever.",
        mission: "You're flexible. That's an advantage.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q6_scale",
    section: "Model",
    question: "What's your geographic scope?",
    subtitle: "Where do you want customers?",
    type: "single_select",
    options: [
      { value: "local", label: "Local (my city/region)" },
      { value: "national", label: "National" },
      { value: "international", label: "International" },
    ],
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        local: "Local works well for premium and professional services.",
        national: "National requires systems and scalable delivery.",
        international: "International is venture-scale thinking.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q7_revenue",
    section: "Model",
    question: "How do you make money?",
    subtitle: "What's your revenue model?",
    type: "single_select",
    options: [
      { value: "project", label: "Project-based / one-time fees" },
      { value: "subscription", label: "Subscription / recurring" },
      { value: "transaction", label: "Per-transaction / commission" },
      { value: "upfront", label: "Upfront + ongoing" },
      { value: "unsure", label: "Not sure yet" },
    ],
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        project: "Project revenue scales by hours/projects. It has a ceiling.",
        subscription: "Subscription is powerful. Requires acquisition and retention focus.",
        transaction: "Transaction models need volume and unit economics.",
        upfront: "Upfront creates cash flow. Ongoing builds relationships.",
        unsure: "Revenue model clarity is critical. This matters.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q8_advantage",
    section: "Model",
    question: "Why would customers choose you?",
    subtitle: "What's your competitive advantage?",
    type: "text_input",
    placeholder: "Deep relationships with [industry], proprietary system, best quality in my niche...",
  },

  {
    id: "q9_challenge",
    section: "Reality Check",
    question: "What's your biggest constraint right now?",
    subtitle: "What's the real bottleneck?",
    type: "single_select",
    options: [
      { value: "customers", label: "Getting customers / sales" },
      { value: "team", label: "Building the right team" },
      { value: "model", label: "Clarity on business model" },
      { value: "scaling", label: "Scaling delivery without breaking" },
      { value: "corporate_access", label: "Access to the right customers" },
      { value: "cash", label: "Cash / funding" },
      { value: "motivation", label: "Motivation / belief" },
    ],
  },

  {
    id: "q10_priority",
    section: "Reality Check",
    question: "What's your 90-day win?",
    subtitle: "What would meaningfully change your trajectory?",
    type: "text_input",
    placeholder: "Land 5 enterprise customers, hit $20k MRR, hire first team member...",
  },
];

// ============================================================
// MAIN COMPONENT
// ============================================================

export function DiscoveryFormV3() {
  const [formState, setFormState] = useState<FormState>({});
  const [stage, setStage] = useState<FormStage>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [segment, setSegment] = useState<SegmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reduce = useReducedMotion();
  const currentQ = questions[currentQuestion];

  /**
   * Send the completed form to the API.
   *
   * formState carries the twelve answers alongside a few fields that belong to
   * this component rather than to the founder's submission, so those are peeled
   * off here and the rest goes through as `answers` — the question ids are
   * already the keys DiscoveryAnswers declares.
   */
  const submitDiscovery = async (submittedEmail: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { email: _email, clarityScore, hasContradictions, isHybrid, ...answers } =
        formState;

      const response = await fetch("/api/discovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: submittedEmail, answers }),
      });

      // A non-JSON body means something upstream failed (an HTML error page,
      // typically). Fall back rather than throwing on the parse.
      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        setError(
          result?.error ?? "We couldn't save your answers. Please try again."
        );
        return;
      }

      setFormState((prev) => ({ ...prev, email: submittedEmail }));
      setStage("thank_you");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate clarity score based on answers
  const calculateClarity = useMemo(() => {
    let score = 0;
    const answerCount = Object.values(formState).filter(v => v !== undefined && v !== "").length;

    // More specific answers = higher clarity
    if (formState.q1_current_situation && formState.q1_current_situation !== "unsure") score += 2;
    if (formState.q2_core_business && formState.q2_core_business !== "unsure") score += 2;
    if (formState.q7_revenue_model && formState.q7_revenue_model !== "unsure") score += 2;
    if (formState.q8_advantage && formState.q8_advantage !== "not_sure") score += 2;
    if (formState.q9_constraint && formState.q9_constraint !== "clarity") score += 1;

    return Math.min(10, score);
  }, [formState]);

  const handleAnswer = (questionId: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    setShowFollowUp(false);
  };

  const isCurrentQuestionAnswered = () => {
    const answer = formState[currentQ.id as keyof FormState];
    if (currentQ.type === "multi_select") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== "";
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      setError("Please answer this question");
      return;
    }
    setError(null);

    // Check if follow-up is needed
    const answer = formState[currentQ.id as keyof FormState];
    if (currentQ.followUp && currentQ.followUpTrigger && currentQ.followUpTrigger(answer)) {
      if (!showFollowUp) {
        setShowFollowUp(true);
        return;
      }
    }

    // Move to next question
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setShowFollowUp(false);
    } else {
      // All questions done
      handleCalculateSegment();
    }
  };

  const handleCalculateSegment = () => {
    setIsLoading(true);
    setTimeout(() => {
      try {
        const answers = formState as DiscoveryAnswers;
        const result = calculateSegment(answers);
        setSegment(result);
        setStage("verification");
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
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 mb-3">
            Discover Your Business Model
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Let's get clear on what you're actually building and what you need.
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
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={reduce ? {} : { duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Questions Stage */}
          {stage === "intro" || stage === "questions" ? (
            <motion.div
              key="questions"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
              className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 mb-6 border border-slate-200 dark:border-slate-700"
            >
              {/* Question */}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                {currentQ.question}
              </h2>
              {currentQ.subtitle && (
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  {currentQ.subtitle}
                </p>
              )}

              {/* Insight (if available) */}
              {currentQ.getInsight && formState[currentQ.id as keyof FormState] && (
                <motion.div
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 border-l-4 border-cyan-500 rounded"
                >
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    {currentQ.getInsight(formState[currentQ.id as keyof FormState])}
                  </p>
                </motion.div>
              )}

              {/* Answer Options */}
              <div className="space-y-3 mb-6">
                {currentQ.type === "single_select" && currentQ.options && (
                  <>
                    {currentQ.options.map((opt) => (
                      <motion.button
                        key={opt.value}
                        initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                        animate={{ opacity: 1 }}
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

                {/* Q3 (values) is the only multi-select. Without this branch the
                    question renders its heading and nothing to choose from, so
                    the form dead-ends a quarter of the way through. */}
                {currentQ.type === "multi_select" && currentQ.options && (
                  <>
                    {currentQ.options.map((opt) => {
                      const selected =
                        (formState[currentQ.id as keyof FormState] as string[]) || [];
                      const isSelected = selected.includes(opt.value);
                      return (
                        <motion.button
                          key={opt.value}
                          type="button"
                          aria-pressed={isSelected}
                          initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() =>
                            handleAnswer(
                              currentQ.id,
                              isSelected
                                ? selected.filter((v) => v !== opt.value)
                                : [...selected, opt.value]
                            )
                          }
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            isSelected
                              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20"
                              : "border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600"
                          }`}
                        >
                          <span className="font-medium text-slate-900 dark:text-slate-50">
                            {opt.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </>
                )}

                {currentQ.type === "text_input" && (
                  <motion.input
                    initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    type="text"
                    placeholder={currentQ.placeholder}
                    value={(formState[currentQ.id as keyof FormState] as string) || ""}
                    onChange={(e) => handleAnswer(currentQ.id, e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  />
                )}

                {currentQ.type === "scale" && currentQ.labels && (
                  <div className="space-y-4 mt-6">
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
                  </div>
                )}
              </div>

              {/* Follow-up Question */}
              {showFollowUp && currentQ.followUp && (
                <motion.div
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-3">
                    {currentQ.followUp.question}
                  </h3>
                  {currentQ.followUp.type === "single_select" && currentQ.followUp.options && (
                    <div className="space-y-2">
                      {currentQ.followUp.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswer(`${currentQ.id}_followup`, opt.value)}
                          className="w-full text-left p-3 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                  {currentQ.followUp.type === "text_input" && (
                    <input
                      type="text"
                      placeholder="Your answer..."
                      onChange={(e) => handleAnswer(`${currentQ.id}_followup`, e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
                    />
                  )}
                </motion.div>
              )}

              {/* Error */}
              {error && (
                <motion.div
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {/* Navigation */}
              <div className="flex gap-3 pt-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={() => {
                      setCurrentQuestion((prev) => prev - 1);
                      setShowFollowUp(false);
                      setError(null);
                    }}
                    className="px-6 py-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-50 font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                  >
                    ← Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  disabled={!isCurrentQuestionAnswered() && !showFollowUp}
                  className="flex-1 px-6 py-3 rounded-lg bg-orange-600 dark:bg-orange-500 text-white font-medium hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-95"
                >
                  {currentQuestion === questions.length - 1 ? "See Your Match →" : "Next →"}
                </button>
              </div>
            </motion.div>
          ) : null}

          {/* Verification Stage */}
          {stage === "verification" && segment && (
            <motion.div
              key="verification"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
            >
              <VerificationStage
                segment={segment}
                formState={formState}
                onConfirm={() => setStage("email_capture")}
              />
            </motion.div>
          )}

          {/* Email capture — the only stage that actually submits */}
          {stage === "email_capture" && (
            <motion.div
              key="emailcapture"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
            >
              <EmailCaptureStage
                isLoading={isLoading}
                error={error}
                onSubmit={submitDiscovery}
              />
            </motion.div>
          )}

          {/* Thank You */}
          {stage === "thank_you" && (
            <motion.div
              key="thankyou"
              initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ThankYouStage email={formState.email} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS (Placeholder)
// ============================================================

function VerificationStage({
  segment,
  formState,
  onConfirm,
}: {
  segment: SegmentResult;
  formState: FormState;
  onConfirm: () => void;
}) {
  return (
    <div className="text-center">
      <p>Verification stage coming...</p>
      <button onClick={onConfirm} className="mt-4 px-6 py-3 bg-orange-600 text-white rounded">
        Continue
      </button>
    </div>
  );
}

function EmailCaptureStage({
  isLoading,
  error,
  onSubmit,
}: {
  isLoading: boolean;
  error: string | null;
  onSubmit: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const looksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (looksValid && !isLoading) onSubmit(email.trim());
      }}
      className="max-w-lg mx-auto text-center"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        Where should we send it?
      </h2>
      <p className="mt-3 text-slate-600 dark:text-slate-400">
        We'll email your breakdown — what you're building, where the gaps are,
        and what to do next.
      </p>

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        autoFocus
        autoComplete="email"
        disabled={isLoading}
        aria-label="Email address"
        aria-invalid={error ? true : undefined}
        className="mt-6 w-full px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-60"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!looksValid || isLoading}
        className="mt-4 w-full px-6 py-3 bg-cyan-600 text-white font-medium rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? "Sending…" : "Send me my breakdown"}
      </button>

      <p className="mt-4 text-xs text-slate-500 dark:text-slate-500">
        Three emails about your results. No list, no reselling your address.
      </p>
    </form>
  );
}

function ThankYouStage({ email }: { email?: string }) {
  // Deliberately says "on its way" rather than "sent": the answers are saved
  // before the email is attempted, so this screen can be reached while Resend
  // is failing. Promising a delivery we cannot confirm would be a lie the
  // founder discovers by waiting on an empty inbox.
  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
        That's it — your answers are in.
      </h2>
      <p className="mt-4 text-slate-600 dark:text-slate-400">
        Your breakdown is on its way to{" "}
        <span className="font-medium text-slate-900 dark:text-slate-100">{email}</span>.
        Two more follow — one tomorrow, one in three days.
      </p>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-500">
        Nothing in a few minutes? Check spam before assuming it's lost.
      </p>
    </div>
  );
}
