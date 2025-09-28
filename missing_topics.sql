INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  'agreement',
  'agreement',
  'es',
  'adjectives',
  'intermediate',
  'KS3',
  'Agreement',
  'Learn about agreement in Spanish adjectives',
  ARRAY['Understand the concept of agreement', 'Apply agreement rules correctly', 'Identify agreement in context', 'Use agreement in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  'comparison',
  'comparison',
  'es',
  'adjectives',
  'intermediate',
  'KS3',
  'Comparison',
  'Learn about comparison in Spanish adjectives',
  ARRAY['Understand the concept of comparison', 'Apply comparison rules correctly', 'Identify comparison in context', 'Use comparison in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  'position',
  'position',
  'es',
  'adjectives',
  'intermediate',
  'KS3',
  'Position',
  'Learn about position in Spanish adjectives',
  ARRAY['Understand the concept of position', 'Apply position rules correctly', 'Identify position in context', 'Use position in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  'possessive',
  'possessive',
  'es',
  'adjectives',
  'intermediate',
  'KS3',
  'Possessive',
  'Learn about possessive in Spanish adjectives',
  ARRAY['Understand the concept of possessive', 'Apply possessive rules correctly', 'Identify possessive in context', 'Use possessive in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  'personal_a',
  'personal-a',
  'es',
  'adverbial-prepositional',
  'intermediate',
  'KS3',
  'Personal A',
  'Master personal a in Spanish',
  ARRAY['Understand the concept of personal a', 'Apply personal a rules correctly', 'Identify personal a in context', 'Use personal a in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

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
  'Master por vs para in Spanish',
  ARRAY['Understand the concept of por vs para', 'Apply por vs para rules correctly', 'Identify por vs para in context', 'Use por vs para in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand formation in Spanish adverbs',
  ARRAY['Understand the concept of formation', 'Apply formation rules correctly', 'Identify formation in context', 'Use formation in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Definite Articles',
  'Learn Spanish definite articles',
  ARRAY['Understand the concept of definite articles', 'Apply definite articles rules correctly', 'Identify definite articles in context', 'Use definite articles in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish definite indefinite',
  ARRAY['Understand the concept of definite indefinite', 'Apply definite indefinite rules correctly', 'Identify definite indefinite in context', 'Use definite indefinite in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish agreement position',
  ARRAY['Understand the concept of agreement position', 'Apply agreement position rules correctly', 'Identify agreement position in context', 'Use agreement position in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish definite indefinite',
  ARRAY['Understand the concept of definite indefinite', 'Apply definite indefinite rules correctly', 'Identify definite indefinite in context', 'Use definite indefinite in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Gender And Plurals',
  'Master Spanish gender and plurals',
  ARRAY['Understand the concept of gender and plurals', 'Apply gender and plurals rules correctly', 'Identify gender and plurals in context', 'Use gender and plurals in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Gender Rules',
  'Master Spanish gender rules',
  ARRAY['Understand the concept of gender rules', 'Apply gender rules rules correctly', 'Identify gender rules in context', 'Use gender rules in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Nominalisation',
  'Master Spanish nominalisation',
  ARRAY['Understand the concept of nominalisation', 'Apply nominalisation rules correctly', 'Identify nominalisation in context', 'Use nominalisation in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Plurals',
  'Master Spanish plurals',
  ARRAY['Understand the concept of plurals', 'Apply plurals rules correctly', 'Identify plurals in context', 'Use plurals in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish possessive adj',
  ARRAY['Understand the concept of possessive adj', 'Apply possessive adj rules correctly', 'Identify possessive adj in context', 'Use possessive adj in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish direct object',
  ARRAY['Understand the concept of direct object', 'Apply direct object rules correctly', 'Identify direct object in context', 'Use direct object in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish indirect object',
  ARRAY['Understand the concept of indirect object', 'Apply indirect object rules correctly', 'Identify indirect object in context', 'Use indirect object in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish interrogative',
  ARRAY['Understand the concept of interrogative', 'Apply interrogative rules correctly', 'Identify interrogative in context', 'Use interrogative in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish personal',
  ARRAY['Understand the concept of personal', 'Apply personal rules correctly', 'Identify personal in context', 'Use personal in sentences'],
  1,
  true,
  ARRAY[]::text[]
);

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
  'Understand Spanish possessive',
  ARRAY['Understand the concept of possessive', 'Apply possessive rules correctly', 'Identify possessive in context', 'Use possessive in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish reflexive',
  ARRAY['Understand the concept of reflexive', 'Apply reflexive rules correctly', 'Identify reflexive in context', 'Use reflexive in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'intermediate',
  'KS3',
  'Relative',
  'Understand Spanish relative',
  ARRAY['Understand the concept of relative', 'Apply relative rules correctly', 'Identify relative in context', 'Use relative in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish subject',
  ARRAY['Understand the concept of subject', 'Apply subject rules correctly', 'Identify subject in context', 'Use subject in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish sound symbol',
  ARRAY['Understand the concept of sound symbol', 'Apply sound symbol rules correctly', 'Identify sound symbol in context', 'Use sound symbol in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish stress patterns',
  ARRAY['Understand the concept of stress patterns', 'Apply stress patterns rules correctly', 'Identify stress patterns in context', 'Use stress patterns in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Master Spanish written accents',
  ARRAY['Understand the concept of written accents', 'Apply written accents rules correctly', 'Identify written accents in context', 'Use written accents in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish action verbs',
  ARRAY['Understand the concept of action verbs', 'Apply action verbs rules correctly', 'Identify action verbs in context', 'Use action verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish auxiliary verbs',
  ARRAY['Understand the concept of auxiliary verbs', 'Apply auxiliary verbs rules correctly', 'Identify auxiliary verbs in context', 'Use auxiliary verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish causative verbs',
  ARRAY['Understand the concept of causative verbs', 'Apply causative verbs rules correctly', 'Identify causative verbs in context', 'Use causative verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish change verbs',
  ARRAY['Understand the concept of change verbs', 'Apply change verbs rules correctly', 'Identify change verbs in context', 'Use change verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish cognitive verbs',
  ARRAY['Understand the concept of cognitive verbs', 'Apply cognitive verbs rules correctly', 'Identify cognitive verbs in context', 'Use cognitive verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish communication verbs',
  ARRAY['Understand the concept of communication verbs', 'Apply communication verbs rules correctly', 'Identify communication verbs in context', 'Use communication verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish compound tenses',
  ARRAY['Understand the concept of compound tenses', 'Apply compound tenses rules correctly', 'Identify compound tenses in context', 'Use compound tenses in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish conditional',
  ARRAY['Understand the concept of conditional', 'Apply conditional rules correctly', 'Identify conditional in context', 'Use conditional in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish conditional perfect',
  ARRAY['Understand the concept of conditional perfect', 'Apply conditional perfect rules correctly', 'Identify conditional perfect in context', 'Use conditional perfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish conditional sentences',
  ARRAY['Understand the concept of conditional sentences', 'Apply conditional sentences rules correctly', 'Identify conditional sentences in context', 'Use conditional sentences in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish conditional tense',
  ARRAY['Understand the concept of conditional tense', 'Apply conditional tense rules correctly', 'Identify conditional tense in context', 'Use conditional tense in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish continuous constructions',
  ARRAY['Understand the concept of continuous constructions', 'Apply continuous constructions rules correctly', 'Identify continuous constructions in context', 'Use continuous constructions in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish copular verbs',
  ARRAY['Understand the concept of copular verbs', 'Apply copular verbs rules correctly', 'Identify copular verbs in context', 'Use copular verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish defective verbs',
  ARRAY['Understand the concept of defective verbs', 'Apply defective verbs rules correctly', 'Identify defective verbs in context', 'Use defective verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish emotion verbs',
  ARRAY['Understand the concept of emotion verbs', 'Apply emotion verbs rules correctly', 'Identify emotion verbs in context', 'Use emotion verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish existential verbs',
  ARRAY['Understand the concept of existential verbs', 'Apply existential verbs rules correctly', 'Identify existential verbs in context', 'Use existential verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish future',
  ARRAY['Understand the concept of future', 'Apply future rules correctly', 'Identify future in context', 'Use future in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish future perfect',
  ARRAY['Understand the concept of future perfect', 'Apply future perfect rules correctly', 'Identify future perfect in context', 'Use future perfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish future tense',
  ARRAY['Understand the concept of future tense', 'Apply future tense rules correctly', 'Identify future tense in context', 'Use future tense in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish gerunds',
  ARRAY['Understand the concept of gerunds', 'Apply gerunds rules correctly', 'Identify gerunds in context', 'Use gerunds in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish imperative',
  ARRAY['Understand the concept of imperative', 'Apply imperative rules correctly', 'Identify imperative in context', 'Use imperative in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish imperfect',
  ARRAY['Understand the concept of imperfect', 'Apply imperfect rules correctly', 'Identify imperfect in context', 'Use imperfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish imperfect continuous',
  ARRAY['Understand the concept of imperfect continuous', 'Apply imperfect continuous rules correctly', 'Identify imperfect continuous in context', 'Use imperfect continuous in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish impersonal verbs',
  ARRAY['Understand the concept of impersonal verbs', 'Apply impersonal verbs rules correctly', 'Identify impersonal verbs in context', 'Use impersonal verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish inchoative verbs',
  ARRAY['Understand the concept of inchoative verbs', 'Apply inchoative verbs rules correctly', 'Identify inchoative verbs in context', 'Use inchoative verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish infinitive constructions',
  ARRAY['Understand the concept of infinitive constructions', 'Apply infinitive constructions rules correctly', 'Identify infinitive constructions in context', 'Use infinitive constructions in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish interrogatives',
  ARRAY['Understand the concept of interrogatives', 'Apply interrogatives rules correctly', 'Identify interrogatives in context', 'Use interrogatives in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish irregular verbs',
  ARRAY['Understand the concept of irregular verbs', 'Apply irregular verbs rules correctly', 'Identify irregular verbs in context', 'Use irregular verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish light verbs',
  ARRAY['Understand the concept of light verbs', 'Apply light verbs rules correctly', 'Identify light verbs in context', 'Use light verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish modal verbs',
  ARRAY['Understand the concept of modal verbs', 'Apply modal verbs rules correctly', 'Identify modal verbs in context', 'Use modal verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish motion verbs',
  ARRAY['Understand the concept of motion verbs', 'Apply motion verbs rules correctly', 'Identify motion verbs in context', 'Use motion verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish negation',
  ARRAY['Understand the concept of negation', 'Apply negation rules correctly', 'Identify negation in context', 'Use negation in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish passive voice',
  ARRAY['Understand the concept of passive voice', 'Apply passive voice rules correctly', 'Identify passive voice in context', 'Use passive voice in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish past participles',
  ARRAY['Understand the concept of past participles', 'Apply past participles rules correctly', 'Identify past participles in context', 'Use past participles in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish perception verbs',
  ARRAY['Understand the concept of perception verbs', 'Apply perception verbs rules correctly', 'Identify perception verbs in context', 'Use perception verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish periphrastic future',
  ARRAY['Understand the concept of periphrastic future', 'Apply periphrastic future rules correctly', 'Identify periphrastic future in context', 'Use periphrastic future in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish phrasal verbs',
  ARRAY['Understand the concept of phrasal verbs', 'Apply phrasal verbs rules correctly', 'Identify phrasal verbs in context', 'Use phrasal verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish pluperfect',
  ARRAY['Understand the concept of pluperfect', 'Apply pluperfect rules correctly', 'Identify pluperfect in context', 'Use pluperfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish por vs para',
  ARRAY['Understand the concept of por vs para', 'Apply por vs para rules correctly', 'Identify por vs para in context', 'Use por vs para in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish possession verbs',
  ARRAY['Understand the concept of possession verbs', 'Apply possession verbs rules correctly', 'Identify possession verbs in context', 'Use possession verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish present continuous',
  ARRAY['Understand the concept of present continuous', 'Apply present continuous rules correctly', 'Identify present continuous in context', 'Use present continuous in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish present perfect',
  ARRAY['Understand the concept of present perfect', 'Apply present perfect rules correctly', 'Identify present perfect in context', 'Use present perfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish present tense',
  ARRAY['Understand the concept of present tense', 'Apply present tense rules correctly', 'Identify present tense in context', 'Use present tense in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish preterite',
  ARRAY['Understand the concept of preterite', 'Apply preterite rules correctly', 'Identify preterite in context', 'Use preterite in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish progressive tenses',
  ARRAY['Understand the concept of progressive tenses', 'Apply progressive tenses rules correctly', 'Identify progressive tenses in context', 'Use progressive tenses in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish pronominal verbs',
  ARRAY['Understand the concept of pronominal verbs', 'Apply pronominal verbs rules correctly', 'Identify pronominal verbs in context', 'Use pronominal verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish reflexive',
  ARRAY['Understand the concept of reflexive', 'Apply reflexive rules correctly', 'Identify reflexive in context', 'Use reflexive in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish reported speech',
  ARRAY['Understand the concept of reported speech', 'Apply reported speech rules correctly', 'Identify reported speech in context', 'Use reported speech in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish sequence of tenses',
  ARRAY['Understand the concept of sequence of tenses', 'Apply sequence of tenses rules correctly', 'Identify sequence of tenses in context', 'Use sequence of tenses in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish ser vs estar',
  ARRAY['Understand the concept of ser vs estar', 'Apply ser vs estar rules correctly', 'Identify ser vs estar in context', 'Use ser vs estar in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish stative verbs',
  ARRAY['Understand the concept of stative verbs', 'Apply stative verbs rules correctly', 'Identify stative verbs in context', 'Use stative verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish stem changing',
  ARRAY['Understand the concept of stem changing', 'Apply stem changing rules correctly', 'Identify stem changing in context', 'Use stem changing in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish subjunctive',
  ARRAY['Understand the concept of subjunctive', 'Apply subjunctive rules correctly', 'Identify subjunctive in context', 'Use subjunctive in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish subjunctive imperfect',
  ARRAY['Understand the concept of subjunctive imperfect', 'Apply subjunctive imperfect rules correctly', 'Identify subjunctive imperfect in context', 'Use subjunctive imperfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish subjunctive perfect',
  ARRAY['Understand the concept of subjunctive perfect', 'Apply subjunctive perfect rules correctly', 'Identify subjunctive perfect in context', 'Use subjunctive perfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish subjunctive pluperfect',
  ARRAY['Understand the concept of subjunctive pluperfect', 'Apply subjunctive pluperfect rules correctly', 'Identify subjunctive pluperfect in context', 'Use subjunctive pluperfect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish subjunctive present',
  ARRAY['Understand the concept of subjunctive present', 'Apply subjunctive present rules correctly', 'Identify subjunctive present in context', 'Use subjunctive present in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish terminative verbs',
  ARRAY['Understand the concept of terminative verbs', 'Apply terminative verbs rules correctly', 'Identify terminative verbs in context', 'Use terminative verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish transitive intransitive',
  ARRAY['Understand the concept of transitive intransitive', 'Apply transitive intransitive rules correctly', 'Identify transitive intransitive in context', 'Use transitive intransitive in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb aspect',
  ARRAY['Understand the concept of verb aspect', 'Apply verb aspect rules correctly', 'Identify verb aspect in context', 'Use verb aspect in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb complementation',
  ARRAY['Understand the concept of verb complementation', 'Apply verb complementation rules correctly', 'Identify verb complementation in context', 'Use verb complementation in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb conjugation patterns',
  ARRAY['Understand the concept of verb conjugation patterns', 'Apply verb conjugation patterns rules correctly', 'Identify verb conjugation patterns in context', 'Use verb conjugation patterns in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb government',
  ARRAY['Understand the concept of verb government', 'Apply verb government rules correctly', 'Identify verb government in context', 'Use verb government in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb moods',
  ARRAY['Understand the concept of verb moods', 'Apply verb moods rules correctly', 'Identify verb moods in context', 'Use verb moods in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb patterns',
  ARRAY['Understand the concept of verb patterns', 'Apply verb patterns rules correctly', 'Identify verb patterns in context', 'Use verb patterns in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb serialization',
  ARRAY['Understand the concept of verb serialization', 'Apply verb serialization rules correctly', 'Identify verb serialization in context', 'Use verb serialization in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb tense agreement',
  ARRAY['Understand the concept of verb tense agreement', 'Apply verb tense agreement rules correctly', 'Identify verb tense agreement in context', 'Use verb tense agreement in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verb valency',
  ARRAY['Understand the concept of verb valency', 'Apply verb valency rules correctly', 'Identify verb valency in context', 'Use verb valency in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish verbal periphrases',
  ARRAY['Understand the concept of verbal periphrases', 'Apply verbal periphrases rules correctly', 'Identify verbal periphrases in context', 'Use verbal periphrases in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish voice constructions',
  ARRAY['Understand the concept of voice constructions', 'Apply voice constructions rules correctly', 'Identify voice constructions in context', 'Use voice constructions in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Learn Spanish weather verbs',
  ARRAY['Understand the concept of weather verbs', 'Apply weather verbs rules correctly', 'Identify weather verbs in context', 'Use weather verbs in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish adjective adverb',
  ARRAY['Understand the concept of adjective adverb', 'Apply adjective adverb rules correctly', 'Identify adjective adverb in context', 'Use adjective adverb in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish adjective noun',
  ARRAY['Understand the concept of adjective noun', 'Apply adjective noun rules correctly', 'Identify adjective noun in context', 'Use adjective noun in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish augmentative suffixes',
  ARRAY['Understand the concept of augmentative suffixes', 'Apply augmentative suffixes rules correctly', 'Identify augmentative suffixes in context', 'Use augmentative suffixes in sentences'],
  1,
  true,
  ARRAY[]::text[]
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
  'Understand Spanish diminutive suffixes',
  ARRAY['Understand the concept of diminutive suffixes', 'Apply diminutive suffixes rules correctly', 'Identify diminutive suffixes in context', 'Use diminutive suffixes in sentences'],
  1,
  true,
  ARRAY[]::text[]
);