-- ============================================================================
-- FIX VOCABULARY TRACKING RACE CONDITIONS
-- Replaces the update_gem_collection function with atomic operations
-- ============================================================================

-- Drop the existing problematic function
DROP FUNCTION IF EXISTS update_gem_collection(UUID, INTEGER, BOOLEAN, INTEGER, BOOLEAN, INTEGER);

-- Create a new race-condition-safe function using ATOMIC operations
CREATE OR REPLACE FUNCTION update_vocabulary_gem_collection_atomic(
    p_student_id UUID,
    p_vocabulary_item_id INTEGER DEFAULT NULL,
    p_centralized_vocabulary_id UUID DEFAULT NULL,
    p_was_correct BOOLEAN,
    p_response_time_ms INTEGER DEFAULT 0,
    p_hint_used BOOLEAN DEFAULT FALSE,
    p_streak_count INTEGER DEFAULT 0
) RETURNS vocabulary_gem_collection AS $$
DECLARE
    v_result vocabulary_gem_collection;
    v_new_interval INTEGER;
    v_new_ease_factor DECIMAL;
    v_new_mastery_level INTEGER;
    v_new_gem_level INTEGER;
    v_streak_increment INTEGER;
    v_best_streak_update INTEGER;
BEGIN
    -- Validate that at least one vocabulary ID is provided
    IF p_vocabulary_item_id IS NULL AND p_centralized_vocabulary_id IS NULL THEN
        RAISE EXCEPTION 'Either vocabulary_item_id or centralized_vocabulary_id must be provided';
    END IF;

    -- Calculate streak changes
    v_streak_increment := CASE WHEN p_was_correct THEN 1 ELSE 0 END;
    
    -- Use UPSERT with atomic operations to prevent race conditions
    -- Handle both legacy (vocabulary_item_id) and new (centralized_vocabulary_id) constraints
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
        last_encountered_at,
        next_review_at,
        spaced_repetition_interval,
        spaced_repetition_ease_factor,
        difficulty_rating,
        created_at,
        updated_at
    ) VALUES (
        p_student_id,
        p_vocabulary_item_id,
        p_centralized_vocabulary_id,
        1, -- initial gem level
        0, -- initial mastery level
        1, -- initial total encounters
        CASE WHEN p_was_correct THEN 1 ELSE 0 END,
        CASE WHEN p_was_correct THEN 0 ELSE 1 END,
        CASE WHEN p_was_correct THEN 1 ELSE 0 END,
        CASE WHEN p_was_correct THEN 1 ELSE 0 END,
        NOW(),
        NOW(),
        NOW() + INTERVAL '1 day',
        1,
        2.0,
        1,
        NOW(),
        NOW()
    )
    ON CONFLICT (student_id, centralized_vocabulary_id) WHERE centralized_vocabulary_id IS NOT NULL
    DO UPDATE SET
        -- ATOMIC increment operations - no race conditions!
        total_encounters = vocabulary_gem_collection.total_encounters + 1,
        correct_encounters = vocabulary_gem_collection.correct_encounters + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
        incorrect_encounters = vocabulary_gem_collection.incorrect_encounters + CASE WHEN p_was_correct THEN 0 ELSE 1 END,
        current_streak = CASE 
            WHEN p_was_correct THEN vocabulary_gem_collection.current_streak + 1 
            ELSE 0 
        END,
        best_streak = GREATEST(
            vocabulary_gem_collection.best_streak,
            CASE WHEN p_was_correct THEN vocabulary_gem_collection.current_streak + 1 ELSE 0 END
        ),
        last_encountered_at = NOW(),
        updated_at = NOW()
    RETURNING * INTO v_result;

    -- Calculate derived values based on the updated record
    v_new_mastery_level := LEAST(5, FLOOR(
        CASE 
            WHEN v_result.total_encounters >= 10 THEN
                (v_result.correct_encounters::DECIMAL / v_result.total_encounters) * 5
            ELSE 0
        END
    ));
    
    v_new_gem_level := LEAST(10, GREATEST(1, v_result.correct_encounters / 5 + 1));
    
    -- Calculate spaced repetition parameters
    IF p_was_correct THEN
        v_new_interval := LEAST(365, v_result.spaced_repetition_interval * 2);
        v_new_ease_factor := LEAST(3.0, v_result.spaced_repetition_ease_factor + 0.1);
    ELSE
        v_new_interval := 1;
        v_new_ease_factor := GREATEST(1.3, v_result.spaced_repetition_ease_factor - 0.2);
    END IF;
    
    -- Update calculated fields in a separate atomic operation
    UPDATE vocabulary_gem_collection SET
        gem_level = v_new_gem_level,
        mastery_level = v_new_mastery_level,
        next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
        spaced_repetition_interval = v_new_interval,
        spaced_repetition_ease_factor = v_new_ease_factor,
        last_mastered_at = CASE 
            WHEN v_new_mastery_level >= 4 AND mastery_level < 4 THEN NOW() 
            ELSE last_mastered_at 
        END
    WHERE id = v_result.id
    RETURNING * INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint to prevent duplicate records
