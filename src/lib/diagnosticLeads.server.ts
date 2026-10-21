/**
 * The Growth Diagnostic's side of the leads pipeline, for /api/discovery.
 *
 * - Records each step a visitor takes (diagnostic_events), anonymously.
 * - Turns every diagnostic that leaves an email into a lead straight away,
 *   with a priority from leadHeat(): hot, warm or cool.
 * - When someone opens the booking calendar or books through it, finds their
 *   lead (if they've left an email) and moves it up.
 *
 * Everything here is best-effort. A missing diagnostic_events table (before
 * its migration is run) or any failed write is logged and ignored: it must
 * never cost a submission.
 */

import { getSupabase } from "./supabase.server.js";
import { HEAT_PRIORITY, type HeatResult } from "../data/leadHeat.js";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const TRACKED = ["start", "question", "finish", "book_open", "booked"] as const;
const RANK: Record<string, number> = { low: 0, medium: 1, high: 2 };

const CLIENT_TYPE: Record<string, string> = {
  product_business: "business",
  service_business: "business",
  practice: "business",
  startup: "startup",
  ngo: "organisation",
  school: "school",
  career: "individual",
};

export const validSession = (v: unknown): string | null => (typeof v === "string" && UUID_RE.test(v) ? v : null);

const clean = (v: unknown, max: number, pattern: RegExp) =>
  typeof v === "string" && v.length <= max && pattern.test(v) ? v : null;

/** One step from the browser. Returns nothing the caller needs; never throws. */
export async function recordFunnelEvent(body: Record<string, unknown>): Promise<void> {
  const session = validSession(body.session_id);
  const event = TRACKED.find((e) => e === body.event);
  if (!session || !event) return;
  const step = typeof body.step === "number" && Number.isInteger(body.step) && body.step > 0 && body.step < 50 ? body.step : null;
  try {
    const { error } = await getSupabase()
      .from("diagnostic_events")
      .insert([
        {
          session_id: session,
          event,
          step,
          question: clean(body.question, 40, /^q\d+[a-z0-9_]*$/),
          audience: clean(body.audience, 30, /^[a-z_]+$/),
          source: clean(body.source, 60, /^[a-z0-9._-]+$/),
        },
      ]);
    if (error) return console.error("diagnostic_events insert failed:", error.message);
    if (event === "book_open" || event === "booked") await applyBookingSignal(session, event);
  } catch (err) {
    console.error("funnel event failed:", err);
  }
}

/** What this visitor did before leaving their email. */
export async function sessionSignals(session: string | null): Promise<{ openedBooking: boolean; booked: boolean }> {
  if (!session) return { openedBooking: false, booked: false };
  const { data, error } = await getSupabase()
    .from("diagnostic_events")
    .select("event")
    .eq("session_id", session)
    .in("event", ["book_open", "booked"]);
  if (error || !data) return { openedBooking: false, booked: false };
  const events = new Set(data.map((r: { event: string }) => r.event));
  return { openedBooking: events.has("book_open") || events.has("booked"), booked: events.has("booked") };
}

export async function recordEmailEvent(session: string | null, discoveryId: string, audience: unknown): Promise<void> {
  if (!session) return;
  const { error } = await getSupabase()
    .from("diagnostic_events")
    .insert([{ session_id: session, event: "email", discovery_id: discoveryId, audience: clean(audience, 30, /^[a-z_]+$/) }]);
  if (error) console.error("diagnostic_events email insert failed:", error.message);
}

const logAuto = (action: string, entityType: string, entityId: string, detail: Record<string, unknown>) =>
  getSupabase()
    .from("admin_activity")
    .insert([{ actor_id: null, action, entity_type: entityType, entity_id: entityId, detail: { ...detail, auto: true } }])
    .then(({ error }) => error && console.error("admin_activity insert failed:", error.message));

/**
 * The diagnostic's lead: created the first time, and on a retake only ever
 * moved up (a cooler retake doesn't demote someone the team is working).
 */
