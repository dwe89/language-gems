-- Migration: Fix word_performance_logs data integrity
-- Date: 2025-08-05
-- Description: Fixes existing word_performance_logs records with missing or incorrect language/curriculum_level data

-- =====================================================
-- 1. BACKUP EXISTING DATA (for safety)
-- =====================================================

-- Create a backup table with current state
CREATE TABLE IF NOT EXISTS word_performance_logs_backup_20250805 AS 
SELECT * FROM word_performance_logs;

-- Add comment to track backup
COMMENT ON TABLE word_performance_logs_backup_20250805 IS 'Backup of word_performance_logs before data cleanup on 2025-08-05';

-- =====================================================
-- 2. FIX CURRICULUM_LEVEL BASED ON CENTRALIZED_VOCABULARY
-- =====================================================

-- Update curriculum_level for records where centralized_vocabulary has different value
UPDATE word_performance_logs 
SET curriculum_level = cv.curriculum_level,
    updated_at = NOW()
FROM centralized_vocabulary cv
WHERE cv.word = word_performance_logs.word_text 
  AND cv.language = word_performance_logs.language
  AND word_performance_logs.curriculum_level != cv.curriculum_level
  AND cv.curriculum_level IS NOT NULL;

-- =====================================================
-- 3. FIX LANGUAGE BASED ON LANGUAGE_PAIR
-- =====================================================

-- Update language for records where language is NULL but language_pair exists
UPDATE word_performance_logs 
SET language = CASE 
    WHEN language_pair LIKE 'es_%' THEN 'es'
    WHEN language_pair LIKE 'fr_%' THEN 'fr'
    WHEN language_pair LIKE 'de_%' THEN 'de'
    WHEN language_pair LIKE 'it_%' THEN 'it'
    WHEN language_pair LIKE '%_english' THEN split_part(language_pair, '_', 1)
    ELSE 'es' -- fallback to Spanish
END
WHERE language IS NULL 
  AND language_pair IS NOT NULL;

-- =====================================================
-- 4. FIX CURRICULUM_LEVEL BASED ON ASSIGNMENTS
-- =====================================================

-- Update curriculum_level for records where we can derive it from assignments
UPDATE word_performance_logs 
SET curriculum_level = a.curriculum_level
FROM enhanced_game_sessions egs
INNER JOIN assignments a ON a.id = egs.assignment_id
WHERE word_performance_logs.session_id = egs.id
  AND word_performance_logs.curriculum_level IS NULL
  AND a.curriculum_level IS NOT NULL;

-- =====================================================
-- 5. SET DEFAULT VALUES FOR REMAINING NULL RECORDS
-- =====================================================

-- Set default language for any remaining NULL language records
UPDATE word_performance_logs 
SET language = 'es'
WHERE language IS NULL;

-- Set default curriculum_level for any remaining NULL curriculum_level records
UPDATE word_performance_logs 
SET curriculum_level = 'KS3'
WHERE curriculum_level IS NULL;

-- =====================================================
-- 6. VERIFICATION QUERIES
-- =====================================================

-- Check the results of our cleanup
DO $$
DECLARE
    total_records INTEGER;
    records_with_language INTEGER;
    records_with_curriculum_level INTEGER;
    records_fixed INTEGER;
BEGIN
    -- Get counts
    SELECT COUNT(*) INTO total_records FROM word_performance_logs;
    SELECT COUNT(*) INTO records_with_language FROM word_performance_logs WHERE language IS NOT NULL;
    SELECT COUNT(*) INTO records_with_curriculum_level FROM word_performance_logs WHERE curriculum_level IS NOT NULL;
    
    -- Calculate records that were in backup but different now
    SELECT COUNT(*) INTO records_fixed 
    FROM word_performance_logs wpl
    INNER JOIN word_performance_logs_backup_20250805 backup ON backup.id = wpl.id
    WHERE (wpl.language != backup.language OR wpl.curriculum_level != backup.curriculum_level);
    
    -- Output results
    RAISE NOTICE 'Data cleanup completed:';
    RAISE NOTICE '- Total records: %', total_records;
    RAISE NOTICE '- Records with language: %', records_with_language;
    RAISE NOTICE '- Records with curriculum_level: %', records_with_curriculum_level;
    RAISE NOTICE '- Records fixed: %', records_fixed;
    
    -- Verify data integrity
    IF records_with_language = total_records AND records_with_curriculum_level = total_records THEN
        RAISE NOTICE '✓ Data integrity verified: All records have language and curriculum_level';
    ELSE
        RAISE WARNING '⚠ Data integrity issue: Some records still missing language or curriculum_level';
    END IF;
END $$;

-- =====================================================
-- 7. CREATE INDEXES FOR PERFORMANCE (if not exists)
-- =====================================================

-- Add indexes for the new columns if they don't exist
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_language ON word_performance_logs(language);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_curriculum_level ON word_performance_logs(curriculum_level);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_language_curriculum ON word_performance_logs(language, curriculum_level);

-- =====================================================
-- 8. CLEANUP INSTRUCTIONS
-- =====================================================

-- To remove the backup table after verification (run manually if needed):
-- DROP TABLE word_performance_logs_backup_20250805;

-- Add final comment
COMMENT ON TABLE word_performance_logs IS 'Word-level performance tracking with enhanced analytics fields (language, curriculum_level). Data cleanup completed on 2025-08-05.';
