-- Enhanced Game System Migration
-- This migration creates comprehensive tables for advanced game analytics, 
-- assignment integration, and real-time dashboards

-- =====================================================
-- ENHANCED GAME ANALYTICS TABLES
-- =====================================================

-- Game sessions with detailed tracking
CREATE TABLE IF NOT EXISTS enhanced_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    session_mode TEXT NOT NULL DEFAULT 'free_play' CHECK (session_mode IN ('free_play', 'assignment', 'practice', 'challenge')),
    
    -- Session metadata
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER DEFAULT 0,
    
    -- Performance metrics
    final_score INTEGER DEFAULT 0,
    max_score_possible INTEGER DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    
    -- Game-specific data
    level_reached INTEGER DEFAULT 1,
    lives_used INTEGER DEFAULT 0,
    power_ups_used JSONB DEFAULT '[]',
    achievements_earned JSONB DEFAULT '[]',
    
    -- Learning metrics
    words_attempted INTEGER DEFAULT 0,
    words_correct INTEGER DEFAULT 0,
    unique_words_practiced INTEGER DEFAULT 0,
    average_response_time_ms INTEGER DEFAULT 0,
    
    -- Engagement metrics
    pause_count INTEGER DEFAULT 0,
    hint_requests INTEGER DEFAULT 0,
    retry_attempts INTEGER DEFAULT 0,
    
    -- Session data
    session_data JSONB DEFAULT '{}',
    device_info JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Word-level performance tracking
CREATE TABLE IF NOT EXISTS word_performance_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES enhanced_game_sessions(id) ON DELETE CASCADE,
    vocabulary_id INTEGER REFERENCES vocabulary(id) ON DELETE CASCADE,
    
    -- Word details
    word_text TEXT NOT NULL,
    translation_text TEXT NOT NULL,
    language_pair TEXT NOT NULL DEFAULT 'english_spanish',
    
    -- Performance data
    attempt_number INTEGER NOT NULL DEFAULT 1,
    response_time_ms INTEGER NOT NULL,
    was_correct BOOLEAN NOT NULL,
    confidence_level INTEGER CHECK (confidence_level BETWEEN 1 AND 5),
    
    -- Context
    difficulty_level TEXT NOT NULL,
    hint_used BOOLEAN DEFAULT FALSE,
    power_up_active TEXT,
    streak_count INTEGER DEFAULT 0,
    
    -- Learning data
    previous_attempts INTEGER DEFAULT 0,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
    
    -- Metadata
    context_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Real-time leaderboards
CREATE TABLE IF NOT EXISTS game_leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL,
    leaderboard_type TEXT NOT NULL CHECK (leaderboard_type IN ('daily', 'weekly', 'monthly', 'all_time', 'class')),
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    
    -- Ranking data
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rank_position INTEGER NOT NULL,
    score INTEGER NOT NULL,
    accuracy DECIMAL(5,2) NOT NULL,
    
    -- Time period
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Metadata
    games_played INTEGER DEFAULT 1,
    total_time_played INTEGER DEFAULT 0,
    achievements_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(game_type, leaderboard_type, class_id, student_id, period_start)
);

-- Achievement system
CREATE TABLE IF NOT EXISTS student_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_category TEXT NOT NULL CHECK (achievement_category IN ('performance', 'consistency', 'improvement', 'social', 'milestone')),
    
    -- Achievement details
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    points_awarded INTEGER DEFAULT 0,
    
    -- Context
    game_type TEXT,
    session_id UUID REFERENCES enhanced_game_sessions(id) ON DELETE SET NULL,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    
    -- Achievement data
    progress_data JSONB DEFAULT '{}',
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ENHANCED ASSIGNMENT SYSTEM
-- =====================================================

-- Assignment templates for reusable configurations
CREATE TABLE IF NOT EXISTS assignment_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Template details
    name TEXT NOT NULL,
    description TEXT,
    game_type TEXT NOT NULL,

    -- Configuration
    default_config JSONB NOT NULL DEFAULT '{}',
    vocabulary_list_id UUID REFERENCES custom_wordlists(id) ON DELETE SET NULL,

    -- Settings
    estimated_duration INTEGER DEFAULT 15, -- minutes
    difficulty_level TEXT DEFAULT 'intermediate',
    max_attempts INTEGER DEFAULT 3,

    -- Metadata
    usage_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT FALSE,
    tags TEXT[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced assignment progress with detailed tracking
CREATE TABLE IF NOT EXISTS enhanced_assignment_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Progress tracking
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue', 'submitted')),
    attempts_count INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 3,

    -- Performance metrics
    best_score INTEGER DEFAULT 0,
    best_accuracy DECIMAL(5,2) DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- seconds
    average_session_time INTEGER DEFAULT 0,

    -- Learning analytics
    words_mastered INTEGER DEFAULT 0,
    words_struggling INTEGER DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,
    consistency_score DECIMAL(5,2) DEFAULT 0,

    -- Timestamps
    first_attempt_at TIMESTAMP WITH TIME ZONE,
    last_attempt_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE,

    -- Feedback
    teacher_feedback TEXT,
    auto_feedback JSONB DEFAULT '{}',
    student_reflection TEXT,

    -- Metadata
    session_ids UUID[] DEFAULT '{}',
    progress_data JSONB DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(assignment_id, student_id)
);

