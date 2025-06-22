-- Create function to track vocabulary practice from the old vocabulary table
-- This function handles tracking student progress for vocabulary from the legacy table

CREATE OR REPLACE FUNCTION track_vocabulary_practice(
  p_student_id UUID,
  p_session_id TEXT, -- Changed from UUID to TEXT to handle string IDs
  p_vocabulary_id INTEGER,
  p_spanish_term TEXT,
  p_english_translation TEXT,
  p_was_correct BOOLEAN,
  p_response_time INTEGER DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_practice_record student_vocabulary_practice%ROWTYPE;
  v_new_streak INTEGER;
  v_new_mastery INTEGER;
BEGIN
  -- Get or create practice record
  SELECT * INTO v_practice_record
  FROM student_vocabulary_practice
  WHERE student_id = p_student_id AND vocabulary_id = p_vocabulary_id;
  
  IF NOT FOUND THEN
    -- Create new practice record
    INSERT INTO student_vocabulary_practice (
      student_id,
      vocabulary_id,
      spanish_term,
      english_translation,
      total_attempts,
      correct_attempts,
      mastery_level,
      current_streak,
      best_streak,
      average_response_time,
      total_time_spent,
      first_practiced_at,
      last_practiced_at,
      last_session_id
    ) VALUES (
      p_student_id,
      p_vocabulary_id,
      p_spanish_term,
      p_english_translation,
      1,
      CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      COALESCE(p_response_time, 0),
      COALESCE(p_response_time, 0),
      NOW(),
      NOW(),
      p_session_id
    );
  ELSE
    -- Update existing record
    IF p_was_correct THEN
      v_new_streak := v_practice_record.current_streak + 1;
    ELSE
      v_new_streak := 0;
    END IF;
    
    -- Simple mastery calculation: correct attempts / total attempts * 5, capped at 5
    v_new_mastery := LEAST(
      FLOOR((v_practice_record.correct_attempts + CASE WHEN p_was_correct THEN 1 ELSE 0 END) * 5.0 / (v_practice_record.total_attempts + 1)), 
      5
    );
    
    UPDATE student_vocabulary_practice
    SET 
      total_attempts = total_attempts + 1,
      correct_attempts = correct_attempts + CASE WHEN p_was_correct THEN 1 ELSE 0 END,
      mastery_level = v_new_mastery,
      current_streak = v_new_streak,
      best_streak = GREATEST(best_streak, v_new_streak),
      average_response_time = CASE 
        WHEN p_response_time IS NOT NULL THEN
          ((average_response_time * total_attempts) + p_response_time) / (total_attempts + 1)
        ELSE average_response_time
      END,
      total_time_spent = total_time_spent + COALESCE(p_response_time, 0),
      last_practiced_at = NOW(),
      last_session_id = p_session_id,
      updated_at = NOW()
    WHERE student_id = p_student_id AND vocabulary_id = p_vocabulary_id;
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION track_vocabulary_practice TO authenticated;
