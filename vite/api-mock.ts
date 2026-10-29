/**
 * DEV-ONLY API mock for the Lovable preview.
 *
 * The admin dashboard and the lead/events flows talk to Vercel serverless
 * functions under /api. The Vite dev server (the preview) can't run those, so
 * without this every /api request falls through to index.html and /admin
 * crashes on the HTML "response".
 *
 * This plugin intercepts /api/* in `vite serve` only (apply: "serve") and
 * answers with realistic sample data matching the types in src/lib/adminApi.ts
 * and src/data/events.ts, so every screen — public site and /admin — can be
 * viewed in the preview. `vite build` is untouched: production keeps using the
 * real serverless functions.
 *
 * NOTE: writes are accepted ({ ok: true }) but nothing persists or emails.
 */

import type { Plugin } from "vite";
import type { IncomingMessage, ServerResponse } from "http";

const iso = (offsetMs: number) => new Date(Date.now() + offsetMs).toISOString();
const days = (n: number) => iso(n * 86_400_000);

const TEAM = [
  { id: "t1", email: "digitalcreativeshubltd@gmail.com", name: "Jeremiah Adeyemi", role: "owner" as const, active: true, created_at: days(-120), last_seen_at: iso(-3_600_000) },
  { id: "t2", email: "gideon@digitalcreativeshub.com", name: "Gideon Olawuyi", role: "manager" as const, active: true, created_at: days(-90), last_seen_at: days(-2) },
  { id: "t3", email: "editor@digitalcreativeshub.com", name: "Tola Adebayo", role: "editor" as const, active: true, created_at: days(-60), last_seen_at: days(-5) },
  { id: "t4", email: "viewer@digitalcreativeshub.com", name: "Sam Okon", role: "viewer" as const, active: false, created_at: days(-30), last_seen_at: null },
];

const LEADS = [
  { id: "l1", created_at: iso(-3_600_000), source: "Instagram", name: "Amara Okafor", email: "amara@bellafrocentre.ng", company: "Bella Fro Centre", client_type: "established", practice: "Brand Architecture", priority: "high" as const, status: "new" as const, call_at: null, assigned_to: null, budget: "1,500,000", currency: "NGN" as const, timeline: "1–3 months" },
  { id: "l2", created_at: days(-1), source: "Referral", name: "Tunde Balogun", email: "tunde@veridiafoods.com", company: "Veridia Foods", client_type: "established", practice: "Growth Operations", priority: "medium" as const, status: "contacted" as const, call_at: null, assigned_to: "t2", budget: "800,000", currency: "NGN" as const, timeline: "3–6 months" },
  { id: "l3", created_at: days(-2), source: "Growth Diagnostic", name: "Chidinma Eze", email: "chidinma@soteriaeye.ng", company: "Soteria Eye Clinic", client_type: "established", practice: "Digital Infrastructure", priority: "high" as const, status: "booked" as const, call_at: iso(86_400_000), assigned_to: "t1", budget: "2,500,000", currency: "NGN" as const, timeline: "1–3 months" },
  { id: "l4", created_at: days(-9), source: "Event", name: "Femi Adeyinka", email: "femi@mh-eyewear.com", company: "MH Eyewear", client_type: "startup", practice: "Brand Architecture", priority: "medium" as const, status: "won" as const, call_at: days(-6), assigned_to: "t1", budget: "1,200,000", currency: "NGN" as const, timeline: "Immediately" },
  { id: "l5", created_at: days(-4), source: "Google", name: "Zainab Musa", email: "zainab@innerspace.design", company: "Innerspace Interiors", client_type: "startup", practice: "AI Enablement", priority: "low" as const, status: "new" as const, call_at: null, assigned_to: null, budget: "450,000", currency: "NGN" as const, timeline: "6–12 months" },
  { id: "l6", created_at: days(-21), source: "LinkedIn", name: "David Okoro", email: "david@ecopath.ng", company: "EcoPath", client_type: "established", practice: "Growth Operations", priority: "medium" as const, status: "lost" as const, call_at: days(-15), assigned_to: "t2", budget: "2,000,000", currency: "NGN" as const, timeline: "Not urgent" },
];

