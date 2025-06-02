-- Add username column to user_profiles table
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create a unique index on the username column
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles (username) WHERE username IS NOT NULL;

-- Add comment explaining the purpose of this column
COMMENT ON COLUMN user_profiles.username IS 'Optional username for login, primarily for student accounts'; 