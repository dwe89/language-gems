-- Migration: Create AQA Writing Assessments Tables
-- Created: 2025-01-31

-- Create AQA writing assessments table (static assessment definitions)
CREATE TABLE IF NOT EXISTS aqa_writing_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('foundation', 'higher')),
    language TEXT NOT NULL DEFAULT 'es',
    identifier TEXT NOT NULL, -- paper-1, paper-2, etc.
    version TEXT NOT NULL DEFAULT '1.0',
    total_questions INTEGER NOT NULL DEFAULT 5, -- Foundation: Q1-Q5, Higher: different structure
    time_limit_minutes INTEGER NOT NULL, -- Foundation: 60 minutes, Higher: 75 minutes
    total_marks INTEGER NOT NULL DEFAULT 50, -- Foundation: 50 marks total
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(level, language, identifier)
);

-- Create AQA writing questions table (individual questions within assessments)
CREATE TABLE IF NOT EXISTS aqa_writing_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_writing_assessments(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL, -- 1-5 for Foundation
    sub_question_number TEXT, -- For multi-part questions: '1.1', '1.2', etc.
    question_type TEXT NOT NULL CHECK (question_type IN (
        'photo-description', 'short-message', 'gap-fill', 'translation', 'extended-writing'
    )),
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    question_data JSONB NOT NULL, -- Question-specific data (photo URL, prompts, etc.)
    marks INTEGER NOT NULL DEFAULT 10,
    word_count_requirement INTEGER, -- For writing tasks (50 words, 90 words, etc.)
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
    difficulty_rating INTEGER DEFAULT 3 CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AQA writing assignments table (for teacher assignments)
CREATE TABLE IF NOT EXISTS aqa_writing_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_writing_assessments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id),
    school_id UUID REFERENCES schools(id),
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AQA writing results table (student completion records)
CREATE TABLE IF NOT EXISTS aqa_writing_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_writing_assessments(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES aqa_writing_assignments(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES auth.users(id),
    school_id UUID REFERENCES schools(id),
    total_score INTEGER NOT NULL DEFAULT 0,
    max_score INTEGER NOT NULL DEFAULT 50,
    percentage_score DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN max_score > 0 THEN (total_score::DECIMAL / max_score::DECIMAL) * 100
            ELSE 0
        END
    ) STORED,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    questions_completed INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    is_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AQA writing question responses table (individual question answers)
CREATE TABLE IF NOT EXISTS aqa_writing_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES aqa_writing_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES aqa_writing_questions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id),
    response_data JSONB NOT NULL, -- Student's written responses
    score INTEGER DEFAULT 0,
    max_score INTEGER NOT NULL,
    time_spent_seconds INTEGER DEFAULT 0,
    is_correct BOOLEAN DEFAULT false,
    feedback TEXT, -- Teacher or automated feedback
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(result_id, question_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aqa_writing_assessments_level_language ON aqa_writing_assessments(level, language);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_assessments_active ON aqa_writing_assessments(is_active);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_questions_assessment ON aqa_writing_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_questions_number ON aqa_writing_questions(question_number);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_assignments_teacher ON aqa_writing_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_assignments_school ON aqa_writing_assignments(school_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_results_student ON aqa_writing_results(student_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_results_assessment ON aqa_writing_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_responses_result ON aqa_writing_question_responses(result_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_responses_student ON aqa_writing_question_responses(student_id);

-- Enable Row Level Security
ALTER TABLE aqa_writing_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_writing_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_writing_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_writing_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_writing_question_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aqa_writing_assessments (public read for active assessments)
CREATE POLICY "Public can view active writing assessments" ON aqa_writing_assessments
    FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can manage writing assessments" ON aqa_writing_assessments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'teacher'
        )
    );

-- RLS Policies for aqa_writing_questions (public read for active assessment questions)
CREATE POLICY "Public can view writing questions for active assessments" ON aqa_writing_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_writing_assessments 
            WHERE aqa_writing_assessments.id = aqa_writing_questions.assessment_id 
            AND aqa_writing_assessments.is_active = true
        )
    );

CREATE POLICY "Teachers can manage writing questions" ON aqa_writing_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'teacher'
        )
    );

-- RLS Policies for aqa_writing_assignments (teachers can manage their own)
CREATE POLICY "Teachers can manage their writing assignments" ON aqa_writing_assignments
    FOR ALL USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their writing assignments" ON aqa_writing_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND (
                auth.users.raw_user_meta_data->>'school_id' = school_id::text
                OR school_id IS NULL
            )
        )
    );

-- RLS Policies for aqa_writing_results (students can manage their own)
CREATE POLICY "Students can manage their writing results" ON aqa_writing_results
    FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view writing results from their school" ON aqa_writing_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'teacher'
            AND (
                auth.users.raw_user_meta_data->>'school_id' = school_id::text
                OR school_id IS NULL
            )
        )
    );

-- RLS Policies for aqa_writing_question_responses (students can manage their own)
CREATE POLICY "Students can manage their writing responses" ON aqa_writing_question_responses
    FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Teachers can view writing responses from their school" ON aqa_writing_question_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            JOIN aqa_writing_results ON aqa_writing_results.id = aqa_writing_question_responses.result_id
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'teacher'
            AND (
                auth.users.raw_user_meta_data->>'school_id' = aqa_writing_results.school_id::text
                OR aqa_writing_results.school_id IS NULL
            )
        )
    );

-- Add helpful comments
COMMENT ON TABLE aqa_writing_assessments IS 'AQA-style writing assessment definitions';
COMMENT ON TABLE aqa_writing_questions IS 'Individual questions within AQA writing assessments';
COMMENT ON TABLE aqa_writing_assignments IS 'Teacher-created assignments using AQA writing assessments';
COMMENT ON TABLE aqa_writing_results IS 'Student completion records for AQA writing assessments';
COMMENT ON TABLE aqa_writing_question_responses IS 'Individual student responses to writing questions';
