/**
 * The diagnostic's test sheet: twenty realistic visitors and the result each
 * should get, drawn from the DCH company brief's archetypes. Every change to
 * the questions or scoring must keep all of them passing.
 *
 *   npm run check:diagnostic
 */

import { calculateSegment, type DiscoveryAnswers, type Segment } from "../src/data/segmentLogic.js";
import { matchOffer, type TierKey } from "../src/data/offerMatch.js";
import { buildReading, firstMoveFor } from "../src/data/diagnosticReading.js";
import { questionsFor } from "../src/data/discoveryQuestions.js";
import { leadHeat, type Heat, type HeatSignals } from "../src/data/leadHeat.js";

interface Case {
  who: string;
  answers: DiscoveryAnswers & { q4_management_followup?: string };
  expect: Segment;
  secondary?: Segment;
  gap?: "expertise" | "management" | "leadership";
  tier?: TierKey;
  confidence?: "low";
  /** Words the first move must contain. */
  move?: string;
}

// Middle-of-the-road capabilities, so each case only states what matters to it.
const base: DiscoveryAnswers = {
  q1_brings_you: "building",
  q2_vision: "A business I'm proud of",
  q3_values: ["Growth"],
  q4_expertise: 3,
  q4_management: 3,
  q4_leadership: 3,
  q5_pressure: "real_but_bounded",
  q6_scale: "national",
  q9_challenge: "customers",
  q10_priority: "Five new customers",
};

const cases: Case[] = [
  {
    who: "1. Luxury tailor, Lagos",
    answers: { q0_type: "service_business", q6_model: "quality", q7_revenue: "project", q3_values: ["Quality"], q6_scale: "local" },
    expect: "msme_value",
  },
  {
    who: "2. Interior design studio that values impact",
    answers: { q0_type: "service_business", q6_model: "quality", q7_revenue: "project", q3_values: ["Quality", "Impact"] },
    expect: "msme_value",
  },
  {
    who: "3. Bakery with three outlets",
    answers: { q0_type: "product_business", q6_model: "volume", q7_revenue: "transaction", q3_values: ["Growth", "Money"] },
    expect: "msme_volume",
  },
  {
    who: "4. E-commerce reseller",
    answers: { q0_type: "product_business", q6_model: "volume", q7_revenue: "transaction", q3_values: ["Speed", "Growth"] },
    expect: "msme_volume",
  },
  {
    who: "5. Food franchise owner, scaling hard",
    answers: {
      q0_type: "product_business",
      q1_brings_you: "scaling",
      q6_model: "volume",
      q7_revenue: "transaction",
      q5_pressure: "80_hours",
    },
    expect: "msme_volume",
    tier: "doneWithYou",
  },
  {
    who: "6. Fintech app, pre-revenue",
    answers: { q0_type: "startup", q6_model: "product", q7_revenue: "unsure", q6_scale: "international", q5_pressure: "80_hours" },
    expect: "startup",
  },
  {
    who: "7. Marketplace startup, per sale",
    answers: { q0_type: "startup", q6_model: "volume", q7_revenue: "transaction", q5_pressure: "80_hours" },
    expect: "startup",
    secondary: "msme_volume",
  },
  {
    who: "8. SaaS founder who has rarely led a team",
    answers: { q0_type: "startup", q6_model: "product", q7_revenue: "subscription", q4_management: 1, q4_leadership: 3 },
    expect: "startup",
    gap: "management",
  },
  {
    who: "9. Corporate lawyer, own firm",
    answers: { q0_type: "practice", q6_model: "expertise", q7_revenue: "project", q4_expertise: 5 },
    expect: "professional_service",
  },
  {
    who: "10. Business consultant, expertise 3",
    answers: { q0_type: "practice", q6_model: "expertise", q7_revenue: "subscription", q4_expertise: 3 },
    expect: "professional_service",
    gap: "expertise",
  },
  {
    who: "11. Coach who values impact",
    answers: { q0_type: "practice", q6_model: "expertise", q3_values: ["Impact", "Freedom"], q7_revenue: "project", q4_expertise: 4 },
    expect: "professional_service",
  },
  {
    who: "12. Freelance brand designer",
    answers: { q0_type: "practice", q6_model: "quality", q7_revenue: "project", q3_values: ["Quality"], q4_expertise: 4 },
    expect: "professional_service",
    secondary: "msme_value",
  },
  {
    who: "13. Youth NGO",
    answers: { q0_type: "ngo", q6_model: "cause", q3_values: ["Impact"] },
    expect: "development_org",
  },
  {
    who: "14. Social enterprise selling crafts",
    answers: { q0_type: "ngo", q6_model: "volume", q7_revenue: "transaction", q3_values: ["Impact"] },
    expect: "development_org",
    secondary: "msme_volume",
  },
  {
    who: "15. Foundation director, new to leading",
    answers: { q0_type: "ngo", q6_model: "cause", q3_values: ["Impact"], q4_leadership: 2 },
    expect: "development_org",
    gap: "leadership",
  },
  {
    who: "16. Private secondary school",
    answers: { q0_type: "school", q9_challenge: "skills" },
    expect: "education",
  },
  {
    who: "17. University lecturer",
    answers: { q0_type: "school", q9_challenge: "curriculum" },
    expect: "education",
  },
  {
    who: "18. Mid-career professional",
    answers: { q0_type: "career", q9_challenge: "skills" },
    expect: "individual",
  },
  {
    who: "19. Unsure, just starting",
    answers: { q0_type: "service_business", q1_brings_you: "starting", q7_revenue: "unsure", q3_values: ["Freedom"] },
    expect: "msme_value",
    confidence: "low",
  },
  {
    who: "20. Accounting firm, scaling, wants balance",
    answers: {
      q0_type: "practice",
      q1_brings_you: "scaling",
      q6_model: "expertise",
      q7_revenue: "subscription",
      q5_pressure: "balance",
      q4_expertise: 5,
    },
    expect: "professional_service",
    tier: "doneForYou",
  },
  {
    who: "21. Funmimo: AI exam prep, product works",
    answers: {
      q0_type: "startup",
      q1_brings_you: "scaling",
      q2_vision: "An AI-powered exam prep platform helping Nigerian students pass WAEC, JAMB and SAT",
      q3_values: ["Impact", "Growth"],
      q4_expertise: 4,
      q4_leadership: 4,
      q5_pressure: "80_hours",
      q6_model: "volume",
      q7_revenue: "subscription",
      q9_challenge: "customers",
    },
    expect: "startup",
    move: "distribution is now the job",
  },
  {
    who: "22. Pre-launch app, just starting",
    answers: { q0_type: "startup", q1_brings_you: "starting", q6_model: "product", q7_revenue: "unsure", q9_challenge: "customers" },
    expect: "startup",
    move: "Talk to ten target users",
  },
];

