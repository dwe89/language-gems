-- Migration: Add Vocabulary Mining System Tables
-- Date: 2025-06-18
-- Description: Creates all necessary tables for the vocabulary mining gamification system

-- ============================================================================
-- 1. VOCABULARY ITEMS TABLE (Enhanced)
-- ============================================================================

-- Update existing vocabulary_items table to support mining system
ALTER TABLE vocabulary_items 
ADD COLUMN IF NOT EXISTS gem_type TEXT DEFAULT 'common' CHECK (gem_type IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
ADD COLUMN IF NOT EXISTS gem_color TEXT DEFAULT '#60a5fa',
ADD COLUMN IF NOT EXISTS frequency_score INTEGER DEFAULT 50,
ADD COLUMN IF NOT EXISTS curriculum_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS topic_tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS theme_tags TEXT[] DEFAULT '{}';

-- ============================================================================
-- 2. VOCABULARY GEM COLLECTION TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_gem_collection (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    vocabulary_item_id INTEGER NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
    gem_level INTEGER NOT NULL DEFAULT 1 CHECK (gem_level >= 1 AND gem_level <= 10),
    mastery_level INTEGER NOT NULL DEFAULT 0 CHECK (mastery_level >= 0 AND mastery_level <= 5),
    total_encounters INTEGER NOT NULL DEFAULT 0,
    correct_encounters INTEGER NOT NULL DEFAULT 0,
    incorrect_encounters INTEGER NOT NULL DEFAULT 0,
    current_streak INTEGER NOT NULL DEFAULT 0,
    best_streak INTEGER NOT NULL DEFAULT 0,
    last_encountered_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE,
    spaced_repetition_interval INTEGER NOT NULL DEFAULT 1,
    spaced_repetition_ease_factor DECIMAL(3,2) NOT NULL DEFAULT 2.50,
    difficulty_rating INTEGER NOT NULL DEFAULT 3 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    first_learned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    last_mastered_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, vocabulary_item_id)
);

-- ============================================================================
-- 3. VOCABULARY MINING SESSIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_mining_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'review', 'challenge', 'assignment')),
    vocabulary_list_id UUID REFERENCES vocabulary_assignment_lists(id),
    assignment_id INTEGER REFERENCES assignments(id),
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_words_attempted INTEGER NOT NULL DEFAULT 0,
    total_words_correct INTEGER NOT NULL DEFAULT 0,
    gems_collected INTEGER NOT NULL DEFAULT 0,
    gems_upgraded INTEGER NOT NULL DEFAULT 0,
    session_score INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage INTEGER NOT NULL DEFAULT 0,
    time_spent_seconds INTEGER NOT NULL DEFAULT 0,
    session_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. VOCABULARY DAILY GOALS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    goal_date DATE NOT NULL,
    target_words INTEGER NOT NULL DEFAULT 10,
    target_minutes INTEGER NOT NULL DEFAULT 15,
    words_practiced INTEGER NOT NULL DEFAULT 0,
    minutes_practiced INTEGER NOT NULL DEFAULT 0,
    gems_collected INTEGER NOT NULL DEFAULT 0,
    goal_completed BOOLEAN NOT NULL DEFAULT FALSE,
    streak_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, goal_date)
);

-- ============================================================================
-- 5. VOCABULARY TOPIC PERFORMANCE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_topic_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_name TEXT NOT NULL,
    theme_name TEXT NOT NULL,
    total_words INTEGER NOT NULL DEFAULT 0,
    mastered_words INTEGER NOT NULL DEFAULT 0,
    weak_words INTEGER NOT NULL DEFAULT 0,
    average_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    total_practice_time INTEGER NOT NULL DEFAULT 0,
    last_practiced_at TIMESTAMP WITH TIME ZONE,
    mastery_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, topic_name, theme_name)
);

-- ============================================================================
-- 6. VOCABULARY ACHIEVEMENTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_type TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    achievement_icon TEXT,
    achievement_color TEXT NOT NULL DEFAULT '#fbbf24',
    points_awarded INTEGER NOT NULL DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 7. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Gem collection indexes
