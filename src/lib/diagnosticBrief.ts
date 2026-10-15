/**
 * A diagnostic, written up as a source document for NotebookLM.
 *
 * The team downloads this from the dashboard, adds it to a NotebookLM
 * notebook (with the client's website or pitch deck if they have one), and
 * generates a slide deck or audio overview from it. Everything in it comes
 * from the visitor's answers and the same logic as the result screen, so the
 * deck can only say what the diagnostic said. Prices and the team's notes
 * are left out on purpose: the output may go straight to the client.
 *
 * Markdown, because NotebookLM reads it as a source and keeps the headings.
 */

import { calculateSegment, SEGMENT_NAME, SEGMENT_PROFILES, type DiscoveryAnswers } from "@/data/segmentLogic";
import { buildReading } from "@/data/diagnosticReading";
import { matchOffer, TIER_LABEL } from "@/data/offerMatch";
import { questionsFor, labelFor } from "@/data/discoveryQuestions";
import { serviceCategories } from "@/data/services";
import type { PortfolioProject } from "@/data/portfolio";
import type { Program } from "@/data/programDefinitions";

export interface BriefInput {
  email: string;
  takenAt: string;
  segment: string;
  answers: Record<string, unknown>;
  /** The programme with the team's dashboard edits, if any. */
  programme?: Program | null;
  portfolio: PortfolioProject[];
}

const text = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);

/** The diagnosis behind the brief. Older submissions keep the result they were shown. */
export function briefResult(segment: string, answers: Record<string, unknown>) {
  const computed = calculateSegment(answers as DiscoveryAnswers);
  // Submissions from before the first question existed were scored by the old
  // rules; keep the archetype they were told rather than silently changing it.
  const legacy = !answers.q0_type;
  const result = legacy ? { ...computed, segment: segment as typeof computed.segment, secondary: null } : computed;
  return { result, reading: buildReading(result, answers), legacy };
}

