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

-- Create vocabulary lists table
CREATE TABLE IF NOT EXISTS public.vocabulary_lists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  theme_id TEXT NOT NULL,
  topic_id TEXT,
  difficulty INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vocabulary items table
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  list_id UUID REFERENCES public.vocabulary_lists(id) ON DELETE CASCADE,
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  image_url TEXT,
  audio_url TEXT,
  example_sentence TEXT,
  example_translation TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student vocabulary progress table
CREATE TABLE IF NOT EXISTS public.student_vocabulary_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_item_id UUID NOT NULL REFERENCES public.vocabulary_items(id) ON DELETE CASCADE,
  proficiency_level INTEGER DEFAULT 0, -- 0: Unknown, 1: Seen, 2: Recognized, 3: Practiced, 4: Mastered, 5: Expert
  correct_answers INTEGER DEFAULT 0,
  incorrect_answers INTEGER DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE,
  next_review TIMESTAMP WITH TIME ZONE, -- For spaced repetition
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (student_id, vocabulary_item_id)
);

-- Create class vocabulary assignment table
CREATE TABLE IF NOT EXISTS public.class_vocabulary_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  vocabulary_list_id UUID NOT NULL REFERENCES public.vocabulary_lists(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (class_id, vocabulary_list_id)
);

-- Create trigger for vocabulary_lists
CREATE TRIGGER update_vocabulary_lists_modtime
    BEFORE UPDATE ON public.vocabulary_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create trigger for vocabulary_items
CREATE TRIGGER update_vocabulary_items_modtime
    BEFORE UPDATE ON public.vocabulary_items
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create trigger for student_vocabulary_progress
CREATE TRIGGER update_student_vocabulary_progress_modtime
    BEFORE UPDATE ON public.student_vocabulary_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Create trigger for class_vocabulary_assignments
CREATE TRIGGER update_class_vocabulary_assignments_modtime
    BEFORE UPDATE ON public.class_vocabulary_assignments
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column(); 