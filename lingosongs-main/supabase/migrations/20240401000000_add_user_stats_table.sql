-- Add user_stats table
CREATE TABLE IF NOT EXISTS public.user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    day_streak INTEGER DEFAULT 0,
    minutes_practiced INTEGER DEFAULT 0,
    vocabulary_count INTEGER DEFAULT 0,
    quiz_count INTEGER DEFAULT 0,
    last_practice_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_stats table
DROP TRIGGER IF EXISTS update_user_stats_timestamp ON public.user_stats;
CREATE TRIGGER update_user_stats_timestamp
BEFORE UPDATE ON public.user_stats
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

-- Add RLS policies for user_stats table
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own stats
CREATE POLICY "Users can access their own stats"
ON public.user_stats
FOR ALL
USING (user_id = auth.uid()); 