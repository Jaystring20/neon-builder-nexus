/**
 * Calendly links and prefill. Shared by the browser and the serverless
 * functions, so nothing here may touch import.meta or the DOM.
 *
 * Two routes into a call:
 * - discovery: someone who finished /discovery. They book the one-on-one
 *   discovery call, and their result travels with the booking.
 * - intro: someone who pressed Book a call. They answer a short intake on
 *   /book first, then pick a time.
 *
 * Both currently point at the discovery-call event. Give `intro` its own
 * Calendly event when DCH creates one; nothing else needs to change.
 */
export const CALENDLY = {
  discovery: "https://calendly.com/digitalcreativeshubltd/one-on-one-discovery-call",
  intro: "https://calendly.com/digitalcreativeshubltd/one-on-one-discovery-call",
} as const;

export type CallKind = keyof typeof CALENDLY;

/**
 * A Calendly link with the visitor's details filled in. `notes` lands in the
 * event's first custom question (a1), which is where Calendly puts "Please
 * share anything that will help prepare for our meeting"; utm_source tells
 * the two routes apart in Calendly's own reporting.
 */
export function calendlyUrl(
  kind: CallKind,
  prefill: { name?: string; email?: string; notes?: string } = {},
): string {
  const url = new URL(CALENDLY[kind]);
  if (prefill.name) url.searchParams.set("name", prefill.name);
  if (prefill.email) url.searchParams.set("email", prefill.email);
  if (prefill.notes) url.searchParams.set("a1", prefill.notes.slice(0, 1500));
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_campaign", kind === "discovery" ? "discovery-form" : "book-a-call");
  return url.toString();
}
