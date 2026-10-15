-- Decks sent to clients from the dashboard (Diagnostics > Send the deck).
-- Private: files are uploaded through signed links from /api/admin and only
-- read by the server to attach them. The API also creates this bucket on
-- first use, so running this file is optional.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('client-decks', 'client-decks', false, 20971520, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;
