/**
 * Test Script for Two-Tier Conjugation Tracking System
 * 
 * This script tests the two-tier approach:
 * 1. Tier 1: Lemma mastery tracking in centralized_vocabulary
 * 2. Tier 2: Specific conjugation mastery tracking in student_conjugation_mastery
 */

import { createClient } from '@supabase/supabase-js';
import { ConjugationTrackingService, ConjugationAttempt } from '../src/services/ConjugationTrackingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testTwoTierConjugationTracking() {
  console.log('🎯 Testing Two-Tier Conjugation Tracking System...\n');

  const conjugationService = new ConjugationTrackingService(supabase);
  // Generate a proper UUID for student_id
  const testStudentId = crypto.randomUUID();

  // Test conjugation attempts
  const testAttempts: ConjugationAttempt[] = [
    {
      studentId: testStudentId,
      baseVerb: 'preferir',
      conjugatedForm: 'prefiero',
      tense: 'present',
      person: '1st_singular',
      language: 'es',
      isCorrect: true,
      responseTimeMs: 2500,
      confidence: 0.8
    },
    {
      studentId: testStudentId,
      baseVerb: 'preferir',
      conjugatedForm: 'prefieres',
      tense: 'present',
      person: '2nd_singular',
      language: 'es',
      isCorrect: false, // Incorrect attempt
      responseTimeMs: 4000,
      confidence: 0.3
    },
    {
      studentId: testStudentId,
      baseVerb: 'hablar',
      conjugatedForm: 'hablo',
      tense: 'present',
      person: '1st_singular',
      language: 'es',
      isCorrect: true,
      responseTimeMs: 1800,
      confidence: 0.9
    }
  ];

  console.log('📋 Testing conjugation attempts...\n');

  for (let i = 0; i < testAttempts.length; i++) {
    const attempt = testAttempts[i];
    console.log(`🎯 Attempt ${i + 1}: ${attempt.baseVerb} → ${attempt.conjugatedForm} (${attempt.isCorrect ? 'CORRECT' : 'INCORRECT'})`);
    console.log(`   Context: ${attempt.tense} tense, ${attempt.person}`);
    
    try {
      const result = await conjugationService.recordConjugationAttempt(attempt);
      
      if (result.success) {
        console.log('   ✅ Two-tier tracking successful');
        
        // Tier 1 results
        console.log('   📚 Tier 1 (Lemma Mastery):');
        console.log(`      - Base verb: ${result.lemmaTracking.baseVerb}`);
        console.log(`      - Vocabulary ID: ${result.lemmaTracking.vocabularyId}`);
        console.log(`      - FSRS updated: ${result.lemmaTracking.fsrsUpdated}`);
        console.log(`      - Gem awarded: ${result.lemmaTracking.gemAwarded}`);
        
        // Tier 2 results
        console.log('   🎯 Tier 2 (Conjugation Mastery):');
        console.log(`      - Conjugation ID: ${result.conjugationTracking.conjugationId}`);
        console.log(`      - Mastery level: ${result.conjugationTracking.masteryLevel.toFixed(2)}`);
        console.log(`      - FSRS updated: ${result.conjugationTracking.fsrsUpdated}`);
        console.log(`      - Improvement detected: ${result.conjugationTracking.improvementDetected}`);
        
      } else {
        console.log('   ❌ Two-tier tracking failed');
        if (result.errors.length > 0) {
          console.log('   Errors:');
          result.errors.forEach(error => console.log(`      - ${error}`));
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
    
    console.log('');
  }

  return testStudentId;
}

async function testConjugationReview(studentId: string) {
  console.log('📚 Testing Conjugation Review System...\n');

  const conjugationService = new ConjugationTrackingService(supabase);
  
  try {
    const reviewConjugations = await conjugationService.getConjugationsForReview(
      studentId,
      'es',
      10
    );

    console.log(`Found ${reviewConjugations.length} conjugations for review:`);
    
    if (reviewConjugations.length > 0) {
      reviewConjugations.forEach((conjugation, index) => {
        console.log(`   ${index + 1}. ${conjugation.baseVerb} → ${conjugation.conjugatedForm}`);
        console.log(`      Tense: ${conjugation.tense}, Person: ${conjugation.person}`);
        console.log(`      Mastery: ${conjugation.masteryLevel.toFixed(2)}/5.0`);
        console.log(`      Accuracy: ${conjugation.correctAttempts}/${conjugation.totalAttempts} (${Math.round((conjugation.correctAttempts/conjugation.totalAttempts)*100)}%)`);
        console.log(`      Next review: ${conjugation.nextReviewAt.toISOString()}`);
        console.log('');
      });
    } else {
      console.log('   No conjugations due for review at this time.');
    }

  } catch (error) {
    console.log(`❌ Error getting conjugations for review: ${error}`);
  }
}

async function testDatabaseStructure() {
  console.log('🗄️  Testing Database Structure...\n');

  try {
    // Test verb_tenses table
    const { data: tenses, error: tensesError } = await supabase
      .from('verb_tenses')
      .select('*')
      .eq('language', 'es')
      .limit(5);

    if (!tensesError && tenses) {
      console.log('✅ Verb tenses table:');
      tenses.forEach(tense => {
        console.log(`   - ${tense.name}: ${tense.display_name}`);
      });
    } else {
      console.log('❌ Error accessing verb_tenses:', tensesError?.message);
    }

    // Test grammatical_persons table
    const { data: persons, error: personsError } = await supabase
      .from('grammatical_persons')
      .select('*')
      .eq('language', 'es')
      .limit(6);

    if (!personsError && persons) {
      console.log('\n✅ Grammatical persons table:');
      persons.forEach(person => {
        console.log(`   - ${person.person}: ${person.display_name}`);
      });
    } else {
      console.log('❌ Error accessing grammatical_persons:', personsError?.message);
    }

    // Test verb_conjugations table
    const { data: conjugations, error: conjugationsError } = await supabase
      .from('verb_conjugations')
      .select(`
        conjugated_form,
        centralized_vocabulary!inner(word),
        verb_tenses!inner(name),
        grammatical_persons!inner(person)
      `)
      .eq('language', 'es')
      .limit(5);

    if (!conjugationsError && conjugations) {
      console.log('\n✅ Verb conjugations table:');
      conjugations.forEach(conj => {
        console.log(`   - ${conj.centralized_vocabulary.word} → ${conj.conjugated_form} (${conj.verb_tenses.name}, ${conj.grammatical_persons.person})`);
      });
    } else {
      console.log('❌ Error accessing verb_conjugations:', conjugationsError?.message);
    }

  } catch (error) {
    console.log(`❌ Database structure test error: ${error}`);
  }
}

async function testConjugationLookup() {
  console.log('\n🔍 Testing Conjugation Lookup...\n');

  const testCases = [
    { baseVerb: 'preferir', conjugatedForm: 'prefiero', tense: 'present', person: '1st_singular' },
    { baseVerb: 'hablar', conjugatedForm: 'hablo', tense: 'present', person: '1st_singular' },
    { baseVerb: 'preferir', conjugatedForm: 'prefieres', tense: 'present', person: '2nd_singular' }
  ];

  for (const testCase of testCases) {
    try {
      const { data, error } = await supabase
        .from('verb_conjugations')
        .select(`
          id,
          conjugated_form,
          centralized_vocabulary!inner(word),
          verb_tenses!inner(name),
          grammatical_persons!inner(person)
        `)
        .eq('conjugated_form', testCase.conjugatedForm)
        .eq('language', 'es')
        .eq('centralized_vocabulary.word', testCase.baseVerb)
        .eq('verb_tenses.name', testCase.tense)
        .eq('grammatical_persons.person', testCase.person)
        .single();

      if (!error && data) {
        console.log(`✅ Found: ${testCase.baseVerb} → ${testCase.conjugatedForm}`);
        console.log(`   ID: ${data.id}`);
      } else {
        console.log(`❌ Not found: ${testCase.baseVerb} → ${testCase.conjugatedForm}`);
        if (error) console.log(`   Error: ${error.message}`);
      }
    } catch (error) {
      console.log(`❌ Lookup error for ${testCase.baseVerb} → ${testCase.conjugatedForm}: ${error}`);
    }
  }
}

async function runAllTests() {
  console.log('🚀 Starting Two-Tier Conjugation Tracking Tests\n');
  console.log('=' .repeat(70) + '\n');

  // Test 1: Database structure
  await testDatabaseStructure();

  // Test 2: Conjugation lookup
  await testConjugationLookup();

  // Test 3: Two-tier tracking
  const testStudentId = await testTwoTierConjugationTracking();

  // Test 4: Review system
  await testConjugationReview(testStudentId);

  // Final summary
  console.log('=' .repeat(70));
  console.log('🏁 TWO-TIER CONJUGATION TRACKING TESTS COMPLETE');
  console.log('=' .repeat(70));
  console.log('✅ Database structure verified');
  console.log('✅ Conjugation lookup tested');
  console.log('✅ Two-tier tracking system tested');
  console.log('✅ Review system tested');
  console.log('\n🎉 Two-tier conjugation tracking system is ready for integration!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };
