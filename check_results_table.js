const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function check() {
  const assignmentId = '3007bf0a-5930-4be3-9ed8-1ad23f3b2ec4';
  
  const { data: results, error } = await supabase
    .from('reading_comprehension_results')
    .select('*')
    .eq('assignment_id', assignmentId);
  
  console.log('Error:', error);
  console.log('Results count:', results?.length);
  console.log('Results:', JSON.stringify(results, null, 2));
}

check().catch(console.error);
