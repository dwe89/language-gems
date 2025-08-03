-- AI-Powered Analytics Dashboard Migration
-- This migration adds tables and enhancements for comprehensive teacher analytics

-- =====================================================
-- AI INSIGHTS AND NOTIFICATIONS
-- =====================================================

-- Store AI-generated insights and predictions
CREATE TABLE IF NOT EXISTS ai_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Insight metadata
    insight_type TEXT NOT NULL CHECK (insight_type IN (
        'at_risk_student', 'weakness_hotspot', 'performance_prediction', 
        'engagement_alert', 'mastery_recommendation', 'assignment_optimization'
    )),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    
    -- Content
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    recommendation TEXT,
    confidence_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
    
    -- Context
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    vocabulary_theme TEXT,
    skill_area TEXT, -- e.g., 'verb_conjugations', 'vocabulary_retention'
    
    -- AI metadata
    ai_model TEXT DEFAULT 'gpt-4.1-nano',
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Action tracking
    action_taken TEXT,
    action_taken_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store predictive analytics data
CREATE TABLE IF NOT EXISTS predictive_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Prediction type and context
    prediction_type TEXT NOT NULL CHECK (prediction_type IN (
        'assignment_completion', 'performance_forecast', 'vocabulary_retention',
        'engagement_risk', 'mastery_timeline', 'difficulty_adaptation'
    )),
    context_id UUID, -- assignment_id, vocabulary_id, etc.
    context_type TEXT, -- 'assignment', 'vocabulary', 'topic'
    
    -- Prediction data
    predicted_value DECIMAL(8,2) NOT NULL,
    confidence_interval_lower DECIMAL(8,2),
    confidence_interval_upper DECIMAL(8,2),
    probability DECIMAL(3,2), -- 0.0 to 1.0
    
    -- Timeline
    prediction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    target_date TIMESTAMP WITH TIME ZONE,
    
    -- Model metadata
    model_version TEXT DEFAULT '1.0',
    features_used JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENHANCED STUDENT ANALYTICS
-- =====================================================

-- Comprehensive student performance tracking
CREATE TABLE IF NOT EXISTS student_performance_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    
    -- Time period
    period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly', 'term')),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Performance metrics
    total_assignments INTEGER DEFAULT 0,
    completed_assignments INTEGER DEFAULT 0,
    average_score DECIMAL(5,2) DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- seconds
    
    -- Learning metrics
    words_attempted INTEGER DEFAULT 0,
    words_mastered INTEGER DEFAULT 0,
    vocabulary_retention_rate DECIMAL(5,2) DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Engagement metrics
    login_frequency INTEGER DEFAULT 0,
    session_duration_avg INTEGER DEFAULT 0,
    streak_current INTEGER DEFAULT 0,
    streak_longest INTEGER DEFAULT 0,
    
    -- Skill breakdown
    skill_performance JSONB DEFAULT '{}', -- {"grammar": 85, "vocabulary": 92, "listening": 78}
    topic_performance JSONB DEFAULT '{}', -- {"animals": 90, "food": 85, "family": 88}
    
    -- Risk indicators
    at_risk_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
    risk_factors TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id, period_type, period_start, period_end)
);

-- Vocabulary difficulty analysis
CREATE TABLE IF NOT EXISTS vocabulary_difficulty_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Vocabulary identification
    vocabulary_word TEXT NOT NULL,
    vocabulary_translation TEXT NOT NULL,
    language TEXT NOT NULL,
    theme TEXT,
    topic TEXT,
    
    -- Difficulty metrics
    total_attempts INTEGER DEFAULT 0,
    total_correct INTEGER DEFAULT 0,
    accuracy_rate DECIMAL(5,2) DEFAULT 0,
    average_response_time DECIMAL(8,2) DEFAULT 0, -- seconds
    difficulty_score DECIMAL(3,2) DEFAULT 0.0, -- 0.0 to 1.0
    
    -- Student impact
    students_attempted INTEGER DEFAULT 0,
    students_struggling INTEGER DEFAULT 0, -- accuracy < 60%
    students_mastered INTEGER DEFAULT 0, -- accuracy > 90%
    
    -- Common errors
    common_mistakes JSONB DEFAULT '[]',
    error_patterns JSONB DEFAULT '{}',
    
    -- Recommendations
    teaching_suggestions TEXT[],
    recommended_practice_time INTEGER, -- minutes
    
    -- Analysis metadata
    last_analyzed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sample_size INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(teacher_id, vocabulary_word, language)
);

