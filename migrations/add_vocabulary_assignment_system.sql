-- Migration: Enhanced Vocabulary Assignment System
-- This migration connects the vocabulary table to the assignment system

-- 1. Create vocabulary_assignment_lists table
-- This will allow teachers to create custom vocabulary lists from the vocabulary table
CREATE TABLE IF NOT EXISTS vocabulary_assignment_lists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT, -- From vocabulary.theme
    topic TEXT, -- From vocabulary.topic
    difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    vocabulary_items INTEGER[] DEFAULT '{}', -- Array of vocabulary.id
    word_count INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create vocabulary_assignment_items table
-- This maps vocabulary items to assignment lists
CREATE TABLE IF NOT EXISTS vocabulary_assignment_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    assignment_list_id UUID REFERENCES vocabulary_assignment_lists(id) ON DELETE CASCADE,
    vocabulary_id INTEGER REFERENCES vocabulary(id) ON DELETE CASCADE,
    order_position INTEGER DEFAULT 0,
    is_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Enhance assignments table for vocabulary integration
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS vocabulary_assignment_list_id UUID REFERENCES vocabulary_assignment_lists(id),
ADD COLUMN IF NOT EXISTS vocabulary_selection_type TEXT CHECK (vocabulary_selection_type IN ('topic_based', 'theme_based', 'custom_list', 'difficulty_based')) DEFAULT 'custom_list',
ADD COLUMN IF NOT EXISTS vocabulary_criteria JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS vocabulary_count INTEGER DEFAULT 10;

-- 4. Create student_vocabulary_assignment_progress table
-- This tracks individual student progress on vocabulary assignments
CREATE TABLE IF NOT EXISTS student_vocabulary_assignment_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    vocabulary_id INTEGER REFERENCES vocabulary(id) ON DELETE CASCADE,
    attempts INTEGER DEFAULT 0,
    correct_attempts INTEGER DEFAULT 0,
    last_attempted_at TIMESTAMP WITH TIME ZONE,
    mastery_level INTEGER DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
    time_spent_seconds INTEGER DEFAULT 0,
    difficulty_rating TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(student_id, assignment_id, vocabulary_id)
);

