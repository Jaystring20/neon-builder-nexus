/**
 * Supabase client for serverless functions.
 *
 * Separate from src/lib/supabase.ts because that module reads
 * `import.meta.env`, which only exists after Vite's build-time substitution.
 * Inside a Vercel Node function there is no Vite, so those reads yield
 * undefined and every query fails with "Invalid API key". This module reads
 * `process.env` instead.
 *
 * It also authenticates with the service role key rather than the anon key.
 * Row Level Security is enabled on these tables, so an anonymous client cannot
 * insert a discovery result. The service role bypasses RLS — which is exactly
 * why this file must never be imported by anything that ships to the browser.
 *
 * The client is built lazily. An earlier version threw at module scope when a
 * variable was missing, which crashed the function during import: every request
 * became an opaque FUNCTION_INVOCATION_FAILED, including ones that should never
 * have touched the database at all. Deferring the check lets the handler answer
 * with the name of whatever is actually missing.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// VITE_SUPABASE_URL is the name the project already uses. The VITE_ prefix only
// controls what Vite exposes to the client bundle; on the server every variable
// is readable regardless of prefix, so accept either spelling.
const url = () => process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Names of the variables needed but not set. Empty means good to go.
 * Returns names only — never values — so it is safe to put in a response.
 */
export function missingServerEnv(): string[] {
  const missing: string[] = [];
  if (!url()) missing.push("SUPABASE_URL (or VITE_SUPABASE_URL)");
  if (!key()) missing.push("SUPABASE_SERVICE_ROLE_KEY");
  return missing;
}

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const missing = missingServerEnv();
  if (missing.length > 0) {
    throw new Error(`Supabase is not configured on the server. Missing: ${missing.join(", ")}`);
  }

  cached = createClient(url()!, key()!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export interface DiscoveryRecord {
  id?: string;
  email: string;
  segment: string;
  program: string;
  answers: Record<string, unknown>;
  capability_gap?: string | null;
  created_at?: string;
}

/**
 * Persist one completed discovery. Returns the stored row, or null if the
 * write failed — callers decide whether that is fatal.
 *
 * Upsert rather than insert. discovery_results declares `email TEXT NOT NULL
 * UNIQUE`, so a plain insert failed for anyone who had filled the form before:
 * they answered all twelve questions again and were told their answers could
 * not be saved and to try again, which could never succeed. Retaking the
 * discovery is a reasonable thing to do — a founder's model changes — so the
 * latest answers replace the previous ones and each founder keeps one row.
 *
 * created_at is deliberately not sent: the column defaults on insert, and
 * omitting it here leaves the original signup date intact on update.
 */
export async function saveDiscoveryResult(
  email: string,
  segment: string,
  program: string,
  answers: Record<string, unknown>,
  capabilityGap?: string
): Promise<DiscoveryRecord | null> {
  const { data, error } = await getSupabase()
    .from("discovery_results")
    .upsert(
      [
        {
          email,
          segment,
          program,
          answers,
          capability_gap: capabilityGap ?? null,
          updated_at: new Date().toISOString(),
        },
      ],
      { onConflict: "email" }
    )
    .select()
    .single();

  if (error) {
    console.error("discovery_results insert failed:", error.message);
    return null;
  }

  return data as DiscoveryRecord;
}
