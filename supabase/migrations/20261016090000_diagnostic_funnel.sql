-- The Growth Diagnostic funnel: one row per step a visitor takes, so the
-- dashboard can show how many start, where they stop, and how many finish,
-- leave an email or book. Anonymous: a random id per attempt, no IP address,
-- no answers. Written only by /api/discovery with the service role key.

CREATE TABLE IF NOT EXISTS public.diagnostic_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('start', 'question', 'finish', 'book_open', 'booked', 'email')),
  step INT,
  question TEXT,
  audience TEXT,
  source TEXT,
  discovery_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_diagnostic_events_created ON public.diagnostic_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_diagnostic_events_session ON public.diagnostic_events (session_id);

ALTER TABLE public.diagnostic_events ENABLE ROW LEVEL SECURITY;
