-- AQA Reading Assessment System Migration
-- This migration creates the database structure for AQA-style reading assessments

-- Create AQA reading assessments table (static assessment definitions)
CREATE TABLE IF NOT EXISTS aqa_reading_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    level TEXT NOT NULL CHECK (level IN ('foundation', 'higher')),
    language TEXT NOT NULL DEFAULT 'es',
    version TEXT NOT NULL DEFAULT '1.0',
    total_questions INTEGER NOT NULL DEFAULT 40,
    time_limit_minutes INTEGER NOT NULL, -- 45 for foundation, 60 for higher
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create AQA reading questions table (individual questions within assessments)
CREATE TABLE IF NOT EXISTS aqa_reading_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES aqa_reading_assessments(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL, -- 1-40, with sub-questions like 40.1, 40.2
    sub_question_number TEXT, -- For translation questions: '40.1', '40.2', etc.
    question_type TEXT NOT NULL CHECK (question_type IN (
        'letter-matching', 'multiple-choice', 'student-grid', 'open-response', 
        'time-sequence', 'sentence-completion', 'headline-matching', 'translation', 'opinion-rating'
    )),
    title TEXT NOT NULL,
    instructions TEXT NOT NULL,
    reading_text TEXT, -- The Spanish text to read
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
    difficulty_rating INTEGER DEFAULT 3 CHECK (difficulty_rating BETWEEN 1 AND 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assessment_id, question_number, sub_question_number)
);

-- Create AQA reading assignments table (teacher assignments)
CREATE TABLE IF NOT EXISTS aqa_reading_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES aqa_reading_assessments(id),
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

-- Create AQA reading results table (student attempts and results)
CREATE TABLE IF NOT EXISTS aqa_reading_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id),
    assessment_id UUID NOT NULL REFERENCES aqa_reading_assessments(id),
    assignment_id UUID REFERENCES aqa_reading_assignments(id), -- NULL for practice attempts
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
    
    -- Pre-calculated performance summaries for faster reporting
    performance_by_question_type JSONB DEFAULT '{}',
    performance_by_theme JSONB DEFAULT '{}',
    performance_by_topic JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, assessment_id, attempt_number)
);

-- Create AQA reading question responses table (detailed response tracking)
CREATE TABLE IF NOT EXISTS aqa_reading_question_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    result_id UUID NOT NULL REFERENCES aqa_reading_results(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES aqa_reading_questions(id),
    question_number INTEGER NOT NULL,
    sub_question_number TEXT,
    
    -- Response data
    student_answer TEXT, -- Student's actual input
    is_correct BOOLEAN NOT NULL,
    points_awarded INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    
    -- Question metadata (copied for easier querying)
    question_type TEXT NOT NULL,
    theme TEXT NOT NULL,
    topic TEXT NOT NULL,
    marks_possible INTEGER NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_aqa_reading_questions_assessment_id ON aqa_reading_questions(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_questions_type ON aqa_reading_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_questions_theme ON aqa_reading_questions(theme);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_questions_topic ON aqa_reading_questions(topic);

CREATE INDEX IF NOT EXISTS idx_aqa_reading_assignments_teacher_id ON aqa_reading_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_assignments_class_id ON aqa_reading_assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_assignments_student_id ON aqa_reading_assignments(student_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_assignments_due_date ON aqa_reading_assignments(due_date);

CREATE INDEX IF NOT EXISTS idx_aqa_reading_results_student_id ON aqa_reading_results(student_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_results_assessment_id ON aqa_reading_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_results_assignment_id ON aqa_reading_results(assignment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_results_submission_date ON aqa_reading_results(submission_date);

CREATE INDEX IF NOT EXISTS idx_aqa_reading_responses_result_id ON aqa_reading_question_responses(result_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_responses_question_id ON aqa_reading_question_responses(question_id);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_responses_question_type ON aqa_reading_question_responses(question_type);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_responses_theme ON aqa_reading_question_responses(theme);
CREATE INDEX IF NOT EXISTS idx_aqa_reading_responses_topic ON aqa_reading_question_responses(topic);

-- Enable Row Level Security
ALTER TABLE aqa_reading_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_reading_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_reading_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_reading_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE aqa_reading_question_responses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for aqa_reading_assessments
CREATE POLICY "Teachers can manage assessments" ON aqa_reading_assessments
    FOR ALL USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view active assessments" ON aqa_reading_assessments
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role IN ('student', 'teacher')
        )
    );

-- RLS Policies for aqa_reading_questions
CREATE POLICY "Teachers can manage questions" ON aqa_reading_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view questions" ON aqa_reading_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role IN ('student', 'teacher')
        )
    );

-- RLS Policies for aqa_reading_assignments
CREATE POLICY "Teachers can manage their assignments" ON aqa_reading_assignments
    FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view their assignments" ON aqa_reading_assignments
    FOR SELECT USING (
        auth.uid() = student_id OR
        EXISTS (
            SELECT 1 FROM class_students cs 
            WHERE cs.class_id = aqa_reading_assignments.class_id 
            AND cs.student_id = auth.uid()
        )
    );

-- RLS Policies for aqa_reading_results
CREATE POLICY "Students can manage their own results" ON aqa_reading_results
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view their students' results" ON aqa_reading_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_reading_assignments ara
            WHERE ara.id = aqa_reading_results.assignment_id
            AND ara.teacher_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM class_students cs
            JOIN aqa_reading_assignments ara ON ara.class_id = cs.class_id
            WHERE cs.student_id = aqa_reading_results.student_id
            AND ara.teacher_id = auth.uid()
        )
    );

-- RLS Policies for aqa_reading_question_responses
CREATE POLICY "Students can manage their own responses" ON aqa_reading_question_responses
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM aqa_reading_results arr
            WHERE arr.id = aqa_reading_question_responses.result_id
            AND arr.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view their students' responses" ON aqa_reading_question_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_reading_results arr
            JOIN aqa_reading_assignments ara ON ara.id = arr.assignment_id
            WHERE arr.id = aqa_reading_question_responses.result_id
            AND ara.teacher_id = auth.uid()
        )
    );

-- Add comments for documentation
COMMENT ON TABLE aqa_reading_assessments IS 'Static AQA reading assessment definitions';
COMMENT ON TABLE aqa_reading_questions IS 'Individual questions within AQA reading assessments';
COMMENT ON TABLE aqa_reading_assignments IS 'Teacher assignments of AQA reading assessments to students/classes';
COMMENT ON TABLE aqa_reading_results IS 'Student attempt results for AQA reading assessments';
COMMENT ON TABLE aqa_reading_question_responses IS 'Detailed question-by-question response tracking';
