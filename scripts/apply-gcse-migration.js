#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('📊 Applying GCSE grade and performance fields migration...');
  
  const migrationPath = path.join(__dirname, '../supabase/migrations/20250201000000_add_gcse_grade_and_performance_fields.sql');
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
  
  console.log(`Executing ${statements.length} SQL statements...`);
  
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;
    
    console.log(`\n[${i + 1}/${statements.length}] Executing...`);
    console.log(statement.substring(0, 100) + '...');
    
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: statement });
    
    if (error) {
      console.error(`❌ Error on statement ${i + 1}:`, error);
      // Continue with other statements
    } else {
      console.log(`✅ Statement ${i + 1} executed successfully`);
    }
  }
  
  console.log('\n✅ Migration completed');
}

applyMigration().catch(console.error);
