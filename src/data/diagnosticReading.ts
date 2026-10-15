/**
 * Discovery answers + archetype → the personal part of the result.
 *
 * segmentLogic.ts decides who the visitor is; this decides what to say to
 * them: one first move written for their archetype and their biggest
 * obstacle, where DCH comes in, the tensions in their own answers, a piece
 * of shipped work like theirs, and their 90-day win reflected back.
 *
 * Shared by the result screen and the first email, so both say the same
 * thing. Plain data only: no React, no images, so the API can import it.
 * Copy follows the voice rules in PRODUCT.md: direct, specific, no
 * em-dashes, nothing we can't show.
 */

import { SEGMENT_NAME, type SegmentResult } from "./segmentLogic.js";
import { challengePractice } from "./offerMatch.js";

export interface Reading {
  /** "Problem Solver, with Operator traits" style line, or null. */
  traits: string | null;
  /** Shown when the scores were close. */
  confidenceNote: string | null;
  /** The one thing to do first. */
  firstMove: string;
  /** The practice behind it, and what DCH would do. */
  dch: { practice: string; title: string; line: string } | null;
  /** Up to two honest flags from the visitor's own answers. */
  tensions: string[];
  /** Portfolio id of shipped work like theirs (src/data/portfolio.ts), if any. */
  proofId: string | null;
  /** Their 90-day win, quoted back, or null if they left it blank. */
  ninetyDay: string | null;
}

/** First moves by archetype, then by obstacle (q9_challenge values). */
const FIRST_MOVES: Record<string, Record<string, string>> = {
  msme_value: {
    customers:
      "Stop chasing more customers and go after better ones. Write down the three clients you'd clone, then go where they already are, with an offer priced for them.",
    team: "Hire for your standard, not your workload. Write down exactly what good looks like in your work, so the first person you bring in can meet it without you checking everything.",
    model:
      "Price on value, not hours or cost. Take your best-selling offer and write down what it's worth to the client: that number, not your costs, sets the price.",
    scaling:
      "Protect the quality before you grow the volume. Write down the three steps that make your work feel premium, and make them the standard everyone follows.",
    cash: "Get paid sooner for the work you already do. Ask for a deposit on every engagement and offer a priority tier; clients who value quality rarely mind paying for it.",
    motivation:
      "Ask three of your best clients what they'd lose without you. The answers will steady you, and they'll become your best marketing.",
  },
  msme_volume: {
    customers:
      "Find the one channel that already brings you customers cheaply, and put more into it before trying anything new.",
    team: "Turn your busiest daily task into a written checklist this week. Volume businesses scale on routines, and routines make new hires useful from day one.",
    model:
      "Know your margin on every sale. Work out what one order really costs you, delivery and returns included, before you push for more volume.",
    scaling:
      "Find what breaks first when orders double: stock, delivery or customer support. Fix or automate that one point before you spend on growth.",
    cash: "Shorten the gap between paying suppliers and getting paid. Stock that sells slowly is usually where the cash is stuck; stop reordering it first.",
    motivation:
      "Pick one number to watch every week, such as orders or repeat customers, and mark every time it moves. Volume is a long game, and visible progress keeps it going.",
  },
  startup: {
    customers:
      "Talk to ten target users this month before building anything new. Find the problem they'd pay to have solved tomorrow, and build only that.",
    team: "Hire for the next six months, not the next six years. Find the one role that unblocks you now, and hire someone who can own it outright.",
    model:
      "Prove one paying use case before widening the product. A narrow product people pay for beats a broad one they only like.",
    scaling:
      "Before you spend on growth, check the product keeps people. Look at how many of last month's users are still active; if most are gone, fix that first.",
    cash: "Plan for twice your runway, not just the next raise. Cut what doesn't move your one key number, and line up revenue or funding before you need it.",
    motivation:
      "Shrink the goal to something you can win in two weeks. Startups run on momentum, and small, visible wins rebuild it fastest.",
  },
  professional_service: {
    customers:
      "Make your expertise easy to find. Publish one sharp piece a week on the problem you solve best, so referrals have something to point to.",
    team: "Split the work only you can do from the work you happen to do. Hand off the second list first, starting with admin and delivery support.",
    model:
      "Package your expertise into a fixed offer at a fixed price. Clients buy outcomes more easily than hours, and you stop being paid only for your time.",
    scaling:
      "Turn your most repeated piece of advice into something that runs without you: a programme, a product or a process someone else can deliver.",
    cash: "Move your regular clients onto retainers. Predictable income lets you say no to the wrong work and raise your rate on the right work.",
    motivation:
      "Write down the three client results you're proudest of. Expertise is easy to undervalue from the inside; your clients don't.",
  },
  development_org: {
    customers:
      "Treat the people you serve and the people who fund you as two audiences. Each needs its own story, told in its own words.",
    team: "Give the team a system, not just a mission: clear roles, a weekly rhythm and simple tools, so nobody burns out carrying everything.",
    model:
      "Design one programme that works in one place, measure it properly, then make it repeatable. A model that replicates is what funders back for the long term.",
    scaling:
      "Before you expand, write down how your best programme runs, step by step. Replication fails when the method lives only in the founders' heads.",
    cash: "Add one earned income stream alongside your grants, so the impact doesn't depend on the next funding cycle.",
    motivation:
      "Collect one story of real change every month. It reminds the team why the work matters, and it's the evidence funders ask for.",
  },
  education: {
    skills:
      "Start with your teachers, not your students. A practical AI for Educators session that saves each teacher an hour a week wins them over fastest.",
    curriculum:
      "Pilot AI and robotics with one class for one term through STEAM Foundry. A visible success there makes the case for the whole school.",
    visibility:
      "Show parents what your students can build. A term-end showcase of AI and robotics projects tells your story better than any advert.",
    systems:
      "List the admin tasks that eat your staff's week. Automating even one, such as reports or attendance follow-ups, gives that time back to teaching.",
    cash: "Start with a pilot sized to your budget. One class and one term proves the value before you commit to more.",
  },
  individual: {
    skills:
      "Pick one AI skill that would save you hours in your current job, learn it properly, and use it at work this month.",
    visibility:
      "Share one thing you've learned or built each week. Being known for your work starts with your work being seen.",
    direction:
      "Write down the role you want in two years, then the three skills it needs that you don't have yet. That list is your plan.",
    time: "Use AI to win the hours back. Automate one repetitive task at work, and spend the time you save on learning.",
    income:
      "Build a skill that's scarce and in demand. AI applied to your own field is exactly that right now.",
  },
};