const DIAGNOSTICS = [
  { id: "d1", email: "amara@bellafrocentre.ng", segment: "established", program: "Brand Momentum Engine", capability_gap: "Brand clarity", created_at: iso(-7_200_000), updated_at: iso(-7_200_000), lead: { id: "l1", status: "new" as const, priority: "high" as const } },
  { id: "d2", email: "kola@ddolearning.org", segment: "startup", program: "Launch Runway", capability_gap: "Digital infrastructure", created_at: days(-1), updated_at: days(-1), lead: null },
  { id: "d3", email: "nkechi@vieraamber.com", segment: "established", program: "Done-With-You Sprint", capability_gap: "Team capability", created_at: days(-3), updated_at: days(-3), lead: { id: "l2", status: "contacted" as const, priority: "medium" as const } },
  { id: "d4", email: "seun@everythinghousehold.ng", segment: "personal-brand", program: "Creator Accelerator", capability_gap: "Content systems", created_at: days(-6), updated_at: days(-6), lead: null },
];

const ACTIVITY = [
  { id: "a1", action: "Status changed to Call booked", entity_type: "lead", entity_id: "l3", detail: { from: "contacted", to: "booked" }, created_at: iso(-86_400_000), actor: { name: "Jeremiah Adeyemi", email: "digitalcreativeshubltd@gmail.com" } },
  { id: "a2", action: "Lead created", entity_type: "lead", entity_id: "l1", detail: { source: "Instagram" }, created_at: iso(-3_600_000), actor: null },
  { id: "a3", action: "Note added", entity_type: "diagnostic", entity_id: "d1", detail: {}, created_at: days(-1), actor: { name: "Gideon Olawuyi", email: "gideon@digitalcreativeshub.com" } },
];

const EVENT_LIST = [
  { id: "e1", slug: "ai-for-business-growth", title: "AI for Business Growth", kind: "webinar" as const, starts_at: iso(5 * 86_400_000), ends_at: iso(5 * 86_400_000 + 3_600_000), status: "published" as const, price_ngn: 0, capacity: 200, location_type: "online" as const, counts: { confirmed: 64, pending_payment: 0 } },
  { id: "e2", slug: "brand-architecture-workshop", title: "Brand Architecture Workshop", kind: "workshop" as const, starts_at: iso(12 * 86_400_000), ends_at: iso(12 * 86_400_000 + 10_800_000), status: "published" as const, price_ngn: 25000, capacity: 40, location_type: "hybrid" as const, counts: { confirmed: 18, pending_payment: 6 } },
  { id: "e3", slug: "founders-masterclass", title: "Founders Masterclass: The 4 Pillars of Momentum", kind: "masterclass" as const, starts_at: iso(-14 * 86_400_000), ends_at: iso(-14 * 86_400_000 + 7_200_000), status: "published" as const, price_ngn: 10000, capacity: null, location_type: "online" as const, counts: { attended: 41, no_show: 7 } },
  { id: "e4", slug: "lagos-creatives-meetup", title: "Lagos Creatives Meetup", kind: "meetup" as const, starts_at: iso(20 * 86_400_000), ends_at: iso(20 * 86_400_000 + 14_400_000), status: "draft" as const, price_ngn: 0, capacity: 80, location_type: "in_person" as const, counts: {} },
];

const REGISTRATIONS = [
  { id: "r1", name: "Amara Okafor", email: "amara@bellafrocentre.ng", phone: "+234 802 000 1111", organisation: "Bella Fro Centre", note: null, status: "confirmed" as const, reference: "DCH-7K4QX2", paid_amount: 25000, lead_id: "l1", created_at: days(-2), updated_at: days(-1) },
  { id: "r2", name: "Tunde Balogun", email: "tunde@veridiafoods.com", phone: null, organisation: "Veridia Foods", note: "Bringing a partner", status: "pending_payment" as const, reference: "DCH-AB3CDE", paid_amount: null, lead_id: "l2", created_at: days(-1), updated_at: days(-1) },
  { id: "r3", name: "Zainab Musa", email: "zainab@innerspace.design", phone: "+234 803 555 2222", organisation: null, note: null, status: "attended" as const, reference: "DCH-QW9RST", paid_amount: 25000, lead_id: "l5", created_at: days(-5), updated_at: days(-3) },
];

