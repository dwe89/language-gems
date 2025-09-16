-- Create beta_email_signups table if it doesn't exist
CREATE TABLE IF NOT EXISTS beta_email_signups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  feature TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, feature)
);

-- Add RLS policies
ALTER TABLE beta_email_signups ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for email capture)
CREATE POLICY "Allow email signup insertion" ON beta_email_signups
  FOR INSERT WITH CHECK (true);

-- Only allow admins to read
CREATE POLICY "Allow admin read access" ON beta_email_signups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_beta_email_signups_feature ON beta_email_signups(feature);
CREATE INDEX IF NOT EXISTS idx_beta_email_signups_created_at ON beta_email_signups(created_at);
