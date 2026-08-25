-- ============================================================
-- Discovery Form Schema for Supabase
-- ============================================================
-- Run this migration in your Supabase project:
-- psql -U postgres -h your-host -d postgres -f migrations/001_discovery_schema.sql

-- ============================================================
-- Table: discovery_results
-- Stores founder discovery questionnaire responses
-- ============================================================

CREATE TABLE IF NOT EXISTS discovery_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Core fields
  email TEXT NOT NULL UNIQUE,
  segment TEXT NOT NULL, -- msme_value, msme_volume, startup, professional_service, development_org
  program TEXT NOT NULL,

  -- Full answers (JSON)
  answers JSONB NOT NULL,

  -- Optional warning/gap
  capability_gap TEXT,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  -- Indexes
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Indexes for common queries
CREATE INDEX idx_discovery_email ON discovery_results(email);
CREATE INDEX idx_discovery_segment ON discovery_results(segment);
CREATE INDEX idx_discovery_program ON discovery_results(program);
CREATE INDEX idx_discovery_created_at ON discovery_results(created_at DESC);

-- ============================================================
-- Table: scheduled_emails
-- Stores emails scheduled for future delivery (Email 2, Email 3)
-- ============================================================

CREATE TABLE IF NOT EXISTS scheduled_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email content
  email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- email_1, email_2, email_3
  subject TEXT NOT NULL,
  html TEXT NOT NULL,

  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP WITH TIME ZONE,

  -- Error tracking
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for scheduling queries
CREATE INDEX idx_scheduled_emails_sent ON scheduled_emails(sent);
CREATE INDEX idx_scheduled_emails_scheduled_for ON scheduled_emails(scheduled_for);
CREATE INDEX idx_scheduled_emails_email ON scheduled_emails(email);
CREATE INDEX idx_scheduled_emails_created_at ON scheduled_emails(created_at DESC);

-- ============================================================
-- Table: email_events
-- Tracks email delivery events (opens, clicks, bounces)
-- Optional: only if using Resend webhooks for tracking
-- ============================================================

CREATE TABLE IF NOT EXISTS email_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email reference
  email TEXT NOT NULL,
  email_type TEXT NOT NULL, -- email_1, email_2, email_3
  resend_id TEXT, -- Resend message ID

  -- Event
  event_type TEXT NOT NULL, -- sent, delivered, opened, clicked, bounced, complained, failed
  event_data JSONB,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_email_events_email ON email_events(email);
CREATE INDEX idx_email_events_type ON email_events(event_type);
CREATE INDEX idx_email_events_created_at ON email_events(created_at DESC);

-- ============================================================
-- Table: analytics
-- High-level metrics for the discovery flow
-- (Denormalized for faster queries)
-- ============================================================

CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Date
  date DATE NOT NULL UNIQUE,

  -- Counts
  total_submissions INTEGER DEFAULT 0,
  unique_emails INTEGER DEFAULT 0,

  -- By segment
  segment_msme_value INTEGER DEFAULT 0,
  segment_msme_volume INTEGER DEFAULT 0,
  segment_startup INTEGER DEFAULT 0,
  segment_professional_service INTEGER DEFAULT 0,
  segment_development_org INTEGER DEFAULT 0,

  -- Email metrics
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,

  -- Updated
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- Functions & Triggers
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_discovery_results_updated_at
  BEFORE UPDATE ON discovery_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_emails_updated_at
  BEFORE UPDATE ON scheduled_emails
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

-- Enable RLS
ALTER TABLE discovery_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Policy: Discovery results are read-only via anon key (for privacy)
-- Only service role can write
CREATE POLICY "discovery_results_read_own" ON discovery_results
  FOR SELECT USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "discovery_results_insert_public" ON discovery_results
  FOR INSERT WITH CHECK (true);

-- Policy: Scheduled emails only visible to authenticated users/service role
CREATE POLICY "scheduled_emails_service_role" ON scheduled_emails
  FOR ALL USING (auth.role() = 'service_role');

-- Policy: Analytics are public read-only
CREATE POLICY "analytics_read_public" ON analytics
  FOR SELECT USING (true);

-- ============================================================
-- Seed Data (Optional)
-- ============================================================

-- You can add initial analytics records here if desired
-- INSERT INTO analytics (date, total_submissions) VALUES (CURRENT_DATE, 0);