const PUBLIC_EVENTS = EVENT_LIST.filter((e) => e.status === "published").map((e) => ({
  slug: e.slug,
  title: e.title,
  kind: e.kind,
  summary: "A live DCH session on building momentum for your business.",
  description: "Join the Digital Creatives Hub team for a hands-on session covering strategy, technology and human potential.",
  starts_at: e.starts_at,
  ends_at: e.ends_at,
  location_type: e.location_type,
  venue: e.location_type === "online" ? "Online" : "Lagos, Nigeria",
  image_url: null,
  price_ngn: e.price_ngn,
  status: e.status,
  spots_left: e.capacity ? Math.max(0, e.capacity - (e.counts.confirmed ?? 0)) : null,
}));

function eventRecord(id: string) {
  const e = EVENT_LIST.find((x) => x.id === id) ?? EVENT_LIST[0];
  return {
    id: e.id,
    slug: e.slug,
    title: e.title,
    kind: e.kind,
    summary: "A live DCH session on building momentum for your business.",
    description: "Join the Digital Creatives Hub team for a hands-on session covering strategy, technology and human potential.",
    starts_at: e.starts_at,
    ends_at: e.ends_at,
    location_type: e.location_type,
    venue: e.location_type === "online" ? "Online" : "Lagos, Nigeria",
    image_url: null,
    price_ngn: e.price_ngn,
    status: e.status,
    join_url: "https://example.com/join",
    capacity: e.capacity,
    payment_instructions: "Transfer to Digital Creatives Hub Ltd, GTBank 0123456789. Quote your reference.",
    reminder_sent_at: null,
    created_at: days(-10),
    updated_at: days(-1),
  };
}

const json = (res: ServerResponse, status: number, body: unknown) => {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const readBody = async (req: IncomingMessage): Promise<unknown> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
  } catch {
    return {};
  }
};

