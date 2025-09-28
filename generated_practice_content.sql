INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = 'agreement' AND language = 'es'),
    'practice',
    'Agreement Practice',
    'agreement',
    '{"title":"Agreement Practice","description":"Interactive practice exercises for agreement","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Agreement Quiz","description":"Assessment quiz for agreement","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Comparison Practice","description":"Interactive practice exercises for comparison","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Comparison Quiz","description":"Assessment quiz for comparison","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Position Practice","description":"Interactive practice exercises for position","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Position Quiz","description":"Assessment quiz for position","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Possessive Practice","description":"Interactive practice exercises for possessive","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Possessive Quiz","description":"Assessment quiz for possessive","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Personal A Practice","description":"Interactive practice exercises for personal a","exercises":[{"type":"usage","instructions":"Choose the correct preposition","prompts":[{"sentence":"Voy _____ la escuela","options":["a","en","de"],"answer":"a","explanation":"Use \"a\" for direction/destination"},{"sentence":"El libro está _____ la mesa","options":["en","a","de"],"answer":"en","explanation":"Use \"en\" for location on a surface"}]},{"type":"por_para","instructions":"Choose between por and para","prompts":[{"sentence":"Estudio _____ ser médico","options":["por","para"],"answer":"para","explanation":"Use \"para\" for purpose/goal"},{"sentence":"Camino _____ el parque","options":["por","para"],"answer":"por","explanation":"Use \"por\" for movement through a place"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Personal A Quiz","description":"Assessment quiz for personal a","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses personal a?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Por Vs Para Practice","description":"Interactive practice exercises for por vs para","exercises":[{"type":"usage","instructions":"Choose the correct preposition","prompts":[{"sentence":"Voy _____ la escuela","options":["a","en","de"],"answer":"a","explanation":"Use \"a\" for direction/destination"},{"sentence":"El libro está _____ la mesa","options":["en","a","de"],"answer":"en","explanation":"Use \"en\" for location on a surface"}]},{"type":"por_para","instructions":"Choose between por and para","prompts":[{"sentence":"Estudio _____ ser médico","options":["por","para"],"answer":"para","explanation":"Use \"para\" for purpose/goal"},{"sentence":"Camino _____ el parque","options":["por","para"],"answer":"por","explanation":"Use \"por\" for movement through a place"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Por Vs Para Quiz","description":"Assessment quiz for por vs para","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses por vs para?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Formation Practice","description":"Interactive practice exercises for formation","exercises":[{"type":"formation","instructions":"Form adverbs from adjectives","prompts":[{"adjective":"rápido","answer":"rápidamente","explanation":"Add -mente to feminine form of adjective"},{"adjective":"fácil","answer":"fácilmente","explanation":"Add -mente to adjectives ending in consonant"}]},{"type":"usage","instructions":"Choose the correct adverb","prompts":[{"sentence":"Habla muy _____","options":["rápido","rápidamente"],"answer":"rápidamente","explanation":"Use adverb to modify verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Formation Quiz","description":"Assessment quiz for formation","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses formation?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Definite Articles Practice","description":"Interactive practice exercises for definite articles","exercises":[{"type":"definite_indefinite","instructions":"Choose the correct article","prompts":[{"noun":"casa","context":"specific","answer":"la casa","explanation":"Use definite article for specific reference"},{"noun":"libro","context":"general","answer":"un libro","explanation":"Use indefinite article for general reference"}]},{"type":"gender_agreement","instructions":"Match articles with noun gender","prompts":[{"noun":"problema","answer":"el problema","explanation":"Problema is masculine despite ending in -a"},{"noun":"mano","answer":"la mano","explanation":"Mano is feminine despite ending in -o"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'definite-articles' AND language = 'es'),
    'quiz',
    'Definite Articles Quiz',
    'definite-articles',
    '{"title":"Definite Articles Quiz","description":"Assessment quiz for definite articles","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite articles?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Definite Indefinite Practice","description":"Interactive practice exercises for definite indefinite","exercises":[{"type":"definite_indefinite","instructions":"Choose the correct article","prompts":[{"noun":"casa","context":"specific","answer":"la casa","explanation":"Use definite article for specific reference"},{"noun":"libro","context":"general","answer":"un libro","explanation":"Use indefinite article for general reference"}]},{"type":"gender_agreement","instructions":"Match articles with noun gender","prompts":[{"noun":"problema","answer":"el problema","explanation":"Problema is masculine despite ending in -a"},{"noun":"mano","answer":"la mano","explanation":"Mano is feminine despite ending in -o"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Definite Indefinite Quiz","description":"Assessment quiz for definite indefinite","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite indefinite?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Agreement Position Practice","description":"Interactive practice exercises for agreement position","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Agreement Position Quiz","description":"Assessment quiz for agreement position","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Gender And Plurals Practice","description":"Interactive practice exercises for gender and plurals","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner","content_type":"practice"}',
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
    '{"title":"Gender And Plurals Quiz","description":"Assessment quiz for gender and plurals","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"beginner","content_type":"quiz"}',
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
    '{"title":"Gender Rules Practice","description":"Interactive practice exercises for gender rules","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner","content_type":"practice"}',
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
    '{"title":"Gender Rules Quiz","description":"Assessment quiz for gender rules","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"beginner","content_type":"quiz"}',
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
    '{"title":"Nominalisation Practice","description":"Interactive practice exercises for nominalisation","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"advanced","content_type":"practice"}',
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
    '{"title":"Nominalisation Quiz","description":"Assessment quiz for nominalisation","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"advanced","content_type":"quiz"}',
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
    '{"title":"Plurals Practice","description":"Interactive practice exercises for plurals","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner","content_type":"practice"}',
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
    '{"title":"Plurals Quiz","description":"Assessment quiz for plurals","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"beginner","content_type":"quiz"}',
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
    '{"title":"Possessive Adj Practice","description":"Interactive practice exercises for possessive adj","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Possessive Adj Quiz","description":"Assessment quiz for possessive adj","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Direct Object Practice","description":"Interactive practice exercises for direct object","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Direct Object Quiz","description":"Assessment quiz for direct object","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Indirect Object Practice","description":"Interactive practice exercises for indirect object","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Indirect Object Quiz","description":"Assessment quiz for indirect object","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Interrogative Practice","description":"Interactive practice exercises for interrogative","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Interrogative Quiz","description":"Assessment quiz for interrogative","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Personal Practice","description":"Interactive practice exercises for personal","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Personal Quiz","description":"Assessment quiz for personal","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-pronouns' AND language = 'es'),
    'practice',
    'Possessive Pronouns Practice',
    'possessive-pronouns',
    '{"title":"Possessive Pronouns Practice","description":"Interactive practice exercises for possessive pronouns","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-pronouns' AND language = 'es'),
    'quiz',
    'Possessive Pronouns Quiz',
    'possessive-pronouns',
    '{"title":"Possessive Pronouns Quiz","description":"Assessment quiz for possessive pronouns","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive-pronouns' AND language = 'es'),
    'practice',
    'Reflexive Pronouns Practice',
    'reflexive-pronouns',
    '{"title":"Reflexive Pronouns Practice","description":"Interactive practice exercises for reflexive pronouns","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive-pronouns' AND language = 'es'),
    'quiz',
    'Reflexive Pronouns Quiz',
    'reflexive-pronouns',
    '{"title":"Reflexive Pronouns Quiz","description":"Assessment quiz for reflexive pronouns","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Relative Practice","description":"Interactive practice exercises for relative","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'relative' AND language = 'es'),
    'quiz',
    'Relative Quiz',
    'relative',
    '{"title":"Relative Quiz","description":"Assessment quiz for relative","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'subject' AND language = 'es'),
    'practice',
    'Subject Practice',
    'subject',
    '{"title":"Subject Practice","description":"Interactive practice exercises for subject","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Subject Quiz","description":"Assessment quiz for subject","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Sound Symbol Practice","description":"Interactive practice exercises for sound symbol","exercises":[{"type":"accent_placement","instructions":"Place accents correctly","prompts":[{"word":"medico","answer":"médico","explanation":"Stress on antepenultimate syllable requires accent"},{"word":"corazon","answer":"corazón","explanation":"Words ending in -n need accent when stressed on last syllable"}]},{"type":"stress_identification","instructions":"Identify the stressed syllable","prompts":[{"word":"teléfono","answer":2,"explanation":"Second syllable is stressed"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Sound Symbol Quiz","description":"Assessment quiz for sound symbol","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses sound symbol?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Stress Patterns Practice","description":"Interactive practice exercises for stress patterns","exercises":[{"type":"accent_placement","instructions":"Place accents correctly","prompts":[{"word":"medico","answer":"médico","explanation":"Stress on antepenultimate syllable requires accent"},{"word":"corazon","answer":"corazón","explanation":"Words ending in -n need accent when stressed on last syllable"}]},{"type":"stress_identification","instructions":"Identify the stressed syllable","prompts":[{"word":"teléfono","answer":2,"explanation":"Second syllable is stressed"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Stress Patterns Quiz","description":"Assessment quiz for stress patterns","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses stress patterns?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Written Accents Practice","description":"Interactive practice exercises for written accents","exercises":[{"type":"accent_placement","instructions":"Place accents correctly","prompts":[{"word":"medico","answer":"médico","explanation":"Stress on antepenultimate syllable requires accent"},{"word":"corazon","answer":"corazón","explanation":"Words ending in -n need accent when stressed on last syllable"}]},{"type":"stress_identification","instructions":"Identify the stressed syllable","prompts":[{"word":"teléfono","answer":2,"explanation":"Second syllable is stressed"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Written Accents Quiz","description":"Assessment quiz for written accents","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses written accents?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Adjective Adverb Practice","description":"Interactive practice exercises for adjective adverb","exercises":[{"type":"suffix_formation","instructions":"Form words using suffixes","prompts":[{"base":"casa","suffix":"-ita","answer":"casita","explanation":"Diminutive suffix -ita makes things smaller/cuter"},{"base":"perro","suffix":"-ón","answer":"perrón","explanation":"Augmentative suffix -ón makes things bigger"}]},{"type":"word_transformation","instructions":"Transform words between categories","prompts":[{"adjective":"rápido","target":"adverb","answer":"rápidamente","explanation":"Add -mente to form adverb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Adjective Adverb Quiz","description":"Assessment quiz for adjective adverb","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses adjective adverb?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Adjective Noun Practice","description":"Interactive practice exercises for adjective noun","exercises":[{"type":"suffix_formation","instructions":"Form words using suffixes","prompts":[{"base":"casa","suffix":"-ita","answer":"casita","explanation":"Diminutive suffix -ita makes things smaller/cuter"},{"base":"perro","suffix":"-ón","answer":"perrón","explanation":"Augmentative suffix -ón makes things bigger"}]},{"type":"word_transformation","instructions":"Transform words between categories","prompts":[{"adjective":"rápido","target":"adverb","answer":"rápidamente","explanation":"Add -mente to form adverb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Adjective Noun Quiz","description":"Assessment quiz for adjective noun","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses adjective noun?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Augmentative Suffixes Practice","description":"Interactive practice exercises for augmentative suffixes","exercises":[{"type":"suffix_formation","instructions":"Form words using suffixes","prompts":[{"base":"casa","suffix":"-ita","answer":"casita","explanation":"Diminutive suffix -ita makes things smaller/cuter"},{"base":"perro","suffix":"-ón","answer":"perrón","explanation":"Augmentative suffix -ón makes things bigger"}]},{"type":"word_transformation","instructions":"Transform words between categories","prompts":[{"adjective":"rápido","target":"adverb","answer":"rápidamente","explanation":"Add -mente to form adverb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Augmentative Suffixes Quiz","description":"Assessment quiz for augmentative suffixes","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses augmentative suffixes?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    '{"title":"Diminutive Suffixes Practice","description":"Interactive practice exercises for diminutive suffixes","exercises":[{"type":"suffix_formation","instructions":"Form words using suffixes","prompts":[{"base":"casa","suffix":"-ita","answer":"casita","explanation":"Diminutive suffix -ita makes things smaller/cuter"},{"base":"perro","suffix":"-ón","answer":"perrón","explanation":"Augmentative suffix -ón makes things bigger"}]},{"type":"word_transformation","instructions":"Transform words between categories","prompts":[{"adjective":"rápido","target":"adverb","answer":"rápidamente","explanation":"Add -mente to form adverb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    '{"title":"Diminutive Suffixes Quiz","description":"Assessment quiz for diminutive suffixes","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses diminutive suffixes?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    'KS3',
    10,
    2,
    true,
    false
  );