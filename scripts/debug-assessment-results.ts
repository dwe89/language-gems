
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAssessmentResults() {
  const assignmentId = '3e6dc385-7eb3-47de-99c7-3d9a9ccb3fea';
  console.log(`Debugging assignment: ${assignmentId}`);

  // 1. Get the assignment to find the student (if possible) or just list all results for this assignment
  const { data: assignment, error: assignError } = await supabase
    .from('assignments')
    .select('*')
    .eq('id', assignmentId)
    .single();

  if (assignError) {
    console.error('Error fetching assignment:', assignError);
    return;
  }

  console.log('Assignment found:', assignment.title);
  // Assuming we can find the student from the assignment if it's assigned to a specific student or class
  // But for now let's just look for ANY results for this assignment_id in aqa_reading_results
  
  const { data: results, error: resError } = await supabase
    .from('aqa_reading_results')
    .select('*')
    .eq('assignment_id', assignmentId);

  if (resError) {
    console.error('Error fetching results:', resError);
    return;
  }

  console.log(`Found ${results.length} results for this assignment.`);
  results.forEach(r => {
    console.log(`- Result ID: ${r.id}`);
    console.log(`  Student ID: ${r.student_id}`);
    console.log(`  Assessment ID: ${r.assessment_id}`);
    console.log(`  Attempt Number: ${r.attempt_number}`);
    console.log(`  Status: ${r.status}`);
    console.log(`  Created At: ${r.created_at}`);
  });

  // Also check if there are results for the student/assessment WITHOUT assignment_id (if that's possible)
  if (results.length > 0) {
    const studentId = results[0].student_id;
    const assessmentId = results[0].assessment_id;
    
    console.log(`\nChecking all results for Student ${studentId} and Assessment ${assessmentId}...`);
    const { data: allResults, error: allResError } = await supabase
      .from('aqa_reading_results')
      .select('*')
      .eq('student_id', studentId)
      .eq('assessment_id', assessmentId);
      
    if (allResError) {
        console.error('Error fetching all results:', allResError);
    } else {
        allResults.forEach(r => {
            console.log(`- Attempt ${r.attempt_number} (Assignment: ${r.assignment_id}) - ${r.status}`);
        });
    }
  }
}

debugAssessmentResults()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script error:', error);
    process.exit(1);
  });