export function buildDiagnosticBrief(input: BriefInput): string {
  const { answers } = input;
  const name = text(answers.contact_name);
  const who = name ?? input.email;
  const { result, reading, legacy } = briefResult(input.segment, answers);
  const profile = SEGMENT_PROFILES[result.segment] ?? SEGMENT_PROFILES.msme_value;
  const offer = matchOffer(result.segment, answers, input.programme ?? undefined);
  const label = (id: string) => labelFor(id, answers[id], answers);
  const date = new Date(input.takenAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const proof = reading.proofId ? input.portfolio.find((p) => p.id === reading.proofId) : undefined;
  const practices = offer.practices
    .map((slug) => serviceCategories.find((c) => c.slug === slug))
    .filter((c): c is (typeof serviceCategories)[number] => Boolean(c));

  const out: string[] = [];
  const h = (s: string) => out.push("", `## ${s}`, "");
  const line = (s: string | null | undefined) => s != null && out.push(s);
  const item = (k: string, v: string | null | undefined) => v && out.push(`- **${k}:** ${v}`);

  out.push(
    `# Growth Diagnostic brief: ${who}`,
    "",
    `Prepared by Digital Creatives Hub (DCH) from the Growth Diagnostic ${who === input.email ? "" : `${input.email} `}completed on ${date}.`,
    "Everything below comes from their own answers and DCH's diagnosis of them.",
  );
  if (legacy)
    line("\nNote: taken before the diagnostic added its opening questions, so their type of organisation and business model were not asked.");

  h("Who they are");
  item("Organisation", label("q0_type"));
  item("Stage", label("q1_brings_you"));
  item("What they're building", text(answers.q2_vision) && `"${text(answers.q2_vision)}"`);
  item("Customers", label("q6_scale"));
  item("How it works", label("q6_model"));
  item("How they charge", label("q7_revenue"));
  item("Their edge, in their words", text(answers.q8_advantage) && `"${text(answers.q8_advantage)}"`);
  item("What matters most to them", Array.isArray(answers.q3_values) ? (answers.q3_values as string[]).join(", ") : null);
  item("What they can give right now", label("q5_pressure"));

  h("The diagnosis");
  line(`**${profile.archetype}**${reading.traits ? `, ${reading.traits}` : ""} (${result.confidence} confidence).`);
  line("");
  line(result.emailPersonalization.modelDescription);
  line("");
  line(`Typical examples: ${profile.example}. The usual next challenge: ${profile.nextChallenge.toLowerCase()}.`);
  line("");
  line(`The real constraint: ${result.emailPersonalization.problemStatement}`);
  if (reading.confidenceNote) line(`\n${reading.confidenceNote}`);

  h("What's holding them back");
  line(label("q9_challenge") ?? "Not answered.");
  item("Their 90-day win", reading.ninetyDay && `"${reading.ninetyDay}"`);

  h("Their first move");
  line(reading.firstMove);
  if (reading.dch) line(`\nWhere DCH comes in: ${reading.dch.title}. ${reading.dch.line}`);

  const flags = [result.capabilityGap, ...reading.tensions].filter(Boolean) as string[];
  if (flags.length) {
    h("Worth knowing");
    flags.forEach((f) => out.push(`- ${f}`));
  }

  h("Capabilities, self-rated out of 5");
  item("Depth of expertise", answers.q4_expertise ? String(answers.q4_expertise) : null);
  item("Experience leading a team", answers.q4_management ? String(answers.q4_management) : null);
  item("Confidence making hard calls", answers.q4_leadership ? String(answers.q4_leadership) : null);

  h("Recommended path");
  if (offer.program) {
    line(`**${offer.program.name}**: ${offer.program.tagline}`);
    line("");
    (["paidProgram", "doneWithYou", "doneForYou"] as const).forEach((k) => {
      const t = offer.program![k];
      out.push(`- ${TIER_LABEL[k]}${k === offer.bestTier ? " (best fit)" : ""}: ${t.name}, ${t.duration}. For ${t.ideal_for.charAt(0).toLowerCase()}${t.ideal_for.slice(1).replace(/\.?$/, ".")}`);
    });
    line("");
    line(`Why that way of working: ${offer.reason}`);
  } else {
    line(`**${result.program}**: ${result.emailPersonalization.programFit}`);
    line("Delivered as cohorts, workshops or one-to-one, online or in person.");
  }
  if (practices.length) {
    line("");
    line("DCH practices that would deliver it:");
    practices.forEach((p) => out.push(`- ${p.title}: ${p.tagline}`));
  }

  if (proof) {
    h("Similar work DCH has shipped");
    line(`${proof.title}${proof.url ? ` (${proof.displayDomain})` : ""}: ${proof.description}`);
  }

  h("About DCH");
  line(
    "Digital Creatives Hub Ltd (DCH) is a business development creative agency. It builds the three things behind a business's growth: the brand that makes it understood and chosen, the platforms it runs on, and the people who carry it forward, with AI built into all three. Positioning: Projects end. Momentum doesn't. Every engagement starts with a discovery call: www.digitalcreativeshubltd.com/book",
  );

  h("All answers");
  for (const q of questionsFor(answers)) {
    const v = answers[q.id];
    const shown = Array.isArray(v)
      ? (v as string[]).join(", ")
      : typeof v === "number"
        ? `${v} of 5${q.labels?.[v - 1] ? ` (${q.labels[v - 1]})` : ""}`
        : label(q.id);
    out.push(`- ${q.question} ${shown ? `**${shown}**` : "_Skipped_"}`);
  }

  return out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n";
}

/** A NotebookLM prompt for the slide deck, to paste into its customise box. */
export function deckPrompt(input: BriefInput): string {
  const { answers } = input;
  const who = text(answers.contact_name) ?? "this founder";
  const { result, reading } = briefResult(input.segment, answers);
  const building = text(answers.q2_vision);
  return [
    `Create a 10-slide deck for ${who}${building ? `, who is building "${building}"` : ""}, using only the Growth Diagnostic brief.`,
    `Slides: their situation in their own words; the diagnosis (${SEGMENT_NAME[result.segment]}) and what it means; what's really holding them back; their first move; three moves for the next 90 days${reading.ninetyDay ? ` toward "${reading.ninetyDay}"` : ""}; what to watch out for; the recommended path; where DCH comes in; similar work DCH has shipped; next step: book a discovery call.`,
    "Write plainly and directly, in short sentences. Speak to them as 'you'. Don't mention prices. Don't add facts, results or client names that aren't in the source.",
  ].join("\n\n");
}
