/**
 * Discovery Form Component
 *
 * Interactive questionnaire that:
 * 1. Asks 10 founder questions (Foundation, Business Model, Gaps)
 * 2. Captures answers in real-time
 * 3. Calculates segment at the end
 * 4. Shows personalized program recommendation
 * 5. Collects email for follow-up
 * 6. Sends data to Supabase
 *
 * Design Configuration:
 * - DESIGN_VARIANCE: 6 (structured, clean asymmetry with progress bar)
 * - MOTION_INTENSITY: 6 (smooth transitions, stagger-reveal on stage changes)
 * - VISUAL_DENSITY: 3 (airy, one-question focus, generous breathing room)
 *
 * Flow: Questions → Segment Reveal → Email Capture → Thank You
 *
 * Accessibility: Honors prefers-reduced-motion. Dark mode supported.
 * Typography: Uses Geist sans-serif (see layout.tsx for font import).
 * Radius: Consistent 8px (md) for cards, 6px (sm) for inputs, full for buttons.
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { DiscoveryAnswers, SegmentResult, calculateSegment } from "../data/segmentLogic";
import { getProgramBySegment } from "../data/programDefinitions";

// ============================================================
// TYPES
// ============================================================

type FormStage = "questions" | "result" | "email_capture" | "thank_you";

interface FormState extends Partial<DiscoveryAnswers> {
  email?: string;
}

// ============================================================
// MOTION VARIANTS (with prefers-reduced-motion support)
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

// ============================================================
// MAIN COMPONENT
// ============================================================

export function DiscoveryForm() {
  const [formState, setFormState] = useState<FormState>({});
  const [stage, setStage] = useState<FormStage>("questions");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [segment, setSegment] = useState<SegmentResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Accessibility: Honor prefers-reduced-motion
  const reduce = useReducedMotion();

  const questions = [
    // ============================================================
    // FOUNDATION QUESTIONS (Q1-Q7)
    // ============================================================
    {
      id: "q1_brings_you",
      section: "Foundation",
      question: "What brings you here today?",
      subtitle: "Where are you in your journey?",
      type: "single_select" as const,
      options: [
        { value: "starting", label: "Starting from scratch" },
        { value: "building", label: "Building something early" },
        { value: "scaling", label: "Scaling an existing business" },
        { value: "team", label: "Building a team" },
        { value: "confused", label: "I'm honestly confused about my path" },
      ],
    },
    {
      id: "q2_vision",
      section: "Foundation",
      question: "What are you building toward?",
      subtitle: "Paint a picture of your vision in 1-2 sentences",
      type: "text_input" as const,
      placeholder: "Example: A premium interior design studio that serves high-net-worth clients...",
    },
    {
      id: "q3_values",
      section: "Foundation",
      question: "What matters most to you?",
      subtitle: "Pick the 1-3 values that guide your decisions",
      type: "multi_select" as const,
      options: [
        { value: "Impact", label: "Impact: Making a real difference" },
        { value: "Excellence", label: "Excellence: Obsessive quality" },
        { value: "Speed", label: "Speed: Move fast, iterate" },
        { value: "Quality", label: "Quality: Craftsmanship over volume" },
        { value: "Premium", label: "Premium: Serving the best customers" },
        { value: "Mission", label: "Mission: Solving a specific problem" },
        { value: "Freedom", label: "Freedom: Control my time & choices" },
        { value: "Growth", label: "Growth: Continuous improvement" },
      ],
    },
    {
      id: "q4_expertise",
      section: "Foundation",
      question: "How would you rate your expertise in your domain?",
      subtitle: "This is core to what you're building",
      type: "scale" as const,
      labels: ["Beginner", "Some experience", "Competent", "Expert", "Master"],
      scaleType: "expertise",
    },
    {
      id: "q4_management",
      section: "Foundation",
      question: "How would you rate your ability to manage a team?",
      subtitle: "Can you lead, delegate, and build a team around you?",
      type: "scale" as const,
      labels: ["Never managed", "Managed 1-2 people", "Led a small team (3-5)", "Led a team (6-10)", "Built a large team (10+)"],
      scaleType: "management",
    },
    {
      id: "q4_leadership",
      section: "Foundation",
      question: "How would you rate your leadership capabilities?",
      subtitle: "Can you inspire, make tough calls, and drive vision?",
      type: "scale" as const,
      labels: ["Still learning", "Growing", "Solid", "Strong", "Exceptional"],
      scaleType: "leadership",
    },
    {
      id: "q5_pressure",
      section: "Foundation",
      question: "What's your relationship with work pressure?",
      subtitle: "Be honest—this shapes what model fits you",
      type: "single_select" as const,
      options: [
        { value: "balance", label: "I want balance and sustainability" },
        {
          value: "real_but_bounded",
          label: "I can push hard, but with limits (40-50 hrs/week)",
        },
        {
          value: "80_hours",
          label: "I'm ready to go all-in (60-80+ hrs/week for growth)",
        },
        { value: "mission", label: "Mission comes first, personal comfort second" },
      ],
    },
    // ============================================================
    // BUSINESS MODEL QUESTIONS (Q8-Q10)
    // ============================================================
    {
      id: "q6_scale",
      section: "Business Model",
      question: "What's your geographic ambition?",
      subtitle: "Where do you want your customers to be?",
      type: "single_select" as const,
      options: [
        { value: "local", label: "Local (my city/region)" },
        { value: "national", label: "National (my country)" },
        { value: "international", label: "International (global)" },
      ],
    },
    {
      id: "q7_revenue",
      section: "Business Model",
      question: "How do you plan to make money?",
      subtitle: "Pick the revenue model that fits your vision",
      type: "single_select" as const,
      options: [
        { value: "project", label: "Project-based (one-time fees)" },
        { value: "subscription", label: "Subscription (recurring)" },
        { value: "transaction", label: "Transaction-based (per sale)" },
        { value: "upfront", label: "Upfront/retainer-based" },
        { value: "unsure", label: "I'm not sure yet" },
      ],
    },
    {
      id: "q8_advantage",
      section: "Business Model",
      question: "What's your unfair advantage?",
      subtitle: "Why would customers choose you over alternatives?",
      type: "text_input" as const,
      placeholder: "Example: Unique access to suppliers, proprietary process, deep relationships in industry...",
    },
    // ============================================================
    // GAPS QUESTIONS (Q11-Q12)
    // ============================================================
    {
      id: "q9_challenge",
      section: "Gaps",
      question: "What's your biggest challenge right now?",
      subtitle: "What's keeping you up at night?",
      type: "single_select" as const,
      options: [
        { value: "customers", label: "Finding and keeping customers" },
        { value: "team", label: "Building the right team" },
        { value: "model", label: "Figuring out the business model" },
        { value: "scaling", label: "Scaling without losing control" },
        { value: "corporate_access", label: "Getting corporate/high-value customers" },
        { value: "cash", label: "Managing cash flow" },
        { value: "motivation", label: "Staying motivated & focused" },
      ],
    },
    {
      id: "q10_priority",
      section: "Gaps",
      question: "What would most improve your situation in 90 days?",
      subtitle: "What's the one thing that would make the biggest difference?",
      type: "text_input" as const,
      placeholder: "Example: Launching to 5 enterprise customers, hiring my first developer, proving product-market fit...",
    },
  ];

  // ============================================================
  // HANDLERS
  // ============================================================

  const handleAnswer = (questionId: string, value: any) => {
    setFormState((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleAddValue = (questionId: string, value: string) => {
    const current = formState[questionId as keyof FormState] as string[] || [];
    setFormState((prev) => ({
      ...prev,
      [questionId]: [...current, value],
    }));
  };

  const handleRemoveValue = (questionId: string, value: string) => {
    const current = formState[questionId as keyof FormState] as string[] || [];
    setFormState((prev) => ({
      ...prev,
      [questionId]: current.filter((v: string) => v !== value),
    }));
  };

  const isCurrentQuestionAnswered = () => {
    const q = questions[currentQuestion];
    const answer = formState[q.id as keyof FormState];

    if (q.type === "multi_select") {
      return Array.isArray(answer) && answer.length > 0;
    }
    return answer !== undefined && answer !== "";
  };

  const handleNext = () => {
    if (!isCurrentQuestionAnswered()) {
      setError("Please answer this question before continuing");
      return;
    }
    setError(null);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      // All questions answered, calculate segment
      handleCalculateSegment();
    }
  };

  const handleCalculateSegment = () => {
    setIsLoading(true);
    // Simulate API delay
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
    }, 500);
  };

  const handleProceedToEmail = () => {
    setStage("email_capture");
  };

  const handleSubmitEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const { submitDiscoveryForm } = await import("../lib/api-client");
      const response = await submitDiscoveryForm({
        answers: formState as DiscoveryAnswers,
        email,
      });

      if (!response.success) {
        setError(response.error || "Failed to submit. Please try again.");
        setIsLoading(false);
        return;
      }

      setFormState((prev) => ({ ...prev, email }));
      setStage("thank_you");
      setIsLoading(false);
    } catch (err) {
      setError("Failed to submit. Please try again.");
      setIsLoading(false);
    }
  };

  // ============================================================
  // RENDER STAGES
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? {} : { duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Founder Discovery
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Let's find the right program for your business
          </p>
        </motion.div>

        {/* Questions Stage */}
        <AnimatePresence mode="wait">
          {stage === "questions" && (
            <QuestionStage
              questions={questions}
              currentQuestion={currentQuestion}
              formState={formState}
              onAnswer={handleAnswer}
              onAddValue={handleAddValue}
              onRemoveValue={handleRemoveValue}
              onNext={handleNext}
              onPrevious={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
              isAnswered={isCurrentQuestionAnswered()}
              error={error}
              isLoading={isLoading}
              reduce={reduce}
            />
          )}

          {stage === "result" && segment && (
            <ResultStage
              segment={segment}
              onProceed={handleProceedToEmail}
              reduce={reduce}
            />
          )}

          {stage === "email_capture" && segment && (
            <EmailCaptureStage
              program={segment.program}
              onSubmit={handleSubmitEmail}
              isLoading={isLoading}
              error={error}
              reduce={reduce}
            />
          )}

          {stage === "thank_you" && segment && (
            <ThankYouStage
              segment={segment}
              email={formState.email}
              reduce={reduce}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================
// QUESTION STAGE
// ============================================================

interface QuestionStageProps {
  questions: any[];
  currentQuestion: number;
  formState: FormState;
  onAnswer: (id: string, value: any) => void;
  onAddValue: (id: string, value: string) => void;
  onRemoveValue: (id: string, value: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  isAnswered: boolean;
  error: string | null;
  isLoading: boolean;
  reduce: boolean;
}

function QuestionStage({
  questions,
  currentQuestion,
  formState,
  onAnswer,
  onAddValue,
  onRemoveValue,
  onNext,
  onPrevious,
  isAnswered,
  error,
  isLoading,
}: QuestionStageProps) {
  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = formState[q.id as keyof FormState];

  return (
    <motion.div
      key={`question-${currentQuestion}`}
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
      transition={reduce ? {} : { duration: 0.3 }}
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400 mb-2">
          <span>{q.section}</span>
          <span>{currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-cyan-500 dark:bg-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={reduce ? {} : { duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition-colors">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
          {q.question}
        </h2>
        {q.subtitle && (
          <p className="text-slate-600 dark:text-slate-400 mb-6">{q.subtitle}</p>
        )}

        {/* Answer Options by Type */}
        <div className="space-y-3">
          {q.type === "single_select" && (
            <SingleSelect
              options={q.options}
              value={currentAnswer}
              onChange={(value) => onAnswer(q.id, value)}
            />
          )}

          {q.type === "multi_select" && (
            <MultiSelect
              options={q.options}
              values={currentAnswer || []}
              onAdd={(value) => onAddValue(q.id, value)}
              onRemove={(value) => onRemoveValue(q.id, value)}
            />
          )}

          {q.type === "text_input" && (
            <TextInput
              value={currentAnswer || ""}
              placeholder={q.placeholder}
              onChange={(value) => onAnswer(q.id, value)}
            />
          )}

          {q.type === "scale" && (
            <Scale
              value={currentAnswer || 0}
              labels={q.labels}
              onChange={(value) => onAnswer(q.id, value)}
            />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={reduce ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-sm rounded-md transition-colors"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 rounded-md text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isAnswered || isLoading}
          className="flex-1 px-6 py-3 rounded-md bg-cyan-600 dark:bg-cyan-500 text-white font-semibold hover:bg-cyan-700 dark:hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
        >
          {isLoading ? "Loading..." : currentQuestion === questions.length - 1 ? "See My Program" : "Next"}
        </button>
      </div>
    </motion.div>
  );
}

// ============================================================
// RESULT STAGE
// ============================================================

interface ResultStageProps {
  segment: SegmentResult;
  onProceed: () => void;
  reduce: boolean;
}

function ResultStage({ segment, onProceed, reduce }: ResultStageProps) {
  const program = getProgramBySegment(segment.segment);

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
      transition={reduce ? {} : { duration: 0.4 }}
    >
      {/* Celebration */}
      <div className="text-center mb-10">
        <motion.div
          animate={reduce ? {} : { scale: [1, 1.1, 1] }}
          transition={reduce ? {} : { duration: 0.6, delay: 0.2 }}
          className="text-6xl mb-4"
        >
          🎯
        </motion.div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Found Your Match
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Based on your answers, here's your ideal program
        </p>
      </div>

      {/* Program Card */}
      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700 mb-8 space-y-6 transition-colors">
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-700 pb-6">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            {segment.program}
          </h3>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            For {segment.segment.replace(/_/g, " ")} founders
          </p>
        </div>

        {/* Description */}
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Why this fits you</h4>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {segment.emailPersonalization.programFit}
          </p>
        </div>

        {/* Your Challenge */}
        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md transition-colors">
          <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Your challenge</h4>
          <p className="text-slate-700 dark:text-slate-300">
            {segment.emailPersonalization.problemStatement}
          </p>
        </div>

        {/* Capability Gap (if any) */}
        {segment.capabilityGap && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 p-4 rounded-md transition-colors">
            <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">⚠️ Growth area</h4>
            <p className="text-amber-800 dark:text-amber-300 text-sm">
              {segment.capabilityGap}
            </p>
          </div>
        )}

        {/* Program Overview */}
        {program && (
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Program structure</h4>
              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                <div>
                  <span className="font-medium text-slate-900 dark:text-slate-50">1. Consultation</span>
                  <p>{program.consultation.duration} discovery session</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900 dark:text-slate-50">2. Paid Program</span>
                  <p>₦{program.paidProgram.price.min.toLocaleString()} - ₦{program.paidProgram.price.max.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-slate-900 dark:text-slate-50">3. Scale Up</span>
                  <p>Done with You or Done for You services</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={onProceed}
        className="w-full px-6 py-4 rounded-md bg-orange-600 dark:bg-orange-500 text-white font-semibold hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors text-lg active:scale-[0.98]"
      >
        {segment.emailPersonalization.callToAction}
      </button>
    </motion.div>
  );
}

// ============================================================
// EMAIL CAPTURE STAGE
// ============================================================

interface EmailCaptureStageProps {
  program: string;
  onSubmit: (email: string) => void;
  isLoading: boolean;
  error: string | null;
  reduce: boolean;
}

function EmailCaptureStage({
  program,
  onSubmit,
  isLoading,
  error,
  reduce,
}: EmailCaptureStageProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      onSubmit(email);
    }
  };

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? { opacity: 1 } : { opacity: 0, y: -20 }}
      transition={reduce ? {} : { duration: 0.4 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Let's get started
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Enter your email and we'll send you details about the {program}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent transition-colors"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 text-sm rounded-md transition-colors">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!email || !email.includes("@") || isLoading}
            className="w-full px-6 py-3 rounded-md bg-orange-600 dark:bg-orange-500 text-white font-semibold hover:bg-orange-700 dark:hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors active:scale-[0.98]"
          >
            {isLoading ? "Sending..." : "Get Your Program Details"}
          </button>
        </form>

        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-4 transition-colors">
          We'll send you an email with your personalized program roadmap and next steps.
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// THANK YOU STAGE
// ============================================================

interface ThankYouStageProps {
  segment: SegmentResult;
  email?: string;
  reduce: boolean;
}

function ThankYouStage({ segment, email, reduce }: ThankYouStageProps) {
  const program = getProgramBySegment(segment.segment);

  return (
    <motion.div
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={reduce ? {} : { duration: 0.5 }}
    >
      <div className="bg-white dark:bg-slate-900 rounded-lg p-8 shadow-sm border border-slate-200 dark:border-slate-700 text-center space-y-6 transition-colors">
        <motion.div
          animate={reduce ? {} : { rotate: 360 }}
          transition={reduce ? {} : { duration: 0.6 }}
          className="text-6xl mx-auto"
        >
          ✅
        </motion.div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            You're all set!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Check your email at <span className="font-medium text-slate-900 dark:text-slate-300">{email}</span>
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg space-y-3 transition-colors">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">What happens next:</h3>
          <ol className="text-sm text-slate-700 dark:text-slate-300 space-y-2 text-left">
            <li>
              <span className="font-medium">1. Email 1 (Today):</span> Your personalized discovery summary
            </li>
            <li>
              <span className="font-medium">2. Email 2 (Tomorrow):</span> Deep dive into the {segment.program}
            </li>
            <li>
              <span className="font-medium">3. Email 3 (Day 3):</span> Apply for the program or book a free consultation
            </li>
          </ol>
        </div>

        {program && (
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
              Ready to jump in? Book a consultation now:
            </p>
            <a
              href="#"
              className="inline-block px-6 py-3 bg-orange-600 dark:bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors active:scale-[0.98]"
            >
              Schedule Consultation
            </a>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
          Questions? Reply to any of our emails or visit our FAQ
        </p>
      </div>
    </motion.div>
  );
}

// ============================================================
// ANSWER COMPONENTS
// ============================================================

function SingleSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string | undefined;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => (
        <motion.button
          key={option.value}
          onClick={() => onChange(option.value)}
          whileHover={{ x: 4 }}
          className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all active:scale-[0.98] ${
            value === option.value
              ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-slate-900 dark:text-slate-50 font-medium"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300"
          }`}
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );
}

function MultiSelect({
  options,
  values,
  onAdd,
  onRemove,
}: {
  options: { value: string; label: string }[];
  values: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const maxSelections = 3;
  const canAdd = values.length < maxSelections;

  return (
    <div className="space-y-3">
      {options.map((option) => {
        const isSelected = values.includes(option.value);
        return (
          <motion.button
            key={option.value}
            onClick={() =>
              isSelected ? onRemove(option.value) : canAdd && onAdd(option.value)
            }
            whileHover={{ x: 4 }}
            disabled={!isSelected && !canAdd}
            className={`w-full text-left px-4 py-3 rounded-md border-2 transition-all active:scale-[0.98] ${
              isSelected
                ? "border-cyan-500 bg-cyan-50 dark:bg-cyan-950 text-slate-900 dark:text-slate-50 font-medium"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected
                    ? "border-cyan-500 bg-cyan-500 dark:border-cyan-400 dark:bg-cyan-400"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {isSelected && <span className="text-white dark:text-slate-900 text-sm">✓</span>}
              </span>
              {option.label}
            </span>
          </motion.button>
        );
      })}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 transition-colors">
        Select up to 3 values
      </p>
    </div>
  );
}

function TextInput({
  value,
  placeholder,
  onChange,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={4}
      className="w-full px-4 py-3 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-transparent resize-none transition-colors"
    />
  );
}

function Scale({
  value,
  labels,
  onChange,
}: {
  value: number;
  labels: string[];
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {labels.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => onChange(index + 1)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex-1 py-3 rounded-md font-semibold transition-all ${
              value === index + 1
                ? "bg-cyan-600 dark:bg-cyan-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
          >
            {index + 1}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <span>{labels[0]}</span>
        <span>{labels[labels.length - 1]}</span>
      </div>
    </div>
  );
}
