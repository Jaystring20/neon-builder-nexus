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
    id: "q1_current_situation",
    section: "Foundation",
    question: "What's your current situation?",
    subtitle: "Where are you right now with your business?",
    type: "single_select",
    options: [
      { value: "idea", label: "Just have an idea / concept stage" },
      { value: "building_v1", label: "Building the first version / MVP" },
      { value: "early_revenue", label: "Got early customers / revenue starting" },
      { value: "steady", label: "Growing steadily / established revenue" },
      { value: "scaling", label: "Scaling fast / raising capital" },
      { value: "plateau", label: "Plateaued / hitting a ceiling" },
      { value: "unsure", label: "Not sure where I am" },
    ],
    followUpTrigger: (answer) => answer === "plateau" || answer === "unsure",
    followUp: {
      question: "Tell us more about your situation:",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        idea: "You have room to shape your model deliberately. Most founders don't have that advantage.",
        building_v1: "This is when foundational decisions matter most. Revenue model, positioning, and team structure start NOW.",
        early_revenue: "You've proven traction. Now the question is: what's the sustainable model?",
        steady: "Steady revenue is stable. The question is: do you want to scale this, or is this the goal?",
        scaling: "Fast scaling requires different skills than getting to this point. Team, systems, and unit economics become critical.",
        plateau: "Hitting a ceiling is usually a model signal, not an execution signal. Which ceiling: revenue per customer, hours capacity, team leverage?",
        unsure: "Not knowing where you are usually means your model isn't clear yet. That's actually the conversation we need to have.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q2_core_business",
    section: "Foundation",
    question: "How would you describe your core business?",
    subtitle: "What do you actually do?",
    type: "single_select",
    options: [
      { value: "solve_problem", label: "Solving a specific problem for customers" },
      { value: "provide_service", label: "Providing a service or skill they need" },
      { value: "sell_product", label: "Selling a product/software they want" },
      { value: "create_impact", label: "Creating social or environmental impact" },
      { value: "hybrid", label: "Combination of above" },
      { value: "unsure", label: "Not sure how to describe it" },
    ],
    followUpTrigger: (answer) => answer === "hybrid" || answer === "unsure",
    followUp: {
      question: "Describe your business model more:",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        solve_problem: "Problem-solving businesses scale by reaching more people with the solution.",
        provide_service: "Service businesses scale by leverage: productizing, systemizing, or building a team.",
        sell_product: "Product businesses scale by improving unit economics and distribution.",
        create_impact: "Impact businesses need a sustainable revenue model. Impact + money is the real conversation.",
        hybrid: "Hybrid models are real, but they require clarity on which is primary and which is secondary.",
        unsure: "Not knowing how to describe your business usually means it's not yet defined. That's the work ahead.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q3_values",
    section: "Foundation",
    question: "What actually drives your decisions?",
    subtitle: "What matters most when you choose what to do next?",
    type: "multi_select",
    options: [
      { value: "impact", label: "Impact: Making real difference" },
      { value: "growth", label: "Growth: Expanding reach or revenue" },
      { value: "quality", label: "Quality: Obsessive excellence" },
      { value: "freedom", label: "Freedom: Autonomy and control" },
      { value: "profitability", label: "Profitability: Making money" },
      { value: "speed", label: "Speed: Move fast, iterate" },
      { value: "sustainability", label: "Sustainability: Long-term viability" },
    ],
    followUpTrigger: (answer) => {
      // If they select conflicting values
      const hasGrowth = answer?.includes("growth");
      const hasFreedom = answer?.includes("freedom");
      return (hasGrowth && hasFreedom) || answer?.length === 0;
    },
    followUp: {
      question: "When your values conflict (e.g., growth vs. freedom), which usually wins?",
      type: "text_input",
    },
    getInsight: (answer: string[]) => {
      if (answer?.includes("impact")) {
        return "Impact-driven founders often struggle with the money conversation. Impact + sustainable revenue is the real model.";
      }
      if (answer?.includes("growth") && answer?.includes("freedom")) {
        return "Growth and freedom can conflict. Venture scale requires team/capital; lifestyle scale means staying lean.";
      }
      if (answer?.includes("quality")) {
        return "Quality-focused businesses are usually premium positioned. The question is: are you protecting that positioning?";
      }
      return "Your values reveal your actual priorities. Everything flows from this.";
    },
  },

  {
    id: "q4_capabilities",
    section: "Capabilities",
    question: "How would you rate your expertise in your domain?",
    subtitle: "What's your actual domain knowledge?",
    type: "scale",
    labels: ["Beginner", "Some experience", "Competent", "Expert", "Master"],
    getInsight: (answer: number) => {
      if (answer <= 2) return "You're learning as you go. That's fine for some models (startup, developing product), risky for others (professional service).";
      if (answer === 3) return "Competent is the minimum for most models. Growth depends on leveraging this competence.";
      if (answer >= 4) return "Domain expertise is valuable. The question is: are you protecting it (premium) or scaling it (product/team)?";
      return "";
    },
  },

  {
    id: "q4_management",
    section: "Capabilities",
    question: "How would you rate your ability to manage a team?",
    subtitle: "Can you lead, delegate, and build culture?",
    type: "scale",
    labels: ["Never managed", "Managed 1-2", "Led small team", "Led larger team", "Built culture"],
    followUpTrigger: (answer) => {
      // This matters for scaling decisions
      return true; // Always follow up
    },
    followUp: {
      question: "Do you want to build a team, or would you prefer to stay solo/small?",
      type: "single_select",
      options: [
        { value: "solo", label: "Solo/small team is my end goal" },
        { value: "scale", label: "I want to build a significant team" },
        { value: "unsure", label: "I'm not sure yet" },
      ],
    },
    getInsight: (answer: number) => {
      if (answer <= 1) return "You're not a natural team builder (yet). That's fine if solo/small is your goal, but it limits scaling.";
      if (answer === 2) return "You've managed before. Scaling depends on whether you want to do it again.";
      if (answer >= 3) return "Team building is a skill you have. The question is: do you want to scale this?";
      return "";
    },
  },

  {
    id: "q4_leadership",
    section: "Capabilities",
    question: "How would you rate your leadership capabilities?",
    subtitle: "Can you make hard calls and inspire confidence?",
    type: "scale",
    labels: ["Still learning", "Growing", "Solid", "Strong", "Exceptional"],
  },

  {
    id: "q5_lifestyle",
    section: "Constraints",
    question: "What's your actual work capacity right now?",
    subtitle: "How much can you work without burning out?",
    type: "single_select",
    options: [
      { value: "part_time", label: "Part-time / side project" },
      { value: "full_time", label: "Full-time, but need balance (40-50 hrs/week)" },
      { value: "all_in", label: "All-in, high intensity (60-80+ hrs/week)" },
      { value: "variable", label: "Varies by season / project" },
    ],
    followUpTrigger: (answer) => answer === "variable" || answer === "part_time",
    followUp: {
      question: "Tell us about your actual situation:",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        part_time: "Part-time is fine for some models (side projects, long-term builds), but ventures need full-time commitment.",
        full_time: "Full-time with balance is achievable. The model matters: professional service, premium MSME, or productized offering work here.",
        all_in: "High intensity is normal for early-stage ventures and volume scaling. Unsustainable long-term unless something changes.",
        variable: "Variable work means you're juggling. Either commit to one thing, or build a model that works part-time.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q6_ambition_scale",
    section: "Model",
    question: "What's your actual geographic ambition?",
    subtitle: "Where do you want your customers?",
    type: "single_select",
    options: [
      { value: "local", label: "Local (my city/region)" },
      { value: "national", label: "National (my country)" },
      { value: "international", label: "International (global)" },
      { value: "not_sure", label: "Not sure yet" },
    ],
    followUpTrigger: (answer) => answer === "not_sure",
    followUp: {
      question: "What's holding you back from deciding?",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        local: "Local is strong for premium positioning (relationships matter) and professional services.",
        national: "National requires systems and scalable model. Can work for product, MSME volume, or productized service.",
        international: "International is venture-scale thinking. Requires international market fit and capital.",
        not_sure: "Not knowing your geographic ambition usually means your model isn't clear yet.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q7_revenue_model",
    section: "Model",
    question: "How do you make money (or plan to)?",
    subtitle: "What's your revenue model?",
    type: "single_select",
    options: [
      { value: "one_time", label: "One-time fees per project/transaction" },
      { value: "recurring", label: "Recurring subscription/retainer" },
      { value: "hybrid", label: "Both one-time and recurring" },
      { value: "licensed", label: "Licensing/royalties/affiliate" },
      { value: "donations", label: "Donations/grants (for impact work)" },
      { value: "product_plus_service", label: "Product + service combination" },
      { value: "unsure", label: "Not sure yet" },
    ],
    followUpTrigger: (answer) => answer === "unsure" || answer === "hybrid",
    followUp: {
      question: "What's your concern or question about your revenue model?",
      type: "text_input",
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        one_time: "One-time revenue hits a ceiling: limited by hours (service) or market size (product). Scaling requires different model.",
        recurring: "Recurring revenue is powerful. Requires acquisition, retention, and unit economics clarity.",
        hybrid: "Hybrid models are real but require clarity on which is primary and which subsidizes.",
        licensed: "Licensing is leverage: you build once, get paid multiple times. Requires upfront work.",
        donations: "Donations work for impact organizations but need to be predictable (not one-time).",
        product_plus_service: "Product + service is tricky. Clarify: is service a stepping stone to product, or permanent part of model?",
        unsure: "Not knowing your revenue model is the #1 reason businesses plateau. This is the conversation.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q8_advantage",
    section: "Model",
    question: "Why would a customer choose you instead of an alternative?",
    subtitle: "What's your actual competitive advantage?",
    type: "single_select",
    options: [
      { value: "unique_access", label: "Unique access or relationships" },
      { value: "proprietary", label: "Proprietary process or IP" },
      { value: "expertise", label: "Domain expertise or credibility" },
      { value: "quality", label: "Superior quality" },
      { value: "price", label: "Better price" },
      { value: "speed", label: "Speed or responsiveness" },
      { value: "values", label: "Values or mission alignment" },
      { value: "not_sure", label: "Not sure I have one" },
    ],
    followUpTrigger: (answer) => answer === "not_sure" || answer === "price",
    followUp: {
      question: "If price: Do you have a cost advantage, or are you just undercutting?",
      type: "single_select",
      options: [
        { value: "cost_advantage", label: "I have a structural cost advantage" },
        { value: "undercutting", label: "I'm undercutting to compete" },
        { value: "not_sure", label: "Not sure" },
      ],
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        unique_access: "Unique access is a strong moat. Protect it.",
        proprietary: "Proprietary advantage requires investment to maintain and defend.",
        expertise: "Expertise is strong but erodes if you don't stay current or market it.",
        quality: "Quality is valuable if customers can see and pay for it. Otherwise it's invisible.",
        price: "Price is dangerous as a competitive advantage (race to the bottom). Usually signals you need a real moat.",
        speed: "Speed is competitive until competitors match it. What's underneath speed that they can't copy?",
        values: "Values-based advantage is real for impact/premium positioning. Protect it by staying aligned.",
        not_sure: "Not having a clear advantage is a warning sign. This is the work you need to do.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q9_constraint",
    section: "Reality Check",
    question: "What's blocking growth or progress right now?",
    subtitle: "What's the actual bottleneck?",
    type: "single_select",
    options: [
      { value: "customer_acquisition", label: "Getting customers (not enough leads/sales)" },
      { value: "operations", label: "Operations/delivery (can't fulfill, scaling breaks)" },
      { value: "team", label: "Team/people (need to hire, or current team isn't right)" },
      { value: "product", label: "Product/offering (doesn't solve the problem right)" },
      { value: "model", label: "Business model (revenue model is broken or unclear)" },
      { value: "funding", label: "Funding/capital (ran out of money)" },
      { value: "clarity", label: "Clarity (I don't know what to focus on)" },
      { value: "none", label: "Nothing is really blocking us" },
      { value: "multiple", label: "Multiple things at once" },
    ],
    followUpTrigger: (answer) => answer !== "none",
    followUp: {
      question: "Is this the ROOT problem, or a symptom of something deeper?",
      type: "single_select",
      options: [
        { value: "root", label: "This IS the root problem" },
        { value: "symptom", label: "This is a symptom of a deeper issue" },
        { value: "unsure", label: "I'm not sure" },
      ],
    },
    getInsight: (answer: string) => {
      const insights: Record<string, string> = {
        customer_acquisition: "Customer acquisition is the lifeblood. Everything else is secondary.",
        operations: "Operations are breaking because the model is wrong or you're trying to scale too fast.",
        team: "Team issues usually hide model issues. Fix the model first; then hiring makes sense.",
        product: "Product issues are real, but sometimes they're actually market-fit issues.",
        model: "Business model problems don't fix themselves. This is the core conversation.",
        funding: "Money is usually a symptom (model isn't working, or you need to invest to scale).",
        clarity: "Lack of clarity kills businesses. Getting specific about your constraint is step 1.",
        none: "No blocking issues means you're either early or you've found product-market fit. Which is it?",
        multiple: "Multiple issues usually point to a core model problem. Get specific about priority.",
      };
      return insights[answer] || "";
    },
  },

  {
    id: "q10_priority",
    section: "Reality Check",
    question: "What would be a meaningful win in the next 90 days?",
    subtitle: "What's one thing that would actually change your trajectory?",
    type: "text_input",
    placeholder: "Landing 5 enterprise clients, proving product-market fit, building a content engine...",
    followUpTrigger: () => true,
    followUp: {
      question: "Is this realistic to achieve in 90 days?",
      type: "single_select",
      options: [
        { value: "yes", label: "Yes, absolutely achievable" },
        { value: "maybe", label: "Possible, but would need focused effort" },
        { value: "unlikely", label: "Unlikely in 90 days; more like 6-12 months" },
        { value: "unsure", label: "Not sure" },
      ],
    },
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

function ThankYouStage({ email }: { email?: string }) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Thank you!</h2>
      <p className="mt-4 text-slate-600">Email sent to {email}</p>
    </div>
  );
}
