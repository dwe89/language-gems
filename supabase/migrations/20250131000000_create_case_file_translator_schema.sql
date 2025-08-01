-- Case File Translator Game Database Schema
-- This migration creates the necessary tables for the detective-themed translation game

-- Translation sentences table for Case File Translator
CREATE TABLE IF NOT EXISTS case_file_translation_sentences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Language and content
    source_language TEXT NOT NULL CHECK (source_language IN ('spanish', 'french', 'german')),
    source_sentence TEXT NOT NULL,
    english_translation TEXT NOT NULL,
    
    -- Categorization (aligned with centralized_vocabulary)
    category TEXT NOT NULL,
    subcategory TEXT,
    
    -- Difficulty and curriculum
    difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4', 'KS5')),
    
    -- Detective theme context
    case_context TEXT, -- Detective case scenario context
    detective_prompt TEXT, -- Motivational detective-themed prompt
    case_difficulty INTEGER DEFAULT 1 CHECK (case_difficulty BETWEEN 1 AND 5),
    
    -- Metadata
    word_count INTEGER NOT NULL DEFAULT 0,
    complexity_score INTEGER DEFAULT 50 CHECK (complexity_score >= 1 AND complexity_score <= 100),
    
    -- Administrative
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    is_public BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_case_file_sentences_language 
ON case_file_translation_sentences(source_language);

CREATE INDEX IF NOT EXISTS idx_case_file_sentences_category 
ON case_file_translation_sentences(category);

CREATE INDEX IF NOT EXISTS idx_case_file_sentences_subcategory 
ON case_file_translation_sentences(subcategory);

CREATE INDEX IF NOT EXISTS idx_case_file_sentences_difficulty 
ON case_file_translation_sentences(difficulty_level);

CREATE INDEX IF NOT EXISTS idx_case_file_sentences_curriculum 
ON case_file_translation_sentences(curriculum_level);

CREATE INDEX IF NOT EXISTS idx_case_file_sentences_active 
ON case_file_translation_sentences(is_active) WHERE is_active = true;

-- Game session tracking for Case File Translator
CREATE TABLE IF NOT EXISTS case_file_translator_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Session identification
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    
    -- Game configuration
    language TEXT NOT NULL CHECK (language IN ('spanish', 'french', 'german')),
    category TEXT NOT NULL,
    subcategory TEXT,
    difficulty_level TEXT NOT NULL,
    
    -- Session progress
    total_sentences INTEGER NOT NULL DEFAULT 0,
    sentences_completed INTEGER NOT NULL DEFAULT 0,
    correct_translations INTEGER NOT NULL DEFAULT 0,
    
    -- Scoring
    total_score INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    
    -- Timing
    session_duration_seconds INTEGER DEFAULT 0,
    average_time_per_sentence DECIMAL(8,2) DEFAULT 0.00,
    
    -- Session state
    session_mode TEXT NOT NULL DEFAULT 'freeplay' CHECK (session_mode IN ('freeplay', 'assignment')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    -- Detective theme data
    cases_solved INTEGER DEFAULT 0,
    detective_rank TEXT DEFAULT 'Rookie Detective',
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual sentence attempts within sessions
CREATE TABLE IF NOT EXISTS case_file_sentence_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- References
    session_id UUID NOT NULL REFERENCES case_file_translator_sessions(id) ON DELETE CASCADE,
    sentence_id UUID NOT NULL REFERENCES case_file_translation_sentences(id) ON DELETE CASCADE,
    
    -- Attempt data
    user_translation TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    
    -- Scoring
    points_earned INTEGER DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Feedback
    feedback_given TEXT,
    hint_used BOOLEAN DEFAULT false,
    
    -- Timestamps
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for session tracking
CREATE INDEX IF NOT EXISTS idx_case_file_sessions_student 
ON case_file_translator_sessions(student_id);

CREATE INDEX IF NOT EXISTS idx_case_file_sessions_assignment 
ON case_file_translator_sessions(assignment_id);

CREATE INDEX IF NOT EXISTS idx_case_file_sessions_status 
ON case_file_translator_sessions(status);

CREATE INDEX IF NOT EXISTS idx_case_file_attempts_session 
ON case_file_sentence_attempts(session_id);

CREATE INDEX IF NOT EXISTS idx_case_file_attempts_sentence 
ON case_file_sentence_attempts(sentence_id);

-- Row Level Security (RLS) policies
ALTER TABLE case_file_translation_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_file_translator_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_file_sentence_attempts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sentences (public read, authenticated create/update)
CREATE POLICY "Public can view active translation sentences" ON case_file_translation_sentences
    FOR SELECT USING (is_active = true AND is_public = true);

CREATE POLICY "Teachers can manage translation sentences" ON case_file_translation_sentences
    FOR ALL USING (
        auth.uid() IS NOT NULL AND (
            created_by = auth.uid() OR
            EXISTS (
                SELECT 1 FROM user_profiles 
                WHERE id = auth.uid() AND role = 'teacher'
            )
        )
    );

-- RLS Policies for sessions (students can only access their own)
CREATE POLICY "Students can view own sessions" ON case_file_translator_sessions
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students can create own sessions" ON case_file_translator_sessions
    FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own sessions" ON case_file_translator_sessions
    FOR UPDATE USING (student_id = auth.uid());

-- RLS Policies for attempts (students can only access their own)
CREATE POLICY "Students can view own attempts" ON case_file_sentence_attempts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM case_file_translator_sessions 
            WHERE id = session_id AND student_id = auth.uid()
        )
    );

CREATE POLICY "Students can create own attempts" ON case_file_sentence_attempts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM case_file_translator_sessions 
            WHERE id = session_id AND student_id = auth.uid()
        )
    );

-- Function to update session statistics
CREATE OR REPLACE FUNCTION update_case_file_session_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update session statistics when a new attempt is recorded
    UPDATE case_file_translator_sessions 
    SET 
        sentences_completed = (
            SELECT COUNT(DISTINCT sentence_id) 
            FROM case_file_sentence_attempts 
            WHERE session_id = NEW.session_id
        ),
        correct_translations = (
            SELECT COUNT(DISTINCT sentence_id) 
            FROM case_file_sentence_attempts 
            WHERE session_id = NEW.session_id AND is_correct = true
        ),
        total_score = (
            SELECT COALESCE(SUM(points_earned), 0) 
            FROM case_file_sentence_attempts 
            WHERE session_id = NEW.session_id
        ),
        session_duration_seconds = (
            SELECT COALESCE(SUM(time_spent_seconds), 0) 
            FROM case_file_sentence_attempts 
            WHERE session_id = NEW.session_id
        ),
        last_activity_at = NOW()
    WHERE id = NEW.session_id;
    
    -- Update accuracy percentage
    UPDATE case_file_translator_sessions 
    SET accuracy_percentage = CASE 
        WHEN sentences_completed > 0 THEN 
            (correct_translations::DECIMAL / sentences_completed::DECIMAL) * 100
        ELSE 0 
    END
    WHERE id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update session stats
CREATE TRIGGER update_case_file_session_stats_trigger
    AFTER INSERT ON case_file_sentence_attempts
    FOR EACH ROW
    EXECUTE FUNCTION update_case_file_session_stats();

-- Add comments for documentation
COMMENT ON TABLE case_file_translation_sentences IS 'Translation sentences for the Case File Translator detective-themed game';
COMMENT ON TABLE case_file_translator_sessions IS 'Game sessions for Case File Translator with detective theming';
COMMENT ON TABLE case_file_sentence_attempts IS 'Individual sentence translation attempts within game sessions';
