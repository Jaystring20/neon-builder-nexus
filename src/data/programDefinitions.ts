/**
 * Program Definitions for Digital Creatives Hub
 *
 * Structure:
 * 1. One-on-One Consultation (entry point, N0 or included)
 * 2. Paid Program (N50k - N500k, structured pathway + group sessions)
 * 3. Done with You Services (ongoing, mid-tier, N200k - N800k/mo)
 * 4. Done for You / Advisory (premium, hands-on, N1M+/engagement)
 *
 * Each program is tailored to the founder's segment (their business model, capabilities, constraints).
 */

export interface ProgramTier {
  name: string;
  price: {
    min: number; // NGN
    max: number; // NGN
    billing: "one-time" | "monthly" | "engagement";
  };
  description: string;
  includes: string[];
  duration: string;
  ideal_for: string;
}

export interface Program {
  name: string;
  segment: string;
  tagline: string;
  overview: string;

  // Entry point
  consultation: {
    duration: string;
    what_happens: string;
    outcome: string;
  };

  // The structured paid program
  paidProgram: ProgramTier;

  // Upgrade paths
  doneWithYou: ProgramTier;
  doneForYou: ProgramTier;

  // Learning structure
  learningPathway: {
    phase1: string;
    phase2: string;
    phase3: string;
    phase4: string;
  };

  groupComponent: {
    frequency: string;
    size: string;
    format: string;
    value: string[];
  };

  successMetric: string;
}

// ============================================================
// PROGRAM 1: MSME MASTERY — PREMIUM POSITIONING
// For Value MSMEs (craftspeople, premium services, niche experts)
// ============================================================
export const msmePremiumPositioning: Program = {
  name: "MSME Mastery: Premium Positioning",
  segment: "msme_value",
  tagline: "Own your market. Command premium pricing. Scale without selling out.",
  overview: `
You have a defensible advantage — unique access, a proprietary recipe, or specialized skill.
Most founders bury it by competing on price.

This program teaches you to articulate your advantage clearly, position yourself as premium,
and build customer relationships that create switching costs.

You'll go from "How do I charge more?" to "Why do customers choose me at 3x the price?"
  `,

  // Consultation
  consultation: {
    duration: "90 minutes",
    what_happens: `
1. Map your current advantage (20 min)
   - Where do you have unfair advantage? (location, relationships, recipe, speed)
   - Why do customers actually choose you?
2. Diagnose your positioning (30 min)
   - Are you selling your advantage or giving it away?
   - What price point should you own?
3. Sketch your first move (40 min)
   - What's your premium positioning statement?
   - Who's your first "premium customer"?
    `,
    outcome: "Written positioning statement + 1 customer prospect to approach at premium price",
  },

  // Tier 1: Paid Program
  paidProgram: {
    name: "Premium Positioning Intensive",
    price: { min: 50_000, max: 150_000, billing: "one-time" },
    description: "4-week structured program: build & test your premium positioning",
    includes: [
      "4 × 2-hour group sessions (Cohort model, 8-12 founders per group)",
      "1 × 1-hour 1-on-1 positioning refinement call",
      "Positioning workbook (templates for messaging, pricing, ideal customer)",
      "Case study analysis: 3 local founders who own their market",
      "Private Slack group with peer feedback on positioning",
      "Post-program: 30-day email sequence to keep momentum",
    ],
    duration: "4 weeks (1 group call/week + 1 private call)",
    ideal_for: "Value MSMEs who know they're underpricing but don't know how to fix it",
  },

  // Tier 2: Done with You (ongoing support)
  doneWithYou: {
    name: "Done with You: Premium Positioning Support",
    price: { min: 200_000, max: 500_000, billing: "monthly" },
    description: "3-6 months: implement positioning, test pricing, build case studies",
    includes: [
      "Bi-weekly 1-on-1 calls (implementation + troubleshooting)",
      "Monthly group session with cohort (accountability + peer learning)",
      "Help refine customer landing page / case studies / pricing page",
      "A/B test your messaging with early customers",
      "Build your first 3 customer success stories / case studies",
      "Monthly workshops: pricing psychology, sales conversations, positioning refinement",
    ],
    duration: "3-6 months (ongoing, billed monthly)",
    ideal_for: "Founders ready to invest in building their premium brand + executing",
  },

  // Tier 3: Done for You (premium advisory)
  doneForYou: {
    name: "Done for You: Premium Positioning & Growth",
    price: { min: 1_000_000, max: 3_000_000, billing: "engagement" },
    description: "6-12 months: we implement positioning + build your customer acquisition engine",
    includes: [
      "Weekly 1-on-1 calls (strategy + execution oversight)",
      "We write positioning copy, landing page, case studies",
      "We run sales conversations with your prospects (coaching you)",
      "Build your premium customer advisory board",
      "Monthly growth workshop tailored to your business",
      "Pricing architecture consulting (how to charge different customer types)",
      "We help close your first 3-5 premium customers at 2-3x current price",
    ],
    duration: "6-12 month engagement (weekly delivery)",
    ideal_for: "Founders who want us to drive positioning + revenue growth, not just advise",
  },

  // Learning pathway
  learningPathway: {
    phase1: "POSITION: Define your unfair advantage, articulate your positioning (Week 1-2)",
    phase2: "PACKAGE: Decide what to offer, at what price, to whom (Week 3)",
    phase3: "PITCH: Write your positioning copy, landing page, case studies (Week 4+, DWY)",
    phase4: "PROVE: Land premium customers, build case studies, scale through referral (Ongoing, DFY)",
  },

  // Group component
  groupComponent: {
    frequency: "Weekly (1 call/week, 2 hours)",
    size: "8-12 founders per cohort",
    format: "Live Zoom, recorded, async Q&A in Slack",
    value: [
      "Peer feedback on your positioning (other value MSMEs get it)",
      "Live Q&A: pricing objections, positioning refinement",
      "Guest case study: local founder who repositioned and 3x'd prices",
      "Accountability: share what you're testing this week",
    ],
  },

  successMetric:
    "By end of program, you've articulated your premium positioning, landed your first premium customer at 2x your current price, and have a pipeline of 3-5 premium prospects.",
};

