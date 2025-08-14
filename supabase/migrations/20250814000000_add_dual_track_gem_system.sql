-- ============================================================================
-- DUAL-TRACK GEM SYSTEM MIGRATION
-- Adds gem_type column to support both Mastery Gems (FSRS-driven) and Activity Gems (immediate rewards)
-- ============================================================================

-- Create gem_type ENUM if it doesn't exist
DO $$ BEGIN
    CREATE TYPE gem_type_enum AS ENUM ('mastery', 'activity');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add gem_type column to gem_events table
ALTER TABLE gem_events 
ADD COLUMN IF NOT EXISTS gem_type gem_type_enum DEFAULT 'activity';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_gem_events_gem_type ON gem_events(gem_type);

-- Update existing records to classify them appropriately
-- Most existing records should be classified as 'activity' type since they were immediate rewards
-- Only records that came from FSRS progression should be 'mastery' type
UPDATE gem_events 
SET gem_type = 'activity' 
WHERE gem_type IS NULL;

-- Add constraint to ensure gem_type is not null going forward
ALTER TABLE gem_events 
ALTER COLUMN gem_type SET NOT NULL;

-- Update RLS policies to include gem_type
-- (Existing policies should still work, but we can add gem_type specific ones if needed)

-- Create view for Activity Gems analytics
CREATE OR REPLACE VIEW student_activity_gem_analytics AS
SELECT 
    student_id,
    COUNT(*) as total_activity_gems,
    SUM(xp_value) as total_activity_xp,
    COUNT(*) FILTER (WHERE gem_rarity = 'common') as common_activity_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'uncommon') as uncommon_activity_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'rare') as rare_activity_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'epic') as epic_activity_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'legendary') as legendary_activity_gems,
    AVG(response_time_ms) as avg_response_time,
    MAX(streak_count) as max_streak,
    COUNT(DISTINCT game_type) as games_played,
    DATE_TRUNC('day', created_at) as activity_date
FROM gem_events 
WHERE gem_type = 'activity'
GROUP BY student_id, DATE_TRUNC('day', created_at);

-- Create view for Mastery Gems analytics
CREATE OR REPLACE VIEW student_mastery_gem_analytics AS
SELECT 
    student_id,
    COUNT(*) as total_mastery_gems,
    SUM(xp_value) as total_mastery_xp,
    COUNT(*) FILTER (WHERE gem_rarity = 'new_discovery') as new_discovery_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'common') as common_mastery_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'uncommon') as uncommon_mastery_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'rare') as rare_mastery_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'epic') as epic_mastery_gems,
    COUNT(*) FILTER (WHERE gem_rarity = 'legendary') as legendary_mastery_gems,
    COUNT(DISTINCT COALESCE(centralized_vocabulary_id::text, vocabulary_id::text)) as unique_words_mastered,
    DATE_TRUNC('day', created_at) as mastery_date
FROM gem_events 
WHERE gem_type = 'mastery'
GROUP BY student_id, DATE_TRUNC('day', created_at);

-- Create consolidated view for total XP tracking
CREATE OR REPLACE VIEW student_consolidated_xp_analytics AS
SELECT 
    student_id,
    COALESCE(SUM(xp_value), 0) as total_xp,
    COALESCE(SUM(xp_value) FILTER (WHERE gem_type = 'mastery'), 0) as mastery_xp,
    COALESCE(SUM(xp_value) FILTER (WHERE gem_type = 'activity'), 0) as activity_xp,
    COALESCE(COUNT(*) FILTER (WHERE gem_type = 'mastery'), 0) as total_mastery_gems,
    COALESCE(COUNT(*) FILTER (WHERE gem_type = 'activity'), 0) as total_activity_gems,
    COUNT(*) as total_gems
FROM gem_events 
GROUP BY student_id;

-- Grant permissions
GRANT SELECT ON student_activity_gem_analytics TO authenticated;
GRANT SELECT ON student_mastery_gem_analytics TO authenticated;
GRANT SELECT ON student_consolidated_xp_analytics TO authenticated;

-- Add comments for documentation
COMMENT ON COLUMN gem_events.gem_type IS 'Type of gem: mastery (FSRS-driven vocabulary collection) or activity (immediate performance rewards)';
COMMENT ON VIEW student_activity_gem_analytics IS 'Analytics for Activity Gems - immediate performance rewards';
COMMENT ON VIEW student_mastery_gem_analytics IS 'Analytics for Mastery Gems - FSRS-driven vocabulary collection';
COMMENT ON VIEW student_consolidated_xp_analytics IS 'Consolidated XP tracking with breakdown by gem type';

