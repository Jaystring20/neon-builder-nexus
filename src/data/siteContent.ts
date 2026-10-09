/**
 * Website content the team edits from /admin (Phase 2): programmes and prices,
 * portfolio projects, and leadership bios.
 *
 * The code keeps the original content (programDefinitions.ts, portfolio.ts,
 * leaders.ts). The `site_content` table holds the team's edited version, one
 * row per key. Wherever the site shows this content it uses the edited version
 * when there is one, and the original otherwise, so a missing row, an empty
 * table or a failed request just shows the site as built.
 *
 * Pure data only (no images, no React, no zod), so the public site, the
 * dashboard and the serverless functions all share it. Validation lives in
 * siteContentSchemas.ts, which only the server loads.
 */

import { PROGRAM_MAP, type Program, type ProgramTier } from "./programDefinitions.js";

export const CONTENT_KEYS = ["programmes", "settings", "portfolio", "leaders"] as const;
export type ContentKey = (typeof CONTENT_KEYS)[number];

export const TIER_KEYS = ["paidProgram", "doneWithYou", "doneForYou"] as const;

// ---------------------------------------------------------------- programmes

// Written out rather than z.infer'd: the app's tsconfig is not strict, which
// makes every inferred field optional.
export interface TierEdit {
  name: string;
  description: string;
  duration: string;
  ideal_for: string;
  includes: string[];
  price: ProgramTier["price"];
}
export interface ProgrammeEdit {
  name: string;
  tagline: string;
  paidProgram: TierEdit;
  doneWithYou: TierEdit;
  doneForYou: TierEdit;
}
export type ProgrammesContent = Partial<Record<string, ProgrammeEdit>>;

const tierEdit = (t: ProgramTier): TierEdit => ({
  name: t.name,
  description: t.description,
  duration: t.duration,
  ideal_for: t.ideal_for,
  includes: [...t.includes],
  price: { ...t.price, billing: t.price.billing },
});

/** The editable part of every programme, as the code ships it. */
export const defaultProgrammes = (): ProgrammesContent =>
  Object.fromEntries(
    Object.entries(PROGRAM_MAP).map(([segment, p]) => [
      segment,
      {
        name: p.name,
        tagline: p.tagline,
        paidProgram: tierEdit(p.paidProgram),
        doneWithYou: tierEdit(p.doneWithYou),
        doneForYou: tierEdit(p.doneForYou),
      },
    ]),
  );

/** A programme with the team's edits laid over the original. */
export function mergeProgram(base: Program | null, edit: ProgrammeEdit | undefined): Program | null {
  if (!base || !edit) return base;
  const tier = (key: (typeof TIER_KEYS)[number]) => ({ ...base[key], ...edit[key], price: { ...edit[key].price } });
  return {
    ...base,
    name: edit.name,
    tagline: edit.tagline,
    paidProgram: tier("paidProgram"),
    doneWithYou: tier("doneWithYou"),
    doneForYou: tier("doneForYou"),
  };
}

// ---------------------------------------------------------------- settings

export interface SettingsContent {
  showPrices: boolean;
}
export const DEFAULT_SETTINGS: SettingsContent = { showPrices: false };

// ---------------------------------------------------------------- portfolio

export type ImagePosition = "object-left-top" | "object-top" | "object-center" | "object-right-top" | "object-bottom";
export interface PortfolioItemEdit {
  id: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  url?: string;
  displayDomain: string;
  imageUrl?: string;
  imagePosition?: ImagePosition;
  hidden?: boolean;
  story?: { problem: string; built: string[]; outcome: string };
}

// ---------------------------------------------------------------- leaders

export interface LeaderEdit {
  id: string;
  name: string;
  role: string;
  title: string;
  line: string;
  quote: string;
  imageUrl?: string;
  link?: { label: string; href: string };
  hidden?: boolean;
}

export interface SiteContent {
  programmes?: ProgrammesContent;
  settings?: SettingsContent;
  portfolio?: PortfolioItemEdit[];
  leaders?: LeaderEdit[];
}

/**
 * Lay an edited list over the original, by id. The edited order wins;
 * anything the code adds later that the edit doesn't know about yet is kept,
 * at the end, so new work never disappears behind an old edit.
 */
export function mergeList<B extends { id: string }, E extends { id: string; hidden?: boolean }>(
  base: B[],
  edits: E[] | undefined,
  combine: (base: B | undefined, edit: E) => B,
): B[] {
  if (!edits) return base;
  const seen = new Set(edits.map((e) => e.id));
  const byId = new Map(base.map((b) => [b.id, b]));
  return [...edits.filter((e) => !e.hidden).map((e) => combine(byId.get(e.id), e)), ...base.filter((b) => !seen.has(b.id))];
}
