/**
 * Discovery answers → the founder archetype.
 *
 * Grounded in the DCH company brief: five business archetypes, plus two
 * paths for visitors who aren't running a business model (schools and
 * individuals building a career).
 *
 * Scoring is by weight, not first-match rules. Every answer adds points to
 * the archetypes it is evidence for; the highest total wins, the runner-up is
 * reported when it is close, and the size of the lead sets the confidence.
 * No single answer can override the rest: valuing "Impact" makes a business
 * a little more Changemaker, it does not turn it into an NGO.
 *
 * The expected result for twenty realistic visitors is pinned in
 * scripts/diagnostic-check.ts (npm run check:diagnostic). Change a weight,
 * run it.
 */

export interface DiscoveryAnswers {
  q0_type?: string; // VisitorType, see discoveryQuestions.ts
  q1_brings_you?: string; // "starting" | "building" | "scaling" | "team" | "confused"
  q2_vision?: string; // free text
  q3_values?: string[]; // 1 to 3 values
  q4_expertise?: number; // 1-5
  q4_management?: number; // 1-5
  q4_leadership?: number; // 1-5
  q5_pressure?: string; // "balance" | "real_but_bounded" | "80_hours" | "mission"
  q6_scale?: string; // "local" | "national" | "international"
  q6_model?: string; // "quality" | "volume" | "product" | "expertise" | "cause"
  q7_revenue?: string; // "project" | "subscription" | "transaction" | "upfront" | "unsure"
  q8_advantage?: string; // free text
  q9_challenge?: string; // see discoveryQuestions.ts, per audience
  q10_priority?: string; // free text
}

export type BusinessSegment =
  | "msme_value"
  | "msme_volume"
  | "startup"
  | "professional_service"
  | "development_org";

export type Segment = BusinessSegment | "education" | "individual";

export type Confidence = "high" | "medium" | "low";

export type Capability = "expertise" | "management" | "leadership";

export interface SegmentResult {
  segment: Segment;
  program: string; // Programme (or path) name
  playbookSection: number;
  playbookTitle: string;
  /** A close second archetype, shown as "with X traits". Null when the lead is clear. */
  secondary: BusinessSegment | null;
  confidence: Confidence;
  /** The capability furthest below what this archetype needs, if any. */
  weakest: { capability: Capability; score: number; needed: number } | null;
  /** Plain-language warning built from `weakest`. */
  capabilityGap: string | null;
  /** Points per business archetype, for the admin view and the checks. */
  scores: Record<BusinessSegment, number>;
  emailPersonalization: {
    modelDescription: string;
    problemStatement: string;
    programFit: string;
    callToAction: string;
  };
}

/**
 * The minimum founder capabilities each model demands (1-5). A founder below
 * one gets a single, specific warning: the furthest gap, not a list.
 */
const CAPABILITY_MINIMUMS: Record<BusinessSegment, Record<Capability, number>> = {
  msme_value: { expertise: 3, management: 2, leadership: 2 },
  msme_volume: { expertise: 2, management: 3, leadership: 2 },
  startup: { expertise: 3, management: 3, leadership: 4 },
  professional_service: { expertise: 4, management: 2, leadership: 3 },
  development_org: { expertise: 3, management: 2, leadership: 3 },
};

