-- ============================================================
-- Client video generation (Higgsfield / Seedance 2.5)
-- ============================================================
-- Clients authenticate to /api/videos with an access code. Only its SHA-256
-- hash is stored, so a leaked table cannot be replayed against the API.
-- Each client has a quota of videos; the API reserves one atomically before
-- submitting to Higgsfield and releases it if the generation fails, is
-- moderated or canceled (Higgsfield refunds those credits too).
--
-- RLS is enabled with no policies: only the service role, used by the
-- serverless functions, can read or write these tables.

CREATE TABLE IF NOT EXISTS video_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  access_code_hash TEXT NOT NULL UNIQUE,
  video_quota INTEGER NOT NULL DEFAULT 10 CHECK (video_quota >= 0),
  videos_used INTEGER NOT NULL DEFAULT 0 CHECK (videos_used >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS video_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES video_clients(id) ON DELETE CASCADE,
  hf_request_id TEXT UNIQUE,
  prompt TEXT NOT NULL,
  duration INTEGER NOT NULL,
  resolution TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  -- queued | in_progress | completed | failed | nsfw | canceled
  status TEXT NOT NULL DEFAULT 'queued',
  video_url TEXT,
  error TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_video_jobs_client ON video_jobs(client_id, created_at DESC);

ALTER TABLE video_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_jobs ENABLE ROW LEVEL SECURITY;

-- Takes one video from the client's quota. Returns false when the client is
-- inactive or out of quota. A single conditional UPDATE, so two concurrent
-- requests cannot both take the last video.
CREATE OR REPLACE FUNCTION reserve_video_credit(p_client_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
  WITH taken AS (
    UPDATE video_clients
       SET videos_used = videos_used + 1
     WHERE id = p_client_id
       AND active
       AND videos_used < video_quota
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM taken);
$$;

-- Gives one video back, e.g. when the generation never ran or was refunded.
CREATE OR REPLACE FUNCTION release_video_credit(p_client_id UUID)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE video_clients
     SET videos_used = GREATEST(videos_used - 1, 0)
   WHERE id = p_client_id;
$$;

REVOKE EXECUTE ON FUNCTION reserve_video_credit(UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION release_video_credit(UUID) FROM PUBLIC, anon, authenticated;
