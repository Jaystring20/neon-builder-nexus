-- ============================================================
-- Admin dashboard, Phase 2: website content the team edits
-- ============================================================
-- One row per key (programmes, settings, portfolio, leaders) holding the
-- team's edited version; with no row, the site shows what ships in the code.
-- Every save is also kept in site_content_versions so it can be restored.
-- Read publicly through GET /api/content and written only through
-- /api/admin, both with the service role; RLS is on with no policies.

CREATE TABLE IF NOT EXISTS public.site_content (
  key TEXT PRIMARY KEY CHECK (key IN ('programmes', 'settings', 'portfolio', 'leaders')),
  value JSONB NOT NULL,
  updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.site_content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  -- NULL records a reset to the original content.
  value JSONB,
  saved_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_site_content_versions_key ON public.site_content_versions (key, saved_at DESC);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content_versions ENABLE ROW LEVEL SECURITY;

-- Photos and screenshots uploaded from the dashboard. Public to read (they
-- appear on the website); uploads only through signed links from /api/admin.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site-media', 'site-media', true, 5242880, ARRAY['image/webp', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;
