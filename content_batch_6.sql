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