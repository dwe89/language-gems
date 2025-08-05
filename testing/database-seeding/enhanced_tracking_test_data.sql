-- Enhanced Tracking System Test Data Seeding Script
-- This script creates comprehensive test data for validating the enhanced tracking system
-- across all 15 games with realistic scenarios and edge cases

-- Clean up existing test data
DELETE FROM word_performance_logs WHERE session_id IN (
    SELECT id FROM enhanced_game_sessions WHERE student_id LIKE 'test-%'
);
DELETE FROM enhanced_game_sessions WHERE student_id LIKE 'test-%';

-- ============================================================================
-- SKILL-BASED GAMES TEST DATA
-- These games should track detailed vocabulary/accuracy data
-- ============================================================================

-- 1. VOCABMASTER - High Performance Student
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-1', 'vocab-master', 'free_play', 
    NOW() - INTERVAL '2 hours', NOW() - INTERVAL '1 hour 45 minutes',
    950, 95.0, 100, 20, 19, 18, 900, 2500, 190, 50,
    '{"difficulty": "advanced", "category": "animals", "spaced_repetition_enabled": true}'
);

-- Word performance logs for VocabMaster session
INSERT INTO word_performance_logs (
    session_id, vocabulary_id, word_text, translation_text, language_pair,
    attempt_number, response_time_ms, was_correct, difficulty_level,
    mastery_level, timestamp
) VALUES
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-student-1' AND game_type = 'vocab-master' ORDER BY created_at DESC LIMIT 1),
 1359, 'perro', 'dog', 'es-en', 1, 2200, true, 'intermediate', 2, NOW() - INTERVAL '1 hour 50 minutes'),
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-student-1' AND game_type = 'vocab-master' ORDER BY created_at DESC LIMIT 1),
 1299, 'gato', 'cat', 'es-en', 1, 1800, true, 'beginner', 3, NOW() - INTERVAL '1 hour 49 minutes'),
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-student-1' AND game_type = 'vocab-master' ORDER BY created_at DESC LIMIT 1),
 1059, 'elefante', 'elephant', 'es-en', 1, 3200, true, 'advanced', 2, NOW() - INTERVAL '1 hour 48 minutes');

-- 2. WORD SCRAMBLE - Mixed Performance
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-2', 'word-scramble', 'assignment', 
    NOW() - INTERVAL '3 hours', NOW() - INTERVAL '2 hours 40 minutes',
    720, 72.0, 100, 25, 18, 22, 1200, 4800, 144, 30,
    '{"assignment_id": "test-assignment-1", "difficulty": "medium", "category": "food"}'
);

-- 3. DETECTIVE LISTENING - Low Performance (for weak words testing)
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-beginner', 'detective-listening', 'free_play', 
    NOW() - INTERVAL '4 hours', NOW() - INTERVAL '3 hours 30 minutes',
    420, 42.0, 85, 30, 12, 25, 1800, 8500, 84, 10,
    '{"case_type": "family", "language": "spanish", "evidence_collected": 12}'
);

-- Word performance for weak words identification
INSERT INTO word_performance_logs (
    session_id, vocabulary_id, word_text, translation_text, language_pair,
    attempt_number, response_time_ms, was_correct, difficulty_level,
    mastery_level, timestamp
) VALUES
-- Weak words (low accuracy, multiple attempts)
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-beginner' AND game_type = 'detective-listening' ORDER BY created_at DESC LIMIT 1),
 1479, 'hermano', 'brother', 'es-en', 1, 12000, false, 'intermediate', 1, NOW() - INTERVAL '3 hours 45 minutes'),
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-beginner' AND game_type = 'detective-listening' ORDER BY created_at DESC LIMIT 1),
 1179, 'madre', 'mother', 'es-en', 1, 15000, false, 'intermediate', 1, NOW() - INTERVAL '3 hours 40 minutes'),
-- Strong words (high accuracy, quick responses)
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-beginner' AND game_type = 'detective-listening' ORDER BY created_at DESC LIMIT 1),
 1259, 'padre', 'father', 'es-en', 1, 2500, true, 'beginner', 3, NOW() - INTERVAL '3 hours 35 minutes');

