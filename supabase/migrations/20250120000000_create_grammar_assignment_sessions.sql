-- ============================================================================
-- Grammar Assignment Sessions System
-- Tracks grammar practice and test sessions within assignment context
-- ============================================================================

-- Create grammar_assignment_sessions table
-- Similar to enhanced_game_sessions but specifically for grammar activities
CREATE TABLE IF NOT EXISTS grammar_assignment_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and assignment context
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    
    -- Grammar content reference
    topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES grammar_content(id) ON DELETE CASCADE,
    
    -- Session type and mode
    session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'test', 'lesson')),
    session_mode TEXT NOT NULL DEFAULT 'free_play' CHECK (session_mode IN ('free_play', 'assignment', 'practice', 'challenge')),
    practice_mode TEXT CHECK (practice_mode IN ('quick', 'standard', 'mastery')), -- 10, 15, or 30 questions
    
    -- Session timing
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Performance metrics
    total_questions INTEGER NOT NULL DEFAULT 0,
    questions_attempted INTEGER DEFAULT 0,
    questions_correct INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0,
    final_score INTEGER DEFAULT 0,
    max_score_possible INTEGER DEFAULT 0,
    
    -- Completion tracking
    completion_status TEXT DEFAULT 'in_progress' CHECK (completion_status IN ('not_started', 'in_progress', 'completed', 'abandoned')),
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Performance details
    average_response_time_ms INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    lives_remaining INTEGER,
    streak_count INTEGER DEFAULT 0,
    
    -- Gamification (gems and XP)
    gems_earned INTEGER DEFAULT 0,
    gems_by_rarity JSONB DEFAULT '{"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}'::jsonb,
    xp_earned INTEGER DEFAULT 0,
    bonus_xp INTEGER DEFAULT 0,
    
    -- Session metadata
    session_data JSONB DEFAULT '{}'::jsonb, -- Store question-level details, mistakes, etc.
    device_info JSONB DEFAULT '{}'::jsonb,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    CONSTRAINT unique_session_per_student_content UNIQUE (student_id, content_id, started_at)
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_student ON grammar_assignment_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_assignment ON grammar_assignment_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_topic ON grammar_assignment_sessions(topic_id);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_content ON grammar_assignment_sessions(content_id);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_student_assignment ON grammar_assignment_sessions(student_id, assignment_id);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_completion ON grammar_assignment_sessions(completion_status);
CREATE INDEX IF NOT EXISTS idx_grammar_sessions_created_at ON grammar_assignment_sessions(created_at DESC);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_grammar_session_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER grammar_session_updated_at
    BEFORE UPDATE ON grammar_assignment_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_grammar_session_updated_at();

-- ============================================================================
-- Grammar Assignment Progress Tracking
-- Extends existing assignment_progress for grammar-specific metrics
-- ============================================================================

-- Add grammar-specific columns to enhanced_assignment_progress if not exists
ALTER TABLE enhanced_assignment_progress
ADD COLUMN IF NOT EXISTS grammar_sessions_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS grammar_topics_practiced TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS grammar_average_accuracy DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS grammar_total_questions INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS grammar_correct_answers INTEGER DEFAULT 0;

-- ============================================================================
-- Views for Grammar Assignment Analytics
-- ============================================================================

-- View: Student grammar assignment performance summary
CREATE OR REPLACE VIEW student_grammar_assignment_performance AS
SELECT
    gas.student_id,
    gas.assignment_id,
    gt.language,
    gt.category,
    gt.title as topic_title,
    
    -- Session counts
    COUNT(*) as total_sessions,
    COUNT(*) FILTER (WHERE gas.completion_status = 'completed') as completed_sessions,
    COUNT(*) FILTER (WHERE gas.session_type = 'practice') as practice_sessions,
    COUNT(*) FILTER (WHERE gas.session_type = 'test') as test_sessions,
    
    -- Performance metrics
    AVG(gas.accuracy_percentage) as average_accuracy,
    SUM(gas.questions_attempted) as total_questions_attempted,
    SUM(gas.questions_correct) as total_questions_correct,
    AVG(gas.average_response_time_ms) as avg_response_time,
    
    -- Gamification
    SUM(gas.gems_earned) as total_gems_earned,
    SUM(gas.xp_earned) as total_xp_earned,
    
    -- Time tracking
    SUM(gas.duration_seconds) as total_time_spent,
    MAX(gas.ended_at) as last_practice_at,
    MIN(gas.started_at) as first_practice_at
    
