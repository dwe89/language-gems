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