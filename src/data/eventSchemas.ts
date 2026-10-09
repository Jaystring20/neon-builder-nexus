/**
 * Server-side validation for events saved from /admin. Kept apart from
 * events.ts so the public site doesn't download zod.
 */

import { z } from "zod";
import { EVENT_KINDS, EVENT_STATUSES, LOCATION_TYPES } from "./events.js";

const text = (max: number) => z.string().trim().max(max);
const httpsOrEmpty = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Links must start with https://");
const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), "That date isn't valid");

export const eventSchema = z
  .object({
    slug: z.string().trim().regex(/^[a-z0-9-]{3,80}$/, "The web address can only use lower-case letters, numbers and dashes"),
    title: text(160).min(3, "Give the event a title"),
    kind: z.enum(EVENT_KINDS),
    summary: text(300),
    description: text(6000),
    starts_at: isoDate,
    ends_at: isoDate.nullable(),
    location_type: z.enum(LOCATION_TYPES),
    venue: text(500),
    join_url: httpsOrEmpty,
    image_url: httpsOrEmpty.nullable(),
    capacity: z.number().int().positive().max(100_000).nullable(),
    price_ngn: z.number().int().min(0).max(100_000_000),
    payment_instructions: text(1500),
    status: z.enum(EVENT_STATUSES),
  })
  .refine((e) => !e.ends_at || Date.parse(e.ends_at) > Date.parse(e.starts_at), { message: "The end must be after the start", path: ["ends_at"] })
  .refine((e) => e.price_ngn === 0 || e.status !== "published" || e.payment_instructions.length > 0, {
    message: "Add payment instructions before publishing a paid event",
    path: ["payment_instructions"],
  })
  .refine((e) => e.location_type === "online" || e.venue.length > 0 || e.status !== "published", {
    message: "Add the venue before publishing an in-person event",
    path: ["venue"],
  });
