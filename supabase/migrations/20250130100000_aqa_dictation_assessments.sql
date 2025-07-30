-- AQA Dictation Assessment System Migration
-- This migration creates the database structure for AQA-style dictation assessments

-- Create AQA dictation assessments table (static assessment definitions)
CREATE TABLE IF NOT EXISTS aqa_dictation_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('foundation', 'higher')),
    language TEXT NOT NULL DEFAULT 'es',
    identifier TEXT NOT NULL, -- paper-1, paper-2, etc.
    version TEXT NOT NULL DEFAULT '1.0',
    total_questions INTEGER NOT NULL DEFAULT 5, -- 5 dictation sentences
    time_limit_minutes INTEGER NOT NULL, -- 15 for foundation, 20 for higher
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level, language, identifier)
);

-- Create AQA dictation questions table (individual sentences within assessments)
CREATE TABLE IF NOT EXISTS aqa_dictation_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_dictation_assessments(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL, -- 1-5
    sentence_text TEXT NOT NULL, -- The sentence to be dictated
    
    -- Audio URLs for different speeds
    audio_url_normal TEXT, -- Normal slow speed (0.6)
    audio_url_very_slow TEXT, -- Very slow speed (word-by-word)
    
    -- Question metadata
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
    
    -- TTS Configuration for audio generation
    tts_config JSONB DEFAULT '{}',
    difficulty_rating INTEGER DEFAULT 3 CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_number)
);

-- Create AQA dictation assignments table (teacher assignments)
CREATE TABLE IF NOT EXISTS aqa_dictation_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES aqa_dictation_assessments(id),
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

-- Create AQA dictation results table (student attempts and results)
CREATE TABLE IF NOT EXISTS aqa_dictation_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    assessment_id UUID NOT NULL REFERENCES aqa_dictation_assessments(id),
    assignment_id UUID REFERENCES aqa_dictation_assignments(id), -- NULL for practice attempts
    attempt_number INTEGER NOT NULL DEFAULT 1,
    
    -- Timing data
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER NOT NULL,
    
    -- Scoring data
    raw_score INTEGER NOT NULL DEFAULT 0,
    total_possible_score INTEGER NOT NULL DEFAULT 5,
    percentage_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'incomplete', 'abandoned')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Individual question responses
    responses JSONB NOT NULL DEFAULT '[]', -- Array of response objects
    
    -- Audio playback tracking
    audio_play_counts JSONB DEFAULT '{}', -- Track plays per question and speed
    
    -- Pre-calculated performance summaries for faster reporting
    performance_by_theme JSONB DEFAULT '{}',
    performance_by_topic JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, assessment_id, attempt_number)
);

-- Create AQA dictation question responses table (detailed response tracking)
CREATE TABLE IF NOT EXISTS aqa_dictation_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES aqa_dictation_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES aqa_dictation_questions(id),
    question_number INTEGER NOT NULL,
    
    -- Response data
    student_answer TEXT, -- Student's dictated text
    correct_answer TEXT NOT NULL, -- The original sentence
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    
    -- Audio playback tracking
    normal_audio_plays INTEGER NOT NULL DEFAULT 0,
    very_slow_audio_plays INTEGER NOT NULL DEFAULT 0,
    
    -- Question metadata (copied for easier querying)
    theme TEXT NOT NULL,
    topic TEXT NOT NULL,
    marks_possible INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_assessments_level_language ON aqa_dictation_assessments(level, language);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_assessments_identifier ON aqa_dictation_assessments(identifier);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_questions_assessment_id ON aqa_dictation_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_questions_question_number ON aqa_dictation_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_assignments_teacher_id ON aqa_dictation_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_assignments_class_id ON aqa_dictation_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_results_student_id ON aqa_dictation_results(student_id);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_results_assessment_id ON aqa_dictation_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_question_responses_result_id ON aqa_dictation_question_responses(result_id);

-- Enable Row Level Security
ALTER TABLE aqa_dictation_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_dictation_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_dictation_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_dictation_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_dictation_question_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aqa_dictation_assessments
CREATE POLICY "Teachers can manage dictation assessments" ON aqa_dictation_assessments
    FOR ALL USING (
        auth.uid() = created_by OR
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view active dictation assessments" ON aqa_dictation_assessments
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- RLS Policies for aqa_dictation_questions
CREATE POLICY "Teachers can manage dictation questions" ON aqa_dictation_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assessments ada
            WHERE ada.id = aqa_dictation_questions.assessment_id
            AND (ada.created_by = auth.uid() OR
                 EXISTS (
                     SELECT 1 FROM user_profiles
                     WHERE user_id = auth.uid() AND role = 'teacher'
                 ))
        )
    );

CREATE POLICY "Students can view dictation questions" ON aqa_dictation_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assessments ada
            WHERE ada.id = aqa_dictation_questions.assessment_id
            AND ada.is_active = true
            AND EXISTS (
                SELECT 1 FROM user_profiles
                WHERE user_id = auth.uid() AND role = 'student'
            )
        )
    );

-- RLS Policies for aqa_dictation_assignments
CREATE POLICY "Teachers can manage their dictation assignments" ON aqa_dictation_assignments
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their dictation assignments" ON aqa_dictation_assignments
    FOR SELECT USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            WHERE ce.class_id = aqa_dictation_assignments.class_id
            AND ce.student_id = auth.uid()
        )
    );

-- RLS Policies for aqa_dictation_results
CREATE POLICY "Students can manage their own dictation results" ON aqa_dictation_results
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students' dictation results" ON aqa_dictation_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assignments ada
            WHERE ada.id = aqa_dictation_results.assignment_id
            AND ada.teacher_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM class_enrollments ce
            JOIN aqa_dictation_assignments ada ON ada.class_id = ce.class_id
            WHERE ce.student_id = aqa_dictation_results.student_id
            AND ada.teacher_id = auth.uid()
        )
    );

-- RLS Policies for aqa_dictation_question_responses
CREATE POLICY "Students can manage their own dictation responses" ON aqa_dictation_question_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_results adr
            WHERE adr.id = aqa_dictation_question_responses.result_id
            AND adr.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view their students' dictation responses" ON aqa_dictation_question_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_results adr
            JOIN aqa_dictation_assignments ada ON ada.id = adr.assignment_id
            WHERE adr.id = aqa_dictation_question_responses.result_id
            AND ada.teacher_id = auth.uid()
        )
    );

-- Add comments for documentation
COMMENT ON TABLE aqa_dictation_assessments IS 'Static AQA dictation assessment definitions';
COMMENT ON TABLE aqa_dictation_questions IS 'Individual dictation sentences with dual-speed audio URLs';
COMMENT ON TABLE aqa_dictation_assignments IS 'Teacher assignments of AQA dictation assessments to students/classes';
COMMENT ON TABLE aqa_dictation_results IS 'Student attempt results for AQA dictation assessments';
COMMENT ON TABLE aqa_dictation_question_responses IS 'Detailed question-by-question response tracking with dual audio play counts';
