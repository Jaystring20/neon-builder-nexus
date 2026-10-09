/**
 * Emails for the Book a call route and the discovery alert. Server-side only
 * (imported by api/lead.ts and api/discovery.ts).
 *
 * Three jobs:
 * - alert DCH the moment a lead arrives, with everything needed before a call;
 * - confirm to the lead what happens next, with their booking link;
 * - nudge two days later, in case they left without picking a time.
 */

import type { EmailPayload } from "./resend.v3.js";
import { describe, type LeadIntake, type LeadRouting } from "../data/leadIntake.js";
import { calendlyUrl } from "./booking.js";

const SITE = "https://www.digitalcreativeshubltd.com";

/** Where lead alerts go: DCH's Gmail, the same inbox Calendly notifies. LEAD_ALERT_EMAIL overrides it. */
export const alertInbox = () => process.env.LEAD_ALERT_EMAIL || "digitalcreativeshubltd@gmail.com";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const shell = (body: string) => `<!doctype html><html><body style="margin:0;background:#f4f5f7;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#111827">
<div style="max-width:560px;margin:0 auto;padding:32px 24px">
<div style="background:#ffffff;border:1px solid #e5e7eb;padding:32px">${body}</div>
<p style="margin-top:16px;font-size:12px;color:#6b7280">Digital Creatives Hub Ltd · Strategy. Creativity. Growth. Without limits.</p>
</div></body></html>`;

const button = (href: string, label: string) =>
  `<a href="${esc(href)}" style="display:inline-block;background:#e07a3f;color:#111827;font-weight:700;text-decoration:none;padding:14px 22px">${esc(label)}</a>`;

const rows = (pairs: [string, string | undefined][]) =>
  `<table style="width:100%;border-collapse:collapse;font-size:14px">${pairs
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px 8px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;vertical-align:top">${esc(v!).replace(/\n/g, "<br>")}</td></tr>`,
    )
    .join("")}</table>`;

const PRIORITY_LABEL = { high: "HIGH", medium: "MEDIUM", low: "LOW" } as const;

export function leadAlertEmail(lead: LeadIntake, route: LeadRouting): EmailPayload {
  return {
    to: alertInbox(),
    replyTo: lead.email,
    subject: `[${PRIORITY_LABEL[route.priority]}] New call request: ${lead.name}${lead.company ? `, ${lead.company}` : ""}`,
    html: shell(`
<p style="margin:0;font-size:13px;color:#0f766e;font-weight:600">New lead · Book a call</p>
<h1 style="margin:8px 0 4px;font-size:22px">${esc(lead.name)}</h1>
<p style="margin:0 0 20px;color:#4b5563">${esc(describe.clientType(lead.clientType))}${lead.company ? ` · ${esc(lead.company)}` : ""}</p>
<p style="margin:0 0 6px;font-size:13px;color:#6b7280">The problem, in their words</p>
<p style="margin:0 0 20px;font-size:16px;line-height:1.5">${esc(lead.problem).replace(/\n/g, "<br>")}</p>
${rows([
  ["Priority", PRIORITY_LABEL[route.priority]],
  ["Points to", route.practiceTitle],
  ["First step", route.engagement],
  ["Needs", lead.needs.map(describe.need).join("; ")],
  ["Budget", describe.budget(lead.currency, lead.budget)],
  ["Timeline", describe.timeline(lead.timeline)],
  ["Email", lead.email],
  ["Phone / WhatsApp", lead.phone],
])}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280">They were sent to Calendly to pick a time. Reply to this email to write to them directly.</p>`),
  };
}

export function leadConfirmationEmail(lead: LeadIntake, route: LeadRouting): EmailPayload {
  const first = lead.name.split(/\s+/)[0];
  const book = calendlyUrl("intro", { name: lead.name, email: lead.email, notes: route.summary });
  return {
    to: lead.email,
    subject: "Your call with Digital Creatives Hub",
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">Thanks, ${esc(first)}.</h1>
<p style="margin:0 0 16px;line-height:1.6">We have your answers. Here's what happens next:</p>
<ol style="margin:0 0 20px;padding-left:20px;line-height:1.7">
<li>Pick a time that suits you, if you haven't already.</li>
<li>We read your answers before the call, so no time goes on background.</li>
<li>On the call we agree the right first move${route.practice ? `, most likely through <strong>${esc(route.practiceTitle)}</strong>` : ""}.</li>
</ol>
<p style="margin:0 0 24px">${button(book, "Pick a time")}</p>
<p style="margin:0;font-size:14px;color:#4b5563">Already booked? You'll get a calendar invite from Calendly. Want to add anything before we talk? Just reply to this email.</p>`),
  };
}

export function leadNudgeEmail(lead: LeadIntake, route: LeadRouting): { subject: string; html: string } {
  const first = lead.name.split(/\s+/)[0];
  const book = calendlyUrl("intro", { name: lead.name, email: lead.email, notes: route.summary });
  const learn = route.practice ? `${SITE}/services/${route.practice}` : `${SITE}/services`;
  return {
    subject: "Still want to talk it through?",
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">${esc(first)}, a quick follow-up.</h1>
<p style="margin:0 0 16px;line-height:1.6">You told us about this:</p>
<p style="margin:0 0 20px;padding-left:12px;border-left:3px solid #e07a3f;line-height:1.6;color:#374151">${esc(lead.problem)}</p>
<p style="margin:0 0 24px;line-height:1.6">If it's still on your mind, pick a time and we'll come prepared.</p>
<p style="margin:0 0 24px">${button(book, "Pick a time")}</p>
<p style="margin:0 0 8px;font-size:14px;color:#4b5563">Want to read up first? <a href="${esc(learn)}" style="color:#0f766e">See how we work on ${esc(route.practiceTitle === "To be decided on the call" ? "this" : route.practiceTitle)}</a>.</p>
<p style="margin:0;font-size:14px;color:#4b5563">Already booked? Ignore this, and we'll see you soon.</p>`),
  };
}

