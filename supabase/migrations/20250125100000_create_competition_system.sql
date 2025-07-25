-- ============================================================================
-- COMPETITION AND LEADERBOARD SYSTEM
-- ============================================================================
-- This migration creates a comprehensive competition system with cross-game
-- leaderboards, competitions, and enhanced student profiles.

-- ============================================================================
-- 1. COMPETITIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly', 'special')),
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    
    -- Time period
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Rules
    game_types TEXT[] NOT NULL DEFAULT '{}',
    scoring_method TEXT NOT NULL DEFAULT 'total_points' CHECK (scoring_method IN ('total_points', 'best_score', 'average_score', 'improvement')),
    min_games_required INTEGER NOT NULL DEFAULT 1,
    
    -- Rewards configuration
    rewards JSONB DEFAULT '[]',
    
    -- Participation
    participant_count INTEGER DEFAULT 0,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    is_public BOOLEAN NOT NULL DEFAULT true,
    
    -- Metadata
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for competitions
CREATE INDEX IF NOT EXISTS idx_competitions_status ON competitions(status);
CREATE INDEX IF NOT EXISTS idx_competitions_type ON competitions(type);
CREATE INDEX IF NOT EXISTS idx_competitions_class_id ON competitions(class_id);
CREATE INDEX IF NOT EXISTS idx_competitions_start_date ON competitions(start_date);
CREATE INDEX IF NOT EXISTS idx_competitions_end_date ON competitions(end_date);
CREATE INDEX IF NOT EXISTS idx_competitions_public ON competitions(is_public);

-- ============================================================================
-- 2. COMPETITION ENTRIES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS competition_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID NOT NULL REFERENCES competitions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Performance metrics
    total_score INTEGER NOT NULL DEFAULT 0,
    games_played INTEGER NOT NULL DEFAULT 0,
    average_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    improvement_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    
    -- Ranking
    current_rank INTEGER NOT NULL DEFAULT 1,
    previous_rank INTEGER,
    rank_change INTEGER NOT NULL DEFAULT 0,
    
    -- Game breakdown
    game_performances JSONB DEFAULT '{}',
    
    -- Timestamps
    joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(competition_id, student_id)
);

-- Create indexes for competition entries
CREATE INDEX IF NOT EXISTS idx_competition_entries_competition_id ON competition_entries(competition_id);
CREATE INDEX IF NOT EXISTS idx_competition_entries_student_id ON competition_entries(student_id);
CREATE INDEX IF NOT EXISTS idx_competition_entries_rank ON competition_entries(current_rank);
CREATE INDEX IF NOT EXISTS idx_competition_entries_score ON competition_entries(total_score);

-- ============================================================================
-- 3. CROSS-GAME LEADERBOARD VIEWS
-- ============================================================================

-- Create a view for cross-game leaderboard data
CREATE OR REPLACE VIEW cross_game_leaderboard AS
SELECT 
    sgp.id,
    sgp.student_id,
    COALESCE(sgp.display_name, CONCAT(up.first_name, ' ', up.last_name), u.email, 'Unknown Student') as student_name,
    sgp.avatar_url,
    sgp.title,
    
    -- Experience and levels
    sgp.total_xp,
    sgp.current_level,
    sgp.xp_to_next_level,
    
    -- Cross-game statistics
    (sgp.total_xp + (sgp.total_achievements * 50)) as total_points,
    sgp.total_games_played,
    sgp.total_time_played,
    sgp.accuracy_average,
    sgp.words_learned,
    
    -- Streaks and consistency
    sgp.current_streak,
    sgp.longest_streak,
    sgp.last_activity_date,
    
    -- Achievements
    sgp.total_achievements,
    sgp.rare_achievements,
    sgp.epic_achievements,
    sgp.legendary_achievements,
    
    -- Social features
    sgp.friends_count,
    sgp.challenges_won,
    sgp.challenges_lost,
    
    -- Profile customization
    sgp.badge_showcase,
    
    -- Metadata
    sgp.created_at,
    sgp.updated_at,
    
    -- Ranking (calculated)
    ROW_NUMBER() OVER (ORDER BY (sgp.total_xp + (sgp.total_achievements * 50)) DESC) as overall_rank
    
