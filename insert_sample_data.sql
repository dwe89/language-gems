-- Insert some sample games
INSERT INTO public.games (name, description, thumbnail_url, difficulty, max_players, estimated_time, theme_color, is_new, is_featured)
VALUES 
('Word Clicker', 'Click the button as many times as you can in 10 seconds!', '/games/vocab-match.jpg', 1, 1, '10 sec', 'text-blue-500', true, false),
('Vocabulary Match', 'Match the words with their meanings as quickly as possible', '/games/vocab-match.jpg', 2, 1, '5 min', 'text-green-500', false, true),
('Grammar Quest', 'Test your grammar knowledge in this adventure game', '/games/grammar-quest.jpg', 3, 1, '10 min', 'text-purple-500', false, false),
('Word Battle', 'Challenge your friends to a vocabulary battle', '/games/word-battle.jpg', 2, 4, '15 min', 'text-red-500', false, false),
('Speed Translation', 'Translate phrases as quickly as possible', '/games/speed-translation.jpg', 3, 1, '5 min', 'text-yellow-500', true, true)
ON CONFLICT (id) DO NOTHING; 