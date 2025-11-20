-- Add GCSE grade and performance breakdown fields to AQA results tables
-- This enables teacher analytics to show grade distributions and performance by question type/theme/topic

-- Add fields to aqa_reading_results
ALTER TABLE aqa_reading_results 
ADD COLUMN IF NOT EXISTS gcse_grade INTEGER,
ADD COLUMN IF NOT EXISTS performance_by_question_type JSONB,
ADD COLUMN IF NOT EXISTS performance_by_theme JSONB,
ADD COLUMN IF NOT EXISTS performance_by_topic JSONB;

-- Add fields to aqa_listening_results
ALTER TABLE aqa_listening_results 
ADD COLUMN IF NOT EXISTS gcse_grade INTEGER,
ADD COLUMN IF NOT EXISTS performance_by_question_type JSONB,
ADD COLUMN IF NOT EXISTS performance_by_theme JSONB,
ADD COLUMN IF NOT EXISTS performance_by_topic JSONB;

-- Add fields to aqa_writing_results
ALTER TABLE aqa_writing_results 
ADD COLUMN IF NOT EXISTS gcse_grade INTEGER;

-- Add comments
COMMENT ON COLUMN aqa_reading_results.gcse_grade IS 'GCSE grade (1-9) calculated from percentage score and tier';
COMMENT ON COLUMN aqa_reading_results.performance_by_question_type IS 'Performance breakdown by question type (e.g., multiple choice, gap fill)';
COMMENT ON COLUMN aqa_reading_results.performance_by_theme IS 'Performance breakdown by theme';
COMMENT ON COLUMN aqa_reading_results.performance_by_topic IS 'Performance breakdown by topic';

COMMENT ON COLUMN aqa_listening_results.gcse_grade IS 'GCSE grade (1-9) calculated from percentage score and tier';
COMMENT ON COLUMN aqa_listening_results.performance_by_question_type IS 'Performance breakdown by question type';
COMMENT ON COLUMN aqa_listening_results.performance_by_theme IS 'Performance breakdown by theme';
COMMENT ON COLUMN aqa_listening_results.performance_by_topic IS 'Performance breakdown by topic';

COMMENT ON COLUMN aqa_writing_results.gcse_grade IS 'GCSE grade (1-9) calculated from percentage score and tier';

-- Fix RLS policies to ensure students can insert their own results
-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_reading_results;
DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_listening_results;
DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_writing_results;

-- Create separate policies for insert, select, update, delete
-- Reading results
CREATE POLICY "Students can insert their own reading results" ON aqa_reading_results
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own reading results" ON aqa_reading_results
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own reading results" ON aqa_reading_results
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own reading results" ON aqa_reading_results
    FOR DELETE USING (auth.uid() = student_id);

-- Listening results
CREATE POLICY "Students can insert their own listening results" ON aqa_listening_results
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own listening results" ON aqa_listening_results
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own listening results" ON aqa_listening_results
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own listening results" ON aqa_listening_results
    FOR DELETE USING (auth.uid() = student_id);

-- Writing results
CREATE POLICY "Students can insert their own writing results" ON aqa_writing_results
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can view their own writing results" ON aqa_writing_results
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can update their own writing results" ON aqa_writing_results
    FOR UPDATE USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own writing results" ON aqa_writing_results
    FOR DELETE USING (auth.uid() = student_id);
