/**
 * /api/admin?op=…: everything the /admin dashboard reads and changes.
 *
 * One function rather than many, to stay well inside the Vercel Hobby
 * function limit. Every op except login and verify needs a valid session, and
 * each checks the person's current role (src/data/adminRoles.ts) before
 * touching data. All reads and writes use the service role, so RLS stays
 * closed to the browser.
 *
 * Writes must be POST with the X-DCH-Admin header: a cross-site form cannot
 * set it, which, with the SameSite cookie, keeps other sites from acting as a
 * signed-in team member.
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabase, missingServerEnv } from "../src/lib/supabase.server.js";
import { sendEmailViaResendDetailed } from "../src/lib/resend.v3.js";
import { adminLoginEmail } from "../src/lib/leadEmails.js";
import {
  LINK_MINUTES,
  SESSION_COOKIE,
  createSession,
  hashToken,
  newLoginToken,
  readCookie,
  readSession,
  sessionCookie,
  siteOrigin,
} from "../src/lib/adminAuth.server.js";
import { LEAD_STATUSES, ROLES, can, type Permission, type Role } from "../src/data/adminRoles.js";
import { CONTENT_KEYS, TIER_KEYS, defaultProgrammes, type ContentKey, type ProgrammesContent } from "../src/data/siteContent.js";
import { CONTENT_SCHEMAS } from "../src/data/siteContentSchemas.js";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  active: boolean;
}

type Ctx = { req: VercelRequest; res: VercelResponse; db: SupabaseClient; body: Record<string, unknown> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const str = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const isSecure = (req: VercelRequest) => !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(req.headers.host ?? "");

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function must<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  return result.data as T;
}

async function log(db: SupabaseClient, actor: AdminUser, action: string, entityType: string | null, entityId: string | null, detail: Record<string, unknown> = {}) {
  const { error } = await db.from("admin_activity").insert([{ actor_id: actor.id, action, entity_type: entityType, entity_id: entityId, detail }]);
  if (error) console.error("admin_activity insert failed:", error.message);
}

async function currentUser({ req, db }: Ctx): Promise<AdminUser | null> {
  const id = readSession(readCookie(req.headers.cookie, SESSION_COOKIE));
  if (!id || !UUID_RE.test(id)) return null;
  const { data } = await db.from("admin_users").select("id,email,name,role,active").eq("id", id).maybeSingle();
  if (!data || !data.active) return null;
  return data as AdminUser;
}

function allow(user: AdminUser | null, p: Permission): AdminUser {
  if (!user) throw new HttpError(401, "Please sign in.");
  if (!can(user.role, p)) throw new HttpError(403, "Your role can't do that.");
  return user;
}

// ---------------------------------------------------------------- sign-in

async function login({ req, db, body }: Ctx) {
  const email = str(body.email, 200).toLowerCase();
  // Same answer whether or not the address is on the team, so the form can't
  // be used to find out who is.
  const ok = { ok: true };
  if (!EMAIL_RE.test(email)) throw new HttpError(400, "That email address doesn't look right.");

  const { data: user } = await db.from("admin_users").select("id,email,name,active").eq("email", email).maybeSingle();
  if (!user || !user.active) return ok;

  const since = new Date(Date.now() - LINK_MINUTES * 60_000).toISOString();
  const { count } = await db
    .from("admin_login_tokens")
    .select("token_hash", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) return ok;

  const token = newLoginToken();
  must(
    await db.from("admin_login_tokens").insert([
      { token_hash: hashToken(token), user_id: user.id, expires_at: new Date(Date.now() + LINK_MINUTES * 60_000).toISOString() },
    ]),
  );
  const link = `${siteOrigin(req.headers.host)}/admin/verify#token=${token}`;
  const sent = await sendEmailViaResendDetailed(adminLoginEmail(user.email, user.name, link, LINK_MINUTES));
  if (!sent.ok) {
    console.error("Admin sign-in email not sent:", sent.error);
    throw new HttpError(502, "We couldn't send the email just now. Please try again in a minute.");
  }
  return ok;
}

async function verify({ req, res, db, body }: Ctx) {
  const token = str(body.token, 200);
  if (!token) throw new HttpError(400, "This link is incomplete.");
  // Claim the token in one UPDATE, so the same link can't be used twice.
  const { data } = await db
    .from("admin_login_tokens")
    .update({ used_at: new Date().toISOString() })
    .eq("token_hash", hashToken(token))
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .select("user_id")
    .maybeSingle();
  if (!data) throw new HttpError(400, "This link has expired or was already used. Ask for a new one.");

  const { data: user } = await db.from("admin_users").select("id,active").eq("id", data.user_id).maybeSingle();
  if (!user?.active) throw new HttpError(403, "This account no longer has access.");

  const session = createSession(user.id);
  res.setHeader("Set-Cookie", sessionCookie(session.value, session.maxAge, isSecure(req)));
  await db.from("admin_users").update({ last_seen_at: new Date().toISOString() }).eq("id", user.id);
  return { ok: true };
}

function logout({ req, res }: Ctx) {
  res.setHeader("Set-Cookie", sessionCookie("", 0, isSecure(req)));
  return { ok: true };
}

// ---------------------------------------------------------------- overview

async function overview(ctx: Ctx) {
  allow(await currentUser(ctx), "overview");
  const { db } = ctx;
  const weekAgo = new Date(Date.now() - WEEK_MS).toISOString();
  const now = new Date().toISOString();

  const [leads, diagnosticsWeek, diagnosticsTotal, upcoming, activity] = await Promise.all([
    db.from("leads").select("status,priority,created_at"),
    db.from("discovery_results").select("id", { count: "exact", head: true }).gte("updated_at", weekAgo),
    db.from("discovery_results").select("id", { count: "exact", head: true }),
    db.from("leads").select("id,name,company,call_at").gte("call_at", now).order("call_at").limit(5),
    db.from("admin_activity").select("action,entity_type,entity_id,detail,created_at,actor:admin_users(name,email)").order("created_at", { ascending: false }).limit(10),
  ]);

  const rows = must(leads) as { status: string; priority: string; created_at: string }[];
  const byStatus = Object.fromEntries(LEAD_STATUSES.map((s) => [s, rows.filter((r) => r.status === s).length]));
  return {
    leads: {
      total: rows.length,
      thisWeek: rows.filter((r) => r.created_at >= weekAgo).length,
      openHigh: rows.filter((r) => r.priority === "high" && (r.status === "new" || r.status === "contacted")).length,
      byStatus,
    },
    diagnostics: { total: diagnosticsTotal.count ?? 0, thisWeek: diagnosticsWeek.count ?? 0 },
    upcoming: must(upcoming),
    activity: must(activity),
  };
}

// ---------------------------------------------------------------- leads

async function leadsList(ctx: Ctx) {
  allow(await currentUser(ctx), "leads.read");
  const q = ctx.req.query;
  let query = ctx.db
    .from("leads")
    .select("id,created_at,source,name,email,company,client_type,practice,priority,status,call_at,assigned_to,budget,currency,timeline")
    .order("created_at", { ascending: false })
    .limit(300);
  const status = str(q.status, 20);
  const priority = str(q.priority, 20);
  // Keep only characters that can't break PostgREST's or() syntax.
  const search = str(q.q, 80).replace(/[^\p{L}\p{N}@._\- ]/gu, "");
  if ((LEAD_STATUSES as readonly string[]).includes(status)) query = query.eq("status", status);
  if (["high", "medium", "low"].includes(priority)) query = query.eq("priority", priority);
  if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%`);
  return { leads: must(await query) };
}

async function notesAndActivity(db: SupabaseClient, type: "lead" | "diagnostic", id: string) {
  const [notes, activity] = await Promise.all([
    db.from("admin_notes").select("id,body,created_at,author:admin_users(name,email)").eq("entity_type", type).eq("entity_id", id).order("created_at", { ascending: false }),
    db.from("admin_activity").select("id,action,detail,created_at,actor:admin_users(name,email)").eq("entity_type", type).eq("entity_id", id).order("created_at", { ascending: false }).limit(50),
  ]);
  return { notes: must(notes), activity: must(activity) };
}

async function leadDetail(ctx: Ctx) {
  allow(await currentUser(ctx), "leads.read");
  const id = str(ctx.req.query.id, 40);
  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown lead.");
  const lead = must(await ctx.db.from("leads").select("*").eq("id", id).maybeSingle());
  if (!lead) throw new HttpError(404, "Lead not found.");
  return { lead, ...(await notesAndActivity(ctx.db, "lead", id)) };
}

async function leadUpdate(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "leads.write");
  const { db, body } = ctx;
  const id = str(body.id, 40);
  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown lead.");
  const before = must(await db.from("leads").select("status,call_at,assigned_to").eq("id", id).maybeSingle()) as Record<string, unknown> | null;
  if (!before) throw new HttpError(404, "Lead not found.");

  const patch: Record<string, unknown> = {};
  if ("status" in body) {
    if (!(LEAD_STATUSES as readonly string[]).includes(body.status as string)) throw new HttpError(400, "Unknown status.");
    patch.status = body.status;
  }
  if ("call_at" in body) {
    if (body.call_at === null || body.call_at === "") patch.call_at = null;
    else {
      const t = new Date(str(body.call_at, 40));
      if (Number.isNaN(t.getTime())) throw new HttpError(400, "That call date isn't valid.");
      patch.call_at = t.toISOString();
    }
  }
  if ("assigned_to" in body) {
    const a = body.assigned_to;
    if (a === null || a === "") patch.assigned_to = null;
    else if (typeof a === "string" && UUID_RE.test(a)) patch.assigned_to = a;
    else throw new HttpError(400, "Unknown team member.");
  }
  if (Object.keys(patch).length === 0) throw new HttpError(400, "Nothing to change.");
  // A call date means a call is booked, unless they've already moved past it.
  if (patch.call_at && !patch.status && (before.status === "new" || before.status === "contacted")) patch.status = "booked";

  must(await db.from("leads").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", id));
  for (const [field, to] of Object.entries(patch)) {
    if (before[field] !== to) await log(db, user, `lead.${field}`, "lead", id, { from: before[field] ?? null, to });
  }
  return { ok: true };
}

async function noteAdd(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "leads.write");
  const { db, body } = ctx;
  const type = body.entity_type === "diagnostic" ? "diagnostic" : body.entity_type === "lead" ? "lead" : null;
  const id = str(body.entity_id, 40);
  const text = str(body.body, 4000);
  if (!type || !UUID_RE.test(id)) throw new HttpError(400, "Unknown record.");
  if (!text) throw new HttpError(400, "Write something first.");
  must(await db.from("admin_notes").insert([{ entity_type: type, entity_id: id, author_id: user.id, body: text }]));
  await log(db, user, "note.add", type, id);
  return { ok: true };
}

// ---------------------------------------------------------------- diagnostics

async function diagnosticsList(ctx: Ctx) {
  allow(await currentUser(ctx), "leads.read");
  const rows = must(
    await ctx.db.from("discovery_results").select("id,email,segment,program,capability_gap,created_at,updated_at").order("updated_at", { ascending: false }).limit(300),
  ) as { id: string }[];
  const ids = rows.map((r) => r.id);
  const linked = ids.length
    ? (must(await ctx.db.from("leads").select("id,discovery_id,status").in("discovery_id", ids)) as { id: string; discovery_id: string; status: string }[])
    : [];
  const byDiscovery = new Map(linked.map((l) => [l.discovery_id, l]));
  return { diagnostics: rows.map((r) => ({ ...r, lead: byDiscovery.get(r.id) ?? null })) };
}

async function diagnosticDetail(ctx: Ctx) {
  allow(await currentUser(ctx), "leads.read");
  const id = str(ctx.req.query.id, 40);
  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown result.");
  const diagnostic = must(await ctx.db.from("discovery_results").select("*").eq("id", id).maybeSingle());
  if (!diagnostic) throw new HttpError(404, "Result not found.");
  const lead = must(await ctx.db.from("leads").select("id,status").eq("discovery_id", id).maybeSingle());
  return { diagnostic, lead, ...(await notesAndActivity(ctx.db, "diagnostic", id)) };
}

/** Put a diagnostic into the leads pipeline, so it's followed up like any call request. */
async function diagnosticToLead(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "leads.write");
  const { db, body } = ctx;
  const id = str(body.id, 40);
  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown result.");
  const existing = must(await db.from("leads").select("id").eq("discovery_id", id).maybeSingle()) as { id: string } | null;
  if (existing) return { leadId: existing.id };

  const d = must(await db.from("discovery_results").select("id,email,program,answers").eq("id", id).maybeSingle()) as
    | { id: string; email: string; program: string; answers: Record<string, unknown> }
    | null;
  if (!d) throw new HttpError(404, "Result not found.");
  const vision = typeof d.answers?.q2_vision === "string" ? d.answers.q2_vision : "";
  const win = typeof d.answers?.q10_priority === "string" ? d.answers.q10_priority : "";
  const problem = [`Growth diagnostic: ${d.program}.`, vision && `Building: ${vision}`, win && `90-day win: ${win}`].filter(Boolean).join("\n");

  const lead = must(
    await db
      .from("leads")
      .insert([
        {
          source: "diagnostic",
          discovery_id: d.id,
          name: d.email.split("@")[0],
          email: d.email,
          client_type: "business",
          problem,
          currency: "NGN",
          budget: "unsure",
          timeline: "exploring",
          priority: "medium",
        },
      ])
      .select("id")
      .single(),
  ) as { id: string };
  await log(db, user, "diagnostic.to_lead", "diagnostic", d.id, { lead_id: lead.id });
  await log(db, user, "lead.created_from_diagnostic", "lead", lead.id, { discovery_id: d.id });
  return { leadId: lead.id };
}

