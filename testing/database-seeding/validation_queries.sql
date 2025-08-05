-- Enhanced Tracking System Validation Queries
-- These queries validate that the analytics system works correctly with test data

-- ============================================================================
-- 1. BASIC SESSION TRACKING VALIDATION
-- ============================================================================

-- Verify all game types are represented
SELECT 'Game Type Coverage Validation' as test_name;
SELECT 
    game_type,
    COUNT(*) as session_count,
    COUNT(DISTINCT student_id) as unique_students,
    AVG(accuracy_percentage) as avg_accuracy,
    AVG(duration_seconds) as avg_duration_seconds
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%'
GROUP BY game_type
ORDER BY session_count DESC;

-- Expected: Should show all 15 game types with realistic data

-- ============================================================================
-- 2. SKILL-BASED VS LUCK-BASED CLASSIFICATION VALIDATION
-- ============================================================================

-- Skill-based games should have word performance logs
SELECT 'Skill-Based Games Word Tracking Validation' as test_name;
SELECT 
    egs.game_type,
    COUNT(DISTINCT egs.id) as total_sessions,
    COUNT(wpl.id) as word_performance_entries,
    CASE 
        WHEN COUNT(wpl.id) > 0 THEN 'CORRECT: Has word tracking'
        ELSE 'ERROR: Missing word tracking'
    END as validation_status
FROM enhanced_game_sessions egs
LEFT JOIN word_performance_logs wpl ON egs.id = wpl.game_session_id
WHERE egs.student_id LIKE 'test-%'
    AND egs.game_type IN (
        'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
        'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
        'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast'
    )
GROUP BY egs.game_type
ORDER BY egs.game_type;

-- Luck-based games should NOT have word performance logs
SELECT 'Luck-Based Games Validation' as test_name;
SELECT 
    egs.game_type,
    COUNT(DISTINCT egs.id) as total_sessions,
    COUNT(wpl.id) as word_performance_entries,
    CASE 
        WHEN COUNT(wpl.id) = 0 THEN 'CORRECT: No word tracking'
        ELSE 'ERROR: Unexpected word tracking'
    END as validation_status
FROM enhanced_game_sessions egs
LEFT JOIN word_performance_logs wpl ON egs.id = wpl.game_session_id
WHERE egs.student_id LIKE 'test-%'
    AND egs.game_type IN ('memory-match', 'hangman', 'noughts-and-crosses')
GROUP BY egs.game_type
ORDER BY egs.game_type;

-- ============================================================================
-- 3. WEAK WORDS IDENTIFICATION VALIDATION
-- ============================================================================

-- Test weak words algorithm (accuracy < 60% and attempts >= 3)
SELECT 'Weak Words Identification Test' as test_name;
SELECT 
    uvp.user_id,
    uvp.vocabulary_id,
    v.spanish as word,
    v.english as translation,
    uvp.times_seen,
    uvp.times_correct,
    ROUND((uvp.times_correct::float / uvp.times_seen::float) * 100, 2) as accuracy_percentage,
    CASE 
        WHEN uvp.times_seen >= 3 AND (uvp.times_correct::float / uvp.times_seen::float) < 0.6 
        THEN 'WEAK WORD' 
        ELSE 'NOT WEAK' 
    END as classification
FROM user_vocabulary_progress uvp
JOIN vocabulary v ON uvp.vocabulary_id = v.id
WHERE uvp.user_id LIKE 'test-%'
    AND uvp.times_seen > 0
ORDER BY accuracy_percentage ASC;

-- Expected: Should identify hermano (25%), madre (16%), casa (0%) as weak words

-- ============================================================================
-- 4. STRONG WORDS IDENTIFICATION VALIDATION  
-- ============================================================================

-- Test strong words algorithm (accuracy >= 80%, attempts >= 5, learned = true)
SELECT 'Strong Words Identification Test' as test_name;
SELECT 
    uvp.user_id,
    uvp.vocabulary_id,
    v.spanish as word,
    v.english as translation,
    uvp.times_seen,
    uvp.times_correct,
    uvp.is_learned,
    ROUND((uvp.times_correct::float / uvp.times_seen::float) * 100, 2) as accuracy_percentage,
    CASE 
        WHEN uvp.times_seen >= 5 
             AND (uvp.times_correct::float / uvp.times_seen::float) >= 0.8 
             AND uvp.is_learned = true
        THEN 'STRONG WORD' 
        ELSE 'NOT STRONG' 
    END as classification
