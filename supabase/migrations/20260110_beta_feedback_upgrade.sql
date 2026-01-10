-- Migration: Upgrade beta_feedback table with screenshot and context fields
-- Date: 2026-01-10
-- Description: Add columns for screenshot URLs, browser info, page context, and structured bug reports

-- Add new columns to beta_feedback table
ALTER TABLE beta_feedback
ADD COLUMN IF NOT EXISTS screenshot_url TEXT,
ADD COLUMN IF NOT EXISTS browser_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS page_url TEXT,
ADD COLUMN IF NOT EXISTS user_role TEXT,
ADD COLUMN IF NOT EXISTS expected_result TEXT,
ADD COLUMN IF NOT EXISTS actual_result TEXT,
ADD COLUMN IF NOT EXISTS steps_to_reproduce TEXT[];

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_beta_feedback_page_url ON beta_feedback(page_url);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_user_role ON beta_feedback(user_role);
CREATE INDEX IF NOT EXISTS idx_beta_feedback_category_created ON beta_feedback(category, created_at DESC);

-- Add comment to the table
COMMENT ON COLUMN beta_feedback.screenshot_url IS 'Supabase Storage URL for uploaded screenshot';
COMMENT ON COLUMN beta_feedback.browser_info IS 'JSON object containing browser, OS, viewport, and other technical details';
COMMENT ON COLUMN beta_feedback.page_url IS 'Full URL where feedback was submitted';
COMMENT ON COLUMN beta_feedback.user_role IS 'User role at time of feedback (teacher, student, admin)';
COMMENT ON COLUMN beta_feedback.expected_result IS 'What the user expected to happen (for bug reports)';
COMMENT ON COLUMN beta_feedback.actual_result IS 'What actually happened (for bug reports)';
COMMENT ON COLUMN beta_feedback.steps_to_reproduce IS 'Array of steps to reproduce the issue';

-- Update RLS policies to allow file uploads
-- (Assuming RLS is enabled - adjust if needed)