export async function upsertDiagnosticLead(input: {
  discoveryId: string;
  email: string;
  name: string;
  answers: Record<string, unknown>;
  program: string;
  heat: HeatResult;
  booked: boolean;
  newsletter: boolean;
}): Promise<void> {
  const db = getSupabase();
  const priority = HEAT_PRIORITY[input.heat.heat];
  const { data: existing } = await db.from("leads").select("id,priority,status,newsletter_opt_in").eq("discovery_id", input.discoveryId).maybeSingle();

  if (existing) {
    const patch: Record<string, unknown> = {};
    if (RANK[priority] > RANK[existing.priority]) patch.priority = priority;
    if (input.booked && (existing.status === "new" || existing.status === "contacted")) patch.status = "booked";
    // Consent is only ever added here, never removed by a retake.
    if (input.newsletter && !existing.newsletter_opt_in) {
      patch.newsletter_opt_in = true;
      patch.newsletter_opt_in_at = new Date().toISOString();
    }
    if (!Object.keys(patch).length) return;
    const { error } = await db.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", existing.id);
    if (error) return console.error("lead update failed:", error.message);
    await logAuto("lead.heat", "lead", existing.id, { heat: input.heat.heat, reasons: input.heat.reasons });
    return;
  }

  const text = (k: string) => (typeof input.answers[k] === "string" ? (input.answers[k] as string).trim() : "");
  const problem = [
    `Growth diagnostic: ${input.program}.`,
    text("q2_vision") && `Building: ${text("q2_vision")}`,
    text("q10_priority") && `90-day win: ${text("q10_priority")}`,
    `${input.heat.heat.toUpperCase()}: ${input.heat.reasons.join(", ") || "no strong signals yet"}.`,
  ]
    .filter(Boolean)
    .join("\n");
  const { data: lead, error } = await db
    .from("leads")
    .insert([
      {
        newsletter_opt_in: input.newsletter,
        newsletter_opt_in_at: input.newsletter ? new Date().toISOString() : null,
        source: "diagnostic",
        discovery_id: input.discoveryId,
        name: input.name || input.email.split("@")[0],
        email: input.email,
        client_type: CLIENT_TYPE[String(input.answers.q0_type)] ?? "business",
        problem,
        currency: "NGN",
        budget: "unsure",
        timeline: "exploring",
        priority,
        status: input.booked ? "booked" : "new",
      },
    ])
    .select("id")
    .single();
  if (error || !lead) return console.error("lead insert failed:", error?.message);
  await logAuto("lead.created_from_diagnostic", "lead", lead.id, { discovery_id: input.discoveryId, heat: input.heat.heat, reasons: input.heat.reasons });
  await logAuto("diagnostic.to_lead", "diagnostic", input.discoveryId, { lead_id: lead.id, heat: input.heat.heat });
}

/** A visitor who already left an email opened the calendar or booked: move their lead up. */
async function applyBookingSignal(session: string, event: "book_open" | "booked"): Promise<void> {
  const db = getSupabase();
  const { data: link } = await db
    .from("diagnostic_events")
    .select("discovery_id")
    .eq("session_id", session)
    .eq("event", "email")
    .not("discovery_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!link?.discovery_id) return;
  const { data: lead } = await db.from("leads").select("id,email,priority,status").eq("discovery_id", link.discovery_id).maybeSingle();
  if (!lead) return;

  const patch: Record<string, unknown> = {};
  if (lead.priority !== "high") patch.priority = "high";
  if (event === "booked" && (lead.status === "new" || lead.status === "contacted")) patch.status = "booked";
  if (Object.keys(patch).length) {
    const { error } = await db.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", lead.id);
    if (error) return console.error("lead update failed:", error.message);
  }
  if (event === "booked") {
    // They've booked: the generic follow-ups would only get in the way.
    await db.from("scheduled_emails").delete().eq("email", lead.email).eq("sent", false).in("email_type", ["email_2", "email_3"]);
  }
  await logAuto(event === "booked" ? "lead.booked_online" : "lead.opened_booking", "lead", lead.id, {});
}

/**
 * Hands a newsletter consent to Make.com, which adds the person to the
 * BuildWithJA Insights audience in Resend. Best-effort: a failure is logged and
 * never stops the diagnostic.
 */
export async function forwardNewsletterConsent(input: { email: string; name: string; discoveryId: string }): Promise<void> {
  const url = process.env.MAKE_NEWSLETTER_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: input.email,
        name: input.name,
        newsletter: "BuildWithJA Insights",
        source: "growth-diagnostic",
        discovery_id: input.discoveryId,
        consented_at: new Date().toISOString(),
      }),
    });
    if (!res.ok) console.error("Newsletter webhook returned", res.status);
  } catch (err) {
    console.error("Newsletter webhook failed:", err);
  }
}
