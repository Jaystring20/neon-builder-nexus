/**
 * Database initialization utility.
 *
 * One-time setup to create discovery_results and scheduled_emails tables
 * if they don't already exist. This runs on the first discovery form submission
 * and is idempotent (safe to run multiple times).
 */

import pg from "pg";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS discovery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  segment TEXT NOT NULL,
  program TEXT NOT NULL,
  answers JSONB NOT NULL,
  capability_gap TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE INDEX IF NOT EXISTS idx_discovery_email ON discovery_results(email);
CREATE INDEX IF NOT EXISTS idx_discovery_segment ON discovery_results(segment);
CREATE INDEX IF NOT EXISTS idx_discovery_program ON discovery_results(program);
CREATE INDEX IF NOT EXISTS idx_discovery_created_at ON discovery_results(created_at DESC);

CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  html TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scheduled_emails_sent ON scheduled_emails(sent);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_email ON scheduled_emails(email);
CREATE INDEX IF NOT EXISTS idx_scheduled_emails_created_at ON scheduled_emails(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_discovery_results_updated_at ON discovery_results;
CREATE TRIGGER update_discovery_results_updated_at
  BEFORE UPDATE ON discovery_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_emails_updated_at ON scheduled_emails;
CREATE TRIGGER update_scheduled_emails_updated_at
  BEFORE UPDATE ON scheduled_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE discovery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS discovery_results_read_own ON discovery_results;
DROP POLICY IF EXISTS discovery_results_insert_public ON discovery_results;
DROP POLICY IF EXISTS scheduled_emails_service_role ON scheduled_emails;

CREATE POLICY discovery_results_read_own ON discovery_results
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY discovery_results_insert_public ON discovery_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY scheduled_emails_service_role ON scheduled_emails
  FOR ALL USING (auth.role() = 'service_role');
`;

let initialized = false;

export async function ensureSchemaExists(): Promise<void> {
  if (initialized) return;

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing Supabase credentials");
  }

  // Parse Supabase URL to get host and database
  const url = new URL(supabaseUrl);
  const host = url.hostname;

  const client = new pg.Client({
    host,
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: serviceKey,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();

    // Split and execute schema statements
    const statements = SCHEMA_SQL.split(";")
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith("--"));

    for (const statement of statements) {
      try {
        await client.query(statement);
      } catch (err) {
        // Ignore "already exists" errors - schema is idempotent
        if (err instanceof Error && !err.message.includes("already exists")) {
          console.error(`Schema statement failed: ${statement.substring(0, 80)}`, err);
          throw err;
        }
      }
    }

    initialized = true;
    console.log("✓ Database schema initialized");
  } finally {
    await client.end();
  }
}
