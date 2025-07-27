-- Unified Assignment System Enhancements
-- This migration adds support for the unified vocabulary assignment system
-- across all Language Gems games with KS3/KS4 curriculum support

-- ============================================================================
-- 1. ENHANCE ASSIGNMENTS TABLE FOR UNIFIED SYSTEM
-- ============================================================================

-- Add columns for unified assignment system
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'standard' CHECK (type IN ('standard', 'smart_multi_game')),
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
ADD COLUMN IF NOT EXISTS assignment_mode TEXT DEFAULT 'single_game' CHECK (assignment_mode IN ('single_game', 'multi_game', 'adaptive')),
ADD COLUMN IF NOT EXISTS auto_grade BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS feedback_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS hints_allowed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS power_ups_enabled BOOLEAN DEFAULT true;

-- Update existing columns for better consistency
ALTER TABLE assignments 
ALTER COLUMN teacher_id SET NOT NULL;

-- Ensure vocabulary_criteria has proper structure
UPDATE assignments 
SET vocabulary_criteria = COALESCE(vocabulary_criteria, '{}'::jsonb)
WHERE vocabulary_criteria IS NULL;

-- ============================================================================
-- 2. ENHANCE CENTRALIZED_VOCABULARY FOR KS4 SUPPORT
-- ============================================================================

-- Add KS4 curriculum support to centralized vocabulary
ALTER TABLE centralized_vocabulary 
ADD COLUMN IF NOT EXISTS curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
ADD COLUMN IF NOT EXISTS exam_board TEXT, -- For GCSE specifications
ADD COLUMN IF NOT EXISTS topic_complexity INTEGER DEFAULT 1 CHECK (topic_complexity BETWEEN 1 AND 5),
ADD COLUMN IF NOT EXISTS prerequisite_topics TEXT[] DEFAULT '{}';

-- Create index for curriculum level queries
CREATE INDEX IF NOT EXISTS idx_centralized_vocabulary_curriculum_level 
ON centralized_vocabulary(curriculum_level);

-- ============================================================================
-- 3. ENHANCE ASSIGNMENT_PROGRESS FOR DETAILED TRACKING
-- ============================================================================

