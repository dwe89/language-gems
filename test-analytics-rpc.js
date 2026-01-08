const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing RPC call with service role key...');
console.log('URL:', supabaseUrl);
console.log('Key length:', serviceKey?.length);

const supabase = createClient(supabaseUrl, serviceKey);

async function testRPC() {
  const assignmentId = '76eb48cd-df71-4aa2-9aa7-684d4f5e8147';
  
  console.log('\n📞 Calling RPC function...');
  const { data, error } = await supabase.rpc('get_assignment_analytics_sessions', {
    p_assignment_id: assignmentId
  });
  
  console.log('\n✅ RPC Result:');
  console.log('Error:', error);
  console.log('Data count:', data?.length);
  console.log('First 3 sessions:', JSON.stringify(data?.slice(0, 3), null, 2));
}

testRPC().catch(console.error);
