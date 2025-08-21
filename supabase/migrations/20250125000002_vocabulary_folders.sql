-- ============================================================================
-- VOCABULARY FOLDERS SYSTEM
-- ============================================================================
-- This migration adds folder organization support to the enhanced vocabulary system
-- Created: 2025-01-25

-- Create vocabulary folders table
CREATE TABLE IF NOT EXISTS vocabulary_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    parent_folder_id UUID REFERENCES vocabulary_folders(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    
    -- Ensure unique folder names per teacher at the same level
    UNIQUE(teacher_id, parent_folder_id, name)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vocabulary_folders_teacher_id ON vocabulary_folders(teacher_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_folders_parent_id ON vocabulary_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_vocabulary_folders_name ON vocabulary_folders(name);

-- Add folder_id to enhanced_vocabulary_lists table
ALTER TABLE enhanced_vocabulary_lists 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES vocabulary_folders(id) ON DELETE SET NULL;

-- Create index for folder_id
CREATE INDEX IF NOT EXISTS idx_enhanced_vocab_lists_folder_id ON enhanced_vocabulary_lists(folder_id);

-- ============================================================================
-- TRIGGERS AND FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp for folders
CREATE OR REPLACE FUNCTION update_vocabulary_folder_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vocabulary folders updated_at
DROP TRIGGER IF EXISTS trigger_vocabulary_folders_updated_at ON vocabulary_folders;
CREATE TRIGGER trigger_vocabulary_folders_updated_at
    BEFORE UPDATE ON vocabulary_folders
    FOR EACH ROW EXECUTE FUNCTION update_vocabulary_folder_updated_at();

-- Function to prevent circular folder references
CREATE OR REPLACE FUNCTION check_folder_hierarchy()
RETURNS TRIGGER AS $$
DECLARE
    current_folder_id UUID;
    max_depth INTEGER := 10; -- Prevent infinite loops
    depth INTEGER := 0;
BEGIN
    -- Only check if parent_folder_id is being set
    IF NEW.parent_folder_id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Check if trying to set self as parent
    IF NEW.id = NEW.parent_folder_id THEN
        RAISE EXCEPTION 'A folder cannot be its own parent';
    END IF;
    
    -- Check for circular references by traversing up the hierarchy
    current_folder_id := NEW.parent_folder_id;
    
    WHILE current_folder_id IS NOT NULL AND depth < max_depth LOOP
        -- If we find our own ID in the parent chain, it's circular
        IF current_folder_id = NEW.id THEN
            RAISE EXCEPTION 'Circular folder reference detected';
        END IF;
        
        -- Get the parent of the current folder
        SELECT parent_folder_id INTO current_folder_id
        FROM vocabulary_folders
        WHERE id = current_folder_id;
        
        depth := depth + 1;
    END LOOP;
    
    -- Check if we hit max depth (potential infinite loop)
    IF depth >= max_depth THEN
        RAISE EXCEPTION 'Folder hierarchy too deep (max % levels)', max_depth;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check folder hierarchy
DROP TRIGGER IF EXISTS trigger_check_folder_hierarchy ON vocabulary_folders;
CREATE TRIGGER trigger_check_folder_hierarchy
    BEFORE INSERT OR UPDATE ON vocabulary_folders
    FOR EACH ROW EXECUTE FUNCTION check_folder_hierarchy();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on vocabulary_folders table
ALTER TABLE vocabulary_folders ENABLE ROW LEVEL SECURITY;

-- Policies for vocabulary_folders
CREATE POLICY "Teachers can view their own folders" ON vocabulary_folders
    FOR SELECT USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can create their own folders" ON vocabulary_folders
    FOR INSERT WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update their own folders" ON vocabulary_folders
    FOR UPDATE USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own folders" ON vocabulary_folders
    FOR DELETE USING (teacher_id = auth.uid());

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get folder path (breadcrumb)
CREATE OR REPLACE FUNCTION get_folder_path(folder_id UUID)
RETURNS TEXT AS $$
DECLARE
    path TEXT := '';
    current_folder RECORD;
    current_id UUID := folder_id;
    max_depth INTEGER := 10;
    depth INTEGER := 0;
BEGIN
    WHILE current_id IS NOT NULL AND depth < max_depth LOOP
        SELECT id, name, parent_folder_id INTO current_folder
        FROM vocabulary_folders
        WHERE id = current_id;
        
        IF NOT FOUND THEN
            EXIT;
        END IF;
        
        IF path = '' THEN
            path := current_folder.name;
        ELSE
            path := current_folder.name || ' / ' || path;
        END IF;
        
        current_id := current_folder.parent_folder_id;
        depth := depth + 1;
    END LOOP;
    
    RETURN path;
END;
$$ LANGUAGE plpgsql;

-- Function to get all subfolders (recursive)
CREATE OR REPLACE FUNCTION get_subfolder_ids(parent_folder_id UUID)
RETURNS UUID[] AS $$
DECLARE
    result UUID[] := ARRAY[]::UUID[];
    child_folder RECORD;
BEGIN
    -- Add direct children
    FOR child_folder IN 
        SELECT id FROM vocabulary_folders WHERE parent_folder_id = parent_folder_id
    LOOP
        result := array_append(result, child_folder.id);
        -- Recursively add grandchildren
        result := array_cat(result, get_subfolder_ids(child_folder.id));
    END LOOP;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to count vocabulary lists in folder (including subfolders)
CREATE OR REPLACE FUNCTION count_lists_in_folder(folder_id UUID, include_subfolders BOOLEAN DEFAULT false)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER := 0;
    folder_ids UUID[];
BEGIN
    IF include_subfolders THEN
        folder_ids := array_append(get_subfolder_ids(folder_id), folder_id);
    ELSE
        folder_ids := ARRAY[folder_id];
    END IF;
    
    SELECT COUNT(*) INTO count
    FROM enhanced_vocabulary_lists
    WHERE folder_id = ANY(folder_ids);
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert some default folders for testing (commented out for production)
/*
INSERT INTO vocabulary_folders (name, description, teacher_id) VALUES
('Spanish Vocabulary', 'All Spanish vocabulary lists', '00000000-0000-0000-0000-000000000000'),
('French Vocabulary', 'All French vocabulary lists', '00000000-0000-0000-0000-000000000000'),
('Beginner Level', 'Vocabulary for beginners', '00000000-0000-0000-0000-000000000000'),
('Advanced Level', 'Advanced vocabulary lists', '00000000-0000-0000-0000-000000000000');
*/

-- Add comment to track migration
COMMENT ON TABLE vocabulary_folders IS 'Folder organization system for enhanced vocabulary lists. Supports hierarchical folder structure with circular reference protection. Created: 2025-01-25';

-- Add comments to key functions
COMMENT ON FUNCTION get_folder_path(UUID) IS 'Returns the full path of a folder as a breadcrumb string (e.g., "Spanish / Beginner / Food")';
COMMENT ON FUNCTION get_subfolder_ids(UUID) IS 'Returns array of all subfolder IDs recursively for a given parent folder';
COMMENT ON FUNCTION count_lists_in_folder(UUID, BOOLEAN) IS 'Counts vocabulary lists in a folder, optionally including subfolders';
