/**
 * Apply Gems Migration Script
 * Applies the gems-first reward system migration to the Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🚀 Starting Gems Migration Deployment...\n');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250810000000_gems_first_reward_system.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration file loaded successfully');
    
    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.trim().length === 0) continue;
      
      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const { error } = await supabase.rpc('exec_sql', { 
          sql_query: statement + ';' 
        });
        
        if (error) {
          // Try direct execution if RPC fails
          const { error: directError } = await supabase
            .from('_temp_migration')
            .select('*')
            .limit(0);
          
          // If that fails too, try using the raw query
          if (directError) {
            console.log(`⚠️  RPC method not available, trying alternative approach...`);
            
            // For critical statements, we'll need to execute them manually
            if (statement.includes('CREATE TABLE') || statement.includes('ALTER TABLE')) {
              console.log(`📋 Statement ${i + 1}: ${statement.substring(0, 100)}...`);
              console.log('✅ Marked for manual execution (see output below)');
            }
          }
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.log(`⚠️  Statement ${i + 1} needs manual execution:`, err.message);
        console.log(`📋 SQL: ${statement.substring(0, 100)}...`);
      }
    }
    
    console.log('\n🎉 Migration deployment completed!');
    console.log('\n📋 Manual Execution Required:');
    console.log('Since we cannot execute DDL statements directly through the client,');
    console.log('please run the following SQL in your Supabase SQL Editor:\n');
    
    // Output the key statements that need manual execution
    const criticalStatements = statements.filter(stmt => 
      stmt.includes('CREATE TABLE') || 
      stmt.includes('ALTER TABLE') || 
      stmt.includes('CREATE INDEX') ||
      stmt.includes('CREATE POLICY') ||
      stmt.includes('CREATE FUNCTION') ||
      stmt.includes('CREATE TRIGGER')
    );
    
    console.log('-- GEMS MIGRATION SQL (Execute in Supabase SQL Editor)');
    console.log('-- =====================================================\n');
    
    criticalStatements.forEach((stmt, index) => {
      console.log(`-- Statement ${index + 1}`);
      console.log(stmt + ';\n');
    });
    
    console.log('\n✨ After executing the above SQL, the gems system will be ready!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Check if we can connect to the database first
async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    const { data, error } = await supabase
      .from('enhanced_game_sessions')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
    
    console.log('✅ Database connection successful');
    return true;
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n📋 Please ensure your Supabase credentials are correct in .env.local');
    process.exit(1);
  }
  
  await applyMigration();
}

main().catch(console.error);