-- =====================================================
-- GAMIFICATION ANALYTICS
-- =====================================================

-- Enhanced XP and achievement tracking
CREATE TABLE IF NOT EXISTS gamification_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- XP tracking
    total_xp INTEGER DEFAULT 0,
    xp_this_week INTEGER DEFAULT 0,
    xp_this_month INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,
    
    -- Achievement tracking
    total_achievements INTEGER DEFAULT 0,
    achievements_this_week INTEGER DEFAULT 0,
    achievement_categories JSONB DEFAULT '{}', -- {"performance": 5, "consistency": 3}
    rarity_breakdown JSONB DEFAULT '{}', -- {"common": 10, "rare": 3, "epic": 1}
    
    -- Competition metrics
    leaderboard_position INTEGER,
    competitions_won INTEGER DEFAULT 0,
    competitions_participated INTEGER DEFAULT 0,
    
    -- Engagement indicators
    daily_login_streak INTEGER DEFAULT 0,
    weekly_activity_score DECIMAL(5,2) DEFAULT 0,
    motivation_level TEXT DEFAULT 'medium' CHECK (motivation_level IN ('low', 'medium', 'high')),
    
    -- Social features
    friends_count INTEGER DEFAULT 0,
    challenges_sent INTEGER DEFAULT 0,
    challenges_received INTEGER DEFAULT 0,
    
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(student_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- AI insights indexes
CREATE INDEX IF NOT EXISTS idx_ai_insights_teacher_status ON ai_insights(teacher_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_insights_priority_generated ON ai_insights(priority, generated_at);
CREATE INDEX IF NOT EXISTS idx_ai_insights_student_type ON ai_insights(student_id, insight_type);

-- Predictive analytics indexes
CREATE INDEX IF NOT EXISTS idx_predictive_analytics_student ON predictive_analytics(student_id, prediction_type);
CREATE INDEX IF NOT EXISTS idx_predictive_analytics_teacher ON predictive_analytics(teacher_id, prediction_date);

-- Performance analytics indexes
CREATE INDEX IF NOT EXISTS idx_student_performance_teacher_period ON student_performance_analytics(teacher_id, period_type, period_start);
CREATE INDEX IF NOT EXISTS idx_student_performance_student ON student_performance_analytics(student_id, period_start);

-- Vocabulary difficulty indexes
CREATE INDEX IF NOT EXISTS idx_vocabulary_difficulty_teacher ON vocabulary_difficulty_analytics(teacher_id, difficulty_score);
CREATE INDEX IF NOT EXISTS idx_vocabulary_difficulty_word ON vocabulary_difficulty_analytics(vocabulary_word, language);

-- Gamification indexes
CREATE INDEX IF NOT EXISTS idx_gamification_teacher ON gamification_analytics(teacher_id, current_level);
CREATE INDEX IF NOT EXISTS idx_gamification_leaderboard ON gamification_analytics(leaderboard_position, total_xp);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on all new tables
ALTER TABLE ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictive_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_difficulty_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_analytics ENABLE ROW LEVEL SECURITY;

-- AI insights policies
CREATE POLICY "Teachers can manage their own insights"
    ON ai_insights FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

-- Predictive analytics policies
CREATE POLICY "Teachers can view predictions for their students"
    ON predictive_analytics FOR SELECT TO authenticated
    USING (teacher_id = auth.uid());

-- Student performance policies
CREATE POLICY "Teachers can view their students' performance"
    ON student_performance_analytics FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their own performance"
    ON student_performance_analytics FOR SELECT TO authenticated
    USING (student_id = auth.uid());

-- Vocabulary difficulty policies
CREATE POLICY "Teachers can manage vocabulary difficulty data"
    ON vocabulary_difficulty_analytics FOR ALL TO authenticated
    USING (teacher_id = auth.uid());

-- Gamification policies
CREATE POLICY "Teachers can view their students' gamification data"
    ON gamification_analytics FOR SELECT TO authenticated
    USING (teacher_id = auth.uid());

CREATE POLICY "Students can view their own gamification data"
    ON gamification_analytics FOR SELECT TO authenticated
    USING (student_id = auth.uid());
