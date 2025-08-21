-- ============================================================================
-- ENHANCED GRAMMAR CONTENT SYSTEM FOR LANGUAGEGEMS
-- ============================================================================
-- This migration enhances the existing grammar system with comprehensive
-- content management for lessons, quizzes, and practice activities
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE GRAMMAR TOPICS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS grammar_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic information
    topic_name TEXT NOT NULL,
    slug TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    
    -- Content organization
    category TEXT NOT NULL, -- 'verbs', 'nouns', 'adjectives', 'syntax', etc.
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    curriculum_level TEXT NOT NULL CHECK (curriculum_level IN ('KS3', 'KS4')),
    
    -- Display information
    title TEXT NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    
    -- Ordering and organization
    order_position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    -- Prerequisites
    prerequisite_topics UUID[] DEFAULT '{}', -- Array of topic IDs
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(language, slug),
    UNIQUE(language, category, order_position)
);

-- ============================================================================
-- STEP 2: CREATE GRAMMAR CONTENT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS grammar_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Topic relationship
    topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    
    -- Content type and identification
    content_type TEXT NOT NULL CHECK (content_type IN ('lesson', 'quiz', 'practice', 'explanation')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    
    -- Content structure
    content_data JSONB NOT NULL DEFAULT '{}', -- Flexible content structure
    
    -- Difficulty and targeting
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    age_group TEXT NOT NULL CHECK (age_group IN ('11-14', '14-16', 'mixed')),
    estimated_duration INTEGER DEFAULT 10, -- minutes
    
    -- Ordering and status
    order_position INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(topic_id, slug),
    UNIQUE(topic_id, content_type, order_position)
);

-- ============================================================================
-- STEP 3: CREATE GRAMMAR QUESTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS grammar_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content relationship
    content_id UUID NOT NULL REFERENCES grammar_content(id) ON DELETE CASCADE,
    
    -- Question details
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN (
        'multiple_choice', 'fill_blank', 'conjugation', 'translation', 
        'drag_drop', 'matching', 'true_false', 'open_ended'
    )),
    
    -- Answer structure
    correct_answer TEXT NOT NULL,
    options JSONB DEFAULT '{}', -- For multiple choice, matching, etc.
    explanation TEXT,
    
    -- Difficulty and hints
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    hint_text TEXT,
    
    -- Ordering
    order_index INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(content_id, order_index)
);

-- ============================================================================
-- STEP 4: CREATE USER GRAMMAR PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS user_grammar_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and content relationship
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content_id UUID NOT NULL REFERENCES grammar_content(id) ON DELETE CASCADE,
    
    -- Progress tracking
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN (
        'not_started', 'in_progress', 'completed', 'mastered'
    )),
    
    -- Performance metrics
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    accuracy DECIMAL(5,2) DEFAULT 0.00,
    attempts INTEGER DEFAULT 0,
    
    -- Time tracking
    time_spent_seconds INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Detailed progress data
    progress_data JSONB DEFAULT '{}', -- Question-level progress, mistakes, etc.
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, content_id)
);

-- ============================================================================
-- STEP 5: ENHANCE EXISTING GRAMMAR_ASSIGNMENTS TABLE
-- ============================================================================

-- Add additional columns to existing grammar_assignments table if they don't exist
ALTER TABLE grammar_assignments 
ADD COLUMN IF NOT EXISTS content_ids UUID[] DEFAULT '{}', -- Array of grammar_content IDs
ADD COLUMN IF NOT EXISTS topic_ids UUID[] DEFAULT '{}',   -- Array of grammar_topics IDs
ADD COLUMN IF NOT EXISTS assignment_type TEXT DEFAULT 'conjugation' CHECK (assignment_type IN (
    'conjugation', 'lesson', 'quiz', 'practice', 'mixed'
)),
ADD COLUMN IF NOT EXISTS time_limit_minutes INTEGER DEFAULT 15,
ADD COLUMN IF NOT EXISTS max_attempts INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS show_hints BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS randomize_questions BOOLEAN DEFAULT true;

-- ============================================================================
-- STEP 6: CREATE GRAMMAR LESSON PROGRESS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS grammar_lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User and lesson relationship
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES grammar_topics(id) ON DELETE CASCADE,
    
    -- Overall topic progress
    lessons_completed INTEGER DEFAULT 0,
    total_lessons INTEGER DEFAULT 0,
    quizzes_completed INTEGER DEFAULT 0,
    total_quizzes INTEGER DEFAULT 0,
    
    -- Performance summary
    overall_score INTEGER DEFAULT 0,
    overall_accuracy DECIMAL(5,2) DEFAULT 0.00,
    total_time_spent INTEGER DEFAULT 0,
    
    -- Mastery tracking
    mastery_level TEXT DEFAULT 'novice' CHECK (mastery_level IN (
        'novice', 'beginner', 'intermediate', 'advanced', 'expert'
    )),
    
    -- Timestamps
    first_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    UNIQUE(user_id, topic_id)
);

