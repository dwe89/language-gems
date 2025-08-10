-- Migration to consolidate assignment progress tracking system
-- This migration consolidates data from legacy assignment_progress table into enhanced_assignment_progress
-- and creates views for backward compatibility

-- ============================================================================
-- STEP 1: MIGRATE DATA FROM LEGACY assignment_progress TO enhanced_assignment_progress
-- ============================================================================

-- First, let's migrate existing data from assignment_progress to enhanced_assignment_progress
-- Only migrate records that don't already exist in enhanced_assignment_progress
INSERT INTO enhanced_assignment_progress (
    assignment_id,
    student_id,
    status,
    attempts_count,
    best_score,
    best_accuracy,
    total_time_spent,
    words_attempted,
    words_correct,
    current_streak,
    first_attempt_at,
    last_attempt_at,
    completed_at,
    progress_data,
    created_at,
    updated_at
)
SELECT 
    ap.assignment_id,
    ap.student_id,
    ap.status,
    GREATEST(ap.attempts, 1) as attempts_count,
    ap.score as best_score,
    ap.accuracy as best_accuracy,
    ap.time_spent as total_time_spent,
    COALESCE(ap.words_attempted, 0) as words_attempted,
    COALESCE(ap.words_correct, 0) as words_correct,
    COALESCE(ap.current_streak, 0) as current_streak,
    ap.started_at as first_attempt_at,
    ap.updated_at as last_attempt_at,
    ap.completed_at,
    COALESCE(ap.metrics, '{}') as progress_data,
    ap.created_at,
    ap.updated_at
FROM assignment_progress ap
WHERE NOT EXISTS (
    SELECT 1 FROM enhanced_assignment_progress eap 
    WHERE eap.assignment_id = ap.assignment_id 
    AND eap.student_id = ap.student_id
)
ON CONFLICT (assignment_id, student_id) DO NOTHING;

-- ============================================================================
-- STEP 2: CREATE VIEWS FOR BACKWARD COMPATIBILITY
-- ============================================================================

-- Create assignment_completion_status as a view derived from enhanced_assignment_progress
-- This ensures existing code that queries assignment_completion_status continues to work
CREATE OR REPLACE VIEW assignment_completion_status AS
SELECT 
    a.id as assignment_id,
    a.title,
    a.game_config,
    eap.student_id,
    -- Calculate completed games based on session_count or default to 1 if completed
    CASE 
        WHEN eap.status = 'completed' THEN GREATEST(eap.session_count, 1)
        ELSE COALESCE(eap.session_count, 0)
    END as completed_games,
    -- Calculate total games from assignment config or default to 1
    CASE 
        WHEN a.assignment_mode = 'multi_game' THEN 
            COALESCE(jsonb_array_length(a.game_config->'games'), 1)
        ELSE 1
    END as total_games,
    eap.status,
    eap.completed_at as last_completed_at
FROM assignments a
LEFT JOIN enhanced_assignment_progress eap ON a.id = eap.assignment_id
WHERE eap.student_id IS NOT NULL;

-- Create a compatibility view for the legacy assignment_progress table
-- This allows existing queries to continue working while using enhanced_assignment_progress as the source
CREATE OR REPLACE VIEW assignment_progress_view AS
SELECT 
    eap.id,
    eap.assignment_id,
    eap.student_id,
    eap.first_attempt_at as started_at,
    eap.completed_at,
    eap.best_score as score,
    eap.best_accuracy as accuracy,
    eap.attempts_count as attempts,
    eap.total_time_spent as time_spent,
    eap.progress_data as metrics,
    eap.status,
    eap.created_at,
    eap.updated_at,
    -- Additional fields for compatibility
    eap.words_attempted,
    eap.words_correct,
    eap.words_mastered as words_learned,
    eap.current_streak,
    eap.session_count,
    CASE 
        WHEN eap.total_time_spent > 0 AND eap.session_count > 0 
        THEN eap.total_time_spent / eap.session_count 
        ELSE 0 
    END as average_response_time,
    eap.progress_data as difficulty_progression,
    eap.auto_feedback as learning_analytics
FROM enhanced_assignment_progress eap;

-- ============================================================================
-- STEP 3: UPDATE DATABASE TRIGGERS TO USE enhanced_assignment_progress
-- ============================================================================

-- Update the assignment completion trigger to work with enhanced_assignment_progress
CREATE OR REPLACE FUNCTION check_assignment_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_games INTEGER;
  completed_games INTEGER;
  assignment_completed BOOLEAN := FALSE;
