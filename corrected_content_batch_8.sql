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
    (SELECT id FROM grammar_topics WHERE slug = 'relative' AND language = 'es'),
    'quiz',
    'Relative Quiz',
    'relative',
    '{"title":"Relative Quiz","description":"Assessment quiz for relative","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'subject' AND language = 'es'),
    'practice',
    'Subject Practice',
    'subject',
    '{"title":"Subject Practice","description":"Interactive practice exercises for subject","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'subject' AND language = 'es'),
    'quiz',
    'Subject Quiz',
    'subject',
    '{"title":"Subject Quiz","description":"Assessment quiz for subject","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'sound-symbol' AND language = 'es'),
    'practice',
    'Sound Symbol Practice',
    'sound-symbol',
    '{"title":"Sound Symbol Practice","description":"Interactive practice exercises for sound symbol","exercises":[{"type":"accent_placement","instructions":"Place accents correctly","prompts":[{"word":"medico","answer":"médico","explanation":"Stress on antepenultimate syllable requires accent"},{"word":"corazon","answer":"corazón","explanation":"Words ending in -n need accent when stressed on last syllable"}]},{"type":"stress_identification","instructions":"Identify the stressed syllable","prompts":[{"word":"teléfono","answer":2,"explanation":"Second syllable is stressed"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'sound-symbol' AND language = 'es'),
    'quiz',
    'Sound Symbol Quiz',
    'sound-symbol',
    '{"title":"Sound Symbol Quiz","description":"Assessment quiz for sound symbol","questions":[{"type":"multiple_choice","question":"Which sentence correctly uses sound symbol?","options":["Es correcto","Está correcto"],"correct_answer":"Es correcto","explanation":"Use ser for permanent characteristics"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    '11-14',
    10,
    2,
    true,
    false
  );