-- Update existing functions to handle gem_type parameter
-- This ensures backward compatibility while supporting the new dual-track system
CREATE OR REPLACE FUNCTION record_vocabulary_interaction(
    p_student_id UUID,
    p_vocabulary_item_id INTEGER,
    p_centralized_vocabulary_id UUID DEFAULT NULL,
    p_was_correct BOOLEAN,
    p_response_time_ms INTEGER DEFAULT NULL,
    p_hint_used BOOLEAN DEFAULT FALSE,
    p_game_type TEXT DEFAULT 'unknown',
    p_gem_type gem_type_enum DEFAULT 'activity'
) RETURNS VOID AS $$
DECLARE
    v_record_id UUID;
    v_current_streak INTEGER := 0;
    v_mastery_level INTEGER := 0;
    v_gem_rarity TEXT;
    v_xp_value INTEGER;
BEGIN
    -- Get or create vocabulary gem collection record
    SELECT id, current_streak, mastery_level INTO v_record_id, v_current_streak, v_mastery_level
    FROM vocabulary_gem_collection 
    WHERE student_id = p_student_id 
    AND (
        (p_centralized_vocabulary_id IS NOT NULL AND centralized_vocabulary_id = p_centralized_vocabulary_id) OR
        (p_centralized_vocabulary_id IS NULL AND vocabulary_item_id = p_vocabulary_item_id)
    );
    
    IF NOT FOUND THEN
        -- Create new gem collection entry
        INSERT INTO vocabulary_gem_collection (
            student_id, 
            vocabulary_item_id, 
            centralized_vocabulary_id,
            gem_level, 
            mastery_level,
            total_encounters, 
            correct_encounters, 
            incorrect_encounters,
            current_streak, 
            best_streak, 
            first_learned_at, 
            last_encountered_at
        ) VALUES (
            p_student_id, 
            p_vocabulary_item_id,
            p_centralized_vocabulary_id,
            1, 
            0,
            1, 
            CASE WHEN p_was_correct THEN 1 ELSE 0 END, 
            CASE WHEN p_was_correct THEN 0 ELSE 1 END,
            CASE WHEN p_was_correct THEN 1 ELSE 0 END, 
            CASE WHEN p_was_correct THEN 1 ELSE 0 END,
            NOW(), 
            NOW()
        ) RETURNING id INTO v_record_id;
        
        v_current_streak := CASE WHEN p_was_correct THEN 1 ELSE 0 END;
        v_mastery_level := 0;
    ELSE
        -- Update existing record
        UPDATE vocabulary_gem_collection 
        SET 
            total_encounters = total_encounters + 1,
            correct_encounters = correct_encounters + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
            incorrect_encounters = incorrect_encounters + CASE WHEN p_was_correct THEN 0 ELSE 1 END,
            current_streak = CASE WHEN p_was_correct THEN current_streak + 1 ELSE 0 END,
            best_streak = GREATEST(best_streak, CASE WHEN p_was_correct THEN current_streak + 1 ELSE current_streak END),
            last_encountered_at = NOW()
        WHERE id = v_record_id
        RETURNING current_streak, mastery_level INTO v_current_streak, v_mastery_level;
    END IF;
    
    -- Only create gem events for correct answers
    IF p_was_correct THEN
        -- Determine gem rarity based on mastery level and streak
        IF v_mastery_level = 0 THEN
            v_gem_rarity := 'new_discovery';
            v_xp_value := 5;
        ELSIF v_current_streak >= 10 THEN
            v_gem_rarity := 'legendary';
            v_xp_value := 200;
        ELSIF v_current_streak >= 5 THEN
            v_gem_rarity := 'epic';
            v_xp_value := 100;
        ELSIF v_current_streak >= 3 THEN
            v_gem_rarity := 'rare';
            v_xp_value := 50;
        ELSIF v_current_streak >= 2 THEN
            v_gem_rarity := 'uncommon';
            v_xp_value := 25;
        ELSE
            v_gem_rarity := 'common';
            v_xp_value := 10;
        END IF;
        
        -- Create gem event with specified type
        INSERT INTO gem_events (
            session_id,
            student_id,
            gem_rarity,
            xp_value,
            vocabulary_id,
            centralized_vocabulary_id,
            response_time_ms,
            streak_count,
            hint_used,
            game_type,
            gem_type
        ) VALUES (
            NULL, -- session_id can be null for direct vocabulary interactions
            p_student_id,
            v_gem_rarity,
            v_xp_value,
            p_vocabulary_item_id,
            p_centralized_vocabulary_id,
            p_response_time_ms,
            v_current_streak,
            p_hint_used,
            p_game_type,
            p_gem_type
        );
    END IF;
END;
$$ LANGUAGE plpgsql;
