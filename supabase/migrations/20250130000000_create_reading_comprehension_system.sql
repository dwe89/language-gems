-- Create reading comprehension tasks table
CREATE TABLE reading_comprehension_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('spanish', 'french', 'german')),
    curriculum_level TEXT CHECK (curriculum_level IN ('ks3', 'ks4')),
    exam_board TEXT CHECK (exam_board IN ('aqa', 'edexcel')),
    theme_topic TEXT,
    category TEXT,
    subcategory TEXT,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('foundation', 'intermediate', 'higher')),
    content TEXT NOT NULL,
    word_count INTEGER,
    estimated_reading_time INTEGER, -- in minutes
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading comprehension questions table
CREATE TABLE reading_comprehension_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES reading_comprehension_tasks(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL,
    question TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('multiple-choice', 'true-false', 'short-answer', 'gap-fill')),
    options JSONB, -- for multiple choice options
    correct_answer JSONB NOT NULL, -- can be string or array
    points INTEGER DEFAULT 1,
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading comprehension results table
CREATE TABLE reading_comprehension_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    task_id UUID REFERENCES reading_comprehension_tasks(id),
    student_id UUID REFERENCES auth.users(id),
    assignment_id UUID REFERENCES assignments(id), -- optional, for assignment mode
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL,
    score_percentage INTEGER NOT NULL,
    time_spent_seconds INTEGER NOT NULL,
    passed BOOLEAN NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reading comprehension question results table
CREATE TABLE reading_comprehension_question_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    result_id UUID REFERENCES reading_comprehension_results(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL, -- question identifier from the task
    user_answer JSONB, -- can be string or array
    correct_answer JSONB NOT NULL,
    is_correct BOOLEAN NOT NULL,
    points_earned INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reading_tasks_language ON reading_comprehension_tasks(language);
CREATE INDEX idx_reading_tasks_difficulty ON reading_comprehension_tasks(difficulty);
CREATE INDEX idx_reading_tasks_curriculum ON reading_comprehension_tasks(curriculum_level);
CREATE INDEX idx_reading_tasks_category ON reading_comprehension_tasks(category);
CREATE INDEX idx_reading_questions_task ON reading_comprehension_questions(task_id);
CREATE INDEX idx_reading_results_student ON reading_comprehension_results(student_id);
CREATE INDEX idx_reading_results_task ON reading_comprehension_results(task_id);
CREATE INDEX idx_reading_results_assignment ON reading_comprehension_results(assignment_id);
CREATE INDEX idx_reading_results_completed ON reading_comprehension_results(completed_at);

-- Enable RLS (Row Level Security)
ALTER TABLE reading_comprehension_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_comprehension_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_comprehension_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_comprehension_question_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies

-- Tasks: Teachers can create and view their own tasks, students can view public tasks
CREATE POLICY "Teachers can manage their reading tasks" ON reading_comprehension_tasks
    FOR ALL USING (
        auth.uid() = created_by OR 
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'teacher'
        )
    );

CREATE POLICY "Students can view reading tasks" ON reading_comprehension_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'student'
        )
    );

-- Questions: Follow the same pattern as tasks
CREATE POLICY "Teachers can manage reading questions" ON reading_comprehension_questions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM reading_comprehension_tasks 
            WHERE reading_comprehension_tasks.id = task_id 
            AND (
                reading_comprehension_tasks.created_by = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM user_profiles 
                    WHERE user_profiles.id = auth.uid() 
                    AND user_profiles.role = 'teacher'
                )
            )
        )
    );

CREATE POLICY "Students can view reading questions" ON reading_comprehension_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'student'
        )
    );

-- Results: Students can view their own results, teachers can view their students' results
CREATE POLICY "Students can manage their reading results" ON reading_comprehension_results
    FOR ALL USING (auth.uid() = student_id);

CREATE POLICY "Teachers can view student reading results" ON reading_comprehension_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_profiles.id = auth.uid() 
            AND user_profiles.role = 'teacher'
        ) AND (
            -- Teacher created the task
            EXISTS (
                SELECT 1 FROM reading_comprehension_tasks 
                WHERE reading_comprehension_tasks.id = task_id 
                AND reading_comprehension_tasks.created_by = auth.uid()
            ) OR
            -- Student is in teacher's class
            EXISTS (
                SELECT 1 FROM student_classes sc
                JOIN classes c ON c.id = sc.class_id
                WHERE sc.student_id = reading_comprehension_results.student_id
                AND c.teacher_id = auth.uid()
            )
        )
    );

