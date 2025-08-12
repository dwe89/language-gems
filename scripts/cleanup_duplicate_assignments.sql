-- ============================================================================
-- CLEANUP DUPLICATE ASSIGNMENTS
-- ============================================================================
-- This script removes duplicate assignments that were created due to the
-- race condition bug in the assignment creation system.

-- First, let's see what duplicates we have
SELECT 
    title,
    class_id,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as assignment_ids,
    MIN(created_at) as first_created,
    MAX(created_at) as last_created
FROM assignments 
GROUP BY title, class_id 
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- ============================================================================
-- SAFE CLEANUP: Keep the oldest assignment, remove newer duplicates
-- ============================================================================

-- Create a temporary table to identify which assignments to keep
CREATE TEMP TABLE assignments_to_keep AS
SELECT DISTINCT ON (title, class_id)
    id,
    title,
    class_id,
    created_at
FROM assignments
ORDER BY title, class_id, created_at ASC; -- Keep the oldest one

-- Show what we're about to delete
SELECT 
    a.id,
    a.title,
    a.class_id,
    a.created_at,
    'WILL BE DELETED' as action
FROM assignments a
WHERE a.id NOT IN (SELECT id FROM assignments_to_keep)
ORDER BY a.title, a.class_id, a.created_at;

-- ============================================================================
-- CLEANUP RELATED DATA FIRST (to avoid foreign key constraints)
-- ============================================================================

-- Clean up assignment analytics for duplicate assignments
DELETE FROM assignment_analytics 
WHERE assignment_id NOT IN (SELECT id FROM assignments_to_keep);

-- Clean up enhanced assignment progress for duplicate assignments
DELETE FROM enhanced_assignment_progress 
WHERE assignment_id NOT IN (SELECT id FROM assignments_to_keep);

-- Clean up any other related tables
DELETE FROM vocabulary_assignment_lists 
WHERE assignment_id NOT IN (SELECT id FROM assignments_to_keep);

DELETE FROM vocabulary_assignment_items 
WHERE assignment_list_id IN (
    SELECT id FROM vocabulary_assignment_lists 
    WHERE assignment_id NOT IN (SELECT id FROM assignments_to_keep)
);

-- ============================================================================
-- DELETE DUPLICATE ASSIGNMENTS
-- ============================================================================

-- Delete the duplicate assignments (keep only the oldest one per title/class)
DELETE FROM assignments 
WHERE id NOT IN (SELECT id FROM assignments_to_keep);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify no duplicates remain
SELECT 
    title,
    class_id,
    COUNT(*) as count_after_cleanup
FROM assignments 
GROUP BY title, class_id 
HAVING COUNT(*) > 1;

-- Show final assignment count
SELECT 
    'Total assignments after cleanup' as description,
    COUNT(*) as count
FROM assignments;

-- Show what assignments remain
SELECT 
    id,
    title,
    class_id,
    created_at,
    'KEPT' as status
FROM assignments
ORDER BY created_at DESC;

-- Clean up temp table
DROP TABLE assignments_to_keep;

-- Add comment
COMMENT ON TABLE assignments IS 'Assignments table - duplicates cleaned up on 2025-08-11';
