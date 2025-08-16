-- ============================================================================
-- GRAMMAR GEMS SYSTEM MIGRATION
-- Creates the new Grammar Gems reward system with conjugation tracking
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE CONJUGATIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS conjugations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Student and session context
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    game_session_id UUID REFERENCES enhanced_game_sessions(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    
    -- Verb and conjugation details
    base_verb_id UUID NOT NULL REFERENCES centralized_vocabulary(id) ON DELETE CASCADE,
    base_verb_infinitive TEXT NOT NULL,
    base_verb_translation TEXT NOT NULL,
    
    -- Conjugation specifics
    conjugated_form TEXT NOT NULL,
    expected_answer TEXT NOT NULL,
    student_answer TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    
    -- Grammar context
    language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    tense TEXT NOT NULL, -- 'present', 'preterite', 'imperfect', 'future', etc.
    person TEXT NOT NULL, -- 'yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'
    number TEXT NOT NULL CHECK (number IN ('singular', 'plural')),
    verb_type TEXT NOT NULL CHECK (verb_type IN ('regular', 'irregular', 'stem_changing')),
    
    -- Performance metrics
    response_time_ms INTEGER,
    hint_used BOOLEAN DEFAULT FALSE,
    attempt_number INTEGER DEFAULT 1, -- For multiple attempts on same conjugation
    
    -- Difficulty assessment
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    complexity_score INTEGER DEFAULT 1 CHECK (complexity_score BETWEEN 1 AND 5),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- STEP 2: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Primary lookup indexes
CREATE INDEX IF NOT EXISTS idx_conjugations_student_id ON conjugations(student_id);
CREATE INDEX IF NOT EXISTS idx_conjugations_base_verb_id ON conjugations(base_verb_id);
CREATE INDEX IF NOT EXISTS idx_conjugations_game_session_id ON conjugations(game_session_id);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_conjugations_student_language ON conjugations(student_id, language);
CREATE INDEX IF NOT EXISTS idx_conjugations_student_tense ON conjugations(student_id, tense);
CREATE INDEX IF NOT EXISTS idx_conjugations_student_verb_type ON conjugations(student_id, verb_type);
CREATE INDEX IF NOT EXISTS idx_conjugations_performance ON conjugations(student_id, is_correct, created_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_conjugations_analytics ON conjugations(student_id, language, tense, person, is_correct);
CREATE INDEX IF NOT EXISTS idx_conjugations_teacher_view ON conjugations(student_id, created_at, is_correct);

-- ============================================================================
-- STEP 3: UPDATE GEM_EVENTS TABLE FOR GRAMMAR GEMS
-- ============================================================================

-- Add conjugation reference to gem_events
ALTER TABLE gem_events 
ADD COLUMN IF NOT EXISTS conjugation_id UUID REFERENCES conjugations(id) ON DELETE SET NULL;

-- Create index for conjugation gem events
CREATE INDEX IF NOT EXISTS idx_gem_events_conjugation_id ON gem_events(conjugation_id);

-- ============================================================================
-- STEP 4: CREATE GRAMMAR ANALYTICS VIEWS
-- ============================================================================

-- Student Grammar Performance Summary
CREATE OR REPLACE VIEW student_grammar_analytics AS
SELECT
    c.student_id,
    c.language,

    -- Overall performance
    COUNT(*) as total_attempts,
    COUNT(*) FILTER (WHERE c.is_correct) as correct_attempts,
    ROUND(
        (COUNT(*) FILTER (WHERE c.is_correct)::DECIMAL / COUNT(*)) * 100, 2
    ) as accuracy_percentage,

    -- Recent activity
    COUNT(*) FILTER (WHERE c.created_at >= NOW() - INTERVAL '7 days') as attempts_this_week,
    COUNT(*) FILTER (WHERE c.created_at >= NOW() - INTERVAL '1 day') as attempts_today,

    -- Performance trends
    AVG(c.response_time_ms) as avg_response_time,
    AVG(c.complexity_score) as avg_complexity,

    -- Timestamps
    MAX(c.created_at) as last_practice_at,
    MIN(c.created_at) as first_practice_at

FROM conjugations c
GROUP BY c.student_id, c.language;

-- Student Grammar Gems Summary
CREATE OR REPLACE VIEW student_grammar_gems_analytics AS
SELECT
    ge.student_id,

    -- Grammar gem totals
    COUNT(*) as total_grammar_gems,
    COUNT(*) FILTER (WHERE ge.created_at >= CURRENT_DATE) as grammar_gems_today,
    COUNT(*) FILTER (WHERE ge.created_at >= DATE_TRUNC('week', CURRENT_DATE)) as grammar_gems_this_week,

    -- Grammar XP totals
    SUM(ge.xp_value) as total_grammar_xp,
    SUM(ge.xp_value) FILTER (WHERE ge.created_at >= CURRENT_DATE) as grammar_xp_today,
    SUM(ge.xp_value) FILTER (WHERE ge.created_at >= DATE_TRUNC('week', CURRENT_DATE)) as grammar_xp_this_week,

    -- Performance context
    AVG(ge.response_time_ms) as avg_response_time,
    AVG(ge.streak_count) as avg_streak,

    -- Recent activity
    MAX(ge.created_at) as last_grammar_gem_at

FROM gem_events ge
WHERE ge.gem_type = 'grammar'
GROUP BY ge.student_id;

-- ============================================================================
-- STEP 5: CREATE GRAMMAR INSIGHTS FUNCTIONS
-- ============================================================================

-- Function to get student's weakest grammar areas
CREATE OR REPLACE FUNCTION get_student_grammar_weaknesses(
    p_student_id UUID,
    p_language TEXT DEFAULT 'es',
    p_limit INTEGER DEFAULT 5
)
RETURNS TABLE (
    area_type TEXT,
    area_name TEXT,
    total_attempts INTEGER,
    correct_attempts INTEGER,
    accuracy_percentage DECIMAL,
    needs_practice BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    WITH tense_performance AS (
        SELECT 
            'tense' as area_type,
            c.tense as area_name,
            COUNT(*)::INTEGER as total_attempts,
            COUNT(*) FILTER (WHERE c.is_correct)::INTEGER as correct_attempts,
            ROUND((COUNT(*) FILTER (WHERE c.is_correct)::DECIMAL / COUNT(*)) * 100, 2) as accuracy_percentage,
            (COUNT(*) FILTER (WHERE c.is_correct)::DECIMAL / COUNT(*)) < 0.7 as needs_practice
        FROM conjugations c
        WHERE c.student_id = p_student_id 
        AND c.language = p_language
        AND c.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY c.tense
    ),
    verb_type_performance AS (
        SELECT 
            'verb_type' as area_type,
            c.verb_type as area_name,
            COUNT(*)::INTEGER as total_attempts,
            COUNT(*) FILTER (WHERE c.is_correct)::INTEGER as correct_attempts,
            ROUND((COUNT(*) FILTER (WHERE c.is_correct)::DECIMAL / COUNT(*)) * 100, 2) as accuracy_percentage,
            (COUNT(*) FILTER (WHERE c.is_correct)::DECIMAL / COUNT(*)) < 0.7 as needs_practice
        FROM conjugations c
        WHERE c.student_id = p_student_id 
        AND c.language = p_language
        AND c.created_at >= NOW() - INTERVAL '30 days'
        GROUP BY c.verb_type
    )
    SELECT * FROM (
        SELECT * FROM tense_performance
        UNION ALL
        SELECT * FROM verb_type_performance
    ) combined
    WHERE needs_practice = true
    ORDER BY accuracy_percentage ASC, total_attempts DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get common grammar mistakes
CREATE OR REPLACE FUNCTION get_student_common_grammar_mistakes(
    p_student_id UUID,
    p_language TEXT DEFAULT 'es',
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    base_verb TEXT,
    tense TEXT,
    person TEXT,
    expected_answer TEXT,
    common_wrong_answer TEXT,
    mistake_count INTEGER,
    last_mistake_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.base_verb_infinitive as base_verb,
        c.tense,
        c.person,
        c.expected_answer,
        c.student_answer as common_wrong_answer,
        COUNT(*)::INTEGER as mistake_count,
        MAX(c.created_at) as last_mistake_at
    FROM conjugations c
    WHERE c.student_id = p_student_id 
    AND c.language = p_language
    AND c.is_correct = false
    AND c.created_at >= NOW() - INTERVAL '30 days'
    GROUP BY c.base_verb_infinitive, c.tense, c.person, c.expected_answer, c.student_answer
    HAVING COUNT(*) >= 2  -- Only show mistakes that happened multiple times
    ORDER BY mistake_count DESC, last_mistake_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 6: ADD TRIGGERS FOR DATA CONSISTENCY
-- ============================================================================

-- Update timestamp trigger for conjugations
CREATE OR REPLACE FUNCTION update_conjugations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conjugations_updated_at
    BEFORE UPDATE ON conjugations
    FOR EACH ROW
    EXECUTE FUNCTION update_conjugations_updated_at();

-- ============================================================================
-- STEP 7: ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE conjugations IS 'Detailed tracking of student conjugation attempts for Grammar Gems system. Records every conjugation practice with full context for analytics.';
COMMENT ON COLUMN conjugations.base_verb_id IS 'References the infinitive verb in centralized_vocabulary table';
COMMENT ON COLUMN conjugations.complexity_score IS 'Difficulty rating from 1-5 based on tense complexity and verb irregularity';
COMMENT ON COLUMN conjugations.attempt_number IS 'Tracks multiple attempts on the same conjugation within a session';

COMMENT ON VIEW student_grammar_analytics IS 'Comprehensive grammar performance analytics per student and language';
COMMENT ON VIEW student_grammar_gems_analytics IS 'Grammar Gems collection and XP summary for students';

COMMENT ON FUNCTION get_student_grammar_weaknesses IS 'Identifies areas where student accuracy is below 70% for targeted practice recommendations';
COMMENT ON FUNCTION get_student_common_grammar_mistakes IS 'Finds recurring mistake patterns for personalized feedback';
