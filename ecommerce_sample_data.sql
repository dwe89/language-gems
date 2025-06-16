-- Sample Data for eCommerce System

-- Insert sample products
INSERT INTO public.products (name, slug, description, price_cents, tags, is_active) VALUES
('Complete French GCSE Vocabulary Pack', 'french-gcse-vocabulary-pack', 'Comprehensive vocabulary lists covering all GCSE French topics with audio pronunciation guides and practice exercises. Perfect for exam preparation.', 1999, ARRAY['french', 'gcse', 'vocabulary', 'audio'], true),

('Spanish Speaking Practice Worksheets', 'spanish-speaking-worksheets', 'Interactive speaking practice materials with role-play scenarios, conversation starters, and assessment rubrics for Spanish learners.', 1499, ARRAY['spanish', 'speaking', 'practice', 'worksheets'], true),

('German Grammar Masterclass Bundle', 'german-grammar-masterclass', 'Complete guide to German grammar with clear explanations, examples, and exercises covering all levels from beginner to advanced.', 2499, ARRAY['german', 'grammar', 'bundle', 'comprehensive'], true),

('Italian Culture & Language Pack', 'italian-culture-language-pack', 'Explore Italian culture while learning the language with authentic materials, cultural insights, and language activities.', 1799, ARRAY['italian', 'culture', 'authentic', 'materials'], true),

('Mandarin Character Writing Guide', 'mandarin-character-writing', 'Step-by-step guide to writing Mandarin characters with stroke order, practice sheets, and memory techniques.', 2199, ARRAY['mandarin', 'characters', 'writing', 'practice'], true),

('Language Learning Game Templates', 'language-learning-games', 'Ready-to-use game templates for any language classroom including board games, card games, and digital activities.', 1299, ARRAY['games', 'templates', 'activities', 'classroom'], true),

('Assessment & Testing Toolkit', 'assessment-testing-toolkit', 'Comprehensive collection of assessment tools, rubrics, and testing materials for modern foreign language teachers.', 2999, ARRAY['assessment', 'testing', 'toolkit', 'teacher'], true),

('Phonics & Pronunciation Guide - Multi Language', 'phonics-pronunciation-guide', 'International phonetic alphabet guide with audio examples for French, Spanish, German, and Italian pronunciation.', 1699, ARRAY['phonics', 'pronunciation', 'ipa', 'audio'], true);

-- Note: file_url will be populated when files are actually uploaded
-- stripe_product_id and stripe_price_id will be populated when integrated with Stripe 