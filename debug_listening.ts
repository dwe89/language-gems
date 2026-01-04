import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
async function check() {
  const { data, error } = await supabase.from('aqa_listening_assessments').select('*');
  console.log('Count:', data?.length);
  if (data) {
     data.forEach(d => console.log('Found:', d.language, d.level, d.is_active));
  } else {
     console.log('Error or no data:', error);
  }
}
check();
