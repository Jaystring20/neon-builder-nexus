-- Leads from the Book a call intake (/book, POST /api/lead).
-- Written only by the serverless function with the service role key; RLS is
-- on with no public policies, so nothing in the browser can read or write it.

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  source TEXT NOT NULL DEFAULT 'book_a_call',

  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  client_type TEXT NOT NULL,

  needs TEXT[] NOT NULL DEFAULT '{}',
  problem TEXT NOT NULL,
  currency TEXT NOT NULL,
  budget TEXT NOT NULL,
  timeline TEXT NOT NULL,

  -- Routing, worked out in src/data/leadIntake.ts
  practice TEXT,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),

  -- For DCH to track by hand (or a future dashboard)
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'booked', 'contacted', 'won', 'lost'))
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_priority ON public.leads (priority);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
