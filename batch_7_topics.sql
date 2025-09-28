INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'past_participles',
    'past-participles',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Past Participles',
    'Learn Spanish past participles with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of past participles', 'Apply past participles rules correctly in context', 'Identify past participles in Spanish texts and speech', 'Use past participles accurately in written and spoken Spanish'],
    160,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'perception_verbs',
    'perception-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Perception Verbs',
    'Learn Spanish perception verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of perception verbs', 'Apply perception verbs rules correctly in context', 'Identify perception verbs in Spanish texts and speech', 'Use perception verbs accurately in written and spoken Spanish'],
    161,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'periphrastic_future',
    'periphrastic-future',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Periphrastic Future',
    'Learn Spanish periphrastic future with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of periphrastic future', 'Apply periphrastic future rules correctly in context', 'Identify periphrastic future in Spanish texts and speech', 'Use periphrastic future accurately in written and spoken Spanish'],
    162,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'phrasal_verbs',
    'phrasal-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Phrasal Verbs',
    'Learn Spanish phrasal verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of phrasal verbs', 'Apply phrasal verbs rules correctly in context', 'Identify phrasal verbs in Spanish texts and speech', 'Use phrasal verbs accurately in written and spoken Spanish'],
    163,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'pluperfect',
    'pluperfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Pluperfect',
    'Learn Spanish pluperfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of pluperfect', 'Apply pluperfect rules correctly in context', 'Identify pluperfect in Spanish texts and speech', 'Use pluperfect accurately in written and spoken Spanish'],
    164,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'por_vs_para',
    'por-vs-para',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Por Vs Para',
    'Learn Spanish por vs para with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of por vs para', 'Apply por vs para rules correctly in context', 'Identify por vs para in Spanish texts and speech', 'Use por vs para accurately in written and spoken Spanish'],
    165,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'possession_verbs',
    'possession-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Possession Verbs',
    'Learn Spanish possession verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of possession verbs', 'Apply possession verbs rules correctly in context', 'Identify possession verbs in Spanish texts and speech', 'Use possession verbs accurately in written and spoken Spanish'],
    166,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'present_continuous',
    'present-continuous',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Present Continuous',
    'Learn Spanish present continuous with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of present continuous', 'Apply present continuous rules correctly in context', 'Identify present continuous in Spanish texts and speech', 'Use present continuous accurately in written and spoken Spanish'],
    167,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'present_perfect',
    'present-perfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Present Perfect',
    'Learn Spanish present perfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of present perfect', 'Apply present perfect rules correctly in context', 'Identify present perfect in Spanish texts and speech', 'Use present perfect accurately in written and spoken Spanish'],
    168,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'present_tense',
    'present-tense',
    'es',
    'verbs',
    'beginner',
    'KS3',
    'Present Tense',
    'Learn Spanish present tense with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of present tense', 'Apply present tense rules correctly in context', 'Identify present tense in Spanish texts and speech', 'Use present tense accurately in written and spoken Spanish'],
    169,
    true,
    ARRAY[]::uuid[]
  );