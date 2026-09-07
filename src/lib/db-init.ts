/**
 * Database initialization utility.
 *
 * Checks if discovery_results table exists. If not, logs instructions for manual setup
 * via the Supabase dashboard. The auto-init via direct PostgreSQL connection
 * times out on Vercel's sandboxed environment, so we fall back to a user-friendly
 * message with setup instructions instead of blocking the form.
 */

import { getSupabase } from "./supabase.server.js";

let schemaChecked = false;
let schemaExists = false;

export async function ensureSchemaExists(): Promise<void> {
  if (schemaChecked) {
    if (!schemaExists) {
      throw new Error(
        "Database tables not yet created. " +
          "Visit https://app.supabase.com, go to SQL Editor, and run the migration from supabase/migrations/001_discovery_schema.sql"
      );
    }
    return;
  }

  try {
    // Quick check: try to select from discovery_results
    // If it doesn't exist, this will error with "relation does not exist"
    const { error } = await getSupabase()
      .from("discovery_results")
      .select("id")
      .limit(1);

    if (error?.message?.includes("relation") || error?.message?.includes("does not exist")) {
      schemaChecked = true;
      schemaExists = false;
      throw new Error(
        "Database tables not yet created. " +
          "Visit https://app.supabase.com → SQL Editor → paste supabase/migrations/001_discovery_schema.sql and run it."
      );
    }

    // If we got here, tables exist
    schemaChecked = true;
    schemaExists = true;
    console.log("✓ Database schema verified");
  } catch (err) {
    if (err instanceof Error && err.message.includes("Database tables")) {
      throw err; // Re-throw our own error with instructions
    }
    console.error("Schema check failed:", err);
    throw new Error("Could not verify database schema. Please try again.");
  }
}