FROM student_game_profiles sgp
LEFT JOIN auth.users u ON sgp.student_id = u.id
LEFT JOIN user_profiles up ON sgp.student_id = up.user_id
ORDER BY total_points DESC;

-- ============================================================================
-- 4. DAILY CHALLENGES ENHANCEMENTS
-- ============================================================================

-- Add competition integration to daily challenges
ALTER TABLE daily_challenges 
ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_global BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS class_id UUID REFERENCES classes(id) ON DELETE CASCADE;

-- Create indexes for enhanced daily challenges
CREATE INDEX IF NOT EXISTS idx_daily_challenges_competition_id ON daily_challenges(competition_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_class_id ON daily_challenges(class_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_global ON daily_challenges(is_global);

-- ============================================================================
-- 5. LEADERBOARD SNAPSHOTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS leaderboard_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('daily', 'weekly', 'monthly', 'competition_end')),
    snapshot_date DATE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    
    -- Snapshot data
    leaderboard_data JSONB NOT NULL,
    participant_count INTEGER NOT NULL DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(snapshot_type, snapshot_date, class_id, competition_id)
);

-- Create indexes for leaderboard snapshots
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_type ON leaderboard_snapshots(snapshot_type);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_date ON leaderboard_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_class_id ON leaderboard_snapshots(class_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_snapshots_competition_id ON leaderboard_snapshots(competition_id);

-- ============================================================================
-- 6. STUDENT RANKING HISTORY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS student_ranking_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ranking_type TEXT NOT NULL CHECK (ranking_type IN ('overall', 'class', 'weekly', 'monthly', 'competition')),
    
    -- Ranking data
    rank_position INTEGER NOT NULL,
    total_points INTEGER NOT NULL,
    total_xp INTEGER NOT NULL,
    games_played INTEGER NOT NULL,
    accuracy_average DECIMAL(5,2) NOT NULL,
    
    -- Context
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    
    -- Time period
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    
    -- Metadata
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, ranking_type, period_start, class_id, competition_id)
);

