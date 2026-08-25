/**
 * Segmentation Logic for Discovery Pathway
 * Maps founder answers → business model → program recommendation
 *
 * This is the business logic that makes personalization work.
 * Every founder gets exactly one segment, one program, and one warning (if applicable).
 */

export interface DiscoveryAnswers {
  // Foundation (Q1-Q5)
  q1_brings_you: string; // "starting" | "building" | "scaling" | "team" | "confused"
  q2_vision: string; // free text
  q3_values: string[]; // array of 1-3 values
  q4_expertise: number; // 1-5
  q4_management: number; // 1-5
  q4_leadership: number; // 1-5
  q5_pressure: string; // "balance" | "real_but_bounded" | "80_hours" | "mission"

  // Business Model (Q6-Q8)
  q6_scale: string; // "local" | "national" | "international"
  q7_revenue: string; // "project" | "subscription" | "transaction" | "upfront" | "unsure"
  q8_advantage: string; // free text

  // Gaps (Q9-Q10)
  q9_challenge: string; // "customers" | "team" | "model" | "scaling" | "corporate_access" | "cash" | "motivation"
  q10_priority: string; // free text
}

export interface SegmentResult {
  segment: "msme_value" | "msme_volume" | "startup" | "professional_service" | "development_org" | "unclear";
  program: string; // Program name
  playbookSection: number; // Section 3, 4, 5, or 6
  playbookTitle: string;
  capabilityGap: string | null; // Warning if they're pursuing a model they're not equipped for
  emailPersonalization: {
    // Used in Email 2 and 3
    modelDescription: string;
    problemStatement: string; // The real constraint they're facing
    programFit: string; // Why THIS program solves their gap
    callToAction: string;
  };
}

/**
 * CAPABILITY REQUIREMENTS BY MODEL
 * These are the minimum founder capabilities each model demands.
 * If a founder scores below these, they get a warning.
 */
const CAPABILITY_MINIMUMS = {
  msme_value: { expertise: 3, management: 2, leadership: 2 },
  msme_volume: { expertise: 2, management: 3, leadership: 1 },
  startup: { expertise: 3, management: 3, leadership: 4 }, // Leadership is strict
  professional_service: { expertise: 4, management: 2, leadership: 3 },
  development_org: { expertise: 3, management: 2, leadership: 3 },
};

/**
 * SEGMENT DEFINITIONS
 * Each segment captures a distinct founder archetype and maps to a program
 */
const SEGMENTS = {
  msme_value: {
    program: "MSME Mastery: Premium Positioning",
    playbookSection: 3,
    playbookTitle: "The MSME Playbook",
    description:
      "You're building a premium business. Few customers, high margin, obsessive quality. Your advantage is unique access or a defensible recipe. You don't need venture scale — you need to own your market.",
    problemStatement:
      "Most Value MSME founders compete on price because they haven't articulated their true advantage. You have one — we help you weaponize it.",
    programFit:
      "This program teaches you to: (1) Identify & amplify your defensible advantage, (2) Build a brand that commands premium pricing, (3) Scale to 10x demand without diluting quality.",
    callToAction: "Book a call to discuss your unfair advantage.",
  },
  msme_volume: {
    program: "MSME Mastery: Market Penetration",
    playbookSection: 3,
    playbookTitle: "The MSME Playbook",
    description:
      "You're building a volume business. Many customers, low margin per unit, relentless efficiency. You win on speed and scale, not on what makes you special.",
    problemStatement:
      "Volume MSMEs fail when founders try to build quality-first. You're competing on efficiency, not craftsmanship. Your challenge is supply chain, not storytelling.",
    programFit:
      "This program teaches you to: (1) Build repeatable, scalable operations, (2) Create cost advantages competitors can't match, (3) Expand distribution without losing margin.",
    callToAction: "Book a call to map your supply chain roadmap.",
  },
  startup: {
    program: "Startup Strategy Intensive",
    playbookSection: 4,
    playbookTitle: "The Startup Playbook",
    description:
      "You're building for venture scale. Problem-focused, network-effect driven, fast growth required. You're solving something at scale that incumbents won't touch.",
    problemStatement:
      "Most startup founders confuse 'product-market fit' with 'ship fast and iterate.' You need both — but the order matters. You also need to solve for team capacity at every stage.",
    programFit:
      "This program teaches you to: (1) Find product-market fit before scaling spend, (2) Build a team that scales with your growth curve, (3) Recognize when to pivot vs. persevere.",
    callToAction: "Book a call to lock in your first 90 days.",
  },
  professional_service: {
    program: "Professional Services Scaling",
    playbookSection: 5,
    playbookTitle: "The Professional Service Playbook",
    description:
      "You're licensing your expertise. Credentialed, relationship-based, revenue is often capped by hours you sell. Your moat is reputation, not product.",
    problemStatement:
      "Professional services founders plateau because they don't build leverage. You can't scale expertise with more expertise — you need productization, systems, or delegation.",
    programFit:
      "This program teaches you to: (1) Build a practice (firm model) OR productize your expertise (courses/templates) OR specialize in a profitable niche, (2) Scale beyond your personal hours.",
    callToAction: "Book a call to choose your scaling path.",
  },
  development_org: {
    program: "Impact Organization Mastery",
    playbookSection: 6,
    playbookTitle: "The Development Organization Playbook",
    description:
      "You're mission-driven. Grant/donation funded, solving problems government/market won't touch. Impact is the north star, profit is the constraint.",
    problemStatement:
      "Development org founders burn out or dilute mission because they chase funding instead of building replicable models. Your challenge is sustainability, not survival.",
    programFit:
      "This program teaches you to: (1) Build a model that works in one place and can replicate, (2) Measure impact in a way donors care about, (3) Raise capital that aligns with your values.",
    callToAction: "Book a call to design your fundraising roadmap.",
  },
};

