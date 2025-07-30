-- Create assessment_results table
CREATE TABLE IF NOT EXISTS assessment_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  assessment_id UUID NOT NULL,
  assessment_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_spent INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  detailed_results JSONB,
  assignment_mode BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_results_user_id ON assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_assessment_id ON assessment_results(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_results_type ON assessment_results(assessment_type);

-- Enable RLS
ALTER TABLE assessment_results ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own results" ON assessment_results
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own results" ON assessment_results
  FOR INSERT WITH CHECK (auth.uid() = user_id);