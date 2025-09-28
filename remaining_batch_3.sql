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
    240,
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
    241,
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
    242,
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
    243,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'impersonal_verbs',
    'impersonal-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Impersonal Verbs',
    'Learn Spanish impersonal verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of impersonal verbs', 'Apply impersonal verbs rules correctly in context', 'Identify impersonal verbs in Spanish texts and speech', 'Use impersonal verbs accurately in written and spoken Spanish'],
    244,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'inchoative_verbs',
    'inchoative-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Inchoative Verbs',
    'Learn Spanish inchoative verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of inchoative verbs', 'Apply inchoative verbs rules correctly in context', 'Identify inchoative verbs in Spanish texts and speech', 'Use inchoative verbs accurately in written and spoken Spanish'],
    245,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'infinitive_constructions',
    'infinitive-constructions',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Infinitive Constructions',
    'Learn Spanish infinitive constructions with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of infinitive constructions', 'Apply infinitive constructions rules correctly in context', 'Identify infinitive constructions in Spanish texts and speech', 'Use infinitive constructions accurately in written and spoken Spanish'],
    246,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'interrogatives',
    'interrogatives',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Interrogatives',
    'Learn Spanish interrogatives with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of interrogatives', 'Apply interrogatives rules correctly in context', 'Identify interrogatives in Spanish texts and speech', 'Use interrogatives accurately in written and spoken Spanish'],
    247,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'irregular_verbs',
    'irregular-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Irregular Verbs',
    'Learn Spanish irregular verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of irregular verbs', 'Apply irregular verbs rules correctly in context', 'Identify irregular verbs in Spanish texts and speech', 'Use irregular verbs accurately in written and spoken Spanish'],
    248,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'light_verbs',
    'light-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Light Verbs',
    'Learn Spanish light verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of light verbs', 'Apply light verbs rules correctly in context', 'Identify light verbs in Spanish texts and speech', 'Use light verbs accurately in written and spoken Spanish'],
    249,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'modal_verbs',
    'modal-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Modal Verbs',
    'Learn Spanish modal verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of modal verbs', 'Apply modal verbs rules correctly in context', 'Identify modal verbs in Spanish texts and speech', 'Use modal verbs accurately in written and spoken Spanish'],
    250,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'motion_verbs',
    'motion-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Motion Verbs',
    'Learn Spanish motion verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of motion verbs', 'Apply motion verbs rules correctly in context', 'Identify motion verbs in Spanish texts and speech', 'Use motion verbs accurately in written and spoken Spanish'],
    251,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'negation',
    'negation',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Negation',
    'Learn Spanish negation with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of negation', 'Apply negation rules correctly in context', 'Identify negation in Spanish texts and speech', 'Use negation accurately in written and spoken Spanish'],
    252,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'passive_voice',
    'passive-voice',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Passive Voice',
    'Learn Spanish passive voice with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of passive voice', 'Apply passive voice rules correctly in context', 'Identify passive voice in Spanish texts and speech', 'Use passive voice accurately in written and spoken Spanish'],
    253,
    true,
    ARRAY[]::uuid[]
  );

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
    254,
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
    255,
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
    256,
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
    257,
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
    258,
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
    259,
    true,
    ARRAY[]::uuid[]
  );