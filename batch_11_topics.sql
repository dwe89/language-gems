INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'augmentative_suffixes',
    'augmentative-suffixes',
    'es',
    'word-formation',
    'intermediate',
    'KS3',
    'Augmentative Suffixes',
    'Understand Spanish augmentative suffixes with formation rules and examples',
    ARRAY['Understand the concept and usage of augmentative suffixes', 'Apply augmentative suffixes rules correctly in context', 'Identify augmentative suffixes in Spanish texts and speech', 'Use augmentative suffixes accurately in written and spoken Spanish'],
    200,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'diminutive_suffixes',
    'diminutive-suffixes',
    'es',
    'word-formation',
    'intermediate',
    'KS3',
    'Diminutive Suffixes',
    'Understand Spanish diminutive suffixes with formation rules and examples',
    ARRAY['Understand the concept and usage of diminutive suffixes', 'Apply diminutive suffixes rules correctly in context', 'Identify diminutive suffixes in Spanish texts and speech', 'Use diminutive suffixes accurately in written and spoken Spanish'],
    201,
    true,
    ARRAY[]::uuid[]
  );