-- 4. VERB QUEST - Advanced Student
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-advanced', 'verb-quest', 'free_play', 
    NOW() - INTERVAL '1 hour', NOW() - INTERVAL '30 minutes',
    1850, 92.5, 100, 40, 37, 35, 1800, 3200, 370, 80,
    '{"character_name": "TestHero", "character_class": "mage", "quests_completed": 5, "battles_won": 8}'
);

-- 5. CONJUGATION DUEL - Competitive Performance
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-3', 'conjugation-duel', 'assignment', 
    NOW() - INTERVAL '5 hours', NOW() - INTERVAL '4 hours 30 minutes',
    1200, 80.0, 100, 30, 24, 28, 1800, 4500, 240, 60,
    '{"assignment_id": "test-assignment-2", "opponent": "AI Champion", "duels_won": 6, "league": "intermediate"}'
);

-- ============================================================================
-- LUCK-BASED GAMES TEST DATA  
-- These games should NOT track individual word accuracy
-- ============================================================================

-- 6. MEMORY MATCH - Basic session data only
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-1', 'memory-match', 'free_play', 
    NOW() - INTERVAL '6 hours', NOW() - INTERVAL '5 hours 45 minutes',
    800, 75.0, 100, 16, 12, 0, 900, 0, 160, 20,
    '{"pairs_matched": 12, "total_pairs": 16, "theme": "animals"}'
);

-- 7. HANGMAN - Basic session data only
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-2', 'hangman', 'assignment', 
    NOW() - INTERVAL '7 hours', NOW() - INTERVAL '6 hours 30 minutes',
    600, 60.0, 100, 10, 6, 0, 1800, 0, 120, 15,
    '{"assignment_id": "test-assignment-3", "words_guessed": 6, "total_words": 10}'
);

-- 8. NOUGHTS AND CROSSES - Basic session data only
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-3', 'noughts-and-crosses', 'free_play', 
    NOW() - INTERVAL '8 hours', NOW() - INTERVAL '7 hours 45 minutes',
    450, 50.0, 100, 9, 4, 0, 900, 0, 90, 10,
    '{"games_played": 9, "games_won": 4, "theme": "pirate"}'
);

-- ============================================================================
-- EDGE CASES AND SPECIAL SCENARIOS
-- ============================================================================

-- Incomplete session (disconnection scenario)
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-student-1', 'word-blast', 'free_play', 
    NOW() - INTERVAL '9 hours', NULL, -- No end time (incomplete)
    0, 0, 25, 5, 2, 4, 300, 6000, 0, 0,
    '{"disconnected": true, "partial_completion": true}'
);

-- Perfect performance session
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-advanced', 'sentence-towers', 'assignment', 
    NOW() - INTERVAL '10 hours', NOW() - INTERVAL '9 hours 30 minutes',
    2000, 100.0, 100, 20, 20, 20, 1800, 1500, 400, 100,
    '{"assignment_id": "test-assignment-4", "perfect_score": true, "speed_bonus": true}'
);

-- Zero performance session (all wrong answers)
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES (
    'test-beginner', 'case-file-translator', 'free_play', 
    NOW() - INTERVAL '11 hours', NOW() - INTERVAL '10 hours 30 minutes',
    0, 0.0, 100, 15, 0, 12, 2400, 12000, 0, 0,
    '{"all_incorrect": true, "needs_review": true}'
);

-- Add corresponding word performance logs for zero performance
INSERT INTO word_performance_logs (
    session_id, vocabulary_id, word_text, translation_text, language_pair,
    attempt_number, response_time_ms, was_correct, difficulty_level,
    mastery_level, timestamp
) VALUES
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-beginner' AND game_type = 'case-file-translator' ORDER BY created_at DESC LIMIT 1),
 1100, 'casa', 'house', 'es-en', 1, 15000, false, 'beginner', 1, NOW() - INTERVAL '10 hours 45 minutes'),
