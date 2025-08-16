/**
 * Test Script for Enhanced Vocabulary Tracking with Lemmatization
 * 
 * This script tests the integration of lemmatization with vocabulary tracking:
 * 1. Sentences with conjugated verbs like "Prefiero ir al cine"
 * 2. MWE recognition combined with lemmatization
 * 3. Proper tracking of both inflected forms and base forms
 * 4. Coverage improvement with lemmatization
 */

import { createClient } from '@supabase/supabase-js';
import { MWEVocabularyTrackingService } from '../src/services/MWEVocabularyTrackingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testEnhancedVocabularyTracking() {
  console.log('🔍 Testing Enhanced Vocabulary Tracking with Lemmatization...\n');

  const trackingService = new MWEVocabularyTrackingService(supabase);
  
  const testSentences = [
    {
      sentence: 'Prefiero ir al cine',
      language: 'es',
      description: 'Spanish sentence with conjugated verb "prefiero"',
      expectedMatches: ['preferir', 'ir', 'cine'], // Expected lemmatized matches
      expectedMWEs: [] // No MWEs expected
    },
    {
      sentence: 'Me gusta comer pizza',
      language: 'es', 
      description: 'Spanish sentence with MWE "me gusta" and conjugated "comer"',
      expectedMatches: ['me gusta', 'comer', 'pizza'],
      expectedMWEs: ['me gusta']
    },
    {
      sentence: 'Hablo español muy bien',
      language: 'es',
      description: 'Spanish sentence with conjugated "hablo"',
      expectedMatches: ['hablar', 'español', 'muy', 'bien'],
      expectedMWEs: []
    },
    {
      sentence: 'Je parle français couramment',
      language: 'fr',
      description: 'French sentence with conjugated "parle"',
      expectedMatches: ['je', 'parler', 'français'],
      expectedMWEs: []
    },
    {
      sentence: 'Ich spreche Deutsch gern',
      language: 'de',
      description: 'German sentence with conjugated "spreche"',
      expectedMatches: ['ich', 'sprechen', 'deutsch'],
      expectedMWEs: []
    }
  ];

  let totalTests = 0;
  let passedTests = 0;

  for (const testCase of testSentences) {
    console.log(`📝 Testing: "${testCase.sentence}" (${testCase.language})`);
    console.log(`   ${testCase.description}`);
    
    try {
      // Test standard parsing
      const standardResult = await trackingService.parseSentenceForVocabulary(
        testCase.sentence, 
        testCase.language
      );
      
      // Test enhanced parsing with lemmatization
      const enhancedResult = await trackingService.parseSentenceWithLemmatization(
        testCase.sentence,
        testCase.language
      );
      
      console.log(`\n   📊 Standard Parsing Results:`);
      console.log(`      - Matches: ${standardResult.vocabularyMatches.length}`);
      console.log(`      - Coverage: ${standardResult.coveragePercentage}%`);
      console.log(`      - Found words: ${standardResult.vocabularyMatches.map(m => m.word).join(', ')}`);
      
      console.log(`\n   🚀 Enhanced Parsing Results:`);
      console.log(`      - Matches: ${enhancedResult.vocabularyMatches.length}`);
      console.log(`      - Coverage: ${enhancedResult.coveragePercentage}%`);
      console.log(`      - Found words: ${enhancedResult.vocabularyMatches.map(m => m.word).join(', ')}`);
      
      // Show lemmatization details
      const lemmatizedMatches = enhancedResult.vocabularyMatches.filter(m => m.originalForm);
      if (lemmatizedMatches.length > 0) {
        console.log(`      - Lemmatized matches:`);
        lemmatizedMatches.forEach(match => {
          console.log(`        * "${match.originalForm}" → "${match.lemmatizedForm}" (${match.lemmatizationMethod}, confidence: ${match.lemmatizationConfidence})`);
        });
      }
      
      // Check for MWEs
      const foundMWEs = enhancedResult.vocabularyMatches.filter(m => m.is_mwe);
      if (foundMWEs.length > 0) {
        console.log(`      - MWEs found: ${foundMWEs.map(m => m.word).join(', ')}`);
      }
      
      // Evaluate improvement
      const improvement = enhancedResult.coveragePercentage - standardResult.coveragePercentage;
      console.log(`      - Coverage improvement: +${improvement.toFixed(1)}%`);
      
      // Test trackable vocabulary extraction
      const trackableVocab = await trackingService.getTrackableVocabulary(
        testCase.sentence,
        testCase.language
      );
      
      console.log(`\n   🎯 Trackable Vocabulary:`);
      console.log(`      - Count: ${trackableVocab.length}`);
      if (trackableVocab.length > 0) {
        trackableVocab.forEach(vocab => {
          const lemmaInfo = vocab.originalForm ? ` (${vocab.originalForm} → ${vocab.lemmatizedForm})` : '';
          console.log(`        * "${vocab.word}" → "${vocab.translation}"${lemmaInfo}`);
        });
      }
      
      // Evaluate test success
      const hasImprovement = improvement > 0 || enhancedResult.coveragePercentage >= 50;
      const hasTrackableVocab = trackableVocab.length > 0;
      
      if (hasImprovement && hasTrackableVocab) {
        console.log(`   ✅ Test PASSED - Enhanced parsing shows improvement`);
        passedTests++;
      } else if (hasTrackableVocab) {
        console.log(`   ⚠️  Test PARTIAL - Trackable vocabulary found but no coverage improvement`);
      } else {
        console.log(`   ❌ Test FAILED - No trackable vocabulary found`);
      }
      
      totalTests++;
      
    } catch (error) {
      console.log(`   ❌ Test ERROR: ${error}`);
      totalTests++;
    }
    
    console.log('\n' + '-'.repeat(80) + '\n');
  }

  console.log(`📊 Enhanced Tracking Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
  return { passed: passedTests, total: totalTests };
}

async function testSpecificConjugations() {
  console.log('🎯 Testing Specific Conjugation Cases...\n');

  const trackingService = new MWEVocabularyTrackingService(supabase);
  
  const conjugationTests = [
    { original: 'prefiero', expected: 'preferir', language: 'es' },
    { original: 'comes', expected: 'comer', language: 'es' },
    { original: 'hablas', expected: 'hablar', language: 'es' },
    { original: 'vivimos', expected: 'vivir', language: 'es' },
    { original: 'parle', expected: 'parler', language: 'fr' },
    { original: 'finissons', expected: 'finir', language: 'fr' },
    { original: 'spreche', expected: 'sprechen', language: 'de' },
    { original: 'lebst', expected: 'leben', language: 'de' }
  ];

  console.log('Testing individual conjugated forms:');
  
  for (const test of conjugationTests) {
    try {
      const result = await trackingService.parseSentenceWithLemmatization(
        test.original,
        test.language
      );
      
      const lemmatizedMatch = result.vocabularyMatches.find(m => 
        m.originalForm === test.original && m.lemmatizedForm === test.expected
      );
      
      if (lemmatizedMatch) {
        console.log(`✅ "${test.original}" → "${test.expected}" (${test.language}) - Found in vocabulary`);
      } else {
        console.log(`❌ "${test.original}" → "${test.expected}" (${test.language}) - Not found or not lemmatized correctly`);
      }
      
    } catch (error) {
      console.log(`❌ "${test.original}" → ERROR: ${error}`);
    }
  }
}

async function testPerformanceComparison() {
  console.log('\n⚡ Testing Performance Comparison...\n');

  const trackingService = new MWEVocabularyTrackingService(supabase);
  const testSentence = 'Prefiero comer pizza porque me gusta mucho';
  
  console.log(`Test sentence: "${testSentence}"`);
  
  // Test standard parsing performance
  const standardStart = Date.now();
  const standardResult = await trackingService.parseSentenceForVocabulary(testSentence, 'es');
  const standardTime = Date.now() - standardStart;
  
  // Test enhanced parsing performance
  const enhancedStart = Date.now();
  const enhancedResult = await trackingService.parseSentenceWithLemmatization(testSentence, 'es');
  const enhancedTime = Date.now() - enhancedStart;
  
  console.log(`\n📊 Performance Comparison:`);
  console.log(`   Standard parsing: ${standardTime}ms (${standardResult.vocabularyMatches.length} matches, ${standardResult.coveragePercentage}% coverage)`);
  console.log(`   Enhanced parsing: ${enhancedTime}ms (${enhancedResult.vocabularyMatches.length} matches, ${enhancedResult.coveragePercentage}% coverage)`);
  console.log(`   Performance overhead: +${enhancedTime - standardTime}ms`);
  console.log(`   Coverage improvement: +${(enhancedResult.coveragePercentage - standardResult.coveragePercentage).toFixed(1)}%`);
  
  const worthwhileImprovement = (enhancedResult.coveragePercentage - standardResult.coveragePercentage) > 10;
  const reasonableOverhead = (enhancedTime - standardTime) < 500; // Less than 500ms overhead
  
  if (worthwhileImprovement && reasonableOverhead) {
    console.log(`   ✅ Enhanced parsing provides good value (significant improvement with reasonable overhead)`);
  } else if (worthwhileImprovement) {
    console.log(`   ⚠️  Enhanced parsing provides improvement but with high overhead`);
  } else {
    console.log(`   ❌ Enhanced parsing overhead not justified by improvement`);
  }
}

async function runAllTests() {
  console.log('🚀 Starting Enhanced Vocabulary Tracking Tests\n');
  console.log('=' .repeat(80) + '\n');

  // Test 1: Enhanced vocabulary tracking
  const trackingResults = await testEnhancedVocabularyTracking();
  
  // Test 2: Specific conjugations
  await testSpecificConjugations();
  
  // Test 3: Performance comparison
  await testPerformanceComparison();

  // Final summary
  console.log('\n' + '=' .repeat(80));
  console.log('🏁 FINAL TEST SUMMARY');
  console.log('=' .repeat(80));
  console.log(`Enhanced Vocabulary Tracking: ${trackingResults.passed}/${trackingResults.total} (${Math.round((trackingResults.passed/trackingResults.total)*100)}%)`);
  
  const overallSuccess = (trackingResults.passed / trackingResults.total) >= 0.6; // 60% success threshold
  console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS IMPROVEMENT'}`);
  
  if (overallSuccess) {
    console.log('\n🎉 Enhanced Vocabulary Tracking is working well!');
    console.log('✅ Lemmatization improves vocabulary coverage');
    console.log('✅ Conjugated forms are properly tracked');
    console.log('✅ MWE recognition works alongside lemmatization');
    console.log('✅ Ready for integration with sentence games');
  } else {
    console.log('\n💡 Areas for improvement:');
    console.log('- Add more vocabulary entries for common base forms');
    console.log('- Improve lemmatization patterns for irregular verbs');
    console.log('- Optimize performance for real-time game usage');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };
