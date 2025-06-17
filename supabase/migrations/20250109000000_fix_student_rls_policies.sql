-- Fix RLS policies for student access to assignments and classes
-- This migration fixes the broken RLS policies that referenced non-existent student_classes table

-- Fix assignments table RLS policy
-- Drop the broken policy that references student_classes
DROP POLICY IF EXISTS "Students can view assignments for their classes" ON public.assignments;

-- Create correct policy using class_enrollments
CREATE POLICY "Students can view assignments for their enrolled classes" 
  ON public.assignments
  FOR SELECT
  TO authenticated
  USING (
    class_id IN (
      SELECT class_id 
      FROM public.class_enrollments 
      WHERE student_id = auth.uid() 
      AND status = 'active'
    )
  );

-- Fix classes table RLS policy  
-- Drop any existing broken policies
DROP POLICY IF EXISTS "Students can view their classes" ON public.classes;

-- Create correct policy using class_enrollments
CREATE POLICY "Students can view their enrolled classes"
  ON public.classes
  FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT class_id 
      FROM public.class_enrollments 
      WHERE student_id = auth.uid() 
      AND status = 'active'
    )
  );

-- Ensure class_enrollments table has proper RLS policies
ALTER TABLE public.class_enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Students can view their own class enrollments"
  ON public.class_enrollments
  FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

-- Teachers can view enrollments for their classes
CREATE POLICY "Teachers can view class enrollments for their classes"
  ON public.class_enrollments
  FOR SELECT
  TO authenticated
  USING (
    class_id IN (
      SELECT id FROM public.classes WHERE teacher_id = auth.uid()
    )
  );

-- Enable RLS on classes table if not already enabled
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Teachers can manage their own classes
CREATE POLICY "Teachers can manage their own classes"
  ON public.classes
  FOR ALL
  TO authenticated
  USING (teacher_id = auth.uid());