-- Create indexes for ranking history
CREATE INDEX IF NOT EXISTS idx_ranking_history_student_id ON student_ranking_history(student_id);
CREATE INDEX IF NOT EXISTS idx_ranking_history_type ON student_ranking_history(ranking_type);
CREATE INDEX IF NOT EXISTS idx_ranking_history_period ON student_ranking_history(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_ranking_history_class_id ON student_ranking_history(class_id);
CREATE INDEX IF NOT EXISTS idx_ranking_history_competition_id ON student_ranking_history(competition_id);

-- ============================================================================
-- 7. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update competition participant count
CREATE OR REPLACE FUNCTION update_competition_participant_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE competitions 
        SET participant_count = participant_count + 1
        WHERE id = NEW.competition_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE competitions 
        SET participant_count = participant_count - 1
        WHERE id = OLD.competition_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for competition participant count
DROP TRIGGER IF EXISTS trigger_update_competition_participant_count ON competition_entries;
CREATE TRIGGER trigger_update_competition_participant_count
    AFTER INSERT OR DELETE ON competition_entries
    FOR EACH ROW EXECUTE FUNCTION update_competition_participant_count();

-- Function to update competition entry timestamps
CREATE OR REPLACE FUNCTION update_competition_entry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for competition entry updates
DROP TRIGGER IF EXISTS trigger_update_competition_entry_timestamp ON competition_entries;
CREATE TRIGGER trigger_update_competition_entry_timestamp
    BEFORE UPDATE ON competition_entries
    FOR EACH ROW EXECUTE FUNCTION update_competition_entry_timestamp();

-- Function to automatically update competition status based on dates
CREATE OR REPLACE FUNCTION update_competition_status()
RETURNS void AS $$
BEGIN
    -- Update competitions to active if start date has passed
    UPDATE competitions 
    SET status = 'active'
    WHERE status = 'upcoming' 
    AND start_date <= NOW();
    
    -- Update competitions to completed if end date has passed
    UPDATE competitions 
    SET status = 'completed'
    WHERE status = 'active' 
    AND end_date <= NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 8. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE competition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_ranking_history ENABLE ROW LEVEL SECURITY;

-- Policies for competitions
CREATE POLICY "Users can view public competitions and their class competitions" ON competitions
    FOR SELECT USING (
        is_public = true OR 
        class_id IN (
            SELECT class_id FROM class_students WHERE student_id = auth.uid()
        ) OR
        created_by = auth.uid()
    );

CREATE POLICY "Teachers can create competitions" ON competitions
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Teachers can update their own competitions" ON competitions
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Teachers can delete their own competitions" ON competitions
    FOR DELETE USING (created_by = auth.uid());

-- Policies for competition entries
CREATE POLICY "Students can view competition entries for their competitions" ON competition_entries
    FOR SELECT USING (
        competition_id IN (
            SELECT id FROM competitions 
            WHERE is_public = true OR 
            class_id IN (
                SELECT class_id FROM class_students WHERE student_id = auth.uid()
            )
        )
    );

CREATE POLICY "Students can manage their own competition entries" ON competition_entries
    FOR ALL USING (student_id = auth.uid());

-- Policies for leaderboard snapshots
CREATE POLICY "Users can view leaderboard snapshots for their context" ON leaderboard_snapshots
    FOR SELECT USING (
        class_id IN (
            SELECT class_id FROM class_students WHERE student_id = auth.uid()
        ) OR
        competition_id IN (
            SELECT id FROM competitions 
            WHERE is_public = true OR 
            class_id IN (
                SELECT class_id FROM class_students WHERE student_id = auth.uid()
            )
        )
    );

-- Policies for ranking history
CREATE POLICY "Students can view their own ranking history" ON student_ranking_history
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view ranking history for their students" ON student_ranking_history
    FOR SELECT USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

-- ============================================================================
-- 9. SAMPLE DATA
-- ============================================================================

-- Insert sample competitions
INSERT INTO competitions (
    title, description, type, status, start_date, end_date,
    game_types, scoring_method, min_games_required, rewards,
    is_public, created_by
) VALUES 
    (
        'Weekly Vocabulary Challenge',
        'Compete across all vocabulary games to earn the most points this week!',
        'weekly',
        'active',
        DATE_TRUNC('week', NOW()),
        DATE_TRUNC('week', NOW()) + INTERVAL '7 days',
        ARRAY['vocab-master', 'hangman', 'word-scramble', 'memory-game'],
        'total_points',
        3,
        '[
            {"rank": 1, "title": "Vocabulary Champion", "xp_bonus": 500, "badge_icon": "trophy"},
            {"rank": 2, "title": "Word Warrior", "xp_bonus": 300, "badge_icon": "medal"},
            {"rank": 3, "title": "Language Learner", "xp_bonus": 200, "badge_icon": "star"}
        ]'::jsonb,
        true,
        (SELECT id FROM auth.users WHERE email LIKE '%@%' LIMIT 1)
    ),
    (
        'Monthly Grammar Masters',
        'Show your grammar skills across sentence-building games!',
        'monthly',
        'upcoming',
        DATE_TRUNC('month', NOW()) + INTERVAL '1 month',
        DATE_TRUNC('month', NOW()) + INTERVAL '2 months',
        ARRAY['speed-builder', 'sentence-towers'],
        'average_score',
        5,
        '[
            {"rank": 1, "title": "Grammar Guru", "xp_bonus": 1000, "badge_icon": "crown"},
            {"rank": 2, "title": "Sentence Specialist", "xp_bonus": 600, "badge_icon": "gem"},
            {"rank": 3, "title": "Grammar Guide", "xp_bonus": 400, "badge_icon": "shield"}
        ]'::jsonb,
        true,
        (SELECT id FROM auth.users WHERE email LIKE '%@%' LIMIT 1)
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Add comments to track migration
COMMENT ON TABLE competitions IS 'Competition system for cross-game challenges and events. Created: 2025-01-25';
COMMENT ON TABLE competition_entries IS 'Individual student entries in competitions with performance tracking. Created: 2025-01-25';
COMMENT ON VIEW cross_game_leaderboard IS 'Comprehensive cross-game leaderboard view with rankings and statistics. Created: 2025-01-25';
COMMENT ON TABLE leaderboard_snapshots IS 'Historical snapshots of leaderboard states for analysis. Created: 2025-01-25';
COMMENT ON TABLE student_ranking_history IS 'Historical tracking of student rankings across different contexts. Created: 2025-01-25';