/** Alert DCH when someone completes the discovery and leaves their email. */
export function discoveryAlertEmail(
  email: string,
  result: { segment: string; program: string; capabilityGap: string | null },
  answers: Record<string, unknown>,
  offer?: string,
): EmailPayload {
  const text = (k: string) => (typeof answers[k] === "string" ? (answers[k] as string) : undefined);
  return {
    to: alertInbox(),
    replyTo: email,
    subject: `New discovery result: ${email} (${result.program})`,
    html: shell(`
<p style="margin:0;font-size:13px;color:#0f766e;font-weight:600">New lead · Discovery form</p>
<h1 style="margin:8px 0 20px;font-size:22px">${esc(email)}</h1>
${rows([
  ["Result", `${result.program} (${result.segment})`],
  ["Recommended", offer || undefined],
  ["Building", text("q2_vision")],
  ["Edge", text("q8_advantage")],
  ["90-day win", text("q10_priority")],
  ["Gap flagged", result.capabilityGap ?? undefined],
])}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280">They received the emailed breakdown. If they book, it comes through the discovery-call event in Calendly.</p>`),
  };
}

export interface DigestLead {
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  priority: string;
  practice: string | null;
  problem: string;
}
export interface DigestDiscovery {
  created_at: string;
  email: string;
  program: string;
}

/**
 * Monday summary to DCH: the week's leads, highest priority first. Also proof,
 * once a week, that the database and email are both alive.
 */
export function weeklyDigestEmail(leads: DigestLead[], discoveries: DigestDiscovery[]): EmailPayload {
  const order = { high: 0, medium: 1, low: 2 } as Record<string, number>;
  const sorted = [...leads].sort((a, b) => (order[a.priority] ?? 3) - (order[b.priority] ?? 3));
  const high = leads.filter((l) => l.priority === "high").length;
  const day = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });

  const leadRows = sorted.length
    ? sorted
        .map(
          (l) => `<tr>
<td style="padding:10px 12px 10px 0;vertical-align:top;font-size:12px;font-weight:700;color:${l.priority === "high" ? "#b45309" : "#6b7280"}">${esc(l.priority.toUpperCase())}</td>
<td style="padding:10px 0;vertical-align:top;font-size:14px"><strong>${esc(l.name)}</strong>${l.company ? `, ${esc(l.company)}` : ""} · <a href="mailto:${esc(l.email)}" style="color:#0f766e">${esc(l.email)}</a><br>
<span style="color:#4b5563">${esc(l.problem.length > 160 ? `${l.problem.slice(0, 157)}...` : l.problem)}</span><br>
<span style="font-size:12px;color:#6b7280">${esc(day(l.created_at))}${l.practice ? ` · ${esc(l.practice)}` : ""}</span></td></tr>`,
        )
        .join("")
    : `<tr><td style="padding:10px 0;color:#6b7280">No Book a call requests this week.</td></tr>`;

  const discoveryRows = discoveries.length
    ? discoveries
        .map((d) => `<li style="margin:0 0 6px">${esc(d.email)}: ${esc(d.program)} <span style="color:#6b7280">(${esc(day(d.created_at))})</span></li>`)
        .join("")
    : `<li style="color:#6b7280">None this week.</li>`;

  return {
    to: alertInbox(),
    subject: `Weekly leads: ${leads.length} call request${leads.length === 1 ? "" : "s"}${high ? ` (${high} high)` : ""}, ${discoveries.length} diagnostic${discoveries.length === 1 ? "" : "s"}`,
    html: shell(`
<p style="margin:0;font-size:13px;color:#0f766e;font-weight:600">Weekly summary · last 7 days</p>
<h1 style="margin:8px 0 20px;font-size:22px">${leads.length} call request${leads.length === 1 ? "" : "s"}, ${discoveries.length} diagnostic${discoveries.length === 1 ? "" : "s"}</h1>
<h2 style="margin:0 0 8px;font-size:15px">Book a call</h2>
<table style="width:100%;border-collapse:collapse">${leadRows}</table>
<h2 style="margin:24px 0 8px;font-size:15px">Growth diagnostic</h2>
<ul style="margin:0;padding-left:18px;font-size:14px">${discoveryRows}</ul>
<p style="margin:24px 0 0;font-size:12px;color:#6b7280">This email also confirms the website, database and email are all running.</p>`),
  };
}

/** The one-time sign-in link for the admin dashboard. */
export function adminLoginEmail(to: string, name: string, link: string, minutes: number): EmailPayload {
  return {
    to,
    subject: "Your sign-in link for the DCH dashboard",
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">Sign in${name ? `, ${esc(name.split(/\s+/)[0])}` : ""}.</h1>
<p style="margin:0 0 24px;line-height:1.6">Use the button below to open the DCH dashboard. It works once, for the next ${minutes} minutes.</p>
<p style="margin:0 0 24px">${button(link, "Open the dashboard")}</p>
<p style="margin:0;font-size:14px;color:#4b5563">Didn't ask for this? Ignore it; nobody can sign in without this email.</p>`),
  };
}
