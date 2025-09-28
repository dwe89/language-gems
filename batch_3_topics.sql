INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'possessive',
    'possessive',
    'es',
    'pronouns',
    'intermediate',
    'KS3',
    'Possessive',
    'Understand Spanish possessive with detailed explanations and practice',
    ARRAY['Understand the concept and usage of possessive', 'Apply possessive rules correctly in context', 'Identify possessive in Spanish texts and speech', 'Use possessive accurately in written and spoken Spanish'],
    120,
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
    121,
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
    122,
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
    123,
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
    124,
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
    125,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'written_accents',
    'written-accents',
    'es',
    'sounds-spelling',
    'intermediate',
    'KS3',
    'Written Accents',
    'Master Spanish written accents with pronunciation and spelling rules',
    ARRAY['Understand the concept and usage of written accents', 'Apply written accents rules correctly in context', 'Identify written accents in Spanish texts and speech', 'Use written accents accurately in written and spoken Spanish'],
    126,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'action_verbs',
    'action-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Action Verbs',
    'Learn Spanish action verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of action verbs', 'Apply action verbs rules correctly in context', 'Identify action verbs in Spanish texts and speech', 'Use action verbs accurately in written and spoken Spanish'],
    127,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'auxiliary_verbs',
    'auxiliary-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Auxiliary Verbs',
    'Learn Spanish auxiliary verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of auxiliary verbs', 'Apply auxiliary verbs rules correctly in context', 'Identify auxiliary verbs in Spanish texts and speech', 'Use auxiliary verbs accurately in written and spoken Spanish'],
    128,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'causative_verbs',
    'causative-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Causative Verbs',
    'Learn Spanish causative verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of causative verbs', 'Apply causative verbs rules correctly in context', 'Identify causative verbs in Spanish texts and speech', 'Use causative verbs accurately in written and spoken Spanish'],
    129,
    true,
    ARRAY[]::uuid[]
  );