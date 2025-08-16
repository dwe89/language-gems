-- ============================================================================
-- MWE Migration Phase 2: Database Schema Enhancement
-- ============================================================================

-- Add is_mwe column to centralized_vocabulary table
ALTER TABLE centralized_vocabulary 
ADD COLUMN IF NOT EXISTS is_mwe BOOLEAN DEFAULT FALSE;

-- Add MWE-specific metadata columns
ALTER TABLE centralized_vocabulary 
ADD COLUMN IF NOT EXISTS mwe_type TEXT CHECK (mwe_type IN ('phrasal_verb', 'idiom', 'collocation', 'compound', 'fixed_expression', 'single_word')),
ADD COLUMN IF NOT EXISTS component_words TEXT[], -- Array of individual words that make up the MWE
ADD COLUMN IF NOT EXISTS frequency_rank INTEGER, -- How often this MWE appears in sentences
ADD COLUMN IF NOT EXISTS should_track_for_fsrs BOOLEAN DEFAULT TRUE; -- Whether to track for spaced repetition

-- Create index for MWE queries
CREATE INDEX IF NOT EXISTS idx_centralized_vocabulary_is_mwe 
ON centralized_vocabulary(is_mwe) WHERE is_mwe = TRUE;

CREATE INDEX IF NOT EXISTS idx_centralized_vocabulary_should_track 
ON centralized_vocabulary(should_track_for_fsrs) WHERE should_track_for_fsrs = TRUE;

-- Update existing single-word entries
UPDATE centralized_vocabulary 
SET is_mwe = FALSE, 
    mwe_type = 'single_word',
    component_words = ARRAY[word]
WHERE word NOT LIKE '% %' 
AND is_mwe IS NULL;

-- Update existing multi-word entries  
UPDATE centralized_vocabulary 
SET is_mwe = TRUE,
    mwe_type = 'compound', -- Default type, can be refined later
    component_words = string_to_array(word, ' ')
WHERE word LIKE '% %' 
AND is_mwe IS NULL;