// ---------------------------------------------------------------- team

async function teamList(ctx: Ctx) {
  const user = await currentUser(ctx);
  if (!user) throw new HttpError(401, "Please sign in.");
  // Everyone signed in sees names (to assign leads); only owners see the rest.
  const full = can(user.role, "team.manage");
  const rows = must(
    await ctx.db.from("admin_users").select(full ? "id,email,name,role,active,created_at,last_seen_at" : "id,name,email,role,active").order("created_at"),
  );
  return { team: rows };
}

async function teamSave(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "team.manage");
  const { db, body } = ctx;
  const id = str(body.id, 40);
  const name = str(body.name, 120);
  const role = body.role as Role;
  const active = body.active !== false;
  if (!(ROLES as readonly string[]).includes(role)) throw new HttpError(400, "Choose a role.");

  if (!id) {
    const email = str(body.email, 200).toLowerCase();
    if (!EMAIL_RE.test(email)) throw new HttpError(400, "That email address doesn't look right.");
    const { data, error } = await db.from("admin_users").insert([{ email, name, role, active: true }]).select("id").single();
    if (error) throw new HttpError(400, error.code === "23505" ? "That person is already on the team." : error.message);
    await log(db, user, "team.add", null, null, { email, role });
    return { id: data.id };
  }

  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown team member.");
  if (id === user.id && (role !== user.role || !active)) throw new HttpError(400, "You can't change your own role or remove yourself.");
  const target = must(await db.from("admin_users").select("email,role,active").eq("id", id).maybeSingle()) as
    | { email: string; role: Role; active: boolean }
    | null;
  if (!target) throw new HttpError(404, "Unknown team member.");
  if (target.role === "owner" && target.active && (role !== "owner" || !active)) {
    const { count } = await db.from("admin_users").select("id", { count: "exact", head: true }).eq("role", "owner").eq("active", true);
    if ((count ?? 0) <= 1) throw new HttpError(400, "There must always be at least one active Owner.");
  }
  must(await db.from("admin_users").update({ name, role, active }).eq("id", id));
  await log(db, user, "team.update", null, null, { email: target.email, role, active });
  return { ok: true };
}

