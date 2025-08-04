-- Create assignment_game_progress table for tracking individual game completion in multi-game assignments
CREATE TABLE IF NOT EXISTS public.assignment_game_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL, -- Game type identifier (e.g., 'memory-game', 'vocab-blast')
  
  -- Progress tracking
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  
  -- Performance metrics
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  accuracy DECIMAL(5,2) DEFAULT 0,
  words_completed INTEGER DEFAULT 0,
  total_words INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  attempts_count INTEGER DEFAULT 1,
  
  -- Session data
  session_data JSONB DEFAULT '{}',
  
  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one record per student per game per assignment
  UNIQUE(assignment_id, student_id, game_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_assignment_game_progress_assignment_student 
  ON public.assignment_game_progress(assignment_id, student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_game_progress_status 
  ON public.assignment_game_progress(status);
CREATE INDEX IF NOT EXISTS idx_assignment_game_progress_completed_at 
  ON public.assignment_game_progress(completed_at);

-- Enable RLS
ALTER TABLE public.assignment_game_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Students can view and update their own game progress
CREATE POLICY "Students can manage their own game progress"
  ON public.assignment_game_progress
  FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

-- Teachers can view game progress for their assignments
CREATE POLICY "Teachers can view game progress for their assignments"
  ON public.assignment_game_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_assignment_game_progress_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_assignment_game_progress_updated_at
  BEFORE UPDATE ON public.assignment_game_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_assignment_game_progress_updated_at();

-- Create function to automatically update assignment progress when all games are completed
CREATE OR REPLACE FUNCTION check_assignment_completion()
RETURNS TRIGGER AS $$
DECLARE
  total_games INTEGER;
  completed_games INTEGER;
  assignment_completed BOOLEAN := FALSE;
BEGIN
  -- Only proceed if a game was just completed
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Count total games for this assignment
    SELECT COUNT(DISTINCT game_id) INTO total_games
    FROM public.assignment_game_progress
    WHERE assignment_id = NEW.assignment_id AND student_id = NEW.student_id;
    
    -- Count completed games for this assignment
    SELECT COUNT(*) INTO completed_games
    FROM public.assignment_game_progress
    WHERE assignment_id = NEW.assignment_id 
      AND student_id = NEW.student_id 
      AND status = 'completed';
    
    -- Check if all games are completed
    IF completed_games = total_games AND total_games > 0 THEN
      assignment_completed := TRUE;
    END IF;
    
    -- Update overall assignment progress
    INSERT INTO public.assignment_progress (
      assignment_id,
      student_id,
      status,
      completed_at,
      updated_at
    ) VALUES (
      NEW.assignment_id,
      NEW.student_id,
      CASE WHEN assignment_completed THEN 'completed' ELSE 'in_progress' END,
      CASE WHEN assignment_completed THEN NOW() ELSE NULL END,
      NOW()
    )
    ON CONFLICT (assignment_id, student_id) 
    DO UPDATE SET
      status = CASE WHEN assignment_completed THEN 'completed' ELSE 'in_progress' END,
      completed_at = CASE WHEN assignment_completed THEN NOW() ELSE assignment_progress.completed_at END,
      updated_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for assignment completion check
CREATE TRIGGER trigger_check_assignment_completion
  AFTER INSERT OR UPDATE ON public.assignment_game_progress
  FOR EACH ROW
  EXECUTE FUNCTION check_assignment_completion();

-- Add unique constraint to assignment_progress if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'assignment_progress_assignment_student_unique'
  ) THEN
    ALTER TABLE public.assignment_progress 
    ADD CONSTRAINT assignment_progress_assignment_student_unique 
    UNIQUE (assignment_id, student_id);
  END IF;
END $$;
