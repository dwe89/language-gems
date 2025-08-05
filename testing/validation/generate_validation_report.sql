-- Enhanced Tracking System Validation Report Generator
-- This script generates a comprehensive validation report for the enhanced tracking system
-- Run this after completing manual and automated testing

-- ============================================================================
-- EXECUTIVE SUMMARY
-- ============================================================================

SELECT 'ENHANCED TRACKING VALIDATION REPORT' as report_title, NOW() as generated_at;

-- Overall system health check
WITH system_health AS (
    SELECT 
        COUNT(DISTINCT game_type) as total_game_types,
        COUNT(*) as total_sessions,
        COUNT(DISTINCT student_id) as unique_students,
        AVG(accuracy_percentage) as avg_accuracy,
        AVG(duration_seconds) as avg_session_duration,
        COUNT(CASE WHEN ended_at IS NULL THEN 1 END) as incomplete_sessions,
        COUNT(CASE WHEN session_mode = 'assignment' THEN 1 END) as assignment_sessions,
        COUNT(CASE WHEN session_mode = 'free_play' THEN 1 END) as free_play_sessions
    FROM enhanced_game_sessions
    WHERE created_at >= NOW() - INTERVAL '7 days'
)
SELECT 
    'SYSTEM HEALTH SUMMARY' as section,
    total_game_types || ' game types active' as game_coverage,
    total_sessions || ' sessions in last 7 days' as session_volume,
    unique_students || ' unique students' as user_engagement,
    ROUND(avg_accuracy, 1) || '% average accuracy' as performance_level,
    ROUND(avg_session_duration/60, 1) || ' minutes avg session' as engagement_time,
    incomplete_sessions || ' incomplete sessions (' || 
        ROUND((incomplete_sessions::float/total_sessions::float)*100, 1) || '%)' as completion_rate,
    assignment_sessions || ' assignment / ' || free_play_sessions || ' free play' as mode_distribution
FROM system_health;

-- ============================================================================
-- GAME TYPE COVERAGE ANALYSIS
-- ============================================================================

SELECT 'GAME TYPE COVERAGE ANALYSIS' as section;

-- Expected vs actual game types
WITH expected_games AS (
    SELECT unnest(ARRAY[
        'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
        'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
        'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast',
        'memory-match', 'hangman', 'noughts-and-crosses'
    ]) as game_type,
    unnest(ARRAY[
        'skill', 'skill', 'skill', 'skill',
        'skill', 'skill', 'skill',
        'skill', 'skill', 'skill', 'skill',
        'luck', 'luck', 'luck'
    ]) as expected_classification
),
actual_games AS (
    SELECT 
        game_type,
        COUNT(*) as session_count,
        COUNT(DISTINCT student_id) as unique_players,
        AVG(accuracy_percentage) as avg_accuracy,
        AVG(duration_seconds) as avg_duration
    FROM enhanced_game_sessions
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY game_type
)
SELECT 
    eg.game_type,
    eg.expected_classification,
    COALESCE(ag.session_count, 0) as sessions_recorded,
    CASE 
        WHEN ag.session_count > 0 THEN '✅ ACTIVE'
        ELSE '❌ NO SESSIONS'
    END as status,
    COALESCE(ag.unique_players, 0) as unique_players,
    COALESCE(ROUND(ag.avg_accuracy, 1), 0) as avg_accuracy,
    COALESCE(ROUND(ag.avg_duration/60, 1), 0) as avg_duration_minutes
FROM expected_games eg
LEFT JOIN actual_games ag ON eg.game_type = ag.game_type
ORDER BY eg.expected_classification, eg.game_type;

-- ============================================================================
-- SKILL-BASED VS LUCK-BASED VALIDATION
-- ============================================================================

SELECT 'SKILL-BASED GAMES WORD TRACKING VALIDATION' as section;