// ---------------------------------------------------------------- website content

const contentKey = (v: unknown): ContentKey => {
  if (!(CONTENT_KEYS as readonly unknown[]).includes(v)) throw new HttpError(400, "Unknown content.");
  return v as ContentKey;
};

/** Prices and the show-prices switch are the Owner's; other changes to those keys are anyone's with content.edit. */
const needsPrices = (key: ContentKey) => key === "settings";

async function contentGet(ctx: Ctx) {
  allow(await currentUser(ctx), "content.edit");
  const key = contentKey(ctx.req.query.key);
  const [row, versions] = await Promise.all([
    ctx.db.from("site_content").select("value,updated_at,editor:admin_users(name,email)").eq("key", key).maybeSingle(),
    ctx.db
      .from("site_content_versions")
      .select("id,value,saved_at,saver:admin_users(name,email)")
      .eq("key", key)
      .order("saved_at", { ascending: false })
      .limit(15),
  ]);
  const r = must(row) as { value: unknown; updated_at: string; editor: unknown } | null;
  return {
    value: r?.value ?? null,
    updatedAt: r?.updated_at ?? null,
    updatedBy: r?.editor ?? null,
    // Values stay on the server; the list only needs to say who and when.
    versions: (must(versions) as { id: string; value: unknown; saved_at: string; saver: unknown }[]).map((v) => ({
      id: v.id,
      savedAt: v.saved_at,
      savedBy: v.saver,
      reset: v.value === null,
    })),
  };
}

