-- ============================================================================
-- MWE Migration Phase 1: Cross-Reference Analysis
-- ============================================================================

-- Function to analyze existing vocabulary coverage
CREATE OR REPLACE FUNCTION analyze_vocabulary_coverage()
RETURNS TABLE (
    language TEXT,
    total_unique_words INTEGER,
    words_in_centralized_vocab INTEGER,
    coverage_percentage DECIMAL,
    missing_words_count INTEGER
) AS $$
BEGIN
    -- Create temporary table for all unique words from sentences
    CREATE TEMP TABLE IF NOT EXISTS sentence_words AS
    SELECT DISTINCT
        s.source_language as language,
        LOWER(TRIM(unnest(string_to_array(
            regexp_replace(s.source_sentence, '[^\w\s]', '', 'g'), ' '
        )))) as word
    FROM sentences s
    WHERE LENGTH(TRIM(unnest(string_to_array(
        regexp_replace(s.source_sentence, '[^\w\s]', '', 'g'), ' '
    )))) > 1;  -- Exclude single characters

    -- Log analysis start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('analysis', 'vocabulary_coverage', 'sentences+centralized_vocabulary', 'started');

    -- Return coverage analysis
    RETURN QUERY
    SELECT 
        sw.language,
        COUNT(DISTINCT sw.word)::INTEGER as total_unique_words,
        COUNT(DISTINCT CASE WHEN cv.id IS NOT NULL THEN sw.word END)::INTEGER as words_in_centralized_vocab,
        ROUND(
            (COUNT(DISTINCT CASE WHEN cv.id IS NOT NULL THEN sw.word END)::DECIMAL / 
             COUNT(DISTINCT sw.word)::DECIMAL) * 100, 2
        ) as coverage_percentage,
        (COUNT(DISTINCT sw.word) - COUNT(DISTINCT CASE WHEN cv.id IS NOT NULL THEN sw.word END))::INTEGER as missing_words_count
    FROM sentence_words sw
    LEFT JOIN centralized_vocabulary cv ON LOWER(cv.word) = sw.word AND cv.language = sw.language
    GROUP BY sw.language
    ORDER BY sw.language;

    -- Log completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW()
    WHERE phase = 'analysis' AND operation = 'vocabulary_coverage' AND status = 'started';

    -- Clean up
    DROP TABLE IF EXISTS sentence_words;
END;
$$ LANGUAGE plpgsql;