FROM user_vocabulary_progress uvp
JOIN vocabulary v ON uvp.vocabulary_id = v.id
WHERE uvp.user_id LIKE 'test-%'
    AND uvp.times_seen > 0
ORDER BY accuracy_percentage DESC;

-- Expected: Should identify padre (90%), perro (91%), gato (87%) as strong words

-- ============================================================================
-- 5. SESSION DURATION AND RESPONSE TIME VALIDATION
-- ============================================================================

-- Validate session duration calculations
SELECT 'Session Duration Validation' as test_name;
SELECT 
    game_type,
    student_id,
    started_at,
    ended_at,
    duration_seconds as recorded_duration,
    EXTRACT(EPOCH FROM (ended_at - started_at))::integer as calculated_duration,
    CASE 
        WHEN ended_at IS NULL THEN 'INCOMPLETE SESSION'
        WHEN ABS(duration_seconds - EXTRACT(EPOCH FROM (ended_at - started_at))::integer) <= 5 
        THEN 'DURATION CORRECT'
        ELSE 'DURATION MISMATCH'
    END as validation_status
FROM enhanced_game_sessions
WHERE student_id LIKE 'test-%'
ORDER BY started_at DESC;

-- ============================================================================
-- 6. ACCURACY CALCULATION VALIDATION
-- ============================================================================

-- Validate accuracy percentage calculations
SELECT 'Accuracy Calculation Validation' as test_name;
SELECT 
    game_type,
    student_id,
    words_attempted,
    words_correct,
    accuracy_percentage as recorded_accuracy,
    CASE 
        WHEN words_attempted > 0 
        THEN ROUND((words_correct::float / words_attempted::float) * 100, 1)
        ELSE 0 
    END as calculated_accuracy,
    CASE 
        WHEN words_attempted = 0 AND accuracy_percentage = 0 THEN 'CORRECT: Zero division handled'
        WHEN ABS(accuracy_percentage - ROUND((words_correct::float / words_attempted::float) * 100, 1)) <= 0.1 
        THEN 'ACCURACY CORRECT'
        ELSE 'ACCURACY MISMATCH'
    END as validation_status
FROM enhanced_game_sessions
WHERE student_id LIKE 'test-%'
    AND words_attempted IS NOT NULL
ORDER BY accuracy_percentage DESC;

-- ============================================================================
-- 7. ASSIGNMENT VS FREE PLAY MODE VALIDATION
-- ============================================================================

-- Verify assignment mode tracking
SELECT 'Assignment Mode Validation' as test_name;
SELECT 
    session_mode,
    COUNT(*) as session_count,
    COUNT(CASE WHEN session_data::text LIKE '%assignment_id%' THEN 1 END) as sessions_with_assignment_id,
    AVG(accuracy_percentage) as avg_accuracy,
    AVG(duration_seconds) as avg_duration
FROM enhanced_game_sessions
WHERE student_id LIKE 'test-%'
GROUP BY session_mode
ORDER BY session_mode;

-- Expected: Assignment mode sessions should have assignment_id in session_data

-- ============================================================================
-- 8. EDGE CASES VALIDATION
-- ============================================================================

-- Test incomplete sessions handling
SELECT 'Incomplete Sessions Validation' as test_name;
SELECT 
    game_type,
    student_id,
    started_at,
    ended_at,
    completion_percentage,
    CASE 
        WHEN ended_at IS NULL THEN 'INCOMPLETE SESSION'
        WHEN completion_percentage < 100 THEN 'PARTIAL COMPLETION'
        ELSE 'COMPLETE SESSION'
    END as session_status
FROM enhanced_game_sessions
WHERE student_id LIKE 'test-%'
    AND (ended_at IS NULL OR completion_percentage < 100)
ORDER BY started_at DESC;

-- Test perfect and zero performance sessions
SELECT 'Performance Extremes Validation' as test_name;
SELECT 
    game_type,
    student_id,
    accuracy_percentage,
    words_attempted,
    words_correct,
    CASE 
        WHEN accuracy_percentage = 100 THEN 'PERFECT PERFORMANCE'
        WHEN accuracy_percentage = 0 THEN 'ZERO PERFORMANCE'
        ELSE 'NORMAL PERFORMANCE'
    END as performance_category
