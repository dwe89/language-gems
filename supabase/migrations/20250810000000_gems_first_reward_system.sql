-- ============================================================================
-- GEMS-FIRST REWARD SYSTEM MIGRATION
-- Adds gem tracking to sessions and creates unified reward architecture
-- ============================================================================

-- Add gems tracking to enhanced_game_sessions
ALTER TABLE enhanced_game_sessions 
ADD COLUMN IF NOT EXISTS gems_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS gems_by_rarity JSONB DEFAULT '{"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}',
ADD COLUMN IF NOT EXISTS gem_events_count INTEGER DEFAULT 0;

-- Create gem_events table for detailed audit trail
CREATE TABLE IF NOT EXISTS gem_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES enhanced_game_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Gem details
    gem_rarity TEXT NOT NULL CHECK (gem_rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    xp_value INTEGER NOT NULL,
    
    -- Performance context (support both legacy and new vocabulary systems)
    vocabulary_id INTEGER REFERENCES vocabulary(id) ON DELETE SET NULL,
    centralized_vocabulary_id UUID REFERENCES centralized_vocabulary(id) ON DELETE SET NULL,
    word_text TEXT,
    translation_text TEXT,
    response_time_ms INTEGER,
    streak_count INTEGER DEFAULT 0,
    hint_used BOOLEAN DEFAULT FALSE,
    
    -- Game context
    game_type TEXT NOT NULL,
    game_mode TEXT,
    difficulty_level TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_gem_events_session_id ON gem_events(session_id);
CREATE INDEX IF NOT EXISTS idx_gem_events_student_id ON gem_events(student_id);
CREATE INDEX IF NOT EXISTS idx_gem_events_created_at ON gem_events(created_at);
CREATE INDEX IF NOT EXISTS idx_gem_events_gem_rarity ON gem_events(gem_rarity);

-- Add RLS policies
ALTER TABLE gem_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own gem events" ON gem_events
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own gem events" ON gem_events
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- Create function to update session gems from events
CREATE OR REPLACE FUNCTION update_session_gems_from_events()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the session's gem totals
    UPDATE enhanced_game_sessions 
    SET 
        gems_total = (
            SELECT COUNT(*) 
            FROM gem_events 
            WHERE session_id = NEW.session_id
        ),
        gems_by_rarity = (
            SELECT jsonb_build_object(
                'common', COALESCE(SUM(CASE WHEN gem_rarity = 'common' THEN 1 ELSE 0 END), 0),
                'uncommon', COALESCE(SUM(CASE WHEN gem_rarity = 'uncommon' THEN 1 ELSE 0 END), 0),
                'rare', COALESCE(SUM(CASE WHEN gem_rarity = 'rare' THEN 1 ELSE 0 END), 0),
                'epic', COALESCE(SUM(CASE WHEN gem_rarity = 'epic' THEN 1 ELSE 0 END), 0),
                'legendary', COALESCE(SUM(CASE WHEN gem_rarity = 'legendary' THEN 1 ELSE 0 END), 0)
            )
            FROM gem_events 
            WHERE session_id = NEW.session_id
        ),
        gem_events_count = (
            SELECT COUNT(*) 
            FROM gem_events 
            WHERE session_id = NEW.session_id
        ),
        -- Update XP to match gem values
        xp_earned = (
            SELECT COALESCE(SUM(xp_value), 0)
            FROM gem_events 
            WHERE session_id = NEW.session_id
        )
    WHERE id = NEW.session_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update session gems
CREATE TRIGGER trigger_update_session_gems
    AFTER INSERT ON gem_events
    FOR EACH ROW
    EXECUTE FUNCTION update_session_gems_from_events();

-- Add mastery level capping to vocabulary_gem_collection for anti-grinding
ALTER TABLE vocabulary_gem_collection 
ADD COLUMN IF NOT EXISTS max_gem_rarity TEXT DEFAULT 'legendary' CHECK (max_gem_rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary'));

-- Function to determine max gem rarity based on mastery level
CREATE OR REPLACE FUNCTION get_max_gem_rarity_for_mastery(mastery_level INTEGER)
RETURNS TEXT AS $$
BEGIN
    CASE mastery_level
        WHEN 0, 1 THEN RETURN 'rare';      -- New/learning words capped at rare
        WHEN 2, 3 THEN RETURN 'epic';      -- Practiced words can get epic
        WHEN 4, 5 THEN RETURN 'legendary'; -- Mastered words can get legendary
        ELSE RETURN 'legendary';
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update existing records to set max_gem_rarity based on current mastery
UPDATE vocabulary_gem_collection 
SET max_gem_rarity = get_max_gem_rarity_for_mastery(mastery_level);

-- Create view for unified gem analytics
CREATE OR REPLACE VIEW student_gem_analytics AS
SELECT 
    s.student_id,
    s.game_type,
    COUNT(*) as total_sessions,
    SUM(s.gems_total) as total_gems_earned,
    SUM((s.gems_by_rarity->>'common')::integer) as common_gems,
    SUM((s.gems_by_rarity->>'uncommon')::integer) as uncommon_gems,
    SUM((s.gems_by_rarity->>'rare')::integer) as rare_gems,
    SUM((s.gems_by_rarity->>'epic')::integer) as epic_gems,
    SUM((s.gems_by_rarity->>'legendary')::integer) as legendary_gems,
    SUM(s.xp_earned) as total_xp_from_gems,
    AVG(s.accuracy_percentage) as avg_accuracy,
    DATE_TRUNC('week', s.started_at) as week_start
FROM enhanced_game_sessions s
WHERE s.gems_total > 0
GROUP BY s.student_id, s.game_type, DATE_TRUNC('week', s.started_at);

-- Grant permissions
GRANT SELECT ON student_gem_analytics TO authenticated;

-- Comment the migration
COMMENT ON TABLE gem_events IS 'Detailed audit trail of all gem awards with performance context';
COMMENT ON COLUMN enhanced_game_sessions.gems_total IS 'Total gems earned in this session (1 per correct action)';
COMMENT ON COLUMN enhanced_game_sessions.gems_by_rarity IS 'Breakdown of gems by rarity level';
COMMENT ON COLUMN vocabulary_gem_collection.max_gem_rarity IS 'Maximum gem rarity this word can award based on mastery level';
