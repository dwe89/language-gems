-- Reading Comprehension System Migration
-- This migration creates the database structure for the reading comprehension assessment system

-- Create reading passages table
CREATE TABLE IF NOT EXISTS reading_passages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    language TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('foundation', 'higher')),
    theme TEXT,
    topic TEXT,
    word_count INTEGER,
    estimated_reading_time INTEGER, -- in minutes
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading questions table
CREATE TABLE IF NOT EXISTS reading_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    passage_id UUID REFERENCES reading_passages(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple-choice', 'true-false', 'short-answer', 'matching', 'gap-fill')),
    question_text TEXT NOT NULL,
    options JSONB, -- For multiple choice options
    correct_answer JSONB NOT NULL, -- Can be string or array
    points INTEGER DEFAULT 1,
    explanation TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading assessments table
CREATE TABLE IF NOT EXISTS reading_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    passage_id UUID REFERENCES reading_passages(id),
    time_limit INTEGER DEFAULT 30, -- in minutes
    passing_score INTEGER DEFAULT 60, -- percentage
    language TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('foundation', 'higher')),
    theme TEXT,
    topic TEXT,
    created_by UUID REFERENCES auth.users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading assessment results table
CREATE TABLE IF NOT EXISTS reading_assessment_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    assessment_id TEXT NOT NULL, -- Can be dynamic assessment ID
    passage_id UUID REFERENCES reading_passages(id),
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- in seconds
    passed BOOLEAN NOT NULL,
    detailed_results JSONB, -- Question-by-question results
    assignment_mode BOOLEAN DEFAULT false,
    assignment_id UUID REFERENCES assignments(id),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user reading statistics table
CREATE TABLE IF NOT EXISTS user_reading_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    total_assessments INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    assessments_passed INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading comprehension assignments table
CREATE TABLE IF NOT EXISTS reading_comprehension_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    assessment_id UUID REFERENCES reading_assessments(id),
    passage_id UUID REFERENCES reading_passages(id),
    custom_time_limit INTEGER, -- Override default time limit
    custom_passing_score INTEGER, -- Override default passing score
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_reading_passages_language_difficulty ON reading_passages(language, difficulty);
CREATE INDEX IF NOT EXISTS idx_reading_passages_theme_topic ON reading_passages(theme, topic);
CREATE INDEX IF NOT EXISTS idx_reading_questions_passage_id ON reading_questions(passage_id);
CREATE INDEX IF NOT EXISTS idx_reading_questions_order ON reading_questions(passage_id, order_index);
CREATE INDEX IF NOT EXISTS idx_reading_assessment_results_user_id ON reading_assessment_results(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_assessment_results_completed_at ON reading_assessment_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_reading_assessment_results_assignment ON reading_assessment_results(assignment_id) WHERE assignment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_reading_stats_user_id ON user_reading_stats(user_id);

-- Enable Row Level Security
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_comprehension_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_passages
CREATE POLICY "Teachers can manage their own passages" ON reading_passages
    FOR ALL USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view active passages" ON reading_passages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- RLS Policies for reading_questions
CREATE POLICY "Teachers can manage questions" ON reading_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view questions" ON reading_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- RLS Policies for reading_assessments
CREATE POLICY "Teachers can manage assessments" ON reading_assessments
    FOR ALL USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'teacher'
        )
    );

CREATE POLICY "Students can view active assessments" ON reading_assessments
    FOR SELECT USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid() AND role = 'student'
        )
    );

-- RLS Policies for reading_assessment_results
CREATE POLICY "Users can manage their own results" ON reading_assessment_results
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student results" ON reading_assessment_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            JOIN class_enrollments ce ON ce.student_id = reading_assessment_results.user_id
            JOIN classes c ON c.id = ce.class_id
            WHERE up.user_id = auth.uid() 
            AND up.role = 'teacher'
            AND c.teacher_id = auth.uid()
        )
    );

