/**
 * Test script to verify conjugation recording functionality
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConjugationRecording() {
  console.log('🧪 Testing conjugation recording...');

  // Use hardcoded test student ID
  const testStudentId = 'dff78e88-a9e6-4398-b73f-02f0baf5c6b4';
  console.log('👤 Using test student ID:', testStudentId);

  // Create a test conjugation attempt with a proper UUID
  const testConjugation = {
    student_id: testStudentId,
    game_session_id: 'test-session-' + Date.now(),
    base_verb_id: '12345678-1234-1234-1234-123456789012', // Valid UUID format
    base_verb_infinitive: 'hablar',
    base_verb_translation: 'to speak',
    conjugated_form: 'hablo',
    expected_answer: 'hablo',
    student_answer: 'hablo',
    is_correct: true,
    language: 'es',
    tense: 'present',
    person: 'first',
    number: 'singular',
    verb_type: 'regular',
    response_time_ms: 2500,
    hint_used: false,
    difficulty_level: 1,
    complexity_score: 1.0
  };

  console.log('📝 Attempting to insert test conjugation:', testConjugation);

  const { data, error } = await supabase
    .from('conjugations')
    .insert(testConjugation)
    .select('id')
    .single();

  if (error) {
    console.error('❌ Failed to insert test conjugation:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
  } else {
    console.log('✅ Successfully inserted test conjugation with ID:', data.id);
    
    // Clean up the test record
    const { error: deleteError } = await supabase
      .from('conjugations')
      .delete()
      .eq('id', data.id);
    
    if (deleteError) {
      console.error('⚠️ Failed to clean up test record:', deleteError);
    } else {
      console.log('🧹 Cleaned up test record');
    }
  }

  // Check current conjugation count
  const { data: countData, error: countError } = await supabase
    .from('conjugations')
    .select('*', { count: 'exact' });

  if (countError) {
    console.error('❌ Failed to count conjugations:', countError);
  } else {
    console.log('📊 Current conjugations count:', countData?.length || 0);
  }
}

testConjugationRecording().catch(console.error);
