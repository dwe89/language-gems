-- Create a function to increment session statistics
-- This function safely increments session counters

CREATE OR REPLACE FUNCTION increment_session_stats(
  session_id UUID,
  was_correct BOOLEAN
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE vocabulary_mining_sessions
  SET 
    total_words_attempted = COALESCE(total_words_attempted, 0) + 1,
    total_words_correct = COALESCE(total_words_correct, 0) + CASE WHEN was_correct THEN 1 ELSE 0 END,
    updated_at = NOW()
  WHERE id = session_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_session_stats TO authenticated;