// ============================================================
// PROGRAM 2: MSME MASTERY — MARKET PENETRATION
// For Volume MSMEs (distributors, resellers, operators)
// ============================================================
export const msmePenetration: Program = {
  name: "MSME Mastery: Market Penetration",
  segment: "msme_volume",
  tagline: "Build supply chains that scale. Reach more customers before competitors do.",
  overview: `
You win on speed and efficiency, not on what makes you unique.
Your advantage is operational — you execute better, faster, cheaper than anyone else.

This program teaches you to build scalable operations, secure supply chains,
and expand distribution without losing margin.

You'll go from "How do I scale without going broke?" to "Here's my competitive moat: my supply chain."
  `,

  consultation: {
    duration: "90 minutes",
    what_happens: `
1. Map your current operations (20 min)
   - Where are your margins lost? (supplier, logistics, distribution)
   - What's your current bottleneck to 10x growth?
2. Analyze unit economics (30 min)
   - Cost per unit, margin, volume targets
   - Where can you drive efficiency?
3. Design your scaling roadmap (40 min)
   - Next supplier to secure, next distribution channel to enter
   - Investment needed to reach next 10x
    `,
    outcome: "Unit economics model + scaling roadmap (next 12 months)",
  },

  paidProgram: {
    name: "Market Penetration Intensive",
    price: { min: 75_000, max: 200_000, billing: "one-time" },
    description: "6-week program: secure supply chain, expand distribution, build playbook",
    includes: [
      "6 × 2-hour group sessions (12-15 volume-focused founders)",
      "2 × 1-hour 1-on-1 supply chain / operations call",
      "Unit economics workbook + scenario planner",
      "Supply chain audit template (identify where margin is lost)",
      "Case study: founder who went from 1 channel to 5 (maintained margins)",
      "Distribution strategy playbook (wholesale, retail, B2B, aggregation platforms)",
      "30-day implementation check-in (email)",
    ],
    duration: "6 weeks (1 group call/week + 2 private calls)",
    ideal_for: "Volume MSMEs ready to expand distribution and secure supply",
  },

  doneWithYou: {
    name: "Done with You: Operations & Distribution Scaling",
    price: { min: 250_000, max: 750_000, billing: "monthly" },
    description: "4-6 months: secure supply chain, expand to 3 new distribution channels",
    includes: [
      "Bi-weekly 1-on-1 calls (operations + distribution troubleshooting)",
      "Monthly group session (peer learning on scaling challenges)",
      "Help negotiate with suppliers (pricing, terms, volume commitments)",
      "Strategy for 3 new distribution channels (wholesale, online marketplace, corporate)",
      "Build operations playbook (so scaling doesn't mean chaos)",
      "Monthly workshops: supplier relationships, margin management, logistics optimization",
    ],
    duration: "4-6 months (ongoing, billed monthly)",
    ideal_for: "Founders executing their distribution expansion strategy",
  },

  doneForYou: {
    name: "Done for You: Distribution & Supply Chain Build",
    price: { min: 1_500_000, max: 4_000_000, billing: "engagement" },
    description: "6-12 months: we secure supply, onboard distribution, build playbook",
    includes: [
      "Weekly 1-on-1 (strategy + execution, we drive it)",
      "We negotiate and close supplier relationships",
      "We pitch and close 2-3 new distribution channels",
      "We build your operations playbook (training manuals, quality standards, fulfillment flows)",
      "We audit and improve your unit economics (target: +20% margin)",
      "Monthly workshops on staying lean as you scale",
      "We set up systems so a manager can run operations without you",
    ],
    duration: "6-12 month engagement",
    ideal_for: "Founders who want us to execute supply chain + distribution, not just advise",
  },

  learningPathway: {
    phase1: "AUDIT: Map where margin is lost in your current operations (Week 1-2)",
    phase2: "SECURE: Negotiate better supplier terms, test 1 new supplier (Week 3-4)",
    phase3: "EXPAND: Launch 1-2 new distribution channels (Week 5-6+, ongoing in DWY)",
    phase4: "OPERATIONALIZE: Build playbooks so your team can scale without you (DFY)",
  },

  groupComponent: {
    frequency: "Weekly (1 call/week, 2 hours)",
    size: "12-15 volume-focused founders",
    format: "Live Zoom, recorded, Slack for supplier + logistics Q&A",
    value: [
      "Peer feedback on your supply chain strategy",
      "Guest case study: founder who scaled from 1 supplier to 5, maintained margins",
      "Live supplier negotiation roleplay (practice conversations)",
      "Accountability: share what distribution channel you're testing",
    ],
  },

  successMetric:
    "By end of program, you've secured 1-2 new suppliers, expanded to 1-2 new distribution channels, and documented your unit economics + scaling playbook.",
};

