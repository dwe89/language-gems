-- ============================================================================
-- FIX VOCABULARY UUID SUPPORT FOR GEMS SYSTEM
-- Updates gem tables to support both legacy INTEGER and new UUID vocabulary IDs
-- ============================================================================

-- Add centralized_vocabulary_id column to vocabulary_gem_collection
ALTER TABLE vocabulary_gem_collection 
ADD COLUMN IF NOT EXISTS centralized_vocabulary_id UUID REFERENCES centralized_vocabulary(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_gem_collection_centralized_vocab_id 
ON vocabulary_gem_collection(centralized_vocabulary_id);

-- Add index for student + centralized vocabulary lookups
CREATE INDEX IF NOT EXISTS idx_vocabulary_gem_collection_student_centralized_vocab 
ON vocabulary_gem_collection(student_id, centralized_vocabulary_id);

-- Update the update_vocabulary_gem_collection function to support UUID vocabulary IDs
CREATE OR REPLACE FUNCTION update_vocabulary_gem_collection(
    p_student_id UUID,
    p_vocabulary_item_id INTEGER DEFAULT NULL,
    p_centralized_vocabulary_id UUID DEFAULT NULL,
    p_was_correct BOOLEAN,
    p_response_time_ms INTEGER DEFAULT 0,
    p_hint_used BOOLEAN DEFAULT FALSE,
    p_streak_count INTEGER DEFAULT 0
) RETURNS VOID AS $$
DECLARE
    v_collection vocabulary_gem_collection%ROWTYPE;
    v_new_gem_level INTEGER;
    v_new_mastery_level INTEGER;
    v_new_interval INTEGER;
    v_new_ease_factor DECIMAL;
BEGIN
    -- Validate that at least one vocabulary ID is provided
    IF p_vocabulary_item_id IS NULL AND p_centralized_vocabulary_id IS NULL THEN
        RAISE EXCEPTION 'Either vocabulary_item_id or centralized_vocabulary_id must be provided';
    END IF;

    -- Try to find existing record (check both ID types)
    SELECT * INTO v_collection 
    FROM vocabulary_gem_collection 
    WHERE student_id = p_student_id 
    AND (
        (p_vocabulary_item_id IS NOT NULL AND vocabulary_item_id = p_vocabulary_item_id) OR
        (p_centralized_vocabulary_id IS NOT NULL AND centralized_vocabulary_id = p_centralized_vocabulary_id)
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
        );
        RETURN;
    END IF;

    -- Update encounter counts
    v_collection.total_encounters := v_collection.total_encounters + 1;
    
    IF p_was_correct THEN
        v_collection.correct_encounters := v_collection.correct_encounters + 1;
        v_collection.current_streak := v_collection.current_streak + 1;
        v_collection.best_streak := GREATEST(v_collection.best_streak, v_collection.current_streak);
    ELSE
        v_collection.incorrect_encounters := v_collection.incorrect_encounters + 1;
        v_collection.current_streak := 0;
    END IF;

    -- Calculate new gem level (1-10 based on correct encounters)
    v_new_gem_level := LEAST(10, GREATEST(1, v_collection.correct_encounters / 5 + 1));
    
    -- Calculate new mastery level (0-5 based on accuracy and encounters)
    IF v_collection.total_encounters >= 10 THEN
        v_new_mastery_level := LEAST(5, FLOOR(
            (v_collection.correct_encounters::DECIMAL / v_collection.total_encounters) * 5
        ));
    ELSE
        v_new_mastery_level := 0;
    END IF;

    -- Calculate spaced repetition parameters
    IF p_was_correct THEN
        v_new_interval := LEAST(365, v_collection.spaced_repetition_interval * 2);
        v_new_ease_factor := LEAST(3.0, v_collection.spaced_repetition_ease_factor + 0.1);
    ELSE
        v_new_interval := 1;
        v_new_ease_factor := GREATEST(1.3, v_collection.spaced_repetition_ease_factor - 0.2);
    END IF;
    
    -- Update the record
    UPDATE vocabulary_gem_collection SET
        gem_level = v_new_gem_level,
        mastery_level = v_new_mastery_level,
        total_encounters = v_collection.total_encounters,
        correct_encounters = v_collection.correct_encounters,
        incorrect_encounters = v_collection.incorrect_encounters,
        current_streak = v_collection.current_streak,
        best_streak = v_collection.best_streak,
        last_encountered_at = NOW(),
        next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
        spaced_repetition_interval = v_new_interval,
        spaced_repetition_ease_factor = v_new_ease_factor,
        last_mastered_at = CASE WHEN v_new_mastery_level >= 4 AND v_collection.mastery_level < 4 THEN NOW() ELSE last_mastered_at END,
        updated_at = NOW()
    WHERE student_id = p_student_id 
    AND (
        (p_vocabulary_item_id IS NOT NULL AND vocabulary_item_id = p_vocabulary_item_id) OR
        (p_centralized_vocabulary_id IS NOT NULL AND centralized_vocabulary_id = p_centralized_vocabulary_id)
    );
END;
$$ LANGUAGE plpgsql;

-- Comment the migration
COMMENT ON COLUMN vocabulary_gem_collection.centralized_vocabulary_id IS 'Reference to centralized_vocabulary table (UUID-based)';
COMMENT ON FUNCTION update_vocabulary_gem_collection IS 'Updated to support both legacy INTEGER and new UUID vocabulary IDs';
