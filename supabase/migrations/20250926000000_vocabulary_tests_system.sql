-- =====================================================
-- VOCABULARY TESTS SYSTEM
-- =====================================================
-- Comprehensive vocabulary testing system for LanguageGems
-- Integrates with existing assignment and analytics infrastructure

-- Create vocabulary tests table (test definitions)
CREATE TABLE IF NOT EXISTS vocabulary_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Test Configuration
    language TEXT NOT NULL DEFAULT 'es',
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
    test_type TEXT NOT NULL DEFAULT 'mixed' CHECK (test_type IN ('translation_to_english', 'translation_to_target', 'multiple_choice', 'spelling_audio', 'mixed')),
    
    -- Vocabulary Selection
    vocabulary_source TEXT NOT NULL DEFAULT 'category' CHECK (vocabulary_source IN ('category', 'custom_list', 'assignment_vocabulary')),
    vocabulary_criteria JSONB DEFAULT '{}', -- Category, subcategory, or custom list IDs
    word_count INTEGER NOT NULL DEFAULT 20,
    
    -- Test Settings
    time_limit_minutes INTEGER DEFAULT 30,
    max_attempts INTEGER DEFAULT 3,
    randomize_questions BOOLEAN DEFAULT true,
    show_immediate_feedback BOOLEAN DEFAULT false,
    allow_hints BOOLEAN DEFAULT false,
    
    -- Scoring Configuration
    passing_score_percentage INTEGER DEFAULT 70,
    points_per_question INTEGER DEFAULT 5,
    time_bonus_enabled BOOLEAN DEFAULT true,
    
    -- Status and Metadata
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vocabulary test questions table (generated questions for each test)
CREATE TABLE IF NOT EXISTS vocabulary_test_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES vocabulary_tests(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL, -- References centralized_vocabulary.id
    
    -- Question Details
    question_number INTEGER NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('translation_to_english', 'translation_to_target', 'multiple_choice', 'spelling_audio')),
    question_text TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    
    -- Multiple Choice Options (if applicable)
    options JSONB DEFAULT '[]', -- Array of answer options for MC questions
    
    -- Audio Configuration (if applicable)
    audio_url TEXT,
    audio_speed TEXT DEFAULT 'normal' CHECK (audio_speed IN ('normal', 'slow')),
    
    -- Metadata
    difficulty_level TEXT DEFAULT 'intermediate',
    theme TEXT,
    topic TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(test_id, question_number)
);

