INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'agreement' AND language = 'es'),
    'practice',
    'Agreement Practice',
    'agreement',
    '{"title":"Agreement Practice","description":"Practice exercises for agreement","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns in agreement","prompts":[{"phrase":"la casa (blanco)","answer":"la casa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'agreement' AND language = 'es'),
    'quiz',
    'Agreement Quiz',
    'agreement',
    '{"title":"Agreement Quiz","description":"Assessment quiz for agreement","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly?","options":["la casa blanco","la casa blanca","las casa blanca"],"correct_answer":"la casa blanca","explanation":"Adjective must agree in gender and number"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'comparison' AND language = 'es'),
    'practice',
    'Comparison Practice',
    'comparison',
    '{"title":"Comparison Practice","description":"Practice exercises for comparison","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns in comparison","prompts":[{"phrase":"la casa (blanco)","answer":"la casa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'comparison' AND language = 'es'),
    'quiz',
    'Comparison Quiz',
    'comparison',
    '{"title":"Comparison Quiz","description":"Assessment quiz for comparison","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly?","options":["la casa blanco","la casa blanca","las casa blanca"],"correct_answer":"la casa blanca","explanation":"Adjective must agree in gender and number"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'position' AND language = 'es'),
    'practice',
    'Position Practice',
    'position',
    '{"title":"Position Practice","description":"Practice exercises for position","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns in position","prompts":[{"phrase":"la casa (blanco)","answer":"la casa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'position' AND language = 'es'),
    'quiz',
    'Position Quiz',
    'position',
    '{"title":"Position Quiz","description":"Assessment quiz for position","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly?","options":["la casa blanco","la casa blanca","las casa blanca"],"correct_answer":"la casa blanca","explanation":"Adjective must agree in gender and number"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive' AND language = 'es'),
    'practice',
    'Possessive Practice',
    'possessive',
    '{"title":"Possessive Practice","description":"Practice exercises for possessive","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns in possessive","prompts":[{"phrase":"la casa (blanco)","answer":"la casa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive' AND language = 'es'),
    'quiz',
    'Possessive Quiz',
    'possessive',
    '{"title":"Possessive Quiz","description":"Assessment quiz for possessive","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly?","options":["la casa blanco","la casa blanca","las casa blanca"],"correct_answer":"la casa blanca","explanation":"Adjective must agree in gender and number"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'personal-a' AND language = 'es'),
    'practice',
    'Personal A Practice',
    'personal-a',
    '{"title":"Personal A Practice","description":"Practice exercises for personal a","exercises":[{"type":"fill_blank","instructions":"Complete sentences using personal a","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'personal-a' AND language = 'es'),
    'quiz',
    'Personal A Quiz',
    'personal-a',
    '{"title":"Personal A Quiz","description":"Assessment quiz for personal a","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses personal a?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'por-vs-para' AND language = 'es'),
    'practice',
    'Por Vs Para Practice',
    'por-vs-para',
    '{"title":"Por Vs Para Practice","description":"Practice exercises for por vs para","exercises":[{"type":"fill_blank","instructions":"Complete sentences using por vs para","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'por-vs-para' AND language = 'es'),
    'quiz',
    'Por Vs Para Quiz',
    'por-vs-para',
    '{"title":"Por Vs Para Quiz","description":"Assessment quiz for por vs para","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses por vs para?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'formation' AND language = 'es'),
    'practice',
    'Formation Practice',
    'formation',
    '{"title":"Formation Practice","description":"Practice exercises for formation","exercises":[{"type":"fill_blank","instructions":"Complete sentences using formation","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'formation' AND language = 'es'),
    'quiz',
    'Formation Quiz',
    'formation',
    '{"title":"Formation Quiz","description":"Assessment quiz for formation","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses formation?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-articles' AND language = 'es'),
    'practice',
    'Definite Articles Practice',
    'definite-articles',
    '{"title":"Definite Articles Practice","description":"Practice exercises for definite articles","exercises":[{"type":"fill_blank","instructions":"Complete sentences using definite articles","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-articles' AND language = 'es'),
    'quiz',
    'Definite Articles Quiz',
    'definite-articles',
    '{"title":"Definite Articles Quiz","description":"Assessment quiz for definite articles","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite articles?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'practice',
    'Definite Indefinite Practice',
    'definite-indefinite',
    '{"title":"Definite Indefinite Practice","description":"Practice exercises for definite indefinite","exercises":[{"type":"fill_blank","instructions":"Complete sentences using definite indefinite","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'quiz',
    'Definite Indefinite Quiz',
    'definite-indefinite',
    '{"title":"Definite Indefinite Quiz","description":"Assessment quiz for definite indefinite","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite indefinite?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'agreement-position' AND language = 'es'),
    'practice',
    'Agreement Position Practice',
    'agreement-position',
    '{"title":"Agreement Position Practice","description":"Practice exercises for agreement position","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to agreement position","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'agreement-position' AND language = 'es'),
    'quiz',
    'Agreement Position Quiz',
    'agreement-position',
    '{"title":"Agreement Position Quiz","description":"Assessment quiz for agreement position","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'practice',
    'Definite Indefinite Practice',
    'definite-indefinite',
    '{"title":"Definite Indefinite Practice","description":"Practice exercises for definite indefinite","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to definite indefinite","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'quiz',
    'Definite Indefinite Quiz',
    'definite-indefinite',
    '{"title":"Definite Indefinite Quiz","description":"Assessment quiz for definite indefinite","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gender-and-plurals' AND language = 'es'),
    'practice',
    'Gender And Plurals Practice',
    'gender-and-plurals',
    '{"title":"Gender And Plurals Practice","description":"Practice exercises for gender and plurals","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to gender and plurals","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gender-and-plurals' AND language = 'es'),
    'quiz',
    'Gender And Plurals Quiz',
    'gender-and-plurals',
    '{"title":"Gender And Plurals Quiz","description":"Assessment quiz for gender and plurals","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gender-rules' AND language = 'es'),
    'practice',
    'Gender Rules Practice',
    'gender-rules',
    '{"title":"Gender Rules Practice","description":"Practice exercises for gender rules","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to gender rules","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gender-rules' AND language = 'es'),
    'quiz',
    'Gender Rules Quiz',
    'gender-rules',
    '{"title":"Gender Rules Quiz","description":"Assessment quiz for gender rules","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'nominalisation' AND language = 'es'),
    'practice',
    'Nominalisation Practice',
    'nominalisation',
    '{"title":"Nominalisation Practice","description":"Practice exercises for nominalisation","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to nominalisation","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'nominalisation' AND language = 'es'),
    'quiz',
    'Nominalisation Quiz',
    'nominalisation',
    '{"title":"Nominalisation Quiz","description":"Assessment quiz for nominalisation","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'plurals' AND language = 'es'),
    'practice',
    'Plurals Practice',
    'plurals',
    '{"title":"Plurals Practice","description":"Practice exercises for plurals","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to plurals","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'plurals' AND language = 'es'),
    'quiz',
    'Plurals Quiz',
    'plurals',
    '{"title":"Plurals Quiz","description":"Assessment quiz for plurals","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-adj' AND language = 'es'),
    'practice',
    'Possessive Adj Practice',
    'possessive-adj',
    '{"title":"Possessive Adj Practice","description":"Practice exercises for possessive adj","exercises":[{"type":"gender_identification","instructions":"Identify the gender of nouns related to possessive adj","prompts":[{"word":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Mesa ends in -a, typically feminine"},{"word":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural_formation","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-adj' AND language = 'es'),
    'quiz',
    'Possessive Adj Quiz',
    'possessive-adj',
    '{"title":"Possessive Adj Quiz","description":"Assessment quiz for possessive adj","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"},{"type":"fill_blank","question":"Complete: Las _____ (casa)","correct_answer":"casas","explanation":"Plural form of casa"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'direct-object' AND language = 'es'),
    'practice',
    'Direct Object Practice',
    'direct-object',
    '{"title":"Direct Object Practice","description":"Practice exercises for direct object","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for direct object","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'direct-object' AND language = 'es'),
    'quiz',
    'Direct Object Quiz',
    'direct-object',
    '{"title":"Direct Object Quiz","description":"Assessment quiz for direct object","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'indirect-object' AND language = 'es'),
    'practice',
    'Indirect Object Practice',
    'indirect-object',
    '{"title":"Indirect Object Practice","description":"Practice exercises for indirect object","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for indirect object","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'indirect-object' AND language = 'es'),
    'quiz',
    'Indirect Object Quiz',
    'indirect-object',
    '{"title":"Indirect Object Quiz","description":"Assessment quiz for indirect object","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'interrogative' AND language = 'es'),
    'practice',
    'Interrogative Practice',
    'interrogative',
    '{"title":"Interrogative Practice","description":"Practice exercises for interrogative","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for interrogative","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'interrogative' AND language = 'es'),
    'quiz',
    'Interrogative Quiz',
    'interrogative',
    '{"title":"Interrogative Quiz","description":"Assessment quiz for interrogative","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'personal' AND language = 'es'),
    'practice',
    'Personal Practice',
    'personal',
    '{"title":"Personal Practice","description":"Practice exercises for personal","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for personal","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'personal' AND language = 'es'),
    'quiz',
    'Personal Quiz',
    'personal',
    '{"title":"Personal Quiz","description":"Assessment quiz for personal","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive' AND language = 'es'),
    'practice',
    'Possessive Practice',
    'possessive',
    '{"title":"Possessive Practice","description":"Practice exercises for possessive","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for possessive","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possessive' AND language = 'es'),
    'quiz',
    'Possessive Quiz',
    'possessive',
    '{"title":"Possessive Quiz","description":"Assessment quiz for possessive","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive' AND language = 'es'),
    'practice',
    'Reflexive Practice',
    'reflexive',
    '{"title":"Reflexive Practice","description":"Practice exercises for reflexive","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for reflexive","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive' AND language = 'es'),
    'quiz',
    'Reflexive Quiz',
    'reflexive',
    '{"title":"Reflexive Quiz","description":"Assessment quiz for reflexive","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'relative' AND language = 'es'),
    'practice',
    'Relative Practice',
    'relative',
    '{"title":"Relative Practice","description":"Practice exercises for relative","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for relative","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'relative' AND language = 'es'),
    'quiz',
    'Relative Quiz',
    'relative',
    '{"title":"Relative Quiz","description":"Assessment quiz for relative","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subject' AND language = 'es'),
    'practice',
    'Subject Practice',
    'subject',
    '{"title":"Subject Practice","description":"Practice exercises for subject","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns for subject","prompts":[{"sentence":"María come la manzana","answer":"María la come","explanation":"La replaces the feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces the indirect object"}]},{"type":"identification","instructions":"Identify the type of pronoun","prompts":[{"sentence":"Me gusta el café","pronoun":"me","answer":"indirect object","options":["subject","direct object","indirect object"],"explanation":"Me is the indirect object pronoun"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subject' AND language = 'es'),
    'quiz',
    'Subject Quiz',
    'subject',
    '{"title":"Subject Quiz","description":"Assessment quiz for subject","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'sound-symbol' AND language = 'es'),
    'practice',
    'Sound Symbol Practice',
    'sound-symbol',
    '{"title":"Sound Symbol Practice","description":"Practice exercises for sound symbol","exercises":[{"type":"fill_blank","instructions":"Complete sentences using sound symbol","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'sound-symbol' AND language = 'es'),
    'quiz',
    'Sound Symbol Quiz',
    'sound-symbol',
    '{"title":"Sound Symbol Quiz","description":"Assessment quiz for sound symbol","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses sound symbol?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stress-patterns' AND language = 'es'),
    'practice',
    'Stress Patterns Practice',
    'stress-patterns',
    '{"title":"Stress Patterns Practice","description":"Practice exercises for stress patterns","exercises":[{"type":"fill_blank","instructions":"Complete sentences using stress patterns","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stress-patterns' AND language = 'es'),
    'quiz',
    'Stress Patterns Quiz',
    'stress-patterns',
    '{"title":"Stress Patterns Quiz","description":"Assessment quiz for stress patterns","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses stress patterns?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'written-accents' AND language = 'es'),
    'practice',
    'Written Accents Practice',
    'written-accents',
    '{"title":"Written Accents Practice","description":"Practice exercises for written accents","exercises":[{"type":"fill_blank","instructions":"Complete sentences using written accents","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'written-accents' AND language = 'es'),
    'quiz',
    'Written Accents Quiz',
    'written-accents',
    '{"title":"Written Accents Quiz","description":"Assessment quiz for written accents","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses written accents?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'action-verbs' AND language = 'es'),
    'practice',
    'Action Verbs Practice',
    'action-verbs',
    '{"title":"Action Verbs Practice","description":"Practice exercises for action verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in action verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'action-verbs' AND language = 'es'),
    'quiz',
    'Action Verbs Quiz',
    'action-verbs',
    '{"title":"Action Verbs Quiz","description":"Assessment quiz for action verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for action verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'auxiliary-verbs' AND language = 'es'),
    'practice',
    'Auxiliary Verbs Practice',
    'auxiliary-verbs',
    '{"title":"Auxiliary Verbs Practice","description":"Practice exercises for auxiliary verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in auxiliary verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'auxiliary-verbs' AND language = 'es'),
    'quiz',
    'Auxiliary Verbs Quiz',
    'auxiliary-verbs',
    '{"title":"Auxiliary Verbs Quiz","description":"Assessment quiz for auxiliary verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for auxiliary verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'causative-verbs' AND language = 'es'),
    'practice',
    'Causative Verbs Practice',
    'causative-verbs',
    '{"title":"Causative Verbs Practice","description":"Practice exercises for causative verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in causative verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'causative-verbs' AND language = 'es'),
    'quiz',
    'Causative Verbs Quiz',
    'causative-verbs',
    '{"title":"Causative Verbs Quiz","description":"Assessment quiz for causative verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for causative verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'change-verbs' AND language = 'es'),
    'practice',
    'Change Verbs Practice',
    'change-verbs',
    '{"title":"Change Verbs Practice","description":"Practice exercises for change verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in change verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'change-verbs' AND language = 'es'),
    'quiz',
    'Change Verbs Quiz',
    'change-verbs',
    '{"title":"Change Verbs Quiz","description":"Assessment quiz for change verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for change verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'cognitive-verbs' AND language = 'es'),
    'practice',
    'Cognitive Verbs Practice',
    'cognitive-verbs',
    '{"title":"Cognitive Verbs Practice","description":"Practice exercises for cognitive verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in cognitive verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'cognitive-verbs' AND language = 'es'),
    'quiz',
    'Cognitive Verbs Quiz',
    'cognitive-verbs',
    '{"title":"Cognitive Verbs Quiz","description":"Assessment quiz for cognitive verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for cognitive verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'communication-verbs' AND language = 'es'),
    'practice',
    'Communication Verbs Practice',
    'communication-verbs',
    '{"title":"Communication Verbs Practice","description":"Practice exercises for communication verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in communication verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'communication-verbs' AND language = 'es'),
    'quiz',
    'Communication Verbs Quiz',
    'communication-verbs',
    '{"title":"Communication Verbs Quiz","description":"Assessment quiz for communication verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for communication verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'compound-tenses' AND language = 'es'),
    'practice',
    'Compound Tenses Practice',
    'compound-tenses',
    '{"title":"Compound Tenses Practice","description":"Practice exercises for compound tenses","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in compound tenses","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'compound-tenses' AND language = 'es'),
    'quiz',
    'Compound Tenses Quiz',
    'compound-tenses',
    '{"title":"Compound Tenses Quiz","description":"Assessment quiz for compound tenses","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for compound tenses?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional' AND language = 'es'),
    'practice',
    'Conditional Practice',
    'conditional',
    '{"title":"Conditional Practice","description":"Practice exercises for conditional","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in conditional","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional' AND language = 'es'),
    'quiz',
    'Conditional Quiz',
    'conditional',
    '{"title":"Conditional Quiz","description":"Assessment quiz for conditional","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for conditional?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-perfect' AND language = 'es'),
    'practice',
    'Conditional Perfect Practice',
    'conditional-perfect',
    '{"title":"Conditional Perfect Practice","description":"Practice exercises for conditional perfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in conditional perfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-perfect' AND language = 'es'),
    'quiz',
    'Conditional Perfect Quiz',
    'conditional-perfect',
    '{"title":"Conditional Perfect Quiz","description":"Assessment quiz for conditional perfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for conditional perfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-sentences' AND language = 'es'),
    'practice',
    'Conditional Sentences Practice',
    'conditional-sentences',
    '{"title":"Conditional Sentences Practice","description":"Practice exercises for conditional sentences","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in conditional sentences","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-sentences' AND language = 'es'),
    'quiz',
    'Conditional Sentences Quiz',
    'conditional-sentences',
    '{"title":"Conditional Sentences Quiz","description":"Assessment quiz for conditional sentences","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for conditional sentences?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-tense' AND language = 'es'),
    'practice',
    'Conditional Tense Practice',
    'conditional-tense',
    '{"title":"Conditional Tense Practice","description":"Practice exercises for conditional tense","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in conditional tense","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'conditional-tense' AND language = 'es'),
    'quiz',
    'Conditional Tense Quiz',
    'conditional-tense',
    '{"title":"Conditional Tense Quiz","description":"Assessment quiz for conditional tense","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for conditional tense?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'continuous-constructions' AND language = 'es'),
    'practice',
    'Continuous Constructions Practice',
    'continuous-constructions',
    '{"title":"Continuous Constructions Practice","description":"Practice exercises for continuous constructions","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in continuous constructions","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'continuous-constructions' AND language = 'es'),
    'quiz',
    'Continuous Constructions Quiz',
    'continuous-constructions',
    '{"title":"Continuous Constructions Quiz","description":"Assessment quiz for continuous constructions","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for continuous constructions?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'copular-verbs' AND language = 'es'),
    'practice',
    'Copular Verbs Practice',
    'copular-verbs',
    '{"title":"Copular Verbs Practice","description":"Practice exercises for copular verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in copular verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'copular-verbs' AND language = 'es'),
    'quiz',
    'Copular Verbs Quiz',
    'copular-verbs',
    '{"title":"Copular Verbs Quiz","description":"Assessment quiz for copular verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for copular verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'defective-verbs' AND language = 'es'),
    'practice',
    'Defective Verbs Practice',
    'defective-verbs',
    '{"title":"Defective Verbs Practice","description":"Practice exercises for defective verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in defective verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'defective-verbs' AND language = 'es'),
    'quiz',
    'Defective Verbs Quiz',
    'defective-verbs',
    '{"title":"Defective Verbs Quiz","description":"Assessment quiz for defective verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for defective verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'emotion-verbs' AND language = 'es'),
    'practice',
    'Emotion Verbs Practice',
    'emotion-verbs',
    '{"title":"Emotion Verbs Practice","description":"Practice exercises for emotion verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in emotion verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'emotion-verbs' AND language = 'es'),
    'quiz',
    'Emotion Verbs Quiz',
    'emotion-verbs',
    '{"title":"Emotion Verbs Quiz","description":"Assessment quiz for emotion verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for emotion verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'existential-verbs' AND language = 'es'),
    'practice',
    'Existential Verbs Practice',
    'existential-verbs',
    '{"title":"Existential Verbs Practice","description":"Practice exercises for existential verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in existential verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'existential-verbs' AND language = 'es'),
    'quiz',
    'Existential Verbs Quiz',
    'existential-verbs',
    '{"title":"Existential Verbs Quiz","description":"Assessment quiz for existential verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for existential verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future' AND language = 'es'),
    'practice',
    'Future Practice',
    'future',
    '{"title":"Future Practice","description":"Practice exercises for future","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in future","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future' AND language = 'es'),
    'quiz',
    'Future Quiz',
    'future',
    '{"title":"Future Quiz","description":"Assessment quiz for future","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for future?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future-perfect' AND language = 'es'),
    'practice',
    'Future Perfect Practice',
    'future-perfect',
    '{"title":"Future Perfect Practice","description":"Practice exercises for future perfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in future perfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future-perfect' AND language = 'es'),
    'quiz',
    'Future Perfect Quiz',
    'future-perfect',
    '{"title":"Future Perfect Quiz","description":"Assessment quiz for future perfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for future perfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future-tense' AND language = 'es'),
    'practice',
    'Future Tense Practice',
    'future-tense',
    '{"title":"Future Tense Practice","description":"Practice exercises for future tense","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in future tense","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'future-tense' AND language = 'es'),
    'quiz',
    'Future Tense Quiz',
    'future-tense',
    '{"title":"Future Tense Quiz","description":"Assessment quiz for future tense","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for future tense?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gerunds' AND language = 'es'),
    'practice',
    'Gerunds Practice',
    'gerunds',
    '{"title":"Gerunds Practice","description":"Practice exercises for gerunds","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in gerunds","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'gerunds' AND language = 'es'),
    'quiz',
    'Gerunds Quiz',
    'gerunds',
    '{"title":"Gerunds Quiz","description":"Assessment quiz for gerunds","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for gerunds?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperative' AND language = 'es'),
    'practice',
    'Imperative Practice',
    'imperative',
    '{"title":"Imperative Practice","description":"Practice exercises for imperative","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in imperative","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperative' AND language = 'es'),
    'quiz',
    'Imperative Quiz',
    'imperative',
    '{"title":"Imperative Quiz","description":"Assessment quiz for imperative","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for imperative?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperfect' AND language = 'es'),
    'practice',
    'Imperfect Practice',
    'imperfect',
    '{"title":"Imperfect Practice","description":"Practice exercises for imperfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in imperfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperfect' AND language = 'es'),
    'quiz',
    'Imperfect Quiz',
    'imperfect',
    '{"title":"Imperfect Quiz","description":"Assessment quiz for imperfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for imperfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperfect-continuous' AND language = 'es'),
    'practice',
    'Imperfect Continuous Practice',
    'imperfect-continuous',
    '{"title":"Imperfect Continuous Practice","description":"Practice exercises for imperfect continuous","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in imperfect continuous","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'imperfect-continuous' AND language = 'es'),
    'quiz',
    'Imperfect Continuous Quiz',
    'imperfect-continuous',
    '{"title":"Imperfect Continuous Quiz","description":"Assessment quiz for imperfect continuous","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for imperfect continuous?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'impersonal-verbs' AND language = 'es'),
    'practice',
    'Impersonal Verbs Practice',
    'impersonal-verbs',
    '{"title":"Impersonal Verbs Practice","description":"Practice exercises for impersonal verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in impersonal verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'impersonal-verbs' AND language = 'es'),
    'quiz',
    'Impersonal Verbs Quiz',
    'impersonal-verbs',
    '{"title":"Impersonal Verbs Quiz","description":"Assessment quiz for impersonal verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for impersonal verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'inchoative-verbs' AND language = 'es'),
    'practice',
    'Inchoative Verbs Practice',
    'inchoative-verbs',
    '{"title":"Inchoative Verbs Practice","description":"Practice exercises for inchoative verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in inchoative verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'inchoative-verbs' AND language = 'es'),
    'quiz',
    'Inchoative Verbs Quiz',
    'inchoative-verbs',
    '{"title":"Inchoative Verbs Quiz","description":"Assessment quiz for inchoative verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for inchoative verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'infinitive-constructions' AND language = 'es'),
    'practice',
    'Infinitive Constructions Practice',
    'infinitive-constructions',
    '{"title":"Infinitive Constructions Practice","description":"Practice exercises for infinitive constructions","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in infinitive constructions","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'infinitive-constructions' AND language = 'es'),
    'quiz',
    'Infinitive Constructions Quiz',
    'infinitive-constructions',
    '{"title":"Infinitive Constructions Quiz","description":"Assessment quiz for infinitive constructions","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for infinitive constructions?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'interrogatives' AND language = 'es'),
    'practice',
    'Interrogatives Practice',
    'interrogatives',
    '{"title":"Interrogatives Practice","description":"Practice exercises for interrogatives","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in interrogatives","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'interrogatives' AND language = 'es'),
    'quiz',
    'Interrogatives Quiz',
    'interrogatives',
    '{"title":"Interrogatives Quiz","description":"Assessment quiz for interrogatives","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for interrogatives?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'irregular-verbs' AND language = 'es'),
    'practice',
    'Irregular Verbs Practice',
    'irregular-verbs',
    '{"title":"Irregular Verbs Practice","description":"Practice exercises for irregular verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in irregular verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'irregular-verbs' AND language = 'es'),
    'quiz',
    'Irregular Verbs Quiz',
    'irregular-verbs',
    '{"title":"Irregular Verbs Quiz","description":"Assessment quiz for irregular verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for irregular verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'light-verbs' AND language = 'es'),
    'practice',
    'Light Verbs Practice',
    'light-verbs',
    '{"title":"Light Verbs Practice","description":"Practice exercises for light verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in light verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'light-verbs' AND language = 'es'),
    'quiz',
    'Light Verbs Quiz',
    'light-verbs',
    '{"title":"Light Verbs Quiz","description":"Assessment quiz for light verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for light verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'modal-verbs' AND language = 'es'),
    'practice',
    'Modal Verbs Practice',
    'modal-verbs',
    '{"title":"Modal Verbs Practice","description":"Practice exercises for modal verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in modal verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'modal-verbs' AND language = 'es'),
    'quiz',
    'Modal Verbs Quiz',
    'modal-verbs',
    '{"title":"Modal Verbs Quiz","description":"Assessment quiz for modal verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for modal verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'motion-verbs' AND language = 'es'),
    'practice',
    'Motion Verbs Practice',
    'motion-verbs',
    '{"title":"Motion Verbs Practice","description":"Practice exercises for motion verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in motion verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'motion-verbs' AND language = 'es'),
    'quiz',
    'Motion Verbs Quiz',
    'motion-verbs',
    '{"title":"Motion Verbs Quiz","description":"Assessment quiz for motion verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for motion verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'negation' AND language = 'es'),
    'practice',
    'Negation Practice',
    'negation',
    '{"title":"Negation Practice","description":"Practice exercises for negation","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in negation","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'negation' AND language = 'es'),
    'quiz',
    'Negation Quiz',
    'negation',
    '{"title":"Negation Quiz","description":"Assessment quiz for negation","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for negation?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'passive-voice' AND language = 'es'),
    'practice',
    'Passive Voice Practice',
    'passive-voice',
    '{"title":"Passive Voice Practice","description":"Practice exercises for passive voice","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in passive voice","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'passive-voice' AND language = 'es'),
    'quiz',
    'Passive Voice Quiz',
    'passive-voice',
    '{"title":"Passive Voice Quiz","description":"Assessment quiz for passive voice","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for passive voice?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'past-participles' AND language = 'es'),
    'practice',
    'Past Participles Practice',
    'past-participles',
    '{"title":"Past Participles Practice","description":"Practice exercises for past participles","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in past participles","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'past-participles' AND language = 'es'),
    'quiz',
    'Past Participles Quiz',
    'past-participles',
    '{"title":"Past Participles Quiz","description":"Assessment quiz for past participles","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for past participles?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'perception-verbs' AND language = 'es'),
    'practice',
    'Perception Verbs Practice',
    'perception-verbs',
    '{"title":"Perception Verbs Practice","description":"Practice exercises for perception verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in perception verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'perception-verbs' AND language = 'es'),
    'quiz',
    'Perception Verbs Quiz',
    'perception-verbs',
    '{"title":"Perception Verbs Quiz","description":"Assessment quiz for perception verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for perception verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'periphrastic-future' AND language = 'es'),
    'practice',
    'Periphrastic Future Practice',
    'periphrastic-future',
    '{"title":"Periphrastic Future Practice","description":"Practice exercises for periphrastic future","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in periphrastic future","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'periphrastic-future' AND language = 'es'),
    'quiz',
    'Periphrastic Future Quiz',
    'periphrastic-future',
    '{"title":"Periphrastic Future Quiz","description":"Assessment quiz for periphrastic future","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for periphrastic future?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'phrasal-verbs' AND language = 'es'),
    'practice',
    'Phrasal Verbs Practice',
    'phrasal-verbs',
    '{"title":"Phrasal Verbs Practice","description":"Practice exercises for phrasal verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in phrasal verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'phrasal-verbs' AND language = 'es'),
    'quiz',
    'Phrasal Verbs Quiz',
    'phrasal-verbs',
    '{"title":"Phrasal Verbs Quiz","description":"Assessment quiz for phrasal verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for phrasal verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'pluperfect' AND language = 'es'),
    'practice',
    'Pluperfect Practice',
    'pluperfect',
    '{"title":"Pluperfect Practice","description":"Practice exercises for pluperfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in pluperfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'pluperfect' AND language = 'es'),
    'quiz',
    'Pluperfect Quiz',
    'pluperfect',
    '{"title":"Pluperfect Quiz","description":"Assessment quiz for pluperfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for pluperfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'por-vs-para' AND language = 'es'),
    'practice',
    'Por Vs Para Practice',
    'por-vs-para',
    '{"title":"Por Vs Para Practice","description":"Practice exercises for por vs para","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in por vs para","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'por-vs-para' AND language = 'es'),
    'quiz',
    'Por Vs Para Quiz',
    'por-vs-para',
    '{"title":"Por Vs Para Quiz","description":"Assessment quiz for por vs para","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for por vs para?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possession-verbs' AND language = 'es'),
    'practice',
    'Possession Verbs Practice',
    'possession-verbs',
    '{"title":"Possession Verbs Practice","description":"Practice exercises for possession verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in possession verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'possession-verbs' AND language = 'es'),
    'quiz',
    'Possession Verbs Quiz',
    'possession-verbs',
    '{"title":"Possession Verbs Quiz","description":"Assessment quiz for possession verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for possession verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-continuous' AND language = 'es'),
    'practice',
    'Present Continuous Practice',
    'present-continuous',
    '{"title":"Present Continuous Practice","description":"Practice exercises for present continuous","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in present continuous","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-continuous' AND language = 'es'),
    'quiz',
    'Present Continuous Quiz',
    'present-continuous',
    '{"title":"Present Continuous Quiz","description":"Assessment quiz for present continuous","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for present continuous?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-perfect' AND language = 'es'),
    'practice',
    'Present Perfect Practice',
    'present-perfect',
    '{"title":"Present Perfect Practice","description":"Practice exercises for present perfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in present perfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-perfect' AND language = 'es'),
    'quiz',
    'Present Perfect Quiz',
    'present-perfect',
    '{"title":"Present Perfect Quiz","description":"Assessment quiz for present perfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for present perfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-tense' AND language = 'es'),
    'practice',
    'Present Tense Practice',
    'present-tense',
    '{"title":"Present Tense Practice","description":"Practice exercises for present tense","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in present tense","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'present-tense' AND language = 'es'),
    'quiz',
    'Present Tense Quiz',
    'present-tense',
    '{"title":"Present Tense Quiz","description":"Assessment quiz for present tense","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for present tense?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"beginner"}',
    'beginner',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'preterite' AND language = 'es'),
    'practice',
    'Preterite Practice',
    'preterite',
    '{"title":"Preterite Practice","description":"Practice exercises for preterite","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in preterite","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'preterite' AND language = 'es'),
    'quiz',
    'Preterite Quiz',
    'preterite',
    '{"title":"Preterite Quiz","description":"Assessment quiz for preterite","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for preterite?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'progressive-tenses' AND language = 'es'),
    'practice',
    'Progressive Tenses Practice',
    'progressive-tenses',
    '{"title":"Progressive Tenses Practice","description":"Practice exercises for progressive tenses","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in progressive tenses","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'progressive-tenses' AND language = 'es'),
    'quiz',
    'Progressive Tenses Quiz',
    'progressive-tenses',
    '{"title":"Progressive Tenses Quiz","description":"Assessment quiz for progressive tenses","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for progressive tenses?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'pronominal-verbs' AND language = 'es'),
    'practice',
    'Pronominal Verbs Practice',
    'pronominal-verbs',
    '{"title":"Pronominal Verbs Practice","description":"Practice exercises for pronominal verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in pronominal verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'pronominal-verbs' AND language = 'es'),
    'quiz',
    'Pronominal Verbs Quiz',
    'pronominal-verbs',
    '{"title":"Pronominal Verbs Quiz","description":"Assessment quiz for pronominal verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for pronominal verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive' AND language = 'es'),
    'practice',
    'Reflexive Practice',
    'reflexive',
    '{"title":"Reflexive Practice","description":"Practice exercises for reflexive","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in reflexive","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive' AND language = 'es'),
    'quiz',
    'Reflexive Quiz',
    'reflexive',
    '{"title":"Reflexive Quiz","description":"Assessment quiz for reflexive","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for reflexive?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reported-speech' AND language = 'es'),
    'practice',
    'Reported Speech Practice',
    'reported-speech',
    '{"title":"Reported Speech Practice","description":"Practice exercises for reported speech","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in reported speech","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'reported-speech' AND language = 'es'),
    'quiz',
    'Reported Speech Quiz',
    'reported-speech',
    '{"title":"Reported Speech Quiz","description":"Assessment quiz for reported speech","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for reported speech?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'sequence-of-tenses' AND language = 'es'),
    'practice',
    'Sequence Of Tenses Practice',
    'sequence-of-tenses',
    '{"title":"Sequence Of Tenses Practice","description":"Practice exercises for sequence of tenses","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in sequence of tenses","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'sequence-of-tenses' AND language = 'es'),
    'quiz',
    'Sequence Of Tenses Quiz',
    'sequence-of-tenses',
    '{"title":"Sequence Of Tenses Quiz","description":"Assessment quiz for sequence of tenses","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for sequence of tenses?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'ser-vs-estar' AND language = 'es'),
    'practice',
    'Ser Vs Estar Practice',
    'ser-vs-estar',
    '{"title":"Ser Vs Estar Practice","description":"Practice exercises for ser vs estar","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in ser vs estar","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'ser-vs-estar' AND language = 'es'),
    'quiz',
    'Ser Vs Estar Quiz',
    'ser-vs-estar',
    '{"title":"Ser Vs Estar Quiz","description":"Assessment quiz for ser vs estar","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for ser vs estar?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stative-verbs' AND language = 'es'),
    'practice',
    'Stative Verbs Practice',
    'stative-verbs',
    '{"title":"Stative Verbs Practice","description":"Practice exercises for stative verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in stative verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stative-verbs' AND language = 'es'),
    'quiz',
    'Stative Verbs Quiz',
    'stative-verbs',
    '{"title":"Stative Verbs Quiz","description":"Assessment quiz for stative verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for stative verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stem-changing' AND language = 'es'),
    'practice',
    'Stem Changing Practice',
    'stem-changing',
    '{"title":"Stem Changing Practice","description":"Practice exercises for stem changing","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in stem changing","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'stem-changing' AND language = 'es'),
    'quiz',
    'Stem Changing Quiz',
    'stem-changing',
    '{"title":"Stem Changing Quiz","description":"Assessment quiz for stem changing","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for stem changing?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive' AND language = 'es'),
    'practice',
    'Subjunctive Practice',
    'subjunctive',
    '{"title":"Subjunctive Practice","description":"Practice exercises for subjunctive","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in subjunctive","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive' AND language = 'es'),
    'quiz',
    'Subjunctive Quiz',
    'subjunctive',
    '{"title":"Subjunctive Quiz","description":"Assessment quiz for subjunctive","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for subjunctive?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-imperfect' AND language = 'es'),
    'practice',
    'Subjunctive Imperfect Practice',
    'subjunctive-imperfect',
    '{"title":"Subjunctive Imperfect Practice","description":"Practice exercises for subjunctive imperfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in subjunctive imperfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-imperfect' AND language = 'es'),
    'quiz',
    'Subjunctive Imperfect Quiz',
    'subjunctive-imperfect',
    '{"title":"Subjunctive Imperfect Quiz","description":"Assessment quiz for subjunctive imperfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for subjunctive imperfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-perfect' AND language = 'es'),
    'practice',
    'Subjunctive Perfect Practice',
    'subjunctive-perfect',
    '{"title":"Subjunctive Perfect Practice","description":"Practice exercises for subjunctive perfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in subjunctive perfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-perfect' AND language = 'es'),
    'quiz',
    'Subjunctive Perfect Quiz',
    'subjunctive-perfect',
    '{"title":"Subjunctive Perfect Quiz","description":"Assessment quiz for subjunctive perfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for subjunctive perfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-pluperfect' AND language = 'es'),
    'practice',
    'Subjunctive Pluperfect Practice',
    'subjunctive-pluperfect',
    '{"title":"Subjunctive Pluperfect Practice","description":"Practice exercises for subjunctive pluperfect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in subjunctive pluperfect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-pluperfect' AND language = 'es'),
    'quiz',
    'Subjunctive Pluperfect Quiz',
    'subjunctive-pluperfect',
    '{"title":"Subjunctive Pluperfect Quiz","description":"Assessment quiz for subjunctive pluperfect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for subjunctive pluperfect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-present' AND language = 'es'),
    'practice',
    'Subjunctive Present Practice',
    'subjunctive-present',
    '{"title":"Subjunctive Present Practice","description":"Practice exercises for subjunctive present","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in subjunctive present","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'subjunctive-present' AND language = 'es'),
    'quiz',
    'Subjunctive Present Quiz',
    'subjunctive-present',
    '{"title":"Subjunctive Present Quiz","description":"Assessment quiz for subjunctive present","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for subjunctive present?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"advanced"}',
    'advanced',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'terminative-verbs' AND language = 'es'),
    'practice',
    'Terminative Verbs Practice',
    'terminative-verbs',
    '{"title":"Terminative Verbs Practice","description":"Practice exercises for terminative verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in terminative verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'terminative-verbs' AND language = 'es'),
    'quiz',
    'Terminative Verbs Quiz',
    'terminative-verbs',
    '{"title":"Terminative Verbs Quiz","description":"Assessment quiz for terminative verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for terminative verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'transitive-intransitive' AND language = 'es'),
    'practice',
    'Transitive Intransitive Practice',
    'transitive-intransitive',
    '{"title":"Transitive Intransitive Practice","description":"Practice exercises for transitive intransitive","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in transitive intransitive","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'transitive-intransitive' AND language = 'es'),
    'quiz',
    'Transitive Intransitive Quiz',
    'transitive-intransitive',
    '{"title":"Transitive Intransitive Quiz","description":"Assessment quiz for transitive intransitive","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for transitive intransitive?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-aspect' AND language = 'es'),
    'practice',
    'Verb Aspect Practice',
    'verb-aspect',
    '{"title":"Verb Aspect Practice","description":"Practice exercises for verb aspect","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb aspect","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-aspect' AND language = 'es'),
    'quiz',
    'Verb Aspect Quiz',
    'verb-aspect',
    '{"title":"Verb Aspect Quiz","description":"Assessment quiz for verb aspect","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb aspect?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-complementation' AND language = 'es'),
    'practice',
    'Verb Complementation Practice',
    'verb-complementation',
    '{"title":"Verb Complementation Practice","description":"Practice exercises for verb complementation","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb complementation","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-complementation' AND language = 'es'),
    'quiz',
    'Verb Complementation Quiz',
    'verb-complementation',
    '{"title":"Verb Complementation Quiz","description":"Assessment quiz for verb complementation","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb complementation?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-conjugation-patterns' AND language = 'es'),
    'practice',
    'Verb Conjugation Patterns Practice',
    'verb-conjugation-patterns',
    '{"title":"Verb Conjugation Patterns Practice","description":"Practice exercises for verb conjugation patterns","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb conjugation patterns","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-conjugation-patterns' AND language = 'es'),
    'quiz',
    'Verb Conjugation Patterns Quiz',
    'verb-conjugation-patterns',
    '{"title":"Verb Conjugation Patterns Quiz","description":"Assessment quiz for verb conjugation patterns","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb conjugation patterns?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-government' AND language = 'es'),
    'practice',
    'Verb Government Practice',
    'verb-government',
    '{"title":"Verb Government Practice","description":"Practice exercises for verb government","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb government","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-government' AND language = 'es'),
    'quiz',
    'Verb Government Quiz',
    'verb-government',
    '{"title":"Verb Government Quiz","description":"Assessment quiz for verb government","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb government?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-moods' AND language = 'es'),
    'practice',
    'Verb Moods Practice',
    'verb-moods',
    '{"title":"Verb Moods Practice","description":"Practice exercises for verb moods","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb moods","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-moods' AND language = 'es'),
    'quiz',
    'Verb Moods Quiz',
    'verb-moods',
    '{"title":"Verb Moods Quiz","description":"Assessment quiz for verb moods","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb moods?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-patterns' AND language = 'es'),
    'practice',
    'Verb Patterns Practice',
    'verb-patterns',
    '{"title":"Verb Patterns Practice","description":"Practice exercises for verb patterns","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb patterns","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-patterns' AND language = 'es'),
    'quiz',
    'Verb Patterns Quiz',
    'verb-patterns',
    '{"title":"Verb Patterns Quiz","description":"Assessment quiz for verb patterns","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb patterns?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-serialization' AND language = 'es'),
    'practice',
    'Verb Serialization Practice',
    'verb-serialization',
    '{"title":"Verb Serialization Practice","description":"Practice exercises for verb serialization","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb serialization","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-serialization' AND language = 'es'),
    'quiz',
    'Verb Serialization Quiz',
    'verb-serialization',
    '{"title":"Verb Serialization Quiz","description":"Assessment quiz for verb serialization","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb serialization?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-tense-agreement' AND language = 'es'),
    'practice',
    'Verb Tense Agreement Practice',
    'verb-tense-agreement',
    '{"title":"Verb Tense Agreement Practice","description":"Practice exercises for verb tense agreement","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb tense agreement","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-tense-agreement' AND language = 'es'),
    'quiz',
    'Verb Tense Agreement Quiz',
    'verb-tense-agreement',
    '{"title":"Verb Tense Agreement Quiz","description":"Assessment quiz for verb tense agreement","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb tense agreement?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-valency' AND language = 'es'),
    'practice',
    'Verb Valency Practice',
    'verb-valency',
    '{"title":"Verb Valency Practice","description":"Practice exercises for verb valency","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verb valency","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verb-valency' AND language = 'es'),
    'quiz',
    'Verb Valency Quiz',
    'verb-valency',
    '{"title":"Verb Valency Quiz","description":"Assessment quiz for verb valency","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verb valency?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verbal-periphrases' AND language = 'es'),
    'practice',
    'Verbal Periphrases Practice',
    'verbal-periphrases',
    '{"title":"Verbal Periphrases Practice","description":"Practice exercises for verbal periphrases","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in verbal periphrases","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'verbal-periphrases' AND language = 'es'),
    'quiz',
    'Verbal Periphrases Quiz',
    'verbal-periphrases',
    '{"title":"Verbal Periphrases Quiz","description":"Assessment quiz for verbal periphrases","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for verbal periphrases?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'voice-constructions' AND language = 'es'),
    'practice',
    'Voice Constructions Practice',
    'voice-constructions',
    '{"title":"Voice Constructions Practice","description":"Practice exercises for voice constructions","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in voice constructions","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'voice-constructions' AND language = 'es'),
    'quiz',
    'Voice Constructions Quiz',
    'voice-constructions',
    '{"title":"Voice Constructions Quiz","description":"Assessment quiz for voice constructions","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for voice constructions?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'weather-verbs' AND language = 'es'),
    'practice',
    'Weather Verbs Practice',
    'weather-verbs',
    '{"title":"Weather Verbs Practice","description":"Practice exercises for weather verbs","exercises":[{"type":"conjugation","instructions":"Conjugate the verb in weather verbs","prompts":[{"sentence":"Yo _____ (hablar)","answer":"hablo","explanation":"First person singular conjugation"},{"sentence":"Tú _____ (comer)","answer":"comes","explanation":"Second person singular conjugation"},{"sentence":"Él _____ (vivir)","answer":"vive","explanation":"Third person singular conjugation"}]},{"type":"fill_blank","instructions":"Complete the sentences with the correct verb form","prompts":[{"sentence":"María _____ en Madrid","answer":"vive","options":["vive","vives","vivimos"],"explanation":"Third person singular form"},{"sentence":"Nosotros _____ español","answer":"hablamos","options":["habla","hablamos","hablan"],"explanation":"First person plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'weather-verbs' AND language = 'es'),
    'quiz',
    'Weather Verbs Quiz',
    'weather-verbs',
    '{"title":"Weather Verbs Quiz","description":"Assessment quiz for weather verbs","questions":[{"type":"multiple_choice","question":"Which is the correct conjugation for weather verbs?","options":["habla","hablas","hablamos","hablan"],"correct_answer":"habla","explanation":"Third person singular form of hablar"},{"type":"conjugation","question":"Conjugate: Yo _____ (comer)","correct_answer":"como","explanation":"First person singular of comer"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-adverb' AND language = 'es'),
    'practice',
    'Adjective Adverb Practice',
    'adjective-adverb',
    '{"title":"Adjective Adverb Practice","description":"Practice exercises for adjective adverb","exercises":[{"type":"fill_blank","instructions":"Complete sentences using adjective adverb","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-adverb' AND language = 'es'),
    'quiz',
    'Adjective Adverb Quiz',
    'adjective-adverb',
    '{"title":"Adjective Adverb Quiz","description":"Assessment quiz for adjective adverb","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses adjective adverb?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-noun' AND language = 'es'),
    'practice',
    'Adjective Noun Practice',
    'adjective-noun',
    '{"title":"Adjective Noun Practice","description":"Practice exercises for adjective noun","exercises":[{"type":"fill_blank","instructions":"Complete sentences using adjective noun","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-noun' AND language = 'es'),
    'quiz',
    'Adjective Noun Quiz',
    'adjective-noun',
    '{"title":"Adjective Noun Quiz","description":"Assessment quiz for adjective noun","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses adjective noun?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'augmentative-suffixes' AND language = 'es'),
    'practice',
    'Augmentative Suffixes Practice',
    'augmentative-suffixes',
    '{"title":"Augmentative Suffixes Practice","description":"Practice exercises for augmentative suffixes","exercises":[{"type":"fill_blank","instructions":"Complete sentences using augmentative suffixes","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'augmentative-suffixes' AND language = 'es'),
    'quiz',
    'Augmentative Suffixes Quiz',
    'augmentative-suffixes',
    '{"title":"Augmentative Suffixes Quiz","description":"Assessment quiz for augmentative suffixes","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses augmentative suffixes?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'diminutive-suffixes' AND language = 'es'),
    'practice',
    'Diminutive Suffixes Practice',
    'diminutive-suffixes',
    '{"title":"Diminutive Suffixes Practice","description":"Practice exercises for diminutive suffixes","exercises":[{"type":"fill_blank","instructions":"Complete sentences using diminutive suffixes","prompts":[{"sentence":"El estudiante _____ muy inteligente","answer":"es","options":["es","está","hay"],"explanation":"Use ser for permanent characteristics"},{"sentence":"La comida _____ deliciosa","answer":"está","options":["es","está","hay"],"explanation":"Use estar for temporary states"}]},{"type":"translation","instructions":"Translate these sentences","prompts":[{"english":"The book is interesting","answer":"El libro es interesante","explanation":"Direct translation with proper article and verb"},{"english":"I am studying Spanish","answer":"Estoy estudiando español","explanation":"Present continuous with estar + gerund"}]}],"estimated_duration":15,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    15,
    1,
    true,
    false
  );

INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'diminutive-suffixes' AND language = 'es'),
    'quiz',
    'Diminutive Suffixes Quiz',
    'diminutive-suffixes',
    '{"title":"Diminutive Suffixes Quiz","description":"Assessment quiz for diminutive suffixes","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses diminutive suffixes?","options":["Es correcto","Está correcto","Hay correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );