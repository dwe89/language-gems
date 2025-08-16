/**
 * Test Final Integration
 * 
 * Quick test to verify all systems are working after fixes
 */

import { createClient } from '@supabase/supabase-js';
import { MWEVocabularyTrackingService } from '../src/services/MWEVocabularyTrackingService';
import { ConjugationTrackingService } from '../src/services/ConjugationTrackingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testFinalIntegration() {
  console.log('🧪 Testing Final Integration After Fixes\n');
  console.log('=' .repeat(50) + '\n');

  const mweService = new MWEVocabularyTrackingService(supabase);
  const conjugationService = new ConjugationTrackingService(supabase);

  let passed = 0;
  let failed = 0;

  // Test 1: Lemmatization with MWE
  console.log('1. Testing Lemmatization + MWE Recognition...');
  try {
    const result = await mweService.parseSentenceWithLemmatization('Prefiero ir al cine', 'es');
    console.log(`   Coverage: ${result.coveragePercentage.toFixed(1)}%`);
    console.log(`   Matches: ${result.vocabularyMatches.map(m => m.word).join(', ')}`);
    
    if (result.vocabularyMatches.length > 0) {
      console.log('   ✅ PASS - Lemmatization working');
      passed++;
    } else {
      console.log('   ❌ FAIL - No matches found');
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Error: ${error}`);
    failed++;
  }

  // Test 2: Conjugation Tracking
  console.log('\n2. Testing Conjugation Tracking...');
  try {
    const conjugationResult = await conjugationService.recordConjugationAttempt({
      studentId: crypto.randomUUID(),
      baseVerb: 'preferir',
      conjugatedForm: 'prefiero',
      tense: 'present',
      person: '1st_singular',
      language: 'es',
      isCorrect: true,
      responseTimeMs: 2000,
      confidence: 0.8
    });

    if (conjugationResult.success) {
      console.log('   ✅ PASS - Conjugation tracking working');
      console.log(`   Lemma tracking: ${conjugationResult.lemmaTracking.fsrsUpdated}`);
      console.log(`   Conjugation tracking: ${conjugationResult.conjugationTracking.fsrsUpdated}`);
      passed++;
    } else {
      console.log('   ❌ FAIL - Conjugation tracking failed');
      console.log(`   Errors: ${conjugationResult.errors.join(', ')}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Error: ${error}`);
    failed++;
  }

  // Test 3: Multi-language support
  console.log('\n3. Testing Multi-language Support...');
  const languages = [
    { sentence: 'Je parle français', lang: 'fr', expected: 'parler' },
    { sentence: 'Ich spreche Deutsch', lang: 'de', expected: 'sprechen' }
  ];

  for (const test of languages) {
    try {
      const result = await mweService.parseSentenceWithLemmatization(test.sentence, test.lang);
      const foundExpected = result.vocabularyMatches.some(m => m.word === test.expected);
      
      if (foundExpected) {
        console.log(`   ✅ PASS - ${test.lang.toUpperCase()}: "${test.sentence}" → "${test.expected}"`);
        passed++;
      } else {
        console.log(`   ❌ FAIL - ${test.lang.toUpperCase()}: Expected "${test.expected}", got: ${result.vocabularyMatches.map(m => m.word).join(', ')}`);
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ FAIL - ${test.lang.toUpperCase()}: Error: ${error}`);
      failed++;
    }
  }

  // Test 4: MWE Recognition
  console.log('\n4. Testing MWE Recognition...');
  try {
    const result = await mweService.parseSentenceWithLemmatization('Me gusta comer pizza', 'es');
    const hasMeGusta = result.vocabularyMatches.some(m => m.word === 'me gusta');
    
    if (hasMeGusta) {
      console.log('   ✅ PASS - "Me gusta" recognized as MWE');
      passed++;
    } else {
      console.log('   ❌ FAIL - "Me gusta" not recognized as MWE');
      console.log(`   Found: ${result.vocabularyMatches.map(m => m.word).join(', ')}`);
      failed++;
    }
  } catch (error) {
    console.log(`   ❌ FAIL - Error: ${error}`);
    failed++;
  }

  // Summary
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 FINAL INTEGRATION TEST RESULTS');
  console.log('=' .repeat(50));
  console.log(`✅ Tests passed: ${passed}`);
  console.log(`❌ Tests failed: ${failed}`);
  console.log(`📊 Success rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

  if (failed === 0) {
    console.log('\n🎉 ALL SYSTEMS WORKING PERFECTLY!');
    console.log('✅ Lemmatization integrated');
    console.log('✅ Conjugation tracking functional');
    console.log('✅ Multi-language support active');
    console.log('✅ MWE recognition working');
    console.log('\n🚀 Ready for production use!');
  } else {
    console.log('\n⚠️  Some issues remain - check failed tests above');
  }

  return { passed, failed };
}

// Run if this script is executed directly
if (require.main === module) {
  testFinalIntegration().catch(console.error);
}

export { testFinalIntegration };
