/**
 * Discovery answers → the DCH offer that fits.
 *
 * segmentLogic.ts decides the model (and so the programme, from
 * programDefinitions.ts). This file decides how to work together: the
 * structured programme, done with you, or done for you, plus the practices
 * that deliver it. Shared by the result screen, the Calendly notes and the
 * alert email to DCH, so all three always say the same thing.
 */

import { getProgramBySegment, type Program } from "./programDefinitions.js";

export type TierKey = "paidProgram" | "doneWithYou" | "doneForYou";

export const TIER_LABEL: Record<TierKey, string> = {
  paidProgram: "Programme",
  doneWithYou: "Done with you",
  doneForYou: "Done for you",
};

const SEGMENT_PRACTICES: Record<string, string[]> = {
  msme_value: ["brand-architecture", "growth-operations"],
  msme_volume: ["growth-operations", "ai-automation"],
  startup: ["digital-infrastructure", "brand-architecture"],
  professional_service: ["brand-architecture", "ai-automation"],
  development_org: ["growth-operations", "training"],
};

const CHALLENGE_PRACTICE: Record<string, string> = {
  customers: "growth-operations",
  corporate_access: "growth-operations",
  team: "training",
  motivation: "training",
  model: "brand-architecture",
  scaling: "ai-automation",
};

export interface OfferMatch {
  program: Program | null;
  bestTier: TierKey;
  reason: string;
  /** Practice slugs from src/data/services.ts, most relevant first, at most three. */
  practices: string[];
}

/** `program` is the programme with any dashboard edits applied; the original is used when it's left out. */
export function matchOffer(
  segment: string,
  answers: Record<string, unknown>,
  program: Program | null = getProgramBySegment(segment),
): OfferMatch {
  const stage = answers.q1_brings_you as string;
  const pace = answers.q5_pressure as string;
  const wantsTeam = answers.q4_management_followup as string;

  let bestTier: TierKey;
  let reason: string;
  if (stage === "scaling" || stage === "team") {
    if (pace === "balance" || pace === "mission") {
      bestTier = "doneForYou";
      reason = "It's working and you want growth without more of your hours, so we run it with you in the lead.";
    } else {
      bestTier = "doneWithYou";
      reason = "It's working. Hands-on support to build the systems lets it grow without breaking.";
    }
  } else if (stage === "building" && (pace === "80_hours" || wantsTeam === "scale")) {
    bestTier = "doneWithYou";
    reason = "You're moving fast and ready to build, so working alongside you beats a course.";
  } else {
    bestTier = "paidProgram";
    reason = "You're early, so a structured programme gets you clarity fastest, for the least spend.";
  }

  const practices = [...(SEGMENT_PRACTICES[segment] ?? [])];
  const fromChallenge = CHALLENGE_PRACTICE[answers.q9_challenge as string];
  if (fromChallenge && !practices.includes(fromChallenge)) practices.unshift(fromChallenge);

  return { program, bestTier, reason, practices: practices.slice(0, 3) };
}

const naira = (n: number) =>
  n >= 1_000_000 ? `₦${(n / 1_000_000).toFixed(n % 1_000_000 ? 1 : 0)}M` : `₦${Math.round(n / 1000)}k`;

export function priceRange(program: Program, tier: TierKey): string {
  const p = program[tier].price;
  const suffix = p.billing === "monthly" ? " a month" : "";
  return `${naira(p.min)} to ${naira(p.max)}${suffix}`;
}

/** One line for Calendly notes and alerts. */
export function offerLine(match: OfferMatch): string {
  if (!match.program) return "";
  return `${match.program.name}, best fit: ${TIER_LABEL[match.bestTier]} (${match.program[match.bestTier].name})`;
}
