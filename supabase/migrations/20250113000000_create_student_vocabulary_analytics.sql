-- =====================================================
-- PHASE 2: UNIFIED VOCABULARY ANALYTICS TABLE
-- =====================================================
-- This migration creates the single source of truth for all vocabulary tracking
-- across VocabMaster, games, and assignments.
--
-- Purpose: Enable simple, fast teacher queries like:
-- - "How many times has Student X seen word Y?"
-- - "What words is Student X struggling with?"
-- - "What are Student X's strong/weak topics?"

-- =====================================================
-- 1. CREATE MAIN ANALYTICS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.student_vocabulary_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Core identifiers
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocabulary_id UUID NOT NULL, -- References centralized_vocabulary.id
  
  -- Simple counters (what teachers need)
  total_exposures INT NOT NULL DEFAULT 0,
  correct_count INT NOT NULL DEFAULT 0,
  incorrect_count INT NOT NULL DEFAULT 0,
  
  -- Timing tracking
  first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_correct TIMESTAMPTZ,
  last_incorrect TIMESTAMPTZ,
  
  -- Context tracking (where was this word encountered?)
  seen_in_vocab_master BOOLEAN NOT NULL DEFAULT FALSE,
  seen_in_games BOOLEAN NOT NULL DEFAULT FALSE,
  seen_in_assignments TEXT[] DEFAULT '{}', -- Array of assignment IDs
  
  -- Source breakdown (how many times in each context)
  vocab_master_exposures INT NOT NULL DEFAULT 0,
  games_exposures INT NOT NULL DEFAULT 0,
  assignments_exposures INT NOT NULL DEFAULT 0,
  
  -- Derived metrics (updated on each interaction)
  accuracy_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_exposures > 0 THEN (correct_count::DECIMAL / total_exposures::DECIMAL * 100)
      ELSE 0
    END
  ) STORED,
  
  -- Mastery classification
  mastery_level TEXT NOT NULL DEFAULT 'new' CHECK (
    mastery_level IN ('new', 'learning', 'practiced', 'mastered', 'struggling')
  ),
  
  -- Topic classification (denormalized from vocabulary table for fast queries)
  topic TEXT,
  subtopic TEXT,
  difficulty TEXT,
  curriculum_level TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one record per student-word pair
  UNIQUE(student_id, vocabulary_id)
);

-- =====================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Primary lookup indexes
CREATE INDEX idx_sva_student_id ON public.student_vocabulary_analytics(student_id);
CREATE INDEX idx_sva_vocabulary_id ON public.student_vocabulary_analytics(vocabulary_id);
CREATE INDEX idx_sva_student_vocab ON public.student_vocabulary_analytics(student_id, vocabulary_id);

-- Teacher query indexes
CREATE INDEX idx_sva_mastery_level ON public.student_vocabulary_analytics(mastery_level);
CREATE INDEX idx_sva_accuracy ON public.student_vocabulary_analytics(accuracy_percentage);
CREATE INDEX idx_sva_topic ON public.student_vocabulary_analytics(topic);
CREATE INDEX idx_sva_last_seen ON public.student_vocabulary_analytics(last_seen DESC);

-- Context filtering indexes
CREATE INDEX idx_sva_vocab_master ON public.student_vocabulary_analytics(student_id) 
  WHERE seen_in_vocab_master = TRUE;
CREATE INDEX idx_sva_games ON public.student_vocabulary_analytics(student_id) 
  WHERE seen_in_games = TRUE;

-- Composite indexes for common teacher queries
CREATE INDEX idx_sva_student_mastery ON public.student_vocabulary_analytics(student_id, mastery_level);
CREATE INDEX idx_sva_student_topic ON public.student_vocabulary_analytics(student_id, topic);

-- =====================================================
-- 3. CREATE UPDATE TRIGGER
-- =====================================================

CREATE OR REPLACE FUNCTION update_student_vocabulary_analytics_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_sva_timestamp
  BEFORE UPDATE ON public.student_vocabulary_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_student_vocabulary_analytics_timestamp();

