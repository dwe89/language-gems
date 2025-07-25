-- ============================================================================
-- COMPREHENSIVE DATABASE CLEANUP SCRIPT
-- ============================================================================
-- This script removes all obsolete, duplicate, and unused tables from the database
-- Based on comprehensive codebase analysis of actual table usage
-- ============================================================================

-- BACKUP IMPORTANT DATA FIRST (if any exists)
-- ============================================================================

-- Backup student_vocabulary_practice data (if any important data exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'student_vocabulary_practice') THEN
        CREATE TABLE IF NOT EXISTS backup_student_vocabulary_practice AS 
        SELECT * FROM student_vocabulary_practice;
        RAISE NOTICE 'Backed up student_vocabulary_practice table';
    END IF;
END $$;

-- Backup student_vocabulary_progress data (if any important data exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'student_vocabulary_progress') THEN
        CREATE TABLE IF NOT EXISTS backup_student_vocabulary_progress AS 
        SELECT * FROM student_vocabulary_progress;
        RAISE NOTICE 'Backed up student_vocabulary_progress table';
    END IF;
END $$;

-- ============================================================================
-- DROP OBSOLETE/DUPLICATE TABLES
-- ============================================================================

-- 1. DUPLICATE PROGRESS TRACKING TABLES (replaced by vocabulary_gem_collection & user_vocabulary_progress)
DROP TABLE IF EXISTS student_vocabulary_practice CASCADE;
DROP TABLE IF EXISTS student_vocabulary_progress CASCADE;
DROP TABLE IF EXISTS vocabulary_topic_performance CASCADE;
DROP TABLE IF EXISTS vocabulary_mining_sessions CASCADE;

-- 2. OLD VOCABULARY TABLES (replaced by centralized_vocabulary)
DROP TABLE IF EXISTS vocabulary_items CASCADE;

-- 3. UNUSED ASSIGNMENT TABLES (replaced by enhanced system)
DROP TABLE IF EXISTS student_vocabulary_assignment_progress CASCADE;
DROP TABLE IF EXISTS assignment_game_sessions CASCADE;

-- 4. UNUSED ENHANCED VOCABULARY SYSTEM TABLES (not used in current codebase)
DROP TABLE IF EXISTS enhanced_vocabulary_lists CASCADE;
DROP TABLE IF EXISTS enhanced_vocabulary_items CASCADE;
DROP TABLE IF EXISTS vocabulary_game_compatibility CASCADE;
DROP TABLE IF EXISTS vocabulary_list_usage CASCADE;
DROP TABLE IF EXISTS vocabulary_templates CASCADE;

-- 5. UNUSED EXAM/ASSESSMENT TABLES (not used in current codebase)
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS grammar_items CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS themes CASCADE;

-- 6. UNUSED GAME TABLES (replaced by enhanced_game_sessions)
DROP TABLE IF EXISTS game_progress CASCADE;
DROP TABLE IF EXISTS games CASCADE;

-- 7. UNUSED DAILY GOALS TABLES (not implemented in current codebase)
DROP TABLE IF EXISTS vocabulary_daily_goals CASCADE;

-- ============================================================================
-- DROP OBSOLETE FUNCTIONS
-- ============================================================================

-- Drop functions that reference deleted tables
DROP FUNCTION IF EXISTS track_vocabulary_practice CASCADE;
DROP FUNCTION IF EXISTS update_student_vocabulary_progress CASCADE;
DROP FUNCTION IF EXISTS import_gcse_vocabulary_simple CASCADE;

-- ============================================================================
-- VERIFY REMAINING TABLES (THESE SHOULD BE KEPT)
-- ============================================================================

-- Core vocabulary data (KEEP)
-- - centralized_vocabulary (main vocabulary source)
-- - vocabulary_lists (list management)
-- - vocabulary_themes (theme categorization) 
-- - vocabulary_topics (topic categorization)

-- Progress tracking (KEEP)
-- - vocabulary_gem_collection (Vocabulary Mining progress)
-- - user_vocabulary_progress (VocabMaster progress)

-- Game sessions (KEEP)
-- - enhanced_game_sessions (all game session data)

-- User management (KEEP)
-- - auth.users (Supabase auth)
-- - user_profiles (extended user info)
-- - classes (class management)
-- - assignments (assignment system)
-- - assignment_progress (assignment progress)

-- Competition system (KEEP - if being used)
-- - competitions
-- - competition_entries
-- - leaderboard_snapshots
-- - student_ranking_history

-- Enhanced game system (KEEP)
-- - student_game_profiles
-- - word_performance_logs
-- - game_leaderboards
-- - student_achievements
-- - assignment_templates
-- - enhanced_assignment_progress
-- - assignment_analytics
-- - daily_challenges
-- - student_challenge_progress

-- ============================================================================
-- CLEANUP VERIFICATION QUERIES
-- ============================================================================

-- Show remaining tables
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Show table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- FINAL VERIFICATION
-- ============================================================================

-- Verify core tables still exist
DO $$
DECLARE
    core_tables TEXT[] := ARRAY[
        'centralized_vocabulary',
        'vocabulary_gem_collection', 
        'user_vocabulary_progress',
        'enhanced_game_sessions',
        'assignments',
        'assignment_progress',
        'classes',
        'user_profiles'
    ];
    table_name TEXT;
    table_exists BOOLEAN;
BEGIN
    RAISE NOTICE 'Verifying core tables exist:';
    
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
-- CLEANUP COMPLETE
-- ============================================================================

RAISE NOTICE 'Database cleanup completed successfully!';
RAISE NOTICE 'Removed obsolete tables:';
RAISE NOTICE '- student_vocabulary_practice';
RAISE NOTICE '- student_vocabulary_progress'; 
RAISE NOTICE '- vocabulary_items';
RAISE NOTICE '- vocabulary_topic_performance';
RAISE NOTICE '- vocabulary_mining_sessions';
RAISE NOTICE '- student_vocabulary_assignment_progress';
RAISE NOTICE '- assignment_game_sessions';
RAISE NOTICE '- enhanced_vocabulary_* tables';
RAISE NOTICE '- exam/assessment tables';
RAISE NOTICE '- old game tables';
RAISE NOTICE '';
RAISE NOTICE 'Kept essential tables:';
RAISE NOTICE '- centralized_vocabulary (main vocabulary)';
RAISE NOTICE '- vocabulary_gem_collection (Vocabulary Mining)';
RAISE NOTICE '- user_vocabulary_progress (VocabMaster)';
RAISE NOTICE '- enhanced_game_sessions (all games)';
RAISE NOTICE '- assignments & classes (teacher system)';
RAISE NOTICE '- competition & achievement system';
RAISE NOTICE '';
RAISE NOTICE 'Database is now clean and optimized!';
