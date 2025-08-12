/**
 * Output Migration SQL Script
 * Outputs the complete gems migration SQL for manual execution in Supabase
 */

const fs = require('fs');
const path = require('path');

function outputMigrationSQL() {
  try {
    console.log('📄 Reading gems migration file...\n');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250810000000_gems_first_reward_system.sql');
    
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('🎯 COMPLETE GEMS MIGRATION SQL');
    console.log('=====================================');
    console.log('Copy and paste the following SQL into your Supabase SQL Editor:');
    console.log('(Dashboard > SQL Editor > New Query)\n');
    
    console.log('-- ============================================================================');
    console.log('-- GEMS-FIRST REWARD SYSTEM MIGRATION');
    console.log('-- Execute this complete SQL block in Supabase SQL Editor');
    console.log('-- ============================================================================\n');
    
    console.log(migrationSQL);
    
    console.log('\n-- ============================================================================');
    console.log('-- END OF MIGRATION');
    console.log('-- ============================================================================\n');
    
    console.log('✅ Migration SQL output complete!');
    console.log('\n📋 Next Steps:');
    console.log('1. Copy the SQL above');
    console.log('2. Go to your Supabase Dashboard');
    console.log('3. Navigate to SQL Editor');
    console.log('4. Create a new query');
    console.log('5. Paste and execute the SQL');
    console.log('6. Verify the migration completed successfully');
    
  } catch (error) {
    console.error('❌ Error reading migration file:', error);
    process.exit(1);
  }
}

outputMigrationSQL();
