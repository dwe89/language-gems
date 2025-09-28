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
    (SELECT id FROM grammar_topics WHERE slug = 'agreement' AND language = 'es'),
    'quiz',
    'Agreement Quiz',
    'agreement',
    '{"title":"Agreement Quiz","description":"Assessment quiz for agreement","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'comparison' AND language = 'es'),
    'practice',
    'Comparison Practice',
    'comparison',
    '{"title":"Comparison Practice","description":"Interactive practice exercises for comparison","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'comparison' AND language = 'es'),
    'quiz',
    'Comparison Quiz',
    'comparison',
    '{"title":"Comparison Quiz","description":"Assessment quiz for comparison","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'position' AND language = 'es'),
    'practice',
    'Position Practice',
    'position',
    '{"title":"Position Practice","description":"Interactive practice exercises for position","exercises":[{"type":"agreement","instructions":"Make adjectives agree with nouns","prompts":[{"phrase":"la mesa (blanco)","answer":"la mesa blanca","explanation":"Adjective agrees with feminine singular noun"},{"phrase":"los libros (interesante)","answer":"los libros interesantes","explanation":"Adjective agrees with masculine plural noun"},{"phrase":"las casas (pequeño)","answer":"las casas pequeñas","explanation":"Adjective agrees with feminine plural noun"}]},{"type":"position","instructions":"Place adjectives in the correct position","prompts":[{"elements":["casa","grande"],"answer":"casa grande","explanation":"Descriptive adjectives usually follow the noun"},{"elements":["buen","amigo"],"answer":"buen amigo","explanation":"Bueno shortens to buen before masculine singular nouns"}]},{"type":"fill_blank","instructions":"Complete with the correct adjective form","prompts":[{"sentence":"El coche es _____ (rojo)","answer":"rojo","explanation":"Masculine singular form"},{"sentence":"Las flores son _____ (bonito)","answer":"bonitas","explanation":"Feminine plural form"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'position' AND language = 'es'),
    'quiz',
    'Position Quiz',
    'position',
    '{"title":"Position Quiz","description":"Assessment quiz for position","questions":[{"type":"multiple_choice","question":"Which adjective agrees correctly with \"las casas\"?","options":["blanco","blanca","blancos","blancas"],"correct_answer":"blancas","explanation":"Adjective must agree in gender (feminine) and number (plural)"},{"type":"fill_blank","question":"Complete: El coche _____ (rojo)","correct_answer":"rojo","explanation":"Masculine singular form matches el coche"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    '11-14',
    10,
    2,
    true,
    false
  );