/** Write one key, or clear it (value null = back to the original content). */
async function writeContent(db: SupabaseClient, user: AdminUser, key: ContentKey, value: unknown | null, action: string) {
  if (needsPrices(key) && !can(user.role, "prices.edit")) throw new HttpError(403, "Only an Owner can change this.");

  let clean: unknown = null;
  if (value !== null) {
    const parsed = CONTENT_SCHEMAS[key].safeParse(value);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      throw new HttpError(400, issue ? `${issue.path.join(" › ") || "Content"}: ${issue.message}` : "That content isn't valid.");
    }
    clean = parsed.data;
  }

  if (key === "programmes" && !can(user.role, "prices.edit")) {
    // Keep the prices as they are: Editors change the words, Owners the numbers.
    const current = ((must(await db.from("site_content").select("value").eq("key", "programmes").maybeSingle()) as { value: ProgrammesContent } | null)
      ?.value ?? defaultProgrammes()) as ProgrammesContent;
    const next = (clean ?? defaultProgrammes()) as ProgrammesContent;
    for (const [segment, programme] of Object.entries(next)) {
      const before = current[segment] ?? defaultProgrammes()[segment];
      if (!programme || !before) continue;
      for (const tier of TIER_KEYS) programme[tier].price = { ...before[tier].price };
    }
    clean = next;
  }

  if (clean === null) must(await db.from("site_content").delete().eq("key", key));
  else must(await db.from("site_content").upsert({ key, value: clean, updated_by: user.id, updated_at: new Date().toISOString() }));
  must(await db.from("site_content_versions").insert([{ key, value: clean, saved_by: user.id }]));
  await log(db, user, action, null, null, { key });
}

