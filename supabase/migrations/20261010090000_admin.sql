-- ============================================================
-- Admin dashboard, Phase 1: team sign-in, roles, notes, activity
-- ============================================================
-- The dashboard at /admin talks only to POST/GET /api/admin, which uses the
-- service role key and checks the signed-in person's role on every request.
-- RLS is on with no policies, as for leads: nothing in the browser can read
-- or write these tables directly.

-- People who may sign in. Removing access is `active = false`; it takes
-- effect on their next request, because every request re-reads this row.
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE CHECK (email = lower(email)),
  name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('owner', 'manager', 'editor', 'viewer')),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ
);

-- One-time sign-in links. Only the SHA-256 of the token is stored.
CREATE TABLE IF NOT EXISTS public.admin_login_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_login_tokens_user ON public.admin_login_tokens (user_id, created_at DESC);

-- Notes the team leaves on a lead or a diagnostic result.
CREATE TABLE IF NOT EXISTS public.admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL CHECK (entity_type IN ('lead', 'diagnostic')),
  entity_id UUID NOT NULL,
  author_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON public.admin_notes (entity_type, entity_id, created_at DESC);

-- Who changed what, and when.
CREATE TABLE IF NOT EXISTS public.admin_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  detail JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON public.admin_activity (entity_type, entity_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created ON public.admin_activity (created_at DESC);

-- Leads: the call date (set by hand while Calendly is on the free plan), who
-- owns the follow-up, and the diagnostic a lead came from, if any.
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS call_at TIMESTAMPTZ;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES public.admin_users(id) ON DELETE SET NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS discovery_id UUID;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_discovery ON public.leads (discovery_id) WHERE discovery_id IS NOT NULL;

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity ENABLE ROW LEVEL SECURITY;

-- The first Owner. Everyone else is added from the dashboard's Team page.
INSERT INTO public.admin_users (email, name, role)
VALUES ('digitalcreativeshubltd@gmail.com', 'DCH', 'owner')
ON CONFLICT (email) DO NOTHING;
