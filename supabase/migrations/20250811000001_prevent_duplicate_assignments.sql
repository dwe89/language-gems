-- ============================================================================
-- PREVENT DUPLICATE ASSIGNMENTS
-- ============================================================================
-- This migration adds constraints to prevent duplicate assignment creation
-- and fixes the race condition issue in assignment creation.

-- Add a unique constraint to prevent duplicate assignments with same title in same class
-- Note: This allows same title in different classes, but prevents exact duplicates
ALTER TABLE assignments 
ADD CONSTRAINT unique_assignment_per_class_title 
UNIQUE (title, class_id, created_by);

-- Add an index to improve performance on assignment lookups
CREATE INDEX IF NOT EXISTS idx_assignments_class_title_teacher 
ON assignments(class_id, title, created_by);

-- Add an index for assignment creation timestamp to help with duplicate detection
CREATE INDEX IF NOT EXISTS idx_assignments_created_at 
ON assignments(created_at);

-- Add a comment explaining the constraint
COMMENT ON CONSTRAINT unique_assignment_per_class_title ON assignments IS 
'Prevents duplicate assignments with same title in same class by same teacher - added 2025-08-11 to fix race condition bug';

-- ============================================================================
-- FUNCTION TO SAFELY CREATE ASSIGNMENTS (PREVENTS DUPLICATES)
-- ============================================================================

-- Create a function that safely creates assignments with duplicate prevention
CREATE OR REPLACE FUNCTION create_assignment_safe(
    p_title TEXT,
    p_description TEXT,
    p_game_type TEXT,
    p_class_id UUID,
    p_created_by UUID,
    p_due_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_game_config JSONB DEFAULT '{}',
    p_vocabulary_criteria JSONB DEFAULT '{}',
    p_vocabulary_count INTEGER DEFAULT 10,
    p_max_attempts INTEGER DEFAULT 3,
    p_time_limit INTEGER DEFAULT 15,
    p_status TEXT DEFAULT 'active'
) RETURNS UUID AS $$
DECLARE
    assignment_id UUID;
    existing_assignment_id UUID;
BEGIN
    -- Check if assignment already exists (within last 5 minutes to catch race conditions)
    SELECT id INTO existing_assignment_id
    FROM assignments
    WHERE title = p_title 
      AND class_id = p_class_id 
      AND created_by = p_created_by
      AND created_at > NOW() - INTERVAL '5 minutes'
    LIMIT 1;
    
    -- If assignment already exists, return existing ID
    IF existing_assignment_id IS NOT NULL THEN
        RAISE NOTICE 'Assignment already exists, returning existing ID: %', existing_assignment_id;
        RETURN existing_assignment_id;
    END IF;
    
    -- Create new assignment
    INSERT INTO assignments (
        title,
        description,
        game_type,
        class_id,
        created_by,
        due_date,
        game_config,
        vocabulary_criteria,
        vocabulary_count,
        max_attempts,
        time_limit,
        status
    ) VALUES (
        p_title,
        p_description,
        p_game_type,
        p_class_id,
        p_created_by,
        p_due_date,
        p_game_config,
        p_vocabulary_criteria,
        p_vocabulary_count,
        p_max_attempts,
        p_time_limit,
        p_status
    ) RETURNING id INTO assignment_id;
    
    RAISE NOTICE 'Created new assignment with ID: %', assignment_id;
    RETURN assignment_id;
    
EXCEPTION
    WHEN unique_violation THEN
        -- If unique constraint is violated, try to return existing assignment
        SELECT id INTO existing_assignment_id
        FROM assignments
        WHERE title = p_title 
          AND class_id = p_class_id 
          AND created_by = p_created_by
        LIMIT 1;
        
        IF existing_assignment_id IS NOT NULL THEN
            RAISE NOTICE 'Duplicate assignment detected, returning existing ID: %', existing_assignment_id;
            RETURN existing_assignment_id;
        ELSE
            RAISE EXCEPTION 'Failed to create assignment due to unique constraint violation';
        END IF;
END;
$$ LANGUAGE plpgsql;

-- Add comment on the function
COMMENT ON FUNCTION create_assignment_safe IS 
'Safely creates assignments with duplicate prevention and race condition handling - added 2025-08-11';

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant execute permission to authenticated users (teachers)
GRANT EXECUTE ON FUNCTION create_assignment_safe TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify the constraint was added
SELECT 
    conname as constraint_name,
    contype as constraint_type,
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'unique_assignment_per_class_title';

-- Verify the indexes were created
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'assignments' 
  AND (indexname LIKE '%class_title_teacher%' OR indexname LIKE '%created_at%');