BEGIN
  -- Only proceed if a game was just completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Count total games for this assignment
    SELECT COUNT(DISTINCT game_id) INTO total_games
    FROM public.assignment_game_progress
    WHERE assignment_id = NEW.assignment_id AND student_id = NEW.student_id;
    
    -- Count completed games for this assignment
    SELECT COUNT(*) INTO completed_games
    FROM public.assignment_game_progress
    WHERE assignment_id = NEW.assignment_id 
      AND student_id = NEW.student_id 
      AND status = 'completed';
    
    -- Check if all games are completed
    IF completed_games = total_games AND total_games > 0 THEN
      assignment_completed := TRUE;
    END IF;
    
    -- Update overall assignment progress in enhanced_assignment_progress
    INSERT INTO public.enhanced_assignment_progress (
      assignment_id,
      student_id,
      status,
      completed_at,
      updated_at,
      session_count
    ) VALUES (
      NEW.assignment_id,
      NEW.student_id,
      CASE WHEN assignment_completed THEN 'completed' ELSE 'in_progress' END,
      CASE WHEN assignment_completed THEN NOW() ELSE NULL END,
      NOW(),
      completed_games
    )
    ON CONFLICT (assignment_id, student_id) 
    DO UPDATE SET
      status = CASE WHEN assignment_completed THEN 'completed' ELSE 'in_progress' END,
      completed_at = CASE WHEN assignment_completed THEN NOW() ELSE enhanced_assignment_progress.completed_at END,
      updated_at = NOW(),
      session_count = completed_games;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 4: UPDATE ANALYTICS TRIGGER TO USE enhanced_assignment_progress
-- ============================================================================

-- Update the analytics trigger to work with enhanced_assignment_progress
CREATE OR REPLACE FUNCTION trigger_update_assignment_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the affected assignment
    PERFORM update_assignment_analytics(COALESCE(NEW.assignment_id, OLD.assignment_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop the old trigger and create new one for enhanced_assignment_progress
DROP TRIGGER IF EXISTS assignment_progress_analytics_trigger ON assignment_progress;
CREATE TRIGGER enhanced_assignment_progress_analytics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON enhanced_assignment_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_assignment_analytics();

-- ============================================================================
-- STEP 5: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Ensure we have proper indexes on enhanced_assignment_progress for performance
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_student_status 
    ON enhanced_assignment_progress(student_id, status);
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_assignment_status 
    ON enhanced_assignment_progress(assignment_id, status);
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_completed_at 
    ON enhanced_assignment_progress(completed_at) WHERE completed_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_updated_at 
    ON enhanced_assignment_progress(updated_at);

-- ============================================================================
-- STEP 6: MIGRATION VERIFICATION
-- ============================================================================

-- Create a function to verify the migration was successful
CREATE OR REPLACE FUNCTION verify_assignment_progress_migration()
RETURNS TABLE(
    legacy_count BIGINT,
    enhanced_count BIGINT,
    migrated_count BIGINT,
    missing_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM assignment_progress) as legacy_count,
        (SELECT COUNT(*) FROM enhanced_assignment_progress) as enhanced_count,
        (SELECT COUNT(*) 
         FROM assignment_progress ap 
         WHERE EXISTS (
             SELECT 1 FROM enhanced_assignment_progress eap 
             WHERE eap.assignment_id = ap.assignment_id 
             AND eap.student_id = ap.student_id
         )) as migrated_count,
        (SELECT COUNT(*) 
         FROM assignment_progress ap 
         WHERE NOT EXISTS (
             SELECT 1 FROM enhanced_assignment_progress eap 
             WHERE eap.assignment_id = ap.assignment_id 
             AND eap.student_id = ap.student_id
         )) as missing_count;
END;
$$ LANGUAGE plpgsql;

-- Run verification and log results
DO $$
DECLARE
    verification_result RECORD;
BEGIN
    SELECT * INTO verification_result FROM verify_assignment_progress_migration();
    
    RAISE NOTICE 'Assignment Progress Migration Verification:';
    RAISE NOTICE 'Legacy assignment_progress records: %', verification_result.legacy_count;
    RAISE NOTICE 'Enhanced assignment progress records: %', verification_result.enhanced_count;
    RAISE NOTICE 'Successfully migrated records: %', verification_result.migrated_count;
    RAISE NOTICE 'Missing records (not migrated): %', verification_result.missing_count;
    
    IF verification_result.missing_count > 0 THEN
        RAISE WARNING 'Some records were not migrated. Please investigate.';
    ELSE
        RAISE NOTICE 'Migration completed successfully!';
    END IF;
END;
$$;