let failed = 0;
for (const c of cases) {
  const answers = { ...base, ...c.answers };
  const r = calculateSegment(answers);
  const offer = matchOffer(r.segment, answers as Record<string, unknown>);
  const problems: string[] = [];
  if (r.segment !== c.expect) problems.push(`got ${r.segment}, expected ${c.expect}`);
  if (c.secondary && r.secondary !== c.secondary) problems.push(`secondary ${r.secondary}, expected ${c.secondary}`);
  if (c.gap && r.weakest?.capability !== c.gap) problems.push(`gap ${r.weakest?.capability ?? "none"}, expected ${c.gap}`);
  if (c.tier && offer.bestTier !== c.tier) problems.push(`tier ${offer.bestTier}, expected ${c.tier}`);
  if (c.confidence && r.confidence !== c.confidence) problems.push(`confidence ${r.confidence}, expected ${c.confidence}`);
  if (c.move && !buildReading(r, answers as Record<string, unknown>).firstMove.includes(c.move))
    problems.push(`first move lacks "${c.move}"`);
  const scores = Object.entries(r.scores)
    .filter(([, n]) => n > 0)
    .map(([s, n]) => `${s} ${n}`)
    .join(", ");
  console.log(`${problems.length ? "FAIL" : "ok  "}  ${c.who.padEnd(46)} ${r.segment}${r.secondary ? ` + ${r.secondary}` : ""} (${r.confidence})  [${scores}]`);
  for (const p of problems) console.log(`        ${p}`);
  if (problems.length) failed++;
}
// Every archetype has its own first move and a DCH practice for every
// obstacle its audience can pick, so nobody gets a fallback line.
const archetypes: [string, string][] = [
  ["msme_value", "service_business"],
  ["msme_volume", "product_business"],
  ["startup", "startup"],
  ["professional_service", "practice"],
  ["development_org", "ngo"],
  ["education", "school"],
  ["individual", "career"],
];
let gaps = 0;
for (const [segment, type] of archetypes) {
  const challenge = questionsFor({ q0_type: type }).find((q) => q.id === "q9_challenge")!;
  const r = calculateSegment({ ...base, q0_type: type });
  for (const opt of challenge.options!) {
    const reading = buildReading({ ...r, segment: segment as Segment }, { ...base, q0_type: type, q9_challenge: opt.value });
    if (!firstMoveFor(segment, opt.value)) {
      console.log(`FAIL  no first move for ${segment} × ${opt.value}`);
      gaps++;
    }
    if (!reading.dch) {
      console.log(`FAIL  no DCH practice for ${segment} × ${opt.value}`);
      gaps++;
    }
  }
}
if (gaps) failed += gaps;

// Lead heat: who the team should call first. Each case is a real kind of visitor.
const heatCases: { who: string; answers: Record<string, unknown>; signals?: HeatSignals; expect: Heat }[] = [
  {
    who: "Funmimo: scaling, all in, clear goal, named",
    answers: { ...base, ...cases[20].answers, q10_priority: "10,000 paying students by March", contact_name: "Elijah" },
    signals: { confidence: "high" },
    expect: "hot",
  },
  {
    who: "Footwear founder: building, all in, goal cut short",
    answers: { ...base, q0_type: "product_business", q1_brings_you: "building", q5_pressure: "80_hours", q7_revenue: "project", q10_priority: "land 5 cl" },
    signals: { confidence: "low" },
    expect: "warm",
  },
  {
    who: "Just curious: starting, unsure, balance",
    answers: { ...base, q1_brings_you: "starting", q5_pressure: "balance", q7_revenue: "unsure", q10_priority: "learn" },
    expect: "cool",
  },
  {
    who: "Same curious visitor, opened the calendar",
    answers: { ...base, q1_brings_you: "starting", q5_pressure: "balance", q7_revenue: "unsure", q10_priority: "learn" },
    signals: { openedBooking: true },
    expect: "warm",
  },
  {
    who: "Anyone who booked",
    answers: { q1_brings_you: "confused" },
    signals: { booked: true },
    expect: "hot",
  },
];
for (const c of heatCases) {
  const h = leadHeat(c.answers, c.signals);
  const ok = h.heat === c.expect;
  console.log(`${ok ? "ok  " : "FAIL"}  heat: ${c.who.padEnd(48)} ${h.heat} (${h.score}) [${h.reasons.join(", ")}]`);
  if (!ok) failed++;
}
console.log(
  failed
    ? `\n${failed} check(s) failed`
    : `\nAll ${cases.length} visitors pass, every archetype × obstacle has its own first move, and all ${heatCases.length} heat cases score right`,
);
process.exitCode = failed ? 1 : 0;
