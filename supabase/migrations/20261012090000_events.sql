-- ============================================================
-- Admin dashboard, Phase 3: events (webinars, workshops)
-- ============================================================
-- The team creates events in /admin; published ones appear on /events.
-- People register through POST /api/events. Paid events are settled by bank
-- transfer for now: the registration waits as pending_payment until the team
-- confirms the money arrived. Every registrant also becomes (or is linked to)
-- a lead. RLS on with no policies: only the serverless functions read and
-- write, and the public endpoint never returns the join link.

CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9-]{3,80}$'),
  title TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'webinar' CHECK (kind IN ('webinar', 'workshop', 'masterclass', 'meetup')),
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  location_type TEXT NOT NULL DEFAULT 'online' CHECK (location_type IN ('online', 'in_person', 'hybrid')),
  venue TEXT NOT NULL DEFAULT '',
  -- Sent only to confirmed registrants, never shown on the public page.
  join_url TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  capacity INTEGER CHECK (capacity IS NULL OR capacity > 0),
  -- 0 means free.
  price_ngn INTEGER NOT NULL DEFAULT 0 CHECK (price_ngn >= 0),
  payment_instructions TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
  reminder_sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_events_starts ON public.events (status, starts_at);

CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL CHECK (email = lower(email)),
  phone TEXT,
  organisation TEXT,
  note TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending_payment', 'confirmed', 'cancelled', 'attended', 'no_show')),
  -- Quoted on bank transfers, so a payment can be matched to a registration.
  reference TEXT NOT NULL UNIQUE,
  paid_amount INTEGER,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, email)
);
CREATE INDEX IF NOT EXISTS idx_event_registrations_event ON public.event_registrations (event_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_event_registrations_email ON public.event_registrations (email);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Event images go in the same bucket as other dashboard uploads.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;
