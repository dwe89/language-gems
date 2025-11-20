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

async function debugAssignment() {
  const assignmentId = '89beccc8-2dbb-417b-b7bc-8f830c12a419';
  console.log(`Looking up assignment ${assignmentId}`);
  const { data: assignment, error } = await supabase
    .from('assignments')
    .select('id, title, game_config')
    .eq('id', assignmentId)
    .single();

  if (error) {
    console.error('Error fetching assignment:', error);
    return;
  }

  console.log('Assignment: ', assignment.title);
  console.log('Game config: ', JSON.stringify(assignment.game_config, null, 2));

  const selected = (assignment.game_config?.assessmentConfig?.selectedAssessments) || [];
  console.log(`Selected assessments: ${selected.length}`);
  selected.forEach((s: any, idx: number) => {
    console.log(`${idx + 1}. id=${s.id} name=${s.name} type=${s.type} instanceConfig=${JSON.stringify(s.instanceConfig || {})}`);
  });
}

debugAssignment().then(() => process.exit(0)).catch((err) => { console.error(err); process.exit(1); });