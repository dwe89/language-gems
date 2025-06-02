-- Add teacher_id and initial_password columns to user_profiles
ALTER TABLE IF EXISTS user_profiles 
  ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES user_profiles(user_id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS initial_password TEXT;

-- Add index to speed up lookups by teacher_id
CREATE INDEX IF NOT EXISTS idx_user_profiles_teacher_id ON user_profiles(teacher_id);

-- Add comment explaining the purpose of these fields
COMMENT ON COLUMN user_profiles.teacher_id IS 'The ID of the teacher who created this student account';
COMMENT ON COLUMN user_profiles.initial_password IS 'The initial password set for student, stored for teacher reference only';