-- Skill-based games should have word performance logs
WITH skill_games AS (
    SELECT unnest(ARRAY[
        'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
        'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
        'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast'
    ]) as game_type
)
SELECT 
    sg.game_type,
    COUNT(DISTINCT egs.id) as total_sessions,
    COUNT(wpl.id) as word_performance_entries,
    CASE 
        WHEN COUNT(DISTINCT egs.id) = 0 THEN '⚠️ NO SESSIONS'
        WHEN COUNT(wpl.id) = 0 THEN '❌ MISSING WORD TRACKING'
        WHEN COUNT(wpl.id) > 0 THEN '✅ CORRECT TRACKING'
    END as validation_status,
    CASE 
        WHEN COUNT(DISTINCT egs.id) > 0 
        THEN ROUND(COUNT(wpl.id)::float / COUNT(DISTINCT egs.id)::float, 1)
        ELSE 0 
    END as avg_words_per_session
FROM skill_games sg
LEFT JOIN enhanced_game_sessions egs ON sg.game_type = egs.game_type 
    AND egs.created_at >= NOW() - INTERVAL '7 days'
LEFT JOIN word_performance_logs wpl ON egs.id = wpl.session_id
GROUP BY sg.game_type
ORDER BY sg.game_type;

SELECT 'LUCK-BASED GAMES VALIDATION' as section;

-- Luck-based games should NOT have word performance logs
WITH luck_games AS (
    SELECT unnest(ARRAY['memory-match', 'hangman', 'noughts-and-crosses']) as game_type
)
SELECT 
    lg.game_type,
    COUNT(DISTINCT egs.id) as total_sessions,
    COUNT(wpl.id) as word_performance_entries,
    CASE 
        WHEN COUNT(DISTINCT egs.id) = 0 THEN '⚠️ NO SESSIONS'
        WHEN COUNT(wpl.id) = 0 THEN '✅ CORRECT (NO WORD TRACKING)'
        WHEN COUNT(wpl.id) > 0 THEN '❌ UNEXPECTED WORD TRACKING'
    END as validation_status
FROM luck_games lg
LEFT JOIN enhanced_game_sessions egs ON lg.game_type = egs.game_type 
    AND egs.created_at >= NOW() - INTERVAL '7 days'
LEFT JOIN word_performance_logs wpl ON egs.id = wpl.session_id
GROUP BY lg.game_type
ORDER BY lg.game_type;

-- ============================================================================
-- ASSIGNMENT MODE CONSISTENCY VALIDATION
-- ============================================================================

SELECT 'ASSIGNMENT MODE CONSISTENCY VALIDATION' as section;

-- Compare assignment vs free play tracking patterns
SELECT 
    game_type,
    session_mode,
    COUNT(*) as session_count,
    AVG(accuracy_percentage) as avg_accuracy,
    AVG(duration_seconds) as avg_duration,
    AVG(words_attempted) as avg_words_attempted,
    COUNT(CASE WHEN session_data::text LIKE '%assignment_id%' THEN 1 END) as sessions_with_assignment_id
FROM enhanced_game_sessions
WHERE created_at >= NOW() - INTERVAL '7 days'
    AND game_type IN ('vocab-master', 'word-scramble', 'detective-listening') -- Sample skill-based games
GROUP BY game_type, session_mode
ORDER BY game_type, session_mode;

-- ============================================================================
-- DATA QUALITY VALIDATION
-- ============================================================================

SELECT 'DATA QUALITY VALIDATION' as section;

