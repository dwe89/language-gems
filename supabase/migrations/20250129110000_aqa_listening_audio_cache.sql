-- Migration: Create AQA Listening Audio Cache Table
-- This table caches generated audio files to avoid regenerating the same content

-- Create AQA listening audio cache table
CREATE TABLE IF NOT EXISTS aqa_listening_audio_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL, -- Reference to the question (not FK to allow flexibility)
    audio_text_hash TEXT NOT NULL, -- SHA256 hash of the audio text
    audio_url TEXT NOT NULL, -- URL to the generated audio file in Supabase Storage
    tts_config_hash TEXT NOT NULL, -- SHA256 hash of the TTS configuration
    language TEXT NOT NULL, -- Language code (es, fr, de)
    file_size INTEGER DEFAULT 0, -- File size in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    access_count INTEGER DEFAULT 1,
    
    -- Composite unique constraint to prevent duplicates
    UNIQUE(question_id, audio_text_hash, tts_config_hash)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_question_id 
    ON aqa_listening_audio_cache(question_id);

CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_language 
    ON aqa_listening_audio_cache(language);

CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_created_at 
    ON aqa_listening_audio_cache(created_at);

CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_last_accessed 
    ON aqa_listening_audio_cache(last_accessed);

CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_access_count 
    ON aqa_listening_audio_cache(access_count);

-- Create composite index for cache lookups
CREATE INDEX IF NOT EXISTS idx_aqa_listening_audio_cache_lookup 
    ON aqa_listening_audio_cache(question_id, audio_text_hash, tts_config_hash);

-- Add RLS policies
ALTER TABLE aqa_listening_audio_cache ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read cache entries
CREATE POLICY "Allow authenticated users to read audio cache" 
    ON aqa_listening_audio_cache FOR SELECT 
    TO authenticated 
    USING (true);

-- Policy: Allow authenticated users to insert cache entries
CREATE POLICY "Allow authenticated users to insert audio cache" 
    ON aqa_listening_audio_cache FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Policy: Allow authenticated users to update cache entries (for access stats)
CREATE POLICY "Allow authenticated users to update audio cache" 
    ON aqa_listening_audio_cache FOR UPDATE 
    TO authenticated 
    USING (true);

-- Policy: Allow authenticated users to delete expired cache entries
CREATE POLICY "Allow authenticated users to delete audio cache" 
    ON aqa_listening_audio_cache FOR DELETE 
    TO authenticated 
    USING (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_aqa_listening_audio_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update last_accessed on updates
CREATE TRIGGER trigger_update_aqa_listening_audio_cache_updated_at
    BEFORE UPDATE ON aqa_listening_audio_cache
    FOR EACH ROW
    EXECUTE FUNCTION update_aqa_listening_audio_cache_updated_at();

-- Add comments for documentation
COMMENT ON TABLE aqa_listening_audio_cache IS 'Cache table for generated audio files from Gemini TTS for AQA listening assessments';
COMMENT ON COLUMN aqa_listening_audio_cache.question_id IS 'Reference to the question ID (flexible reference, not FK)';
COMMENT ON COLUMN aqa_listening_audio_cache.audio_text_hash IS 'SHA256 hash of the audio text content';
COMMENT ON COLUMN aqa_listening_audio_cache.audio_url IS 'Public URL to the generated audio file in Supabase Storage';
COMMENT ON COLUMN aqa_listening_audio_cache.tts_config_hash IS 'SHA256 hash of the TTS configuration (voice, speakers, etc.)';
COMMENT ON COLUMN aqa_listening_audio_cache.language IS 'Language code for the audio (es=Spanish, fr=French, de=German)';
COMMENT ON COLUMN aqa_listening_audio_cache.file_size IS 'Size of the audio file in bytes';
COMMENT ON COLUMN aqa_listening_audio_cache.access_count IS 'Number of times this cached audio has been accessed';
COMMENT ON COLUMN aqa_listening_audio_cache.last_accessed IS 'Timestamp of the last access to this cached audio';

-- Create a function to clean up expired cache entries (older than 30 days)
CREATE OR REPLACE FUNCTION cleanup_expired_audio_cache()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM aqa_listening_audio_cache 
    WHERE created_at < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comment for the cleanup function
COMMENT ON FUNCTION cleanup_expired_audio_cache() IS 'Removes audio cache entries older than 30 days and returns the count of deleted entries';
