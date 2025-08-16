-- ============================================================================
-- MWE Migration Phase 3: Safe Insertion Process
-- ============================================================================

-- Function to safely insert MWEs into centralized_vocabulary
CREATE OR REPLACE FUNCTION insert_mwes_to_vocabulary(
    p_batch_size INTEGER DEFAULT 50,
    p_priority_filter TEXT DEFAULT 'critical'
) RETURNS TABLE (
    inserted_count INTEGER,
    skipped_count INTEGER,
    error_count INTEGER,
    batch_summary JSONB
) AS $$
DECLARE
    mwe_record RECORD;
    translation_record RECORD;
    inserted_count INTEGER := 0;
    skipped_count INTEGER := 0;
    error_count INTEGER := 0;
    batch_count INTEGER := 0;
    new_vocab_id UUID;
    error_message TEXT;
BEGIN
    -- Log operation start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status, metadata)
    VALUES ('insertion', 'insert_mwes_batch', 'centralized_vocabulary', 'started', 
            jsonb_build_object('batch_size', p_batch_size, 'priority_filter', p_priority_filter));

    -- Process MWEs in batches
    FOR mwe_record IN 
        SELECT 
            mpc.language,
            mpc.mwe_text,
            mpc.mwe_type,
            mpc.frequency_in_sentences,
            mpc.pedagogical_importance,
            mpc.curriculum_level
        FROM mwe_priority_classification mpc
        WHERE mpc.should_add_to_vocab = TRUE
        AND (p_priority_filter = 'all' OR mpc.priority_level = p_priority_filter)
        AND NOT EXISTS (
            SELECT 1 FROM centralized_vocabulary cv 
            WHERE LOWER(cv.word) = mpc.mwe_text AND cv.language = mpc.language
        )
        ORDER BY mpc.pedagogical_importance DESC, mpc.frequency_in_sentences DESC
        LIMIT p_batch_size
    LOOP
        BEGIN
            -- Get translation for this MWE
            SELECT english_translation, translation_confidence, usage_notes
            INTO translation_record
            FROM mwe_translation_mappings
            WHERE language = mwe_record.language AND mwe_text = mwe_record.mwe_text;

            -- Skip if no high-confidence translation available
            IF NOT FOUND OR translation_record.translation_confidence IN ('needs_review', 'low') THEN
                skipped_count := skipped_count + 1;
                CONTINUE;
            END IF;

            -- Generate new UUID for vocabulary entry
            new_vocab_id := gen_random_uuid();

            -- Insert into centralized_vocabulary
            INSERT INTO centralized_vocabulary (
                id,
                language,
                word,
                translation,
                category,
                subcategory,
                curriculum_level,
                is_mwe,
                mwe_type,
                component_words,
                frequency_rank,
                should_track_for_fsrs,
                part_of_speech,
                created_at,
                updated_at
            ) VALUES (
                new_vocab_id,
                CASE mwe_record.language
                    WHEN 'spanish' THEN 'es'
                    WHEN 'french' THEN 'fr'
                    WHEN 'german' THEN 'de'
                    ELSE mwe_record.language
                END,
                mwe_record.mwe_text,
                translation_record.english_translation,
                'mwe_expressions', -- Default category for MWEs
                mwe_record.mwe_type,
                mwe_record.curriculum_level,
                TRUE, -- is_mwe
                mwe_record.mwe_type,
                string_to_array(mwe_record.mwe_text, ' '), -- component_words
                mwe_record.frequency_in_sentences,
                TRUE, -- should_track_for_fsrs
                'expression', -- part_of_speech for MWEs
                NOW(),
                NOW()
            );

            inserted_count := inserted_count + 1;
            batch_count := batch_count + 1;

            -- Log successful insertion
            INSERT INTO mwe_migration_log (phase, operation, table_name, status, metadata)
            VALUES ('insertion', 'mwe_inserted', 'centralized_vocabulary', 'completed',
                    jsonb_build_object('vocabulary_id', new_vocab_id, 'mwe_text', mwe_record.mwe_text));

        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            error_message := SQLERRM;
            
            -- Log error
            INSERT INTO mwe_migration_log (phase, operation, table_name, status, error_message, metadata)
            VALUES ('insertion', 'mwe_insert_error', 'centralized_vocabulary', 'failed', error_message,
                    jsonb_build_object('mwe_text', mwe_record.mwe_text, 'language', mwe_record.language));
        END;
    END LOOP;

    -- Update main log entry
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(), 
        records_affected = inserted_count,
        metadata = metadata || jsonb_build_object(
            'inserted', inserted_count, 
            'skipped', skipped_count, 
            'errors', error_count
        )
    WHERE phase = 'insertion' AND operation = 'insert_mwes_batch' AND status = 'started';

    -- Return summary
    RETURN QUERY SELECT 
        inserted_count,
        skipped_count, 
        error_count,
        jsonb_build_object(
            'batch_size', p_batch_size,
            'priority_filter', p_priority_filter,
            'inserted', inserted_count,
            'skipped', skipped_count,
            'errors', error_count
        );
END;
$$ LANGUAGE plpgsql;

