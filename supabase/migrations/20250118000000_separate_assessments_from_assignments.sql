-- =====================================================
-- ASSESSMENTS SEPARATION MIGRATION
-- =====================================================
-- This migration separates assessments from assignments by:
-- 1. Creating a new 'assessments' table
-- 2. Migrating existing assessment assignments
-- 3. Updating result tables to reference assessments
-- 4. Maintaining backward compatibility during transition
-- =====================================================

-- Step 1: Create the new assessments table
-- =====================================================
CREATE TABLE IF NOT EXISTS assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR NOT NULL,
    description TEXT,
    
    -- Class/Teacher assignment
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    
    -- Dates
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Assessment-specific fields
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
    exam_board TEXT,
    tier TEXT,
    
    -- Configuration stored in JSONB (replaces game_config.assessmentConfig)
    assessment_config JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Attempt limits
    max_attempts INTEGER DEFAULT 3,
    time_limit INTEGER, -- in seconds
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    
    -- Scoring
    passing_score_percentage INTEGER DEFAULT 70,
    points INTEGER DEFAULT 0,
    
    -- Settings
    feedback_enabled BOOLEAN DEFAULT true,
    hints_allowed BOOLEAN DEFAULT false,
    show_correct_answers BOOLEAN DEFAULT true,
    
    COMMENT ON TABLE assessments IS 'Standalone assessments table, separated from general assignments'
);

-- Step 2: Create indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_assessments_class_id ON assessments(class_id);
CREATE INDEX IF NOT EXISTS idx_assessments_created_by ON assessments(created_by);
CREATE INDEX IF NOT EXISTS idx_assessments_status ON assessments(status);
CREATE INDEX IF NOT EXISTS idx_assessments_due_date ON assessments(due_date);
CREATE INDEX IF NOT EXISTS idx_assessments_curriculum_level ON assessments(curriculum_level);

-- Step 3: Add assessment_id columns to results tables
-- =====================================================
ALTER TABLE aqa_reading_results 
    ADD COLUMN IF NOT EXISTS direct_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE;

ALTER TABLE aqa_listening_results 
    ADD COLUMN IF NOT EXISTS direct_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE;

ALTER TABLE aqa_writing_results 
    ADD COLUMN IF NOT EXISTS direct_assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE;

