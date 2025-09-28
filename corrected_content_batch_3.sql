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
    (SELECT id FROM grammar_topics WHERE slug = 'formation' AND language = 'es'),
    'quiz',
    'Formation Quiz',
    'formation',
    '{"title":"Formation Quiz","description":"Assessment quiz for formation","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses formation?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'definite-articles' AND language = 'es'),
    'practice',
    'Definite Articles Practice',
    'definite-articles',
    '{"title":"Definite Articles Practice","description":"Interactive practice exercises for definite articles","exercises":[{"type":"definite_indefinite","instructions":"Choose the correct article","prompts":[{"noun":"casa","context":"specific","answer":"la casa","explanation":"Use definite article for specific reference"},{"noun":"libro","context":"general","answer":"un libro","explanation":"Use indefinite article for general reference"}]},{"type":"gender_agreement","instructions":"Match articles with noun gender","prompts":[{"noun":"problema","answer":"el problema","explanation":"Problema is masculine despite ending in -a"},{"noun":"mano","answer":"la mano","explanation":"Mano is feminine despite ending in -o"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'definite-articles' AND language = 'es'),
    'quiz',
    'Definite Articles Quiz',
    'definite-articles',
    '{"title":"Definite Articles Quiz","description":"Assessment quiz for definite articles","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite articles?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'practice',
    'Definite Indefinite Practice',
    'definite-indefinite',
    '{"title":"Definite Indefinite Practice","description":"Interactive practice exercises for definite indefinite","exercises":[{"type":"definite_indefinite","instructions":"Choose the correct article","prompts":[{"noun":"casa","context":"specific","answer":"la casa","explanation":"Use definite article for specific reference"},{"noun":"libro","context":"general","answer":"un libro","explanation":"Use indefinite article for general reference"}]},{"type":"gender_agreement","instructions":"Match articles with noun gender","prompts":[{"noun":"problema","answer":"el problema","explanation":"Problema is masculine despite ending in -a"},{"noun":"mano","answer":"la mano","explanation":"Mano is feminine despite ending in -o"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'definite-indefinite' AND language = 'es'),
    'quiz',
    'Definite Indefinite Quiz',
    'definite-indefinite',
    '{"title":"Definite Indefinite Quiz","description":"Assessment quiz for definite indefinite","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses definite indefinite?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    '11-14',
    10,
    2,
    true,
    false
  );