-- Function to identify function words that should NOT be tracked
CREATE OR REPLACE FUNCTION identify_function_words()
RETURNS TABLE (
    language TEXT,
    word TEXT,
    frequency INTEGER,
    is_function_word BOOLEAN,
    word_type TEXT
) AS $$
BEGIN
    -- Create analysis of word frequencies to identify function words
    CREATE TEMP TABLE IF NOT EXISTS word_frequency AS
    SELECT 
        s.source_language as language,
        LOWER(TRIM(unnest(string_to_array(
            regexp_replace(s.source_sentence, '[^\w\s]', '', 'g'), ' '
        )))) as word,
        COUNT(*) as frequency
    FROM sentences s
    WHERE LENGTH(TRIM(unnest(string_to_array(
        regexp_replace(s.source_sentence, '[^\w\s]', '', 'g'), ' '
    )))) > 1
    GROUP BY s.source_language, LOWER(TRIM(unnest(string_to_array(
        regexp_replace(s.source_sentence, '[^\w\s]', '', 'g'), ' '
    ))))
    ORDER BY s.source_language, COUNT(*) DESC;

    -- Return function word analysis
    RETURN QUERY
    SELECT 
        wf.language,
        wf.word,
        wf.frequency,
        CASE 
            -- Spanish function words
            WHEN wf.language = 'spanish' AND wf.word IN (
                'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',  -- Articles
                'de', 'en', 'a', 'por', 'para', 'con', 'sin', 'sobre', 'bajo', 'entre',  -- Prepositions
                'y', 'o', 'pero', 'porque', 'que', 'si', 'cuando', 'donde',  -- Conjunctions
                'es', 'son', 'está', 'están', 'hay', 'ser', 'estar', 'tener', 'haber',  -- Common verbs
                'mi', 'tu', 'su', 'nuestro', 'vuestro', 'me', 'te', 'se', 'nos', 'os'  -- Pronouns
            ) THEN TRUE
            -- French function words  
            WHEN wf.language = 'french' AND wf.word IN (
                'le', 'la', 'les', 'un', 'une', 'des',  -- Articles
                'de', 'du', 'des', 'à', 'au', 'aux', 'en', 'dans', 'sur', 'avec', 'pour', 'par',  -- Prepositions
                'et', 'ou', 'mais', 'car', 'donc', 'que', 'qui', 'quand', 'où',  -- Conjunctions
                'est', 'sont', 'être', 'avoir', 'il', 'y', 'a',  -- Common verbs
                'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se'  -- Pronouns
            ) THEN TRUE
            -- German function words
            WHEN wf.language = 'german' AND wf.word IN (
                'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen', 'einem', 'einer',  -- Articles
                'in', 'an', 'auf', 'für', 'mit', 'nach', 'bei', 'von', 'zu', 'über', 'unter',  -- Prepositions
                'und', 'oder', 'aber', 'weil', 'dass', 'wenn', 'als', 'wie',  -- Conjunctions
                'ist', 'sind', 'war', 'waren', 'sein', 'haben', 'werden',  -- Common verbs
                'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'mich', 'dich', 'sich'  -- Pronouns
            ) THEN TRUE
            ELSE FALSE
        END as is_function_word,
        CASE 
            WHEN wf.word IN ('el', 'la', 'los', 'las', 'un', 'una', 'le', 'les', 'der', 'die', 'das') THEN 'article'
            WHEN wf.word IN ('de', 'en', 'a', 'por', 'para', 'con', 'dans', 'sur', 'avec', 'in', 'an', 'auf') THEN 'preposition'
            WHEN wf.word IN ('y', 'o', 'pero', 'et', 'ou', 'mais', 'und', 'oder', 'aber') THEN 'conjunction'
            WHEN wf.word IN ('es', 'son', 'está', 'est', 'sont', 'ist', 'sind') THEN 'verb'
            WHEN wf.word IN ('mi', 'tu', 'su', 'je', 'tu', 'il', 'ich', 'du', 'er') THEN 'pronoun'
            ELSE 'content_word'
        END as word_type
    FROM word_frequency wf
    ORDER BY wf.language, wf.frequency DESC;

    -- Clean up
    DROP TABLE IF EXISTS word_frequency;
END;
$$ LANGUAGE plpgsql;

-- Create views for easy access to analysis results
CREATE OR REPLACE VIEW missing_content_words AS
SELECT 
    fw.language,
    fw.word,
    fw.frequency,
    fw.word_type
FROM identify_function_words() fw
WHERE fw.is_function_word = FALSE 
AND fw.frequency >= 3  -- Appears in at least 3 sentences
AND NOT EXISTS (
    SELECT 1 FROM centralized_vocabulary cv 
    WHERE LOWER(cv.word) = fw.word AND cv.language = fw.language
)
ORDER BY fw.language, fw.frequency DESC;

-- Summary statistics view
CREATE OR REPLACE VIEW vocabulary_gap_analysis AS
SELECT 
    vc.language,
    vc.total_unique_words,
    vc.words_in_centralized_vocab,
    vc.coverage_percentage,
    vc.missing_words_count,
    COUNT(mcw.word) as missing_content_words_count,
    COUNT(hpm.extracted_text) as missing_mwes_count
FROM analyze_vocabulary_coverage() vc
LEFT JOIN missing_content_words mcw ON mcw.language = vc.language
LEFT JOIN high_priority_missing_mwes hpm ON hpm.language = vc.language
GROUP BY vc.language, vc.total_unique_words, vc.words_in_centralized_vocab, 
         vc.coverage_percentage, vc.missing_words_count
ORDER BY vc.language;

COMMENT ON FUNCTION analyze_vocabulary_coverage() IS 'Analyzes vocabulary coverage between sentences and centralized_vocabulary tables';
COMMENT ON FUNCTION identify_function_words() IS 'Identifies function words that should not be tracked for FSRS/gems';
COMMENT ON VIEW missing_content_words IS 'Content words from sentences missing from centralized_vocabulary';
COMMENT ON VIEW vocabulary_gap_analysis IS 'Comprehensive analysis of vocabulary gaps across all languages';
