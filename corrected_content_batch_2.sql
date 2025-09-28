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
    '11-14',
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
    '11-14',
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
    '11-14',
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
    '11-14',
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
    '11-14',
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
    '11-14',
    10,
    2,
    true,
    false
  );