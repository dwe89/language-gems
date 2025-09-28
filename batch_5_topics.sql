INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'defective_verbs',
    'defective-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Defective Verbs',
    'Learn Spanish defective verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of defective verbs', 'Apply defective verbs rules correctly in context', 'Identify defective verbs in Spanish texts and speech', 'Use defective verbs accurately in written and spoken Spanish'],
    140,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'emotion_verbs',
    'emotion-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Emotion Verbs',
    'Learn Spanish emotion verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of emotion verbs', 'Apply emotion verbs rules correctly in context', 'Identify emotion verbs in Spanish texts and speech', 'Use emotion verbs accurately in written and spoken Spanish'],
    141,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'existential_verbs',
    'existential-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Existential Verbs',
    'Learn Spanish existential verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of existential verbs', 'Apply existential verbs rules correctly in context', 'Identify existential verbs in Spanish texts and speech', 'Use existential verbs accurately in written and spoken Spanish'],
    142,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'future',
    'future',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Future',
    'Learn Spanish future with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of future', 'Apply future rules correctly in context', 'Identify future in Spanish texts and speech', 'Use future accurately in written and spoken Spanish'],
    143,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'future_perfect',
    'future-perfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Future Perfect',
    'Learn Spanish future perfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of future perfect', 'Apply future perfect rules correctly in context', 'Identify future perfect in Spanish texts and speech', 'Use future perfect accurately in written and spoken Spanish'],
    144,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'future_tense',
    'future-tense',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Future Tense',
    'Learn Spanish future tense with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of future tense', 'Apply future tense rules correctly in context', 'Identify future tense in Spanish texts and speech', 'Use future tense accurately in written and spoken Spanish'],
    145,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'gerunds',
    'gerunds',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Gerunds',
    'Learn Spanish gerunds with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of gerunds', 'Apply gerunds rules correctly in context', 'Identify gerunds in Spanish texts and speech', 'Use gerunds accurately in written and spoken Spanish'],
    146,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'imperative',
    'imperative',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Imperative',
    'Learn Spanish imperative with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of imperative', 'Apply imperative rules correctly in context', 'Identify imperative in Spanish texts and speech', 'Use imperative accurately in written and spoken Spanish'],
    147,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'imperfect',
    'imperfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Imperfect',
    'Learn Spanish imperfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of imperfect', 'Apply imperfect rules correctly in context', 'Identify imperfect in Spanish texts and speech', 'Use imperfect accurately in written and spoken Spanish'],
    148,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'imperfect_continuous',
    'imperfect-continuous',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Imperfect Continuous',
    'Learn Spanish imperfect continuous with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of imperfect continuous', 'Apply imperfect continuous rules correctly in context', 'Identify imperfect continuous in Spanish texts and speech', 'Use imperfect continuous accurately in written and spoken Spanish'],
    149,
    true,
    ARRAY[]::uuid[]
  );