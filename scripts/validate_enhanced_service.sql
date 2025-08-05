-- Validation script to verify Enhanced Game Service is working correctly
-- Run this after deploying the enhanced service to production

-- =====================================================
-- 1. CHECK RECENT DATA QUALITY
-- =====================================================

-- Check that new records (created after the enhancement) have proper language and curriculum_level
SELECT 
    'Recent Data Quality Check' as test_name,
    COUNT(*) as total_recent_records,
    COUNT(CASE WHEN language IS NOT NULL THEN 1 END) as records_with_language,
    COUNT(CASE WHEN curriculum_level IS NOT NULL THEN 1 END) as records_with_curriculum_level,
    ROUND(AVG(CASE WHEN language IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100, 2) as language_completeness_pct,
    ROUND(AVG(CASE WHEN curriculum_level IS NOT NULL THEN 1.0 ELSE 0.0 END) * 100, 2) as curriculum_completeness_pct
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'; -- After enhancement deployment

-- =====================================================
-- 2. VERIFY LANGUAGE DERIVATION LOGIC
-- =====================================================

-- Check that language matches language_pair for recent records
SELECT 
    'Language Derivation Check' as test_name,
    language,
    language_pair,
    COUNT(*) as count,
    CASE 
        WHEN language = 'es' AND language_pair LIKE 'es_%' THEN '✅ Correct'
        WHEN language = 'fr' AND language_pair LIKE 'fr_%' THEN '✅ Correct'
        WHEN language = 'de' AND language_pair LIKE 'de_%' THEN '✅ Correct'
        WHEN language = 'it' AND language_pair LIKE 'it_%' THEN '✅ Correct'
        ELSE '❌ Mismatch'
    END as validation_status
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'
GROUP BY language, language_pair
ORDER BY count DESC;

-- =====================================================
-- 3. VERIFY CURRICULUM LEVEL DERIVATION
-- =====================================================

-- Check curriculum level consistency with centralized_vocabulary for recent records
SELECT 
    'Curriculum Level Consistency Check' as test_name,
    wpl.language,
    wpl.curriculum_level as log_curriculum_level,
    cv.curriculum_level as vocab_curriculum_level,
    COUNT(*) as count,
    CASE 
        WHEN wpl.curriculum_level = cv.curriculum_level THEN '✅ Consistent'
        WHEN cv.curriculum_level IS NULL THEN '⚠️ No vocab reference'
        ELSE '❌ Inconsistent'
    END as validation_status
FROM word_performance_logs wpl
LEFT JOIN centralized_vocabulary cv ON cv.word = wpl.word_text AND cv.language = wpl.language
WHERE wpl.timestamp >= NOW() - INTERVAL '1 hour'
  AND wpl.timestamp > '2025-08-05 12:00:00'
GROUP BY wpl.language, wpl.curriculum_level, cv.curriculum_level
ORDER BY count DESC;

-- =====================================================
-- 4. CHECK DEFAULT VALUE ASSIGNMENT
-- =====================================================

-- Verify that fallback values are being used appropriately
SELECT 
    'Default Values Check' as test_name,
    language,
    curriculum_level,
    COUNT(*) as count,
    CASE 
        WHEN language = 'es' AND curriculum_level = 'KS3' THEN '✅ Expected defaults'
        WHEN language IN ('es', 'fr', 'de', 'it') AND curriculum_level IN ('KS3', 'KS4') THEN '✅ Valid values'
        ELSE '⚠️ Unexpected values'
    END as validation_status
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'
GROUP BY language, curriculum_level
ORDER BY count DESC;

-- =====================================================
-- 5. PERFORMANCE IMPACT CHECK
-- =====================================================

-- Check if the enhanced logging is causing performance issues
SELECT 
    'Performance Impact Check' as test_name,
    COUNT(*) as total_records,
    MIN(timestamp) as earliest_record,
    MAX(timestamp) as latest_record,
    EXTRACT(EPOCH FROM (MAX(timestamp) - MIN(timestamp))) / COUNT(*) as avg_seconds_between_records
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00';

-- =====================================================
-- 6. ERROR DETECTION
-- =====================================================

-- Look for any obvious data quality issues in recent records
SELECT 
    'Error Detection' as test_name,
    'Empty word_text' as error_type,
    COUNT(*) as error_count
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'
  AND (word_text IS NULL OR word_text = '')

UNION ALL

SELECT 
    'Error Detection' as test_name,
    'Invalid language values' as error_type,
    COUNT(*) as error_count
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'
  AND language NOT IN ('es', 'fr', 'de', 'it', 'en')

UNION ALL

SELECT 
    'Error Detection' as test_name,
    'Invalid curriculum_level values' as error_type,
    COUNT(*) as error_count
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00'
  AND curriculum_level NOT IN ('KS3', 'KS4');

-- =====================================================
-- 7. SUMMARY VALIDATION REPORT
-- =====================================================

-- Generate overall validation summary
WITH recent_data AS (
    SELECT 
        COUNT(*) as total_records,
        COUNT(CASE WHEN language IS NOT NULL THEN 1 END) as language_complete,
        COUNT(CASE WHEN curriculum_level IS NOT NULL THEN 1 END) as curriculum_complete
    FROM word_performance_logs
    WHERE timestamp >= NOW() - INTERVAL '1 hour'
      AND timestamp > '2025-08-05 12:00:00'
),
consistency_check AS (
    SELECT COUNT(*) as consistent_records
    FROM word_performance_logs wpl
    INNER JOIN centralized_vocabulary cv ON cv.word = wpl.word_text AND cv.language = wpl.language
    WHERE wpl.timestamp >= NOW() - INTERVAL '1 hour'
      AND wpl.timestamp > '2025-08-05 12:00:00'
      AND wpl.curriculum_level = cv.curriculum_level
)
SELECT 
    '🎯 ENHANCED SERVICE VALIDATION SUMMARY' as report_title,
    rd.total_records,
    rd.language_complete,
    rd.curriculum_complete,
    cc.consistent_records,
    CASE 
        WHEN rd.total_records = 0 THEN '⏳ No recent data to validate'
        WHEN rd.language_complete = rd.total_records 
         AND rd.curriculum_complete = rd.total_records 
         AND cc.consistent_records > 0 
        THEN '✅ ENHANCED SERVICE WORKING CORRECTLY'
        WHEN rd.language_complete = rd.total_records 
         AND rd.curriculum_complete = rd.total_records 
        THEN '✅ DATA ENRICHMENT WORKING (No consistency check possible)'
        ELSE '❌ ISSUES DETECTED - REVIEW REQUIRED'
    END as overall_status
FROM recent_data rd, consistency_check cc;

-- =====================================================
-- 8. RECOMMENDATIONS
-- =====================================================

-- Provide actionable recommendations based on findings
SELECT 
    '💡 RECOMMENDATIONS' as section,
    CASE 
        WHEN COUNT(*) = 0 THEN 'Generate some test data by playing games to validate the enhanced service'
        WHEN COUNT(CASE WHEN language IS NULL THEN 1 END) > 0 THEN 'Some records missing language - check deriveLanguageFromContext method'
        WHEN COUNT(CASE WHEN curriculum_level IS NULL THEN 1 END) > 0 THEN 'Some records missing curriculum_level - check deriveCurriculumLevel method'
        ELSE 'Enhanced service appears to be working correctly - continue monitoring'
    END as recommendation
FROM word_performance_logs
WHERE timestamp >= NOW() - INTERVAL '1 hour'
  AND timestamp > '2025-08-05 12:00:00';
