-- Migration: Resolve Vocabulary ID Consistency Issues
-- Date: 2025-08-07
-- Purpose: Fix UUID vs INTEGER inconsistencies to support unified FSRS implementation

-- ============================================================================
-- ANALYSIS OF CURRENT STATE
-- ============================================================================
-- vocabulary_gem_collection.vocabulary_item_id: UUID (references centralized_vocabulary.id)
-- user_vocabulary_progress.vocabulary_id: INTEGER (references vocabulary.id)
-- word_performance_logs.vocabulary_id: INTEGER (references vocabulary.id)
--
-- GOAL: Unify all vocabulary references to use centralized_vocabulary (UUID)

-- ============================================================================
-- STEP 1: CREATE VOCABULARY ID MAPPING TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_id_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legacy_integer_id INTEGER NOT NULL,
    centralized_uuid_id UUID NOT NULL REFERENCES centralized_vocabulary(id) ON DELETE CASCADE,
    spanish_word TEXT,
    english_translation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    migrated_at TIMESTAMP WITH TIME ZONE,

    -- Ensure unique mappings
    UNIQUE(legacy_integer_id),
    UNIQUE(centralized_uuid_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_id_mapping_legacy_id ON vocabulary_id_mapping(legacy_integer_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_id_mapping_uuid_id ON vocabulary_id_mapping(centralized_uuid_id);

-- ============================================================================
-- STEP 2: POPULATE MAPPING TABLE
-- ============================================================================

-- Insert mappings by matching Spanish words and English translations
INSERT INTO vocabulary_id_mapping (legacy_integer_id, centralized_uuid_id, spanish_word, english_translation)
SELECT DISTINCT
    v.id as legacy_integer_id,
    cv.id as centralized_uuid_id,
    v.spanish as spanish_word,
    v.english as english_translation
FROM vocabulary v
INNER JOIN centralized_vocabulary cv ON (
    LOWER(TRIM(v.spanish)) = LOWER(TRIM(cv.spanish))
    AND LOWER(TRIM(v.english)) = LOWER(TRIM(cv.english))
)
WHERE NOT EXISTS (
    SELECT 1 FROM vocabulary_id_mapping vim
    WHERE vim.legacy_integer_id = v.id
)
ON CONFLICT (legacy_integer_id) DO NOTHING;

-- ============================================================================
-- STEP 3: ADD NEW UUID COLUMNS TO AFFECTED TABLES
-- ============================================================================

-- Add new UUID column to user_vocabulary_progress
ALTER TABLE user_vocabulary_progress
ADD COLUMN IF NOT EXISTS vocabulary_uuid UUID REFERENCES centralized_vocabulary(id) ON DELETE CASCADE;

-- Add new UUID column to word_performance_logs
ALTER TABLE word_performance_logs
ADD COLUMN IF NOT EXISTS vocabulary_uuid UUID REFERENCES centralized_vocabulary(id) ON DELETE CASCADE;

-- Create indexes for the new UUID columns
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_uuid ON user_vocabulary_progress(vocabulary_uuid);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_uuid ON word_performance_logs(vocabulary_uuid);

-- ============================================================================
-- STEP 4: POPULATE NEW UUID COLUMNS
-- ============================================================================

-- Update user_vocabulary_progress with UUID values
UPDATE user_vocabulary_progress
SET vocabulary_uuid = vim.centralized_uuid_id
FROM vocabulary_id_mapping vim
WHERE user_vocabulary_progress.vocabulary_id = vim.legacy_integer_id
  AND user_vocabulary_progress.vocabulary_uuid IS NULL;

-- Update word_performance_logs with UUID values
UPDATE word_performance_logs
SET vocabulary_uuid = vim.centralized_uuid_id
FROM vocabulary_id_mapping vim
WHERE word_performance_logs.vocabulary_id = vim.legacy_integer_id
  AND word_performance_logs.vocabulary_uuid IS NULL;

-- ============================================================================
-- STEP 5: CREATE MIGRATION STATUS TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_migration_status (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    migration_name TEXT NOT NULL UNIQUE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    records_migrated INTEGER DEFAULT 0,
    errors_encountered INTEGER DEFAULT 0,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'failed')),
    notes TEXT
);

