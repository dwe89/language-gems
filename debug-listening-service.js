// Quick debug script to test the listening service
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testService() {
  console.log('Testing listening assessment service...');
  
  try {
    // Test direct query
    const { data, error } = await supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('level', 'foundation')
      .eq('language', 'es')
      .eq('is_active', true)
      .order('identifier');

    console.log('Direct query result:');
    console.log('Error:', error);
    console.log('Data count:', data?.length);
    console.log('Data:', data);

    if (data && data.length > 0) {
      // Test questions query
      const { data: questions, error: qError } = await supabase
        .from('aqa_listening_questions')
        .select('*')
        .eq('assessment_id', data[0].id)
        .order('question_number');

      console.log('\nQuestions query result:');
      console.log('Error:', qError);
      console.log('Questions count:', questions?.length);
      console.log('First question:', questions?.[0]);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testService();
