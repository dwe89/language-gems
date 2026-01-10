-- Migration to enable vocabulary usage tracking and school-wide discovery
-- Created: 2026-01-10

-- 1. Add duplicated_from column to track list lineage and usage counts
ALTER TABLE enhanced_vocabulary_lists
ADD COLUMN IF NOT EXISTS duplicated_from UUID REFERENCES enhanced_vocabulary_lists(id) ON DELETE SET NULL;

-- 2. Add index for efficient usage counting
CREATE INDEX IF NOT EXISTS idx_evl_duplicated_from 
ON enhanced_vocabulary_lists(duplicated_from) 
WHERE duplicated_from IS NOT NULL;

-- 3. Add RLS policy to allow teachers to view lists from colleagues in the same school
-- Note: This requires school_code to be populated in user_profiles
CREATE POLICY "Teachers can view school lists" ON enhanced_vocabulary_lists
FOR SELECT USING (
  teacher_id IN (
    SELECT user_id FROM user_profiles
    WHERE school_code IS NOT NULL AND school_code = (
      SELECT school_code FROM user_profiles WHERE user_id = auth.uid()
    )
  )
);
