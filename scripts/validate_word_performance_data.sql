-- Word Performance Logs Data Validation Script
-- Use this script to validate data integrity and identify issues

-- =====================================================
-- 1. BASIC DATA INTEGRITY CHECKS
-- =====================================================

-- Check for NULL values
SELECT 
    'NULL Values Check' as check_type,
    COUNT(*) as total_records,
    COUNT(language) as records_with_language,
    COUNT(curriculum_level) as records_with_curriculum_level,
    COUNT(*) - COUNT(language) as null_language_count,
    COUNT(*) - COUNT(curriculum_level) as null_curriculum_level_count
FROM word_performance_logs;

-- =====================================================
-- 2. CURRICULUM LEVEL CONSISTENCY CHECK
-- =====================================================

-- Find records where curriculum_level differs from centralized_vocabulary
SELECT 
    'Curriculum Level Mismatch' as check_type,
    COUNT(*) as mismatched_records
FROM word_performance_logs wpl
INNER JOIN centralized_vocabulary cv ON cv.word = wpl.word_text AND cv.language = wpl.language
WHERE wpl.curriculum_level != cv.curriculum_level;

-- Show specific mismatches (limit 20 for review)
SELECT 
    wpl.word_text,
    wpl.language,
    wpl.curriculum_level as log_curriculum_level,
    cv.curriculum_level as vocab_curriculum_level,
    COUNT(*) as occurrence_count
FROM word_performance_logs wpl
INNER JOIN centralized_vocabulary cv ON cv.word = wpl.word_text AND cv.language = wpl.language
WHERE wpl.curriculum_level != cv.curriculum_level
GROUP BY wpl.word_text, wpl.language, wpl.curriculum_level, cv.curriculum_level
ORDER BY occurrence_count DESC
LIMIT 20;

-- =====================================================
-- 3. LANGUAGE CONSISTENCY CHECK
-- =====================================================

-- Check if language matches language_pair
SELECT 
    'Language Pair Consistency' as check_type,
    COUNT(*) as inconsistent_records
FROM word_performance_logs
WHERE language IS NOT NULL 
  AND language_pair IS NOT NULL
  AND NOT (language_pair LIKE language || '_%' OR language_pair LIKE '%_' || language);

-- Show specific inconsistencies
SELECT 
    language,
    language_pair,
    COUNT(*) as count
FROM word_performance_logs
WHERE language IS NOT NULL 
  AND language_pair IS NOT NULL
  AND NOT (language_pair LIKE language || '_%' OR language_pair LIKE '%_' || language)
GROUP BY language, language_pair
ORDER BY count DESC
LIMIT 10;

-- =====================================================
-- 4. DATA DISTRIBUTION ANALYSIS
-- =====================================================

-- Language distribution
SELECT 
    'Language Distribution' as analysis_type,
    language,
    COUNT(*) as record_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM word_performance_logs
GROUP BY language
ORDER BY record_count DESC;

-- Curriculum level distribution
SELECT 
    'Curriculum Level Distribution' as analysis_type,
    curriculum_level,
    COUNT(*) as record_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM word_performance_logs
GROUP BY curriculum_level
ORDER BY record_count DESC;

-- Combined distribution
SELECT 
    'Combined Distribution' as analysis_type,
    language,
    curriculum_level,
    COUNT(*) as record_count
FROM word_performance_logs
GROUP BY language, curriculum_level
ORDER BY language, curriculum_level;

-- =====================================================
-- 5. RECENT DATA QUALITY CHECK
-- =====================================================

-- Check data quality for recent records (last 7 days)
SELECT 
    'Recent Data Quality (7 days)' as check_type,
    COUNT(*) as total_recent_records,
    COUNT(language) as records_with_language,
    COUNT(curriculum_level) as records_with_curriculum_level,
    AVG(CASE WHEN language IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100 as language_completeness_pct,
    AVG(CASE WHEN curriculum_level IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100 as curriculum_completeness_pct
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '7 days';

-- =====================================================
-- 6. ORPHANED RECORDS CHECK
-- =====================================================

-- Check for records with session_id that don't exist in enhanced_game_sessions
SELECT 
    'Orphaned Session Records' as check_type,
    COUNT(*) as orphaned_count
FROM word_performance_logs wpl
LEFT JOIN enhanced_game_sessions egs ON egs.id = wpl.session_id
WHERE egs.id IS NULL;

-- Check for records with vocabulary_id that don't exist in centralized_vocabulary
SELECT 
    'Orphaned Vocabulary Records' as check_type,
    COUNT(*) as orphaned_count
FROM word_performance_logs wpl
LEFT JOIN centralized_vocabulary cv ON cv.id = wpl.vocabulary_id
WHERE wpl.vocabulary_id IS NOT NULL AND cv.id IS NULL;

-- =====================================================
-- 7. PERFORMANCE METRICS
-- =====================================================

-- Check index usage and table statistics
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals,
    most_common_freqs
FROM pg_stats 
WHERE tablename = 'word_performance_logs' 
  AND attname IN ('language', 'curriculum_level')
ORDER BY attname;

-- =====================================================
-- 8. SUMMARY REPORT
-- =====================================================

-- Generate a summary report
WITH data_quality AS (
    SELECT 
        COUNT(*) as total_records,
        COUNT(language) as language_complete,
        COUNT(curriculum_level) as curriculum_complete,
        COUNT(*) - COUNT(language) as language_missing,
        COUNT(*) - COUNT(curriculum_level) as curriculum_missing
    FROM word_performance_logs
),
mismatches AS (
    SELECT COUNT(*) as curriculum_mismatches
    FROM word_performance_logs wpl
    INNER JOIN centralized_vocabulary cv ON cv.word = wpl.word_text AND cv.language = wpl.language
    WHERE wpl.curriculum_level != cv.curriculum_level
)
SELECT 
    'SUMMARY REPORT' as report_section,
    dq.total_records,
    dq.language_complete,
    dq.curriculum_complete,
    dq.language_missing,
    dq.curriculum_missing,
    m.curriculum_mismatches,
    CASE 
        WHEN dq.language_missing = 0 AND dq.curriculum_missing = 0 AND m.curriculum_mismatches = 0 
        THEN '✓ PASS' 
        ELSE '⚠ ISSUES FOUND' 
    END as overall_status
FROM data_quality dq, mismatches m;