// ============================================================
// PROGRAM 3: STARTUP STRATEGY INTENSIVE
// For venture-scale founders (problem-solvers building for network effects)
// ============================================================
export const startupStrategyIntensive: Program = {
  name: "Startup Strategy Intensive",
  segment: "startup",
  tagline:
    "Find product-market fit before scaling spend. Build a team that grows with you. Know when to pivot.",
  overview: `
You're solving a problem at scale that incumbents won't touch.
Most startup founders confuse shipping fast with strategy.

This program teaches you: (1) How to find product-market fit in 90 days, (2) How to build a team
that scales with your growth curve, (3) How to recognize when to double down vs. pivot.

You'll go from "Ship fast and iterate" to "Ship with strategy, then iterate from strength."
  `,

  consultation: {
    duration: "2 hours",
    what_happens: `
1. Problem validation (30 min)
   - Is your problem real? (evidence, not assumption)
   - Does your customer feel acute pain?
2. Solution diagnosis (45 min)
   - Does your MVP actually test the problem, or just the solution?
   - Who will try it for free right now?
3. Strategy for 90 days (45 min)
   - What do you need to prove in 90 days to know you're on the right track?
   - What's your team bottleneck? (hiring, skills, experience)
    `,
    outcome: "90-day roadmap (validation experiments + hiring roadmap)",
  },

  paidProgram: {
    name: "Startup Strategy Sprint",
    price: { min: 100_000, max: 250_000, billing: "one-time" },
    description: "8-week intensive: lock strategy, run validation experiments, plan hiring",
    includes: [
      "8 × 2-hour group sessions (8-10 founders per cohort, all early-stage)",
      "2 × 1.5-hour 1-on-1 strategy calls",
      "90-day roadmap template (problem validation → PMF signals → team building)",
      "Pitch deck feedback (problem framing, traction, team, ask)",
      "Case study: founder who found PMF in 90 days (now Series A)",
      "Hiring playbook (who to hire first, what you're actually looking for)",
      "Post-program: Slack access for 30 days (office hours + peer support)",
    ],
    duration: "8 weeks (1 group call/week + 2 private calls)",
    ideal_for: "Early-stage founders (pre-PMF, pre-funded) who need strategic clarity",
  },

  doneWithYou: {
    name: "Done with You: Startup Scaling Partnership",
    price: { min: 300_000, max: 1_000_000, billing: "monthly" },
    description: "6 months: execute strategy, run validation experiments, hire your team",
    includes: [
      "Bi-weekly 1-on-1 calls (strategy + execution troubleshooting)",
      "Bi-weekly group sessions (cohort accountability + peer feedback)",
      "Help design validation experiments (what to test, how to interpret results)",
      "Hiring strategy + job description review (who to hire, when)",
      "Pitch deck iteration (as your story evolves)",
      "Monthly workshops: investor conversations, hiring culture, metrics that matter",
      "Advisor access (we connect you with relevant experts: technical, domain, operator)",
    ],
    duration: "6 months (ongoing, billed monthly)",
    ideal_for: "Founders ready to move fast and execute, with us as strategic partner",
  },

  doneForYou: {
    name: "Done for You: Startup Acceleration & Fundraising",
    price: { min: 2_000_000, max: 5_000_000, billing: "engagement" },
    description: "6-12 months: we drive strategy, run experiments, build your team & pitch",
    includes: [
      "Weekly 1-on-1 (we're deeply embedded, helping you navigate daily decisions)",
      "We help design and run validation experiments (you execute with our guidance)",
      "We help hire & vet your first technical + operations hire",
      "We iterate your pitch deck with you (story, traction, team, ask)",
      "We connect you with relevant advisors + investors (our network)",
      "Monthly strategic deep-dives: product direction, fundraising roadmap, culture",
      "We guide you to Series A (fundraising strategy, investor conversations)",
    ],
    duration: "6-12 month engagement (weekly partnership)",
    ideal_for: "Founders who want us driving strategy and building team, not just advising",
  },

  learningPathway: {
    phase1: "VALIDATE: Run 4-5 experiments to prove your problem is real (Week 1-4)",
    phase2: "ITERATE: Use results to refine your solution & positioning (Week 5-6)",
    phase3: "SCALE: Hire first technical person, plan go-to-market (Week 7-8+, ongoing in DWY)",
    phase4: "ACCELERATE: Prove PMF, build team, prepare for fundraising (DFY)",
  },

  groupComponent: {
    frequency: "Weekly (1 call/week, 2 hours)",
    size: "8-10 early-stage founders",
    format: "Live Zoom, recorded, Slack for daily questions",
    value: [
      "Peer feedback on your validation experiments (is this testing the right thing?)",
      "Founder founder panel: early-stage CEOs talking candidly about what works",
      "Hiring roleplay: how to recruit technical talent as a non-technical founder",
      "Accountability: share this week's results + next week's experiments",
    ],
  },

  successMetric:
    "By end of program, you've validated your problem, iterated based on results, landed your first users paying (or deeply engaged for free), and hired your first team member.",
};

