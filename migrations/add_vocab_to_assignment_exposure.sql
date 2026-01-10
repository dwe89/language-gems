-- Add enhanced_vocabulary_item_id to assignment_word_exposure
-- This enables tracking completion for assignments using Teacher Custom Vocabulary

-- 1. Add the column
ALTER TABLE assignment_word_exposure
ADD COLUMN IF NOT EXISTS enhanced_vocabulary_item_id UUID REFERENCES enhanced_vocabulary_items(id) ON DELETE SET NULL;

-- 1b. Make centralized_vocabulary_id nullable (to support custom items where this is null)
ALTER TABLE assignment_word_exposure 
ALTER COLUMN centralized_vocabulary_id DROP NOT NULL;

-- 2. Update the unique constraint to include enhanced_vocabulary_item_id
-- We need to drop the existing constraint/index and create a new one that handles NULLs
-- The existing PK/constraint is likely on (assignment_id, student_id, centralized_vocabulary_id)

-- Drop existing unique constraint if it exists (check name first or use generic drop)
-- Assuming standard naming or primary key. If it's a PK, we might need to alter it.
-- Safer to add a NEW unique index that supports the nullable columns logic.

-- Create a unique index that covers both cases (centralized or custom)
-- We use partial indexes to enforce uniqueness for each type

-- Index for centralized vocabulary (if not already existing)
CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_exposure_centralized 
ON assignment_word_exposure(assignment_id, student_id, centralized_vocabulary_id) 
WHERE centralized_vocabulary_id IS NOT NULL;

-- Index for custom vocabulary
CREATE UNIQUE INDEX IF NOT EXISTS idx_assignment_exposure_enhanced 
ON assignment_word_exposure(assignment_id, student_id, enhanced_vocabulary_item_id) 
WHERE enhanced_vocabulary_item_id IS NOT NULL;

-- 3. Add index for performance on the new column
CREATE INDEX IF NOT EXISTS idx_assignment_exposure_enhanced_lookup
ON assignment_word_exposure(enhanced_vocabulary_item_id);

-- 4. Comment
COMMENT ON COLUMN assignment_word_exposure.enhanced_vocabulary_item_id IS 'References enhanced_vocabulary_items for custom vocabulary assignments';
