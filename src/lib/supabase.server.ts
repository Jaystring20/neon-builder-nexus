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
 */

import { createClient } from "@supabase/supabase-js";

// VITE_SUPABASE_URL is the name the project already uses. The VITE_ prefix only
// controls what Vite exposes to the client bundle; on the server every variable
// is readable regardless of prefix, so accept either spelling.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  // Throw rather than warn. A client built from undefined credentials fails
  // later with an opaque 401, far from the actual misconfiguration.
  throw new Error(
    "Supabase is not configured for the server. Set SUPABASE_URL (or VITE_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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
 */
export async function saveDiscoveryResult(
  email: string,
  segment: string,
  program: string,
  answers: Record<string, unknown>,
  capabilityGap?: string
): Promise<DiscoveryRecord | null> {
  const { data, error } = await supabase
    .from("discovery_results")
    .insert([
      {
        email,
        segment,
        program,
        answers,
        capability_gap: capabilityGap ?? null,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("discovery_results insert failed:", error.message);
    return null;
  }

  return data as DiscoveryRecord;
}