-- Add detailed progress tracking columns
ALTER TABLE assignment_progress 
ADD COLUMN IF NOT EXISTS words_attempted INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS words_correct INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS words_learned INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS best_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS session_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS average_response_time DECIMAL(8,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS difficulty_progression JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS learning_analytics JSONB DEFAULT '{}';

-- ============================================================================
-- 4. CREATE GAME_SESSIONS TABLE FOR SESSION TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    session_mode TEXT NOT NULL DEFAULT 'free_play' CHECK (session_mode IN ('free_play', 'assignment', 'practice')),
    
    -- Session data
    session_data JSONB DEFAULT '{}',
    vocabulary_practiced INTEGER[] DEFAULT '{}',
    
    -- Performance metrics
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    words_attempted INTEGER DEFAULT 0,
    words_correct INTEGER DEFAULT 0,
    
    -- Timing
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Status
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for game sessions
CREATE INDEX IF NOT EXISTS idx_game_sessions_student_id ON game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_assignment_id ON game_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_game_sessions_status ON game_sessions(status);

-- ============================================================================
-- 5. CREATE ASSIGNMENT_VOCABULARY_DELIVERY TABLE
-- ============================================================================

-- Track how vocabulary is delivered to assignments
CREATE TABLE IF NOT EXISTS assignment_vocabulary_delivery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    delivery_method TEXT NOT NULL CHECK (delivery_method IN ('category', 'custom_list', 'manual_selection', 'adaptive')),
    
    -- Source configuration
    category_id TEXT,
    subcategory_id TEXT,
    custom_list_id UUID REFERENCES vocabulary_assignment_lists(id) ON DELETE CASCADE,
    vocabulary_items INTEGER[] DEFAULT '{}',
    
    -- Delivery settings
    word_count INTEGER DEFAULT 20,
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
    randomize BOOLEAN DEFAULT true,
    include_audio BOOLEAN DEFAULT true,
    
    -- Metadata
    delivery_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    delivered_vocabulary INTEGER[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(assignment_id)
);

-- ============================================================================
-- 6. ENHANCE VOCABULARY_GEM_COLLECTION FOR ASSIGNMENT TRACKING
-- ============================================================================

-- Add assignment context to gem collection
ALTER TABLE vocabulary_gem_collection 
ADD COLUMN IF NOT EXISTS assignment_context JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS game_contexts TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS curriculum_progress JSONB DEFAULT '{}';

-- ============================================================================
-- 7. CREATE ASSIGNMENT_ANALYTICS TABLE
-- ============================================================================

-- Store computed analytics for assignments
CREATE TABLE IF NOT EXISTS assignment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    
    -- Participation metrics
    total_students INTEGER DEFAULT 0,
    students_started INTEGER DEFAULT 0,
    students_completed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Performance metrics
    average_score DECIMAL(8,2) DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    average_time_spent INTEGER DEFAULT 0,
    average_attempts DECIMAL(5,2) DEFAULT 0,
    
    -- Vocabulary metrics
    total_words_practiced INTEGER DEFAULT 0,
    average_words_learned DECIMAL(5,2) DEFAULT 0,
    vocabulary_mastery_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Difficulty analysis
    difficulty_distribution JSONB DEFAULT '{}',
    struggling_words INTEGER[] DEFAULT '{}',
    mastered_words INTEGER[] DEFAULT '{}',
    
    -- Temporal analysis
    peak_performance_times JSONB DEFAULT '{}',
    completion_timeline JSONB DEFAULT '{}',
    
    -- Last computed
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(assignment_id)
);

-- ============================================================================
-- 8. CREATE CURRICULUM_STANDARDS TABLE
-- ============================================================================

-- Define curriculum standards for KS3/KS4
CREATE TABLE IF NOT EXISTS curriculum_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL CHECK (level IN ('KS3', 'KS4')),
    subject TEXT NOT NULL DEFAULT 'modern_foreign_languages',
    category_id TEXT NOT NULL,
    subcategory_id TEXT,
    
    -- Standard details
    standard_code TEXT,
    title TEXT NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    assessment_criteria TEXT[],
    
    -- Vocabulary requirements
    min_vocabulary_count INTEGER DEFAULT 10,
    max_vocabulary_count INTEGER DEFAULT 50,
    required_complexity_level INTEGER DEFAULT 1,
    
    -- Metadata
    exam_board TEXT, -- AQA, Edexcel, OCR, etc.
    year_introduced INTEGER,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(level, category_id, subcategory_id)
);

-- ============================================================================
-- 9. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Assignment-related indexes
CREATE INDEX IF NOT EXISTS idx_assignments_curriculum_level ON assignments(curriculum_level);
CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(type);
CREATE INDEX IF NOT EXISTS idx_assignments_created_by ON assignments(created_by);
CREATE INDEX IF NOT EXISTS idx_assignments_status_due_date ON assignments(status, due_date);

-- Assignment progress indexes
CREATE INDEX IF NOT EXISTS idx_assignment_progress_status ON assignment_progress(status);
CREATE INDEX IF NOT EXISTS idx_assignment_progress_completed_at ON assignment_progress(completed_at);

-- Vocabulary delivery indexes
CREATE INDEX IF NOT EXISTS idx_assignment_vocabulary_delivery_method ON assignment_vocabulary_delivery(delivery_method);
CREATE INDEX IF NOT EXISTS idx_assignment_vocabulary_delivery_curriculum ON assignment_vocabulary_delivery(curriculum_level);

-- ============================================================================
-- 10. CREATE FUNCTIONS FOR ASSIGNMENT MANAGEMENT
-- ============================================================================