-- Assignment analytics for teachers
CREATE TABLE IF NOT EXISTS assignment_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,

    -- Class performance
    total_students INTEGER NOT NULL DEFAULT 0,
    students_started INTEGER DEFAULT 0,
    students_completed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,

    -- Performance metrics
    average_score DECIMAL(5,2) DEFAULT 0,
    average_accuracy DECIMAL(5,2) DEFAULT 0,
    average_time_spent INTEGER DEFAULT 0,

    -- Difficulty analysis
    difficulty_rating DECIMAL(3,2) DEFAULT 0, -- 1-5 scale
    words_causing_difficulty TEXT[] DEFAULT '{}',
    common_mistakes JSONB DEFAULT '{}',

    -- Engagement metrics
    average_attempts DECIMAL(3,2) DEFAULT 0,
    dropout_rate DECIMAL(5,2) DEFAULT 0,
    help_requests INTEGER DEFAULT 0,

    -- Time analysis
    peak_activity_hours INTEGER[] DEFAULT '{}',
    average_session_length INTEGER DEFAULT 0,

    -- Last updated
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(assignment_id)
);

-- =====================================================
-- GAMIFICATION SYSTEM
-- =====================================================

-- Student profiles with gamification data
CREATE TABLE IF NOT EXISTS student_game_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Experience and levels
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    xp_to_next_level INTEGER DEFAULT 100,

    -- Streaks and consistency
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,

    -- Game statistics
    total_games_played INTEGER DEFAULT 0,
    total_time_played INTEGER DEFAULT 0, -- seconds
    favorite_game_type TEXT,

    -- Achievement counts
    total_achievements INTEGER DEFAULT 0,
    rare_achievements INTEGER DEFAULT 0,
    epic_achievements INTEGER DEFAULT 0,
    legendary_achievements INTEGER DEFAULT 0,

    -- Learning metrics
    words_learned INTEGER DEFAULT 0,
    accuracy_average DECIMAL(5,2) DEFAULT 0,
    improvement_rate DECIMAL(5,2) DEFAULT 0,

    -- Social features
    friends_count INTEGER DEFAULT 0,
    challenges_won INTEGER DEFAULT 0,
    challenges_lost INTEGER DEFAULT 0,

    -- Preferences
    preferred_difficulty TEXT DEFAULT 'intermediate',
    preferred_language_pair TEXT DEFAULT 'english_spanish',
    notification_preferences JSONB DEFAULT '{}',

    -- Profile customization
    avatar_url TEXT,
    display_name TEXT,
    title TEXT, -- earned title like "Word Master"
    badge_showcase UUID[] DEFAULT '{}', -- achievement IDs to display

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(student_id)
);

-- Daily challenges system
CREATE TABLE IF NOT EXISTS daily_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Challenge details
    challenge_date DATE NOT NULL,
    challenge_type TEXT NOT NULL,
    game_type TEXT NOT NULL,

    -- Configuration
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    difficulty_level TEXT NOT NULL,
    target_metric TEXT NOT NULL, -- 'score', 'accuracy', 'speed', etc.
    target_value INTEGER NOT NULL,

    -- Rewards
    xp_reward INTEGER DEFAULT 50,
    achievement_id UUID REFERENCES student_achievements(id) ON DELETE SET NULL,

    -- Metadata
    participation_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(challenge_date, challenge_type)
);

-- Student challenge participation
CREATE TABLE IF NOT EXISTS student_challenge_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Progress tracking
    status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'failed')),
    current_value INTEGER DEFAULT 0,
    best_attempt INTEGER DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,

    -- Completion details
    completed_at TIMESTAMP WITH TIME ZONE,
    completion_time INTEGER, -- seconds taken to complete

    -- Rewards earned
    xp_earned INTEGER DEFAULT 0,
    achievements_earned UUID[] DEFAULT '{}',

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(challenge_id, student_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Enhanced game sessions indexes
CREATE INDEX IF NOT EXISTS idx_enhanced_game_sessions_student_id ON enhanced_game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_game_sessions_assignment_id ON enhanced_game_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_game_sessions_game_type ON enhanced_game_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_game_sessions_started_at ON enhanced_game_sessions(started_at);
CREATE INDEX IF NOT EXISTS idx_enhanced_game_sessions_session_mode ON enhanced_game_sessions(session_mode);

-- Word performance logs indexes
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_session_id ON word_performance_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_vocabulary_id ON word_performance_logs(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_timestamp ON word_performance_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_word_performance_logs_was_correct ON word_performance_logs(was_correct);

-- Leaderboards indexes
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_game_type ON game_leaderboards(game_type);
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_leaderboard_type ON game_leaderboards(leaderboard_type);
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_class_id ON game_leaderboards(class_id);
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_period ON game_leaderboards(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_game_leaderboards_rank ON game_leaderboards(rank_position);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_student_achievements_student_id ON student_achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_type ON student_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_student_achievements_category ON student_achievements(achievement_category);
CREATE INDEX IF NOT EXISTS idx_student_achievements_earned_at ON student_achievements(earned_at);

-- Assignment progress indexes
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_assignment_id ON enhanced_assignment_progress(assignment_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_student_id ON enhanced_assignment_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_assignment_progress_status ON enhanced_assignment_progress(status);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_enhanced_game_sessions_updated_at
    BEFORE UPDATE ON enhanced_game_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_templates_updated_at
    BEFORE UPDATE ON assignment_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_enhanced_assignment_progress_updated_at
    BEFORE UPDATE ON enhanced_assignment_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignment_analytics_updated_at
    BEFORE UPDATE ON assignment_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_game_profiles_updated_at
    BEFORE UPDATE ON student_game_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_challenge_progress_updated_at
    BEFORE UPDATE ON student_challenge_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE enhanced_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_performance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_leaderboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_assignment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_challenge_progress ENABLE ROW LEVEL SECURITY;
