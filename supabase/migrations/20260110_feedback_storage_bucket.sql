-- Storage bucket setup for feedback screenshots
-- Date: 2026-01-10
-- Run this in Supabase SQL Editor or via CLI

-- Create storage bucket for feedback attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-attachments', 'feedback-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for feedback-attachments bucket
-- Allow authenticated users to upload screenshots
CREATE POLICY "Authenticated users can upload feedback screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-attachments');

-- Allow public read access to screenshots (for admin review)
CREATE POLICY "Public read access for feedback screenshots"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'feedback-attachments');

-- Allow users to delete their own uploads (optional - for cleanup)
CREATE POLICY "Users can delete their own feedback screenshots"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'feedback-attachments' AND auth.uid() = owner);

-- Set file size limit (10MB max for screenshots)
UPDATE storage.buckets
SET file_size_limit = 10485760
WHERE id = 'feedback-attachments';

-- Set allowed MIME types (images only)
UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'feedback-attachments';