FROM enhanced_game_sessions
WHERE student_id LIKE 'test-%'
    AND (accuracy_percentage = 100 OR accuracy_percentage = 0)
ORDER BY accuracy_percentage DESC;

-- ============================================================================
-- 9. WORD PERFORMANCE LOGS VALIDATION
-- ============================================================================

-- Validate word performance log data integrity
SELECT 'Word Performance Logs Validation' as test_name;
SELECT
    COUNT(*) as total_logs,
    COUNT(CASE WHEN was_correct THEN 1 END) as correct_responses,
    COUNT(CASE WHEN NOT was_correct THEN 1 END) as incorrect_responses,
    AVG(response_time_ms) as avg_response_time,
    MIN(response_time_ms) as min_response_time,
    MAX(response_time_ms) as max_response_time,
    COUNT(CASE WHEN response_time_ms < 1000 THEN 1 END) as suspiciously_fast,
    COUNT(CASE WHEN response_time_ms > 30000 THEN 1 END) as suspiciously_slow
FROM word_performance_logs wpl
JOIN enhanced_game_sessions egs ON wpl.session_id = egs.id
WHERE egs.student_id LIKE 'test-%';

-- ============================================================================
-- 10. ANALYTICS QUERY PERFORMANCE VALIDATION
-- ============================================================================

-- Test the actual analytics queries used by the dashboard
SELECT 'Student Analytics Query Test' as test_name;

-- Simulate the weak words analysis query
WITH weak_words AS (
    SELECT 
        uvp.user_id,
        uvp.vocabulary_id,
        v.spanish,
        v.english,
        uvp.times_seen,
        uvp.times_correct,
        ROUND((uvp.times_correct::float / uvp.times_seen::float) * 100, 2) as accuracy
    FROM user_vocabulary_progress uvp
    JOIN vocabulary v ON uvp.vocabulary_id = v.id
    WHERE uvp.user_id = 'test-beginner'
        AND uvp.times_seen >= 3
        AND (uvp.times_correct::float / uvp.times_seen::float) < 0.6
)
SELECT 'Weak words for test-beginner:' as result_type, COUNT(*) as count FROM weak_words;

-- Simulate the strong words analysis query  
WITH strong_words AS (
    SELECT 
        uvp.user_id,
        uvp.vocabulary_id,
        v.spanish,
        v.english,
        uvp.times_seen,
        uvp.times_correct,
        ROUND((uvp.times_correct::float / uvp.times_seen::float) * 100, 2) as accuracy
    FROM user_vocabulary_progress uvp
    JOIN vocabulary v ON uvp.vocabulary_id = v.id
    WHERE uvp.user_id = 'test-advanced'
        AND uvp.times_seen >= 5
        AND (uvp.times_correct::float / uvp.times_seen::float) >= 0.8
        AND uvp.is_learned = true
)
SELECT 'Strong words for test-advanced:' as result_type, COUNT(*) as count FROM strong_words;

-- ============================================================================
-- SUMMARY VALIDATION REPORT
-- ============================================================================

SELECT 'VALIDATION SUMMARY' as report_section;
SELECT 
    'Total test sessions created' as metric,
    COUNT(*) as value
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%';

SELECT
    'Total word performance logs created' as metric,
    COUNT(*) as value
FROM word_performance_logs wpl
JOIN enhanced_game_sessions egs ON wpl.session_id = egs.id
WHERE egs.student_id LIKE 'test-%';

SELECT 
    'Unique game types tested' as metric,
    COUNT(DISTINCT game_type) as value
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%';

SELECT 
    'Assignment mode sessions' as metric,
    COUNT(*) as value
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%' AND session_mode = 'assignment';

SELECT 
    'Free play sessions' as metric,
    COUNT(*) as value
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%' AND session_mode = 'free_play';

-- Clean up test data (uncomment to remove test data after validation)
-- DELETE FROM word_performance_logs WHERE session_id IN (SELECT id FROM enhanced_game_sessions WHERE student_id LIKE 'test-%');
-- DELETE FROM enhanced_game_sessions WHERE student_id LIKE 'test-%';
-- DELETE FROM user_vocabulary_progress WHERE user_id LIKE 'test-%';