FROM grammar_assignment_sessions gas
JOIN grammar_topics gt ON gas.topic_id = gt.id
WHERE gas.assignment_id IS NOT NULL
GROUP BY gas.student_id, gas.assignment_id, gt.language, gt.category, gt.title;

-- View: Grammar assignment topic mastery
CREATE OR REPLACE VIEW grammar_assignment_topic_mastery AS
SELECT
    gas.student_id,
    gas.assignment_id,
    gas.topic_id,
    gt.title as topic_title,
    gt.category,
    gt.difficulty_level,
    
    -- Mastery indicators
    COUNT(*) as practice_count,
    AVG(gas.accuracy_percentage) as mastery_percentage,
    MAX(gas.accuracy_percentage) as best_accuracy,
    
    -- Proficiency level (based on accuracy and practice count)
    CASE
        WHEN AVG(gas.accuracy_percentage) >= 90 AND COUNT(*) >= 3 THEN 'proficient'
        WHEN AVG(gas.accuracy_percentage) >= 60 AND COUNT(*) >= 2 THEN 'learning'
        ELSE 'struggling'
    END as proficiency_level,
    
    -- Recent performance
    MAX(gas.ended_at) as last_practiced
    
FROM grammar_assignment_sessions gas
JOIN grammar_topics gt ON gas.topic_id = gt.id
WHERE gas.assignment_id IS NOT NULL
  AND gas.completion_status = 'completed'
GROUP BY gas.student_id, gas.assignment_id, gas.topic_id, gt.title, gt.category, gt.difficulty_level;

-- ============================================================================
-- Functions for Grammar Assignment Tracking
-- ============================================================================

-- Function: Get grammar assignment completion status
CREATE OR REPLACE FUNCTION get_grammar_assignment_completion(
    p_assignment_id UUID,
    p_student_id UUID
)
RETURNS TABLE (
    is_complete BOOLEAN,
    sessions_completed INTEGER,
    topics_practiced INTEGER,
    average_accuracy DECIMAL,
    total_time_spent INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(*) FILTER (WHERE completion_status = 'completed') >= 1 as is_complete,
        COUNT(*) FILTER (WHERE completion_status = 'completed')::INTEGER as sessions_completed,
        COUNT(DISTINCT topic_id)::INTEGER as topics_practiced,
        AVG(accuracy_percentage) as average_accuracy,
        SUM(duration_seconds)::INTEGER as total_time_spent
    FROM grammar_assignment_sessions
    WHERE assignment_id = p_assignment_id
      AND student_id = p_student_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- RLS Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE grammar_assignment_sessions ENABLE ROW LEVEL SECURITY;

-- Students can view their own sessions
CREATE POLICY grammar_sessions_student_select ON grammar_assignment_sessions
    FOR SELECT
    USING (auth.uid() = student_id);

-- Students can insert their own sessions
CREATE POLICY grammar_sessions_student_insert ON grammar_assignment_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- Students can update their own sessions
CREATE POLICY grammar_sessions_student_update ON grammar_assignment_sessions
    FOR UPDATE
    USING (auth.uid() = student_id);

-- Teachers can view sessions for their students
CREATE POLICY grammar_sessions_teacher_select ON grammar_assignment_sessions
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM assignments a
            JOIN classes c ON a.class_id = c.id
            WHERE a.id = grammar_assignment_sessions.assignment_id
              AND c.teacher_id = auth.uid()
        )
    );

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE grammar_assignment_sessions IS 'Tracks grammar practice and test sessions within assignment context';
COMMENT ON COLUMN grammar_assignment_sessions.session_type IS 'Type of grammar activity: practice, test, or lesson';
COMMENT ON COLUMN grammar_assignment_sessions.session_mode IS 'Context: free_play, assignment, practice, or challenge';
COMMENT ON COLUMN grammar_assignment_sessions.practice_mode IS 'Practice mode: quick (10q), standard (15q), or mastery (30q)';
COMMENT ON COLUMN grammar_assignment_sessions.session_data IS 'Detailed session data including question-level performance and mistakes';
COMMENT ON VIEW student_grammar_assignment_performance IS 'Summary of student performance on grammar assignments';
COMMENT ON VIEW grammar_assignment_topic_mastery IS 'Topic-level mastery tracking for grammar assignments';

