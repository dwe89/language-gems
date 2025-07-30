-- AQA Listening Assessment System Migration
-- This migration creates the database structure for AQA-style listening assessments

-- Create AQA listening assessments table (static assessment definitions)
CREATE TABLE IF NOT EXISTS aqa_listening_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('foundation', 'higher')),
    language TEXT NOT NULL DEFAULT 'es',
    identifier TEXT NOT NULL, -- paper-1, paper-2, etc.
    version TEXT NOT NULL DEFAULT '1.0',
    total_questions INTEGER NOT NULL DEFAULT 40,
    time_limit_minutes INTEGER NOT NULL, -- 35 for foundation, 45 for higher
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level, language, identifier)
);

-- Create AQA listening questions table (individual questions within assessments)
CREATE TABLE IF NOT EXISTS aqa_listening_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_listening_assessments(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL, -- 1-40, with sub-questions like 40.1, 40.2
    sub_question_number TEXT, -- For multi-part questions: '7.1', '7.2', etc.
    question_type TEXT NOT NULL CHECK (question_type IN (
        'letter-matching', 'multiple-choice', 'lifestyle-grid', 'opinion-rating', 
        'open-response', 'activity-timing', 'multi-part', 'dictation'
    )),
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    audio_text TEXT, -- Text to be converted to speech with Gemini TTS
    audio_url TEXT, -- Generated audio file URL (cached)
    audio_transcript TEXT, -- For development/testing purposes
    question_data JSONB NOT NULL, -- Question-specific data (options, correct answers, etc.)
    marks INTEGER NOT NULL DEFAULT 1,
    theme TEXT NOT NULL CHECK (theme IN (
        'Theme 1: People and lifestyle',
        'Theme 2: Popular culture', 
        'Theme 3: Communication and the world around us'
    )),
    topic TEXT NOT NULL CHECK (topic IN (
        'Identity and relationships with others',
        'Healthy living and lifestyle',
        'Education and work',
        'Free-time activities',
        'Customs, festivals and celebrations',
        'Celebrity culture',
        'Travel and tourism, including places of interest',
        'Media and technology',
        'The environment and where people live'
    )),
    -- TTS Configuration
    tts_config JSONB DEFAULT '{}', -- Voice settings, multi-speaker config, etc.
    difficulty_rating INTEGER DEFAULT 3 CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_number, sub_question_number)
);

-- Create AQA listening assignments table (teacher assignments)
CREATE TABLE IF NOT EXISTS aqa_listening_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES aqa_listening_assessments(id),
    teacher_id UUID NOT NULL REFERENCES auth.users(id),
    class_id UUID REFERENCES classes(id),
    student_id UUID REFERENCES auth.users(id), -- For individual assignments
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    custom_time_limit INTEGER, -- Override default time limit
    custom_instructions TEXT,
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed', 'overdue')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AQA listening results table (student attempts and results)
CREATE TABLE IF NOT EXISTS aqa_listening_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    assessment_id UUID NOT NULL REFERENCES aqa_listening_assessments(id),
    assignment_id UUID REFERENCES aqa_listening_assignments(id), -- NULL for practice attempts
    attempt_number INTEGER NOT NULL DEFAULT 1,
    
    -- Timing data
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER NOT NULL,
    
    -- Scoring data
    raw_score INTEGER NOT NULL DEFAULT 0,
    total_possible_score INTEGER NOT NULL DEFAULT 40,
    percentage_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'incomplete', 'abandoned')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Individual question responses
    responses JSONB NOT NULL DEFAULT '[]', -- Array of response objects
    
    -- Audio playback tracking
    audio_play_counts JSONB DEFAULT '{}', -- Track plays per question
    
    -- Pre-calculated performance summaries for faster reporting
    performance_by_question_type JSONB DEFAULT '{}',
    performance_by_theme JSONB DEFAULT '{}',
    performance_by_topic JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, assessment_id, attempt_number)
);

