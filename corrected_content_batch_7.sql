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
    (SELECT id FROM grammar_topics WHERE slug = 'personal' AND language = 'es'),
    'quiz',
    'Personal Quiz',
    'personal',
    '{"title":"Personal Quiz","description":"Assessment quiz for personal","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-pronouns' AND language = 'es'),
    'practice',
    'Possessive Pronouns Practice',
    'possessive-pronouns',
    '{"title":"Possessive Pronouns Practice","description":"Interactive practice exercises for possessive pronouns","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'possessive-pronouns' AND language = 'es'),
    'quiz',
    'Possessive Pronouns Quiz',
    'possessive-pronouns',
    '{"title":"Possessive Pronouns Quiz","description":"Assessment quiz for possessive pronouns","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive-pronouns' AND language = 'es'),
    'practice',
    'Reflexive Pronouns Practice',
    'reflexive-pronouns',
    '{"title":"Reflexive Pronouns Practice","description":"Interactive practice exercises for reflexive pronouns","exercises":[{"type":"substitution","instructions":"Replace nouns with appropriate pronouns","prompts":[{"sentence":"Veo a María","answer":"La veo","explanation":"La replaces feminine direct object"},{"sentence":"Doy el libro a Juan","answer":"Le doy el libro","explanation":"Le replaces indirect object"}]},{"type":"placement","instructions":"Place pronouns correctly","prompts":[{"elements":["quiero","ver","lo"],"answer":"Quiero verlo / Lo quiero ver","explanation":"Pronouns can attach to infinitive or precede conjugated verb"}]}],"estimated_duration":15,"difficulty_level":"intermediate","content_type":"practice"}',
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
    (SELECT id FROM grammar_topics WHERE slug = 'reflexive-pronouns' AND language = 'es'),
    'quiz',
    'Reflexive Pronouns Quiz',
    'reflexive-pronouns',
    '{"title":"Reflexive Pronouns Quiz","description":"Assessment quiz for reflexive pronouns","questions":[{"type":"multiple_choice","question":"Replace the direct object: \"Veo el libro\"","options":["Lo veo","La veo","Le veo"],"correct_answer":"Lo veo","explanation":"Lo replaces masculine direct objects"}],"estimated_duration":10,"difficulty_level":"intermediate","content_type":"quiz"}',
    'intermediate',
    '11-14',
    10,
    2,
    true,
    false
  );