-- ============================================================
-- Studio: image and video generation (Higgsfield)
-- ============================================================
-- People sign in to /studio with an access code. Only its SHA-256 hash is
-- stored, so a leaked table cannot be replayed against the API.
--
-- Team accounts (is_team) generate without limit. Client accounts draw from
-- separate image and video quotas. One is reserved atomically before anything
-- is sent to Higgsfield, and given back if submission fails or the generation
-- ends failed, moderated or canceled (Higgsfield refunds those credits too).
--
-- RLS is enabled with no policies: only the service role, used by the
-- serverless functions, can read or write these tables.

CREATE TABLE IF NOT EXISTS studio_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  access_code_hash TEXT NOT NULL UNIQUE,
  is_team BOOLEAN NOT NULL DEFAULT FALSE,
  image_quota INTEGER NOT NULL DEFAULT 0 CHECK (image_quota >= 0),
  images_used INTEGER NOT NULL DEFAULT 0 CHECK (images_used >= 0),
  video_quota INTEGER NOT NULL DEFAULT 0 CHECK (video_quota >= 0),
  videos_used INTEGER NOT NULL DEFAULT 0 CHECK (videos_used >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS studio_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES studio_accounts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('image', 'video')),
  model TEXT NOT NULL,
  hf_request_id TEXT UNIQUE,
  prompt TEXT NOT NULL,
  settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  -- queued | in_progress | completed | failed | nsfw | canceled
  status TEXT NOT NULL DEFAULT 'queued',
  result_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_studio_jobs_account ON studio_jobs(account_id, created_at DESC);

ALTER TABLE studio_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_jobs ENABLE ROW LEVEL SECURITY;

-- Takes one image or video from the account. Returns false when the account
-- is inactive or out of quota for that kind. A single conditional UPDATE, so
-- two concurrent requests cannot both take the last one. Team usage is still
-- counted, just never limited.
CREATE OR REPLACE FUNCTION reserve_studio_credit(p_account_id UUID, p_kind TEXT)
RETURNS BOOLEAN
LANGUAGE sql
AS $$
  WITH taken AS (
    UPDATE studio_accounts
       SET images_used = images_used + CASE WHEN p_kind = 'image' THEN 1 ELSE 0 END,
           videos_used = videos_used + CASE WHEN p_kind = 'video' THEN 1 ELSE 0 END
     WHERE id = p_account_id
       AND active
       AND p_kind IN ('image', 'video')
       AND (
         is_team
         OR (p_kind = 'image' AND images_used < image_quota)
         OR (p_kind = 'video' AND videos_used < video_quota)
       )
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM taken);
$$;

-- Gives one back, e.g. when the generation never ran or was refunded.
CREATE OR REPLACE FUNCTION release_studio_credit(p_account_id UUID, p_kind TEXT)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE studio_accounts
     SET images_used = GREATEST(images_used - CASE WHEN p_kind = 'image' THEN 1 ELSE 0 END, 0),
         videos_used = GREATEST(videos_used - CASE WHEN p_kind = 'video' THEN 1 ELSE 0 END, 0)
   WHERE id = p_account_id;
$$;

REVOKE EXECUTE ON FUNCTION reserve_studio_credit(UUID, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION release_studio_credit(UUID, TEXT) FROM PUBLIC, anon, authenticated;
