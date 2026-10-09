/**
 * /api/events: the public side of events.
 *
 *   GET  /api/events              published events (upcoming and recent past)
 *   GET  /api/events?slug=…       one published event
 *   POST /api/events?slug=…       register for it
 *
 * Never returns the join link or payment details; those go by email, the join
 * link only once a place is confirmed. Free events confirm at once. Paid
 * events wait as pending_payment until the team marks the transfer received
 * in /admin. Every registrant is linked to a lead (one per email).
 */

import { randomInt } from "node:crypto";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase, missingServerEnv } from "../src/lib/supabase.server.js";
import { sendEmailViaResendDetailed } from "../src/lib/resend.v3.js";
import { paidRegistrationAlertEmail, registrationConfirmedEmail, registrationPendingEmail } from "../src/lib/eventEmails.js";
import { HOLDS_SEAT, isPast, newReference, parseRegistration, type EventRecord, type PublicEvent } from "../src/data/events.js";

const PUBLIC_FIELDS = "id,slug,title,kind,summary,description,starts_at,ends_at,location_type,venue,image_url,price_ngn,status,capacity";
const DAY_MS = 24 * 60 * 60 * 1000;

type Row = PublicEvent & { id: string; capacity: number | null };

async function seatsTaken(db: SupabaseClient, eventIds: string[]): Promise<Map<string, number>> {
  const taken = new Map<string, number>();
  if (!eventIds.length) return taken;
  const { data } = await db.from("event_registrations").select("event_id").in("event_id", eventIds).in("status", HOLDS_SEAT);
  for (const r of (data ?? []) as { event_id: string }[]) taken.set(r.event_id, (taken.get(r.event_id) ?? 0) + 1);
  return taken;
}

const toPublic = ({ id: _id, capacity, ...e }: Row, taken: number): PublicEvent => ({
  ...e,
  spots_left: capacity == null ? null : Math.max(0, capacity - taken),
});

/** The lead for this email, creating one the first time we see them. */
async function linkLead(db: SupabaseClient, e: EventRecord, r: { name: string; email: string; phone?: string; organisation?: string }) {
  const { data: existing } = await db.from("leads").select("id").eq("email", r.email).order("created_at", { ascending: false }).limit(1);
  if (existing?.[0]) return existing[0].id as string;
  const { data, error } = await db
    .from("leads")
    .insert([
      {
        source: "event",
        name: r.name,
        email: r.email,
        company: r.organisation ?? null,
        phone: r.phone ?? null,
        client_type: r.organisation ? "business" : "individual",
        problem: `Registered for ${e.title}.`,
        currency: "NGN",
        budget: "unsure",
        timeline: "exploring",
        priority: "low",
      },
    ])
    .select("id")
    .single();
  if (error) console.error("event lead insert failed:", error.message);
  return (data?.id as string | undefined) ?? null;
}

export async function register(req: VercelRequest, res: VercelResponse, db: SupabaseClient, slug: string) {
  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  if (typeof body.website === "string" && body.website.trim()) return res.status(200).json({ ok: true, status: "confirmed" });

  const parsed = parseRegistration(body);
  if ("error" in parsed) return res.status(400).json({ error: parsed.error });
  const input = parsed.input;

  const { data: event } = await db.from("events").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  const e = event as EventRecord | null;
  if (!e) return res.status(404).json({ error: "We couldn't find that event." });
  if (isPast(e)) return res.status(400).json({ error: "This event has already taken place." });

  // Registering twice: resend what they need rather than failing.
  const { data: already } = await db.from("event_registrations").select("name,email,reference,status").eq("event_id", e.id).eq("email", input.email).maybeSingle();
  if (already && already.status !== "cancelled") {
    const mail = already.status === "pending_payment" ? registrationPendingEmail(e, already) : registrationConfirmedEmail(e, already);
    await sendEmailViaResendDetailed(mail);
    return res.status(200).json({ ok: true, status: already.status, already: true });
  }

  if (e.capacity != null) {
    const taken = (await seatsTaken(db, [e.id])).get(e.id) ?? 0;
    if (taken >= e.capacity) return res.status(409).json({ error: "Sorry, this event is full." });
  }

  const status = e.price_ngn > 0 ? "pending_payment" : "confirmed";
  const leadId = await linkLead(db, e, input);
  const row = {
    event_id: e.id,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    organisation: input.organisation ?? null,
    note: input.note ?? null,
    status,
    reference: newReference(randomInt),
    lead_id: leadId,
  };
  const { error } = already
    ? await db.from("event_registrations").update({ ...row, updated_at: new Date().toISOString() }).eq("event_id", e.id).eq("email", input.email)
    : await db.from("event_registrations").insert([row]);
  if (error) {
    console.error("event registration failed:", error.message);
    return res.status(500).json({ error: "We couldn't register you just now. Please try again." });
  }

  const sent = await sendEmailViaResendDetailed(status === "confirmed" ? registrationConfirmedEmail(e, row) : registrationPendingEmail(e, row));
  if (!sent.ok) console.error("event registration email not sent:", sent.error);
  if (status === "pending_payment") {
    const alert = await sendEmailViaResendDetailed(paidRegistrationAlertEmail(e, row));
    if (!alert.ok) console.error("event payment alert not sent:", alert.error);
  }

  return res.status(200).json({
    ok: true,
    status,
    reference: status === "pending_payment" ? row.reference : undefined,
    payment_instructions: status === "pending_payment" ? e.payment_instructions : undefined,
    price_ngn: e.price_ngn,
    emailed: sent.ok,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (missingServerEnv().length) return res.status(503).json({ error: "Events are unavailable right now." });
  const db = getSupabase();
  const slug = typeof req.query.slug === "string" ? req.query.slug.slice(0, 80) : "";

  try {
    if (req.method === "POST") {
      res.setHeader("Cache-Control", "no-store");
      if (!slug) return res.status(400).json({ error: "Which event?" });
      return await register(req, res, db, slug);
    }
    if (req.method !== "GET") {
      res.setHeader("Allow", "GET, POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    res.setHeader("Cache-Control", "public, s-maxage=30, stale-while-revalidate=300");
    if (slug) {
      const { data } = await db.from("events").select(PUBLIC_FIELDS).eq("slug", slug).in("status", ["published", "cancelled"]).maybeSingle();
      if (!data) return res.status(404).json({ error: "We couldn't find that event." });
      const row = data as unknown as Row;
      return res.status(200).json({ event: toPublic(row, (await seatsTaken(db, [row.id])).get(row.id) ?? 0) });
    }

    // Upcoming, plus the last 90 days for a "past events" list.
    const { data, error } = await db
      .from("events")
      .select(PUBLIC_FIELDS)
      .eq("status", "published")
      .gte("starts_at", new Date(Date.now() - 90 * DAY_MS).toISOString())
      .order("starts_at")
      .limit(60);
    if (error) throw new Error(error.message);
    const rows = (data ?? []) as unknown as Row[];
    const taken = await seatsTaken(db, rows.map((r) => r.id));
    return res.status(200).json({ events: rows.map((r) => toPublic(r, taken.get(r.id) ?? 0)) });
  } catch (err) {
    console.error("events failed:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