-- Create AQA listening question responses table (detailed response tracking)
CREATE TABLE IF NOT EXISTS aqa_listening_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES aqa_listening_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES aqa_listening_questions(id),
    question_number INTEGER NOT NULL,
    sub_question_number TEXT,
    
    -- Response data
    student_answer TEXT, -- Student's actual input
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    audio_plays_used INTEGER NOT NULL DEFAULT 0, -- Number of times audio was played
    
    -- Question metadata (copied for easier querying)
    question_type TEXT NOT NULL,
    theme TEXT NOT NULL,
    topic TEXT NOT NULL,
    marks_possible INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aqa_listening_assessments_level_language ON aqa_listening_assessments(level, language);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_assessments_identifier ON aqa_listening_assessments(identifier);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_questions_assessment_id ON aqa_listening_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_questions_question_number ON aqa_listening_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_assignments_teacher_id ON aqa_listening_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_assignments_class_id ON aqa_listening_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_results_student_id ON aqa_listening_results(student_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_results_assessment_id ON aqa_listening_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_question_responses_result_id ON aqa_listening_question_responses(result_id);

-- Enable Row Level Security
ALTER TABLE aqa_listening_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_listening_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_listening_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_listening_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_listening_question_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aqa_listening_assessments
CREATE POLICY "Teachers can manage assessments" ON aqa_listening_assessments
    FOR ALL USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view active assessments" ON aqa_listening_assessments
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- RLS Policies for aqa_listening_questions
CREATE POLICY "Teachers can manage questions" ON aqa_listening_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM aqa_listening_assessments ala
            WHERE ala.id = aqa_listening_questions.assessment_id
            AND (ala.created_by = auth.uid() OR
                 EXISTS (
                     SELECT 1 FROM user_profiles
                     WHERE user_id = auth.uid() AND role = 'teacher'
                 ))
        )
    );

CREATE POLICY "Students can view questions" ON aqa_listening_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_listening_assessments ala
            WHERE ala.id = aqa_listening_questions.assessment_id
            AND ala.is_active = true
            AND EXISTS (
                SELECT 1 FROM user_profiles
                WHERE user_id = auth.uid() AND role = 'student'
            )
        )
    );

-- RLS Policies for aqa_listening_assignments
CREATE POLICY "Teachers can manage their assignments" ON aqa_listening_assignments
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their assignments" ON aqa_listening_assignments
    FOR SELECT USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            WHERE ce.class_id = aqa_listening_assignments.class_id
            AND ce.student_id = auth.uid()
        )
    );

-- RLS Policies for aqa_listening_results
CREATE POLICY "Students can manage their own results" ON aqa_listening_results
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students' results" ON aqa_listening_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_listening_assignments ala
            WHERE ala.id = aqa_listening_results.assignment_id
            AND ala.teacher_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            JOIN aqa_listening_assignments ala ON ala.class_id = ce.class_id
            WHERE ce.student_id = aqa_listening_results.student_id
            AND ala.teacher_id = auth.uid()
        )
    );

-- RLS Policies for aqa_listening_question_responses
CREATE POLICY "Students can manage their own responses" ON aqa_listening_question_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM aqa_listening_results alr
            WHERE alr.id = aqa_listening_question_responses.result_id
            AND alr.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view their students' responses" ON aqa_listening_question_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_listening_results alr
            JOIN aqa_listening_assignments ala ON ala.id = alr.assignment_id
            WHERE alr.id = aqa_listening_question_responses.result_id
            AND ala.teacher_id = auth.uid()
        )
    );

-- Add comments for documentation
COMMENT ON TABLE aqa_listening_assessments IS 'Static AQA listening assessment definitions';
COMMENT ON TABLE aqa_listening_questions IS 'Individual questions within AQA listening assessments with TTS configuration';
COMMENT ON TABLE aqa_listening_assignments IS 'Teacher assignments of AQA listening assessments to students/classes';
COMMENT ON TABLE aqa_listening_results IS 'Student attempt results for AQA listening assessments';
COMMENT ON TABLE aqa_listening_question_responses IS 'Detailed question-by-question response tracking with audio play counts';
