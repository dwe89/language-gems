-- Add structured categorization columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS language VARCHAR(20),
ADD COLUMN IF NOT EXISTS key_stage VARCHAR(10),
ADD COLUMN IF NOT EXISTS topic_slug VARCHAR(100),
ADD COLUMN IF NOT EXISTS theme_number INTEGER,
ADD COLUMN IF NOT EXISTS topic_number INTEGER,
ADD COLUMN IF NOT EXISTS category_type VARCHAR(20) DEFAULT 'topic';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_language ON products(language);
CREATE INDEX IF NOT EXISTS idx_products_key_stage ON products(key_stage);
CREATE INDEX IF NOT EXISTS idx_products_topic_slug ON products(topic_slug);
CREATE INDEX IF NOT EXISTS idx_products_category_type ON products(category_type);
CREATE INDEX IF NOT EXISTS idx_products_categorization ON products(language, key_stage, topic_slug);
CREATE INDEX IF NOT EXISTS idx_products_general_category ON products(language, key_stage, category_type);

-- Add comments for clarity
COMMENT ON COLUMN products.language IS 'Language: spanish, french, german';
COMMENT ON COLUMN products.key_stage IS 'Key Stage: ks3, ks4, ks5';
COMMENT ON COLUMN products.topic_slug IS 'URL-friendly topic identifier OR general category slug';
COMMENT ON COLUMN products.theme_number IS 'For KS4: 1, 2, or 3 (AQA themes)';
COMMENT ON COLUMN products.topic_number IS 'Topic number within theme (1, 2, 3)';
COMMENT ON COLUMN products.category_type IS 'Type: topic, grammar, exam-practice, core-skills, knowledge-organisers';