((SELECT id FROM enhanced_game_sessions WHERE student_id = 'test-beginner' AND game_type = 'case-file-translator' ORDER BY created_at DESC LIMIT 1),
 1200, 'coche', 'car', 'es-en', 1, 18000, false, 'beginner', 1, NOW() - INTERVAL '10 hours 40 minutes');

-- Update user vocabulary progress for weak/strong words testing
INSERT INTO user_vocabulary_progress (user_id, vocabulary_id, times_seen, times_correct, is_learned, last_seen) VALUES
-- Weak words (low accuracy)
('test-beginner', 1479, 8, 2, false, NOW() - INTERVAL '3 hours 45 minutes'), -- hermano: 25% accuracy
('test-beginner', 1179, 6, 1, false, NOW() - INTERVAL '3 hours 40 minutes'), -- madre: 16% accuracy
('test-beginner', 1100, 5, 0, false, NOW() - INTERVAL '10 hours 45 minutes'), -- casa: 0% accuracy
-- Strong words (high accuracy)
('test-advanced', 1259, 10, 9, true, NOW() - INTERVAL '3 hours 35 minutes'), -- padre: 90% accuracy
('test-advanced', 1359, 12, 11, true, NOW() - INTERVAL '1 hour 50 minutes'), -- perro: 91% accuracy
('test-student-1', 1299, 8, 7, true, NOW() - INTERVAL '1 hour 49 minutes') -- gato: 87% accuracy
ON CONFLICT (user_id, vocabulary_id) DO UPDATE SET
    times_seen = EXCLUDED.times_seen,
    times_correct = EXCLUDED.times_correct,
    is_learned = EXCLUDED.is_learned,
    last_seen = EXCLUDED.last_seen;

-- Add more game types to reach all 15 games
INSERT INTO enhanced_game_sessions (
    student_id, game_type, session_mode, started_at, ended_at,
    final_score, accuracy_percentage, completion_percentage,
    words_attempted, words_correct, unique_words_practiced,
    duration_seconds, average_response_time_ms, xp_earned, bonus_xp,
    session_data
) VALUES 
-- Speed Builder
('test-student-2', 'speed-builder', 'free_play', NOW() - INTERVAL '12 hours', NOW() - INTERVAL '11 hours 30 minutes',
 1400, 87.5, 100, 32, 28, 30, 1800, 3500, 280, 70, '{"sentences_completed": 28, "speed_bonus": true}'),
-- Lava Temple Word Restore  
('test-student-3', 'lava-temple-word-restore', 'assignment', NOW() - INTERVAL '13 hours', NOW() - INTERVAL '12 hours 15 minutes',
 1100, 78.6, 100, 28, 22, 25, 2700, 5200, 220, 55, '{"assignment_id": "test-assignment-5", "tablets_restored": 22}'),
-- Vocab Blast
('test-advanced', 'vocab-blast', 'free_play', NOW() - INTERVAL '14 hours', NOW() - INTERVAL '13 hours 20 minutes',
 1750, 94.3, 100, 35, 33, 32, 2400, 2800, 350, 85, '{"explosive_matches": 33, "chain_reactions": 8}');

COMMIT;

-- Verification queries to confirm test data was inserted correctly
SELECT 'Test data summary:' as info;
SELECT game_type, COUNT(*) as session_count, 
       AVG(accuracy_percentage) as avg_accuracy,
       COUNT(CASE WHEN session_mode = 'assignment' THEN 1 END) as assignment_sessions,
       COUNT(CASE WHEN session_mode = 'free_play' THEN 1 END) as free_play_sessions
FROM enhanced_game_sessions 
WHERE student_id LIKE 'test-%' 
GROUP BY game_type 
ORDER BY session_count DESC;

SELECT 'Word performance logs:' as info;
SELECT COUNT(*) as total_logs,
       COUNT(CASE WHEN was_correct THEN 1 END) as correct_responses,
       COUNT(CASE WHEN NOT was_correct THEN 1 END) as incorrect_responses,
       AVG(response_time_ms) as avg_response_time
FROM word_performance_logs wpl
JOIN enhanced_game_sessions egs ON wpl.session_id = egs.id
WHERE egs.student_id LIKE 'test-%';
