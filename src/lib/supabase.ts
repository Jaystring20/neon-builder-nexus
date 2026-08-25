/**
 * Supabase Client
 *
 * Initialize and export Supabase client for:
 * - Storing discovery answers
 * - Tracking segments and program assignments
 * - Building subscriber lists
 */

import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "Supabase credentials missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseKey || "");

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface DiscoveryRecord {
  id?: string;
  email: string;
  segment: string;
  program: string;
  answers: Record<string, any>; // Full Q1-Q12 answers (including capability assessment)
  capability_gap?: string;
  created_at?: string;
  updated_at?: string;
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Store discovery answers and segment assignment
 */
export async function saveDiscoveryResult(
  email: string,
  segment: string,
  program: string,
  answers: Record<string, any>,
  capabilityGap?: string
): Promise<DiscoveryRecord | null> {
  try {
    const { data, error } = await supabase
      .from("discovery_results")
      .insert([
        {
          email,
          segment,
          program,
          answers,
          capability_gap: capabilityGap || null,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return null;
    }

    return data;
  } catch (err) {
    console.error("Failed to save discovery result:", err);
    return null;
  }
}

/**
 * Get discovery result by email
 */
export async function getDiscoveryByEmail(
  email: string
): Promise<DiscoveryRecord | null> {
  try {
    const { data, error } = await supabase
      .from("discovery_results")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Supabase fetch error:", error);
    }

    return data || null;
  } catch (err) {
    console.error("Failed to fetch discovery result:", err);
    return null;
  }
}

/**
 * List all discovery results (for admin/analytics)
 */
export async function listDiscoveryResults(
  limit = 100
): Promise<DiscoveryRecord[]> {
  try {
    const { data, error } = await supabase
      .from("discovery_results")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error("Failed to fetch discovery results:", err);
    return [];
  }
}

/**
 * Get segment statistics (for analytics)
 */
export async function getSegmentStats(): Promise<Record<string, number>> {
  try {
    const { data, error } = await supabase
      .from("discovery_results")
      .select("segment");

    if (error) {
      console.error("Supabase fetch error:", error);
      return {};
    }

    const stats: Record<string, number> = {};
    data?.forEach((record: any) => {
      stats[record.segment] = (stats[record.segment] || 0) + 1;
    });

    return stats;
  } catch (err) {
    console.error("Failed to fetch segment stats:", err);
    return {};
  }
}