-- Create vocabulary test assignments table (teacher assignments to classes)
CREATE TABLE IF NOT EXISTS vocabulary_test_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES vocabulary_tests(id) ON DELETE CASCADE,
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    
    -- Assignment Settings
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    due_date TIMESTAMP WITH TIME ZONE,
    custom_instructions TEXT,
    
    -- Override Test Settings (optional)
    custom_time_limit INTEGER,
    custom_max_attempts INTEGER,
    custom_passing_score INTEGER,
    
    status TEXT DEFAULT 'assigned' CHECK (status IN ('assigned', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(test_id, assignment_id)
);

-- Create vocabulary test results table (student attempts and results)
CREATE TABLE IF NOT EXISTS vocabulary_test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES vocabulary_tests(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES vocabulary_test_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    
    -- Timing Data
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    completion_time TIMESTAMP WITH TIME ZONE,
    total_time_seconds INTEGER NOT NULL DEFAULT 0,
    
    -- Scoring Data
    raw_score INTEGER NOT NULL DEFAULT 0,
    total_possible_score INTEGER NOT NULL,
    percentage_score DECIMAL(5,2) NOT NULL DEFAULT 0,
    passed BOOLEAN NOT NULL DEFAULT false,
    
    -- Performance Breakdown
    questions_correct INTEGER DEFAULT 0,
    questions_incorrect INTEGER DEFAULT 0,
    questions_skipped INTEGER DEFAULT 0,
    hints_used INTEGER DEFAULT 0,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    submission_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Individual Question Responses
    responses JSONB NOT NULL DEFAULT '[]', -- Array of detailed response objects
    
    -- Performance Analytics (pre-calculated for faster reporting)
    performance_by_question_type JSONB DEFAULT '{}',
    performance_by_theme JSONB DEFAULT '{}',
    performance_by_topic JSONB DEFAULT '{}',
    error_analysis JSONB DEFAULT '{}', -- Common error patterns
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(test_id, student_id, attempt_number)
);

-- Create vocabulary test analytics table (aggregated class performance data)
CREATE TABLE IF NOT EXISTS vocabulary_test_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id UUID NOT NULL REFERENCES vocabulary_tests(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES vocabulary_test_assignments(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    
    -- Aggregated Performance Metrics
    total_students INTEGER NOT NULL DEFAULT 0,
    students_completed INTEGER NOT NULL DEFAULT 0,
    students_passed INTEGER NOT NULL DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_time_seconds INTEGER DEFAULT 0,
    
    -- Question-Level Analytics
    problem_words JSONB DEFAULT '[]', -- Words with lowest success rates
    mastery_words JSONB DEFAULT '[]', -- Words with highest success rates
    common_errors JSONB DEFAULT '{}', -- Most frequent error patterns
    
    -- Performance Distribution
    score_distribution JSONB DEFAULT '{}', -- Score ranges and student counts
    time_distribution JSONB DEFAULT '{}', -- Time ranges and student counts
    
    -- Recommendations
    remediation_suggestions JSONB DEFAULT '[]', -- Auto-generated improvement suggestions
    
    -- Metadata
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(test_id, assignment_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_vocabulary_tests_teacher ON vocabulary_tests(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabulary_tests_language ON vocabulary_tests(language, curriculum_level);

CREATE INDEX IF NOT EXISTS idx_vocabulary_test_questions_test ON vocabulary_test_questions(test_id, question_number);
CREATE INDEX IF NOT EXISTS idx_vocabulary_test_questions_vocab ON vocabulary_test_questions(vocabulary_id);

CREATE INDEX IF NOT EXISTS idx_vocabulary_test_assignments_teacher ON vocabulary_test_assignments(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabulary_test_assignments_class ON vocabulary_test_assignments(class_id, due_date);

CREATE INDEX IF NOT EXISTS idx_vocabulary_test_results_student ON vocabulary_test_results(student_id, test_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_test_results_assignment ON vocabulary_test_results(assignment_id, status);
CREATE INDEX IF NOT EXISTS idx_vocabulary_test_results_performance ON vocabulary_test_results(percentage_score, passed);

CREATE INDEX IF NOT EXISTS idx_vocabulary_test_analytics_teacher ON vocabulary_test_analytics(teacher_id, last_calculated);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE vocabulary_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_test_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_test_analytics ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own tests
CREATE POLICY "Teachers can manage their own vocabulary tests"
    ON vocabulary_tests FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

-- Teachers can manage questions for their tests
CREATE POLICY "Teachers can manage questions for their tests"
    ON vocabulary_test_questions FOR ALL TO authenticated
    USING (test_id IN (SELECT id FROM vocabulary_tests WHERE teacher_id = auth.uid()));

-- Teachers can manage their test assignments
CREATE POLICY "Teachers can manage their test assignments"
    ON vocabulary_test_assignments FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

-- Students can view their own results, teachers can view results for their tests
CREATE POLICY "Students can view their own test results"
    ON vocabulary_test_results FOR SELECT TO authenticated
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can view results for their tests"
    ON vocabulary_test_results FOR ALL TO authenticated
    USING (test_id IN (SELECT id FROM vocabulary_tests WHERE teacher_id = auth.uid()));

-- Teachers can view analytics for their tests
CREATE POLICY "Teachers can view analytics for their tests"
    ON vocabulary_test_analytics FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update vocabulary_tests updated_at timestamp
CREATE OR REPLACE FUNCTION update_vocabulary_tests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vocabulary_tests_updated_at
    BEFORE UPDATE ON vocabulary_tests
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_tests_updated_at();

-- Update vocabulary_test_assignments updated_at timestamp
CREATE TRIGGER vocabulary_test_assignments_updated_at
    BEFORE UPDATE ON vocabulary_test_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_tests_updated_at();

-- Update vocabulary_test_results updated_at timestamp
CREATE TRIGGER vocabulary_test_results_updated_at
    BEFORE UPDATE ON vocabulary_test_results
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_tests_updated_at();

-- Update vocabulary_test_analytics updated_at timestamp
CREATE TRIGGER vocabulary_test_analytics_updated_at
    BEFORE UPDATE ON vocabulary_test_analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_tests_updated_at();
