-- Create freebies categories table
CREATE TABLE freebies_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create freebies topics table
CREATE TABLE freebies_topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES freebies_categories(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, slug)
);

-- Create freebies resources table
CREATE TABLE freebies_resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  language VARCHAR(50) NOT NULL,
  category_id UUID REFERENCES freebies_categories(id) ON DELETE CASCADE,
  topic_id UUID REFERENCES freebies_topics(id) ON DELETE SET NULL,
  year_groups TEXT[] NOT NULL DEFAULT '{}',
  level VARCHAR(20) NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
  pages INTEGER NOT NULL DEFAULT 1,
  keywords TEXT[] DEFAULT '{}',
  
  -- File information
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  file_type VARCHAR(50) DEFAULT 'application/pdf',
  
  -- Status flags
  is_featured BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Metrics
  download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Created by admin user
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Create freebies downloads tracking table
CREATE TABLE freebies_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES freebies_resources(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Additional tracking data
  session_id VARCHAR(255),
  country_code VARCHAR(2),
  device_type VARCHAR(20),
  browser VARCHAR(50)
);

-- Create indexes for better performance
CREATE INDEX idx_freebies_resources_category ON freebies_resources(category_id);
CREATE INDEX idx_freebies_resources_topic ON freebies_resources(topic_id);
CREATE INDEX idx_freebies_resources_language ON freebies_resources(language);
CREATE INDEX idx_freebies_resources_level ON freebies_resources(level);
CREATE INDEX idx_freebies_resources_featured ON freebies_resources(is_featured);
CREATE INDEX idx_freebies_resources_premium ON freebies_resources(is_premium);
CREATE INDEX idx_freebies_resources_active ON freebies_resources(is_active);
CREATE INDEX idx_freebies_resources_published ON freebies_resources(published_at);
CREATE INDEX idx_freebies_resources_year_groups ON freebies_resources USING GIN(year_groups);
CREATE INDEX idx_freebies_resources_keywords ON freebies_resources USING GIN(keywords);

CREATE INDEX idx_freebies_downloads_resource ON freebies_downloads(resource_id);
CREATE INDEX idx_freebies_downloads_user ON freebies_downloads(user_id);
CREATE INDEX idx_freebies_downloads_date ON freebies_downloads(downloaded_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_freebies_categories_updated_at 
  BEFORE UPDATE ON freebies_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freebies_topics_updated_at 
  BEFORE UPDATE ON freebies_topics 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freebies_resources_updated_at 
  BEFORE UPDATE ON freebies_resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO freebies_categories (name, slug, description, icon, sort_order) VALUES
('Themed Worksheets', 'themes', 'Topic-based vocabulary and conversation practice', '🌍', 1),
('Grammar Essentials', 'grammar', 'Structured grammar practice and reference sheets', '📚', 2),
('Exam Preparation', 'exam-prep', 'GCSE and A-Level focused materials', '🎓', 3),
('Vocabulary Building', 'vocabulary', 'Word lists and vocabulary exercises', '📝', 4),
('Culture & Traditions', 'culture', 'Cultural insights and traditional practices', '🎭', 5),
('Assessment Tools', 'assessment', 'Tests, quizzes, and evaluation materials', '📊', 6);

-- Insert default topics for themes category
INSERT INTO freebies_topics (category_id, name, slug, sort_order)
SELECT 
  c.id,
  topics.name,
  topics.slug,
  topics.sort_order
FROM freebies_categories c
CROSS JOIN (
  VALUES 
    ('Identity & Family', 'identity-family', 1),
    ('School Life', 'school-life', 2),
    ('Free Time & Hobbies', 'free-time-hobbies', 3),
    ('Local Area & Town', 'local-area-town', 4),
    ('House & Home', 'house-home', 5),
    ('Food & Drink', 'food-drink', 6),
    ('Technology', 'technology', 7),
    ('Environment', 'environment', 8),
    ('Travel & Holidays', 'travel-holidays', 9)
) AS topics(name, slug, sort_order)
WHERE c.slug = 'themes';

-- Insert default topics for grammar category
INSERT INTO freebies_topics (category_id, name, slug, sort_order)
SELECT 
  c.id,
  topics.name,
  topics.slug,
  topics.sort_order
FROM freebies_categories c
CROSS JOIN (
  VALUES 
    ('Present Tense', 'present-tense', 1),
    ('Past Tense', 'past-tense', 2),
    ('Future Tense', 'future-tense', 3),
    ('Ser vs Estar', 'ser-vs-estar', 4),
    ('Adjectives', 'adjectives', 5),
    ('Numbers', 'numbers', 6),
    ('Pronouns', 'pronouns', 7),
    ('Prepositions', 'prepositions', 8)
) AS topics(name, slug, sort_order)
WHERE c.slug = 'grammar';

-- Insert default topics for exam-prep category
INSERT INTO freebies_topics (category_id, name, slug, sort_order)
SELECT 
  c.id,
  topics.name,
  topics.slug,
  topics.sort_order
FROM freebies_categories c
CROSS JOIN (
  VALUES 
    ('Speaking Practice', 'speaking-practice', 1),
    ('Listening Exercises', 'listening-exercises', 2),
    ('Reading Comprehension', 'reading-comprehension', 3),
    ('Writing Tasks', 'writing-tasks', 4),
    ('Photo Cards', 'photo-cards', 5),
    ('Role Play', 'role-play', 6)
) AS topics(name, slug, sort_order)
WHERE c.slug = 'exam-prep';

-- Enable Row Level Security
ALTER TABLE freebies_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE freebies_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE freebies_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE freebies_downloads ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access to active content
CREATE POLICY "Public can view active categories" ON freebies_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active topics" ON freebies_topics
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view active resources" ON freebies_resources
  FOR SELECT USING (is_active = true AND published_at <= NOW());

-- RLS Policies for admin management
CREATE POLICY "Admins can manage categories" ON freebies_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage topics" ON freebies_topics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage resources" ON freebies_resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY "Admins can view all downloads" ON freebies_downloads
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Users can insert download records
CREATE POLICY "Users can track downloads" ON freebies_downloads
  FOR INSERT WITH CHECK (true);

-- Create function to increment download count
CREATE OR REPLACE FUNCTION increment_download_count(resource_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE freebies_resources 
  SET download_count = download_count + 1 
  WHERE id = resource_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get freebies statistics
CREATE OR REPLACE FUNCTION get_freebies_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_resources', (SELECT COUNT(*) FROM freebies_resources WHERE is_active = true),
    'featured_resources', (SELECT COUNT(*) FROM freebies_resources WHERE is_active = true AND is_featured = true),
    'premium_resources', (SELECT COUNT(*) FROM freebies_resources WHERE is_active = true AND is_premium = true),
    'total_downloads', (SELECT COALESCE(SUM(download_count), 0) FROM freebies_resources),
    'categories', (SELECT COUNT(*) FROM freebies_categories WHERE is_active = true),
    'recent_downloads', (SELECT COUNT(*) FROM freebies_downloads WHERE downloaded_at >= NOW() - INTERVAL '7 days')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 