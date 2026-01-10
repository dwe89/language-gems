-- Migration: Add holistic scoring for dictation and AI grading for writing
-- Created: 2025-01-10

-- Add holistic_scores column to aqa_dictation_results for AO1/AO3 scoring
ALTER TABLE aqa_dictation_results 
ADD COLUMN IF NOT EXISTS holistic_scores JSONB DEFAULT '{}';

-- Add comment for the new column
COMMENT ON COLUMN aqa_dictation_results.holistic_scores IS 'Stores holistic AO1 (communication) and AO3 (transcription accuracy) scores from teacher marking, format: {"AO1": 0-4, "AO3": 0-4}';

-- Add ai_grading column to aqa_writing_question_responses for AI-generated scores
ALTER TABLE aqa_writing_question_responses 
ADD COLUMN IF NOT EXISTS ai_grading JSONB DEFAULT NULL;

-- Add comment for the new column
COMMENT ON COLUMN aqa_writing_question_responses.ai_grading IS 'Stores AI-generated grading breakdown, suggestions, and metadata. Format: {"breakdown": {...}, "suggestions": [...], "graded_at": timestamp, "model": "gpt-4.1-nano"}';

-- Update the assignment_id reference for dictation if needed (to reference main assignments table)
-- This is already correct in the original migration

-- Add performance_by_question_type to aqa_listening_results if not exists
ALTER TABLE aqa_listening_results 
ADD COLUMN IF NOT EXISTS performance_by_question_type JSONB DEFAULT '{}';

-- Add sub_question_scores to aqa_listening_question_responses if that table exists
-- (For listening, responses are stored in JSONB on the results table, so this is not needed)

-- Index for faster holistic score queries
CREATE INDEX IF NOT EXISTS idx_aqa_dictation_results_holistic ON aqa_dictation_results USING GIN (holistic_scores) WHERE holistic_scores IS NOT NULL;

-- Index for faster AI grading queries
CREATE INDEX IF NOT EXISTS idx_aqa_writing_responses_ai_grading ON aqa_writing_question_responses USING GIN (ai_grading) WHERE ai_grading IS NOT NULL;
