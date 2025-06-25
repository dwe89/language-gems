-- Create worksheet downloads tracking table
CREATE TABLE IF NOT EXISTS worksheet_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  worksheet_id TEXT NOT NULL,
  file_name TEXT NOT NULL,
  anonymous_email TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  
  -- Indexes for performance
  CONSTRAINT worksheet_downloads_check_user_or_email CHECK (
    (user_id IS NOT NULL) OR (anonymous_email IS NOT NULL)
  )
);

-- Create indexes
CREATE INDEX idx_worksheet_downloads_user_id ON worksheet_downloads(user_id);
CREATE INDEX idx_worksheet_downloads_worksheet_id ON worksheet_downloads(worksheet_id);
CREATE INDEX idx_worksheet_downloads_downloaded_at ON worksheet_downloads(downloaded_at);
CREATE INDEX idx_worksheet_downloads_anonymous_email ON worksheet_downloads(anonymous_email);

-- Enable RLS
ALTER TABLE worksheet_downloads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own downloads" ON worksheet_downloads
  FOR SELECT 
  USING (
    auth.uid() = user_id OR 
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Allow anonymous and authenticated downloads" ON worksheet_downloads
  FOR INSERT 
  WITH CHECK (true); -- Allow all inserts for tracking

-- Create a view for admin analytics
CREATE OR REPLACE VIEW worksheet_download_analytics AS
SELECT 
  worksheet_id,
  file_name,
  COUNT(*) as total_downloads,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT anonymous_email) as unique_anonymous_users,
  DATE(downloaded_at) as download_date,
  COUNT(*) FILTER (WHERE downloaded_at >= NOW() - INTERVAL '24 hours') as downloads_last_24h,
  COUNT(*) FILTER (WHERE downloaded_at >= NOW() - INTERVAL '7 days') as downloads_last_7d,
  COUNT(*) FILTER (WHERE downloaded_at >= NOW() - INTERVAL '30 days') as downloads_last_30d
FROM worksheet_downloads
GROUP BY worksheet_id, file_name, DATE(downloaded_at)
ORDER BY total_downloads DESC;

-- Grant access to the view for admins
GRANT SELECT ON worksheet_download_analytics TO authenticated;

COMMENT ON TABLE worksheet_downloads IS 'Tracks downloads of free worksheets for analytics';
COMMENT ON VIEW worksheet_download_analytics IS 'Provides aggregated download statistics for administrators'; 