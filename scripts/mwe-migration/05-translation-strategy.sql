-- ============================================================================
-- MWE Migration Phase 2: Translation Generation Strategy
-- ============================================================================

-- Create translation mapping table for common MWEs
CREATE TABLE IF NOT EXISTS mwe_translation_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT NOT NULL,
    mwe_text TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    translation_confidence TEXT NOT NULL CHECK (translation_confidence IN ('high', 'medium', 'low', 'needs_review')),
    translation_source TEXT NOT NULL CHECK (translation_source IN ('automated', 'manual', 'context_derived', 'dictionary')),
    context_sentence TEXT,
    alternative_translations TEXT[],
    usage_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewed_by UUID REFERENCES auth.users(id),
    
    UNIQUE(language, mwe_text)
);

-- Pre-populate with high-confidence translations for critical MWEs
INSERT INTO mwe_translation_mappings (language, mwe_text, english_translation, translation_confidence, translation_source, usage_notes) VALUES
-- Spanish critical MWEs
('spanish', 'me gusta', 'I like', 'high', 'manual', 'Fixed expression for expressing likes/preferences'),
('spanish', 'te gusta', 'you like', 'high', 'manual', 'Fixed expression for expressing likes/preferences'),
('spanish', 'le gusta', 'he/she likes', 'high', 'manual', 'Fixed expression for expressing likes/preferences'),
('spanish', 'nos gusta', 'we like', 'high', 'manual', 'Fixed expression for expressing likes/preferences'),
('spanish', 'se llama', 'is called/named', 'high', 'manual', 'Fixed expression for names'),
('spanish', 'me llamo', 'my name is', 'high', 'manual', 'Fixed expression for introducing oneself'),
('spanish', 'hay que', 'one must/it is necessary to', 'high', 'manual', 'Impersonal obligation expression'),
('spanish', 'tiene que', 'has to/must', 'high', 'manual', 'Personal obligation expression'),
('spanish', 'por favor', 'please', 'high', 'manual', 'Politeness expression'),
('spanish', 'de nada', 'you''re welcome', 'high', 'manual', 'Politeness response'),
('spanish', 'muchas gracias', 'thank you very much', 'high', 'manual', 'Politeness expression'),
('spanish', 'buenos días', 'good morning', 'high', 'manual', 'Greeting'),
('spanish', 'buenas tardes', 'good afternoon', 'high', 'manual', 'Greeting'),
('spanish', 'buenas noches', 'good evening/night', 'high', 'manual', 'Greeting'),

-- French critical MWEs  
('french', 'il y a', 'there is/there are', 'high', 'manual', 'Existential expression'),
('french', 'il faut', 'it is necessary/one must', 'high', 'manual', 'Impersonal obligation'),
('french', 'je suis', 'I am', 'high', 'manual', 'Essential verb conjugation'),
('french', 'tu es', 'you are', 'high', 'manual', 'Essential verb conjugation'),
('french', 'il est', 'he is', 'high', 'manual', 'Essential verb conjugation'),
('french', 'elle est', 'she is', 'high', 'manual', 'Essential verb conjugation'),
('french', 'nous sommes', 'we are', 'high', 'manual', 'Essential verb conjugation'),
('french', 'vous êtes', 'you are (formal/plural)', 'high', 'manual', 'Essential verb conjugation'),
('french', 's''il vous plaît', 'please', 'high', 'manual', 'Politeness expression'),
('french', 'de rien', 'you''re welcome', 'high', 'manual', 'Politeness response'),
('french', 'je m''appelle', 'my name is', 'high', 'manual', 'Self-introduction'),

-- German critical MWEs
('german', 'es gibt', 'there is/there are', 'high', 'manual', 'Existential expression'),
('german', 'ich bin', 'I am', 'high', 'manual', 'Essential verb conjugation'),
('german', 'du bist', 'you are', 'high', 'manual', 'Essential verb conjugation'),
('german', 'er ist', 'he is', 'high', 'manual', 'Essential verb conjugation'),
('german', 'sie ist', 'she is', 'high', 'manual', 'Essential verb conjugation'),
('german', 'wir sind', 'we are', 'high', 'manual', 'Essential verb conjugation'),
('german', 'ihr seid', 'you are (plural)', 'high', 'manual', 'Essential verb conjugation'),
('german', 'sie sind', 'they are', 'high', 'manual', 'Essential verb conjugation'),
('german', 'ich heiße', 'my name is', 'high', 'manual', 'Self-introduction'),
('german', 'wie heißt', 'what is called', 'high', 'manual', 'Asking for names'),
('german', 'guten tag', 'good day', 'high', 'manual', 'Greeting'),
('german', 'guten morgen', 'good morning', 'high', 'manual', 'Greeting')

ON CONFLICT (language, mwe_text) DO UPDATE SET
    english_translation = EXCLUDED.english_translation,
    translation_confidence = EXCLUDED.translation_confidence,
    usage_notes = EXCLUDED.usage_notes;

