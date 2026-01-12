-- =====================================================
-- Add Roleplay Tasks Support
-- Created: 2026-01-11
-- Adds structured roleplay tasks with examiner questions
-- =====================================================

-- Add roleplay_tasks column to store structured roleplay data
-- Each task contains:
-- - task_number: Order of the task (1-5 typically)
-- - student_prompt_en: What the student needs to say (in English)
-- - examiner_question: The question the examiner asks (in target language)
-- - examiner_question_audio_url: Pre-generated TTS audio URL (optional)
-- - expected_response_hints: Keywords/phrases to look for
ALTER TABLE aqa_speaking_questions 
ADD COLUMN IF NOT EXISTS roleplay_tasks JSONB;

-- Example structure for roleplay_tasks:
-- [
--   {
--     "task_number": 1,
--     "student_prompt_en": "Say hello and ask for a room",
--     "examiner_question": "Buenos días, ¿en qué puedo ayudarle?",
--     "examiner_question_audio_url": null,
--     "expected_keywords": ["hola", "buenos días", "habitación", "quiero", "quisiera"]
--   },
--   {
--     "task_number": 2,
--     "student_prompt_en": "Say you want a room for two nights",
--     "examiner_question": "¿Para cuántas noches?",
--     "examiner_question_audio_url": null,
--     "expected_keywords": ["dos noches", "dos", "noches"]
--   }
-- ]

-- Add index for JSONB queries
CREATE INDEX IF NOT EXISTS idx_speaking_questions_roleplay_tasks 
ON aqa_speaking_questions USING GIN (roleplay_tasks);

-- Comment for documentation
COMMENT ON COLUMN aqa_speaking_questions.roleplay_tasks IS 
'JSON array of roleplay tasks. Each task has: task_number, student_prompt_en (English instruction for student), examiner_question (target language), examiner_question_audio_url (optional pre-generated audio), expected_keywords (for grading)';
