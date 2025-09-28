INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'por_vs_para',
    'por-vs-para',
    'es',
    'adverbial-prepositional',
    'intermediate',
    'KS3',
    'Por Vs Para',
    'Learn por vs para usage in Spanish with detailed explanations',
    ARRAY['Understand the concept and usage of por vs para', 'Apply por vs para rules correctly in context', 'Identify por vs para in Spanish texts and speech', 'Use por vs para accurately in written and spoken Spanish'],
    200,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'formation',
    'formation',
    'es',
    'adverbs',
    'intermediate',
    'KS3',
    'Formation',
    'Understand formation in Spanish adverbs with practical applications',
    ARRAY['Understand the concept and usage of formation', 'Apply formation rules correctly in context', 'Identify formation in Spanish texts and speech', 'Use formation accurately in written and spoken Spanish'],
    201,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'definite_articles',
    'definite-articles',
    'es',
    'articles',
    'beginner',
    'KS3',
    'Definite Articles',
    'Master Spanish definite articles with clear rules and examples',
    ARRAY['Understand the concept and usage of definite articles', 'Apply definite articles rules correctly in context', 'Identify definite articles in Spanish texts and speech', 'Use definite articles accurately in written and spoken Spanish'],
    202,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'definite_indefinite',
    'definite-indefinite',
    'es',
    'articles',
    'intermediate',
    'KS3',
    'Definite Indefinite',
    'Master Spanish definite indefinite with clear rules and examples',
    ARRAY['Understand the concept and usage of definite indefinite', 'Apply definite indefinite rules correctly in context', 'Identify definite indefinite in Spanish texts and speech', 'Use definite indefinite accurately in written and spoken Spanish'],
    203,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'agreement_position',
    'agreement-position',
    'es',
    'nouns',
    'intermediate',
    'KS3',
    'Agreement Position',
    'Learn Spanish agreement position with comprehensive grammar rules',
    ARRAY['Understand the concept and usage of agreement position', 'Apply agreement position rules correctly in context', 'Identify agreement position in Spanish texts and speech', 'Use agreement position accurately in written and spoken Spanish'],
    204,
    true,
    ARRAY[]::uuid[]
  );

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
    205,
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
    206,
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
    207,
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
    208,
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
    209,
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
    210,
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
    211,
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
    212,
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
    213,
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
    214,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'reflexive',
    'reflexive',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Reflexive',
    'Understand Spanish reflexive with detailed explanations and practice',
    ARRAY['Understand the concept and usage of reflexive', 'Apply reflexive rules correctly in context', 'Identify reflexive in Spanish texts and speech', 'Use reflexive accurately in written and spoken Spanish'],
    215,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'relative',
    'relative',
    'es',
    'pronouns',
    'advanced',
    'KS3',
    'Relative',
    'Understand Spanish relative with detailed explanations and practice',
    ARRAY['Understand the concept and usage of relative', 'Apply relative rules correctly in context', 'Identify relative in Spanish texts and speech', 'Use relative accurately in written and spoken Spanish'],
    216,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subject',
    'subject',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Subject',
    'Understand Spanish subject with detailed explanations and practice',
    ARRAY['Understand the concept and usage of subject', 'Apply subject rules correctly in context', 'Identify subject in Spanish texts and speech', 'Use subject accurately in written and spoken Spanish'],
    217,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'sound_symbol',
    'sound-symbol',
    'es',
    'sounds-spelling',
    'intermediate',
    'KS3',
    'Sound Symbol',
    'Master Spanish sound symbol with pronunciation and spelling rules',
    ARRAY['Understand the concept and usage of sound symbol', 'Apply sound symbol rules correctly in context', 'Identify sound symbol in Spanish texts and speech', 'Use sound symbol accurately in written and spoken Spanish'],
    218,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'stress_patterns',
    'stress-patterns',
    'es',
    'sounds-spelling',
    'intermediate',
    'KS3',
    'Stress Patterns',
    'Master Spanish stress patterns with pronunciation and spelling rules',
    ARRAY['Understand the concept and usage of stress patterns', 'Apply stress patterns rules correctly in context', 'Identify stress patterns in Spanish texts and speech', 'Use stress patterns accurately in written and spoken Spanish'],
    219,
    true,
    ARRAY[]::uuid[]
  );