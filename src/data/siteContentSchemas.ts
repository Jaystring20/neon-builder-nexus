/**
 * Server-side validation for the website content saved from /admin. Kept
 * apart from siteContent.ts so the public site doesn't download zod.
 */

import { z } from "zod";
import { PROGRAM_MAP } from "./programDefinitions.js";

const text = (max: number) => z.string().trim().max(max);
const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || /^https:\/\/[^\s]+$/.test(v), "Links must start with https://");

const tierSchema = z.object({
  name: text(160).min(1, "Every tier needs a name"),
  description: text(600),
  duration: text(200),
  ideal_for: text(400),
  includes: z.array(text(300)).max(20),
  price: z.object({
    min: z.number().int().min(0).max(1_000_000_000),
    max: z.number().int().min(0).max(1_000_000_000),
    billing: z.enum(["one-time", "monthly", "engagement"]),
  }),
});

const programmeSchema = z.object({
  name: text(160).min(1, "Every programme needs a name"),
  tagline: text(300),
  paidProgram: tierSchema,
  doneWithYou: tierSchema,
  doneForYou: tierSchema,
});

export const programmesSchema = z.record(z.enum(Object.keys(PROGRAM_MAP) as [string, ...string[]]), programmeSchema);

export const settingsSchema = z.object({
  /** Show NGN price ranges on the diagnostic result. */
  showPrices: z.boolean(),
});

const slug = z
  .string()
  .trim()
  .regex(/^[a-z0-9-]{2,60}$/, "Use lower-case letters, numbers and dashes");

export const portfolioItemSchema = z.object({
  id: slug,
  title: text(120).min(1, "Every project needs a name"),
  category: text(80),
  description: text(600),
  tags: z.array(text(40)).max(8),
  url: url.optional(),
  displayDomain: text(120),
  /** An uploaded screenshot. Empty means the one that ships with the site. */
  imageUrl: url.optional(),
  imagePosition: z.enum(["object-left-top", "object-top", "object-center", "object-right-top", "object-bottom"]).optional(),
  hidden: z.boolean().optional(),
  story: z
    .object({
      problem: text(400),
      built: z.array(text(80)).max(5),
      outcome: text(200),
    })
    .optional(),
});

export const portfolioSchema = z.array(portfolioItemSchema).max(60);

export const leaderSchema = z.object({
  id: slug,
  name: text(120).min(1, "Every person needs a name"),
  role: text(120),
  title: text(160),
  line: text(500),
  quote: text(300),
  imageUrl: url.optional(),
  link: z.object({ label: text(80), href: url }).optional(),
  hidden: z.boolean().optional(),
});

export const leadersSchema = z.array(leaderSchema).max(20);

export const CONTENT_SCHEMAS = {
  programmes: programmesSchema,
  settings: settingsSchema,
  portfolio: portfolioSchema,
  leaders: leadersSchema,
} as const;
