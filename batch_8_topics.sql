INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'preterite',
    'preterite',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Preterite',
    'Learn Spanish preterite with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of preterite', 'Apply preterite rules correctly in context', 'Identify preterite in Spanish texts and speech', 'Use preterite accurately in written and spoken Spanish'],
    170,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'progressive_tenses',
    'progressive-tenses',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Progressive Tenses',
    'Learn Spanish progressive tenses with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of progressive tenses', 'Apply progressive tenses rules correctly in context', 'Identify progressive tenses in Spanish texts and speech', 'Use progressive tenses accurately in written and spoken Spanish'],
    171,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'pronominal_verbs',
    'pronominal-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Pronominal Verbs',
    'Learn Spanish pronominal verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of pronominal verbs', 'Apply pronominal verbs rules correctly in context', 'Identify pronominal verbs in Spanish texts and speech', 'Use pronominal verbs accurately in written and spoken Spanish'],
    172,
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
    'verbs',
    'intermediate',
    'KS3',
    'Reflexive',
    'Learn Spanish reflexive with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of reflexive', 'Apply reflexive rules correctly in context', 'Identify reflexive in Spanish texts and speech', 'Use reflexive accurately in written and spoken Spanish'],
    173,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'reported_speech',
    'reported-speech',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Reported Speech',
    'Learn Spanish reported speech with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of reported speech', 'Apply reported speech rules correctly in context', 'Identify reported speech in Spanish texts and speech', 'Use reported speech accurately in written and spoken Spanish'],
    174,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'sequence_of_tenses',
    'sequence-of-tenses',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Sequence Of Tenses',
    'Learn Spanish sequence of tenses with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of sequence of tenses', 'Apply sequence of tenses rules correctly in context', 'Identify sequence of tenses in Spanish texts and speech', 'Use sequence of tenses accurately in written and spoken Spanish'],
    175,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'ser_vs_estar',
    'ser-vs-estar',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Ser Vs Estar',
    'Learn Spanish ser vs estar with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of ser vs estar', 'Apply ser vs estar rules correctly in context', 'Identify ser vs estar in Spanish texts and speech', 'Use ser vs estar accurately in written and spoken Spanish'],
    176,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'stative_verbs',
    'stative-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Stative Verbs',
    'Learn Spanish stative verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of stative verbs', 'Apply stative verbs rules correctly in context', 'Identify stative verbs in Spanish texts and speech', 'Use stative verbs accurately in written and spoken Spanish'],
    177,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'stem_changing',
    'stem-changing',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Stem Changing',
    'Learn Spanish stem changing with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of stem changing', 'Apply stem changing rules correctly in context', 'Identify stem changing in Spanish texts and speech', 'Use stem changing accurately in written and spoken Spanish'],
    178,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subjunctive',
    'subjunctive',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Subjunctive',
    'Learn Spanish subjunctive with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of subjunctive', 'Apply subjunctive rules correctly in context', 'Identify subjunctive in Spanish texts and speech', 'Use subjunctive accurately in written and spoken Spanish'],
    179,
    true,
    ARRAY[]::uuid[]
  );