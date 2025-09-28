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
    220,
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
    221,
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
    222,
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
    223,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'change_verbs',
    'change-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Change Verbs',
    'Learn Spanish change verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of change verbs', 'Apply change verbs rules correctly in context', 'Identify change verbs in Spanish texts and speech', 'Use change verbs accurately in written and spoken Spanish'],
    224,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'cognitive_verbs',
    'cognitive-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Cognitive Verbs',
    'Learn Spanish cognitive verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of cognitive verbs', 'Apply cognitive verbs rules correctly in context', 'Identify cognitive verbs in Spanish texts and speech', 'Use cognitive verbs accurately in written and spoken Spanish'],
    225,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'communication_verbs',
    'communication-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Communication Verbs',
    'Learn Spanish communication verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of communication verbs', 'Apply communication verbs rules correctly in context', 'Identify communication verbs in Spanish texts and speech', 'Use communication verbs accurately in written and spoken Spanish'],
    226,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'compound_tenses',
    'compound-tenses',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Compound Tenses',
    'Learn Spanish compound tenses with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of compound tenses', 'Apply compound tenses rules correctly in context', 'Identify compound tenses in Spanish texts and speech', 'Use compound tenses accurately in written and spoken Spanish'],
    227,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'conditional',
    'conditional',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Conditional',
    'Learn Spanish conditional with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of conditional', 'Apply conditional rules correctly in context', 'Identify conditional in Spanish texts and speech', 'Use conditional accurately in written and spoken Spanish'],
    228,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'conditional_perfect',
    'conditional-perfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Conditional Perfect',
    'Learn Spanish conditional perfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of conditional perfect', 'Apply conditional perfect rules correctly in context', 'Identify conditional perfect in Spanish texts and speech', 'Use conditional perfect accurately in written and spoken Spanish'],
    229,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'conditional_sentences',
    'conditional-sentences',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Conditional Sentences',
    'Learn Spanish conditional sentences with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of conditional sentences', 'Apply conditional sentences rules correctly in context', 'Identify conditional sentences in Spanish texts and speech', 'Use conditional sentences accurately in written and spoken Spanish'],
    230,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'conditional_tense',
    'conditional-tense',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Conditional Tense',
    'Learn Spanish conditional tense with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of conditional tense', 'Apply conditional tense rules correctly in context', 'Identify conditional tense in Spanish texts and speech', 'Use conditional tense accurately in written and spoken Spanish'],
    231,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'continuous_constructions',
    'continuous-constructions',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Continuous Constructions',
    'Learn Spanish continuous constructions with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of continuous constructions', 'Apply continuous constructions rules correctly in context', 'Identify continuous constructions in Spanish texts and speech', 'Use continuous constructions accurately in written and spoken Spanish'],
    232,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'copular_verbs',
    'copular-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Copular Verbs',
    'Learn Spanish copular verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of copular verbs', 'Apply copular verbs rules correctly in context', 'Identify copular verbs in Spanish texts and speech', 'Use copular verbs accurately in written and spoken Spanish'],
    233,
    true,
    ARRAY[]::uuid[]
  );

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
    234,
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
    235,
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
    236,
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
    237,
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
    238,
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
    239,
    true,
    ARRAY[]::uuid[]
  );