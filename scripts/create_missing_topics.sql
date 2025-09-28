-- Create all 102 missing Spanish grammar topics
-- Fixed to use proper UUID arrays for prerequisite_topics

-- ADJECTIVES (4 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
(gen_random_uuid(), 'agreement', 'agreement', 'es', 'adjectives', 'intermediate', 'KS3',
 'Agreement', 'Learn about agreement in Spanish adjectives',
 ARRAY['Understand the concept of agreement', 'Apply agreement rules correctly', 'Identify agreement in context', 'Use agreement in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'comparison', 'comparison', 'es', 'adjectives', 'intermediate', 'KS3',
 'Comparison', 'Learn about comparison in Spanish adjectives',
 ARRAY['Understand the concept of comparison', 'Apply comparison rules correctly', 'Identify comparison in context', 'Use comparison in sentences'],
 2, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'position', 'position', 'es', 'adjectives', 'intermediate', 'KS3',
 'Position', 'Learn about position in Spanish adjectives',
 ARRAY['Understand the concept of position', 'Apply position rules correctly', 'Identify position in context', 'Use position in sentences'],
 3, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'possessive', 'possessive', 'es', 'adjectives', 'intermediate', 'KS3',
 'Possessive', 'Learn about possessive in Spanish adjectives',
 ARRAY['Understand the concept of possessive', 'Apply possessive rules correctly', 'Identify possessive in context', 'Use possessive in sentences'],
 4, true, ARRAY[]::uuid[]);

-- ADVERBIAL-PREPOSITIONAL (2 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
(gen_random_uuid(), 'personal_a', 'personal-a', 'es', 'adverbial-prepositional', 'intermediate', 'KS3',
 'Personal A', 'Master personal a in Spanish',
 ARRAY['Understand when to use personal a', 'Apply personal a rules correctly', 'Identify personal a in context', 'Use personal a in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'por_vs_para', 'por-vs-para', 'es', 'adverbial-prepositional', 'advanced', 'KS3',
 'Por Vs Para', 'Master por vs para in Spanish',
 ARRAY['Understand the difference between por and para', 'Apply por vs para rules correctly', 'Identify por vs para in context', 'Use por vs para in sentences'],
 2, true, ARRAY[]::uuid[]);

-- ADVERBS (1 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
(gen_random_uuid(), 'formation', 'formation', 'es', 'adverbs', 'intermediate', 'KS3',
 'Formation', 'Understand formation in Spanish adverbs',
 ARRAY['Understand the concept of formation', 'Apply formation rules correctly', 'Identify formation in context', 'Use formation in sentences'],
 1, true, ARRAY[]::uuid[]);

-- ARTICLES (2 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
(gen_random_uuid(), 'definite_articles', 'definite-articles', 'es', 'articles', 'beginner', 'KS3',
 'Definite Articles', 'Learn Spanish definite articles',
 ARRAY['Understand the concept of definite articles', 'Apply definite articles rules correctly', 'Identify definite articles in context', 'Use definite articles in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'definite_indefinite', 'definite-indefinite', 'es', 'articles', 'intermediate', 'KS3',
 'Definite Indefinite', 'Learn Spanish definite indefinite',
 ARRAY['Understand the concept of definite indefinite', 'Apply definite indefinite rules correctly', 'Identify definite indefinite in context', 'Use definite indefinite in sentences'],
 2, true, ARRAY[]::uuid[]);

-- NOUNS (7 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES 
(gen_random_uuid(), 'agreement_position', 'agreement-position', 'es', 'nouns', 'intermediate', 'KS3',
 'Agreement Position', 'Master Spanish agreement position',
 ARRAY['Understand the concept of agreement position', 'Apply agreement position rules correctly', 'Identify agreement position in context', 'Use agreement position in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'definite_indefinite_nouns', 'definite-indefinite', 'es', 'nouns', 'intermediate', 'KS3',
 'Definite Indefinite', 'Master Spanish definite indefinite',
 ARRAY['Understand the concept of definite indefinite', 'Apply definite indefinite rules correctly', 'Identify definite indefinite in context', 'Use definite indefinite in sentences'],
 2, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'gender_and_plurals', 'gender-and-plurals', 'es', 'nouns', 'beginner', 'KS3',
 'Gender And Plurals', 'Master Spanish gender and plurals',
 ARRAY['Understand the concept of gender and plurals', 'Apply gender and plurals rules correctly', 'Identify gender and plurals in context', 'Use gender and plurals in sentences'],
 3, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'gender_rules', 'gender-rules', 'es', 'nouns', 'beginner', 'KS3',
 'Gender Rules', 'Master Spanish gender rules',
 ARRAY['Understand the concept of gender rules', 'Apply gender rules correctly', 'Identify gender rules in context', 'Use gender rules in sentences'],
 4, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'nominalisation', 'nominalisation', 'es', 'nouns', 'advanced', 'KS3',
 'Nominalisation', 'Master Spanish nominalisation',
 ARRAY['Understand the concept of nominalisation', 'Apply nominalisation rules correctly', 'Identify nominalisation in context', 'Use nominalisation in sentences'],
 5, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'plurals', 'plurals', 'es', 'nouns', 'beginner', 'KS3',
 'Plurals', 'Master Spanish plurals',
 ARRAY['Understand the concept of plurals', 'Apply plurals rules correctly', 'Identify plurals in context', 'Use plurals in sentences'],
 6, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'possessive_adj', 'possessive-adj', 'es', 'nouns', 'intermediate', 'KS3',
 'Possessive Adj', 'Master Spanish possessive adj',
 ARRAY['Understand the concept of possessive adj', 'Apply possessive adj rules correctly', 'Identify possessive adj in context', 'Use possessive adj in sentences'],
 7, true, ARRAY[]::uuid[]);

-- PRONOUNS (8 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES
(gen_random_uuid(), 'direct_object', 'direct-object', 'es', 'pronouns', 'intermediate', 'KS3',
 'Direct Object', 'Understand Spanish direct object',
 ARRAY['Understand the concept of direct object', 'Apply direct object rules correctly', 'Identify direct object in context', 'Use direct object in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'indirect_object', 'indirect-object', 'es', 'pronouns', 'intermediate', 'KS3',
 'Indirect Object', 'Understand Spanish indirect object',
 ARRAY['Understand the concept of indirect object', 'Apply indirect object rules correctly', 'Identify indirect object in context', 'Use indirect object in sentences'],
 2, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'interrogative', 'interrogative', 'es', 'pronouns', 'intermediate', 'KS3',
 'Interrogative', 'Understand Spanish interrogative',
 ARRAY['Understand the concept of interrogative', 'Apply interrogative rules correctly', 'Identify interrogative in context', 'Use interrogative in sentences'],
 3, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'personal', 'personal', 'es', 'pronouns', 'beginner', 'KS3',
 'Personal', 'Understand Spanish personal',
 ARRAY['Understand the concept of personal', 'Apply personal rules correctly', 'Identify personal in context', 'Use personal in sentences'],
 4, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'possessive_pronouns', 'possessive', 'es', 'pronouns', 'intermediate', 'KS3',
 'Possessive', 'Understand Spanish possessive',
 ARRAY['Understand the concept of possessive', 'Apply possessive rules correctly', 'Identify possessive in context', 'Use possessive in sentences'],
 5, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'reflexive_pronouns', 'reflexive', 'es', 'pronouns', 'intermediate', 'KS3',
 'Reflexive', 'Understand Spanish reflexive',
 ARRAY['Understand the concept of reflexive', 'Apply reflexive rules correctly', 'Identify reflexive in context', 'Use reflexive in sentences'],
 6, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'relative', 'relative', 'es', 'pronouns', 'advanced', 'KS3',
 'Relative', 'Understand Spanish relative',
 ARRAY['Understand the concept of relative', 'Apply relative rules correctly', 'Identify relative in context', 'Use relative in sentences'],
 7, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'subject', 'subject', 'es', 'pronouns', 'beginner', 'KS3',
 'Subject', 'Understand Spanish subject',
 ARRAY['Understand the concept of subject', 'Apply subject rules correctly', 'Identify subject in context', 'Use subject in sentences'],
 8, true, ARRAY[]::uuid[]);

-- SOUNDS-SPELLING (3 missing)
INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES
(gen_random_uuid(), 'sound_symbol', 'sound-symbol', 'es', 'sounds-spelling', 'intermediate', 'KS3',
 'Sound Symbol', 'Master Spanish sound symbol',
 ARRAY['Understand the concept of sound symbol', 'Apply sound symbol rules correctly', 'Identify sound symbol in context', 'Use sound symbol in sentences'],
 1, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'stress_patterns', 'stress-patterns', 'es', 'sounds-spelling', 'intermediate', 'KS3',
 'Stress Patterns', 'Master Spanish stress patterns',
 ARRAY['Understand the concept of stress patterns', 'Apply stress patterns rules correctly', 'Identify stress patterns in context', 'Use stress patterns in sentences'],
 2, true, ARRAY[]::uuid[]),

(gen_random_uuid(), 'written_accents', 'written-accents', 'es', 'sounds-spelling', 'intermediate', 'KS3',
 'Written Accents', 'Master Spanish written accents',
 ARRAY['Understand the concept of written accents', 'Apply written accents rules correctly', 'Identify written accents in context', 'Use written accents in sentences'],
 3, true, ARRAY[]::uuid[]);
