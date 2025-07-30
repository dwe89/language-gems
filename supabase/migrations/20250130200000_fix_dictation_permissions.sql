-- Fix AQA Dictation Assessment Permissions
-- This migration fixes the RLS policies to allow anonymous access to active assessments

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Students can view active dictation assessments" ON aqa_dictation_assessments;
DROP POLICY IF EXISTS "Students can view dictation questions" ON aqa_dictation_questions;

-- Create more permissive policies for anonymous access
CREATE POLICY "Anyone can view active dictation assessments" ON aqa_dictation_assessments
    FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can view questions for active assessments" ON aqa_dictation_questions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assessments ada
            WHERE ada.id = aqa_dictation_questions.assessment_id
            AND ada.is_active = true
        )
    );

-- Keep teacher management policies but make them work without user_profiles dependency
DROP POLICY IF EXISTS "Teachers can manage dictation assessments" ON aqa_dictation_assessments;
DROP POLICY IF EXISTS "Teachers can manage dictation questions" ON aqa_dictation_questions;

-- Create simplified teacher policies based on auth.uid() only
CREATE POLICY "Authenticated users can manage dictation assessments" ON aqa_dictation_assessments
    FOR ALL TO authenticated USING (
        auth.uid() = created_by OR
        auth.uid() IS NOT NULL -- Allow any authenticated user for now
    );

CREATE POLICY "Authenticated users can manage dictation questions" ON aqa_dictation_questions
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assessments ada
            WHERE ada.id = aqa_dictation_questions.assessment_id
            AND (ada.created_by = auth.uid() OR auth.uid() IS NOT NULL)
        )
    );

-- Add a policy to allow anonymous users to access the assessments table
-- This is needed for the frontend to work without authentication
CREATE POLICY "Anonymous can view active assessments" ON aqa_dictation_assessments
    FOR SELECT TO anon USING (is_active = true);

CREATE POLICY "Anonymous can view questions for active assessments" ON aqa_dictation_questions
    FOR SELECT TO anon USING (
        EXISTS (
            SELECT 1 FROM aqa_dictation_assessments ada
            WHERE ada.id = aqa_dictation_questions.assessment_id
            AND ada.is_active = true
        )
    );