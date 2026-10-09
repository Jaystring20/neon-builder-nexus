/**
 * Emails for events (Phase 3). Server-side only: api/events.ts, api/admin.ts
 * and the daily cron.
 *
 * The join link only ever goes out in "you're in" and reminder emails to
 * confirmed registrants. Someone still awaiting payment gets the payment
 * details and their reference instead.
 */

import type { EmailPayload } from "./resend.v3.js";
import { SITE, alertInbox, button, esc, rows, shell } from "./leadEmails.js";
import { KIND_LABEL, LOCATION_LABEL, calendarLink, fmtEventWhen, fmtNaira, type EventRecord } from "../data/events.js";

export interface RegistrationRow {
  name: string;
  email: string;
  reference: string;
  phone?: string | null;
  organisation?: string | null;
}

const first = (name: string) => esc(name.split(/\s+/)[0] || name);
const pageUrl = (e: Pick<EventRecord, "slug">) => `${SITE}/events/${e.slug}`;

/** Where and how to attend, for someone who is confirmed. */
function attendBlock(e: EventRecord): string {
  const parts: string[] = [];
  if (e.location_type !== "in_person" && e.join_url) {
    parts.push(`<p style="margin:0 0 20px">${button(e.join_url, "Join link")}</p>
<p style="margin:0 0 20px;font-size:13px;color:#6b7280;word-break:break-all">Or copy this link: ${esc(e.join_url)}</p>`);
  } else if (e.location_type !== "in_person") {
    parts.push(`<p style="margin:0 0 20px;line-height:1.6">We'll email you the join link before we start.</p>`);
  }
  if (e.location_type !== "online" && e.venue) {
    parts.push(`<p style="margin:0 0 20px;line-height:1.6"><strong>Venue:</strong><br>${esc(e.venue).replace(/\n/g, "<br>")}</p>`);
  }
  return parts.join("");
}

const details = (e: EventRecord) =>
  rows([
    ["When", fmtEventWhen(e)],
    ["Format", `${KIND_LABEL[e.kind]}, ${LOCATION_LABEL[e.location_type].toLowerCase()}`],
  ]);

const calendar = (e: EventRecord) =>
  `<p style="margin:16px 0 0;font-size:14px"><a href="${esc(calendarLink(e, pageUrl(e)))}" style="color:#0f766e">Add it to your calendar</a></p>`;

/** Free event, or payment confirmed: you're in. */
export function registrationConfirmedEmail(e: EventRecord, r: RegistrationRow, afterPayment = false): EmailPayload {
  return {
    to: r.email,
    subject: `You're in: ${e.title}`,
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">${afterPayment ? `Payment received, ${first(r.name)}.` : `You're in, ${first(r.name)}.`}</h1>
<p style="margin:0 0 20px;line-height:1.6">Your place at <strong>${esc(e.title)}</strong> is confirmed.</p>
${details(e)}
<div style="margin-top:24px">${attendBlock(e)}</div>
${calendar(e)}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280">Your reference: ${esc(r.reference)}. Can't make it any more? Reply to this email and let us know.</p>`),
  };
}

/** Paid event: here's how to pay. */
export function registrationPendingEmail(e: EventRecord, r: RegistrationRow): EmailPayload {
  return {
    to: r.email,
    subject: `Complete your registration: ${e.title}`,
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">Almost there, ${first(r.name)}.</h1>
<p style="margin:0 0 20px;line-height:1.6">We've held a place for you at <strong>${esc(e.title)}</strong>. To confirm it, please pay <strong>${fmtNaira(e.price_ngn)}</strong>.</p>
${details(e)}
<div style="margin:24px 0;padding:16px;border:1px solid #e5e7eb;background:#f9fafb">
<p style="margin:0 0 8px;font-size:13px;color:#6b7280">How to pay</p>
<p style="margin:0;line-height:1.6">${esc(e.payment_instructions || "We'll send payment details shortly.").replace(/\n/g, "<br>")}</p>
<p style="margin:16px 0 0;line-height:1.6">Use this reference with your payment: <strong style="font-size:18px;letter-spacing:1px">${esc(r.reference)}</strong></p>
</div>
<p style="margin:0;font-size:14px;color:#4b5563">Once we've matched your payment you'll get a confirmation with everything you need to attend. Paid already? Reply with your receipt and we'll confirm you faster.</p>`),
  };
}

export function reminderEmail(e: EventRecord, r: RegistrationRow, when: "today" | "tomorrow"): EmailPayload {
  return {
    to: r.email,
    subject: `${when === "today" ? "Today" : "Tomorrow"}: ${e.title}`,
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">See you ${when}, ${first(r.name)}.</h1>
<p style="margin:0 0 20px;line-height:1.6">A reminder that <strong>${esc(e.title)}</strong> is ${when}.</p>
${details(e)}
<div style="margin-top:24px">${attendBlock(e)}</div>
${calendar(e)}`),
  };
}

/** Reminder to someone who registered for a paid event but hasn't paid yet. */
export function paymentReminderEmail(e: EventRecord, r: RegistrationRow, when: "today" | "tomorrow"): EmailPayload {
  const pending = registrationPendingEmail(e, r);
  return {
    ...pending,
    subject: `Still holding your place: ${e.title} is ${when}`,
  };
}

export function eventCancelledEmail(e: EventRecord, r: RegistrationRow, message: string): EmailPayload {
  return {
    to: r.email,
    subject: `Cancelled: ${e.title}`,
    html: shell(`
<h1 style="margin:0 0 16px;font-size:22px">${first(r.name)}, this event is cancelled.</h1>
<p style="margin:0 0 20px;line-height:1.6">We're sorry: <strong>${esc(e.title)}</strong>, planned for ${esc(fmtEventWhen(e))}, won't go ahead.</p>
${message ? `<p style="margin:0 0 20px;line-height:1.6">${esc(message).replace(/\n/g, "<br>")}</p>` : ""}
${e.price_ngn > 0 ? `<p style="margin:0 0 20px;line-height:1.6">If you've paid, we'll be in touch about a refund. Your reference: ${esc(r.reference)}.</p>` : ""}
<p style="margin:0">${button(`${SITE}/events`, "See other events")}</p>`),
  };
}

/** To DCH: someone registered for a paid event, so watch for their transfer. */
export function paidRegistrationAlertEmail(e: EventRecord, r: RegistrationRow): EmailPayload {
  return {
    to: alertInbox(),
    replyTo: r.email,
    subject: `Event registration awaiting payment: ${r.name} (${r.reference})`,
    html: shell(`
<p style="margin:0;font-size:13px;color:#0f766e;font-weight:600">New registration · ${esc(e.title)}</p>
<h1 style="margin:8px 0 20px;font-size:22px">${esc(r.name)}</h1>
${rows([
  ["Reference", r.reference],
  ["Amount", fmtNaira(e.price_ngn)],
  ["Email", r.email],
  ["Phone", r.phone ?? undefined],
  ["Organisation", r.organisation ?? undefined],
])}
<p style="margin:24px 0 0;font-size:13px;color:#6b7280">When the transfer arrives, open the event in the dashboard and mark them as paid. They'll get their confirmation automatically.</p>`),
  };
}