/** Fallbacks when an obstacle wasn't answered, by archetype. */
const DEFAULT_MOVE: Record<string, string> = {
  msme_value: FIRST_MOVES.msme_value.customers,
  msme_volume: FIRST_MOVES.msme_volume.scaling,
  startup: FIRST_MOVES.startup.customers,
  professional_service: FIRST_MOVES.professional_service.scaling,
  development_org: FIRST_MOVES.development_org.model,
  education: FIRST_MOVES.education.skills,
  individual: FIRST_MOVES.individual.skills,
};

/** What DCH would do through each practice. Titles match src/data/services.ts. */
const PRACTICE_LINE: Record<string, { title: string; line: string }> = {
  "brand-architecture": {
    title: "Brand Architecture",
    line: "We'd sharpen your positioning and story so the right people choose you, and know why.",
  },
  "growth-operations": {
    title: "Growth Operations",
    line: "We'd build the campaigns, content and funnels that bring people in and keep them coming back.",
  },
  "digital-infrastructure": {
    title: "Digital Infrastructure",
    line: "We'd build the platform your growth runs on, ready for scale from the start.",
  },
  "ai-automation": {
    title: "Agentic AI & Automation",
    line: "We'd take the repeat work off your plate, so growth doesn't simply mean more hours.",
  },
  training: {
    title: "Training & Workforce Development",
    line: "We'd build the skills alongside you, so the capability stays after we leave.",
  },
};

/** Shipped work closest to each archetype (ids in src/data/portfolio.ts). */
const PROOF: Record<string, string> = {
  msme_value: "innerspace",
  msme_volume: "everything-household",
  startup: "veridia",
  professional_service: "digitech-strategist",
  development_org: "ecopath",
};

function findTensions(r: SegmentResult, a: Record<string, unknown>): string[] {
  const values = (a.q3_values as string[] | undefined) ?? [];
  const out: string[] = [];
  if (r.segment === "startup" && a.q5_pressure === "balance")
    out.push("You want a sustainable pace, and you're building for venture scale. Both are possible, but not at once: decide which gives way, the speed or the scale.");
  if (r.segment === "professional_service" && a.q5_pressure === "80_hours")
    out.push("Your hours are the product, and you're already giving sixty a week. More hours isn't the plan; leverage is.");
  if (r.segment === "startup" && a.q6_scale === "local")
    out.push("Venture-scale growth usually needs a bigger market than one city. Check the problem exists beyond it before you build for scale.");
  if (a.q1_brings_you === "scaling" && a.q9_challenge === "model")
    out.push("You're scaling while the model is still unclear. Settle the model first, or growth multiplies the cracks.");
  if (values.includes("Growth") && values.includes("Freedom"))
    out.push("You value growth and freedom. Growth usually costs some control, so decide now which parts of the work you'll let go of.");
  if (r.segment === "development_org" && values.includes("Money") && !values.includes("Impact"))
    out.push("You chose money over impact as a priority, in a mission-driven model. Worth a conversation about whether a social enterprise fits better.");
  return out.slice(0, 2);
}

/** The first move written for this archetype and obstacle, or null if none is. */
export function firstMoveFor(segment: string, challenge: string): string | null {
  return FIRST_MOVES[segment]?.[challenge] ?? null;
}

export function buildReading(r: SegmentResult, answers: Record<string, unknown>): Reading {
  const challenge = answers.q9_challenge === "corporate_access" ? "customers" : (answers.q9_challenge as string);
  const firstMove = firstMoveFor(r.segment, challenge) ?? DEFAULT_MOVE[r.segment] ?? DEFAULT_MOVE.msme_value;

  const practice = challengePractice(r.segment, { ...answers, q9_challenge: challenge });
  const dch = practice && PRACTICE_LINE[practice] ? { practice, ...PRACTICE_LINE[practice] } : null;

  const confidenceNote =
    r.confidence === "low"
      ? "Your answers point here, but it's close. A short call will pin it down before you act on it."
      : null;

  const ninety = typeof answers.q10_priority === "string" ? answers.q10_priority.trim() : "";

  return {
    traits: r.secondary ? `with ${SEGMENT_NAME[r.secondary]} traits` : null,
    confidenceNote,
    firstMove,
    dch,
    tensions: findTensions(r, answers),
    proofId: PROOF[r.segment] ?? null,
    ninetyDay: ninety || null,
  };
}