-- =====================================================
-- 4. CREATE MASTERY LEVEL UPDATE FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION update_mastery_level()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-calculate mastery level based on accuracy and exposure
  NEW.mastery_level := CASE
    -- Struggling: Low accuracy with multiple exposures
    WHEN NEW.total_exposures >= 5 AND NEW.accuracy_percentage < 50 THEN 'struggling'
    
    -- Mastered: High accuracy with sufficient exposures
    WHEN NEW.total_exposures >= 5 AND NEW.accuracy_percentage >= 80 THEN 'mastered'
    
    -- Practiced: Moderate exposure, decent accuracy
    WHEN NEW.total_exposures >= 3 AND NEW.accuracy_percentage >= 60 THEN 'practiced'
    
    -- Learning: Some exposure, still building
    WHEN NEW.total_exposures >= 1 THEN 'learning'
    
    -- New: No exposures yet
    ELSE 'new'
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_mastery_level
  BEFORE INSERT OR UPDATE ON public.student_vocabulary_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_mastery_level();

-- =====================================================
-- 5. CREATE HELPER FUNCTION FOR RECORDING INTERACTIONS
-- =====================================================

CREATE OR REPLACE FUNCTION record_vocabulary_interaction(
  p_student_id UUID,
  p_vocabulary_id UUID,
  p_was_correct BOOLEAN,
  p_source TEXT, -- 'vocab_master', 'game', or assignment_id
  p_topic TEXT DEFAULT NULL,
  p_subtopic TEXT DEFAULT NULL,
  p_difficulty TEXT DEFAULT NULL,
  p_curriculum_level TEXT DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_is_assignment BOOLEAN;
  v_assignment_id TEXT;
BEGIN
  -- Determine if source is an assignment (UUID format)
  v_is_assignment := p_source ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';
  
  IF v_is_assignment THEN
    v_assignment_id := p_source;
  END IF;

  -- Insert or update the analytics record
  INSERT INTO public.student_vocabulary_analytics (
    student_id,
    vocabulary_id,
    total_exposures,
    correct_count,
    incorrect_count,
    first_seen,
    last_seen,
    last_correct,
    last_incorrect,
    seen_in_vocab_master,
    seen_in_games,
    seen_in_assignments,
    vocab_master_exposures,
    games_exposures,
    assignments_exposures,
    topic,
    subtopic,
    difficulty,
    curriculum_level
  ) VALUES (
    p_student_id,
    p_vocabulary_id,
    1,
    CASE WHEN p_was_correct THEN 1 ELSE 0 END,
    CASE WHEN p_was_correct THEN 0 ELSE 1 END,
    NOW(),
    NOW(),
    CASE WHEN p_was_correct THEN NOW() ELSE NULL END,
    CASE WHEN NOT p_was_correct THEN NOW() ELSE NULL END,
    p_source = 'vocab_master',
    p_source = 'game',
    CASE WHEN v_is_assignment THEN ARRAY[v_assignment_id] ELSE '{}' END,
    CASE WHEN p_source = 'vocab_master' THEN 1 ELSE 0 END,
    CASE WHEN p_source = 'game' THEN 1 ELSE 0 END,
    CASE WHEN v_is_assignment THEN 1 ELSE 0 END,
    p_topic,
    p_subtopic,
    p_difficulty,
    p_curriculum_level
  )
  ON CONFLICT (student_id, vocabulary_id) DO UPDATE SET
    total_exposures = student_vocabulary_analytics.total_exposures + 1,
    correct_count = student_vocabulary_analytics.correct_count + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
    incorrect_count = student_vocabulary_analytics.incorrect_count + CASE WHEN p_was_correct THEN 0 ELSE 1 END,
    last_seen = NOW(),
    last_correct = CASE WHEN p_was_correct THEN NOW() ELSE student_vocabulary_analytics.last_correct END,
    last_incorrect = CASE WHEN NOT p_was_correct THEN NOW() ELSE student_vocabulary_analytics.last_incorrect END,
    seen_in_vocab_master = student_vocabulary_analytics.seen_in_vocab_master OR (p_source = 'vocab_master'),
    seen_in_games = student_vocabulary_analytics.seen_in_games OR (p_source = 'game'),
    seen_in_assignments = CASE 
      WHEN v_is_assignment AND NOT (v_assignment_id = ANY(student_vocabulary_analytics.seen_in_assignments))
      THEN array_append(student_vocabulary_analytics.seen_in_assignments, v_assignment_id)
      ELSE student_vocabulary_analytics.seen_in_assignments
    END,
    vocab_master_exposures = student_vocabulary_analytics.vocab_master_exposures + CASE WHEN p_source = 'vocab_master' THEN 1 ELSE 0 END,
    games_exposures = student_vocabulary_analytics.games_exposures + CASE WHEN p_source = 'game' THEN 1 ELSE 0 END,
    assignments_exposures = student_vocabulary_analytics.assignments_exposures + CASE WHEN v_is_assignment THEN 1 ELSE 0 END,
    topic = COALESCE(p_topic, student_vocabulary_analytics.topic),
    subtopic = COALESCE(p_subtopic, student_vocabulary_analytics.subtopic),
    difficulty = COALESCE(p_difficulty, student_vocabulary_analytics.difficulty),
    curriculum_level = COALESCE(p_curriculum_level, student_vocabulary_analytics.curriculum_level);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.student_vocabulary_analytics ENABLE ROW LEVEL SECURITY;

-- Students can view their own analytics
CREATE POLICY "Students can view own vocabulary analytics"
  ON public.student_vocabulary_analytics
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Teachers can view analytics for their students
CREATE POLICY "Teachers can view student vocabulary analytics"
  ON public.student_vocabulary_analytics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.class_enrollments ce
      JOIN public.classes c ON ce.class_id = c.id
      WHERE ce.student_id = student_vocabulary_analytics.student_id
        AND c.teacher_id = auth.uid()
    )
  );

