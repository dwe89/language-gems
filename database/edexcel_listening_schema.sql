-- Edexcel Listening Assessment Database Schema

-- Table for Edexcel listening assessments
CREATE TABLE IF NOT EXISTS edexcel_listening_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    level VARCHAR(20) NOT NULL CHECK (level IN ('foundation', 'higher')),
    language VARCHAR(10) NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    identifier VARCHAR(50) NOT NULL, -- e.g., 'paper-1', 'paper-2'
    version VARCHAR(20) DEFAULT '1.0',
    total_questions INTEGER NOT NULL DEFAULT 0,
    time_limit_minutes INTEGER NOT NULL, -- 45 for foundation, 60 for higher
    total_marks INTEGER NOT NULL DEFAULT 50, -- Always 50 for Edexcel
    section_a_marks INTEGER NOT NULL DEFAULT 40, -- Section A: Listening comprehension
    section_b_marks INTEGER NOT NULL DEFAULT 10, -- Section B: Dictation
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(language, level, identifier)
);

-- Table for Edexcel listening questions
CREATE TABLE IF NOT EXISTS edexcel_listening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES edexcel_listening_assessments(id) ON DELETE CASCADE,
    question_type VARCHAR(50) NOT NULL CHECK (question_type IN (
        'multiple-choice', 
        'multiple-response', 
        'word-cloud', 
        'open-response-a', 
        'open-response-c', 
        'dictation'
    )),
    section VARCHAR(1) NOT NULL CHECK (section IN ('A', 'B')), -- Section A or B
    question_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    audio_url TEXT,
    audio_text TEXT, -- Text for TTS generation
    audio_transcript TEXT, -- For development/testing
    time_limit_seconds INTEGER,
    marks INTEGER NOT NULL DEFAULT 1,
    question_data JSONB NOT NULL, -- Question-specific data structure
    tts_config JSONB, -- TTS configuration
    theme VARCHAR(100),
    topic VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(assessment_id, question_number)
);

-- Table for Edexcel listening results
CREATE TABLE IF NOT EXISTS edexcel_listening_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(255) NOT NULL, -- Can be 'anonymous' for non-logged-in users
    assessment_id UUID NOT NULL REFERENCES edexcel_listening_assessments(id),
    assignment_id UUID, -- Optional, for teacher assignments
    attempt_number INTEGER NOT NULL DEFAULT 1,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER DEFAULT 0,
    raw_score INTEGER DEFAULT 0,
    total_possible_score INTEGER DEFAULT 50,
    percentage_score DECIMAL(5,2) DEFAULT 0,
    section_a_score INTEGER DEFAULT 0, -- Score for Section A (40 marks)
    section_b_score INTEGER DEFAULT 0, -- Score for Section B (10 marks)
    status VARCHAR(20) DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'complete', 'abandoned')),
    responses JSONB DEFAULT '[]'::jsonb, -- Array of question responses
    audio_play_counts JSONB DEFAULT '{}'::jsonb, -- Track audio playback per question
    performance_by_question_type JSONB DEFAULT '{}'::jsonb,
    performance_by_theme JSONB DEFAULT '{}'::jsonb,
    performance_by_topic JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, assessment_id, attempt_number)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_edexcel_listening_assessments_language_level 
    ON edexcel_listening_assessments(language, level, is_active);

CREATE INDEX IF NOT EXISTS idx_edexcel_listening_questions_assessment_id 
    ON edexcel_listening_questions(assessment_id, question_number);

CREATE INDEX IF NOT EXISTS idx_edexcel_listening_questions_type_section 
    ON edexcel_listening_questions(question_type, section);

CREATE INDEX IF NOT EXISTS idx_edexcel_listening_results_student_id 
    ON edexcel_listening_results(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_edexcel_listening_results_assessment_id 
    ON edexcel_listening_results(assessment_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_edexcel_listening_results_status 
    ON edexcel_listening_results(status, created_at DESC);

-- Sample data for testing

-- Foundation Spanish Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE Spanish Foundation Listening Paper 1',
    'Complete Edexcel-style foundation listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'foundation',
    'es',
    'paper-1',
    12, -- 11 questions in Section A + 1 dictation section (6 sentences)
    45
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Higher Spanish Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE Spanish Higher Listening Paper 1',
    'Complete Edexcel-style higher listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'higher',
    'es',
    'paper-1',
    10, -- 9 questions in Section A + 1 dictation section (6 sentences)
    60
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Foundation French Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE French Foundation Listening Paper 1',
    'Complete Edexcel-style foundation listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'foundation',
    'fr',
    'paper-1',
    12,
    45
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Higher French Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE French Higher Listening Paper 1',
    'Complete Edexcel-style higher listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'higher',
    'fr',
    'paper-1',
    10,
    60
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Foundation German Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE German Foundation Listening Paper 1',
    'Complete Edexcel-style foundation listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'foundation',
    'de',
    'paper-1',
    12,
    45
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Higher German Paper 1
INSERT INTO edexcel_listening_assessments (
    title, 
    description, 
    level, 
    language, 
    identifier, 
    total_questions, 
    time_limit_minutes
) VALUES (
    'Edexcel GCSE German Higher Listening Paper 1',
    'Complete Edexcel-style higher listening assessment with Section A (40 marks) and Section B dictation (10 marks)',
    'higher',
    'de',
    'paper-1',
    10,
    60
) ON CONFLICT (language, level, identifier) DO NOTHING;

-- Update timestamps trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_edexcel_listening_assessments_updated_at 
    BEFORE UPDATE ON edexcel_listening_assessments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edexcel_listening_questions_updated_at 
    BEFORE UPDATE ON edexcel_listening_questions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_edexcel_listening_results_updated_at 
    BEFORE UPDATE ON edexcel_listening_results 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