CREATE INDEX IF NOT EXISTS idx_vocab_gem_collection_student_id ON vocabulary_gem_collection(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_gem_collection_review_at ON vocabulary_gem_collection(next_review_at) WHERE next_review_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_vocab_gem_collection_mastery ON vocabulary_gem_collection(mastery_level);

-- Mining sessions indexes
CREATE INDEX IF NOT EXISTS idx_vocab_mining_sessions_student_id ON vocabulary_mining_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_mining_sessions_type ON vocabulary_mining_sessions(session_type);
CREATE INDEX IF NOT EXISTS idx_vocab_mining_sessions_started_at ON vocabulary_mining_sessions(started_at);

-- Daily goals indexes
CREATE INDEX IF NOT EXISTS idx_vocab_daily_goals_student_date ON vocabulary_daily_goals(student_id, goal_date);

-- Topic performance indexes
CREATE INDEX IF NOT EXISTS idx_vocab_topic_performance_student_id ON vocabulary_topic_performance(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_topic_performance_topic ON vocabulary_topic_performance(topic_name);

-- Achievements indexes
CREATE INDEX IF NOT EXISTS idx_vocab_achievements_student_id ON vocabulary_achievements(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_achievements_type ON vocabulary_achievements(achievement_type);
CREATE INDEX IF NOT EXISTS idx_vocab_achievements_earned_at ON vocabulary_achievements(earned_at);

-- ============================================================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE vocabulary_gem_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_mining_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_topic_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_achievements ENABLE ROW LEVEL SECURITY;

-- Gem collection policies
CREATE POLICY "Students can view their own gem collection" ON vocabulary_gem_collection
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own gem collection" ON vocabulary_gem_collection
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own gem collection" ON vocabulary_gem_collection
    FOR UPDATE USING (auth.uid() = student_id);

-- Mining sessions policies
CREATE POLICY "Students can view their own mining sessions" ON vocabulary_mining_sessions
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own mining sessions" ON vocabulary_mining_sessions
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own mining sessions" ON vocabulary_mining_sessions
    FOR UPDATE USING (auth.uid() = student_id);

-- Daily goals policies
CREATE POLICY "Students can view their own daily goals" ON vocabulary_daily_goals
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own daily goals" ON vocabulary_daily_goals
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own daily goals" ON vocabulary_daily_goals
    FOR UPDATE USING (auth.uid() = student_id);

-- Topic performance policies
CREATE POLICY "Students can view their own topic performance" ON vocabulary_topic_performance
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own topic performance" ON vocabulary_topic_performance
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own topic performance" ON vocabulary_topic_performance
    FOR UPDATE USING (auth.uid() = student_id);

-- Achievements policies
CREATE POLICY "Students can view their own achievements" ON vocabulary_achievements
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own achievements" ON vocabulary_achievements
    FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ============================================================================
-- 9. CREATE DATABASE FUNCTIONS
-- ============================================================================

-- Function to update gem collection with spaced repetition logic
CREATE OR REPLACE FUNCTION update_gem_collection(
    p_student_id UUID,
    p_vocabulary_item_id INTEGER,
    p_was_correct BOOLEAN,
    p_response_time INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
AS $$
DECLARE
    v_collection vocabulary_gem_collection%ROWTYPE;
    v_new_interval INTEGER;
    v_new_ease_factor DECIMAL(3,2);
    v_new_mastery_level INTEGER;
    v_new_gem_level INTEGER;
BEGIN
    -- Get existing collection record or create new one
    SELECT * INTO v_collection 
    FROM vocabulary_gem_collection 
    WHERE student_id = p_student_id AND vocabulary_item_id = p_vocabulary_item_id;
    
    IF NOT FOUND THEN
        -- Create new gem collection entry
        INSERT INTO vocabulary_gem_collection (
            student_id, vocabulary_item_id, gem_level, mastery_level,
            total_encounters, correct_encounters, incorrect_encounters,
            current_streak, best_streak, first_learned_at, last_encountered_at
        ) VALUES (
            p_student_id, p_vocabulary_item_id, 1, 0,
            1, CASE WHEN p_was_correct THEN 1 ELSE 0 END, CASE WHEN p_was_correct THEN 0 ELSE 1 END,
            CASE WHEN p_was_correct THEN 1 ELSE 0 END, CASE WHEN p_was_correct THEN 1 ELSE 0 END,
            NOW(), NOW()
        );
        RETURN;
    END IF;
    
    -- Update encounter counts
    v_collection.total_encounters := v_collection.total_encounters + 1;
    
    IF p_was_correct THEN
        v_collection.correct_encounters := v_collection.correct_encounters + 1;
        v_collection.current_streak := v_collection.current_streak + 1;
        v_collection.best_streak := GREATEST(v_collection.best_streak, v_collection.current_streak);
    ELSE
        v_collection.incorrect_encounters := v_collection.incorrect_encounters + 1;
        v_collection.current_streak := 0;
    END IF;
    
    -- Calculate new mastery level (0-5 based on success rate and encounters)
    v_new_mastery_level := LEAST(5, FLOOR(
        (v_collection.correct_encounters::DECIMAL / v_collection.total_encounters) * 5 + 
        LEAST(1, v_collection.total_encounters / 10.0)
    ));
    
    -- Calculate new gem level (1-10 based on mastery and encounters)
    v_new_gem_level := LEAST(10, GREATEST(1, 
        v_new_mastery_level * 2 + FLOOR(v_collection.total_encounters / 5.0)
    ));
    
    -- Calculate spaced repetition interval
    IF p_was_correct THEN
        v_new_ease_factor := LEAST(3.0, v_collection.spaced_repetition_ease_factor + 0.1);
        v_new_interval := CEIL(v_collection.spaced_repetition_interval * v_new_ease_factor);
    ELSE
        v_new_ease_factor := GREATEST(1.3, v_collection.spaced_repetition_ease_factor - 0.2);
        v_new_interval := 1; -- Reset interval on incorrect answer
    END IF;
    
    -- Cap maximum interval at 365 days
    v_new_interval := LEAST(365, v_new_interval);
    
    -- Update the record
    UPDATE vocabulary_gem_collection SET
        gem_level = v_new_gem_level,
        mastery_level = v_new_mastery_level,
        total_encounters = v_collection.total_encounters,
        correct_encounters = v_collection.correct_encounters,
        incorrect_encounters = v_collection.incorrect_encounters,
        current_streak = v_collection.current_streak,
        best_streak = v_collection.best_streak,
        last_encountered_at = NOW(),
        next_review_at = NOW() + (v_new_interval || ' days')::INTERVAL,
        spaced_repetition_interval = v_new_interval,
        spaced_repetition_ease_factor = v_new_ease_factor,
        last_mastered_at = CASE WHEN v_new_mastery_level >= 4 AND v_collection.mastery_level < 4 THEN NOW() ELSE last_mastered_at END,
        updated_at = NOW()
    WHERE student_id = p_student_id AND vocabulary_item_id = p_vocabulary_item_id;
END;
$$;

-- Function to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vocabulary_gem_collection_updated_at BEFORE UPDATE ON vocabulary_gem_collection FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vocabulary_mining_sessions_updated_at BEFORE UPDATE ON vocabulary_mining_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vocabulary_daily_goals_updated_at BEFORE UPDATE ON vocabulary_daily_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vocabulary_topic_performance_updated_at BEFORE UPDATE ON vocabulary_topic_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. SEED DATA FOR TESTING
-- ============================================================================

-- Update existing vocabulary items with gem properties
UPDATE vocabulary_items
SET
    gem_type = CASE
        WHEN frequency_score IS NULL OR frequency_score > 80 THEN 'common'
        WHEN frequency_score > 60 THEN 'uncommon'
        WHEN frequency_score > 40 THEN 'rare'
        WHEN frequency_score > 20 THEN 'epic'
        ELSE 'legendary'
    END,
    gem_color = CASE
        WHEN frequency_score IS NULL OR frequency_score > 80 THEN '#60a5fa'
        WHEN frequency_score > 60 THEN '#34d399'
        WHEN frequency_score > 40 THEN '#a78bfa'
        WHEN frequency_score > 20 THEN '#fb7185'
        ELSE '#fbbf24'
    END,
    frequency_score = COALESCE(frequency_score, 50),
    topic_tags = CASE WHEN topic IS NOT NULL THEN ARRAY[topic] ELSE '{}' END,
    theme_tags = CASE WHEN theme IS NOT NULL THEN ARRAY[theme] ELSE '{}' END
WHERE gem_type IS NULL;

-- ============================================================================
-- SENTENCE TRANSLATION SYSTEM FOR GEM COLLECTOR GAME
-- ============================================================================

-- Sentence translations table for storing complete sentences with translations
CREATE TABLE IF NOT EXISTS sentence_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_sentence TEXT NOT NULL,
    target_language TEXT NOT NULL DEFAULT 'spanish',
    target_sentence TEXT NOT NULL,
    difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    theme TEXT,
    topic TEXT,
    grammar_focus TEXT,
    curriculum_tier TEXT DEFAULT 'Foundation' CHECK (curriculum_tier IN ('Foundation', 'Higher')),
    word_count INTEGER NOT NULL DEFAULT 0,
    complexity_score INTEGER DEFAULT 50 CHECK (complexity_score >= 1 AND complexity_score <= 100),
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sentence segments table for word-by-word translation building
CREATE TABLE IF NOT EXISTS sentence_segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sentence_translation_id UUID NOT NULL REFERENCES sentence_translations(id) ON DELETE CASCADE,
    segment_order INTEGER NOT NULL,
    english_segment TEXT NOT NULL,
    target_segment TEXT NOT NULL,
    segment_type TEXT DEFAULT 'word' CHECK (segment_type IN ('word', 'phrase', 'article', 'conjunction')),
    grammar_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sentence segment options table for multiple choice distractors
CREATE TABLE IF NOT EXISTS sentence_segment_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sentence_segment_id UUID NOT NULL REFERENCES sentence_segments(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT false,
    distractor_type TEXT DEFAULT 'semantic' CHECK (distractor_type IN ('semantic', 'grammatical', 'phonetic', 'random')),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Game sessions for gem collector with detailed tracking
CREATE TABLE IF NOT EXISTS gem_collector_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL DEFAULT 'free_play' CHECK (session_type IN ('free_play', 'assignment')),
    language_pair TEXT NOT NULL DEFAULT 'english_spanish',
    difficulty_level TEXT NOT NULL DEFAULT 'beginner',
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    total_sentences INTEGER NOT NULL DEFAULT 0,
    completed_sentences INTEGER NOT NULL DEFAULT 0,
    total_segments INTEGER NOT NULL DEFAULT 0,
    correct_segments INTEGER NOT NULL DEFAULT 0,
    incorrect_segments INTEGER NOT NULL DEFAULT 0,
    final_score INTEGER NOT NULL DEFAULT 0,
    gems_collected INTEGER NOT NULL DEFAULT 0,
    lives_used INTEGER NOT NULL DEFAULT 0,
    speed_boosts_used INTEGER NOT NULL DEFAULT 0,
    average_response_time DECIMAL(10,2) DEFAULT 0,
    session_data JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detailed segment attempts for analytics
CREATE TABLE IF NOT EXISTS gem_collector_segment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES gem_collector_sessions(id) ON DELETE CASCADE,
    sentence_segment_id UUID NOT NULL REFERENCES sentence_segments(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES sentence_segment_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL,
    response_time_ms INTEGER NOT NULL DEFAULT 0,
    attempt_order INTEGER NOT NULL,
    gems_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sentence_translations_difficulty ON sentence_translations(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_sentence_translations_theme ON sentence_translations(theme);
CREATE INDEX IF NOT EXISTS idx_sentence_translations_topic ON sentence_translations(topic);
CREATE INDEX IF NOT EXISTS idx_sentence_translations_public ON sentence_translations(is_public);
CREATE INDEX IF NOT EXISTS idx_sentence_segments_sentence ON sentence_segments(sentence_translation_id);
CREATE INDEX IF NOT EXISTS idx_sentence_segments_order ON sentence_segments(sentence_translation_id, segment_order);
CREATE INDEX IF NOT EXISTS idx_segment_options_segment ON sentence_segment_options(sentence_segment_id);
CREATE INDEX IF NOT EXISTS idx_gem_sessions_student ON gem_collector_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_gem_sessions_assignment ON gem_collector_sessions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_gem_attempts_session ON gem_collector_segment_attempts(session_id);

-- ============================================================================
-- SAMPLE SENTENCE DATA FOR GEM COLLECTOR GAME
-- ============================================================================

-- Insert sample sentence translations
INSERT INTO sentence_translations (english_sentence, target_language, target_sentence, difficulty_level, theme, topic, grammar_focus, word_count, complexity_score) VALUES
('I like to go to the cinema', 'spanish', 'Me gusta ir al cine', 'beginner', 'Leisure and entertainment', 'Free time activities', 'gustar-verb', 6, 30),
('My family lives in Madrid', 'spanish', 'Mi familia vive en Madrid', 'beginner', 'People and lifestyle', 'Identity and relationships', 'present-tense', 5, 25),
('She studies Spanish every day', 'spanish', 'Ella estudia español todos los días', 'beginner', 'Education and work', 'School life', 'present-tense', 6, 35),
('We are going to the park tomorrow', 'spanish', 'Vamos al parque mañana', 'intermediate', 'Communication and the world around us', 'Environment and where people live', 'near-future', 6, 45),
('The weather is very beautiful today', 'spanish', 'El tiempo está muy hermoso hoy', 'intermediate', 'Communication and the world around us', 'Weather and climate', 'ser-estar', 6, 40);

-- Function to create sentence segments and options
DO $$
DECLARE
    sentence_id UUID;
    segment_id UUID;
BEGIN
    -- Sentence 1: "I like to go to the cinema" -> "Me gusta ir al cine"
    SELECT id INTO sentence_id FROM sentence_translations WHERE english_sentence = 'I like to go to the cinema';

    -- Segment 1: "Me gusta"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 1, 'I like', 'Me gusta', 'phrase', 'Gustar construction with indirect object pronoun')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'Me gusta', true, 'correct', 'Correct: "Me gusta" means "I like"'),
    (segment_id, 'Me encanta', false, 'semantic', 'Incorrect: "Me encanta" means "I love" (stronger than like)'),
    (segment_id, 'Odio', false, 'semantic', 'Incorrect: "Odio" means "I hate" (opposite meaning)');

    -- Segment 2: "ir"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 2, 'to go', 'ir', 'word', 'Infinitive verb "to go"')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'ir', true, 'correct', 'Correct: "ir" means "to go"'),
    (segment_id, 'venir', false, 'semantic', 'Incorrect: "venir" means "to come"'),
    (segment_id, 'estar', false, 'grammatical', 'Incorrect: "estar" means "to be" (location/temporary state)');

    -- Segment 3: "al cine"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 3, 'to the cinema', 'al cine', 'phrase', 'Contraction "al" = "a" + "el"')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'al cine', true, 'correct', 'Correct: "al cine" means "to the cinema"'),
    (segment_id, 'del cine', false, 'grammatical', 'Incorrect: "del cine" means "from the cinema"'),
    (segment_id, 'en cine', false, 'grammatical', 'Incorrect: Missing article and wrong preposition');

    -- Sentence 2: "My family lives in Madrid" -> "Mi familia vive en Madrid"
    SELECT id INTO sentence_id FROM sentence_translations WHERE english_sentence = 'My family lives in Madrid';

    -- Segment 1: "Mi familia"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 1, 'My family', 'Mi familia', 'phrase', 'Possessive adjective + noun')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'Mi familia', true, 'correct', 'Correct: "Mi familia" means "my family"'),
    (segment_id, 'Tu familia', false, 'grammatical', 'Incorrect: "Tu familia" means "your family"'),
    (segment_id, 'Su familia', false, 'grammatical', 'Incorrect: "Su familia" means "his/her family"');

    -- Segment 2: "vive"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 2, 'lives', 'vive', 'word', 'Third person singular present tense')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'vive', true, 'correct', 'Correct: "vive" means "lives" (3rd person singular)'),
    (segment_id, 'vivo', false, 'grammatical', 'Incorrect: "vivo" is first person singular "I live"'),
    (segment_id, 'viven', false, 'grammatical', 'Incorrect: "viven" is third person plural "they live"');

    -- Segment 3: "en Madrid"
    INSERT INTO sentence_segments (sentence_translation_id, segment_order, english_segment, target_segment, segment_type, grammar_note)
    VALUES (sentence_id, 3, 'in Madrid', 'en Madrid', 'phrase', 'Preposition + proper noun')
    RETURNING id INTO segment_id;

    INSERT INTO sentence_segment_options (sentence_segment_id, option_text, is_correct, distractor_type, explanation) VALUES
    (segment_id, 'en Madrid', true, 'correct', 'Correct: "en Madrid" means "in Madrid"'),
    (segment_id, 'de Madrid', false, 'grammatical', 'Incorrect: "de Madrid" means "from Madrid"'),
    (segment_id, 'a Madrid', false, 'grammatical', 'Incorrect: "a Madrid" means "to Madrid"');

END $$;

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
