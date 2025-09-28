INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'definite_indefinite',
    'definite-indefinite',
    'es',
    'nouns',
    'intermediate',
    'KS3',
    'Definite Indefinite',
    'Learn Spanish definite indefinite with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of definite indefinite', 'Apply definite indefinite rules correctly in context', 'Identify definite indefinite in Spanish texts and speech', 'Use definite indefinite accurately in written and spoken Spanish'],
    110,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'gender_and_plurals',
    'gender-and-plurals',
    'es',
    'nouns',
    'beginner',
    'KS3',
    'Gender And Plurals',
    'Learn Spanish gender and plurals with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of gender and plurals', 'Apply gender and plurals rules correctly in context', 'Identify gender and plurals in Spanish texts and speech', 'Use gender and plurals accurately in written and spoken Spanish'],
    111,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'gender_rules',
    'gender-rules',
    'es',
    'nouns',
    'beginner',
    'KS3',
    'Gender Rules',
    'Learn Spanish gender rules with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of gender rules', 'Apply gender rules rules correctly in context', 'Identify gender rules in Spanish texts and speech', 'Use gender rules accurately in written and spoken Spanish'],
    112,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'nominalisation',
    'nominalisation',
    'es',
    'nouns',
    'advanced',
    'KS3',
    'Nominalisation',
    'Learn Spanish nominalisation with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of nominalisation', 'Apply nominalisation rules correctly in context', 'Identify nominalisation in Spanish texts and speech', 'Use nominalisation accurately in written and spoken Spanish'],
    113,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'plurals',
    'plurals',
    'es',
    'nouns',
    'beginner',
    'KS3',
    'Plurals',
    'Learn Spanish plurals with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of plurals', 'Apply plurals rules correctly in context', 'Identify plurals in Spanish texts and speech', 'Use plurals accurately in written and spoken Spanish'],
    114,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'possessive_adj',
    'possessive-adj',
    'es',
    'nouns',
    'intermediate',
    'KS3',
    'Possessive Adj',
    'Learn Spanish possessive adj with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of possessive adj', 'Apply possessive adj rules correctly in context', 'Identify possessive adj in Spanish texts and speech', 'Use possessive adj accurately in written and spoken Spanish'],
    115,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'direct_object',
    'direct-object',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Direct Object',
    'Understand Spanish direct object with detailed explanations and practice',
    ARRAY['Understand the concept and usage of direct object', 'Apply direct object rules correctly in context', 'Identify direct object in Spanish texts and speech', 'Use direct object accurately in written and spoken Spanish'],
    116,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'indirect_object',
    'indirect-object',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Indirect Object',
    'Understand Spanish indirect object with detailed explanations and practice',
    ARRAY['Understand the concept and usage of indirect object', 'Apply indirect object rules correctly in context', 'Identify indirect object in Spanish texts and speech', 'Use indirect object accurately in written and spoken Spanish'],
    117,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'interrogative',
    'interrogative',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Interrogative',
    'Understand Spanish interrogative with detailed explanations and practice',
    ARRAY['Understand the concept and usage of interrogative', 'Apply interrogative rules correctly in context', 'Identify interrogative in Spanish texts and speech', 'Use interrogative accurately in written and spoken Spanish'],
    118,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'personal',
    'personal',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Personal',
    'Understand Spanish personal with detailed explanations and practice',
    ARRAY['Understand the concept and usage of personal', 'Apply personal rules correctly in context', 'Identify personal in Spanish texts and speech', 'Use personal accurately in written and spoken Spanish'],
    119,
    true,
    ARRAY[]::uuid[]
  );