-- Check for data anomalies
WITH quality_checks AS (
    SELECT 
        game_type,
        COUNT(*) as total_sessions,
        -- Duration anomalies
        COUNT(CASE WHEN duration_seconds < 10 THEN 1 END) as suspiciously_short,
        COUNT(CASE WHEN duration_seconds > 3600 THEN 1 END) as suspiciously_long,
        -- Accuracy anomalies
        COUNT(CASE WHEN accuracy_percentage < 0 OR accuracy_percentage > 100 THEN 1 END) as invalid_accuracy,
        -- Word count anomalies
        COUNT(CASE WHEN words_attempted = 0 AND accuracy_percentage > 0 THEN 1 END) as accuracy_without_words,
        COUNT(CASE WHEN words_correct > words_attempted THEN 1 END) as more_correct_than_attempted,
        -- Response time anomalies
        COUNT(CASE WHEN average_response_time_ms < 100 THEN 1 END) as impossibly_fast,
        COUNT(CASE WHEN average_response_time_ms > 60000 THEN 1 END) as extremely_slow
    FROM enhanced_game_sessions
    WHERE created_at >= NOW() - INTERVAL '7 days'
    GROUP BY game_type
)
SELECT 
    game_type,
    total_sessions,
    CASE 
        WHEN (suspiciously_short + suspiciously_long + invalid_accuracy + 
              accuracy_without_words + more_correct_than_attempted + 
              impossibly_fast + extremely_slow) = 0 
        THEN '✅ CLEAN DATA'
        ELSE '⚠️ ' || (suspiciously_short + suspiciously_long + invalid_accuracy + 
                      accuracy_without_words + more_correct_than_attempted + 
                      impossibly_fast + extremely_slow) || ' ANOMALIES'
    END as data_quality_status,
    suspiciously_short || ' short, ' || suspiciously_long || ' long' as duration_issues,
    invalid_accuracy || ' invalid accuracy' as accuracy_issues,
    impossibly_fast || ' too fast, ' || extremely_slow || ' too slow' as response_time_issues
FROM quality_checks
ORDER BY game_type;

-- ============================================================================
-- PERFORMANCE METRICS VALIDATION
-- ============================================================================

SELECT 'PERFORMANCE METRICS VALIDATION' as section;

-- Validate calculated metrics
SELECT 
    game_type,
    COUNT(*) as sessions,
    -- Accuracy validation
    AVG(accuracy_percentage) as recorded_avg_accuracy,
    AVG(CASE 
        WHEN words_attempted > 0 
        THEN (words_correct::float / words_attempted::float) * 100 
        ELSE 0 
    END) as calculated_avg_accuracy,
    -- Duration validation
    AVG(duration_seconds) as recorded_avg_duration,
    AVG(EXTRACT(EPOCH FROM (ended_at - started_at))) as calculated_avg_duration,
    -- Response time validation
    AVG(average_response_time_ms) as recorded_avg_response_time
FROM enhanced_game_sessions
WHERE created_at >= NOW() - INTERVAL '7 days'
    AND ended_at IS NOT NULL
    AND words_attempted > 0
GROUP BY game_type
HAVING COUNT(*) > 0
ORDER BY game_type;

-- ============================================================================
-- WORD PERFORMANCE LOGS VALIDATION
-- ============================================================================

SELECT 'WORD PERFORMANCE LOGS VALIDATION' as section;

-- Validate word performance data quality
WITH word_performance_quality AS (
    SELECT 
        egs.game_type,
        COUNT(wpl.id) as total_word_logs,
        COUNT(CASE WHEN wpl.response_time_ms < 100 THEN 1 END) as impossibly_fast_responses,
        COUNT(CASE WHEN wpl.response_time_ms > 60000 THEN 1 END) as extremely_slow_responses,
        COUNT(CASE WHEN wpl.vocabulary_id IS NULL THEN 1 END) as missing_vocabulary_id,
        COUNT(CASE WHEN wpl.word_text IS NULL OR wpl.word_text = '' THEN 1 END) as missing_word_text,
        AVG(wpl.response_time_ms) as avg_response_time,
        COUNT(CASE WHEN wpl.was_correct THEN 1 END) as correct_responses,
        COUNT(CASE WHEN NOT wpl.was_correct THEN 1 END) as incorrect_responses
    FROM enhanced_game_sessions egs
    JOIN word_performance_logs wpl ON egs.id = wpl.session_id
    WHERE egs.created_at >= NOW() - INTERVAL '7 days'
    GROUP BY egs.game_type
)
SELECT 
    game_type,
    total_word_logs,
    CASE 
        WHEN (impossibly_fast_responses + extremely_slow_responses + 
              missing_vocabulary_id + missing_word_text) = 0 
        THEN '✅ CLEAN WORD DATA'
        ELSE '⚠️ ' || (impossibly_fast_responses + extremely_slow_responses + 
                      missing_vocabulary_id + missing_word_text) || ' ISSUES'
    END as word_data_quality,
    ROUND(avg_response_time/1000.0, 1) || 's avg response' as response_time_summary,
    correct_responses || ' correct, ' || incorrect_responses || ' incorrect' as accuracy_summary,
    ROUND((correct_responses::float/(correct_responses + incorrect_responses)::float)*100, 1) || '% accuracy' as calculated_accuracy