// ============================================================
// PROGRAM 4: PROFESSIONAL SERVICES SCALING
// For experts (consultants, lawyers, designers, coaches) hitting the hours ceiling
// ============================================================
export const professionalServicesScaling: Program = {
  name: "Professional Services Scaling",
  segment: "professional_service",
  tagline:
    "Scale beyond your personal hours. Choose your path: firm model, productization, or premium niche.",
  overview: `
You're licensing your expertise. Reputation is your distribution.
But you've hit the hours ceiling — you can't scale expertise with more expertise.

This program teaches you three distinct scaling paths: (1) Build a practice (firm model),
(2) Productize (courses, templates, software), (3) Specialize in a profitable niche.
You'll choose your path, then execute it.

You'll go from "I'm maxed out" to "Here's how I scale without burning myself."
  `,

  consultation: {
    duration: "90 minutes",
    what_happens: `
1. Assess your positioning (30 min)
   - Who are you serving? (Companies? Individuals? Size?)
   - What's your hourly rate vs. market rate?
2. Diagnose your scaling bottleneck (30 min)
   - Can you hire people to do what you do?
   - Can you turn your work into a repeatable system?
3. Explore your 3 paths (30 min)
   - Firm model: build a practice with multiple experts
   - Productization: turn expertise into courses, templates, software
   - Niche premium: become THE expert in one specific area, charge accordingly
    `,
    outcome:
      "Assessment of which path fits your temperament + business goals + market position",
  },

  paidProgram: {
    name: "Professional Services Scaling Program",
    price: { min: 80_000, max: 200_000, billing: "one-time" },
    description:
      "6-week intensive: evaluate scaling paths, choose one, plan your first 90 days",
    includes: [
      "6 × 2-hour group sessions (10-12 service-based founders)",
      "1 × 1.5-hour 1-on-1 path selection call",
      "Scaling paths workbook (3 detailed models: firm, productized, niche)",
      "Case studies: experts who chose each path (outcomes, lessons)",
      "Hiring + delegation workbook (if choosing firm model)",
      "Productization planning template (if choosing courses/software)",
      "Positioning + premium pricing playbook (if choosing niche)",
      "30-day check-in (email + optional call)",
    ],
    duration: "6 weeks (1 group call/week + 1 private call)",
    ideal_for:
      "Service-based founders who know they're stuck, ready to choose a path",
  },

  doneWithYou: {
    name: "Done with You: Professional Practice Build",
    price: { min: 250_000, max: 800_000, billing: "monthly" },
    description: "6 months: execute your chosen scaling path (hire, productize, or specialize)",
    includes: [
      "Bi-weekly 1-on-1 calls (implementation + troubleshooting for your chosen path)",
      "Monthly group sessions (accountability + peer learning)",
      "Path-specific workshops:",
      "  → Firm model: hiring, delegation, building your team culture",
      "  → Productization: course launch, template design, software validation",
      "  → Niche premium: positioning refinement, premium pricing, premium marketing",
      "Help document your IP (systems, templates, proprietary methodologies)",
      "Help build your first revenue stream (new hire, first course sale, premium client)",
    ],
    duration: "6 months (ongoing, billed monthly)",
    ideal_for: "Founders executing their chosen scaling path with ongoing support",
  },

  doneForYou: {
    name: "Done for You: Professional Practice Transformation",
    price: { min: 1_500_000, max: 4_000_000, billing: "engagement" },
    description: "6-12 months: we build your scaling infrastructure (your chosen path)",
    includes: [
      "Weekly 1-on-1 (deep partnership, we execute with you)",
      "Firm model: We help hire, onboard, build systems + culture so your team runs without you",
      "Productization: We help validate, package, launch your first product (course, template, software)",
      "Niche premium: We help refine your positioning, build your premium brand, land premium clients",
      "We document your intellectual property (so it can be sold, licensed, or taught)",
      "We build your first revenue stream at scale (so you're not trading hours for dollars anymore)",
      "Monthly strategic reviews: are we on track? What's next?",
    ],
    duration: "6-12 month engagement (weekly partnership)",
    ideal_for:
      "Founders ready to transform their business model, with us as the execution partner",
  },

  learningPathway: {
    phase1:
      "ASSESS: Choose your path (firm, productization, or niche) based on your values & market",
    phase2: "PLAN: Design your execution roadmap (hiring, product, positioning)",
    phase3: "EXECUTE: Build your first team member / product / niche positioning (Week 5+, ongoing in DWY)",
    phase4: "SCALE: Systematize so your expertise isn't the bottleneck (DFY)",
  },

  groupComponent: {
    frequency: "Weekly (1 call/week, 2 hours) — breakout groups by chosen path",
    size: "10-12 founders (3-4 per chosen path)",
    format: "Live Zoom, recorded, Slack for path-specific Q&A",
    value: [
      "Peer feedback on your hiring (firm model track)",
      "Peer feedback on your course/product (productization track)",
      "Peer feedback on your positioning (niche premium track)",
      "Accountability: share what you're shipping this week",
    ],
  },

  successMetric:
    "By end of program, you've chosen and executed your scaling path: hired your first expert (firm), launched your first product (productization), or landed your first premium client (niche).",
};