/**
 * SEGMENTATION RULES
 * The decision tree that maps answers to segments.
 * Read top-to-bottom; first match wins.
 */
export function calculateSegment(answers: DiscoveryAnswers): SegmentResult {
  const {
    q3_values,
    q4_expertise,
    q4_management,
    q4_leadership,
    q5_pressure,
    q6_scale,
    q7_revenue,
    q9_challenge,
  } = answers;

  let segment: string = "unclear";
  let capabilityGap: string | null = null;

  // ============================================================
  // RULE 1: Values Include "Impact" → Development Org
  // ============================================================
  if (q3_values.includes("Impact") || q3_values.includes("Mission")) {
    segment = "development_org";
    // Check capability: DevOrgs need balanced capabilities, not specialized expertise
    const devOrgMin = CAPABILITY_MINIMUMS.development_org;
    if (q4_leadership < devOrgMin.leadership) {
      capabilityGap = `Your model is Development Org, but leadership (${q4_leadership}/5) is below the minimum (${devOrgMin.leadership}/5). Mission-driven work demands strong leadership to keep the team aligned to purpose when funding is uncertain.`;
    }
  }
  // ============================================================
  // RULE 2: Scale=International + Revenue=Subscription → Startup
  // ============================================================
  else if (q6_scale === "international" && q7_revenue === "subscription") {
    segment = "startup";
    // Startups demand leadership and management
    const startupMin = CAPABILITY_MINIMUMS.startup;
    if (q4_leadership < startupMin.leadership) {
      capabilityGap = `Your model is Startup, but leadership (${q4_leadership}/5) is your critical gap. Startups demand exceptional leadership — you'll need to develop this fast or co-found with someone strong here.`;
    }
    if (q4_management < startupMin.management) {
      capabilityGap = `Your model is Startup, but general management (${q4_management}/5) is weak. Startups scale fast; without coordination skills, everything falls apart.`;
    }
  }
  // ============================================================
  // RULE 3: Revenue=Subscription + (not International) → Could be Startup or MSME
  // ============================================================
  else if (q7_revenue === "subscription") {
    if (q5_pressure === "80_hours" || q6_scale === "national") {
      segment = "startup";
      const startupMin = CAPABILITY_MINIMUMS.startup;
      if (q4_leadership < startupMin.leadership) {
        capabilityGap = `You're pursuing venture-scale, but leadership (${q4_leadership}/5) is below startup minimum (${startupMin.leadership}/5). Consider co-founding or building a smaller subscription business as MSME instead.`;
      }
    } else {
      // Subscription at local scale = MSME with recurring revenue
      segment = "msme_value"; // Recurring revenue = higher margins
    }
  }
  // ============================================================
  // RULE 4: Revenue=Project-Based → Professional Service OR MSME
  // ============================================================
  else if (q7_revenue === "project" || q7_revenue === "upfront") {
    // Professional Service = high expertise + local/regional + relationship-driven
    if (q4_expertise >= 4 && q5_pressure !== "80_hours" && q6_scale !== "international") {
      segment = "professional_service";
      const psMin = CAPABILITY_MINIMUMS.professional_service;
      if (q4_expertise < psMin.expertise) {
        capabilityGap = `You're pursuing professional services, but domain expertise (${q4_expertise}/5) is the foundation. You must be able to do the core work yourself.`;
      }
    }
    // Otherwise: MSME
    else {
      // Determine if Value or Volume MSME based on values and challenge
      if (
        q3_values.includes("Excellence") ||
        q3_values.includes("Quality") ||
        q3_values.includes("Premium")
      ) {
        segment = "msme_value";
      } else if (q3_values.includes("Speed") && q9_challenge === "scaling") {
        segment = "msme_volume";
      } else {
        // Default: Value MSME (easier to start, easier to sell)
        segment = "msme_value";
      }
    }
  }
  // ============================================================
  // RULE 5: Revenue=Unsure → Help them decide
  // ============================================================
  else if (q7_revenue === "unsure" || !q7_revenue) {
    // Default to MSME; they'll figure out the model in the playbook
    segment = q3_values.includes("Speed") ? "msme_volume" : "msme_value";
  }

  // ============================================================
  // FALLBACK: If no rules matched, default to MSME Value
  // ============================================================
  if (segment === "unclear") {
    segment = "msme_value";
  }

  // ============================================================
  // Resolve segment to segment details
  // ============================================================
  const segmentDef = SEGMENTS[segment as keyof typeof SEGMENTS] || SEGMENTS.msme_value;

  return {
    segment: segment as any,
    program: segmentDef.program,
    playbookSection: segmentDef.playbookSection,
    playbookTitle: segmentDef.playbookTitle,
    capabilityGap,
    emailPersonalization: {
      modelDescription: segmentDef.description,
      problemStatement: segmentDef.problemStatement,
      programFit: segmentDef.programFit,
      callToAction: segmentDef.callToAction,
    },
  };
}