async function contentSave(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "content.edit");
  await writeContent(ctx.db, user, contentKey(ctx.body.key), ctx.body.value ?? null, "content.save");
  return { ok: true };
}

async function contentReset(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "content.edit");
  const key = contentKey(ctx.body.key);
  if (key === "programmes" && !can(user.role, "prices.edit")) throw new HttpError(403, "Only an Owner can reset programmes, because it resets prices too.");
  await writeContent(ctx.db, user, key, null, "content.reset");
  return { ok: true };
}

async function contentRestore(ctx: Ctx) {
  const user = allow(await currentUser(ctx), "content.edit");
  const id = str(ctx.body.id, 40);
  if (!UUID_RE.test(id)) throw new HttpError(400, "Unknown version.");
  const v = must(await ctx.db.from("site_content_versions").select("key,value").eq("id", id).maybeSingle()) as { key: string; value: unknown } | null;
  if (!v) throw new HttpError(404, "Unknown version.");
  const key = contentKey(v.key);
  if (v.value === null && key === "programmes" && !can(user.role, "prices.edit")) throw new HttpError(403, "Only an Owner can restore this version.");
  await writeContent(ctx.db, user, key, v.value, "content.restore");
  return { ok: true };
}

const UPLOAD_TYPES: Record<string, string> = { "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png" };