-- Add indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_aqa_reading_results_direct_assessment ON aqa_reading_results(direct_assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_listening_results_direct_assessment ON aqa_listening_results(direct_assessment_id);
CREATE INDEX IF NOT EXISTS idx_aqa_writing_results_direct_assessment ON aqa_writing_results(direct_assessment_id);

-- Step 4: Create enhanced_assessment_progress table (mirrors enhanced_assignment_progress)
-- =====================================================
CREATE TABLE IF NOT EXISTS enhanced_assessment_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Progress tracking
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'overdue')),
    progress_percentage NUMERIC DEFAULT 0,
    
    -- Scoring
    best_score NUMERIC DEFAULT 0,
    latest_score NUMERIC DEFAULT 0,
    attempts_count INTEGER DEFAULT 0,
    
    -- Time tracking
    total_time_seconds INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(assessment_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_enhanced_assessment_progress_assessment ON enhanced_assessment_progress(assessment_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_assessment_progress_student ON enhanced_assessment_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_enhanced_assessment_progress_status ON enhanced_assessment_progress(status);

-- Step 5: Create class_assessments junction table (replaces class_enrollments logic for assessments)
-- =====================================================
CREATE TABLE IF NOT EXISTS class_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    custom_due_date TIMESTAMP WITH TIME ZONE,
    custom_instructions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(assessment_id, class_id)
);

CREATE INDEX IF NOT EXISTS idx_class_assessments_assessment ON class_assessments(assessment_id);
CREATE INDEX IF NOT EXISTS idx_class_assessments_class ON class_assessments(class_id);

-- Step 6: Migrate existing assessment assignments to assessments table
-- =====================================================
-- This is a data migration that copies assignment records where game_type='assessment'
INSERT INTO assessments (
    id, -- Use the same ID so we can track the migration
    title,
    description,
    class_id,
    created_by,
    due_date,
    created_at,
    updated_at,
    archived_at,
    curriculum_level,
    exam_board,
    tier,
    assessment_config,
    max_attempts,
    time_limit,
    status,
    passing_score_percentage,
    points,
    feedback_enabled,
    hints_allowed,
    show_correct_answers
)
SELECT 
    a.id, -- Keep same ID for foreign key compatibility
    a.title,
    a.description,
    a.class_id,
    a.created_by,
    a.due_date,
    a.created_at,
    a.updated_at,
    a.archived_at,
    COALESCE(a.curriculum_level, 'KS3'),
    a.exam_board,
    a.tier,
    -- Extract assessmentConfig from game_config
    COALESCE(a.game_config->'assessmentConfig', '{}'::jsonb),
    COALESCE(a.max_attempts, 3),
    a.time_limit,
    CASE 
        WHEN a.archived_at IS NOT NULL THEN 'archived'
        WHEN a.status = 'active' THEN 'active'
        ELSE 'draft'
    END,
    70, -- default passing score
    COALESCE(a.points, 0),
    COALESCE(a.feedback_enabled, true),
    COALESCE(a.hints_allowed, false),
    true -- show_correct_answers default
FROM assignments a
WHERE a.game_type = 'assessment'
ON CONFLICT (id) DO NOTHING; -- Prevent errors if migration runs multiple times

-- Step 7: Populate direct_assessment_id in results tables
-- =====================================================
-- Update reading results
UPDATE aqa_reading_results arr
SET direct_assessment_id = a.id
FROM assignments a
WHERE arr.assignment_id = a.id
  AND a.game_type = 'assessment'
  AND arr.direct_assessment_id IS NULL;

-- Update listening results
UPDATE aqa_listening_results alr
SET direct_assessment_id = a.id
FROM assignments a
WHERE alr.assignment_id = a.id
  AND a.game_type = 'assessment'
  AND alr.direct_assessment_id IS NULL;

-- Update writing results
UPDATE aqa_writing_results awr
SET direct_assessment_id = a.id
FROM assignments a
WHERE awr.assignment_id = a.id
  AND a.game_type = 'assessment'
  AND awr.direct_assessment_id IS NULL;

-- Step 8: Migrate enhanced_assignment_progress to enhanced_assessment_progress
-- =====================================================
INSERT INTO enhanced_assessment_progress (
    assessment_id,
    student_id,
    status,
    progress_percentage,
    best_score,
    latest_score,
    attempts_count,
    total_time_seconds,
    started_at,
    last_activity_at,
    completed_at,
    created_at,
    updated_at
)
SELECT 
    eap.assignment_id, -- This will be the assessment_id since we kept same IDs
    eap.student_id,
    eap.status,
    eap.progress_percentage,
    eap.best_score,
    eap.latest_score,
    eap.attempts_count,
    eap.total_time_seconds,
    eap.started_at,
    eap.last_activity_at,
    eap.completed_at,
    eap.created_at,
    eap.updated_at
FROM enhanced_assignment_progress eap
INNER JOIN assignments a ON a.id = eap.assignment_id
WHERE a.game_type = 'assessment'
ON CONFLICT (assessment_id, student_id) DO NOTHING;

-- Step 9: Create class_assessments entries
-- =====================================================
INSERT INTO class_assessments (
    assessment_id,
    class_id,
    assigned_date,
    custom_due_date
)
SELECT DISTINCT
    a.id,
    a.class_id,
    a.created_at,
    a.due_date
FROM assessments a
WHERE a.class_id IS NOT NULL
ON CONFLICT (assessment_id, class_id) DO NOTHING;

-- Step 10: Enable Row Level Security
-- =====================================================
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enhanced_assessment_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for assessments table
CREATE POLICY "Teachers can view their own assessments"
    ON assessments FOR SELECT
    USING (
        created_by = auth.uid()
        OR class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can create assessments"
    ON assessments FOR INSERT
    WITH CHECK (
        created_by = auth.uid()
        OR class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can update their own assessments"
    ON assessments FOR UPDATE
    USING (
        created_by = auth.uid()
        OR class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Teachers can delete their own assessments"
    ON assessments FOR DELETE
    USING (
        created_by = auth.uid()
        OR class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view assessments for their classes"
    ON assessments FOR SELECT
    USING (
        class_id IN (
            SELECT class_id FROM class_enrollments WHERE student_id = auth.uid()
        )
    );

-- RLS Policies for enhanced_assessment_progress
CREATE POLICY "Students can view their own progress"
    ON enhanced_assessment_progress FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Students can update their own progress"
    ON enhanced_assessment_progress FOR INSERT
    WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update their own progress"
    ON enhanced_assessment_progress FOR UPDATE
    USING (student_id = auth.uid());

CREATE POLICY "Teachers can view student progress for their classes"
    ON enhanced_assessment_progress FOR SELECT
    USING (
        assessment_id IN (
            SELECT a.id FROM assessments a
            WHERE a.class_id IN (
                SELECT id FROM classes WHERE teacher_id = auth.uid()
            )
        )
    );

-- RLS Policies for class_assessments
CREATE POLICY "Teachers can manage class assessments"
    ON class_assessments FOR ALL
    USING (
        class_id IN (
            SELECT id FROM classes WHERE teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view class assessments"
    ON class_assessments FOR SELECT
    USING (
        class_id IN (
            SELECT class_id FROM class_enrollments WHERE student_id = auth.uid()
        )
    );

-- Step 11: Create helper functions
-- =====================================================

-- Function to get pending assessments for a student
CREATE OR REPLACE FUNCTION get_pending_assessments_count(p_student_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(DISTINCT a.id) INTO v_count
    FROM assessments a
    INNER JOIN class_assessments ca ON ca.assessment_id = a.id
    INNER JOIN class_enrollments ce ON ce.class_id = ca.class_id
    LEFT JOIN enhanced_assessment_progress eap ON eap.assessment_id = a.id AND eap.student_id = p_student_id
    WHERE ce.student_id = p_student_id
      AND a.status = 'active'
      AND (eap.status IS NULL OR eap.status != 'completed');
    
    RETURN COALESCE(v_count, 0);
END;
$$;

-- Function to check if assessment is from assignment (for backward compatibility)
CREATE OR REPLACE FUNCTION is_legacy_assessment(p_assessment_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM assignments 
        WHERE id = p_assessment_id AND game_type = 'assessment'
    );
END;
$$;

-- Step 12: Add comments for documentation
-- =====================================================
COMMENT ON TABLE assessments IS 'Standalone assessments table separated from general assignments. Contains AQA reading, listening, writing, and other assessment types.';
COMMENT ON COLUMN assessments.assessment_config IS 'JSONB configuration containing selectedAssessments array with assessment parts (reading, listening, writing, etc.)';
COMMENT ON COLUMN assessments.direct_assessment_id IS 'Direct reference to assessments table, bypassing assignments table';
COMMENT ON TABLE enhanced_assessment_progress IS 'Tracks student progress on assessments, separate from assignment progress';
COMMENT ON TABLE class_assessments IS 'Junction table linking assessments to classes, replacing class_id direct reference';

-- Migration complete!
-- =====================================================
-- Next steps:
-- 1. Update TypeScript types with: npx supabase gen types typescript --local > src/lib/database.types.ts
-- 2. Update application code to query 'assessments' table instead of filtering assignments by game_type
-- 3. Update student navigation to count from enhanced_assessment_progress instead of enhanced_assignment_progress
-- 4. Eventually deprecate assignment_id columns in results tables (keep for now for backward compatibility)
-- =====================================================