FROM word_performance_quality
ORDER BY game_type;

-- ============================================================================
-- FINAL VALIDATION SUMMARY
-- ============================================================================

SELECT 'FINAL VALIDATION SUMMARY' as section;

WITH validation_summary AS (
    -- Count games with proper tracking
    SELECT 
        COUNT(CASE WHEN game_type IN (
            'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
            'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
            'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast'
        ) THEN 1 END) as skill_games_with_sessions,
        COUNT(CASE WHEN game_type IN ('memory-match', 'hangman', 'noughts-and-crosses') THEN 1 END) as luck_games_with_sessions,
        COUNT(DISTINCT game_type) as total_active_games,
        COUNT(*) as total_sessions,
        COUNT(CASE WHEN session_mode = 'assignment' THEN 1 END) as assignment_sessions,
        COUNT(CASE WHEN ended_at IS NULL THEN 1 END) as incomplete_sessions
    FROM enhanced_game_sessions
    WHERE created_at >= NOW() - INTERVAL '7 days'
),
word_tracking_summary AS (
    SELECT COUNT(DISTINCT egs.game_type) as games_with_word_tracking
    FROM enhanced_game_sessions egs
    JOIN word_performance_logs wpl ON egs.id = wpl.session_id
    WHERE egs.created_at >= NOW() - INTERVAL '7 days'
)
SELECT 
    '🎯 TRACKING COVERAGE' as metric_category,
    vs.total_active_games || '/15 games active' as coverage,
    vs.skill_games_with_sessions || '/11 skill-based games' as skill_game_coverage,
    vs.luck_games_with_sessions || '/3 luck-based games' as luck_game_coverage,
    wts.games_with_word_tracking || ' games with word tracking' as word_tracking_coverage,
    CASE 
        WHEN vs.total_active_games >= 12 AND wts.games_with_word_tracking >= 8 
        THEN '✅ EXCELLENT COVERAGE'
        WHEN vs.total_active_games >= 8 AND wts.games_with_word_tracking >= 5
        THEN '⚠️ GOOD COVERAGE'
        ELSE '❌ INSUFFICIENT COVERAGE'
    END as overall_status
FROM validation_summary vs, word_tracking_summary wts;

-- Recommendations based on findings
SELECT 'RECOMMENDATIONS' as section;
SELECT 
    CASE 
        WHEN COUNT(DISTINCT game_type) < 12 THEN '🔧 Activate missing games: ' || 
            string_agg(missing_game, ', ')
        ELSE '✅ All critical games are active'
    END as game_activation_recommendation
FROM (
    SELECT unnest(ARRAY[
        'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
        'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
        'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast',
        'memory-match', 'hangman', 'noughts-and-crosses'
    ]) as missing_game
    EXCEPT
    SELECT DISTINCT game_type 
    FROM enhanced_game_sessions 
    WHERE created_at >= NOW() - INTERVAL '7 days'
) missing_games;

SELECT 'VALIDATION COMPLETE' as status, NOW() as completed_at;
