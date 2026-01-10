// Test the TeacherAssignmentAnalyticsService directly
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const assignmentId = '401539e9-0860-441a-a0b7-d5b17a887bd2';

async function testFetchReadingComprehensionResults() {
  console.log('=== TEST fetchReadingComprehensionResults ===\n');
  
  console.log('1. Direct query to reading_comprehension_results...');
  const { data, error } = await supabase
    .from('reading_comprehension_results')
    .select('id, user_id, assignment_id, text_id, total_questions, correct_answers, score, time_spent, passed, completed_at')
    .eq('assignment_id', assignmentId);
  
  console.log('Query error:', error);
  console.log('Query data count:', data?.length || 0);
  
  if (data && data.length > 0) {
    console.log('First result:', JSON.stringify(data[0], null, 2));
    
    // Map it like the code does
    const mapped = data.map(result => ({
      resultId: result.id,
      studentId: result.user_id,
      assessmentType: 'reading-comprehension',
      status: result.completed_at ? 'completed' : 'in_progress',
      scorePercentage: result.score,
      rawScore: result.correct_answers,
      maxScore: result.total_questions,
      timeSpentSeconds: result.time_spent,
      completedAt: result.completed_at
    }));
    
    console.log('\nMapped result:', JSON.stringify(mapped[0], null, 2));
    console.log('Status:', mapped[0].status);
    console.log('Score:', mapped[0].scorePercentage);
  }
  
  console.log('\n=== DONE ===');
}

testFetchReadingComprehensionResults().catch(console.error);