// ============================================================
// PROGRAM 5: IMPACT ORGANIZATION MASTERY
// For mission-driven founders (non-profits, social enterprises, development orgs)
// ============================================================
export const impactOrganizationMastery: Program = {
  name: "Impact Organization Mastery",
  segment: "development_org",
  tagline:
    "Build a model that replicates. Measure impact that donors care about. Raise capital aligned with your values.",
  overview: `
You're mission-driven. Grant/donation funded. Solving problems government and market won't touch.

Most impact founders burn out because they chase funding instead of building replicable models.
Your challenge is sustainability, not survival.

This program teaches you to: (1) Build a model that works in one place and can replicate,
(2) Measure impact in a way donors care about, (3) Raise capital that aligns with your values.

You'll go from "How do we survive next quarter?" to "Here's our model, here's our impact, here's our roadmap."
  `,

  consultation: {
    duration: "2 hours",
    what_happens: `
1. Validate your theory of change (45 min)
   - What's the problem you're solving? (evidence)
   - How does your solution actually change the outcome?
   - Who benefits? (quantify)
2. Map your current model (45 min)
   - Where does your funding come from?
   - What's your cost per beneficiary?
   - Can it scale?
3. Fundraising roadmap (30 min)
   - What type of capital do you need? (grants, impact investors, donations)
   - Who funds organizations like yours?
    `,
    outcome:
      "Theory of change document + impact measurement framework + 12-month fundraising roadmap",
  },

  paidProgram: {
    name: "Impact Organization Intensive",
    price: { min: 100_000, max: 250_000, billing: "one-time" },
    description:
      "8-week program: validate model, build impact metrics, create fundraising strategy",
    includes: [
      "8 × 2-hour group sessions (8-10 mission-driven founders)",
      "2 × 1.5-hour 1-on-1 strategy calls",
      "Theory of change template + workshop",
      "Impact measurement framework (what to measure, how to measure it)",
      "Cost per beneficiary modeling",
      "Fundraising strategy playbook (grants vs. impact investors vs. donations)",
      "Case study: organization that scaled from $50k to $500k annually",
      "30-day donor outreach plan",
    ],
    duration: "8 weeks (1 group call/week + 2 private calls)",
    ideal_for:
      "Impact founders who want to move from survival mode to strategic growth",
  },

  doneWithYou: {
    name: "Done with You: Impact Organization Growth",
    price: { min: 300_000, max: 1_000_000, billing: "monthly" },
    description:
      "6 months: refine model, build impact metrics, secure grants + major donors",
    includes: [
      "Bi-weekly 1-on-1 calls (strategy + fundraising troubleshooting)",
      "Bi-weekly group sessions (accountability + peer learning from other founders)",
      "Help validate your theory of change with real data",
      "Help design your impact measurement system (you'll need this for any grant)",
      "Help write grant proposals (we review, you refine + submit)",
      "Help develop major donor strategy (who to approach, how to approach them)",
      "Monthly workshops: nonprofit financials, donor relations, impact storytelling",
      "Advisor introductions (we connect you with grant writers, impact investors)",
    ],
    duration: "6 months (ongoing, billed monthly)",
    ideal_for:
      "Founders ready to systematize fundraising + build replicable models",
  },

  doneForYou: {
    name: "Done for You: Impact Organization Transformation",
    price: { min: 2_000_000, max: 5_000_000, billing: "engagement" },
    description: "6-12 months: we build your model, metrics, and funding engine",
    includes: [
      "Weekly 1-on-1 (deep partnership, we drive it)",
      "We help validate your theory of change with real impact data",
      "We build your impact measurement system (baseline, metrics, dashboards)",
      "We write + submit grant proposals (you execute, we strategy)",
      "We build your major donor strategy + help close relationships",
      "We design your model for replication (so it can scale beyond your city)",
      "We help pilot in a second location (if replication is your goal)",
      "Monthly strategic reviews: are we hitting impact targets? What's the fundraising pipeline?",
    ],
    duration: "6-12 month engagement",
    ideal_for:
      "Founders ready to professionalize + scale their organization, with us driving",
  },

  learningPathway: {
    phase1: "CLARIFY: Define your theory of change + validate it (Week 1-3)",
    phase2: "MEASURE: Build your impact metrics + measure baseline (Week 4-5)",
    phase3: "FUND: Identify + approach major donors + write first grant (Week 6-8+, ongoing in DWY)",
    phase4: "REPLICATE: Pilot model in new location, refine, scale (DFY)",
  },

  groupComponent: {
    frequency: "Weekly (1 call/week, 2 hours)",
    size: "8-10 impact founders",
    format: "Live Zoom, recorded, Slack for fundraising questions",
    value: [
      "Peer feedback on your theory of change (does it make sense to someone outside your org?)",
      "Founder founder panel: scaling impact without losing mission",
      "Grant writing workshop (live feedback on your proposal draft)",
      "Accountability: share your fundraising wins + challenges this week",
    ],
  },

  successMetric:
    "By end of program, you've validated your model, built your impact metrics, secured 1-2 grants or major donors, and documented your model for potential replication.",
};

