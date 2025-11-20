#!/usr/bin/env node

/**
 * Apply GCSE grade and performance fields migration
 * Adds gcse_grade and performance_by_* fields to AQA results tables
 * Fixes RLS policies to allow student inserts
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql(sql, description) {
  console.log(`\n🔧 ${description}...`);
  const { data, error } = await supabase.rpc('exec', { sql });
  
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`✅ Success`);
  return true;
}

async function applyMigration() {
  console.log('📊 Applying GCSE grade and performance fields migration\n');
  
  // Add columns to reading results
  await executeSql(
    `ALTER TABLE aqa_reading_results 
     ADD COLUMN IF NOT EXISTS gcse_grade INTEGER,
     ADD COLUMN IF NOT EXISTS performance_by_question_type JSONB,
     ADD COLUMN IF NOT EXISTS performance_by_theme JSONB,
     ADD COLUMN IF NOT EXISTS performance_by_topic JSONB`,
    'Adding fields to aqa_reading_results'
  );
  
  // Add columns to listening results
  await executeSql(
    `ALTER TABLE aqa_listening_results 
     ADD COLUMN IF NOT EXISTS gcse_grade INTEGER,
     ADD COLUMN IF NOT EXISTS performance_by_question_type JSONB,
     ADD COLUMN IF NOT EXISTS performance_by_theme JSONB,
     ADD COLUMN IF NOT EXISTS performance_by_topic JSONB`,
    'Adding fields to aqa_listening_results'
  );
  
  // Add columns to writing results
  await executeSql(
    `ALTER TABLE aqa_writing_results 
     ADD COLUMN IF NOT EXISTS gcse_grade INTEGER`,
    'Adding fields to aqa_writing_results'
  );
  
  // Drop old policies
  console.log('\n🔒 Fixing RLS policies...');
  
  await executeSql(
    `DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_reading_results`,
    'Dropping old reading results policy'
  );
  
  await executeSql(
    `DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_listening_results`,
    'Dropping old listening results policy'
  );
  
  await executeSql(
    `DROP POLICY IF EXISTS "Students can manage their own results" ON aqa_writing_results`,
    'Dropping old writing results policy'
  );
  
  // Create new granular policies for reading results
  await executeSql(
    `CREATE POLICY "Students can insert their own reading results" ON aqa_reading_results
     FOR INSERT WITH CHECK (auth.uid() = student_id)`,
    'Creating INSERT policy for reading results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can view their own reading results" ON aqa_reading_results
     FOR SELECT USING (auth.uid() = student_id)`,
    'Creating SELECT policy for reading results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can update their own reading results" ON aqa_reading_results
     FOR UPDATE USING (auth.uid() = student_id)`,
    'Creating UPDATE policy for reading results'
  );
  
  // Create new granular policies for listening results
  await executeSql(
    `CREATE POLICY "Students can insert their own listening results" ON aqa_listening_results
     FOR INSERT WITH CHECK (auth.uid() = student_id)`,
    'Creating INSERT policy for listening results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can view their own listening results" ON aqa_listening_results
     FOR SELECT USING (auth.uid() = student_id)`,
    'Creating SELECT policy for listening results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can update their own listening results" ON aqa_listening_results
     FOR UPDATE USING (auth.uid() = student_id)`,
    'Creating UPDATE policy for listening results'
  );
  
  // Create new granular policies for writing results
  await executeSql(
    `CREATE POLICY "Students can insert their own writing results" ON aqa_writing_results
     FOR INSERT WITH CHECK (auth.uid() = student_id)`,
    'Creating INSERT policy for writing results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can view their own writing results" ON aqa_writing_results
     FOR SELECT USING (auth.uid() = student_id)`,
    'Creating SELECT policy for writing results'
  );
  
  await executeSql(
    `CREATE POLICY "Students can update their own writing results" ON aqa_writing_results
     FOR UPDATE USING (auth.uid() = student_id)`,
    'Creating UPDATE policy for writing results'
  );
  
  console.log('\n✅ Migration completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Regenerate database types: npm run update-types');
  console.log('2. Test assessment submission in the browser');
  console.log('3. Verify results appear in teacher dashboard');
}

applyMigration()
  .catch(err => {
    console.error('\n❌ Migration failed:', err);
    process.exit(1);
  })
  .finally(() => {
    process.exit(0);
  });
