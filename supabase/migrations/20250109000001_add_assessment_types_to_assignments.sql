-- Migration: Add assessment_types column to assignments table
-- This enables faster lookup of which assessment types an assignment contains
-- without needing to parse game_config and other metadata fields

-- Add assessment_types column
ALTER TABLE assignments 
ADD COLUMN IF NOT EXISTS assessment_types JSONB DEFAULT '[]'::jsonb;

-- Add index for querying by assessment type
CREATE INDEX IF NOT EXISTS idx_assignments_assessment_types 
ON assignments USING gin(assessment_types);

-- Add comment explaining the column
COMMENT ON COLUMN assignments.assessment_types IS 
'Array of assessment type strings detected in this assignment. 
Examples: ["reading-comprehension"], ["aqa-reading", "aqa-listening"], ["vocabulary-game", "grammar-practice"].
This is automatically populated from game_type, content_type, and game_config during assignment creation and backfill.';

-- Create a function to detect assessment types from assignment metadata
CREATE OR REPLACE FUNCTION detect_assignment_assessment_types(
  p_game_type TEXT,
  p_content_type TEXT,
  p_game_config JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
  v_types TEXT[] := '{}';
  v_selected_assessments JSONB;
  v_assessment JSONB;
  v_assessment_type TEXT;
BEGIN
  -- Check game_config.assessmentConfig.selectedAssessments
  IF p_game_config ? 'assessmentConfig' THEN
    v_selected_assessments := p_game_config->'assessmentConfig'->'selectedAssessments';
    IF v_selected_assessments IS NOT NULL THEN
      FOR v_assessment IN SELECT * FROM jsonb_array_elements(v_selected_assessments)
      LOOP
        v_assessment_type := lower(v_assessment->>'type');
        IF v_assessment_type IN ('reading-comprehension', 'aqa-reading', 'reading', 'aqa-listening', 'listening', 
                                   'aqa-dictation', 'dictation', 'aqa-writing', 'writing', 'four-skills', 'exam-style') THEN
          -- Normalize type names
          CASE v_assessment_type
            WHEN 'reading' THEN v_assessment_type := 'aqa-reading';
            WHEN 'listening' THEN v_assessment_type := 'aqa-listening';
            WHEN 'dictation' THEN v_assessment_type := 'aqa-dictation';
            WHEN 'writing' THEN v_assessment_type := 'aqa-writing';
            ELSE NULL;
          END CASE;
          
          IF v_assessment_type != ALL(v_types) THEN
            v_types := array_append(v_types, v_assessment_type);
          END IF;
        END IF;
      END LOOP;
    END IF;
  END IF;

  -- Check content_type
  IF lower(p_content_type) IN ('reading-comprehension', 'aqa-reading', 'aqa-listening', 'aqa-dictation', 
                                'aqa-writing', 'four-skills', 'exam-style') THEN
    IF lower(p_content_type) != ALL(v_types) THEN
      v_types := array_append(v_types, lower(p_content_type));
    END IF;
  END IF;

  -- Check game_type
  CASE lower(p_game_type)
    WHEN 'reading-comprehension' THEN
      IF 'reading-comprehension' != ALL(v_types) THEN
        v_types := array_append(v_types, 'reading-comprehension');
      END IF;
    WHEN 'aqa-reading' THEN
      IF 'aqa-reading' != ALL(v_types) THEN
        v_types := array_append(v_types, 'aqa-reading');
      END IF;
    WHEN 'aqa-listening' THEN
      IF 'aqa-listening' != ALL(v_types) THEN
        v_types := array_append(v_types, 'aqa-listening');
      END IF;
    WHEN 'aqa-dictation' THEN
      IF 'aqa-dictation' != ALL(v_types) THEN
        v_types := array_append(v_types, 'aqa-dictation');
      END IF;
    WHEN 'aqa-writing' THEN
      IF 'aqa-writing' != ALL(v_types) THEN
        v_types := array_append(v_types, 'aqa-writing');
      END IF;
    WHEN 'four-skills' THEN
      IF 'four-skills' != ALL(v_types) THEN
        v_types := array_append(v_types, 'four-skills');
      END IF;
    WHEN 'exam-style' THEN
      IF 'exam-style' != ALL(v_types) THEN
        v_types := array_append(v_types, 'exam-style');
      END IF;
    WHEN 'vocabulary', 'vocab', 'mixed-mode' THEN
      IF 'vocabulary-game' != ALL(v_types) THEN
        v_types := array_append(v_types, 'vocabulary-game');
      END IF;
    WHEN 'skills', 'grammar' THEN
      IF 'grammar-practice' != ALL(v_types) THEN
        v_types := array_append(v_types, 'grammar-practice');
      END IF;
    WHEN 'assessment' THEN
      -- Generic assessment, default to reading-comprehension if no types detected
      IF array_length(v_types, 1) IS NULL OR array_length(v_types, 1) = 0 THEN
        v_types := array_append(v_types, 'reading-comprehension');
      END IF;
    ELSE NULL;
  END CASE;

  -- Check for vocabulary/grammar in mixed-mode
  IF lower(p_game_type) = 'mixed-mode' THEN
    IF p_game_config ? 'skillsConfig' THEN
      IF 'grammar-practice' != ALL(v_types) THEN
        v_types := array_append(v_types, 'grammar-practice');
      END IF;
    END IF;
  END IF;

  -- Convert array to JSONB array
  RETURN to_jsonb(v_types);
END;
$$;

-- Create trigger to auto-populate assessment_types on insert/update
CREATE OR REPLACE FUNCTION auto_detect_assessment_types()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Only auto-detect if assessment_types is empty or null
  IF NEW.assessment_types IS NULL OR NEW.assessment_types = '[]'::jsonb THEN
    NEW.assessment_types := detect_assignment_assessment_types(
      NEW.game_type,
      NEW.type,
      COALESCE(NEW.game_config, '{}'::jsonb)
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to assignments table
DROP TRIGGER IF EXISTS trigger_auto_detect_assessment_types ON assignments;
CREATE TRIGGER trigger_auto_detect_assessment_types
  BEFORE INSERT OR UPDATE OF game_type, type, game_config
  ON assignments
  FOR EACH ROW
  EXECUTE FUNCTION auto_detect_assessment_types();

-- Backfill existing assignments (run this after applying migration)
-- UPDATE assignments 
-- SET assessment_types = detect_assignment_assessment_types(
--   game_type, 
--   type, 
--   COALESCE(game_config, '{}'::jsonb)
-- )
-- WHERE assessment_types = '[]'::jsonb OR assessment_types IS NULL;
