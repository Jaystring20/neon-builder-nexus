/**
 * Events (Phase 3): shared by the public pages (/events), the dashboard and
 * the serverless functions, so labels, times and checks never disagree.
 *
 * Times are stored in UTC and always shown in Lagos time (WAT), whatever the
 * viewer's own time zone, so "10:00" means the same thing to everyone.
 */

export const EVENT_KINDS = ["webinar", "workshop", "masterclass", "meetup"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];
export const KIND_LABEL: Record<EventKind, string> = {
  webinar: "Webinar",
  workshop: "Workshop",
  masterclass: "Masterclass",
  meetup: "Meetup",
};

export const LOCATION_TYPES = ["online", "in_person", "hybrid"] as const;
export type LocationType = (typeof LOCATION_TYPES)[number];
export const LOCATION_LABEL: Record<LocationType, string> = { online: "Online", in_person: "In person", hybrid: "Online and in person" };

export const EVENT_STATUSES = ["draft", "published", "cancelled"] as const;
export type EventStatus = (typeof EVENT_STATUSES)[number];

export const REGISTRATION_STATUSES = ["pending_payment", "confirmed", "attended", "no_show", "cancelled"] as const;
export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];
export const REGISTRATION_LABEL: Record<RegistrationStatus, string> = {
  pending_payment: "Awaiting payment",
  confirmed: "Confirmed",
  attended: "Attended",
  no_show: "Didn't attend",
  cancelled: "Cancelled",
};
/** Statuses that hold a seat. */
export const HOLDS_SEAT: RegistrationStatus[] = ["pending_payment", "confirmed", "attended", "no_show"];

/** What the public page sees. Never includes the join link or payment details. */
export interface PublicEvent {
  slug: string;
  title: string;
  kind: EventKind;
  summary: string;
  description: string;
  starts_at: string;
  ends_at: string | null;
  location_type: LocationType;
  venue: string;
  image_url: string | null;
  price_ngn: number;
  status: EventStatus;
  /** Null when there is no limit. */
  spots_left: number | null;
}

/** The full record, for the dashboard. */
export interface EventRecord extends Omit<PublicEvent, "spots_left"> {
  id: string;
  join_url: string;
  capacity: number | null;
  payment_instructions: string;
  reminder_sent_at: string | null;
  created_at: string;
  updated_at: string;
}

const TZ = "Africa/Lagos";

export const fmtEventDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: TZ });

export const fmtEventTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

/** "Thursday 16 October 2026, 10:00 to 12:00 WAT" */
export function fmtEventWhen(e: { starts_at: string; ends_at: string | null }): string {
  return `${fmtEventDate(e.starts_at)}, ${fmtEventTime(e.starts_at)}${e.ends_at ? ` to ${fmtEventTime(e.ends_at)}` : ""} WAT`;
}

/** The Lagos calendar date, as YYYY-MM-DD, for "today" and "tomorrow". */
export const lagosDay = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: TZ });

export const fmtNaira = (n: number) => `₦${n.toLocaleString("en-NG")}`;
export const fmtPrice = (n: number) => (n > 0 ? fmtNaira(n) : "Free");

export const isPast = (e: { starts_at: string; ends_at: string | null }, now = Date.now()) =>
  new Date(e.ends_at ?? e.starts_at).getTime() < now;

/** A Google Calendar "add event" link. */
export function calendarLink(e: { title: string; starts_at: string; ends_at: string | null; summary: string }, url: string): string {
  const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const end = e.ends_at ?? new Date(new Date(e.starts_at).getTime() + 60 * 60 * 1000).toISOString();
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.starts_at)}/${stamp(end)}`,
    details: `${e.summary}\n\n${url}`,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

// ---------------------------------------------------------------- registration

export interface RegistrationInput {
  name: string;
  email: string;
  phone?: string;
  organisation?: string;
  note?: string;
}

/** Server-side check of an untrusted registration body. */
export function parseRegistration(body: unknown): { input: RegistrationInput } | { error: string } {
  const b = (body ?? {}) as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const input: RegistrationInput = {
    name: str(b.name, 120),
    email: str(b.email, 200).toLowerCase(),
    phone: str(b.phone, 40) || undefined,
    organisation: str(b.organisation, 160) || undefined,
    note: str(b.note, 1000) || undefined,
  };
  if (!input.name) return { error: "Please tell us your name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) return { error: "That email address doesn't look right." };
  return { input };
}

/** Short, unambiguous code to quote on a bank transfer, e.g. DCH-7K4QX2. */
export function newReference(random: (n: number) => number = (n) => Math.floor(Math.random() * n)): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[random(chars.length)];
  return `DCH-${code}`;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
