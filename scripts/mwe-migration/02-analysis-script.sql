-- ============================================================================
-- MWE Migration Phase 1: Automated Analysis Script
-- ============================================================================

-- Create analysis results table
CREATE TABLE IF NOT EXISTS mwe_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_type TEXT NOT NULL,
    language TEXT NOT NULL,
    extracted_text TEXT NOT NULL,
    frequency_count INTEGER DEFAULT 1,
    word_count INTEGER NOT NULL,
    is_potential_mwe BOOLEAN DEFAULT FALSE,
    priority_score INTEGER DEFAULT 0,
    source_sentences TEXT[] DEFAULT '{}',
    existing_in_vocab BOOLEAN DEFAULT FALSE,
    existing_vocab_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to extract potential MWEs from sentences
CREATE OR REPLACE FUNCTION extract_potential_mwes()
RETURNS TABLE (
    language TEXT,
    extracted_phrase TEXT,
    frequency INTEGER,
    word_count INTEGER,
    is_potential_mwe BOOLEAN,
    priority_score INTEGER,
    sample_sentences TEXT[]
) AS $$
BEGIN
    -- Clear previous analysis
    DELETE FROM mwe_analysis_results;
    
    -- Log analysis start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('analysis', 'extract_mwes', 'sentences', 'started');

    -- Extract 2-word phrases (most common MWEs)
    INSERT INTO mwe_analysis_results (
        analysis_type, language, extracted_text, frequency_count, word_count, 
        is_potential_mwe, priority_score, source_sentences
    )
    SELECT 
        'bigram' as analysis_type,
        s.source_language,
        LOWER(TRIM(split_part(s.source_sentence, ' ', n) || ' ' || split_part(s.source_sentence, ' ', n+1))) as phrase,
        COUNT(*) as frequency,
        2 as word_count,
        CASE 
            WHEN COUNT(*) >= 3 THEN TRUE  -- Appears in 3+ sentences
            ELSE FALSE 
        END as is_potential_mwe,
        CASE 
            WHEN COUNT(*) >= 10 THEN 100  -- High priority
            WHEN COUNT(*) >= 5 THEN 75    -- Medium priority  
            WHEN COUNT(*) >= 3 THEN 50    -- Low priority
            ELSE 25                       -- Very low priority
        END as priority_score,
        ARRAY_AGG(DISTINCT s.source_sentence ORDER BY s.source_sentence LIMIT 5) as sample_sentences
    FROM sentences s
    CROSS JOIN generate_series(1, array_length(string_to_array(s.source_sentence, ' '), 1) - 1) n
    WHERE split_part(s.source_sentence, ' ', n) != '' 
    AND split_part(s.source_sentence, ' ', n+1) != ''
    AND LENGTH(TRIM(split_part(s.source_sentence, ' ', n) || ' ' || split_part(s.source_sentence, ' ', n+1))) > 3
    GROUP BY s.source_language, LOWER(TRIM(split_part(s.source_sentence, ' ', n) || ' ' || split_part(s.source_sentence, ' ', n+1)))
    HAVING COUNT(*) >= 2;  -- Must appear at least twice

    -- Extract 3-word phrases (complex MWEs)
    INSERT INTO mwe_analysis_results (
        analysis_type, language, extracted_text, frequency_count, word_count, 
        is_potential_mwe, priority_score, source_sentences
    )
    SELECT 
        'trigram' as analysis_type,
        s.source_language,
        LOWER(TRIM(split_part(s.source_sentence, ' ', n) || ' ' || 
                  split_part(s.source_sentence, ' ', n+1) || ' ' || 
                  split_part(s.source_sentence, ' ', n+2))) as phrase,
        COUNT(*) as frequency,
        3 as word_count,
        CASE 
            WHEN COUNT(*) >= 2 THEN TRUE  -- Appears in 2+ sentences (lower threshold for 3-word)
            ELSE FALSE 
        END as is_potential_mwe,
        CASE 
            WHEN COUNT(*) >= 5 THEN 100   -- High priority
            WHEN COUNT(*) >= 3 THEN 75    -- Medium priority  
            WHEN COUNT(*) >= 2 THEN 50    -- Low priority
            ELSE 25                       -- Very low priority
        END as priority_score,
        ARRAY_AGG(DISTINCT s.source_sentence ORDER BY s.source_sentence LIMIT 3) as sample_sentences
    FROM sentences s
    CROSS JOIN generate_series(1, array_length(string_to_array(s.source_sentence, ' '), 1) - 2) n
    WHERE split_part(s.source_sentence, ' ', n) != '' 
    AND split_part(s.source_sentence, ' ', n+1) != ''
    AND split_part(s.source_sentence, ' ', n+2) != ''
    GROUP BY s.source_language, LOWER(TRIM(split_part(s.source_sentence, ' ', n) || ' ' || 
                                          split_part(s.source_sentence, ' ', n+1) || ' ' || 
                                          split_part(s.source_sentence, ' ', n+2)))
    HAVING COUNT(*) >= 2;

    -- Check which extracted phrases already exist in centralized_vocabulary
    UPDATE mwe_analysis_results 
    SET existing_in_vocab = TRUE,
        existing_vocab_id = cv.id
    FROM centralized_vocabulary cv
    WHERE LOWER(cv.word) = mwe_analysis_results.extracted_text
    AND cv.language = mwe_analysis_results.language;

    -- Log analysis completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(),
        records_affected = (SELECT COUNT(*) FROM mwe_analysis_results)
    WHERE phase = 'analysis' AND operation = 'extract_mwes' AND status = 'started';

    -- Return summary results
    RETURN QUERY
    SELECT 
        mar.language,
        mar.extracted_text,
        mar.frequency_count,
        mar.word_count,
        mar.is_potential_mwe,
        mar.priority_score,
        mar.source_sentences
    FROM mwe_analysis_results mar
    WHERE mar.is_potential_mwe = TRUE
    ORDER BY mar.language, mar.priority_score DESC, mar.frequency_count DESC;
END;
$$ LANGUAGE plpgsql;

-- Analysis summary views
CREATE OR REPLACE VIEW mwe_analysis_summary AS
SELECT 
    language,
    analysis_type,
    COUNT(*) as total_phrases,
    COUNT(*) FILTER (WHERE is_potential_mwe = TRUE) as potential_mwes,
    COUNT(*) FILTER (WHERE existing_in_vocab = TRUE) as already_in_vocab,
    COUNT(*) FILTER (WHERE is_potential_mwe = TRUE AND existing_in_vocab = FALSE) as missing_from_vocab,
    AVG(frequency_count) as avg_frequency,
    MAX(frequency_count) as max_frequency
FROM mwe_analysis_results
GROUP BY language, analysis_type
ORDER BY language, analysis_type;

-- High priority MWEs that need to be added
CREATE OR REPLACE VIEW high_priority_missing_mwes AS
SELECT 
    language,
    extracted_text,
    frequency_count,
    word_count,
    priority_score,
    source_sentences[1] as example_sentence
FROM mwe_analysis_results
WHERE is_potential_mwe = TRUE 
AND existing_in_vocab = FALSE
AND priority_score >= 50
ORDER BY language, priority_score DESC, frequency_count DESC;

COMMENT ON FUNCTION extract_potential_mwes() IS 'Extracts potential multi-word expressions from sentences table for vocabulary enhancement';
COMMENT ON VIEW mwe_analysis_summary IS 'Summary statistics of MWE analysis results by language';
COMMENT ON VIEW high_priority_missing_mwes IS 'High-priority MWEs missing from centralized_vocabulary that should be added';