-- Record this migration
INSERT INTO vocabulary_migration_status (migration_name, records_migrated, status, notes)
VALUES (
    'vocabulary_id_uuid_consistency_2025_08_07',
    (SELECT COUNT(*) FROM vocabulary_id_mapping),
    'completed',
    'Successfully created UUID mappings and populated new UUID columns'
) ON CONFLICT (migration_name) DO UPDATE SET
    completed_at = NOW(),
    records_migrated = EXCLUDED.records_migrated,
    status = EXCLUDED.status,
    notes = EXCLUDED.notes;

-- ============================================================================
-- STEP 6: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to get UUID from legacy integer ID
CREATE OR REPLACE FUNCTION get_vocabulary_uuid(legacy_id INTEGER)
RETURNS UUID
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    result_uuid UUID;
BEGIN
    SELECT centralized_uuid_id INTO result_uuid
    FROM vocabulary_id_mapping
    WHERE legacy_integer_id = legacy_id;

    RETURN result_uuid;
END;
$$;

-- Function to get legacy integer ID from UUID
CREATE OR REPLACE FUNCTION get_vocabulary_legacy_id(uuid_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    result_id INTEGER;
BEGIN
    SELECT legacy_integer_id INTO result_id
    FROM vocabulary_id_mapping
    WHERE centralized_uuid_id = uuid_id;

    RETURN result_id;
END;
$$;

-- ============================================================================
-- STEP 7: CREATE VIEWS FOR BACKWARD COMPATIBILITY
-- ============================================================================

-- View that provides user_vocabulary_progress with both ID types
CREATE OR REPLACE VIEW user_vocabulary_progress_unified AS
SELECT
    uvp.*,
    vim.centralized_uuid_id as vocabulary_uuid_mapped,
    cv.spanish,
    cv.english,
    cv.theme,
    cv.topic
FROM user_vocabulary_progress uvp
LEFT JOIN vocabulary_id_mapping vim ON uvp.vocabulary_id = vim.legacy_integer_id
LEFT JOIN centralized_vocabulary cv ON vim.centralized_uuid_id = cv.id;

-- View that provides word_performance_logs with both ID types
CREATE OR REPLACE VIEW word_performance_logs_unified AS
SELECT
    wpl.*,
    vim.centralized_uuid_id as vocabulary_uuid_mapped,
    cv.spanish,
    cv.english,
    cv.theme,
    cv.topic
FROM word_performance_logs wpl
LEFT JOIN vocabulary_id_mapping vim ON wpl.vocabulary_id = vim.legacy_integer_id
LEFT JOIN centralized_vocabulary cv ON vim.centralized_uuid_id = cv.id;

-- ============================================================================
-- STEP 8: VALIDATION QUERIES
-- ============================================================================

-- Validate mapping completeness
DO $$
DECLARE
    unmapped_uvp_count INTEGER;
    unmapped_wpl_count INTEGER;
    total_mappings INTEGER;
BEGIN
    -- Check unmapped user_vocabulary_progress records
    SELECT COUNT(*) INTO unmapped_uvp_count
    FROM user_vocabulary_progress uvp
    LEFT JOIN vocabulary_id_mapping vim ON uvp.vocabulary_id = vim.legacy_integer_id
    WHERE vim.centralized_uuid_id IS NULL;

    -- Check unmapped word_performance_logs records
    SELECT COUNT(*) INTO unmapped_wpl_count
    FROM word_performance_logs wpl
    LEFT JOIN vocabulary_id_mapping vim ON wpl.vocabulary_id = vim.legacy_integer_id
    WHERE vim.centralized_uuid_id IS NULL AND wpl.vocabulary_id IS NOT NULL;

    -- Get total mappings
    SELECT COUNT(*) INTO total_mappings FROM vocabulary_id_mapping;

    -- Log results
    RAISE NOTICE 'Vocabulary ID Migration Validation:';
    RAISE NOTICE '- Total mappings created: %', total_mappings;
    RAISE NOTICE '- Unmapped user_vocabulary_progress records: %', unmapped_uvp_count;
    RAISE NOTICE '- Unmapped word_performance_logs records: %', unmapped_wpl_count;

    IF unmapped_uvp_count > 0 OR unmapped_wpl_count > 0 THEN
        RAISE WARNING 'Some records could not be mapped. Manual review required.';
    ELSE
        RAISE NOTICE 'All records successfully mapped!';
    END IF;
END;
$$;