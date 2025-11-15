-- Fix worksheet_generation_jobs RLS blocking service role updates
-- 
-- PROBLEM: RLS is enabled on worksheet_generation_jobs but no policies exist,
-- causing all INSERT/UPDATE operations to fail silently even with service role key
--
-- SOLUTION: Disable RLS since this is an internal system table used only by 
-- server-side code with service role key, not user-facing data

-- Disable RLS on worksheet_generation_jobs
ALTER TABLE public.worksheet_generation_jobs DISABLE ROW LEVEL SECURITY;

-- Add comment explaining why RLS is disabled
COMMENT ON TABLE public.worksheet_generation_jobs IS 
'Internal system table for tracking async worksheet generation jobs. RLS disabled because this table is only accessed by server-side code using service role key, never directly by users.';