-- Function to calculate assignment completion rate
CREATE OR REPLACE FUNCTION calculate_assignment_completion_rate(assignment_uuid UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_students INTEGER;
    completed_students INTEGER;
    completion_rate DECIMAL(5,2);
BEGIN
    -- Get total students enrolled in the assignment's class
    SELECT COUNT(DISTINCT ce.student_id) INTO total_students
    FROM class_enrollments ce
    JOIN assignments a ON a.class_id = ce.class_id
    WHERE a.id = assignment_uuid;
    
    -- Get completed students
    SELECT COUNT(*) INTO completed_students
    FROM assignment_progress ap
    WHERE ap.assignment_id = assignment_uuid 
    AND ap.status = 'completed';
    
    -- Calculate completion rate
    IF total_students > 0 THEN
        completion_rate := (completed_students::DECIMAL / total_students::DECIMAL) * 100;
    ELSE
        completion_rate := 0;
    END IF;
    
    RETURN completion_rate;
END;
$$ LANGUAGE plpgsql;

-- Function to update assignment analytics
CREATE OR REPLACE FUNCTION update_assignment_analytics(assignment_uuid UUID)
RETURNS VOID AS $$
DECLARE
    analytics_record RECORD;
BEGIN
    -- Calculate analytics
    SELECT 
        COUNT(DISTINCT ce.student_id) as total_students,
        COUNT(DISTINCT ap.student_id) as students_started,
        COUNT(DISTINCT CASE WHEN ap.status = 'completed' THEN ap.student_id END) as students_completed,
        AVG(ap.score) as avg_score,
        AVG(ap.accuracy) as avg_accuracy,
        AVG(ap.time_spent) as avg_time_spent,
        AVG(ap.attempts) as avg_attempts
    INTO analytics_record
    FROM assignments a
    LEFT JOIN class_enrollments ce ON ce.class_id = a.class_id
    LEFT JOIN assignment_progress ap ON ap.assignment_id = a.id
    WHERE a.id = assignment_uuid;
    
    -- Upsert analytics
    INSERT INTO assignment_analytics (
        assignment_id, total_students, students_started, students_completed,
        completion_rate, average_score, average_accuracy, average_time_spent,
        average_attempts, computed_at
    ) VALUES (
        assignment_uuid,
        analytics_record.total_students,
        analytics_record.students_started,
        analytics_record.students_completed,
        calculate_assignment_completion_rate(assignment_uuid),
        analytics_record.avg_score,
        analytics_record.avg_accuracy,
        analytics_record.avg_time_spent,
        analytics_record.avg_attempts,
        NOW()
    )
    ON CONFLICT (assignment_id) DO UPDATE SET
        total_students = EXCLUDED.total_students,
        students_started = EXCLUDED.students_started,
        students_completed = EXCLUDED.students_completed,
        completion_rate = EXCLUDED.completion_rate,
        average_score = EXCLUDED.average_score,
        average_accuracy = EXCLUDED.average_accuracy,
        average_time_spent = EXCLUDED.average_time_spent,
        average_attempts = EXCLUDED.average_attempts,
        computed_at = EXCLUDED.computed_at,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 11. CREATE TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Trigger to update assignment analytics when progress changes
CREATE OR REPLACE FUNCTION trigger_update_assignment_analytics()
RETURNS TRIGGER AS $$
BEGIN
    -- Update analytics for the affected assignment
    PERFORM update_assignment_analytics(COALESCE(NEW.assignment_id, OLD.assignment_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS assignment_progress_analytics_trigger ON assignment_progress;
CREATE TRIGGER assignment_progress_analytics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON assignment_progress
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_assignment_analytics();

-- ============================================================================
-- 12. ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_vocabulary_delivery ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_standards ENABLE ROW LEVEL SECURITY;

-- Game sessions policies
CREATE POLICY "Students can view their own game sessions" ON game_sessions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own game sessions" ON game_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own game sessions" ON game_sessions
    FOR UPDATE USING (auth.uid() = student_id);

-- Assignment vocabulary delivery policies
CREATE POLICY "Teachers can manage assignment vocabulary delivery" ON assignment_vocabulary_delivery
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a 
            WHERE a.id = assignment_vocabulary_delivery.assignment_id 
            AND a.teacher_id = auth.uid()
        )
    );

-- Assignment analytics policies
CREATE POLICY "Teachers can view assignment analytics" ON assignment_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignments a 
            WHERE a.id = assignment_analytics.assignment_id 
            AND a.teacher_id = auth.uid()
        )
    );

