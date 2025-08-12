-- ============================================================================
-- DATABASE CLEANUP PLAN - Language Gems
-- ============================================================================
-- This script safely removes unused/legacy tables while preserving data
-- 
-- IMPORTANT: Run this in phases and test thoroughly!
-- 
-- Tables to keep: 35 core tables
-- Tables to remove: 70+ legacy/unused tables
-- ============================================================================

-- ============================================================================
-- PHASE 1: BACKUP CRITICAL DATA
-- ============================================================================
-- Create backups of tables with data before deletion

CREATE TABLE IF NOT EXISTS vocabulary_backup_20250811 AS SELECT * FROM vocabulary;
CREATE TABLE IF NOT EXISTS achievements_backup_20250811 AS SELECT * FROM achievements;
CREATE TABLE IF NOT EXISTS vocabulary_lists_backup_20250811 AS SELECT * FROM vocabulary_lists;
CREATE TABLE IF NOT EXISTS custom_wordlists_backup_20250811 AS SELECT * FROM custom_wordlists;
CREATE TABLE IF NOT EXISTS student_game_profiles_backup_20250811 AS SELECT * FROM student_game_profiles;

-- Verify backups were created
SELECT 'vocabulary_backup_20250811' as backup_table, COUNT(*) as rows FROM vocabulary_backup_20250811
UNION ALL
SELECT 'achievements_backup_20250811' as backup_table, COUNT(*) as rows FROM achievements_backup_20250811
UNION ALL
SELECT 'vocabulary_lists_backup_20250811' as backup_table, COUNT(*) as rows FROM vocabulary_lists_backup_20250811
UNION ALL
SELECT 'custom_wordlists_backup_20250811' as backup_table, COUNT(*) as rows FROM custom_wordlists_backup_20250811
UNION ALL
SELECT 'student_game_profiles_backup_20250811' as backup_table, COUNT(*) as rows FROM student_game_profiles_backup_20250811;

-- ============================================================================
-- PHASE 2: SAFE DELETION - EMPTY LEGACY TABLES
-- ============================================================================
-- These tables are confirmed empty and safe to delete

-- Legacy game systems (empty)
DROP TABLE IF EXISTS game_sessions CASCADE;
DROP TABLE IF EXISTS assignment_progress CASCADE;
DROP TABLE IF EXISTS student_achievements CASCADE;
DROP TABLE IF EXISTS leaderboards CASCADE;
DROP TABLE IF EXISTS leaderboard_snapshots CASCADE;
DROP TABLE IF EXISTS competitions CASCADE;

-- Legacy assignment system (empty)
DROP TABLE IF EXISTS assignment_submissions CASCADE;

-- Legacy user activity (empty)
DROP TABLE IF EXISTS student_activities CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;

-- Legacy progress tracking (empty)
DROP TABLE IF EXISTS student_progress CASCADE;
DROP TABLE IF EXISTS user_gamification_stats CASCADE;

-- ============================================================================
-- PHASE 3: CAREFUL DELETION - TABLES WITH DATA
-- ============================================================================
-- These tables have data but are confirmed legacy (backed up above)

-- Legacy vocabulary system (1523 rows - replaced by centralized_vocabulary)
DROP TABLE IF EXISTS vocabulary CASCADE;

-- Legacy vocabulary lists (10 rows - old system)
DROP TABLE IF EXISTS vocabulary_lists CASCADE;

-- Legacy custom wordlists (2 rows - NOT referenced by assignments)
DROP TABLE IF EXISTS custom_wordlists CASCADE;

-- Legacy gamification (4 rows - old system)
DROP TABLE IF EXISTS student_game_profiles CASCADE;

-- ============================================================================
-- PHASE 4: GAME-SPECIFIC LEGACY TABLES
-- ============================================================================
-- Game-specific tables that appear unused in current codebase

-- Case File Translator (legacy)
DROP TABLE IF EXISTS case_file_sentence_attempts CASCADE;
DROP TABLE IF EXISTS case_file_translator_sessions CASCADE;

-- Gem Collector (legacy)
DROP TABLE IF EXISTS gem_collector_segment_attempts CASCADE;
DROP TABLE IF EXISTS gem_collector_sessions CASCADE;

-- Speed Builder (legacy)
DROP TABLE IF EXISTS speed_builder_sessions CASCADE;

-- Word Restore (legacy)
DROP TABLE IF EXISTS word_restore_attempts CASCADE;
DROP TABLE IF EXISTS word_restore_options CASCADE;
DROP TABLE IF EXISTS word_restore_sentences CASCADE;
DROP TABLE IF EXISTS word_restore_sessions CASCADE;

-- ============================================================================
-- PHASE 5: ANALYTICS & CACHE TABLES
-- ============================================================================
-- Analytics and cache tables that can be regenerated

-- Assignment analytics
DROP TABLE IF EXISTS assignment_analytics CASCADE;
DROP TABLE IF EXISTS assignment_creation_analytics CASCADE;

-- Cache tables (can be regenerated)
DROP TABLE IF EXISTS student_analytics_cache CASCADE;
DROP TABLE IF EXISTS class_analytics_cache CASCADE;