-- Function to derive translations from sentence context
CREATE OR REPLACE FUNCTION derive_translations_from_context()
RETURNS INTEGER AS $$
DECLARE
    mwe_record RECORD;
    sentence_record RECORD;
    derived_translation TEXT;
    translations_derived INTEGER := 0;
BEGIN
    -- Log operation start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('translation', 'derive_from_context', 'mwe_translation_mappings', 'started');

    -- Process MWEs that need translations
    FOR mwe_record IN 
        SELECT DISTINCT mar.language, mar.extracted_text
        FROM mwe_analysis_results mar
        JOIN mwe_priority_classification mpc ON mpc.mwe_text = mar.extracted_text AND mpc.language = mar.language
        WHERE mpc.should_add_to_vocab = TRUE
        AND NOT EXISTS (
            SELECT 1 FROM mwe_translation_mappings mtm 
            WHERE mtm.language = mar.language AND mtm.mwe_text = mar.extracted_text
        )
    LOOP
        -- Find sentences containing this MWE to derive translation
        SELECT s.source_sentence, s.english_translation
        INTO sentence_record
        FROM sentences s
        WHERE s.source_language = mwe_record.language
        AND LOWER(s.source_sentence) LIKE '%' || mwe_record.extracted_text || '%'
        LIMIT 1;

        IF FOUND THEN
            -- Simple heuristic: try to extract corresponding English phrase
            -- This is a basic implementation - in production, you'd want more sophisticated NLP
            derived_translation := 'context-derived translation needed';
            
            INSERT INTO mwe_translation_mappings (
                language, mwe_text, english_translation, translation_confidence, 
                translation_source, context_sentence
            ) VALUES (
                mwe_record.language,
                mwe_record.extracted_text,
                derived_translation,
                'needs_review',
                'context_derived',
                sentence_record.source_sentence
            );
            
            translations_derived := translations_derived + 1;
        END IF;
    END LOOP;

    -- Log completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(), records_affected = translations_derived
    WHERE phase = 'translation' AND operation = 'derive_from_context' AND status = 'started';

    RETURN translations_derived;
END;
$$ LANGUAGE plpgsql;

-- Create manual review queue view
CREATE OR REPLACE VIEW translation_review_queue AS
SELECT 
    mtm.id,
    mtm.language,
    mtm.mwe_text,
    mtm.english_translation,
    mtm.translation_confidence,
    mtm.context_sentence,
    mpc.frequency_in_sentences,
    mpc.priority_level,
    mpc.pedagogical_importance
FROM mwe_translation_mappings mtm
JOIN mwe_priority_classification mpc ON mpc.mwe_text = mtm.mwe_text AND mpc.language = mtm.language
WHERE mtm.translation_confidence IN ('needs_review', 'low')
OR mtm.english_translation LIKE '%context-derived%'
ORDER BY mpc.priority_level DESC, mpc.pedagogical_importance DESC, mpc.frequency_in_sentences DESC;

-- Function to validate translation quality
CREATE OR REPLACE FUNCTION validate_translation_quality()
RETURNS TABLE (
    language TEXT,
    mwe_text TEXT,
    translation_status TEXT,
    quality_score INTEGER,
    issues TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mtm.language,
        mtm.mwe_text,
        CASE 
            WHEN mtm.translation_confidence = 'high' AND mtm.english_translation NOT LIKE '%context-derived%' THEN 'ready'
            WHEN mtm.translation_confidence = 'medium' THEN 'needs_minor_review'
            WHEN mtm.translation_confidence IN ('low', 'needs_review') THEN 'needs_major_review'
            ELSE 'missing'
        END as translation_status,
        CASE 
            WHEN mtm.translation_confidence = 'high' THEN 100
            WHEN mtm.translation_confidence = 'medium' THEN 75
            WHEN mtm.translation_confidence = 'low' THEN 50
            WHEN mtm.translation_confidence = 'needs_review' THEN 25
            ELSE 0
        END as quality_score,
        ARRAY(
            SELECT issue FROM (
                SELECT CASE WHEN mtm.english_translation LIKE '%context-derived%' THEN 'automated_translation' END as issue
                UNION ALL
                SELECT CASE WHEN LENGTH(mtm.english_translation) < 3 THEN 'too_short' END as issue
                UNION ALL  
                SELECT CASE WHEN mtm.english_translation IS NULL THEN 'missing_translation' END as issue
                UNION ALL
                SELECT CASE WHEN mtm.usage_notes IS NULL THEN 'missing_usage_notes' END as issue
            ) issues WHERE issue IS NOT NULL
        ) as issues
    FROM mwe_translation_mappings mtm
    ORDER BY mtm.language, quality_score ASC;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE mwe_translation_mappings IS 'Translation mappings for MWEs with confidence levels and review status';
COMMENT ON FUNCTION derive_translations_from_context() IS 'Attempts to derive MWE translations from sentence context';
COMMENT ON VIEW translation_review_queue IS 'MWEs requiring manual translation review, prioritized by importance';
COMMENT ON FUNCTION validate_translation_quality() IS 'Validates translation quality and identifies issues requiring attention';
