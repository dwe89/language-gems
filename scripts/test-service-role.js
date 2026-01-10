// Test service role client specifically
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

console.log('=== SERVICE ROLE CLIENT TEST ===\n');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('URL:', supabaseUrl);
console.log('Service Role Key Length:', serviceRoleKey?.length);
console.log('Service Role Key starts with:', serviceRoleKey?.substring(0, 20) + '...');

// Create client exactly like the app does
const supabase = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    db: {
      schema: 'public'
    },
    global: {
      headers: {
        'apikey': serviceRoleKey
      }
    }
  }
);

async function test() {
  console.log('\n1. Testing with configured client...');
  const { data: data1, error: error1 } = await supabase
    .from('reading_comprehension_results')
    .select('id, user_id, score')
    .eq('assignment_id', '401539e9-0860-441a-a0b7-d5b17a887bd2');
  
  console.log('Result 1:', { count: data1?.length, error: error1, data: data1 });

  // Now test with a simpler client setup
  console.log('\n2. Testing with simpler client (no extra headers)...');
  const supabase2 = createClient(supabaseUrl, serviceRoleKey);
  
  const { data: data2, error: error2 } = await supabase2
    .from('reading_comprehension_results')
    .select('id, user_id, score')
    .eq('assignment_id', '401539e9-0860-441a-a0b7-d5b17a887bd2');
  
  console.log('Result 2:', { count: data2?.length, error: error2, data: data2 });
}

test().catch(console.error);
