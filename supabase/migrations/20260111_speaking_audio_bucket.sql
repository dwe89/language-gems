-- Speaking Assessment Audio Storage Bucket
-- Created: 2026-01-11

-- Create audio-files bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'audio-files',
    'audio-files',
    true,
    52428800, -- 50MB
    ARRAY['audio/webm', 'audio/mp4', 'audio/mpeg', 'audio/wav', 'audio/ogg']
)
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- RLS Policies
-- Note: We use DO blocks or separate statements to avoid errors if policies already exist
-- but standard CREATE POLICY IF NOT EXISTS is not supported in all Postgres versions for RLS
-- So we drop then create or use standard CREATE POLICY with the understanding it might fail if exists
-- For migration safety, we'll just create.

DROP POLICY IF EXISTS "Authenticated users can upload audio files" ON storage.objects;
CREATE POLICY "Authenticated users can upload audio files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'audio-files');

DROP POLICY IF EXISTS "Public can read audio files" ON storage.objects;
CREATE POLICY "Public can read audio files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'audio-files');

DROP POLICY IF EXISTS "Users can delete own audio files" ON storage.objects;
CREATE POLICY "Users can delete own audio files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'audio-files' AND auth.uid() = owner);