-- Function to validate inserted MWEs
CREATE OR REPLACE FUNCTION validate_inserted_mwes()
RETURNS TABLE (
    validation_check TEXT,
    passed BOOLEAN,
    count_found INTEGER,
    details TEXT
) AS $$
BEGIN
    -- Check 1: All inserted MWEs have is_mwe = TRUE
    RETURN QUERY
    SELECT 
        'mwe_flag_consistency'::TEXT,
        COUNT(*) = 0,
        COUNT(*)::INTEGER,
        'MWEs without is_mwe=TRUE flag'::TEXT
    FROM centralized_vocabulary 
    WHERE word LIKE '% %' AND (is_mwe IS NULL OR is_mwe = FALSE);

    -- Check 2: All MWEs have component_words populated
    RETURN QUERY
    SELECT 
        'component_words_populated'::TEXT,
        COUNT(*) = 0,
        COUNT(*)::INTEGER,
        'MWEs without component_words array'::TEXT
    FROM centralized_vocabulary 
    WHERE is_mwe = TRUE AND (component_words IS NULL OR array_length(component_words, 1) IS NULL);

    -- Check 3: MWE translations are not empty
    RETURN QUERY
    SELECT 
        'translations_present'::TEXT,
        COUNT(*) = 0,
        COUNT(*)::INTEGER,
        'MWEs without translations'::TEXT
    FROM centralized_vocabulary 
    WHERE is_mwe = TRUE AND (translation IS NULL OR LENGTH(TRIM(translation)) = 0);

    -- Check 4: No duplicate MWEs
    RETURN QUERY
    SELECT 
        'no_duplicates'::TEXT,
        COUNT(*) = 0,
        COUNT(*)::INTEGER,
        'Duplicate MWE entries found'::TEXT
    FROM (
        SELECT language, word, COUNT(*) as dup_count
        FROM centralized_vocabulary 
        WHERE is_mwe = TRUE
        GROUP BY language, word
        HAVING COUNT(*) > 1
    ) duplicates;

    -- Check 5: MWE categories are appropriate
    RETURN QUERY
    SELECT 
        'appropriate_categories'::TEXT,
        COUNT(*) = 0,
        COUNT(*)::INTEGER,
        'MWEs with inappropriate categories'::TEXT
    FROM centralized_vocabulary 
    WHERE is_mwe = TRUE 
    AND category NOT IN ('mwe_expressions', 'basics_core_language', 'identity_personal_life', 'daily_life', 'school_jobs_future');
END;
$$ LANGUAGE plpgsql;

-- Function to update existing vocabulary with MWE flags
CREATE OR REPLACE FUNCTION update_existing_mwe_flags()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER := 0;
BEGIN
    -- Log operation start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('update', 'flag_existing_mwes', 'centralized_vocabulary', 'started');

    -- Update existing multi-word entries that aren't flagged as MWEs
    UPDATE centralized_vocabulary 
    SET 
        is_mwe = TRUE,
        mwe_type = CASE 
            WHEN word ~ '\b(me gusta|te gusta|le gusta|se llama|hay que|il y a|es gibt)\b' THEN 'fixed_expression'
            WHEN word ~ '\b(por favor|de nada|buenos días|s''il vous plaît|guten tag)\b' THEN 'fixed_expression'
            WHEN array_length(string_to_array(word, ' '), 1) = 2 THEN 'collocation'
            WHEN array_length(string_to_array(word, ' '), 1) >= 3 THEN 'phrasal_verb'
            ELSE 'compound'
        END,
        component_words = string_to_array(word, ' '),
        should_track_for_fsrs = TRUE,
        updated_at = NOW()
    WHERE word LIKE '% %' 
    AND (is_mwe IS NULL OR is_mwe = FALSE);

    GET DIAGNOSTICS updated_count = ROW_COUNT;

    -- Log completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(), records_affected = updated_count
    WHERE phase = 'update' AND operation = 'flag_existing_mwes' AND status = 'started';

    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Create summary views for monitoring insertion progress
CREATE OR REPLACE VIEW mwe_insertion_progress AS
SELECT 
    mpc.language,
    mpc.priority_level,
    COUNT(*) as total_mwes,
    COUNT(cv.id) as inserted_mwes,
    COUNT(*) - COUNT(cv.id) as remaining_mwes,
    ROUND((COUNT(cv.id)::DECIMAL / COUNT(*)::DECIMAL) * 100, 2) as completion_percentage
FROM mwe_priority_classification mpc
LEFT JOIN centralized_vocabulary cv ON cv.word = mpc.mwe_text AND cv.language = mpc.language AND cv.is_mwe = TRUE
WHERE mpc.should_add_to_vocab = TRUE
GROUP BY mpc.language, mpc.priority_level
ORDER BY mpc.language, mpc.priority_level;

CREATE OR REPLACE VIEW mwe_insertion_summary AS
SELECT 
    COUNT(*) FILTER (WHERE is_mwe = TRUE) as total_mwes_in_vocab,
    COUNT(*) FILTER (WHERE is_mwe = TRUE AND mwe_type = 'fixed_expression') as fixed_expressions,
    COUNT(*) FILTER (WHERE is_mwe = TRUE AND mwe_type = 'collocation') as collocations,
    COUNT(*) FILTER (WHERE is_mwe = TRUE AND mwe_type = 'phrasal_verb') as phrasal_verbs,
    COUNT(*) FILTER (WHERE is_mwe = TRUE AND should_track_for_fsrs = TRUE) as trackable_mwes,
    COUNT(*) FILTER (WHERE is_mwe = FALSE) as single_words
FROM centralized_vocabulary;

COMMENT ON FUNCTION insert_mwes_to_vocabulary(INTEGER, TEXT) IS 'Safely inserts prioritized MWEs into centralized_vocabulary with validation';
COMMENT ON FUNCTION validate_inserted_mwes() IS 'Validates the integrity and consistency of inserted MWE data';
COMMENT ON FUNCTION update_existing_mwe_flags() IS 'Updates existing multi-word entries with proper MWE flags and metadata';
COMMENT ON VIEW mwe_insertion_progress IS 'Tracks progress of MWE insertion by language and priority level';
COMMENT ON VIEW mwe_insertion_summary IS 'Summary statistics of MWE content in centralized_vocabulary';
