-- Migration: Create teacher_score_overrides table
-- Description: Allows teachers to manually override student assessment scores with audit trail
-- Date: 2025-01-09

-- Create the teacher_score_overrides table
CREATE TABLE IF NOT EXISTS teacher_score_overrides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  assessment_type TEXT NOT NULL,
  result_id UUID, -- Reference to the original assessment result (optional)
  
  -- Score information
  original_score INTEGER NOT NULL,
  original_max_score INTEGER NOT NULL DEFAULT 100,
  override_score INTEGER NOT NULL,
  override_max_score INTEGER NOT NULL DEFAULT 100,
  original_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN original_max_score > 0 THEN ROUND((original_score::DECIMAL / original_max_score) * 100)
      ELSE 0 
    END
  ) STORED,
  override_percentage INTEGER GENERATED ALWAYS AS (
    CASE 
      WHEN override_max_score > 0 THEN ROUND((override_score::DECIMAL / override_max_score) * 100)
      ELSE 0 
    END
  ) STORED,
  
  -- Audit information
  reason TEXT NOT NULL,
  overridden_by UUID NOT NULL REFERENCES user_profiles(user_id),
  overridden_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Future: Per-question overrides
  question_overrides JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_original_score CHECK (original_score >= 0 AND original_score <= original_max_score),
  CONSTRAINT valid_override_score CHECK (override_score >= 0 AND override_score <= override_max_score),
  CONSTRAINT valid_assessment_type CHECK (assessment_type IN (
    'reading-comprehension',
    'aqa-reading',
    'aqa-listening',
    'aqa-dictation',
    'aqa-writing',
    'four-skills',
    'exam-style',
    'vocabulary-game',
    'grammar-practice'
  )),
  CONSTRAINT reason_not_empty CHECK (char_length(trim(reason)) >= 10)
);

-- Create indexes for performance
CREATE INDEX idx_overrides_assignment ON teacher_score_overrides(assignment_id);
CREATE INDEX idx_overrides_student ON teacher_score_overrides(student_id);
CREATE INDEX idx_overrides_teacher ON teacher_score_overrides(overridden_by);
CREATE INDEX idx_overrides_type ON teacher_score_overrides(assessment_type);
CREATE INDEX idx_overrides_date ON teacher_score_overrides(overridden_at DESC);

-- Composite index for common queries
CREATE INDEX idx_overrides_assignment_student_type ON teacher_score_overrides(assignment_id, student_id, assessment_type);

-- Enable Row Level Security
ALTER TABLE teacher_score_overrides ENABLE ROW LEVEL SECURITY;

-- Policy: Teachers can view all overrides for their school's assignments
CREATE POLICY "Teachers can view overrides for their school"
  ON teacher_score_overrides
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM assignments a
      JOIN classes c ON a.class_id = c.id
      JOIN schools s ON c.school_id = s.id
      WHERE a.id = teacher_score_overrides.assignment_id
      AND s.id IN (
        SELECT school_id FROM user_profiles 
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policy: Teachers can create overrides for their own classes
CREATE POLICY "Teachers can create overrides for their classes"
  ON teacher_score_overrides
  FOR INSERT
  WITH CHECK (
    auth.uid() = overridden_by
    AND EXISTS (
      SELECT 1 FROM assignments a
      JOIN classes c ON a.class_id = c.id
      WHERE a.id = teacher_score_overrides.assignment_id
      AND c.teacher_id = auth.uid()
    )
  );

-- Policy: Teachers can update their own overrides (within 24 hours)
CREATE POLICY "Teachers can update recent overrides"
  ON teacher_score_overrides
  FOR UPDATE
  USING (
    overridden_by = auth.uid()
    AND overridden_at > NOW() - INTERVAL '24 hours'
  );

-- Policy: Admins and school owners can view all overrides
CREATE POLICY "Admins can view all overrides"
  ON teacher_score_overrides
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'school_owner')
    )
  );

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_teacher_score_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_teacher_score_overrides_timestamp
  BEFORE UPDATE ON teacher_score_overrides
  FOR EACH ROW
  EXECUTE FUNCTION update_teacher_score_overrides_updated_at();

-- Create a view for easy override lookups with teacher names
CREATE VIEW teacher_score_overrides_with_names AS
SELECT 
  o.*,
  up_teacher.display_name AS teacher_name,
  up_student.display_name AS student_name,
  a.title AS assignment_title
FROM teacher_score_overrides o
LEFT JOIN user_profiles up_teacher ON o.overridden_by = up_teacher.user_id
LEFT JOIN user_profiles up_student ON o.student_id = up_student.user_id
LEFT JOIN assignments a ON o.assignment_id = a.id;

-- Grant appropriate permissions
GRANT SELECT ON teacher_score_overrides_with_names TO authenticated;

-- Add comment to table
COMMENT ON TABLE teacher_score_overrides IS 'Stores manual score overrides by teachers with full audit trail';
COMMENT ON COLUMN teacher_score_overrides.reason IS 'Required explanation for the override (minimum 10 characters)';
COMMENT ON COLUMN teacher_score_overrides.question_overrides IS 'Future: JSON object for per-question score adjustments';