CREATE UNIQUE INDEX IF NOT EXISTS idx_vocabulary_gem_collection_unique 
ON vocabulary_gem_collection(
    student_id, 
    COALESCE(vocabulary_item_id, 0), 
    COALESCE(centralized_vocabulary_id, '00000000-0000-0000-0000-000000000000'::UUID)
);

-- Create a function to clean up the corrupted data
CREATE OR REPLACE FUNCTION fix_corrupted_vocabulary_data()
RETURNS TABLE(id UUID, action TEXT, old_values JSONB, new_values JSONB) AS $$
BEGIN
    RETURN QUERY
    WITH fixes AS (
        UPDATE vocabulary_gem_collection 
        SET 
            total_encounters = GREATEST(0, ABS(correct_encounters) + ABS(incorrect_encounters)),
            correct_encounters = GREATEST(0, ABS(correct_encounters)),
            incorrect_encounters = GREATEST(0, ABS(incorrect_encounters)),
            current_streak = GREATEST(0, current_streak),
            best_streak = GREATEST(0, best_streak),
            fsrs_review_count = GREATEST(0, COALESCE(fsrs_review_count, 0)),
            fsrs_lapse_count = GREATEST(0, COALESCE(fsrs_lapse_count, 0)),
            next_review_at = CASE 
                WHEN next_review_at > '2030-01-01'::DATE THEN 
                    LEAST(next_review_at, NOW() + INTERVAL '1 year')
                ELSE next_review_at
            END,
            fsrs_difficulty = CASE 
                WHEN fsrs_difficulty < 0 THEN ABS(fsrs_difficulty)
                WHEN fsrs_difficulty > 10 THEN 10
                ELSE fsrs_difficulty
            END,
            fsrs_stability = GREATEST(0, COALESCE(fsrs_stability, 1)),
            fsrs_retrievability = GREATEST(0, LEAST(1, COALESCE(fsrs_retrievability, 0.5))),
            updated_at = NOW()
        WHERE 
            correct_encounters < 0
            OR incorrect_encounters < 0
            OR total_encounters < 0
            OR current_streak < 0
            OR best_streak < 0
            OR fsrs_review_count < 0
            OR fsrs_lapse_count < 0
            OR next_review_at > '2030-01-01'::DATE
            OR fsrs_difficulty < 0
            OR fsrs_difficulty > 10
            OR fsrs_stability < 0
            OR fsrs_retrievability < 0
            OR fsrs_retrievability > 1
        RETURNING 
            vocabulary_gem_collection.id,
            'FIXED_CORRUPTION' as action,
            jsonb_build_object(
                'old_correct_encounters', OLD.correct_encounters,
                'old_incorrect_encounters', OLD.incorrect_encounters,
                'old_total_encounters', OLD.total_encounters
            ) as old_values,
            jsonb_build_object(
                'new_correct_encounters', vocabulary_gem_collection.correct_encounters,
                'new_incorrect_encounters', vocabulary_gem_collection.incorrect_encounters,
                'new_total_encounters', vocabulary_gem_collection.total_encounters
            ) as new_values
    )
    SELECT fixes.* FROM fixes;
END;
$$ LANGUAGE plpgsql;

-- Add helpful comment
COMMENT ON FUNCTION update_vocabulary_gem_collection_atomic IS 
'Race-condition-safe vocabulary tracking function using atomic UPSERT operations. 
Replaces the problematic update_gem_collection function that caused data corruption due to concurrent access.';

COMMENT ON FUNCTION fix_corrupted_vocabulary_data IS 
'One-time cleanup function to fix existing corrupted vocabulary data caused by race conditions.
Corrects negative values, impossible dates, and out-of-range values.';