async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
  const url = new URL(req.url ?? "/", "http://localhost");
  const path = url.pathname;
  const op = url.searchParams.get("op") ?? "";
  const q = (k: string) => url.searchParams.get(k) ?? "";

  // ---- admin dashboard -----------------------------------------------------
  if (path === "/api/admin") {
    if (req.method !== "GET" && req.method !== "POST") return json(res, 405, { error: "Method not allowed" });
    switch (op) {
      case "me":
        return json(res, 200, { user: { id: "t1", email: TEAM[0].email, name: TEAM[0].name, role: "owner" } });
      case "login":
      case "verify":
      case "logout":
        return json(res, 200, { ok: true });
      case "overview":
        return json(res, 200, {
          leads: {
            total: LEADS.length,
            thisWeek: 3,
            openHigh: LEADS.filter((l) => l.priority === "high" && !["won", "lost"].includes(l.status)).length,
            byStatus: Object.fromEntries(["new", "contacted", "booked", "won", "lost"].map((s) => [s, LEADS.filter((l) => l.status === s).length])),
          },
          diagnostics: { total: DIAGNOSTICS.length, thisWeek: 2 },
          upcoming: LEADS.filter((l) => l.call_at && !["won", "lost"].includes(l.status)).map((l) => ({ id: l.id, name: l.name, company: l.company, call_at: l.call_at! })),
          activity: ACTIVITY,
          events: EVENT_LIST.filter((e) => (e.status as string) !== "cancelled").map((e) => ({
            id: e.id, title: e.title, starts_at: e.starts_at, capacity: e.capacity,
            registered: (e.counts.confirmed ?? 0) + (e.counts.pending_payment ?? 0) + (e.counts.attended ?? 0),
            awaitingPayment: e.counts.pending_payment ?? 0,
          })),
        });
      case "leads":
        return json(res, 200, { leads: LEADS });
      case "lead": {
        const lead = LEADS.find((l) => l.id === q("id")) ?? LEADS[0];
        return json(res, 200, {
          lead: { ...lead, phone: "+234 802 345 6789", needs: ["Brand strategy", "Website"], problem: "Growth has plateaued and the brand no longer reflects where the business is going.", discovery_id: null },
          notes: [{ id: "n1", body: "Introduced by a past client. Very warm — follow up this week.", created_at: days(-1), author: { name: "Gideon Olawuyi", email: "gideon@digitalcreativeshub.com" } }],
          activity: ACTIVITY,
          events: REGISTRATIONS.slice(0, 1).map((r) => ({ id: r.id, status: r.status, reference: r.reference, created_at: r.created_at, event: { id: "e1", title: EVENT_LIST[0].title, starts_at: EVENT_LIST[0].starts_at } })),
        });
      }
      case "diagnostics":
        return json(res, 200, { diagnostics: DIAGNOSTICS });
      case "diagnostic": {
        const d = DIAGNOSTICS.find((x) => x.id === q("id")) ?? DIAGNOSTICS[0];
        const { lead, ...row } = d;
        return json(res, 200, {
          diagnostic: { ...row, answers: { stage: "established", biggest_challenge: "Inconsistent revenue", audience: "B2B", email: d.email } },
          lead: lead ? { id: lead.id, status: lead.status } : null,
          notes: [],
          activity: ACTIVITY,
        });
      }
      case "diagnostic-to-lead":
        return json(res, 200, { leadId: "l1" });
      case "funnel":
        return json(res, 200, {
          ready: true,
          days: Number(q("days")) || 30,
          started: 214,
          steps: [
            { step: 1, reached: 214, question: "What are you building?" },
            { step: 2, reached: 168, question: "Where does growth stall?" },
            { step: 3, reached: 132, question: "Who do you serve?" },
            { step: 4, reached: 108, question: "What have you tried?" },
            { step: 5, reached: 96, question: "Where should we send the blueprint?" },
          ],
          finished: 96,
          emailed: 61,
          openedBooking: 38,
          booked: 17,
          sources: [
            { source: "instagram", started: 90, finished: 41, emailed: 28 },
            { source: "google", started: 68, finished: 32, emailed: 19 },
            { source: "direct", started: 56, finished: 23, emailed: 14 },
          ],
        });
      case "team":
        return json(res, 200, { team: TEAM });
      case "team-save":
        return json(res, 200, { ok: true, id: "t-new" });
      case "content":
        return json(res, 200, { value: null, updatedAt: null, updatedBy: null, versions: [] });
      case "content-save":
      case "content-reset":
      case "content-restore":
        return json(res, 200, { ok: true });
      case "upload-url":
        return json(res, 200, { uploadUrl: "http://localhost/upload-mock", publicUrl: "" });
      case "deck-upload-url":
        return json(res, 200, { uploadUrl: "http://localhost/upload-mock", path: "decks/mock.pdf" });
      case "deck-send":
        return json(res, 200, { ok: true, to: "amara@bellafrocentre.ng", followupsCancelled: 0, leadId: "l1" });
      case "events":
        return json(res, 200, { events: EVENT_LIST });
      case "event":
        return json(res, 200, { event: eventRecord(q("id") || "e1"), registrations: REGISTRATIONS });
      case "event-save":
        return json(res, 200, { id: q("id") || "e-new" });
      case "event-cancel":
        return json(res, 200, { ok: true, emailed: 24 });
      case "registration-update":
        return json(res, 200, { ok: true, emailed: false });
      case "registration-resend":
        return json(res, 200, { ok: true });
      case "note":
      case "lead-update":
        return json(res, 200, { ok: true });
      default:
        return json(res, 400, { error: `Unknown admin op "${op}" (preview mock).` });
    }
  }

  // ---- public site endpoints ----------------------------------------------
  if (path === "/api/content") return json(res, 200, { content: {} });

  if (path === "/api/events") {
    if (req.method === "POST") return json(res, 200, { ok: true, status: "confirmed", emailed: false });
    const slug = q("slug");
    if (slug) {
      const e = PUBLIC_EVENTS.find((x) => x.slug === slug);
      return e ? json(res, 200, { event: e }) : json(res, 404, { error: "We couldn't find that event." });
    }
    return json(res, 200, { events: PUBLIC_EVENTS });
  }

  if (path === "/api/discovery") {
    if (op === "track") {
      res.statusCode = 204;
      res.end(); return;
    }
    return json(res, 200, { success: true, emailQueued: true });
  }

  if (path === "/api/lead") {
    return json(res, 200, { success: true, practice: "Brand Architecture", summary: "Thanks — we'll be in touch within one business day." });
  }

  if (path === "/api/health") return json(res, 200, { ok: true, db: "up (preview mock)", ms: 0 });

  return json(res, 404, { error: `No preview mock for ${path}` });
}

export const apiMock = (): Plugin => ({
  name: "preview-api-mock",
  apply: "serve",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (!req.url?.startsWith("/api/")) return next();
      handle(req, res).catch((err) => {
        console.error("preview-api-mock failed:", err);
        if (!res.headersSent) json(res, 500, { error: "Preview mock error" });
      });
    });
  },
});