-- 5. Create assignment_game_sessions table
-- Track game sessions for assignments
CREATE TABLE IF NOT EXISTS assignment_game_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL,
    session_data JSONB DEFAULT '{}',
    score INTEGER DEFAULT 0,
    accuracy DECIMAL(5,2) DEFAULT 0,
    time_spent_seconds INTEGER DEFAULT 0,
    vocabulary_practiced INTEGER[] DEFAULT '{}', -- Array of vocabulary.id
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_assignment_lists_teacher ON vocabulary_assignment_lists(teacher_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_assignment_lists_theme ON vocabulary_assignment_lists(theme);
CREATE INDEX IF NOT EXISTS idx_vocabulary_assignment_lists_topic ON vocabulary_assignment_lists(topic);
CREATE INDEX IF NOT EXISTS idx_vocabulary_assignment_items_list ON vocabulary_assignment_items(assignment_list_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_assignment_items_vocab ON vocabulary_assignment_items(vocabulary_id);
CREATE INDEX IF NOT EXISTS idx_student_vocab_progress_student ON student_vocabulary_assignment_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_vocab_progress_assignment ON student_vocabulary_assignment_progress(assignment_id);
CREATE INDEX IF NOT EXISTS idx_assignment_game_sessions_student ON assignment_game_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_assignment_game_sessions_assignment ON assignment_game_sessions(assignment_id);

-- 7. Create RLS policies
ALTER TABLE vocabulary_assignment_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocabulary_assignment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_vocabulary_assignment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_game_sessions ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own vocabulary lists
CREATE POLICY "Teachers can manage own vocabulary lists" ON vocabulary_assignment_lists
    FOR ALL USING (auth.uid() = teacher_id);

-- Teachers can see public vocabulary lists
CREATE POLICY "Teachers can view public vocabulary lists" ON vocabulary_assignment_lists
    FOR SELECT USING (is_public = true OR auth.uid() = teacher_id);

-- Teachers can manage items in their vocabulary lists
CREATE POLICY "Teachers can manage vocabulary items" ON vocabulary_assignment_items
    FOR ALL USING (
        assignment_list_id IN (
            SELECT id FROM vocabulary_assignment_lists 
            WHERE teacher_id = auth.uid()
        )
    );

-- Students can view their own progress
CREATE POLICY "Students can view own progress" ON student_vocabulary_assignment_progress
    FOR SELECT USING (auth.uid() = student_id);

-- Teachers can view progress of their students
CREATE POLICY "Teachers can view student progress" ON student_vocabulary_assignment_progress
    FOR SELECT USING (
        assignment_id IN (
            SELECT id FROM assignments 
            WHERE created_by = auth.uid()
        )
    );

-- Students can update their own progress
CREATE POLICY "Students can update own progress" ON student_vocabulary_assignment_progress
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own progress records" ON student_vocabulary_assignment_progress
    FOR UPDATE USING (auth.uid() = student_id);

-- Students can manage their own game sessions
CREATE POLICY "Students can manage own game sessions" ON assignment_game_sessions
    FOR ALL USING (auth.uid() = student_id);

-- Teachers can view game sessions for their assignments
CREATE POLICY "Teachers can view assignment game sessions" ON assignment_game_sessions
    FOR SELECT USING (
        assignment_id IN (
            SELECT id FROM assignments 
            WHERE created_by = auth.uid()
        )
    );

-- 8. Create functions for vocabulary assignment management

-- Function to get vocabulary by criteria
CREATE OR REPLACE FUNCTION get_vocabulary_by_criteria(
    p_theme TEXT DEFAULT NULL,
    p_topic TEXT DEFAULT NULL,
    p_difficulty TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS TABLE (
    id INTEGER,
    theme TEXT,
    topic TEXT,
    part_of_speech TEXT,
    spanish TEXT,
    english TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.theme,
        v.topic,
        v.part_of_speech,
        v.spanish,
        v.english
    FROM vocabulary v
    WHERE 
        (p_theme IS NULL OR v.theme = p_theme) AND
        (p_topic IS NULL OR v.topic = p_topic)
    ORDER BY v.id
    LIMIT p_limit;
END;
$$;

-- Function to create vocabulary assignment list from criteria
CREATE OR REPLACE FUNCTION create_vocabulary_list_from_criteria(
    p_name TEXT,
    p_description TEXT,
    p_teacher_id UUID,
    p_theme TEXT DEFAULT NULL,
    p_topic TEXT DEFAULT NULL,
    p_difficulty TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 20
)
RETURNS UUID
LANGUAGE plpgsql
AS $$
DECLARE
    list_id UUID;
    vocab_record RECORD;
    item_count INTEGER := 0;
BEGIN
    -- Create the vocabulary list
    INSERT INTO vocabulary_assignment_lists (
        name, description, teacher_id, theme, topic, difficulty_level
    ) VALUES (
        p_name, p_description, p_teacher_id, p_theme, p_topic, p_difficulty
    ) RETURNING id INTO list_id;
    
    -- Add vocabulary items
    FOR vocab_record IN 
        SELECT v.id
        FROM vocabulary v
        WHERE 
            (p_theme IS NULL OR v.theme = p_theme) AND
            (p_topic IS NULL OR v.topic = p_topic)
        ORDER BY v.id
        LIMIT p_limit
    LOOP
        INSERT INTO vocabulary_assignment_items (
            assignment_list_id, vocabulary_id, order_position
        ) VALUES (
            list_id, vocab_record.id, item_count
        );
        item_count := item_count + 1;
    END LOOP;
    
    -- Update word count
    UPDATE vocabulary_assignment_lists 
    SET word_count = item_count 
    WHERE id = list_id;
    
    RETURN list_id;
END;
$$;

-- Function to get assignment vocabulary with progress
CREATE OR REPLACE FUNCTION get_assignment_vocabulary_with_progress(
    p_assignment_id UUID,
    p_student_id UUID
)
RETURNS TABLE (
    vocabulary_id INTEGER,
    spanish TEXT,
    english TEXT,
    theme TEXT,
    topic TEXT,
    part_of_speech TEXT,
    attempts INTEGER,
    correct_attempts INTEGER,
    mastery_level INTEGER,
    last_attempted_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.spanish,
        v.english,
        v.theme,
        v.topic,
        v.part_of_speech,
        COALESCE(p.attempts, 0)::INTEGER,
        COALESCE(p.correct_attempts, 0)::INTEGER,
        COALESCE(p.mastery_level, 0)::INTEGER,
        p.last_attempted_at
    FROM assignments a
    JOIN vocabulary_assignment_lists val ON a.vocabulary_assignment_list_id = val.id
    JOIN vocabulary_assignment_items vai ON val.id = vai.assignment_list_id
    JOIN vocabulary v ON vai.vocabulary_id = v.id
    LEFT JOIN student_vocabulary_assignment_progress p ON 
        p.assignment_id = a.id AND 
        p.student_id = p_student_id AND 
        p.vocabulary_id = v.id
    WHERE a.id = p_assignment_id
    ORDER BY vai.order_position;
END;
$$;

-- 9. Create trigger to update word count
CREATE OR REPLACE FUNCTION update_vocabulary_list_word_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vocabulary_assignment_lists 
    SET word_count = (
        SELECT COUNT(*) 
        FROM vocabulary_assignment_items 
        WHERE assignment_list_id = COALESCE(NEW.assignment_list_id, OLD.assignment_list_id)
    ),
    updated_at = NOW()
    WHERE id = COALESCE(NEW.assignment_list_id, OLD.assignment_list_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vocabulary_list_word_count
    AFTER INSERT OR DELETE ON vocabulary_assignment_items
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_list_word_count(); 