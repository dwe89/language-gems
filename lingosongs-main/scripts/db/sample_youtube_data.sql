-- Sample data for YouTube video integration

-- Insert a sample YouTube video (Despacito)
INSERT INTO youtube_videos (
  title, 
  description, 
  youtube_id, 
  language, 
  level, 
  thumbnail_url, 
  is_premium
) VALUES (
  'Despacito - Luis Fonsi ft. Daddy Yankee',
  'Learn Spanish with this popular song. Practice your listening skills and expand your vocabulary with this hit song from Puerto Rico.',
  'kJQP7kiw5Fk',
  'es',
  'intermediate',
  'https://img.youtube.com/vi/kJQP7kiw5Fk/maxresdefault.jpg',
  false
) ON CONFLICT (youtube_id) DO NOTHING;

-- Get the video ID for the following inserts
DO $$
DECLARE
  video_id UUID;
  quiz_id_1 UUID;
  quiz_id_2 UUID;
  quiz_id_3 UUID;
BEGIN
  SELECT id INTO video_id FROM youtube_videos WHERE youtube_id = 'kJQP7kiw5Fk';
  
  -- Insert lyrics for Despacito
  INSERT INTO youtube_lyrics (
    video_id, 
    timestamp, 
    text, 
    translation, 
    section_order
  ) VALUES
    (video_id, 17, 'Sí, sabes que ya llevo un rato mirándote', 'Yes, you know I''ve been looking at you for a while', 1),
    (video_id, 21, 'Tengo que bailar contigo hoy', 'I have to dance with you today', 2),
    (video_id, 25, 'Vi que tu mirada ya estaba llamándome', 'I saw that your look was already calling me', 3),
    (video_id, 29, 'Muéstrame el camino que yo voy', 'Show me the way I''m going', 4),
    (video_id, 34, 'Tú, tú eres el imán y yo soy el metal', 'You, you are the magnet and I am the metal', 5),
    (video_id, 38, 'Me voy acercando y voy armando el plan', 'I''m getting closer and putting together the plan', 6),
    (video_id, 42, 'Solo con pensarlo se acelera el pulso', 'Just thinking about it accelerates the pulse', 7),
    (video_id, 46, 'Ya, ya me está gustando más de lo normal', 'I''m already liking it more than usual', 8),
    (video_id, 51, 'Todos mis sentidos van pidiendo más', 'All my senses are asking for more', 9),
    (video_id, 55, 'Esto hay que tomarlo sin ningún apuro', 'This has to be taken without any haste', 10);
  
  -- Insert quiz points
  INSERT INTO youtube_quiz_points (
    video_id, 
    timestamp, 
    question, 
    explanation
  ) VALUES
    (video_id, 30, '¿Qué significa "Muéstrame el camino que yo voy"?', 'This phrase uses the verb "mostrar" (to show) in imperative form.'),
    (video_id, 43, '¿Cuál es el sentido de "se acelera el pulso"?', 'This is an expression about how the heart beats faster when excited or nervous.'),
    (video_id, 60, '¿Qué tipo de palabra es "apuro" en la frase "sin ningún apuro"?')
  RETURNING id INTO quiz_id_1, quiz_id_2, quiz_id_3;
  
  -- Insert quiz options for first quiz
  INSERT INTO youtube_quiz_options (
    quiz_id, 
    text, 
    is_correct
  ) VALUES
    (quiz_id_1, 'Show me the way I''m going', TRUE),
    (quiz_id_1, 'Take me where I need to go', FALSE),
    (quiz_id_1, 'Guide me on my journey', FALSE),
    (quiz_id_1, 'Tell me which road to take', FALSE);
  
  -- Insert quiz options for second quiz
  INSERT INTO youtube_quiz_options (
    quiz_id, 
    text, 
    is_correct
  ) VALUES
    (quiz_id_2, 'The pulse accelerates', TRUE),
    (quiz_id_2, 'The mind races', FALSE),
    (quiz_id_2, 'Time speeds up', FALSE),
    (quiz_id_2, 'The body trembles', FALSE);
  
  -- Insert quiz options for third quiz
  INSERT INTO youtube_quiz_options (
    quiz_id, 
    text, 
    is_correct
  ) VALUES
    (quiz_id_3, 'Sustantivo (Noun)', TRUE),
    (quiz_id_3, 'Verbo (Verb)', FALSE),
    (quiz_id_3, 'Adjetivo (Adjective)', FALSE),
    (quiz_id_3, 'Adverbio (Adverb)', FALSE);
    
END $$; 