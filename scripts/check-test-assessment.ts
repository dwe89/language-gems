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

async function checkTestAssessment() {
  console.log('Checking for assessment titled "test"...\n');

  // Get the most recent assignment with "test" in the title
  const { data: assignments, error } = await supabase
    .from('assignments')
    .select('*')
    .ilike('title', '%test%')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching assignments:', error);
    return;
  }

  if (!assignments || assignments.length === 0) {
    console.log('No assignments found with "test" in the title.');
    return;
  }

  console.log(`Found ${assignments.length} assignment(s):\n`);

  assignments.forEach((assignment, index) => {
    console.log(`\n--- Assignment ${index + 1} ---`);
    console.log(`ID: ${assignment.id}`);
    console.log(`Title: ${assignment.title}`);
    console.log(`Game Type: ${assignment.game_type}`);
    console.log(`Type: ${assignment.type}`);
    console.log(`Created: ${assignment.created_at}`);
    console.log(`Due Date: ${assignment.due_date}`);
    console.log(`Class ID: ${assignment.class_id}`);
    console.log(`Config:`, JSON.stringify(assignment.game_config, null, 2));
  });
}

checkTestAssessment()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Script error:', error);
    process.exit(1);
  });
