-- Add user_progress table
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    languages JSONB DEFAULT '{}'::jsonb,
    videos_completed TEXT[] DEFAULT '{}',
    video_progress JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Apply the existing update_timestamp trigger to user_progress table
DROP TRIGGER IF EXISTS update_user_progress_timestamp ON public.user_progress;
CREATE TRIGGER update_user_progress_timestamp
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();

-- Add RLS policies for user_progress table
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Only allow users to access their own progress
CREATE POLICY "Users can access their own progress"
ON public.user_progress
FOR ALL
USING (user_id = auth.uid());

-- Create index for faster progress lookup
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id); 