-- ============================================================================
-- STEP 7: CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Grammar topics indexes
CREATE INDEX IF NOT EXISTS idx_grammar_topics_language_level ON grammar_topics(language, curriculum_level);
CREATE INDEX IF NOT EXISTS idx_grammar_topics_category ON grammar_topics(language, category);
CREATE INDEX IF NOT EXISTS idx_grammar_topics_active ON grammar_topics(is_active, order_position);

-- Grammar content indexes
CREATE INDEX IF NOT EXISTS idx_grammar_content_topic_type ON grammar_content(topic_id, content_type);
CREATE INDEX IF NOT EXISTS idx_grammar_content_active ON grammar_content(is_active, order_position);
CREATE INDEX IF NOT EXISTS idx_grammar_content_difficulty ON grammar_content(difficulty_level, age_group);

-- Grammar questions indexes
CREATE INDEX IF NOT EXISTS idx_grammar_questions_content ON grammar_questions(content_id, order_index);
CREATE INDEX IF NOT EXISTS idx_grammar_questions_type ON grammar_questions(question_type, difficulty_level);

-- User progress indexes
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_user ON user_grammar_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_content ON user_grammar_progress(content_id, status);
CREATE INDEX IF NOT EXISTS idx_user_grammar_progress_performance ON user_grammar_progress(user_id, accuracy, score);

-- Lesson progress indexes
CREATE INDEX IF NOT EXISTS idx_grammar_lesson_progress_user ON grammar_lesson_progress(user_id, mastery_level);
CREATE INDEX IF NOT EXISTS idx_grammar_lesson_progress_topic ON grammar_lesson_progress(topic_id, mastery_level);

-- ============================================================================
-- STEP 8: CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to get user's grammar progress summary
CREATE OR REPLACE FUNCTION get_user_grammar_summary(p_user_id UUID, p_language TEXT DEFAULT NULL)
RETURNS TABLE (
    language TEXT,
    topics_started INTEGER,
    topics_completed INTEGER,
    total_topics INTEGER,
    overall_accuracy DECIMAL(5,2),
    total_time_spent INTEGER,
    mastery_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        gt.language,
        COUNT(CASE WHEN glp.mastery_level != 'novice' THEN 1 END)::INTEGER as topics_started,
        COUNT(CASE WHEN glp.completed_at IS NOT NULL THEN 1 END)::INTEGER as topics_completed,
        COUNT(gt.id)::INTEGER as total_topics,
        COALESCE(AVG(glp.overall_accuracy), 0.00)::DECIMAL(5,2) as overall_accuracy,
        COALESCE(SUM(glp.total_time_spent), 0)::INTEGER as total_time_spent,
        jsonb_build_object(
            'novice', COUNT(CASE WHEN glp.mastery_level = 'novice' THEN 1 END),
            'beginner', COUNT(CASE WHEN glp.mastery_level = 'beginner' THEN 1 END),
            'intermediate', COUNT(CASE WHEN glp.mastery_level = 'intermediate' THEN 1 END),
            'advanced', COUNT(CASE WHEN glp.mastery_level = 'advanced' THEN 1 END),
            'expert', COUNT(CASE WHEN glp.mastery_level = 'expert' THEN 1 END)
        ) as mastery_distribution
    FROM grammar_topics gt
    LEFT JOIN grammar_lesson_progress glp ON gt.id = glp.topic_id AND glp.user_id = p_user_id
    WHERE gt.is_active = true
    AND (p_language IS NULL OR gt.language = p_language)
    GROUP BY gt.language
    ORDER BY gt.language;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- STEP 9: ADD COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE grammar_topics IS 'Core grammar topics for each language with curriculum alignment';
COMMENT ON TABLE grammar_content IS 'Individual lessons, quizzes, and practice activities for grammar topics';
COMMENT ON TABLE grammar_questions IS 'Questions for grammar quizzes and practice activities';
COMMENT ON TABLE user_grammar_progress IS 'Detailed progress tracking for individual grammar content';
COMMENT ON TABLE grammar_lesson_progress IS 'Summary progress tracking for grammar topics';

COMMENT ON COLUMN grammar_content.content_data IS 'Flexible JSONB structure for lesson content, quiz configuration, etc.';
COMMENT ON COLUMN user_grammar_progress.progress_data IS 'Detailed progress including question-level performance and mistakes';
COMMENT ON COLUMN grammar_assignments.content_ids IS 'Array of grammar_content IDs assigned to students';
