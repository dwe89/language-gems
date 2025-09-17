-- Create B2C Learner System Tables
-- These tables support independent learners (B2C) separate from school students (B2B)

-- Learner Preferences Table
CREATE TABLE IF NOT EXISTS learner_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_languages TEXT[] DEFAULT ARRAY['spanish'],
  daily_goal INTEGER DEFAULT 10,
  difficulty_level TEXT DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  study_reminders BOOLEAN DEFAULT true,
  reminder_time TIME DEFAULT '18:00:00',
  weekend_reminders BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learner Progress Table
CREATE TABLE IF NOT EXISTS learner_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learning Paths Table (for structured learning journeys)
CREATE TABLE IF NOT EXISTS learning_paths (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  total_words INTEGER DEFAULT 0,
  estimated_hours INTEGER DEFAULT 0,
  curriculum_type TEXT DEFAULT 'gcse' CHECK (curriculum_type IN ('gcse', 'general', 'business', 'travel')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learner Path Progress Table
CREATE TABLE IF NOT EXISTS learner_path_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
  words_completed INTEGER DEFAULT 0,
  progress_percentage DECIMAL(5,2) DEFAULT 0.00,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  UNIQUE(user_id, path_id)
);

-- Daily Challenges Table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_date DATE NOT NULL,
  challenge_type TEXT NOT NULL CHECK (challenge_type IN ('vocabulary', 'streak', 'accuracy', 'speed', 'games')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  target_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 50,
  language TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(challenge_date, challenge_type)
);

-- Learner Challenge Progress Table
CREATE TABLE IF NOT EXISTS learner_challenge_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- Learner Achievements Table
CREATE TABLE IF NOT EXISTS learner_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT DEFAULT 'trophy',
  category TEXT NOT NULL CHECK (category IN ('vocabulary', 'streak', 'games', 'progress', 'special')),
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('total', 'streak', 'single_session', 'accuracy')),
  requirement_value INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 100,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Learner Achievement Progress Table
CREATE TABLE IF NOT EXISTS learner_achievement_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES learner_achievements(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Learner Study Sessions Table (for tracking independent study)
CREATE TABLE IF NOT EXISTS learner_study_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL CHECK (session_type IN ('game', 'vocabulary', 'challenge', 'free_study')),
  game_type TEXT,
  language TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  words_practiced INTEGER DEFAULT 0,
  words_learned INTEGER DEFAULT 0,
  accuracy_percentage DECIMAL(5,2),
  xp_earned INTEGER DEFAULT 0,
  session_data JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Insert default learning paths
INSERT INTO learning_paths (name, description, language, difficulty_level, total_words, estimated_hours, curriculum_type) VALUES
('GCSE Spanish Foundation', 'Complete foundation tier Spanish vocabulary for GCSE exams', 'spanish', 'beginner', 1200, 40, 'gcse'),
('GCSE Spanish Higher', 'Advanced Spanish vocabulary for higher tier GCSE exams', 'spanish', 'intermediate', 2000, 60, 'gcse'),
('GCSE French Foundation', 'Complete foundation tier French vocabulary for GCSE exams', 'french', 'beginner', 1100, 38, 'gcse'),
('GCSE French Higher', 'Advanced French vocabulary for higher tier GCSE exams', 'french', 'intermediate', 1800, 55, 'gcse'),
('GCSE German Foundation', 'Complete foundation tier German vocabulary for GCSE exams', 'german', 'beginner', 1000, 35, 'gcse'),
('GCSE German Higher', 'Advanced German vocabulary for higher tier GCSE exams', 'german', 'intermediate', 1600, 50, 'gcse');

-- Insert sample achievements
INSERT INTO learner_achievements (name, description, category, requirement_type, requirement_value, xp_reward) VALUES
('First Steps', 'Learn your first 10 words', 'vocabulary', 'total', 10, 50),
('Vocabulary Builder', 'Learn 100 words', 'vocabulary', 'total', 100, 200),
('Word Master', 'Learn 500 words', 'vocabulary', 'total', 500, 500),
('Vocabulary Expert', 'Learn 1000 words', 'vocabulary', 'total', 1000, 1000),
('Streak Starter', 'Maintain a 3-day learning streak', 'streak', 'streak', 3, 100),
('Consistent Learner', 'Maintain a 7-day learning streak', 'streak', 'streak', 7, 250),
('Dedication Master', 'Maintain a 30-day learning streak', 'streak', 'streak', 30, 1000),
('Game Explorer', 'Play 5 different games', 'games', 'total', 5, 150),
('Gaming Pro', 'Play 100 game sessions', 'games', 'total', 100, 500),
('Perfect Score', 'Achieve 100% accuracy in a game session', 'games', 'accuracy', 100, 200);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_learner_preferences_user_id ON learner_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_progress_user_id ON learner_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_path_progress_user_id ON learner_path_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_path_progress_path_id ON learner_path_progress(path_id);
CREATE INDEX IF NOT EXISTS idx_daily_challenges_date ON daily_challenges(challenge_date);
CREATE INDEX IF NOT EXISTS idx_learner_challenge_progress_user_id ON learner_challenge_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_achievement_progress_user_id ON learner_achievement_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_study_sessions_user_id ON learner_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_learner_study_sessions_started_at ON learner_study_sessions(started_at);

-- Enable Row Level Security
ALTER TABLE learner_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_path_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_challenge_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_achievement_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_study_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Learners can only access their own data
CREATE POLICY "Learners can view their own preferences" ON learner_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can update their own preferences" ON learner_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own preferences" ON learner_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners can view their own progress" ON learner_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can update their own progress" ON learner_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own progress" ON learner_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Learning paths are public (read-only for learners)
CREATE POLICY "Learning paths are viewable by everyone" ON learning_paths FOR SELECT USING (true);

CREATE POLICY "Learners can view their own path progress" ON learner_path_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can update their own path progress" ON learner_path_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own path progress" ON learner_path_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily challenges are public (read-only)
CREATE POLICY "Daily challenges are viewable by everyone" ON daily_challenges FOR SELECT USING (true);

CREATE POLICY "Learners can view their own challenge progress" ON learner_challenge_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can update their own challenge progress" ON learner_challenge_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own challenge progress" ON learner_challenge_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Achievements are public (read-only)
CREATE POLICY "Achievements are viewable by everyone" ON learner_achievements FOR SELECT USING (true);

CREATE POLICY "Learners can view their own achievement progress" ON learner_achievement_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can update their own achievement progress" ON learner_achievement_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own achievement progress" ON learner_achievement_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Learners can view their own study sessions" ON learner_study_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Learners can insert their own study sessions" ON learner_study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners can update their own study sessions" ON learner_study_sessions FOR UPDATE USING (auth.uid() = user_id);

-- Create functions for automatic updates
CREATE OR REPLACE FUNCTION update_learner_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_learner_preferences_updated_at
  BEFORE UPDATE ON learner_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_learner_progress_updated_at();

CREATE TRIGGER update_learner_progress_updated_at
  BEFORE UPDATE ON learner_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_learner_progress_updated_at();
