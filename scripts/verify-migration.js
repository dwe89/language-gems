/**
 * Verify Migration Script
 * Checks if the gems migration was applied successfully
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyMigration() {
  console.log('🔍 Verifying Gems Migration...\n');
  
  const checks = [];
  
  try {
    // Check 1: Verify enhanced_game_sessions has new columns
    console.log('1️⃣ Checking enhanced_game_sessions columns...');
    const { data: sessionData, error: sessionError } = await supabase
      .from('enhanced_game_sessions')
      .select('gems_total, gems_by_rarity, gem_events_count')
      .limit(1);
    
    if (sessionError) {
      console.log('❌ enhanced_game_sessions columns not found');
      checks.push({ name: 'enhanced_game_sessions columns', status: 'failed', error: sessionError.message });
    } else {
      console.log('✅ enhanced_game_sessions columns exist');
      checks.push({ name: 'enhanced_game_sessions columns', status: 'passed' });
    }
    
    // Check 2: Verify gem_events table exists
    console.log('2️⃣ Checking gem_events table...');
    const { data: gemData, error: gemError } = await supabase
      .from('gem_events')
      .select('id')
      .limit(1);
    
    if (gemError) {
      console.log('❌ gem_events table not found');
      checks.push({ name: 'gem_events table', status: 'failed', error: gemError.message });
    } else {
      console.log('✅ gem_events table exists');
      checks.push({ name: 'gem_events table', status: 'passed' });
    }
    
    // Check 3: Verify vocabulary_gem_collection has max_gem_rarity column
    console.log('3️⃣ Checking vocabulary_gem_collection max_gem_rarity column...');
    const { data: vocabData, error: vocabError } = await supabase
      .from('vocabulary_gem_collection')
      .select('max_gem_rarity')
      .limit(1);
    
    if (vocabError) {
      console.log('❌ max_gem_rarity column not found');
      checks.push({ name: 'max_gem_rarity column', status: 'failed', error: vocabError.message });
    } else {
      console.log('✅ max_gem_rarity column exists');
      checks.push({ name: 'max_gem_rarity column', status: 'passed' });
    }
    
    // Check 4: Verify student_gem_analytics view exists
    console.log('4️⃣ Checking student_gem_analytics view...');
    const { data: analyticsData, error: analyticsError } = await supabase
      .from('student_gem_analytics')
      .select('*')
      .limit(1);
    
    if (analyticsError) {
      console.log('❌ student_gem_analytics view not found');
      checks.push({ name: 'student_gem_analytics view', status: 'failed', error: analyticsError.message });
    } else {
      console.log('✅ student_gem_analytics view exists');
      checks.push({ name: 'student_gem_analytics view', status: 'passed' });
    }
    
    // Summary
    console.log('\n📊 Migration Verification Summary:');
    console.log('=====================================');
    
    const passed = checks.filter(c => c.status === 'passed').length;
    const failed = checks.filter(c => c.status === 'failed').length;
    
    checks.forEach(check => {
      const icon = check.status === 'passed' ? '✅' : '❌';
      console.log(`${icon} ${check.name}`);
      if (check.error) {
        console.log(`   Error: ${check.error}`);
      }
    });
    
    console.log(`\n📈 Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      console.log('\n🎉 Migration verification completed successfully!');
      console.log('✨ The gems system is ready for deployment.');
      return true;
    } else {
      console.log('\n⚠️  Migration verification failed.');
      console.log('📋 Please execute the migration SQL in Supabase SQL Editor.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Verification failed:', error);
    return false;
  }
}

async function main() {
  const success = await verifyMigration();
  process.exit(success ? 0 : 1);
}

main().catch(console.error);