-- Create MWE priority classification table
CREATE TABLE IF NOT EXISTS mwe_priority_classification (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    language TEXT NOT NULL,
    mwe_text TEXT NOT NULL,
    priority_level TEXT NOT NULL CHECK (priority_level IN ('critical', 'high', 'medium', 'low')),
    mwe_type TEXT NOT NULL,
    frequency_in_sentences INTEGER DEFAULT 0,
    pedagogical_importance INTEGER DEFAULT 1 CHECK (pedagogical_importance BETWEEN 1 AND 10),
    curriculum_level TEXT DEFAULT 'KS3',
    should_add_to_vocab BOOLEAN DEFAULT TRUE,
    translation_needed BOOLEAN DEFAULT TRUE,
    manual_review_required BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to classify MWE priority based on frequency and type
CREATE OR REPLACE FUNCTION classify_mwe_priority(
    p_language TEXT,
    p_mwe_text TEXT,
    p_frequency INTEGER,
    p_word_count INTEGER
) RETURNS TEXT AS $$
DECLARE
    priority_level TEXT;
    mwe_type TEXT;
BEGIN
    -- Determine MWE type based on content
    IF p_mwe_text ~ '\b(me gusta|te gusta|le gusta|nos gusta|os gusta|les gusta)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'critical';
    ELSIF p_mwe_text ~ '\b(se llama|me llamo|te llamas)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'critical';
    ELSIF p_mwe_text ~ '\b(hay que|tiene que|tengo que)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'critical';
    ELSIF p_mwe_text ~ '\b(por favor|de nada|muchas gracias)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'high';
    ELSIF p_mwe_text ~ '\b(il y a|il faut|c''est|ce sont)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'critical';
    ELSIF p_mwe_text ~ '\b(es gibt|ich bin|du bist|er ist)\b' THEN
        mwe_type := 'fixed_expression';
        priority_level := 'critical';
    ELSIF p_word_count = 2 AND p_frequency >= 10 THEN
        mwe_type := 'collocation';
        priority_level := 'high';
    ELSIF p_word_count = 2 AND p_frequency >= 5 THEN
        mwe_type := 'collocation';
        priority_level := 'medium';
    ELSIF p_word_count = 3 AND p_frequency >= 5 THEN
        mwe_type := 'phrasal_verb';
        priority_level := 'high';
    ELSIF p_word_count = 3 AND p_frequency >= 3 THEN
        mwe_type := 'phrasal_verb';
        priority_level := 'medium';
    ELSE
        mwe_type := 'compound';
        priority_level := 'low';
    END IF;

    -- Insert into classification table
    INSERT INTO mwe_priority_classification (
        language, mwe_text, priority_level, mwe_type, frequency_in_sentences,
        pedagogical_importance, should_add_to_vocab
    ) VALUES (
        p_language, p_mwe_text, priority_level, mwe_type, p_frequency,
        CASE priority_level
            WHEN 'critical' THEN 10
            WHEN 'high' THEN 8
            WHEN 'medium' THEN 6
            WHEN 'low' THEN 4
        END,
        CASE priority_level
            WHEN 'critical' THEN TRUE
            WHEN 'high' THEN TRUE
            WHEN 'medium' THEN TRUE
            WHEN 'low' THEN FALSE  -- Low priority MWEs may not be worth adding
        END
    ) ON CONFLICT DO NOTHING;

    RETURN priority_level;
END;
$$ LANGUAGE plpgsql;

-- Function to populate MWE classifications from analysis results
CREATE OR REPLACE FUNCTION populate_mwe_classifications()
RETURNS INTEGER AS $$
DECLARE
    mwe_record RECORD;
    classifications_added INTEGER := 0;
BEGIN
    -- Log operation start
    INSERT INTO mwe_migration_log (phase, operation, table_name, status)
    VALUES ('classification', 'populate_mwe_classifications', 'mwe_priority_classification', 'started');

    -- Clear existing classifications
    DELETE FROM mwe_priority_classification;

    -- Process high-priority MWEs from analysis
    FOR mwe_record IN 
        SELECT language, extracted_text, frequency_count, word_count
        FROM mwe_analysis_results 
        WHERE is_potential_mwe = TRUE 
        AND existing_in_vocab = FALSE
        ORDER BY priority_score DESC, frequency_count DESC
    LOOP
        PERFORM classify_mwe_priority(
            mwe_record.language,
            mwe_record.extracted_text,
            mwe_record.frequency_count,
            mwe_record.word_count
        );
        classifications_added := classifications_added + 1;
    END LOOP;

    -- Log completion
    UPDATE mwe_migration_log 
    SET status = 'completed', completed_at = NOW(), records_affected = classifications_added
    WHERE phase = 'classification' AND operation = 'populate_mwe_classifications' AND status = 'started';

    RETURN classifications_added;
END;
$$ LANGUAGE plpgsql;

-- Create views for easy access to prioritized MWEs
CREATE OR REPLACE VIEW critical_mwes_to_add AS
SELECT 
    mpc.language,
    mpc.mwe_text,
    mpc.mwe_type,
    mpc.frequency_in_sentences,
    mpc.pedagogical_importance,
    mar.source_sentences[1] as example_sentence
FROM mwe_priority_classification mpc
JOIN mwe_analysis_results mar ON mar.extracted_text = mpc.mwe_text AND mar.language = mpc.language
WHERE mpc.priority_level = 'critical'
AND mpc.should_add_to_vocab = TRUE
ORDER BY mpc.language, mpc.pedagogical_importance DESC;

CREATE OR REPLACE VIEW high_priority_mwes_to_add AS
SELECT 
    mpc.language,
    mpc.mwe_text,
    mpc.mwe_type,
    mpc.frequency_in_sentences,
    mpc.pedagogical_importance,
    mar.source_sentences[1] as example_sentence
FROM mwe_priority_classification mpc
JOIN mwe_analysis_results mar ON mar.extracted_text = mpc.mwe_text AND mar.language = mpc.language
WHERE mpc.priority_level IN ('critical', 'high')
AND mpc.should_add_to_vocab = TRUE
ORDER BY mpc.language, mpc.pedagogical_importance DESC;

COMMENT ON COLUMN centralized_vocabulary.is_mwe IS 'TRUE if this entry is a multi-word expression';
COMMENT ON COLUMN centralized_vocabulary.mwe_type IS 'Type of MWE: phrasal_verb, idiom, collocation, compound, fixed_expression, single_word';
COMMENT ON COLUMN centralized_vocabulary.component_words IS 'Array of individual words that make up the MWE';
COMMENT ON COLUMN centralized_vocabulary.should_track_for_fsrs IS 'Whether this vocabulary should be tracked in FSRS system';
COMMENT ON TABLE mwe_priority_classification IS 'Classification and prioritization of MWEs for vocabulary addition';
COMMENT ON VIEW critical_mwes_to_add IS 'Critical priority MWEs that must be added to centralized_vocabulary';
COMMENT ON VIEW high_priority_mwes_to_add IS 'High and critical priority MWEs ready for vocabulary addition';
