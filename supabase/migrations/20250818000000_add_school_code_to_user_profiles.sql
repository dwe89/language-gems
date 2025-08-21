-- Add school_code column to user_profiles table to store the actual selected school code
-- This ensures teachers' profiles correctly store the school code they chose during signup

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS school_code TEXT;

-- Create index for school_code queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_school_code 
ON user_profiles(school_code);

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.school_code IS 'The actual school code selected by teacher during signup (e.g., CHS2024)';
COMMENT ON COLUMN user_profiles.school_initials IS 'School initials for student username generation (now same as school_code for consistency)';
