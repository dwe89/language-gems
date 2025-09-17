-- YouTube videos integration schema

-- Table: youtube_videos
CREATE TABLE IF NOT EXISTS youtube_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_id TEXT NOT NULL UNIQUE,
  language TEXT NOT NULL,
  level TEXT,
  duration INTEGER,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  is_premium BOOLEAN DEFAULT FALSE
);

-- Table: youtube_lyrics
CREATE TABLE IF NOT EXISTS youtube_lyrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  timestamp NUMERIC NOT NULL, -- Timestamp in seconds
  text TEXT NOT NULL,
  translation TEXT,
  section_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: youtube_quiz_points
CREATE TABLE IF NOT EXISTS youtube_quiz_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  timestamp NUMERIC NOT NULL, -- Timestamp in seconds when quiz should appear
  question TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: youtube_quiz_options
CREATE TABLE IF NOT EXISTS youtube_quiz_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id UUID NOT NULL REFERENCES youtube_quiz_points(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: youtube_quiz_results
CREATE TABLE IF NOT EXISTS youtube_quiz_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES youtube_quiz_points(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quiz_id) -- Each user can only have one result per quiz
);

-- Table: youtube_lyrics_results
CREATE TABLE IF NOT EXISTS youtube_lyrics_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  lyrics_line_id UUID NOT NULL REFERENCES youtube_lyrics(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: youtube_video_progress
CREATE TABLE IF NOT EXISTS youtube_video_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0, -- Percentage (0-100)
  last_position NUMERIC, -- Timestamp in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, video_id) -- Each user can only have one progress entry per video
);

-- Create appropriate indexes for performance
CREATE INDEX IF NOT EXISTS idx_youtube_lyrics_video_id ON youtube_lyrics(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_lyrics_timestamp ON youtube_lyrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_youtube_quiz_points_video_id ON youtube_quiz_points(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_quiz_points_timestamp ON youtube_quiz_points(timestamp);
CREATE INDEX IF NOT EXISTS idx_youtube_quiz_options_quiz_id ON youtube_quiz_options(quiz_id);
CREATE INDEX IF NOT EXISTS idx_youtube_quiz_results_user_id ON youtube_quiz_results(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_quiz_results_video_id ON youtube_quiz_results(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_lyrics_results_user_id ON youtube_lyrics_results(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_lyrics_results_video_id ON youtube_lyrics_results(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_video_progress_user_id ON youtube_video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_youtube_video_progress_video_id ON youtube_video_progress(video_id); 