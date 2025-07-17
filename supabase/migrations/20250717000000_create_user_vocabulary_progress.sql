-- Create user vocabulary progress table for simplified Memrise-style tracking
CREATE TABLE IF NOT EXISTS user_vocabulary_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_id INTEGER NOT NULL,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_learned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, vocabulary_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_user_id ON user_vocabulary_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_vocabulary_id ON user_vocabulary_progress(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_is_learned ON user_vocabulary_progress(is_learned);
CREATE INDEX IF NOT EXISTS idx_user_vocabulary_progress_last_seen ON user_vocabulary_progress(last_seen);

-- Enable RLS
ALTER TABLE user_vocabulary_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own vocabulary progress" ON user_vocabulary_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vocabulary progress" ON user_vocabulary_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vocabulary progress" ON user_vocabulary_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vocabulary progress" ON user_vocabulary_progress
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_vocabulary_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_user_vocabulary_progress_updated_at ON user_vocabulary_progress;
CREATE TRIGGER update_user_vocabulary_progress_updated_at
  BEFORE UPDATE ON user_vocabulary_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_vocabulary_progress_updated_at();