const SEGMENTS: Record<Segment, Omit<SegmentResult["emailPersonalization"], never> & {
  program: string;
  playbookSection: number;
  playbookTitle: string;
}> = {
  msme_value: {
    program: "MSME Mastery: Premium Positioning",
    playbookSection: 3,
    playbookTitle: "The MSME Playbook",
    modelDescription:
      "You're building on value: fewer customers, higher margins, and quality people can feel. You don't need venture scale. You need to own your market.",
    problemStatement:
      "Most value-led businesses end up competing on price because they haven't put their real advantage into words. You have one, and we help you use it.",
    programFit:
      "This programme helps you name and amplify your advantage, build a brand that commands premium pricing, and grow demand without diluting quality.",
    callToAction: "Book a call to discuss your unfair advantage.",
  },
  msme_volume: {
    program: "MSME Mastery: Market Penetration",
    playbookSection: 3,
    playbookTitle: "The MSME Playbook",
    modelDescription:
      "You're building on volume: many customers, thin margins, and efficiency that compounds. You win on reach, speed and systems.",
    problemStatement:
      "Volume businesses stall when every new customer adds work instead of profit. Your challenge is systems and supply, not storytelling.",
    programFit:
      "This programme helps you build repeatable operations, create cost advantages competitors can't match, and widen distribution without losing margin.",
    callToAction: "Book a call to map your growth engine.",
  },
  startup: {
    program: "Startup Strategy Intensive",
    playbookSection: 4,
    playbookTitle: "The Startup Playbook",
    modelDescription:
      "You're building for scale: a problem big enough that growth comes first and the model has to work for thousands, not dozens.",
    problemStatement:
      "Startups confuse moving fast with moving forward. You need product-market fit before scaling spend, and a team that can keep up at every stage.",
    programFit:
      "This programme takes you from a strategy sprint to product-market fit, a team that scales with you, and the decision of when to pivot and when to persevere.",
    callToAction: "Book a call to lock in your first 90 days.",
  },
  professional_service: {
    program: "Professional Services Scaling",
    playbookSection: 5,
    playbookTitle: "The Professional Service Playbook",
    modelDescription:
      "You're selling expertise: reputation brings the work, relationships keep it, and your own hours are both the product and the ceiling.",
    problemStatement:
      "Expert-led practices plateau because more expertise doesn't scale expertise. You need leverage: productised offers, systems, or people.",
    programFit:
      "This programme helps you choose your leverage, whether a firm, a productised offer or a premium niche, and grow beyond your own hours.",
    callToAction: "Book a call to choose your scaling path.",
  },
  development_org: {
    program: "Impact Organisation Mastery",
    playbookSection: 6,
    playbookTitle: "The Development Organisation Playbook",
    modelDescription:
      "You're building for impact: the mission comes first, and the model's job is to keep that impact going and growing.",
    problemStatement:
      "Impact organisations burn out or drift when they chase funding instead of building a model that works and can be repeated.",
    programFit:
      "This programme helps you build a model that works in one place and can replicate, measure impact the way funders trust, and fund it sustainably.",
    callToAction: "Book a call to design a model that lasts.",
  },
  education: {
    program: "AI for Educators and STEAM Training",
    playbookSection: 0,
    playbookTitle: "Training & Workforce Development",
    modelDescription:
      "You're preparing people for an AI world: your teachers first, then your students. The win is capability that stays after the training ends.",
    problemStatement:
      "Schools adopt technology in bursts and it fades. What lasts is teachers who are confident with it and a curriculum built to use it.",
    programFit:
      "AI for Educators brings AI into teaching, planning and assessment, and STEAM Training brings hands-on AI and robotics to your students through STEAM Foundry.",
    callToAction: "Book a call to plan your school's first term.",
  },
  individual: {
    program: "AI Training",
    playbookSection: 0,
    playbookTitle: "Training & Workforce Development",
    modelDescription:
      "You're investing in yourself: the skills, visibility and direction that move a career forward faster than waiting for the next role.",
    problemStatement:
      "Careers stall when skills fall behind the work. AI is moving the line faster than most people can keep up alone.",
    programFit:
      "AI Training takes you from first steps to building: AI literacy, agents and automation, and creating with AI, applied to your own work.",
    callToAction: "Book a call to map your next step.",
  },
};

const BUSINESS: BusinessSegment[] = [
  "msme_value",
  "msme_volume",
  "startup",
  "professional_service",
  "development_org",
];

type Points = Partial<Record<BusinessSegment, number>>;

/** What each answer is evidence for. Tuned against scripts/diagnostic-check.ts. */
const WEIGHTS: Record<string, Record<string, Points>> = {
  q0_type: {
    product_business: { msme_value: 1, msme_volume: 2 },
    service_business: { msme_value: 2, professional_service: 1 },
    startup: { startup: 4 },
    practice: { professional_service: 4 },
    ngo: { development_org: 6 },
  },
  q6_model: {
    quality: { msme_value: 3, professional_service: 1 },
    volume: { msme_volume: 3, startup: 1 },
    product: { startup: 3 },
    expertise: { professional_service: 3 },
    cause: { development_org: 3 },
  },
  q7_revenue: {
    project: { msme_value: 1, professional_service: 1 },
    subscription: { startup: 1, professional_service: 0.5 },
    transaction: { msme_volume: 2 },
    upfront: { msme_value: 1 },
  },
  q6_scale: {
    local: { msme_value: 0.5, professional_service: 0.5 },
    international: { startup: 1 },
  },
  q5_pressure: {
    "80_hours": { startup: 1 },
  },
  q9_challenge: {
    scaling: { msme_volume: 0.5 },
  },
};

const VALUE_WEIGHTS: Record<string, Points> = {
  Impact: { development_org: 1 },
  Quality: { msme_value: 1 },
  Speed: { msme_volume: 0.5, startup: 0.5 },
  Growth: { msme_volume: 0.5, startup: 0.5 },
  Freedom: { professional_service: 1 },
  Money: { msme_volume: 0.5 },
  Sustainability: { development_org: 0.5 },
};

/** The archetype q0_type points to, used to break ties. */
const TYPE_LEAN: Record<string, BusinessSegment> = {
  product_business: "msme_volume",
  service_business: "msme_value",
  startup: "startup",
  practice: "professional_service",
  ngo: "development_org",
};

export function scoreArchetypes(answers: DiscoveryAnswers): Record<BusinessSegment, number> {
  const scores = Object.fromEntries(BUSINESS.map((s) => [s, 0])) as Record<BusinessSegment, number>;
  const add = (p: Points | undefined) => {
    for (const [s, n] of Object.entries(p ?? {})) scores[s as BusinessSegment] += n ?? 0;
  };
  for (const [id, table] of Object.entries(WEIGHTS)) {
    const value = (answers as Record<string, unknown>)[id];
    if (typeof value === "string") add(table[value]);
  }
  for (const v of answers.q3_values ?? []) add(VALUE_WEIGHTS[v]);
  if (Number(answers.q4_expertise) >= 4) add({ professional_service: 1, msme_value: 0.5 });
  return scores;
}