-- RLS Policies for user_reading_stats
CREATE POLICY "Users can manage their own stats" ON user_reading_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student stats" ON user_reading_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            JOIN class_enrollments ce ON ce.student_id = user_reading_stats.user_id
            JOIN classes c ON c.id = ce.class_id
            WHERE up.user_id = auth.uid() 
            AND up.role = 'teacher'
            AND c.teacher_id = auth.uid()
        )
    );

-- RLS Policies for reading_comprehension_assignments
CREATE POLICY "Teachers can manage reading assignments" ON reading_comprehension_assignments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM assignments a
            JOIN user_profiles up ON up.user_id = auth.uid()
            WHERE a.id = reading_comprehension_assignments.assignment_id
            AND a.created_by = auth.uid()
            AND up.role = 'teacher'
        )
    );

CREATE POLICY "Students can view their reading assignments" ON reading_comprehension_assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM assignments a
            JOIN class_enrollments ce ON ce.class_id = a.class_id
            WHERE a.id = reading_comprehension_assignments.assignment_id
            AND ce.student_id = auth.uid()
        )
    );

-- Create function to update reading stats
CREATE OR REPLACE FUNCTION update_reading_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update user reading statistics when a new result is inserted
    INSERT INTO user_reading_stats (
        user_id,
        total_assessments,
        total_questions_answered,
        total_correct_answers,
        total_time_spent,
        assessments_passed,
        average_score,
        best_score,
        updated_at
    )
    VALUES (
        NEW.user_id,
        1,
        NEW.total_questions,
        NEW.correct_answers,
        NEW.time_spent,
        CASE WHEN NEW.passed THEN 1 ELSE 0 END,
        NEW.score,
        NEW.score,
        NOW()
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_assessments = user_reading_stats.total_assessments + 1,
        total_questions_answered = user_reading_stats.total_questions_answered + NEW.total_questions,
        total_correct_answers = user_reading_stats.total_correct_answers + NEW.correct_answers,
        total_time_spent = user_reading_stats.total_time_spent + NEW.time_spent,
        assessments_passed = user_reading_stats.assessments_passed + CASE WHEN NEW.passed THEN 1 ELSE 0 END,
        average_score = ROUND(
            ((user_reading_stats.average_score * user_reading_stats.total_assessments) + NEW.score) / 
            (user_reading_stats.total_assessments + 1)
        ),
        best_score = GREATEST(user_reading_stats.best_score, NEW.score),
        updated_at = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating reading stats
CREATE TRIGGER update_reading_stats_trigger
    AFTER INSERT ON reading_assessment_results
    FOR EACH ROW
    EXECUTE FUNCTION update_reading_stats();

-- Insert sample reading passages
INSERT INTO reading_passages (title, content, language, difficulty, theme, topic, word_count, estimated_reading_time) VALUES
(
    'Mi Familia',
    'Mi nombre es Carlos y tengo quince años. Vivo en Madrid con mi familia. Mi padre se llama José y trabaja en una oficina. Mi madre se llama María y es profesora en una escuela primaria.

Tengo una hermana mayor que se llama Ana. Ella tiene dieciocho años y estudia en la universidad. También tengo un hermano menor, Pablo, que tiene doce años y va al colegio.

Los fines de semana, mi familia y yo vamos al parque. A mi padre le gusta leer el periódico bajo un árbol. Mi madre prefiere caminar por el jardín. Ana siempre lleva un libro para estudiar, y Pablo juega al fútbol con otros niños.

Por las tardes, cenamos juntos y hablamos sobre nuestro día. Me gusta mucho mi familia porque siempre nos ayudamos unos a otros.',
    'es',
    'foundation',
    'family',
    'family_members',
    145,
    3
),
(
    'El Cambio Climático en España',
    'España se enfrenta a desafíos significativos debido al cambio climático. Las temperaturas han aumentado considerablemente en las últimas décadas, especialmente durante los meses de verano. Este fenómeno ha provocado sequías más frecuentes e intensas, afectando particularmente a las regiones del sur y este del país.

La agricultura española, tradicionalmente dependiente de cultivos como el olivo, la vid y los cítricos, está experimentando transformaciones importantes. Los agricultores se ven obligados a adaptar sus métodos de cultivo, implementando sistemas de riego más eficientes y explorando variedades de plantas más resistentes a la sequía.

Las ciudades costeras también enfrentan riesgos crecientes. El aumento del nivel del mar amenaza infraestructuras turísticas vitales para la economía nacional. Barcelona, Valencia y las Islas Baleares han comenzado a desarrollar planes de adaptación para proteger sus costas.

El gobierno español ha respondido con políticas ambiciosas, incluyendo inversiones masivas en energías renovables. El país aspira a convertirse en líder europeo en energía solar y eólica, aprovechando sus condiciones geográficas favorables.',
    'es',
    'higher',
    'environment',
    'climate_change',
    198,
    4
);

-- Insert sample questions for the passages
DO $$
DECLARE
    familia_passage_id UUID;
    clima_passage_id UUID;
BEGIN
    -- Get passage IDs
    SELECT id INTO familia_passage_id FROM reading_passages WHERE title = 'Mi Familia';
    SELECT id INTO clima_passage_id FROM reading_passages WHERE title = 'El Cambio Climático en España';
    
    -- Questions for Mi Familia passage
    INSERT INTO reading_questions (passage_id, question_type, question_text, options, correct_answer, points, order_index) VALUES
    (familia_passage_id, 'multiple-choice', '¿Cuántos años tiene Carlos?', 
     '["Doce años", "Quince años", "Dieciocho años", "Veinte años"]'::jsonb, 
     '"Quince años"'::jsonb, 2, 1),
    (familia_passage_id, 'multiple-choice', '¿Dónde trabaja el padre de Carlos?', 
     '["En una escuela", "En una oficina", "En un hospital", "En una tienda"]'::jsonb, 
     '"En una oficina"'::jsonb, 2, 2),
    (familia_passage_id, 'true-false', 'Ana es la hermana menor de Carlos.', 
     null, '"False"'::jsonb, 1, 3),
    (familia_passage_id, 'short-answer', '¿Qué hace la familia de Carlos los fines de semana?', 
     null, '"Van al parque"'::jsonb, 3, 4);
    
    -- Questions for climate change passage
    INSERT INTO reading_questions (passage_id, question_type, question_text, options, correct_answer, points, order_index) VALUES
    (clima_passage_id, 'multiple-choice', '¿Cuál es el principal desafío que enfrenta España según el texto?', 
     '["La crisis económica", "El cambio climático", "La inmigración", "El desempleo"]'::jsonb, 
     '"El cambio climático"'::jsonb, 2, 1),
    (clima_passage_id, 'multiple-choice', '¿Qué sectores se mencionan como afectados por el cambio climático?', 
     '["Solo la agricultura", "Solo el turismo", "La agricultura y el turismo", "La industria y los servicios"]'::jsonb, 
     '"La agricultura y el turismo"'::jsonb, 3, 2),
    (clima_passage_id, 'short-answer', '¿Qué medidas han tomado los agricultores para adaptarse al cambio climático?', 
     null, '"Implementar sistemas de riego más eficientes y explorar variedades de plantas más resistentes a la sequía"'::jsonb, 4, 3),
    (clima_passage_id, 'true-false', 'España quiere convertirse en líder europeo en energías renovables.', 
     null, '"True"'::jsonb, 2, 4);
END $$;

-- Create view for reading comprehension analytics
CREATE OR REPLACE VIEW reading_comprehension_analytics AS
SELECT 
    u.id as user_id,
    up.display_name as student_name,
    COUNT(rar.id) as total_assessments,
    AVG(rar.score) as average_score,
    SUM(rar.time_spent) as total_time_spent,
    COUNT(CASE WHEN rar.passed THEN 1 END) as assessments_passed,
    ROUND(
        (COUNT(CASE WHEN rar.passed THEN 1 END)::float / NULLIF(COUNT(rar.id), 0)) * 100
    ) as pass_rate,
    MAX(rar.completed_at) as last_assessment_date
FROM auth.users u
JOIN user_profiles up ON up.user_id = u.id
LEFT JOIN reading_assessment_results rar ON rar.user_id = u.id
WHERE up.role = 'student'
GROUP BY u.id, up.display_name;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create reading comprehension results table (for the new system)
CREATE TABLE IF NOT EXISTS reading_comprehension_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    text_id TEXT NOT NULL, -- References text from content database
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    time_spent INTEGER NOT NULL, -- in seconds
    passed BOOLEAN NOT NULL,
    question_results JSONB, -- Question-by-question results
    assignment_mode BOOLEAN DEFAULT false,
    assignment_id UUID REFERENCES assignments(id),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user reading comprehension statistics table
CREATE TABLE IF NOT EXISTS user_reading_comprehension_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) UNIQUE,
    total_tasks INTEGER DEFAULT 0,
    total_questions_answered INTEGER DEFAULT 0,
    total_correct_answers INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0, -- in seconds
    tasks_passed INTEGER DEFAULT 0,
    average_score INTEGER DEFAULT 0,
    best_score INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    best_streak INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for the new tables
