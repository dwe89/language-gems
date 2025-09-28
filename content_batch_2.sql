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