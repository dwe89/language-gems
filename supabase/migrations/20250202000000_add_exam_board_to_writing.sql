-- Migration: Add exam_board field to writing assessments
-- Created: 2025-02-02
-- Purpose: Support both AQA and Edexcel exam boards

-- Add exam_board column to aqa_writing_assessments table
ALTER TABLE aqa_writing_assessments 
ADD COLUMN IF NOT EXISTS exam_board TEXT NOT NULL DEFAULT 'aqa' CHECK (exam_board IN ('aqa', 'edexcel'));

-- Update the unique constraint to include exam_board
ALTER TABLE aqa_writing_assessments 
DROP CONSTRAINT IF EXISTS aqa_writing_assessments_level_language_identifier_key;

ALTER TABLE aqa_writing_assessments 
ADD CONSTRAINT aqa_writing_assessments_exam_board_level_language_identifier_key 
UNIQUE(exam_board, level, language, identifier);

-- Update question types to include Edexcel-specific types
ALTER TABLE aqa_writing_questions 
DROP CONSTRAINT IF EXISTS aqa_writing_questions_question_type_check;

ALTER TABLE aqa_writing_questions 
ADD CONSTRAINT aqa_writing_questions_question_type_check 
CHECK (question_type IN (
    'photo-description',
    'short-message',
    'gap-fill',
    'translation',
    'extended-writing',
    'overlap-writing',
    'open-writing',
    'choice-writing',      -- Edexcel: Choice between 2(a) or 2(b)
    'paragraph-translation' -- Edexcel Higher Q3: Translate a paragraph
));

-- Add comment to clarify table now supports multiple exam boards
COMMENT ON TABLE aqa_writing_assessments IS 'GCSE Writing assessments for both AQA and Edexcel exam boards';