CREATE INDEX IF NOT EXISTS idx_reading_comprehension_results_user_id ON reading_comprehension_results(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_comprehension_results_text_id ON reading_comprehension_results(text_id);
CREATE INDEX IF NOT EXISTS idx_reading_comprehension_results_completed_at ON reading_comprehension_results(completed_at);
CREATE INDEX IF NOT EXISTS idx_reading_comprehension_results_assignment ON reading_comprehension_results(assignment_id) WHERE assignment_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_reading_comprehension_stats_user_id ON user_reading_comprehension_stats(user_id);

-- Enable RLS for new tables
ALTER TABLE reading_comprehension_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reading_comprehension_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reading_comprehension_results
CREATE POLICY "Users can manage their own reading comprehension results" ON reading_comprehension_results
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student reading comprehension results" ON reading_comprehension_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            JOIN class_enrollments ce ON ce.student_id = reading_comprehension_results.user_id
            JOIN classes c ON c.id = ce.class_id
            WHERE up.user_id = auth.uid()
            AND up.role = 'teacher'
            AND c.teacher_id = auth.uid()
        )
    );

-- RLS Policies for user_reading_comprehension_stats
CREATE POLICY "Users can manage their own reading comprehension stats" ON user_reading_comprehension_stats
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Teachers can view student reading comprehension stats" ON user_reading_comprehension_stats
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            JOIN class_enrollments ce ON ce.student_id = user_reading_comprehension_stats.user_id
            JOIN classes c ON c.id = ce.class_id
            WHERE up.user_id = auth.uid()
            AND up.role = 'teacher'
            AND c.teacher_id = auth.uid()
        )
    );

-- Add comment
COMMENT ON TABLE reading_passages IS 'Stores reading comprehension passages for assessments';
COMMENT ON TABLE reading_questions IS 'Stores questions associated with reading passages';
COMMENT ON TABLE reading_assessments IS 'Stores formal reading assessments with passages and questions';
COMMENT ON TABLE reading_assessment_results IS 'Stores student results from reading comprehension assessments';
COMMENT ON TABLE user_reading_stats IS 'Aggregated reading comprehension statistics per user';
COMMENT ON TABLE reading_comprehension_assignments IS 'Links reading assessments to class assignments';
COMMENT ON TABLE reading_comprehension_results IS 'Stores results from the new reading comprehension system';
COMMENT ON TABLE user_reading_comprehension_stats IS 'User statistics for the new reading comprehension system';