/** A one-time link the browser uploads an image to, straight into Storage. */
async function uploadUrl(ctx: Ctx) {
  allow(await currentUser(ctx), "content.edit");
  const folder = ctx.body.folder === "leaders" ? "leaders" : ctx.body.folder === "portfolio" ? "portfolio" : null;
  const ext = UPLOAD_TYPES[str(ctx.body.contentType, 40)];
  if (!folder || !ext) throw new HttpError(400, "Upload a WebP, JPEG or PNG image.");
  const path = `${folder}/${Date.now()}-${newLoginToken().slice(0, 10)}.${ext}`;
  const bucket = ctx.db.storage.from("site-media");
  const { data, error } = await bucket.createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message ?? "No upload link");
  return { uploadUrl: data.signedUrl, publicUrl: bucket.getPublicUrl(path).data.publicUrl };
}

// ---------------------------------------------------------------- router

const OPS: Record<string, { method: "GET" | "POST"; run: (ctx: Ctx) => unknown }> = {
  login: { method: "POST", run: login },
  verify: { method: "POST", run: verify },
  logout: { method: "POST", run: logout },
  me: {
    method: "GET",
    run: async (ctx) => {
      const user = await currentUser(ctx);
      if (!user) throw new HttpError(401, "Please sign in.");
      return { user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    },
  },
  overview: { method: "GET", run: overview },
  leads: { method: "GET", run: leadsList },
  lead: { method: "GET", run: leadDetail },
  "lead-update": { method: "POST", run: leadUpdate },
  note: { method: "POST", run: noteAdd },
  diagnostics: { method: "GET", run: diagnosticsList },
  diagnostic: { method: "GET", run: diagnosticDetail },
  "diagnostic-to-lead": { method: "POST", run: diagnosticToLead },
  team: { method: "GET", run: teamList },
  "team-save": { method: "POST", run: teamSave },
  content: { method: "GET", run: contentGet },
  "content-save": { method: "POST", run: contentSave },
  "content-reset": { method: "POST", run: contentReset },
  "content-restore": { method: "POST", run: contentRestore },
  "upload-url": { method: "POST", run: uploadUrl },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Cache-Control", "no-store");
  const op = OPS[str(req.query.op, 40)];
  if (!op) return res.status(404).json({ error: "Unknown request." });
  if (req.method !== op.method) {
    res.setHeader("Allow", op.method);
    return res.status(405).json({ error: "Method not allowed." });
  }
  if (op.method === "POST" && req.headers["x-dch-admin"] !== "1") return res.status(403).json({ error: "Refused." });

  const missing = missingServerEnv();
  if (missing.length) return res.status(503).json({ error: `The server is missing: ${missing.join(", ")}` });

  let body: Record<string, unknown> = {};
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body ?? {});
  } catch {
    return res.status(400).json({ error: "Bad request." });
  }

  try {
    const out = await op.run({ req, res, db: getSupabase(), body });
    return res.status(200).json(out);
  } catch (err) {
    if (err instanceof HttpError) return res.status(err.status).json({ error: err.message });
    console.error(`admin ${req.query.op} failed:`, err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
