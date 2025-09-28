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