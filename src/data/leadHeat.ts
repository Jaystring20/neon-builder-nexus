/**
 * How warm a diagnostic lead is: hot, warm or cool, with the reasons. Used to
 * set the lead's priority when it's created, flag hot ones in the alert email,
 * and sort the Leads list so the best follow-ups come first.
 *
 * Everything here comes from what the visitor told us or did on the site; it
 * never guesses about the person. Shared by the server and the test sheet
 * (scripts/diagnostic-check.ts), so the rules are pinned by real cases.
 */

export type Heat = "hot" | "warm" | "cool";

export interface HeatSignals {
  /** They opened the booking calendar on the result screen. */
  openedBooking?: boolean;
  /** Calendly reported a booking from the embedded calendar. */
  booked?: boolean;
  /** How sure the diagnosis was. */
  confidence?: "high" | "medium" | "low";
}

export interface HeatResult {
  heat: Heat;
  score: number;
  reasons: string[];
}

export const HEAT_PRIORITY: Record<Heat, "high" | "medium" | "low"> = { hot: "high", warm: "medium", cool: "low" };
export const HEAT_LABEL: Record<Heat, string> = { hot: "Hot", warm: "Warm", cool: "Cool" };

const HOT_AT = 6;
const WARM_AT = 3;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function leadHeat(answers: Record<string, unknown>, signals: HeatSignals = {}): HeatResult {
  if (signals.booked) return { heat: "hot", score: 99, reasons: ["Booked a discovery call"] };

  let score = 0;
  const reasons: string[] = [];
  const add = (points: number, reason: string) => {
    score += points;
    reasons.push(reason);
  };

  if (signals.openedBooking) add(3, "Opened the booking calendar");

  const stage = answers.q1_brings_you;
  if (stage === "scaling" || stage === "team") add(2, stage === "scaling" ? "Already scaling" : "Hiring a team");
  else if (stage === "building") add(1, "Building, finding fit");

  if (answers.q5_pressure === "80_hours") add(2, "All in on time");
  else if (answers.q5_pressure === "real_but_bounded") add(1, "Can push hard");

  const revenue = answers.q7_revenue;
  if (typeof revenue === "string" && revenue !== "unsure") add(1, "Knows how they charge");

  // A goal they could write down in a sentence, not a fragment.
  if (text(answers.q10_priority).length >= 15) add(1, "Clear 90-day goal");
  if (text(answers.contact_name)) add(1, "Gave their name");
  if (signals.confidence === "high") add(1, "Clear-cut diagnosis");

  const heat: Heat = score >= HOT_AT ? "hot" : score >= WARM_AT ? "warm" : "cool";
  return { heat, score, reasons };
}
