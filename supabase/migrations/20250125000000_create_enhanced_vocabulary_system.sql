-- ============================================================================
-- ENHANCED VOCABULARY MANAGEMENT SYSTEM
-- ============================================================================
-- This migration creates an enhanced vocabulary system that supports both
-- individual words and full sentences, with game compatibility features.

-- ============================================================================
-- 1. ENHANCED VOCABULARY LISTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS enhanced_vocabulary_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    language TEXT NOT NULL CHECK (language IN ('spanish', 'french', 'german', 'italian')),
    theme TEXT,
    topic TEXT,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    content_type TEXT NOT NULL CHECK (content_type IN ('words', 'sentences', 'mixed')),
    is_public BOOLEAN NOT NULL DEFAULT false,
    word_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_teacher_id ON enhanced_vocabulary_lists(teacher_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_language ON enhanced_vocabulary_lists(language);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_content_type ON enhanced_vocabulary_lists(content_type);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_difficulty ON enhanced_vocabulary_lists(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_public ON enhanced_vocabulary_lists(is_public);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_created_at ON enhanced_vocabulary_lists(created_at);

-- ============================================================================
-- 2. ENHANCED VOCABULARY ITEMS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS enhanced_vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES enhanced_vocabulary_lists(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('word', 'sentence', 'phrase')),
    term TEXT NOT NULL,
    translation TEXT NOT NULL,
    part_of_speech TEXT,
    context_sentence TEXT,
    context_translation TEXT,
    audio_url TEXT,
    image_url TEXT,
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    notes TEXT,
    tags TEXT[], -- Array of tags for categorization
    order_position INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_items_list_id ON enhanced_vocabulary_items(list_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_items_type ON enhanced_vocabulary_items(type);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_items_difficulty ON enhanced_vocabulary_items(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_items_order ON enhanced_vocabulary_items(order_position);

-- ============================================================================
-- 3. GAME COMPATIBILITY TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_game_compatibility (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT NOT NULL UNIQUE,
    supports_words BOOLEAN NOT NULL DEFAULT true,
    supports_sentences BOOLEAN NOT NULL DEFAULT false,
    supports_mixed BOOLEAN NOT NULL DEFAULT true,
    preferred_content_type TEXT NOT NULL CHECK (preferred_content_type IN ('words', 'sentences', 'mixed')),
    min_items INTEGER,
    max_items INTEGER,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Insert game compatibility data
INSERT INTO vocabulary_game_compatibility (
    game_type, supports_words, supports_sentences, supports_mixed, 
    preferred_content_type, min_items, max_items, description
) VALUES 
    ('noughts-and-crosses', true, false, true, 'words', 9, 50, 'Vocabulary Tic-Tac-Toe game'),
    ('memory-game', true, false, true, 'words', 8, 20, 'Memory matching game'),
    ('hangman', true, false, true, 'words', 10, 100, 'Word guessing game'),
    ('word-scramble', true, false, true, 'words', 10, 50, 'Letter unscrambling game'),
    ('word-guesser', true, false, true, 'words', 10, 100, 'Word guessing with clues'),
    ('vocab-blast', true, false, true, 'words', 20, 100, 'Fast-paced vocabulary game'),
    ('speed-builder', true, true, true, 'sentences', 10, 50, 'Sentence building game'),
    ('sentence-towers', true, true, true, 'words', 20, 100, 'Tower building with vocabulary'),
    ('detective-listening', true, false, true, 'words', 10, 30, 'Audio-based vocabulary game'),
    ('vocabulary-mining', true, false, true, 'words', 20, 200, 'Mine vocabulary gems through spaced repetition')
ON CONFLICT (game_type) DO UPDATE SET
    supports_words = EXCLUDED.supports_words,
    supports_sentences = EXCLUDED.supports_sentences,
    supports_mixed = EXCLUDED.supports_mixed,
    preferred_content_type = EXCLUDED.preferred_content_type,
    min_items = EXCLUDED.min_items,
    max_items = EXCLUDED.max_items,
    description = EXCLUDED.description,
    updated_at = NOW();

-- ============================================================================
-- 4. VOCABULARY USAGE TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_list_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    list_id UUID NOT NULL REFERENCES enhanced_vocabulary_lists(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    session_id UUID REFERENCES enhanced_game_sessions(id) ON DELETE SET NULL,
    items_practiced INTEGER NOT NULL DEFAULT 0,
    items_correct INTEGER NOT NULL DEFAULT 0,
    accuracy_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    duration_seconds INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for usage tracking
CREATE INDEX IF NOT EXISTS idx_vocab_usage_list_id ON vocabulary_list_usage(list_id);
CREATE INDEX IF NOT EXISTS idx_vocab_usage_game_type ON vocabulary_list_usage(game_type);
CREATE INDEX IF NOT EXISTS idx_vocab_usage_student_id ON vocabulary_list_usage(student_id);
CREATE INDEX IF NOT EXISTS idx_vocab_usage_assignment_id ON vocabulary_list_usage(assignment_id);
CREATE INDEX IF NOT EXISTS idx_vocab_usage_created_at ON vocabulary_list_usage(created_at);

-- ============================================================================
-- 5. VOCABULARY TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS vocabulary_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    language TEXT NOT NULL CHECK (language IN ('spanish', 'french', 'german', 'italian')),
    content_type TEXT NOT NULL CHECK (content_type IN ('words', 'sentences', 'mixed')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    theme TEXT,
    topic TEXT,
    template_data JSONB NOT NULL, -- Stores the template structure
    is_public BOOLEAN NOT NULL DEFAULT true,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    usage_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for templates
CREATE INDEX IF NOT EXISTS idx_vocab_templates_language ON vocabulary_templates(language);
CREATE INDEX IF NOT EXISTS idx_vocab_templates_content_type ON vocabulary_templates(content_type);
CREATE INDEX IF NOT EXISTS idx_vocab_templates_difficulty ON vocabulary_templates(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_vocab_templates_public ON vocabulary_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_vocab_templates_usage ON vocabulary_templates(usage_count);

-- ============================================================================
-- 6. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update word count when items are added/removed
CREATE OR REPLACE FUNCTION update_vocabulary_list_word_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE enhanced_vocabulary_lists 
        SET word_count = word_count + 1, updated_at = NOW()
        WHERE id = NEW.list_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE enhanced_vocabulary_lists 
        SET word_count = word_count - 1, updated_at = NOW()
        WHERE id = OLD.list_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for word count updates
DROP TRIGGER IF EXISTS trigger_update_word_count_insert ON enhanced_vocabulary_items;
CREATE TRIGGER trigger_update_word_count_insert
    AFTER INSERT ON enhanced_vocabulary_items
    FOR EACH ROW EXECUTE FUNCTION update_vocabulary_list_word_count();

DROP TRIGGER IF EXISTS trigger_update_word_count_delete ON enhanced_vocabulary_items;
CREATE TRIGGER trigger_update_word_count_delete
    AFTER DELETE ON enhanced_vocabulary_items
    FOR EACH ROW EXECUTE FUNCTION update_vocabulary_list_word_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS trigger_enhanced_vocab_lists_updated_at ON enhanced_vocabulary_lists;
CREATE TRIGGER trigger_enhanced_vocab_lists_updated_at
    BEFORE UPDATE ON enhanced_vocabulary_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_enhanced_vocab_items_updated_at ON enhanced_vocabulary_items;
CREATE TRIGGER trigger_enhanced_vocab_items_updated_at
    BEFORE UPDATE ON enhanced_vocabulary_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE enhanced_vocabulary_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_list_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_templates ENABLE ROW LEVEL SECURITY;

-- Policies for enhanced_vocabulary_lists
CREATE POLICY "Teachers can view their own lists and public lists" ON enhanced_vocabulary_lists
    FOR SELECT USING (teacher_id = auth.uid() OR is_public = true);

CREATE POLICY "Teachers can create their own lists" ON enhanced_vocabulary_lists
    FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own lists" ON enhanced_vocabulary_lists
    FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own lists" ON enhanced_vocabulary_lists
    FOR DELETE USING (teacher_id = auth.uid());

-- Policies for enhanced_vocabulary_items
CREATE POLICY "Users can view items from accessible lists" ON enhanced_vocabulary_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enhanced_vocabulary_lists 
            WHERE id = list_id AND (teacher_id = auth.uid() OR is_public = true)
        )
    );

CREATE POLICY "Teachers can manage items in their own lists" ON enhanced_vocabulary_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM enhanced_vocabulary_lists 
            WHERE id = list_id AND teacher_id = auth.uid()
        )
    );

-- Policies for vocabulary_list_usage
CREATE POLICY "Users can view their own usage data" ON vocabulary_list_usage
    FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Teachers can view usage data for their lists" ON vocabulary_list_usage
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM enhanced_vocabulary_lists 
            WHERE id = list_id AND teacher_id = auth.uid()
        )
    );

CREATE POLICY "System can insert usage data" ON vocabulary_list_usage
    FOR INSERT WITH CHECK (true);

-- Policies for vocabulary_templates
CREATE POLICY "Users can view public templates and their own" ON vocabulary_templates
    FOR SELECT USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create templates" ON vocabulary_templates
    FOR INSERT WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" ON vocabulary_templates
    FOR UPDATE USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" ON vocabulary_templates
    FOR DELETE USING (created_by = auth.uid());

-- ============================================================================
-- 8. SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert some sample vocabulary templates
INSERT INTO vocabulary_templates (
    name, description, language, content_type, difficulty_level, 
    theme, topic, template_data, is_public
) VALUES 
    (
        'Basic Spanish Greetings',
        'Common greeting words and phrases in Spanish',
        'spanish',
        'words',
        'beginner',
        'Communication',
        'Greetings',
        '{"items": [
            {"term": "hola", "translation": "hello", "type": "word", "part_of_speech": "interjection"},
            {"term": "adiós", "translation": "goodbye", "type": "word", "part_of_speech": "interjection"},
            {"term": "buenos días", "translation": "good morning", "type": "phrase", "part_of_speech": "phrase"},
            {"term": "buenas tardes", "translation": "good afternoon", "type": "phrase", "part_of_speech": "phrase"},
            {"term": "buenas noches", "translation": "good evening", "type": "phrase", "part_of_speech": "phrase"}
        ]}',
        true
    ),
    (
        'French Family Members',
        'Basic family vocabulary in French',
        'french',
        'words',
        'beginner',
        'Family and relationships',
        'Family members',
        '{"items": [
            {"term": "père", "translation": "father", "type": "word", "part_of_speech": "noun"},
            {"term": "mère", "translation": "mother", "type": "word", "part_of_speech": "noun"},
            {"term": "frère", "translation": "brother", "type": "word", "part_of_speech": "noun"},
            {"term": "sœur", "translation": "sister", "type": "word", "part_of_speech": "noun"},
            {"term": "grand-père", "translation": "grandfather", "type": "word", "part_of_speech": "noun"}
        ]}',
        true
    ),
    (
        'Spanish Introduction Sentences',
        'Complete sentences for introducing yourself in Spanish',
        'spanish',
        'sentences',
        'intermediate',
        'Communication',
        'Introductions',
        '{"items": [
            {"term": "Me llamo María y tengo veinte años", "translation": "My name is María and I am twenty years old", "type": "sentence"},
            {"term": "Soy de España pero vivo en Francia", "translation": "I am from Spain but I live in France", "type": "sentence"},
            {"term": "Estudio medicina en la universidad", "translation": "I study medicine at university", "type": "sentence"},
            {"term": "Mi familia es muy importante para mí", "translation": "My family is very important to me", "type": "sentence"}
        ]}',
        true
    )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

-- Add comment to track migration
COMMENT ON TABLE enhanced_vocabulary_lists IS 'Enhanced vocabulary management system supporting words, sentences, and mixed content with game compatibility features. Created: 2025-01-25';
COMMENT ON TABLE enhanced_vocabulary_items IS 'Individual vocabulary items with support for words, sentences, and phrases. Created: 2025-01-25';
COMMENT ON TABLE vocabulary_game_compatibility IS 'Game compatibility matrix for vocabulary content types. Created: 2025-01-25';
COMMENT ON TABLE vocabulary_list_usage IS 'Tracking table for vocabulary list usage across games. Created: 2025-01-25';
COMMENT ON TABLE vocabulary_templates IS 'Reusable vocabulary templates for quick list creation. Created: 2025-01-25';