-- System can insert/update analytics (for background processes)
CREATE POLICY "System can manage vocabulary analytics"
  ON public.student_vocabulary_analytics
  FOR ALL
  TO authenticated
  USING (TRUE)
  WITH CHECK (TRUE);

-- =====================================================
-- 7. CREATE TEACHER-FRIENDLY VIEWS
-- =====================================================

-- View 1: Student Word Mastery (for teacher drill-down)
CREATE OR REPLACE VIEW teacher_student_word_mastery AS
SELECT 
  sva.student_id,
  up.display_name as student_name,
  cv.word,
  cv.translation,
  cv.language,
  sva.topic,
  sva.subtopic,
  sva.total_exposures,
  sva.correct_count,
  sva.incorrect_count,
  sva.accuracy_percentage,
  sva.mastery_level,
  sva.last_seen,
  sva.seen_in_vocab_master,
  sva.seen_in_games,
  array_length(sva.seen_in_assignments, 1) as assignment_count
FROM public.student_vocabulary_analytics sva
JOIN public.centralized_vocabulary cv ON sva.vocabulary_id = cv.id
JOIN public.user_profiles up ON sva.student_id = up.user_id
ORDER BY sva.student_id, sva.accuracy_percentage ASC;

-- View 2: Topic Strength Analysis (for identifying weak areas)
CREATE OR REPLACE VIEW teacher_topic_analysis AS
SELECT 
  student_id,
  topic,
  COUNT(*) as words_in_topic,
  ROUND(AVG(accuracy_percentage), 2) as topic_accuracy,
  SUM(CASE WHEN mastery_level = 'mastered' THEN 1 ELSE 0 END) as mastered_words,
  SUM(CASE WHEN mastery_level = 'struggling' THEN 1 ELSE 0 END) as struggling_words,
  SUM(total_exposures) as total_topic_exposures
FROM public.student_vocabulary_analytics
WHERE topic IS NOT NULL
GROUP BY student_id, topic
ORDER BY student_id, topic_accuracy ASC;

-- =====================================================
-- 8. ADD COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.student_vocabulary_analytics IS 
'PHASE 2: Single source of truth for all vocabulary tracking. Updated by VocabMaster, games, and assignments.';

COMMENT ON COLUMN public.student_vocabulary_analytics.total_exposures IS 
'Total times student has encountered this word across all contexts';

COMMENT ON COLUMN public.student_vocabulary_analytics.mastery_level IS 
'Auto-calculated: new (0 exposures), learning (1-2), practiced (3-4, 60%+), mastered (5+, 80%+), struggling (5+, <50%)';

COMMENT ON FUNCTION record_vocabulary_interaction IS 
'Call this function from VocabMaster, games, and assignments to update analytics. Source: "vocab_master", "game", or assignment UUID';