const CAPABILITY_WHY: Record<Capability, string> = {
  expertise: "The work itself is what customers pay for, so depth matters more than anything else here.",
  management: "Growth means more people doing the work, and coordinating them becomes the job.",
  leadership: "Hard calls come faster as you grow, and the team takes its cue from how you make them.",
};

const CAPABILITY_NAME: Record<Capability, string> = {
  expertise: "depth of expertise",
  management: "experience leading a team",
  leadership: "confidence making hard calls",
};

export const SEGMENT_NAME: Record<Segment, string> = {
  msme_value: "Craftsperson",
  msme_volume: "Operator",
  startup: "Problem Solver",
  professional_service: "Expert",
  development_org: "Changemaker",
  education: "Educator",
  individual: "Builder",
};

function weakestCapability(segment: BusinessSegment, answers: DiscoveryAnswers): SegmentResult["weakest"] {
  const mins = CAPABILITY_MINIMUMS[segment];
  let worst: SegmentResult["weakest"] = null;
  // Order breaks ties: for most models a missing leader hurts before a missing manager.
  for (const capability of ["leadership", "management", "expertise"] as Capability[]) {
    const score = Number(answers[`q4_${capability}` as keyof DiscoveryAnswers]);
    if (!Number.isFinite(score) || score <= 0) continue;
    const gap = mins[capability] - score;
    if (gap > 0 && (!worst || gap > worst.needed - worst.score)) {
      worst = { capability, score, needed: mins[capability] };
    }
  }
  return worst;
}

export function calculateSegment(answers: DiscoveryAnswers): SegmentResult {
  const scores = scoreArchetypes(answers);

  let segment: Segment;
  let secondary: BusinessSegment | null = null;
  let confidence: Confidence = "high";
  let weakest: SegmentResult["weakest"] = null;

  if (answers.q0_type === "school") segment = "education";
  else if (answers.q0_type === "career") segment = "individual";
  else {
    const lean = TYPE_LEAN[answers.q0_type ?? ""];
    const ranked = [...BUSINESS].sort(
      (a, b) => scores[b] - scores[a] || (a === lean ? -1 : b === lean ? 1 : 0),
    );
    const [top, second] = ranked;
    segment = top;
    if (scores[second] > 0 && scores[second] >= scores[top] * 0.7) secondary = second;
    confidence = scores[top] >= 6 && scores[top] - scores[second] >= 1 ? "high" : scores[top] >= 4 ? "medium" : "low";
    weakest = weakestCapability(top, answers);
  }

  const def = SEGMENTS[segment];
  const capabilityGap = weakest
    ? `${SEGMENT_NAME[segment]}s need ${CAPABILITY_NAME[weakest.capability]} at about ${weakest.needed} out of 5; you rated yourself ${weakest.score}. ${CAPABILITY_WHY[weakest.capability]}`
    : null;

  return {
    segment,
    program: def.program,
    playbookSection: def.playbookSection,
    playbookTitle: def.playbookTitle,
    secondary,
    confidence,
    weakest,
    capabilityGap,
    scores,
    emailPersonalization: {
      modelDescription: def.modelDescription,
      problemStatement: def.problemStatement,
      programFit: def.programFit,
      callToAction: def.callToAction,
    },
  };
}

/** The archetypes as the company brief describes them. */
export const SEGMENT_PROFILES: Record<Segment, { archetype: string; example: string; economics: string; nextChallenge: string }> = {
  msme_value: {
    archetype: "The Craftsperson",
    example: "Premium interiors, luxury tailoring, specialist consulting",
    economics: "Low volume, high margin",
    nextChallenge: "Scaling without losing quality",
  },
  msme_volume: {
    archetype: "The Operator",
    example: "E-commerce, distribution, food franchises",
    economics: "High volume, thin margins",
    nextChallenge: "Scaling supply without diluting margins",
  },
  startup: {
    archetype: "The Problem Solver",
    example: "SaaS, marketplaces, venture-backed tech",
    economics: "Venture-scale, growth first",
    nextChallenge: "Building leadership while moving fast",
  },
  professional_service: {
    archetype: "The Expert",
    example: "Law firms, consultancies, personal brands",
    economics: "Reputation-led, high rate",
    nextChallenge: "Growing beyond your own hours",
  },
  development_org: {
    archetype: "The Changemaker",
    example: "Non-profits, social enterprises, mission-driven organisations",
    economics: "Impact-first",
    nextChallenge: "A model that sustains impact",
  },
  education: {
    archetype: "The Educator",
    example: "Schools, colleges, training organisations",
    economics: "Capability that stays",
    nextChallenge: "Making technology stick in the classroom",
  },
  individual: {
    archetype: "The Builder",
    example: "Professionals growing their career and skills",
    economics: "Investing in yourself",
    nextChallenge: "Keeping your skills ahead of the work",
  },
};
