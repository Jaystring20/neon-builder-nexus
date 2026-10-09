/**
 * The Book a call intake: who they are, what they need, budget and timing,
 * and the routing that turns those answers into a suggested offering and a
 * priority for DCH. Shared by /book and POST /api/lead, so the browser and the
 * server always agree on labels and routing.
 */

export interface Choice {
  value: string;
  label: string;
}

export const CLIENT_TYPES: Choice[] = [
  { value: "business", label: "A business owner" },
  { value: "startup", label: "A startup founder" },
  { value: "organisation", label: "An organisation or NGO" },
  { value: "school", label: "A school or educator" },
  { value: "individual", label: "An individual professional" },
];

/** Practice slugs from src/data/services.ts, plus "unsure". */
export const NEEDS: Choice[] = [
  { value: "brand-architecture", label: "Brand: strategy, identity, story" },
  { value: "growth-operations", label: "Growth: campaigns, content, community" },
  { value: "digital-infrastructure", label: "Platforms: website, app, systems" },
  { value: "ai-automation", label: "AI agents and automation" },
  { value: "training", label: "Training for me or my team" },
  { value: "unsure", label: "Not sure yet" },
];

export const CURRENCIES = ["NGN", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

/** Same tiers in both currencies, so routing never depends on the currency. */
export const BUDGETS: Record<Currency, Choice[]> = {
  NGN: [
    { value: "t1", label: "Under ₦250,000" },
    { value: "t2", label: "₦250,000 to ₦1M" },
    { value: "t3", label: "₦1M to ₦5M" },
    { value: "t4", label: "Over ₦5M" },
    { value: "unsure", label: "Not sure yet" },
  ],
  USD: [
    { value: "t1", label: "Under $500" },
    { value: "t2", label: "$500 to $2,000" },
    { value: "t3", label: "$2,000 to $10,000" },
    { value: "t4", label: "Over $10,000" },
    { value: "unsure", label: "Not sure yet" },
  ],
};

export const TIMELINES: Choice[] = [
  { value: "now", label: "As soon as possible" },
  { value: "quarter", label: "In the next 1 to 3 months" },
  { value: "later", label: "Later this year" },
  { value: "exploring", label: "Just exploring" },
];

export interface LeadIntake {
  clientType: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  needs: string[];
  problem: string;
  currency: Currency;
  budget: string;
  timeline: string;
}

const labelOf = (list: Choice[], value: string) => list.find((c) => c.value === value)?.label ?? value;

export const PRACTICE_TITLES: Record<string, string> = {
  "brand-architecture": "Brand Architecture",
  "growth-operations": "Growth Operations",
  "digital-infrastructure": "Digital Infrastructure",
  "ai-automation": "Agentic AI & Automation",
  training: "Training & Workforce Development",
};

export interface LeadRouting {
  /** Practice slug the lead belongs to, or null when they don't know yet. */
  practice: string | null;
  practiceTitle: string;
  /** How big a first step to propose, from the budget. */
  engagement: string;
  /** For DCH's eyes only: how soon to give this one attention. */
  priority: "high" | "medium" | "low";
  summary: string;
}

/**
 * Where to point a lead. Individuals and schools default to Training; anyone
 * else gets their first named practice. The budget sets the size of the first
 * step, and budget plus timing set the priority DCH sees in the alert.
 */
export function routeLead(lead: LeadIntake): LeadRouting {
  const named = lead.needs.filter((n) => n !== "unsure" && PRACTICE_TITLES[n]);
  const practice =
    lead.clientType === "individual" || lead.clientType === "school"
      ? named.includes("training") || named.length === 0
        ? "training"
        : named[0]
      : named[0] ?? null;

  const engagement =
    {
      t1: "A focused first step: a workshop, an audit or a one-to-one session",
      t2: "A defined project with a clear scope and finish line",
      t3: "A multi-part build across brand, platform or people",
      t4: "An ongoing partnership with a dedicated team",
    }[lead.budget] ?? "We'll size the right first step together on the call";

  const bigBudget = lead.budget === "t3" || lead.budget === "t4";
  const soon = lead.timeline === "now" || lead.timeline === "quarter";
  const priority: LeadRouting["priority"] =
    bigBudget && soon ? "high" : bigBudget || (soon && lead.budget === "t2") ? "medium" : "low";

  const practiceTitle = practice ? PRACTICE_TITLES[practice] : "To be decided on the call";
  const summary = [
    `${labelOf(CLIENT_TYPES, lead.clientType)}${lead.company ? `, ${lead.company}` : ""}`,
    `Needs: ${lead.needs.map((n) => labelOf(NEEDS, n)).join("; ")}`,
    `Problem: ${lead.problem}`,
    `Budget: ${labelOf(BUDGETS[lead.currency] ?? BUDGETS.NGN, lead.budget)}`,
    `Timeline: ${labelOf(TIMELINES, lead.timeline)}`,
  ].join("\n");

  return { practice, practiceTitle, engagement, priority, summary };
}

export const describe = {
  clientType: (v: string) => labelOf(CLIENT_TYPES, v),
  need: (v: string) => labelOf(NEEDS, v),
  budget: (c: Currency, v: string) => labelOf(BUDGETS[c] ?? BUDGETS.NGN, v),
  timeline: (v: string) => labelOf(TIMELINES, v),
};

/** Server-side check of an untrusted body. Returns the cleaned lead or an error. */
export function parseLead(body: unknown): { lead: LeadIntake } | { error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const lead: LeadIntake = {
    clientType: str(b.clientType, 40),
    name: str(b.name, 120),
    email: str(b.email, 200).toLowerCase(),
    company: str(b.company, 160) || undefined,
    phone: str(b.phone, 40) || undefined,
    needs: Array.isArray(b.needs) ? b.needs.map((n) => str(n, 40)).filter(Boolean).slice(0, 6) : [],
    problem: str(b.problem, 2000),
    currency: (CURRENCIES as readonly string[]).includes(b.currency as string) ? (b.currency as Currency) : "NGN",
    budget: str(b.budget, 20),
    timeline: str(b.timeline, 20),
  };
  if (!lead.name) return { error: "Please tell us your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return { error: "That email address doesn't look right." };
  if (!CLIENT_TYPES.some((c) => c.value === lead.clientType)) return { error: "Please tell us who you are." };
  if (lead.needs.length === 0) return { error: "Please pick at least one area." };
  if (lead.problem.length < 10) return { error: "Please describe the problem in a sentence or two." };
  if (!BUDGETS[lead.currency].some((c) => c.value === lead.budget)) return { error: "Please choose a budget range." };
  if (!TIMELINES.some((c) => c.value === lead.timeline)) return { error: "Please choose a timeline." };
  return { lead };
}
