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
    (SELECT id FROM grammar_topics WHERE slug = 'stress-patterns' AND language = 'es'),
    'quiz',
    'Stress Patterns Quiz',
    'stress-patterns',
    '{"title":"Stress Patterns Quiz","description":"Assessment quiz for stress patterns","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses stress patterns?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'written-accents' AND language = 'es'),
    'practice',
    'Written Accents Practice',
    'written-accents',
    '{"title":"Written Accents Practice","description":"Interactive practice exercises for written accents","exercises":[{"type":"accent_placement","instructions":"Place accents correctly","prompts":[{"word":"medico","answer":"médico","explanation":"Stress on antepenultimate syllable requires accent"},{"word":"corazon","answer":"corazón","explanation":"Words ending in -n need accent when stressed on last syllable"}]},{"type":"stress_identification","instructions":"Identify the stressed syllable","prompts":[{"word":"teléfono","answer":2,"explanation":"Second syllable is stressed"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'written-accents' AND language = 'es'),
    'quiz',
    'Written Accents Quiz',
    'written-accents',
    '{"title":"Written Accents Quiz","description":"Assessment quiz for written accents","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses written accents?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-adverb' AND language = 'es'),
    'practice',
    'Adjective Adverb Practice',
    'adjective-adverb',
    '{"title":"Adjective Adverb Practice","description":"Interactive practice exercises for adjective adverb","exercises":[{"type":"suffix_formation","instructions":"Form words using suffixes","prompts":[{"base":"casa","suffix":"-ita","answer":"casita","explanation":"Diminutive suffix -ita makes things smaller/cuter"},{"base":"perro","suffix":"-ón","answer":"perrón","explanation":"Augmentative suffix -ón makes things bigger"}]},{"type":"word_transformation","instructions":"Transform words between categories","prompts":[{"adjective":"rápido","target":"adverb","answer":"rápidamente","explanation":"Add -mente to form adverb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'adjective-adverb' AND language = 'es'),
    'quiz',
    'Adjective Adverb Quiz',
    'adjective-adverb',
    '{"title":"Adjective Adverb Quiz","description":"Assessment quiz for adjective adverb","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses adjective adverb?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    '11-14',
    10,
    2,
    true,
    false
  );