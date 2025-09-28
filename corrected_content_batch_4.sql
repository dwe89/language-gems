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
    (SELECT id FROM grammar_topics WHERE slug = 'agreement-position' AND language = 'es'),
    'quiz',
    'Agreement Position Quiz',
    'agreement-position',
    '{"title":"Agreement Position Quiz","description":"Assessment quiz for agreement position","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'gender-and-plurals' AND language = 'es'),
    'practice',
    'Gender And Plurals Practice',
    'gender-and-plurals',
    '{"title":"Gender And Plurals Practice","description":"Interactive practice exercises for gender and plurals","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner","content_type":"practice"}',
    'beginner',
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
    (SELECT id FROM grammar_topics WHERE slug = 'gender-and-plurals' AND language = 'es'),
    'quiz',
    'Gender And Plurals Quiz',
    'gender-and-plurals',
    '{"title":"Gender And Plurals Quiz","description":"Assessment quiz for gender and plurals","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"beginner","content_type":"quiz"}',
    'beginner',
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
    (SELECT id FROM grammar_topics WHERE slug = 'gender-rules' AND language = 'es'),
    'practice',
    'Gender Rules Practice',
    'gender-rules',
    '{"title":"Gender Rules Practice","description":"Interactive practice exercises for gender rules","exercises":[{"type":"gender","instructions":"Identify the gender of these nouns","prompts":[{"noun":"mesa","answer":"feminine","options":["masculine","feminine"],"explanation":"Most nouns ending in -a are feminine"},{"noun":"problema","answer":"masculine","options":["masculine","feminine"],"explanation":"Problema is masculine despite ending in -a"}]},{"type":"plural","instructions":"Form the plural of these nouns","prompts":[{"singular":"casa","answer":"casas","explanation":"Add -s to nouns ending in vowels"},{"singular":"ciudad","answer":"ciudades","explanation":"Add -es to nouns ending in consonants"}]}],"estimated_duration":15,"difficulty_level":"beginner","content_type":"practice"}',
    'beginner',
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
    (SELECT id FROM grammar_topics WHERE slug = 'gender-rules' AND language = 'es'),
    'quiz',
    'Gender Rules Quiz',
    'gender-rules',
    '{"title":"Gender Rules Quiz","description":"Assessment quiz for gender rules","questions":[{"type":"multiple_choice","question":"What is the gender of \"problema\"?","options":["masculine","feminine"],"correct_answer":"masculine","explanation":"Problema is masculine despite ending in -a"}],"estimated_duration":10,"difficulty_level":"beginner","content_type":"quiz"}',
    'beginner',
    '11-14',
    10,
    2,
    true,
    false
  );