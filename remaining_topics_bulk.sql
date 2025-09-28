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
    260,
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
    261,
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
    262,
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
    263,
    true,
    ARRAY[]::uuid[]
  );

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
    264,
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
    265,
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
    266,
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
    267,
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
    268,
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
    269,
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
    270,
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
    271,
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
    272,
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
    273,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subjunctive_imperfect',
    'subjunctive-imperfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Subjunctive Imperfect',
    'Learn Spanish subjunctive imperfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of subjunctive imperfect', 'Apply subjunctive imperfect rules correctly in context', 'Identify subjunctive imperfect in Spanish texts and speech', 'Use subjunctive imperfect accurately in written and spoken Spanish'],
    274,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subjunctive_perfect',
    'subjunctive-perfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Subjunctive Perfect',
    'Learn Spanish subjunctive perfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of subjunctive perfect', 'Apply subjunctive perfect rules correctly in context', 'Identify subjunctive perfect in Spanish texts and speech', 'Use subjunctive perfect accurately in written and spoken Spanish'],
    275,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subjunctive_pluperfect',
    'subjunctive-pluperfect',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Subjunctive Pluperfect',
    'Learn Spanish subjunctive pluperfect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of subjunctive pluperfect', 'Apply subjunctive pluperfect rules correctly in context', 'Identify subjunctive pluperfect in Spanish texts and speech', 'Use subjunctive pluperfect accurately in written and spoken Spanish'],
    276,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'subjunctive_present',
    'subjunctive-present',
    'es',
    'verbs',
    'advanced',
    'KS3',
    'Subjunctive Present',
    'Learn Spanish subjunctive present with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of subjunctive present', 'Apply subjunctive present rules correctly in context', 'Identify subjunctive present in Spanish texts and speech', 'Use subjunctive present accurately in written and spoken Spanish'],
    277,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'terminative_verbs',
    'terminative-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Terminative Verbs',
    'Learn Spanish terminative verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of terminative verbs', 'Apply terminative verbs rules correctly in context', 'Identify terminative verbs in Spanish texts and speech', 'Use terminative verbs accurately in written and spoken Spanish'],
    278,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'transitive_intransitive',
    'transitive-intransitive',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Transitive Intransitive',
    'Learn Spanish transitive intransitive with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of transitive intransitive', 'Apply transitive intransitive rules correctly in context', 'Identify transitive intransitive in Spanish texts and speech', 'Use transitive intransitive accurately in written and spoken Spanish'],
    279,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_aspect',
    'verb-aspect',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Aspect',
    'Learn Spanish verb aspect with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb aspect', 'Apply verb aspect rules correctly in context', 'Identify verb aspect in Spanish texts and speech', 'Use verb aspect accurately in written and spoken Spanish'],
    280,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_complementation',
    'verb-complementation',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Complementation',
    'Learn Spanish verb complementation with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb complementation', 'Apply verb complementation rules correctly in context', 'Identify verb complementation in Spanish texts and speech', 'Use verb complementation accurately in written and spoken Spanish'],
    281,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_conjugation_patterns',
    'verb-conjugation-patterns',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Conjugation Patterns',
    'Learn Spanish verb conjugation patterns with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb conjugation patterns', 'Apply verb conjugation patterns rules correctly in context', 'Identify verb conjugation patterns in Spanish texts and speech', 'Use verb conjugation patterns accurately in written and spoken Spanish'],
    282,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_government',
    'verb-government',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Government',
    'Learn Spanish verb government with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb government', 'Apply verb government rules correctly in context', 'Identify verb government in Spanish texts and speech', 'Use verb government accurately in written and spoken Spanish'],
    283,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_moods',
    'verb-moods',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Moods',
    'Learn Spanish verb moods with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb moods', 'Apply verb moods rules correctly in context', 'Identify verb moods in Spanish texts and speech', 'Use verb moods accurately in written and spoken Spanish'],
    284,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_patterns',
    'verb-patterns',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Patterns',
    'Learn Spanish verb patterns with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb patterns', 'Apply verb patterns rules correctly in context', 'Identify verb patterns in Spanish texts and speech', 'Use verb patterns accurately in written and spoken Spanish'],
    285,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_serialization',
    'verb-serialization',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Serialization',
    'Learn Spanish verb serialization with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb serialization', 'Apply verb serialization rules correctly in context', 'Identify verb serialization in Spanish texts and speech', 'Use verb serialization accurately in written and spoken Spanish'],
    286,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_tense_agreement',
    'verb-tense-agreement',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Tense Agreement',
    'Learn Spanish verb tense agreement with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb tense agreement', 'Apply verb tense agreement rules correctly in context', 'Identify verb tense agreement in Spanish texts and speech', 'Use verb tense agreement accurately in written and spoken Spanish'],
    287,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verb_valency',
    'verb-valency',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verb Valency',
    'Learn Spanish verb valency with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verb valency', 'Apply verb valency rules correctly in context', 'Identify verb valency in Spanish texts and speech', 'Use verb valency accurately in written and spoken Spanish'],
    288,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'verbal_periphrases',
    'verbal-periphrases',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Verbal Periphrases',
    'Learn Spanish verbal periphrases with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of verbal periphrases', 'Apply verbal periphrases rules correctly in context', 'Identify verbal periphrases in Spanish texts and speech', 'Use verbal periphrases accurately in written and spoken Spanish'],
    289,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'voice_constructions',
    'voice-constructions',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Voice Constructions',
    'Learn Spanish voice constructions with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of voice constructions', 'Apply voice constructions rules correctly in context', 'Identify voice constructions in Spanish texts and speech', 'Use voice constructions accurately in written and spoken Spanish'],
    290,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'weather_verbs',
    'weather-verbs',
    'es',
    'verbs',
    'intermediate',
    'KS3',
    'Weather Verbs',
    'Learn Spanish weather verbs with conjugation patterns and usage',
    ARRAY['Understand the concept and usage of weather verbs', 'Apply weather verbs rules correctly in context', 'Identify weather verbs in Spanish texts and speech', 'Use weather verbs accurately in written and spoken Spanish'],
    291,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'adjective_adverb',
    'adjective-adverb',
    'es',
    'word-formation',
    'intermediate',
    'KS3',
    'Adjective Adverb',
    'Understand Spanish adjective adverb with formation rules and examples',
    ARRAY['Understand the concept and usage of adjective adverb', 'Apply adjective adverb rules correctly in context', 'Identify adjective adverb in Spanish texts and speech', 'Use adjective adverb accurately in written and spoken Spanish'],
    292,
    true,
    ARRAY[]::uuid[]
  );

INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    'adjective_noun',
    'adjective-noun',
    'es',
    'word-formation',
    'intermediate',
    'KS3',
    'Adjective Noun',
    'Understand Spanish adjective noun with formation rules and examples',
    ARRAY['Understand the concept and usage of adjective noun', 'Apply adjective noun rules correctly in context', 'Identify adjective noun in Spanish texts and speech', 'Use adjective noun accurately in written and spoken Spanish'],
    293,
    true,
    ARRAY[]::uuid[]
  );

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
    294,
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
    295,
    true,
    ARRAY[]::uuid[]
  );