/**
 * SEGMENT PROFILES (For reference in marketing/positioning)
 * These are the founder archetypes that emerge from the logic above.
 */
export const SEGMENT_PROFILES = {
  msme_value: {
    archetype: "The Craftsperson",
    example: "Premium interior designer, luxury tailoring, specialized consulting",
    economics: "Low volume, high margin, quality > quantity",
    nextChallenge: "Scaling without losing quality",
  },
  msme_volume: {
    archetype: "The Operator",
    example: "E-commerce reseller, bulk distribution, fast-food franchise",
    economics: "High volume, low margin per unit, efficiency > uniqueness",
    nextChallenge: "Scaling supply chain without diluting margins",
  },
  startup: {
    archetype: "The Problem Solver",
    example: "SaaS founder, marketplace, venture-backed tech",
    economics: "Venture-scale, network effects, growth > profit (initially)",
    nextChallenge: "Building leadership team while moving fast",
  },
  professional_service: {
    archetype: "The Expert",
    example: "Law firm, consulting practice, personal brand consultant",
    economics: "High hourly rate, relationship-driven, reputation = distribution",
    nextChallenge: "Scaling beyond personal hours",
  },
  development_org: {
    archetype: "The Changemaker",
    example: "Non-profit, social enterprise, mission-driven org",
    economics: "Grant/donation funded, impact-first, sustainability is hard",
    nextChallenge: "Building replicable model for sustained impact",
  },
};

/**
 * EMAIL PERSONALIZATION COPY (Fragments for Email 2 & 3)
 * Each segment has pre-written copy that references their answers.
 */
export const EMAIL_TEMPLATES = {
  msme_value_email2_opener: (vision: string, advantage: string) =>
    `You're building toward: **${vision}**

Your competitive advantage: **${advantage}**

This is NOT accidental. Most founders try to compete on price. You're competing on ${advantage.toLowerCase()}. That's a different game — and it's winnable.

Here's your playbook section: Section 3 teaches you to own your market through value, not volume.`,

  startup_email2_opener: (vision: string, gap: string | null) => {
    const gapText = gap
      ? `Your critical gap right now is **${gap}**. `
      : ``;
    return `You're building toward: **${vision}**

${gapText}
Here's the truth: most startup founders ship fast and iterate. But iteration without strategy is just spinning. Your playbook section teaches you the order: problem clarity → product-market fit → team → scale.`;
  },

  professional_service_email2_opener: (vision: string, expertise: number) =>
    `You're building toward: **${vision}**

Your domain expertise (${expertise}/5) is your moat. The challenge isn't getting clients — it's scaling without burning yourself out or hiring cheaper talent that dilutes your brand.

Your playbook section teaches you three paths: (1) build a firm, (2) productize your expertise, or (3) specialize in a premium niche.`,

  email3_program_bridge: (segment: string, program: string) => {
    const bridges: Record<string, string> = {
      msme_value: `The **${program}** goes deeper than the playbook. You'll work through real scenarios from your business, refine your positioning, and practice commanding premium pricing.`,
      msme_volume: `The **${program}** teaches you to build supply chains that competitors can't replicate. You'll model unit economics and figure out where to invest for scale.`,
      startup: `The **${program}** isn't another course. It's a structured sprint: lock your problem, test product-market fit, and build a team that scales with you.`,
      professional_service: `The **${program}** walks you through the three scaling paths and helps you choose the one that fits your life and your values.`,
      development_org: `The **${program}** helps you design a model that works in one place, measure its impact, then replicate it elsewhere.`,
    };
    return bridges[segment] || bridges.msme_value;
  },
};