-- Question results: Follow the same pattern as main results
CREATE POLICY "Students can manage their question results" ON reading_comprehension_question_results
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM reading_comprehension_results 
            WHERE reading_comprehension_results.id = result_id 
            AND reading_comprehension_results.student_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can view student question results" ON reading_comprehension_question_results
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM reading_comprehension_results rcr
            JOIN user_profiles up ON up.id = auth.uid()
            WHERE rcr.id = result_id 
            AND up.role = 'teacher'
            AND (
                -- Teacher created the task
                EXISTS (
                    SELECT 1 FROM reading_comprehension_tasks 
                    WHERE reading_comprehension_tasks.id = rcr.task_id 
                    AND reading_comprehension_tasks.created_by = auth.uid()
                ) OR
                -- Student is in teacher's class
                EXISTS (
                    SELECT 1 FROM student_classes sc
                    JOIN classes c ON c.id = sc.class_id
                    WHERE sc.student_id = rcr.student_id
                    AND c.teacher_id = auth.uid()
                )
            )
        )
    );

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_reading_tasks_updated_at 
    BEFORE UPDATE ON reading_comprehension_tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample reading comprehension tasks
INSERT INTO reading_comprehension_tasks (
    title, language, curriculum_level, category, subcategory, difficulty, content, word_count, estimated_reading_time
) VALUES 
(
    'Spanish Family Life',
    'spanish',
    'ks3',
    'identity_personal_life',
    'family_friends',
    'foundation',
    'Mi familia es muy importante para mí. Somos cinco personas: mis padres, mis dos hermanos y yo. Mi padre se llama Carlos y trabaja en una oficina. Mi madre se llama María y es profesora en una escuela primaria. Mi hermano mayor, Diego, tiene dieciocho años y estudia en la universidad. Mi hermana menor, Ana, tiene doce años y va al instituto. Vivimos en una casa grande con jardín. Los fines de semana nos gusta pasar tiempo juntos. A veces vamos al parque o al cine. Mi familia es muy unida y siempre nos ayudamos.',
    95,
    3
),
(
    'French School Day',
    'french',
    'ks3',
    'school_jobs_future',
    'daily_routine_school',
    'intermediate',
    'Ma journée à l''école commence à huit heures du matin. D''abord, j''ai cours de mathématiques avec Madame Dubois. Elle est très stricte mais ses cours sont intéressants. Après, j''ai français avec Monsieur Martin. Il nous fait lire beaucoup de livres. À midi, je mange à la cantine avec mes amis. L''après-midi, j''ai sciences et histoire. Les sciences sont ma matière préférée parce que j''aime faire des expériences. Le soir, je rentre chez moi et je fais mes devoirs. Parfois, c''est difficile mais mes parents m''aident.',
    102,
    4
);

-- Insert sample questions for the Spanish task
INSERT INTO reading_comprehension_questions (task_id, question_number, question, type, options, correct_answer, points, explanation)
SELECT 
    t.id,
    1,
    '¿Cuántas personas hay en la familia?',
    'multiple-choice',
    '["Cuatro", "Cinco", "Seis", "Tres"]'::jsonb,
    '"Cinco"'::jsonb,
    2,
    'El texto dice "Somos cinco personas: mis padres, mis dos hermanos y yo"'
FROM reading_comprehension_tasks t 
WHERE t.title = 'Spanish Family Life';

INSERT INTO reading_comprehension_questions (task_id, question_number, question, type, correct_answer, points, explanation)
SELECT 
    t.id,
    2,
    '¿Cómo se llama el padre?',
    'short-answer',
    '"Carlos"'::jsonb,
    1,
    'El texto menciona "Mi padre se llama Carlos"'
FROM reading_comprehension_tasks t 
WHERE t.title = 'Spanish Family Life';

-- Insert sample questions for the French task
INSERT INTO reading_comprehension_questions (task_id, question_number, question, type, options, correct_answer, points, explanation)
SELECT 
    t.id,
    1,
    'À quelle heure commence la journée à l''école?',
    'multiple-choice',
    '["Sept heures", "Huit heures", "Neuf heures", "Dix heures"]'::jsonb,
    '"Huit heures"'::jsonb,
    2,
    'Le texte dit "Ma journée à l''école commence à huit heures du matin"'
FROM reading_comprehension_tasks t 
WHERE t.title = 'French School Day';

INSERT INTO reading_comprehension_questions (task_id, question_number, question, type, correct_answer, points, explanation)
SELECT 
    t.id,
    2,
    'Quelle est la matière préférée de l''élève?',
    'short-answer',
    '"Sciences"'::jsonb,
    1,
    'Le texte indique "Les sciences sont ma matière préférée"'
FROM reading_comprehension_tasks t 
WHERE t.title = 'French School Day';