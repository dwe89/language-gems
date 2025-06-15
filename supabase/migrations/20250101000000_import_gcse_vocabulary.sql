-- Migration to import GCSE Spanish vocabulary from CSV data
-- This will create vocabulary lists organized by theme and topic

-- First, let's create vocabulary lists for each theme and topic
INSERT INTO public.vocabulary_lists (id, name, description, theme_id, topic_id, difficulty) VALUES
-- People and lifestyle theme
('theme1-topic1', 'Education and work', 'GCSE Spanish vocabulary for education and work topics', 'people-lifestyle', 'education-work', 1),
('theme1-topic2', 'Healthy living and lifestyle', 'GCSE Spanish vocabulary for health and lifestyle topics', 'people-lifestyle', 'healthy-living', 1),
('theme1-topic3', 'Identity and relationships', 'GCSE Spanish vocabulary for identity and relationships', 'people-lifestyle', 'identity-relationships', 1),

-- Popular culture theme  
('theme2-topic1', 'Celebrity culture', 'GCSE Spanish vocabulary for celebrity culture', 'popular-culture', 'celebrity-culture', 1),
('theme2-topic2', 'Customs, festivals and celebrations', 'GCSE Spanish vocabulary for customs and celebrations', 'popular-culture', 'customs-festivals', 1),
('theme2-topic3', 'Free time activities', 'GCSE Spanish vocabulary for free time activities', 'popular-culture', 'free-time', 1),

-- Communication and the world around us theme
('theme3-topic1', 'Environment and where people live', 'GCSE Spanish vocabulary for environment and living', 'communication-world', 'environment-living', 1),
('theme3-topic2', 'Media and technology', 'GCSE Spanish vocabulary for media and technology', 'communication-world', 'media-technology', 1),
('theme3-topic3', 'Travel and tourism', 'GCSE Spanish vocabulary for travel and tourism', 'communication-world', 'travel-tourism', 1),

-- General vocabulary (for words that span multiple themes)
('general-vocabulary', 'General Spanish Vocabulary', 'General Spanish vocabulary that applies across themes', 'general', 'general', 1)
ON CONFLICT (id) DO NOTHING;

-- Create a function to import vocabulary items from CSV data
-- This function will be called with the actual CSV data

CREATE OR REPLACE FUNCTION import_gcse_vocabulary(
  theme_name TEXT,
  topic_name TEXT,
  part_of_speech TEXT,
  spanish_term TEXT,
  english_translation TEXT
) RETURNS VOID AS $$
DECLARE
  list_id TEXT;
  theme_code TEXT;
  topic_code TEXT;
  existing_count INTEGER;
BEGIN
  -- Map theme names to codes
  CASE theme_name
    WHEN 'People and lifestyle' THEN theme_code := 'people-lifestyle';
    WHEN 'Popular culture' THEN theme_code := 'popular-culture';
    WHEN 'Communication and the world around us' THEN theme_code := 'communication-world';
    ELSE theme_code := 'general';
  END CASE;
  
  -- Map topic names to codes and get list_id
  CASE topic_name
    WHEN 'Education and work' THEN 
      topic_code := 'education-work';
      list_id := 'theme1-topic1';
    WHEN 'Healthy living and lifestyle' THEN 
      topic_code := 'healthy-living';
      list_id := 'theme1-topic2';
    WHEN 'Identity and relationships' THEN 
      topic_code := 'identity-relationships';
      list_id := 'theme1-topic3';
    WHEN 'Celebrity culture' THEN 
      topic_code := 'celebrity-culture';
      list_id := 'theme2-topic1';
    WHEN 'Customs, festivals and celebrations' THEN 
      topic_code := 'customs-festivals';
      list_id := 'theme2-topic2';
    WHEN 'Free time activities' THEN 
      topic_code := 'free-time';
      list_id := 'theme2-topic3';
    WHEN 'Environment and where people live' THEN 
      topic_code := 'environment-living';
      list_id := 'theme3-topic1';
    WHEN 'Media and technology' THEN 
      topic_code := 'media-technology';
      list_id := 'theme3-topic2';
    WHEN 'Travel and tourism' THEN 
      topic_code := 'travel-tourism';
      list_id := 'theme3-topic3';
    ELSE 
      topic_code := 'general';
      list_id := 'general-vocabulary';
  END CASE;
  
  -- Check if this vocabulary item already exists
  SELECT COUNT(*) INTO existing_count
  FROM public.vocabulary_items
  WHERE list_id = import_gcse_vocabulary.list_id 
    AND term = spanish_term;
  
  -- Only insert if it doesn't already exist
  IF existing_count = 0 THEN
    INSERT INTO public.vocabulary_items (
      list_id,
      term,
      translation,
      notes,
      created_at,
      updated_at
    ) VALUES (
      import_gcse_vocabulary.list_id,
      spanish_term,
      english_translation,
      'Part of speech: ' || part_of_speech || ' | Theme: ' || theme_name || ' | Topic: ' || topic_name,
      NOW(),
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Example usage (you'll replace this with actual CSV data):
-- SELECT import_gcse_vocabulary('People and lifestyle', 'Education and work', 'N (m)', 'el colegio', 'school');
-- SELECT import_gcse_vocabulary('People and lifestyle', 'Education and work', 'N (f)', 'la asignatura', 'subject');

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS vocabulary_items_theme_idx ON public.vocabulary_items((notes));
CREATE INDEX IF NOT EXISTS vocabulary_lists_theme_topic_idx ON public.vocabulary_lists(theme_id, topic_id); 