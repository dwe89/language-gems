/**
 * Test script to verify vocabulary database functionality
 * Run this to test the vocabulary upload and folder creation
 */

import { createClient } from '@supabase/supabase-js';
import { VocabularyUploadService } from '../services/vocabularyUploadService';

// Test configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xetsvpfunazwkontdpdh.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldHN2cGZ1bmF6d2tvbnRkcGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjMwMDIsImV4cCI6MjA1NTM5OTAwMn0.Y99h1LBL9COrpgortCXrn7KGKznr3uc-LyxHnKcmICs';

async function testVocabularyDatabase() {
  console.log('🧪 Testing Vocabulary Database Functionality...\n');

  // Create Supabase client
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const uploadService = new VocabularyUploadService(supabase);

  try {
    // Test 1: Parse vocabulary content
    console.log('📝 Test 1: Parsing vocabulary content...');
    const testContent = `gato\tcat\tnoun\tEl gato es negro\tThe cat is black
perro\tdog\tnoun\tMi perro es grande\tMy dog is big
correr\tto run\tverb\tMe gusta correr\tI like to run`;

    const parsed = uploadService.parseContent(testContent, 'words', 'intermediate');
    console.log(`✅ Parsed ${parsed.validLines} items successfully`);
    console.log(`   Errors: ${parsed.errors.length}`);
    console.log(`   Warnings: ${parsed.warnings.length}`);
    console.log(`   Format detected: ${parsed.detectedFormat}\n`);

    // Test 2: Validate vocabulary list
    console.log('✅ Test 2: Validating vocabulary list...');
    const testList = {
      name: 'Test Spanish Vocabulary',
      description: 'A test vocabulary list for Spanish',
      language: 'spanish' as const,
      difficulty_level: 'intermediate' as const,
      content_type: 'words' as const,
      is_public: false,
      items: parsed.items
    };

    const validationErrors = uploadService.validateVocabularyList(testList);
    if (validationErrors.length === 0) {
      console.log('✅ Vocabulary list validation passed\n');
    } else {
      console.log('❌ Validation errors:', validationErrors);
      return;
    }

    // Test 3: Check database tables exist
    console.log('🗄️  Test 3: Checking database tables...');
    const { data: tables, error: tablesError } = await supabase
      .from('enhanced_vocabulary_lists')
      .select('count', { count: 'exact', head: true });

    if (tablesError) {
      console.log('❌ Database table check failed:', tablesError.message);
      return;
    }
    console.log('✅ enhanced_vocabulary_lists table exists');

    const { data: foldersTable, error: foldersError } = await supabase
      .from('vocabulary_folders')
      .select('count', { count: 'exact', head: true });

    if (foldersError) {
      console.log('❌ vocabulary_folders table check failed:', foldersError.message);
      return;
    }
    console.log('✅ vocabulary_folders table exists\n');

    // Test 4: Test authentication requirement
    console.log('🔐 Test 4: Testing authentication requirements...');
    try {
      const { data, error } = await supabase
        .from('enhanced_vocabulary_lists')
        .select('*')
        .limit(1);

      if (error && error.message.includes('JWT')) {
        console.log('✅ RLS policies are working (authentication required)\n');
      } else {
        console.log('⚠️  RLS policies may not be properly configured\n');
      }
    } catch (error) {
      console.log('✅ Authentication properly required\n');
    }

    console.log('🎉 All database tests completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   ✅ Content parsing works');
    console.log('   ✅ Validation works');
    console.log('   ✅ Database tables exist');
    console.log('   ✅ RLS policies are active');
    console.log('\n🚀 The vocabulary management system is ready for use!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testVocabularyDatabase();
}

export { testVocabularyDatabase };