// ============================================================
// EXPORT ALL PROGRAMS BY SEGMENT
// ============================================================
export const PROGRAM_MAP: Record<string, Program> = {
  msme_value: msmePremiumPositioning,
  msme_volume: msmePenetration,
  startup: startupStrategyIntensive,
  professional_service: professionalServicesScaling,
  development_org: impactOrganizationMastery,
};

/**
 * Get program by segment
 */
export function getProgramBySegment(segment: string): Program | null {
  return PROGRAM_MAP[segment] || null;
}

/**
 * Helper: Email 2 body template for program descriptions
 * Personalizes based on segment + program
 */
export function generateEmail2Body(program: Program, founderName: string): string {
  return `Hi ${founderName},

Your profile showed us you're a ${program.segment === "msme_value" ? "Value MSME" : program.segment === "msme_volume" ? "Volume MSME" : program.segment === "startup" ? "Startup Founder" : program.segment === "professional_service" ? "Service Expert" : "Impact Leader"}.

That means: ${program.overview.split("\n")[0]}

We've designed the **${program.name}** for founders exactly like you.

What's included:
${program.paidProgram.includes
  .slice(0, 3)
  .map((item) => `• ${item}`)
  .join("\n")}

This is a ${program.paidProgram.duration} program starting at ₦${program.paidProgram.price.min.toLocaleString()}.

Ready to go deeper? Book a call with us.

— Digital Creatives Hub
`;
}

/**
 * Helper: Email 3 body (program pitch)
 */
export function generateEmail3Body(program: Program, founderName: string): string {
  return `Hi ${founderName},

You've learned the fundamentals. Now here's where it gets real.

The **${program.name}** isn't just another course. It's:

${program.doneWithYou.includes
  .slice(0, 4)
  .map((item) => `• ${item}`)
  .join("\n")}

**Next steps:**
1. Calendar link: [Book 30-min call to discuss your situation]
2. Or jump straight in: [Apply to next cohort]

Our founders tell us the moment they commit is the moment things shift. You're ready.

— Digital Creatives Hub
`;
}
