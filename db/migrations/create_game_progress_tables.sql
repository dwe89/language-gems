-- Create the games table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  difficulty INTEGER DEFAULT 1,
  max_players INTEGER DEFAULT 1,
  estimated_time TEXT,
  theme_color TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  config JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the name for faster searching
CREATE INDEX IF NOT EXISTS games_name_idx ON public.games (name);

-- Create the game_progress table to track player progress
CREATE TABLE IF NOT EXISTS public.game_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  accuracy FLOAT,
  completion_time INTEGER,
  level INTEGER,
  metadata JSONB,
  played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, game_id, played_at)
);

-- Create indexes for faster querying
CREATE INDEX IF NOT EXISTS game_progress_user_id_idx ON public.game_progress (user_id);
CREATE INDEX IF NOT EXISTS game_progress_game_id_idx ON public.game_progress (game_id);
CREATE INDEX IF NOT EXISTS game_progress_played_at_idx ON public.game_progress (played_at DESC);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_games_modtime
    BEFORE UPDATE ON public.games
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create Row Level Security policies
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;

-- Games table policies
CREATE POLICY "Games are viewable by everyone" 
ON public.games FOR SELECT 
TO authenticated, anon
USING (true);

CREATE POLICY "Games can be created by admin users" 
ON public.games FOR INSERT 
TO authenticated
WITH CHECK (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('admin', 'teacher'));

CREATE POLICY "Games can be updated by admin users" 
ON public.games FOR UPDATE 
TO authenticated
USING (auth.jwt() ? 'role' AND auth.jwt()->>'role' IN ('admin', 'teacher'));

-- Game progress policies
CREATE POLICY "Users can view their own game progress" 
ON public.game_progress FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student progress" 
ON public.game_progress FOR SELECT 
TO authenticated
USING (
  auth.jwt() ? 'role' AND 
  auth.jwt()->>'role' IN ('admin', 'teacher')
);

CREATE POLICY "Users can insert their own game progress" 
ON public.game_progress FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Insert some sample games
INSERT INTO public.games (name, description, thumbnail_url, difficulty, max_players, estimated_time, theme_color, is_new, is_featured)
VALUES 
('Word Clicker', 'Click the button as many times as you can in 10 seconds!', '/games/vocab-match.jpg', 1, 1, '10 sec', 'text-blue-500', true, false),
('Vocabulary Match', 'Match the words with their meanings as quickly as possible', '/games/vocab-match.jpg', 2, 1, '5 min', 'text-green-500', false, true),
('Grammar Quest', 'Test your grammar knowledge in this adventure game', '/games/grammar-quest.jpg', 3, 1, '10 min', 'text-purple-500', false, false),
('Word Battle', 'Challenge your friends to a vocabulary battle', '/games/word-battle.jpg', 2, 4, '15 min', 'text-red-500', false, false),
('Speed Translation', 'Translate phrases as quickly as possible', '/games/speed-translation.jpg', 3, 1, '5 min', 'text-yellow-500', true, true)
ON CONFLICT (id) DO NOTHING; 