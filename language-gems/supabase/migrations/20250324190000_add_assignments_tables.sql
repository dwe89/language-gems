-- Create assignments table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  due_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'draft',
  points INTEGER DEFAULT 10,
  time_limit INTEGER DEFAULT 15,
  game_config JSONB DEFAULT '{}'::jsonb,
  vocabulary_list_id UUID REFERENCES public.custom_wordlists(id) ON DELETE SET NULL
);

-- Add index for faster queries by teacher
CREATE INDEX IF NOT EXISTS assignments_teacher_id_idx ON public.assignments(teacher_id);
CREATE INDEX IF NOT EXISTS assignments_class_id_idx ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS assignments_status_idx ON public.assignments(status);

-- Create assignment_progress table to track student progress
CREATE TABLE IF NOT EXISTS public.assignment_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER DEFAULT 0,
  accuracy FLOAT DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  metrics JSONB DEFAULT '{}'::jsonb, -- store game-specific metrics
  status TEXT DEFAULT 'not_started',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS assignment_progress_assignment_id_idx ON public.assignment_progress(assignment_id);
CREATE INDEX IF NOT EXISTS assignment_progress_student_id_idx ON public.assignment_progress(student_id);
CREATE INDEX IF NOT EXISTS assignment_progress_status_idx ON public.assignment_progress(status);

-- RLS Policies for assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own assignments
CREATE POLICY "Teachers can manage their own assignments"
  ON public.assignments
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());
  
-- RLS Policies for assignment_progress
ALTER TABLE public.assignment_progress ENABLE ROW LEVEL SECURITY;

-- Students can view and update their own progress
CREATE POLICY "Students can view and update their own progress"
  ON public.assignment_progress
  FOR ALL
  TO authenticated
  USING (student_id = auth.uid());

-- Teachers can view progress for their assignments
CREATE POLICY "Teachers can view progress for their assignments"
  ON public.assignment_progress
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.assignments a
      WHERE a.id = assignment_id AND a.teacher_id = auth.uid()
    )
  ); 