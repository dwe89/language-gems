-- ============================================================================
-- YOUTUBE VIDEO LEARNING SYSTEM MIGRATION
-- Adds YouTube video-based learning capabilities to Language Gems
-- Integrates with existing vocabulary and game systems
-- ============================================================================

-- YouTube videos table
CREATE TABLE IF NOT EXISTS youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    youtube_id TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    description TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    is_premium BOOLEAN DEFAULT false,
    vocabulary_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Curriculum integration
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
    theme TEXT, -- Links to existing vocabulary themes
    topic TEXT, -- Links to existing vocabulary topics
    
    -- Content metadata
    transcript TEXT, -- Video transcript/lyrics
    transcript_translation TEXT, -- English translation
    difficulty_score INTEGER DEFAULT 50 CHECK (difficulty_score BETWEEN 1 AND 100),
    
    -- Status and visibility
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video vocabulary mapping - links videos to centralized vocabulary
CREATE TABLE IF NOT EXISTS video_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES centralized_vocabulary(id) ON DELETE CASCADE,
    
    -- Timing and context
    timestamp_seconds INTEGER, -- When word appears in video
    context_text TEXT, -- Surrounding text/lyrics where word appears
    emphasis_level TEXT DEFAULT 'normal' CHECK (emphasis_level IN ('low', 'normal', 'high')),
    
    -- Learning metadata
    difficulty_contribution INTEGER DEFAULT 0, -- How much this word contributes to video difficulty
    is_key_vocabulary BOOLEAN DEFAULT false, -- Whether this is a key learning word for the video
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, vocabulary_id)
);

-- Video progress tracking - integrates with existing progress system
CREATE TABLE IF NOT EXISTS video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    
    -- Progress metrics
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
    completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_watch_time_seconds INTEGER DEFAULT 0,
    
    -- Learning metrics
    vocabulary_learned_count INTEGER DEFAULT 0,
    quiz_attempts INTEGER DEFAULT 0,
    quiz_best_score INTEGER DEFAULT 0,
    
    -- Session data
    session_data JSONB DEFAULT '{}', -- Store detailed session information
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);

-- Video-based game sessions - extends existing game session system
CREATE TABLE IF NOT EXISTS video_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL, -- 'video_vocabulary', 'lyric_completion', 'video_quiz', etc.
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    
    -- Performance metrics
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Gems integration (consistent with existing system)
    gems_earned INTEGER DEFAULT 0,
    gems_by_rarity JSONB DEFAULT '{"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}',
    
    -- Video-specific metrics
    vocabulary_words_practiced INTEGER DEFAULT 0,
    vocabulary_words_correct INTEGER DEFAULT 0,
    video_segments_completed INTEGER DEFAULT 0,
    
    -- Session data
    session_data JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video quiz questions - for comprehension testing
CREATE TABLE IF NOT EXISTS video_quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    
    -- Question content
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false', 'fill_blank', 'vocabulary_match')),
    correct_answer TEXT NOT NULL,
    options JSONB, -- For multiple choice questions
    
    -- Timing and context
    timestamp_seconds INTEGER, -- When in video this question relates to
    context_text TEXT, -- Video context for the question
    
    -- Difficulty and metadata
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    points INTEGER DEFAULT 1,
    explanation TEXT, -- Explanation of correct answer
    
    -- Ordering and status
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_youtube_videos_language ON youtube_videos(language);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_level ON youtube_videos(level);
CREATE INDEX IF NOT EXISTS idx_youtube_videos_active ON youtube_videos(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_video_vocabulary_video_id ON video_vocabulary(video_id);
CREATE INDEX IF NOT EXISTS idx_video_vocabulary_vocabulary_id ON video_vocabulary(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_video_game_sessions_student_id ON video_game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_video_game_sessions_video_id ON video_game_sessions(video_id);
CREATE INDEX IF NOT EXISTS idx_video_quiz_questions_video_id ON video_quiz_questions(video_id);

-- RLS Policies
ALTER TABLE youtube_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_quiz_questions ENABLE ROW LEVEL SECURITY;

-- Public read access to videos and questions
CREATE POLICY "Public read access to active videos" ON youtube_videos
    FOR SELECT USING (is_active = true);

CREATE POLICY "Public read access to video vocabulary" ON video_vocabulary
    FOR SELECT USING (true);

CREATE POLICY "Public read access to video quiz questions" ON video_quiz_questions
    FOR SELECT USING (is_active = true);

-- User-specific access to progress and sessions
CREATE POLICY "Users can manage their own video progress" ON video_progress
    FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own video game sessions" ON video_game_sessions
    FOR ALL USING (student_id = auth.uid());

-- Admin/teacher access for content management
CREATE POLICY "Admins can manage videos" ON youtube_videos
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'teacher')
        )
    );

CREATE POLICY "Admins can manage video quiz questions" ON video_quiz_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('admin', 'teacher')
        )
    );

-- Update triggers
CREATE OR REPLACE FUNCTION update_youtube_video_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_youtube_videos_timestamp
    BEFORE UPDATE ON youtube_videos
    FOR EACH ROW
    EXECUTE FUNCTION update_youtube_video_timestamp();

CREATE TRIGGER update_video_progress_timestamp
    BEFORE UPDATE ON video_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_youtube_video_timestamp();

CREATE TRIGGER update_video_game_sessions_timestamp
    BEFORE UPDATE ON video_game_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_youtube_video_timestamp();

CREATE TRIGGER update_video_quiz_questions_timestamp
    BEFORE UPDATE ON video_quiz_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_youtube_video_timestamp();

-- Comments for documentation
COMMENT ON TABLE youtube_videos IS 'YouTube videos for language learning with metadata and curriculum integration';
COMMENT ON TABLE video_vocabulary IS 'Maps vocabulary words to specific videos with timing and context';
COMMENT ON TABLE video_progress IS 'Tracks user progress through videos including watch time and completion';
COMMENT ON TABLE video_game_sessions IS 'Game sessions based on video content, integrated with gems system';
COMMENT ON TABLE video_quiz_questions IS 'Comprehension questions for videos with timing and difficulty';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'YouTube Video Learning System migration completed successfully!';
    RAISE NOTICE 'Tables created: youtube_videos, video_vocabulary, video_progress, video_game_sessions, video_quiz_questions';
    RAISE NOTICE 'Ready for LingoSongs content migration and integration with Language Gems games system.';
END $$;
