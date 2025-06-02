-- Exam board table
CREATE TABLE IF NOT EXISTS public.exam_boards (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Educational levels table
CREATE TABLE IF NOT EXISTS public.education_levels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Themes table
CREATE TABLE IF NOT EXISTS public.themes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  description TEXT,
  exam_board_id UUID REFERENCES public.exam_boards(id),
  education_level_id UUID REFERENCES public.education_levels(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topics table
CREATE TABLE IF NOT EXISTS public.topics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  theme_id UUID REFERENCES public.themes(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Assessments table
CREATE TABLE IF NOT EXISTS public.assessments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  level TEXT NOT NULL,
  topic_id UUID REFERENCES public.topics(id),
  time_limit INTEGER, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id),
  type TEXT NOT NULL,
  text TEXT NOT NULL,
  points INTEGER DEFAULT 1,
  difficulty TEXT NOT NULL,
  options JSONB, -- for multiple choice
  correct_answer JSONB, -- for all question types
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User assessment progress
CREATE TABLE IF NOT EXISTS public.user_assessment_progress (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES public.assessments(id),
  score INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  answers JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, assessment_id)
);

-- Vocabulary items for exam prep
CREATE TABLE IF NOT EXISTS public.vocabulary_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  term TEXT NOT NULL,
  translation TEXT NOT NULL,
  context_sentence TEXT,
  topic_id UUID REFERENCES public.topics(id),
  theme_id UUID REFERENCES public.themes(id),
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grammar items for exam prep
CREATE TABLE IF NOT EXISTS public.grammar_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  rule TEXT NOT NULL,
  explanation TEXT NOT NULL,
  examples JSONB,
  difficulty TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam assignments (for teachers to assign exams to students/classes)
CREATE TABLE IF NOT EXISTS public.exam_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users(id),
  assessment_id UUID REFERENCES public.assessments(id),
  class_id UUID REFERENCES public.classes(id),
  student_ids JSONB, -- Array of student IDs
  due_date TIMESTAMP WITH TIME ZONE,
  instructions TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
); 