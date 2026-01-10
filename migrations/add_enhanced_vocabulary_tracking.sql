-- ============================================================================
-- TEACHER CUSTOM VOCABULARY: Progress Tracking Migration
-- Adds support for tracking student progress on enhanced_vocabulary_items
-- ============================================================================

-- Step 1: Add enhanced_vocabulary_item_id column if not exists
ALTER TABLE vocabulary_gem_collection
ADD COLUMN IF NOT EXISTS enhanced_vocabulary_item_id UUID REFERENCES enhanced_vocabulary_items(id) ON DELETE SET NULL;

-- Step 2: Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_vgc_enhanced_vocab_item 
ON vocabulary_gem_collection(enhanced_vocabulary_item_id) 
WHERE enhanced_vocabulary_item_id IS NOT NULL;

-- Step 3: Add unique constraint for enhanced vocabulary items
-- Using partial index to allow multiple NULLs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE indexname = 'unique_student_enhanced_vocab'
    ) THEN
        CREATE UNIQUE INDEX unique_student_enhanced_vocab 
        ON vocabulary_gem_collection(student_id, enhanced_vocabulary_item_id) 
        WHERE enhanced_vocabulary_item_id IS NOT NULL;
    END IF;
END $$;

-- Step 4: Create or replace the atomic tracking function with enhanced vocabulary support
CREATE OR REPLACE FUNCTION update_vocabulary_gem_collection_atomic(
    p_student_id UUID,
    p_vocabulary_item_id INTEGER DEFAULT NULL,
    p_centralized_vocabulary_id UUID DEFAULT NULL,
    p_enhanced_vocabulary_item_id UUID DEFAULT NULL,  -- NEW: For custom vocabulary
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
BEGIN
    -- Validate that at least one vocabulary ID is provided
    IF p_vocabulary_item_id IS NULL AND p_centralized_vocabulary_id IS NULL AND p_enhanced_vocabulary_item_id IS NULL THEN
        RAISE EXCEPTION 'At least one vocabulary ID must be provided (vocabulary_item_id, centralized_vocabulary_id, or enhanced_vocabulary_item_id)';
    END IF;

    -- Calculate streak changes
    v_streak_increment := CASE WHEN p_was_correct THEN 1 ELSE 0 END;
    
    -- CASE 1: Enhanced vocabulary item (teacher custom vocabulary)
    IF p_enhanced_vocabulary_item_id IS NOT NULL THEN
        INSERT INTO vocabulary_gem_collection (
            student_id,
            enhanced_vocabulary_item_id,
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
            p_enhanced_vocabulary_item_id,
            1,
            0,
            1,
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
        ON CONFLICT (student_id, enhanced_vocabulary_item_id) WHERE enhanced_vocabulary_item_id IS NOT NULL
        DO UPDATE SET
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
    
    -- CASE 2: Centralized vocabulary (standard curriculum vocabulary)
    ELSIF p_centralized_vocabulary_id IS NOT NULL THEN
        INSERT INTO vocabulary_gem_collection (
            student_id,
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
            p_centralized_vocabulary_id,
            1,
            0,
            1,
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
    
    -- CASE 3: Legacy vocabulary item (integer ID)
    ELSE
        INSERT INTO vocabulary_gem_collection (
            student_id,
            vocabulary_item_id,
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
            1,
            0,
            1,
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
        ON CONFLICT (student_id, vocabulary_item_id) WHERE vocabulary_item_id IS NOT NULL
        DO UPDATE SET
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
    END IF;

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

-- Step 5: Add comment explaining the update
COMMENT ON FUNCTION update_vocabulary_gem_collection_atomic IS 
'Race-condition-safe vocabulary tracking function using atomic UPSERT operations.
Supports three vocabulary sources:
  - p_vocabulary_item_id: Legacy integer-based vocabulary items
  - p_centralized_vocabulary_id: UUID-based centralized curriculum vocabulary
  - p_enhanced_vocabulary_item_id: UUID-based teacher custom vocabulary items (enhanced_vocabulary_items table)
The function uses separate UPSERT blocks for each vocabulary type to ensure proper constraint handling.';

-- Step 6: Verify the migration
DO $$
BEGIN
    RAISE NOTICE 'Migration complete: vocabulary_gem_collection now supports enhanced_vocabulary_item_id';
    RAISE NOTICE 'The update_vocabulary_gem_collection_atomic function has been updated to support teacher custom vocabulary';
END $$;