-- Curriculum standards policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view curriculum standards" ON curriculum_standards
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- 13. INSERT INITIAL CURRICULUM STANDARDS DATA
-- ============================================================================

-- Insert KS3 curriculum standards
INSERT INTO curriculum_standards (level, category_id, title, description, min_vocabulary_count, max_vocabulary_count) VALUES
('KS3', 'personal_info', 'Personal Information', 'Basic personal details, family, and relationships', 15, 30),
('KS3', 'school_education', 'School and Education', 'School subjects, facilities, and educational activities', 20, 40),
('KS3', 'free_time_hobbies', 'Free Time and Hobbies', 'Leisure activities, sports, and entertainment', 25, 45),
('KS3', 'daily_routine', 'Daily Routine', 'Daily activities, time expressions, and routines', 20, 35),
('KS3', 'food_drink', 'Food and Drink', 'Meals, ingredients, and dining experiences', 30, 50),
('KS3', 'travel_transport', 'Travel and Transport', 'Transportation methods and travel experiences', 25, 40),
('KS3', 'weather_seasons', 'Weather and Seasons', 'Weather conditions and seasonal activities', 15, 25),
('KS3', 'shopping_money', 'Shopping and Money', 'Shopping experiences and financial transactions', 20, 35),
('KS3', 'health_body', 'Health and Body', 'Body parts, health conditions, and medical care', 25, 40),
('KS3', 'home_town', 'Home and Local Area', 'Home environment and local community', 20, 35),
('KS3', 'technology_media', 'Technology and Media', 'Digital devices and media consumption', 20, 35),
('KS3', 'environment_nature', 'Environment and Nature', 'Environmental issues and natural world', 25, 40),
('KS3', 'celebrations_festivals', 'Celebrations and Festivals', 'Cultural celebrations and traditions', 20, 35),
('KS3', 'clothes_fashion', 'Clothes and Fashion', 'Clothing items and fashion preferences', 25, 40);

-- Insert KS4 (GCSE) curriculum standards
INSERT INTO curriculum_standards (level, category_id, title, description, min_vocabulary_count, max_vocabulary_count, exam_board) VALUES
('KS4', 'identity_culture_ks4', 'Identity and Culture', 'Personal identity, cultural diversity, and social issues', 40, 80, 'AQA'),
('KS4', 'relationships_choices_ks4', 'Relationships and Choices', 'Family dynamics, friendships, and life decisions', 35, 70, 'AQA'),
('KS4', 'education_employment_ks4', 'Education and Employment', 'Educational systems, career planning, and workplace skills', 45, 90, 'AQA'),
('KS4', 'leisure_lifestyle_ks4', 'Leisure and Lifestyle', 'Arts, culture, sports, and lifestyle choices', 40, 75, 'AQA'),
('KS4', 'health_wellbeing_ks4', 'Health and Wellbeing', 'Physical and mental health, healthcare systems', 35, 65, 'AQA'),
('KS4', 'technology_future_ks4', 'Technology and Future', 'Digital revolution, AI, and future careers', 30, 60, 'AQA'),
('KS4', 'environment_sustainability_ks4', 'Environment and Sustainability', 'Climate change, conservation, and sustainable living', 35, 70, 'AQA'),
('KS4', 'global_issues_ks4', 'Global Issues', 'International relations, human rights, and global challenges', 40, 80, 'AQA');

COMMIT;
