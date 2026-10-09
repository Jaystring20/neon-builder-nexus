/**
 * The discovery questions.
 *
 * Ids and option values are the contract with segmentLogic.ts, the API and the
 * three emails: change the wording freely, never the ids or values.
 */

export type QuestionType = "single_select" | "multi_select" | "text_input" | "scale";

export interface Option {
  value: string;
  label: string;
}

export interface DiscoveryQuestion {
  id: string;
  section: "Foundation" | "Capabilities" | "Constraints" | "Model" | "Reality check";
  question: string;
  subtitle?: string;
  type: QuestionType;
  options?: Option[];
  /** Scale questions: one label per point, 1 to 5. */
  labels?: string[];
  placeholder?: string;
  /** Multi-select ceiling. */
  max?: number;
  /** Optional extra question shown under the answer when this returns true. */
  followUpTrigger?: (answer: unknown) => boolean;
  followUp?: {
    question: string;
    type: "single_select" | "text_input";
    options?: Option[];
    placeholder?: string;
  };
  getInsight?: (answer: unknown) => string;
}

export const questions: DiscoveryQuestion[] = [
  {
    id: "q1_brings_you",
    section: "Foundation",
    question: "Where are you right now?",
    subtitle: "Pick the stage that sounds most like today.",
    type: "single_select",
    options: [
      { value: "starting", label: "Starting from scratch" },
      { value: "building", label: "Building early, still finding fit" },
      { value: "scaling", label: "Scaling: it works and it's growing" },
      { value: "team", label: "Building a team, hiring" },
      { value: "confused", label: "Honestly, I'm not sure where I am" },
    ],
    followUpTrigger: (answer) => answer === "confused",
    followUp: {
      question: "What feels unclear?",
      type: "text_input",
      placeholder: "A sentence is enough",
    },
    getInsight: (answer) =>
      ({
        starting: "Starting gives you freedom. You can shape the model on purpose.",
        building: "This is the hardest phase. Decisions now ripple for years.",
        scaling: "Your model works. Now it's about systems and team.",
        team: "Building a team changes the job. It takes different skills.",
        confused: "That's more common than people admit. The next questions will help.",
      })[answer as string] ?? "",
  },
  {
    id: "q2_vision",
    section: "Foundation",
    question: "What are you building?",
    subtitle: "One or two sentences.",
    type: "text_input",
    placeholder: "A premium interior design studio for busy professionals",
    getInsight: (answer) =>
      String(answer ?? "").trim().length < 20
        ? "A little more helps: what problem does it solve, and for whom?"
        : "Good. Everything else builds on this.",
  },
  {
    id: "q3_values",
    section: "Foundation",
    question: "What matters most to you?",
    subtitle: "Pick up to three.",
    type: "multi_select",
    max: 3,
    options: [
      { value: "Impact", label: "Impact: making a real difference" },
      { value: "Quality", label: "Quality: getting it exactly right" },
      { value: "Growth", label: "Growth: more reach, more revenue" },
      { value: "Freedom", label: "Freedom: control over my time" },
      { value: "Money", label: "Money: strong profit" },
      { value: "Speed", label: "Speed: moving fast" },
      { value: "Sustainability", label: "Sustainability: built to last" },
    ],
    getInsight: (answer) => {
      const a = (answer as string[]) ?? [];
      if (a.includes("Growth") && a.includes("Freedom"))
        return "Growth and freedom pull against each other. Scaling usually costs some control.";
      if (a.includes("Impact")) return "Impact needs a money plan too. The two work together.";
      return "These are what you'll protect when trade-offs come.";
    },
  },
  {
    id: "q4_expertise",
    section: "Capabilities",
    question: "How deep is your expertise in this field?",
    type: "scale",
    labels: ["Beginner", "Some", "Good", "Strong", "Expert"],
    getInsight: (answer) => {
      const n = Number(answer);
      if (n <= 1) return "Learning as you go works for some models, not all.";
      if (n <= 2) return "The basics are there. Growth depends on going deeper.";
      return "Real expertise. The question is whether you protect it or scale it.";
    },
  },
  {
    id: "q4_management",
    section: "Capabilities",
    question: "How much have you led a team?",
    type: "scale",
    labels: ["Never", "Once", "A few times", "Often", "Built a culture"],
    followUpTrigger: (answer) => Number(answer) >= 2,
    followUp: {
      question: "Do you want a bigger team?",
      type: "single_select",
      options: [
        { value: "solo", label: "No, I'll keep it solo or small" },
        { value: "scale", label: "Yes, I want to scale with a team" },
        { value: "unsure", label: "Not sure yet" },
      ],
    },
  },
  {
    id: "q4_leadership",
    section: "Capabilities",
    question: "How confident are you making hard calls?",
    subtitle: "Deciding under pressure and bringing people with you.",
    type: "scale",
    labels: ["Developing", "Growing", "Solid", "Strong", "Exceptional"],
  },
  {
    id: "q5_pressure",
    section: "Constraints",
    question: "How much can you give right now?",
    subtitle: "Be honest. There's no wrong answer.",
    type: "single_select",
    options: [
      { value: "balance", label: "I want balance and a sustainable pace" },
      { value: "real_but_bounded", label: "I can push hard, within limits (40 to 50 hours a week)" },
      { value: "80_hours", label: "I'm all in (60 hours a week or more)" },
      { value: "mission", label: "It depends on the season" },
    ],
    getInsight: (answer) =>
      ({
        balance: "Some models support balance; others don't. We'll factor it in.",
        real_but_bounded: "Realistic. A lot gets done in those hours.",
        "80_hours": "Normal early on. Not sustainable forever.",
        mission: "Flexibility is an advantage.",
      })[answer as string] ?? "",
  },
  {
    id: "q6_scale",
    section: "Model",
    question: "Where are your customers?",
    type: "single_select",
    options: [
      { value: "local", label: "Local: my city or region" },
      { value: "national", label: "National" },
      { value: "international", label: "International" },
    ],
    getInsight: (answer) =>
      ({
        local: "Local suits premium and professional services well.",
        national: "National reach needs systems and repeatable delivery.",
        international: "International means building for scale from day one.",
      })[answer as string] ?? "",
  },
  {
    id: "q7_revenue",
    section: "Model",
    question: "How do you make money?",
    type: "single_select",
    options: [
      { value: "project", label: "Projects or one-time fees" },
      { value: "subscription", label: "Subscriptions or retainers" },
      { value: "transaction", label: "Per sale or commission" },
      { value: "upfront", label: "An upfront fee, then ongoing" },
      { value: "unsure", label: "Not sure yet" },
    ],
    getInsight: (answer) =>
      ({
        project: "Project revenue grows with hours and projects, so it has a ceiling.",
        subscription: "Recurring revenue compounds, if you keep the customers you win.",
        transaction: "Per-sale models live on volume and margins.",
        upfront: "Upfront fees fund the work. Ongoing fees build the relationship.",
        unsure: "That's one of the first things worth fixing.",
      })[answer as string] ?? "",
  },
  {
    id: "q8_advantage",
    section: "Model",
    question: "Why would customers choose you?",
    subtitle: "Your edge over the alternatives.",
    type: "text_input",
    placeholder: "Deep relationships in my industry, a better process, the best quality in my niche",
  },
  {
    id: "q9_challenge",
    section: "Reality check",
    question: "What's holding you back most?",
    type: "single_select",
    options: [
      { value: "customers", label: "Getting customers and sales" },
      { value: "team", label: "Building the right team" },
      { value: "model", label: "Clarity on the business model" },
      { value: "scaling", label: "Growing without things breaking" },
      { value: "corporate_access", label: "Reaching the right customers" },
      { value: "cash", label: "Cash or funding" },
      { value: "motivation", label: "Motivation or belief" },
    ],
  },
  {
    id: "q10_priority",
    section: "Reality check",
    question: "What would a win look like in 90 days?",
    subtitle: "The one result that would change your trajectory.",
    type: "text_input",
    placeholder: "Land five new clients, launch the platform, hire my first team member",
  },
];

/** The wording a visitor actually saw for a stored answer. */
export function labelFor(questionId: string, value: unknown): string | null {
  const q = questions.find((x) => x.id === questionId);
  const opt = q?.options?.find((o) => o.value === value);
  if (opt) return opt.label;
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