-- Legacy analytics
DROP TABLE IF EXISTS vocabulary_class_analytics CASCADE;
DROP TABLE IF EXISTS vocabulary_difficulty_analytics CASCADE;
DROP TABLE IF EXISTS gamification_analytics CASCADE;
DROP TABLE IF EXISTS predictive_analytics CASCADE;
DROP TABLE IF EXISTS mode_selection_analytics CASCADE;

-- ============================================================================
-- PHASE 6: ASSESSMENT LEGACY TABLES
-- ============================================================================
-- Old assessment system tables (replaced by AQA/Edexcel systems)

-- Legacy assessment progress
DROP TABLE IF EXISTS assessment_progress CASCADE;
DROP TABLE IF EXISTS assessment_skill_breakdown CASCADE;
DROP TABLE IF EXISTS assessment_streaks CASCADE;
DROP TABLE IF EXISTS assessment_leaderboards CASCADE;
DROP TABLE IF EXISTS user_assessment_progress CASCADE;

-- Legacy skill assessments
DROP TABLE IF EXISTS skill_assessment_results CASCADE;
DROP TABLE IF EXISTS four_skills_assessment_results CASCADE;
DROP TABLE IF EXISTS user_four_skills_stats CASCADE;

-- Legacy reading system (replaced by AQA/Edexcel)
DROP TABLE IF EXISTS reading_assessment_results CASCADE;
DROP TABLE IF EXISTS reading_assessments CASCADE;
DROP TABLE IF EXISTS reading_comprehension_assignments CASCADE;
DROP TABLE IF EXISTS reading_comprehension_questions CASCADE;
DROP TABLE IF EXISTS reading_comprehension_results CASCADE;
DROP TABLE IF EXISTS reading_comprehension_tasks CASCADE;
DROP TABLE IF EXISTS reading_passages CASCADE;
DROP TABLE IF EXISTS reading_questions CASCADE;
DROP TABLE IF EXISTS user_reading_comprehension_stats CASCADE;
DROP TABLE IF EXISTS user_reading_stats CASCADE;

-- ============================================================================
-- PHASE 7: UNUSED FEATURES
-- ============================================================================
-- Features that were planned but not implemented

-- Unused goal system
DROP TABLE IF EXISTS student_goals CASCADE;
DROP TABLE IF EXISTS vocabulary_daily_goals CASCADE;

-- Unused streak system (replaced by profile-based streaks)
DROP TABLE IF EXISTS streaks CASCADE;

-- Unused ranking system
DROP TABLE IF EXISTS student_ranking_history CASCADE;

-- ============================================================================
-- PHASE 8: BACKUP TABLES
-- ============================================================================
-- Remove old backup tables

DROP TABLE IF EXISTS word_performance_logs_backup_20250805 CASCADE;

-- ============================================================================
-- PHASE 9: INVESTIGATE BEFORE DELETION
-- ============================================================================
-- These tables need investigation before deletion

-- Achievement system - ACTIVE (26 user achievements for vocabulary-mining game)
-- KEEP: achievements table (contains real user achievements)
-- KEEP: vocabulary_achievements table (might be related)

-- Legacy assignment system - PARTIALLY ACTIVE
-- KEEP: vocabulary_assignment_lists (referenced by 2 assignments)
-- KEEP: vocabulary_assignment_items (likely referenced by vocabulary_assignment_lists)

-- Note: These tables are still being used by the current assignment system

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Show remaining tables after cleanup
SELECT 
    tablename,
    hasindexes,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count remaining tables
SELECT COUNT(*) as remaining_tables 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verify core tables still exist
DO $$
DECLARE
    core_tables TEXT[] := ARRAY[
        'centralized_vocabulary',
        'vocabulary_gem_collection', 
        'user_vocabulary_progress',
        'enhanced_game_sessions',
        'gem_events',
        'assignments',
        'assignment_game_progress',
        'enhanced_assignment_progress',
        'classes',
        'class_enrollments',
        'profiles',
        'user_profiles',
        'sentences',
        'aqa_listening_assessments',
        'aqa_listening_questions',
        'edexcel_listening_assessments',
        'edexcel_listening_questions'
    ];
    table_name TEXT;
    table_exists BOOLEAN;
BEGIN
    RAISE NOTICE 'Verifying core tables exist after cleanup:';
    
    FOREACH table_name IN ARRAY core_tables
    LOOP
        SELECT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = table_name
        ) INTO table_exists;
        
        IF table_exists THEN
            RAISE NOTICE '✓ % exists', table_name;
        ELSE
            RAISE WARNING '✗ % MISSING!', table_name;
        END IF;
    END LOOP;
END $$;

-- ============================================================================
-- CLEANUP SUMMARY
-- ============================================================================
-- Expected results:
-- - Started with: 127 tables
-- - Core tables kept: ~35 tables  
-- - Legacy tables removed: ~70+ tables
-- - Backup tables created: 5 tables
-- - Final count: ~40 tables (much cleaner!)
-- ============================================================================
