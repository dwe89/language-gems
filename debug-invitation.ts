import { createServerClient } from '@supabase/ssr';

const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    cookies: {
      get() { return undefined; },
      set() {},
      remove() {}
    }
  }
);

async function checkUsers() {
  // Check danieletienne89@gmail.com
  const { data: daniel } = await supabase
    .from('profiles')
    .select('*, school_members(*)')
    .eq('email', 'danieletienne89@gmail.com')
    .single();
  
  console.log('=== Daniel profile ===');
  console.log(JSON.stringify(daniel, null, 2));
  
  // Check dancox89@gmail.com
  const { data: dan } = await supabase
    .from('profiles')
    .select('*, school_members(*)')
    .eq('email', 'dancox89@gmail.com')
    .single();
  
  console.log('\n=== Dan profile ===');
  console.log(JSON.stringify(dan, null, 2));
  
  // Check invitations
  if (daniel?.school_id) {
    const { data: invitations } = await supabase
      .from('school_invitations')
      .select('*')
      .eq('school_id', daniel.school_id);
    
    console.log('\n=== School invitations ===');
    console.log(JSON.stringify(invitations, null, 2));
  }
}

checkUsers().catch(console.error);
