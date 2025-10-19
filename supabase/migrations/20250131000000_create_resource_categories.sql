-- Create resource_categories table for hierarchical resource organization
CREATE TABLE IF NOT EXISTS resource_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES resource_categories(id) ON DELETE CASCADE,
  
  -- Metadata
  language TEXT CHECK (language IN ('spanish', 'french', 'german', 'all')),
  key_stage TEXT CHECK (key_stage IN ('ks3', 'ks4', 'all')),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Lucide icon name
  color TEXT, -- Tailwind gradient classes
  
  -- Display
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  show_in_nav BOOLEAN DEFAULT true,
  
  -- Rich content (for category landing pages)
  page_content JSONB DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_categories_parent ON resource_categories(parent_id);
CREATE INDEX idx_categories_language ON resource_categories(language);
CREATE INDEX idx_categories_keystage ON resource_categories(key_stage);
CREATE INDEX idx_categories_slug ON resource_categories(slug);
CREATE INDEX idx_categories_published ON resource_categories(is_published);

-- Enable RLS
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can read published categories"
  ON resource_categories FOR SELECT
  USING (is_published = true);

CREATE POLICY "Authenticated users can read all categories"
  ON resource_categories FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage categories"
  ON resource_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.email = 'danieletienne89@gmail.com'
    )
  );

-- Add category_id to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES resource_categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- Seed top-level language categories
INSERT INTO resource_categories (slug, title, language, icon, color, description, display_order, page_content) VALUES
('spanish', 'Spanish', 'spanish', 'Globe', 'from-red-500 to-yellow-500', 'Comprehensive Spanish language resources', 1, '{
  "hero": {
    "title": "Spanish Resources",
    "subtitle": "Comprehensive materials for KS3 and KS4 Spanish learners",
    "description": "High-quality worksheets, activities, and exam preparation materials"
  },
  "stats": {
    "total_resources": 45,
    "free_resources": 12,
    "premium_resources": 33
  }
}'),
('french', 'French', 'french', 'Globe', 'from-blue-500 to-indigo-500', 'Complete French curriculum materials', 2, '{
  "hero": {
    "title": "French Resources",
    "subtitle": "Complete curriculum materials for French learners",
    "description": "Engaging resources aligned with GCSE specifications"
  },
  "stats": {
    "total_resources": 38,
    "free_resources": 10,
    "premium_resources": 28
  }
}'),
('german', 'German', 'german', 'Globe', 'from-gray-700 to-gray-900', 'Structured German learning resources', 3, '{
  "hero": {
    "title": "German Resources",
    "subtitle": "Structured materials for German language learning",
    "description": "Comprehensive resources for all proficiency levels"
  },
  "stats": {
    "total_resources": 29,
    "free_resources": 8,
    "premium_resources": 21
  }
}');

-- Seed KS3 and KS4 subcategories for each language
DO $$
DECLARE
  lang_record RECORD;
BEGIN
  FOR lang_record IN 
    SELECT id, slug, language FROM resource_categories WHERE parent_id IS NULL
  LOOP
    -- KS3
    INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, icon, color, description, display_order, page_content)
    VALUES (
      lang_record.slug || '-ks3',
      'KS3 ' || INITCAP(lang_record.language),
      lang_record.language,
      'ks3',
      lang_record.id,
      'BookOpen',
      'from-green-500 to-emerald-600',
      'Key Stage 3 resources for ' || INITCAP(lang_record.language),
      1,
      jsonb_build_object(
        'hero', jsonb_build_object(
          'title', 'KS3 ' || INITCAP(lang_record.language) || ' Resources',
          'subtitle', 'Foundation materials for Key Stage 3 learners',
          'description', 'Build strong foundations with our KS3 resources'
        )
      )
    );
    
    -- KS4
    INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, icon, color, description, display_order, page_content)
    VALUES (
      lang_record.slug || '-ks4',
      'KS4 ' || INITCAP(lang_record.language),
      lang_record.language,
      'ks4',
      lang_record.id,
      'GraduationCap',
      'from-purple-500 to-pink-600',
      'GCSE resources for ' || INITCAP(lang_record.language),
      2,
      jsonb_build_object(
        'hero', jsonb_build_object(
          'title', 'KS4 ' || INITCAP(lang_record.language) || ' Resources',
          'subtitle', 'GCSE exam preparation and practice materials',
          'description', 'Excel in your GCSEs with our comprehensive resources'
        )
      )
    );
  END LOOP;
END $$;

-- Seed topic categories for Spanish KS3 (example)
INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, icon, color, description, display_order, page_content)
SELECT 
  'spanish-ks3-identity',
  'Identity & Personal Life',
  'spanish',
  'ks3',
  id,
  'User',
  'from-blue-400 to-cyan-500',
  'Resources about identity, family, and personal relationships',
  1,
  '{"hero": {"title": "Identity & Personal Life", "subtitle": "Explore topics about yourself, family, and relationships"}}'
FROM resource_categories WHERE slug = 'spanish-ks3';

INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, icon, color, description, display_order, page_content)
SELECT 
  'spanish-ks3-local-area',
  'Local Area, Holiday & Travel',
  'spanish',
  'ks3',
  id,
  'MapPin',
  'from-orange-400 to-red-500',
  'Resources about places, holidays, and travel',
  2,
  '{"hero": {"title": "Local Area, Holiday & Travel", "subtitle": "Discover vocabulary and activities about places and travel"}}'
FROM resource_categories WHERE slug = 'spanish-ks3';

INSERT INTO resource_categories (slug, title, language, key_stage, parent_id, icon, color, description, display_order, page_content)
SELECT 
  'spanish-ks3-school',
  'School Life',
  'spanish',
  'ks3',
  id,
  'School',
  'from-green-400 to-teal-500',
  'Resources about school subjects, routines, and activities',
  3,
  '{"hero": {"title": "School Life", "subtitle": "Learn vocabulary and grammar related to school"}}'
FROM resource_categories WHERE slug = 'spanish-ks3';

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_resource_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resource_categories_updated_at
  BEFORE UPDATE ON resource_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_resource_categories_updated_at();

-- Grant permissions
GRANT SELECT ON resource_categories TO anon, authenticated;
GRANT ALL ON resource_categories TO authenticated;

