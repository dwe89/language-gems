-- Migration: Create editable pages CMS system
-- This allows admin users to edit marketing pages, landing pages, and educational content
-- from the production interface without code deployments

-- Create editable_pages table for full-page CMS
CREATE TABLE IF NOT EXISTS editable_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT UNIQUE NOT NULL, -- 'homepage', 'schools', 'pricing', 'about', etc.
    page_title TEXT NOT NULL,
    page_description TEXT,
    page_data JSONB NOT NULL DEFAULT '{}', -- All editable content stored as JSON
    meta_data JSONB DEFAULT '{}', -- SEO metadata (title, description, keywords, og tags)
    is_published BOOLEAN DEFAULT true,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES auth.users(id),
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_editable_pages_slug ON editable_pages(page_slug);
CREATE INDEX IF NOT EXISTS idx_editable_pages_published ON editable_pages(is_published);

-- Create version history table for tracking changes
CREATE TABLE IF NOT EXISTS editable_pages_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id UUID NOT NULL REFERENCES editable_pages(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    page_data JSONB NOT NULL,
    meta_data JSONB DEFAULT '{}',
    changed_by UUID REFERENCES auth.users(id),
    change_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for version history
CREATE INDEX IF NOT EXISTS idx_pages_history_page_id ON editable_pages_history(page_id);
CREATE INDEX IF NOT EXISTS idx_pages_history_version ON editable_pages_history(page_id, version);

-- Create page_sections table for section-based editing (alternative approach)
CREATE TABLE IF NOT EXISTS page_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_slug TEXT NOT NULL,
    section_key TEXT NOT NULL, -- 'hero', 'features', 'faq', 'testimonials', etc.
    section_type TEXT NOT NULL, -- 'hero', 'feature_grid', 'faq_list', 'text_block', etc.
    section_data JSONB NOT NULL DEFAULT '{}',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_slug, section_key)
);

-- Create index for page sections
CREATE INDEX IF NOT EXISTS idx_page_sections_slug ON page_sections(page_slug);
CREATE INDEX IF NOT EXISTS idx_page_sections_order ON page_sections(page_slug, display_order);

-- Enable Row Level Security
ALTER TABLE editable_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE editable_pages_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for editable_pages
-- Anyone can read published pages
CREATE POLICY "Anyone can read published pages"
    ON editable_pages FOR SELECT
    USING (is_published = true);

-- Only authenticated users can see unpublished pages
CREATE POLICY "Authenticated users can read all pages"
    ON editable_pages FOR SELECT
    TO authenticated
    USING (true);

-- Only admins can insert/update/delete pages
-- Note: You'll need to create an admin role or check email in your app
CREATE POLICY "Admins can manage pages"
    ON editable_pages FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for page_sections
CREATE POLICY "Anyone can read active sections"
    ON page_sections FOR SELECT
    USING (is_active = true);

CREATE POLICY "Authenticated users can read all sections"
    ON page_sections FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can manage sections"
    ON page_sections FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- RLS Policies for history
CREATE POLICY "Authenticated users can read history"
    ON editable_pages_history FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Admins can insert history"
    ON editable_pages_history FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for editable_pages
CREATE TRIGGER update_editable_pages_updated_at
    BEFORE UPDATE ON editable_pages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for page_sections
CREATE TRIGGER update_page_sections_updated_at
    BEFORE UPDATE ON page_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to save version history when page is updated
CREATE OR REPLACE FUNCTION save_page_version_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Only save history if page_data or meta_data changed
    IF OLD.page_data IS DISTINCT FROM NEW.page_data OR OLD.meta_data IS DISTINCT FROM NEW.meta_data THEN
        -- Increment version
        NEW.version = OLD.version + 1;
        
        -- Save old version to history
        INSERT INTO editable_pages_history (
            page_id,
            version,
            page_data,
            meta_data,
            changed_by,
            change_description
        ) VALUES (
            OLD.id,
            OLD.version,
            OLD.page_data,
            OLD.meta_data,
            NEW.updated_by,
            'Auto-saved version ' || OLD.version
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to save version history
CREATE TRIGGER save_page_version_on_update
    BEFORE UPDATE ON editable_pages
    FOR EACH ROW
    EXECUTE FUNCTION save_page_version_history();

-- Insert default page structures for all pages we want to make editable
-- These will be populated with actual content later

-- Homepage
INSERT INTO editable_pages (page_slug, page_title, page_description, page_data, meta_data)
VALUES (
    'homepage',
    'Language Gems - GCSE Language Learning Platform',
    'Interactive language learning games and resources for GCSE students',
    '{
        "hero": {
            "headline": "Master GCSE Languages Through Play",
            "subheadline": "Interactive games, vocabulary practice, and exam preparation for Spanish, French & German",
            "cta_primary": {"text": "Start Learning Free", "url": "/auth/signup-learner"},
            "cta_secondary": {"text": "Explore Games", "url": "/games"}
        },
        "features": [],
        "testimonials": [],
        "stats": [],
        "faq": []
    }'::jsonb,
    '{
        "title": "Language Gems - GCSE Language Learning Platform",
        "description": "Interactive language learning games and resources for GCSE students",
        "keywords": ["GCSE", "language learning", "Spanish", "French", "German"]
    }'::jsonb
)
ON CONFLICT (page_slug) DO NOTHING;

-- Schools Page
INSERT INTO editable_pages (page_slug, page_title, page_description, page_data, meta_data)
VALUES (
    'schools',
    'Language Gems for Schools',
    'Comprehensive GCSE language learning platform for UK schools',
    '{
        "hero": {},
        "differentiators": [],
        "pricing": [],
        "faq": [],
        "testimonials": []
    }'::jsonb,
    '{}'::jsonb
)
ON CONFLICT (page_slug) DO NOTHING;

-- Pricing Page
INSERT INTO editable_pages (page_slug, page_title, page_description, page_data, meta_data)
VALUES (
    'pricing',
    'Pricing - Language Gems',
    'Affordable language learning plans for individuals, families, and schools',
    '{
        "individual_plans": [],
        "school_plans": [],
        "features_comparison": []
    }'::jsonb,
    '{}'::jsonb
)
ON CONFLICT (page_slug) DO NOTHING;

-- About Page
INSERT INTO editable_pages (page_slug, page_title, page_description, page_data, meta_data)
VALUES (
    'about',
    'About Daniel Etienne - Language Gems Founder',
    'Meet the founder and learn about the mission behind Language Gems',
    '{
        "hero": {},
        "achievements": [],
        "values": [],
        "story": {}
    }'::jsonb,
    '{}'::jsonb
)
ON CONFLICT (page_slug) DO NOTHING;

-- Freebies Page
INSERT INTO editable_pages (page_slug, page_title, page_description, page_data, meta_data)
VALUES (
    'freebies',
    'Free Resources for Teachers',
    'Download free language teaching resources and worksheets',
    '{
        "hero": {},
        "freebies": []
    }'::jsonb,
    '{}'::jsonb
)
ON CONFLICT (page_slug) DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE editable_pages IS 'Stores editable page content for CMS functionality. Allows admin users to edit marketing and landing pages without code deployments.';
COMMENT ON TABLE editable_pages_history IS 'Version history for editable pages. Tracks all changes made to page content.';
COMMENT ON TABLE page_sections IS 'Alternative section-based approach for page editing. Allows editing individual sections of a page.';

