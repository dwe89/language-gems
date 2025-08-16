/**
 * Test Script for Lemmatization Service
 * 
 * This script tests the lemmatization functionality to ensure:
 * 1. Spanish conjugated forms like "prefiero" are reduced to "preferir"
 * 2. French conjugated forms like "parle" are reduced to "parler"
 * 3. German conjugated forms like "spreche" are reduced to "sprechen"
 * 4. Sentence-level lemmatization works correctly
 * 5. Trackable lemmas are identified for vocabulary tracking
 */

import { createClient } from '@supabase/supabase-js';
import { LemmatizationService } from '../src/services/LemmatizationService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function testSpanishLemmatization() {
  console.log('🇪🇸 Testing Spanish Lemmatization...\n');

  const lemmatizer = new LemmatizationService(supabase);
  
  const spanishTests = [
    // Present tense -ir verbs
    { word: 'prefiero', expectedLemma: 'preferir', description: 'preferir (1st person singular)' },
    { word: 'prefieres', expectedLemma: 'preferir', description: 'preferir (2nd person singular)' },
    { word: 'prefiere', expectedLemma: 'preferir', description: 'preferir (3rd person singular)' },
    { word: 'preferimos', expectedLemma: 'preferir', description: 'preferir (1st person plural)' },
    { word: 'preferís', expectedLemma: 'preferir', description: 'preferir (2nd person plural)' },
    { word: 'prefieren', expectedLemma: 'preferir', description: 'preferir (3rd person plural)' },
    
    // Present tense -er verbs
    { word: 'como', expectedLemma: 'comer', description: 'comer (1st person singular)' },
    { word: 'comes', expectedLemma: 'comer', description: 'comer (2nd person singular)' },
    { word: 'come', expectedLemma: 'comer', description: 'comer (3rd person singular)' },
    { word: 'comemos', expectedLemma: 'comer', description: 'comer (1st person plural)' },
    { word: 'coméis', expectedLemma: 'comer', description: 'comer (2nd person plural)' },
    { word: 'comen', expectedLemma: 'comer', description: 'comer (3rd person plural)' },
    
    // Present tense -ar verbs
    { word: 'hablo', expectedLemma: 'hablar', description: 'hablar (1st person singular)' },
    { word: 'hablas', expectedLemma: 'hablar', description: 'hablar (2nd person singular)' },
    { word: 'habla', expectedLemma: 'hablar', description: 'hablar (3rd person singular)' },
    { word: 'hablamos', expectedLemma: 'hablar', description: 'hablar (1st person plural)' },
    { word: 'habláis', expectedLemma: 'hablar', description: 'hablar (2nd person plural)' },
    { word: 'hablan', expectedLemma: 'hablar', description: 'hablar (3rd person plural)' },
    
    // Past tense
    { word: 'hablé', expectedLemma: 'hablar', description: 'hablar (preterite 1st person)' },
    { word: 'hablaste', expectedLemma: 'hablar', description: 'hablar (preterite 2nd person)' },
    { word: 'habló', expectedLemma: 'hablar', description: 'hablar (preterite 3rd person)' },
    
    // Nouns
    { word: 'casas', expectedLemma: 'casa', description: 'casa (plural)' },
    { word: 'libros', expectedLemma: 'libro', description: 'libro (plural)' },
  ];

  let passedTests = 0;
  let totalTests = spanishTests.length;

  for (const test of spanishTests) {
    try {
      const result = await lemmatizer.lemmatizeWord(test.word, 'es');
      const passed = result.lemma === test.expectedLemma;
      
      console.log(`${passed ? '✅' : '❌'} "${test.word}" → "${result.lemma}" (expected: "${test.expectedLemma}")`);
      console.log(`   ${test.description} | Confidence: ${result.confidence} | Method: ${result.method}`);
      
      if (passed) passedTests++;
    } catch (error) {
      console.log(`❌ "${test.word}" → ERROR: ${error}`);
    }
  }

  console.log(`\n📊 Spanish Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
  return { passed: passedTests, total: totalTests };
}

async function testFrenchLemmatization() {
  console.log('🇫🇷 Testing French Lemmatization...\n');

  const lemmatizer = new LemmatizationService(supabase);
  
  const frenchTests = [
    // -er verbs
    { word: 'parle', expectedLemma: 'parler', description: 'parler (1st/3rd person singular)' },
    { word: 'parles', expectedLemma: 'parler', description: 'parler (2nd person singular)' },
    { word: 'parlons', expectedLemma: 'parler', description: 'parler (1st person plural)' },
    { word: 'parlez', expectedLemma: 'parler', description: 'parler (2nd person plural)' },
    { word: 'parlent', expectedLemma: 'parler', description: 'parler (3rd person plural)' },
    
    // -ir verbs
    { word: 'finis', expectedLemma: 'finir', description: 'finir (1st/2nd person singular)' },
    { word: 'finit', expectedLemma: 'finir', description: 'finir (3rd person singular)' },
    { word: 'finissons', expectedLemma: 'finir', description: 'finir (1st person plural)' },
    { word: 'finissez', expectedLemma: 'finir', description: 'finir (2nd person plural)' },
    { word: 'finissent', expectedLemma: 'finir', description: 'finir (3rd person plural)' },
    
    // Nouns
    { word: 'chats', expectedLemma: 'chat', description: 'chat (plural)' },
    { word: 'maisons', expectedLemma: 'maison', description: 'maison (plural)' },
  ];

  let passedTests = 0;
  let totalTests = frenchTests.length;

  for (const test of frenchTests) {
    try {
      const result = await lemmatizer.lemmatizeWord(test.word, 'fr');
      const passed = result.lemma === test.expectedLemma;
      
      console.log(`${passed ? '✅' : '❌'} "${test.word}" → "${result.lemma}" (expected: "${test.expectedLemma}")`);
      console.log(`   ${test.description} | Confidence: ${result.confidence} | Method: ${result.method}`);
      
      if (passed) passedTests++;
    } catch (error) {
      console.log(`❌ "${test.word}" → ERROR: ${error}`);
    }
  }

  console.log(`\n📊 French Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
  return { passed: passedTests, total: totalTests };
}

async function testGermanLemmatization() {
  console.log('🇩🇪 Testing German Lemmatization...\n');

  const lemmatizer = new LemmatizationService(supabase);
  
  const germanTests = [
    // Present tense verbs
    { word: 'spreche', expectedLemma: 'sprechen', description: 'sprechen (1st person singular)' },
    { word: 'sprichst', expectedLemma: 'sprechen', description: 'sprechen (2nd person singular)' },
    { word: 'spricht', expectedLemma: 'sprechen', description: 'sprechen (3rd person singular)' },
    { word: 'sprechen', expectedLemma: 'sprechen', description: 'sprechen (infinitive/plural)' },
    
    { word: 'lebe', expectedLemma: 'leben', description: 'leben (1st person singular)' },
    { word: 'lebst', expectedLemma: 'leben', description: 'leben (2nd person singular)' },
    { word: 'lebt', expectedLemma: 'leben', description: 'leben (3rd person singular)' },
    
    // Nouns (case declensions)
    { word: 'hauses', expectedLemma: 'haus', description: 'Haus (genitive)' },
    { word: 'kindes', expectedLemma: 'kind', description: 'Kind (genitive)' },
    { word: 'kinder', expectedLemma: 'kind', description: 'Kind (plural)' },
  ];

  let passedTests = 0;
  let totalTests = germanTests.length;

  for (const test of germanTests) {
    try {
      const result = await lemmatizer.lemmatizeWord(test.word, 'de');
      const passed = result.lemma === test.expectedLemma;
      
      console.log(`${passed ? '✅' : '❌'} "${test.word}" → "${result.lemma}" (expected: "${test.expectedLemma}")`);
      console.log(`   ${test.description} | Confidence: ${result.confidence} | Method: ${result.method}`);
      
      if (passed) passedTests++;
    } catch (error) {
      console.log(`❌ "${test.word}" → ERROR: ${error}`);
    }
  }

  console.log(`\n📊 German Results: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)\n`);
  return { passed: passedTests, total: totalTests };
}

async function testSentenceLemmatization() {
  console.log('📝 Testing Sentence-Level Lemmatization...\n');

  const lemmatizer = new LemmatizationService(supabase);
  
  const sentenceTests = [
    {
      sentence: 'Prefiero ir al cine',
      language: 'es',
      expectedLemmas: ['preferir', 'ir', 'al', 'cine'],
      description: 'Spanish sentence with conjugated verb'
    },
    {
      sentence: 'Je parle français très bien',
      language: 'fr',
      expectedLemmas: ['je', 'parler', 'français', 'très', 'bien'],
      description: 'French sentence with conjugated verb'
    },
    {
      sentence: 'Ich spreche Deutsch gern',
      language: 'de',
      expectedLemmas: ['ich', 'sprechen', 'deutsch', 'gern'],
      description: 'German sentence with conjugated verb'
    }
  ];

  let passedTests = 0;
  let totalTests = sentenceTests.length;

  for (const test of sentenceTests) {
    try {
      const result = await lemmatizer.lemmatizeSentence(test.sentence, test.language);
      
      console.log(`📝 "${test.sentence}" (${test.language})`);
      console.log(`   ${test.description}`);
      console.log(`   Processing time: ${result.processingTimeMs}ms`);
      console.log(`   Lemmatized words:`);
      
      let correctLemmas = 0;
      result.lemmatizedWords.forEach((word, index) => {
        const expectedLemma = test.expectedLemmas[index];
        const isCorrect = word.lemma === expectedLemma;
        if (isCorrect) correctLemmas++;
        
        console.log(`     "${word.originalWord}" → "${word.lemma}" ${isCorrect ? '✅' : '❌'} (expected: "${expectedLemma}")`);
      });
      
      const accuracy = correctLemmas / test.expectedLemmas.length;
      console.log(`   Accuracy: ${Math.round(accuracy * 100)}% (${correctLemmas}/${test.expectedLemmas.length})`);
      
      if (accuracy >= 0.8) passedTests++; // 80% accuracy threshold
      
    } catch (error) {
      console.log(`❌ "${test.sentence}" → ERROR: ${error}`);
    }
    console.log('');
  }

  console.log(`📊 Sentence Results: ${passedTests}/${totalTests} tests passed\n`);
  return { passed: passedTests, total: totalTests };
}

async function testTrackableLemmas() {
  console.log('🎯 Testing Trackable Lemma Identification...\n');

  const lemmatizer = new LemmatizationService(supabase);
  
  const trackingTests = [
    {
      sentence: 'Prefiero ir al cine',
      language: 'es',
      description: 'Should identify trackable lemmas that exist in vocabulary'
    },
    {
      sentence: 'Me gusta comer pizza',
      language: 'es',
      description: 'Should identify MWE "me gusta" and lemmatized "comer"'
    }
  ];

  for (const test of trackingTests) {
    try {
      console.log(`🎯 "${test.sentence}" (${test.language})`);
      console.log(`   ${test.description}`);
      
      const trackableLemmas = await lemmatizer.getTrackableLemmas(test.sentence, test.language);
      
      if (trackableLemmas.length > 0) {
        console.log(`   ✅ Found ${trackableLemmas.length} trackable lemmas:`);
        trackableLemmas.forEach(lemma => {
          console.log(`     "${lemma.originalWord}" → "${lemma.lemma}" (ID: ${lemma.vocabularyId}, confidence: ${lemma.confidence})`);
        });
      } else {
        console.log(`   ⚠️  No trackable lemmas found (may need vocabulary data)`);
      }
      
    } catch (error) {
      console.log(`❌ "${test.sentence}" → ERROR: ${error}`);
    }
    console.log('');
  }
}

async function runAllTests() {
  console.log('🚀 Starting Lemmatization Service Tests\n');
  console.log('=' .repeat(60) + '\n');

  // Test individual language lemmatization
  const spanishResults = await testSpanishLemmatization();
  const frenchResults = await testFrenchLemmatization();
  const germanResults = await testGermanLemmatization();
  
  // Test sentence-level lemmatization
  const sentenceResults = await testSentenceLemmatization();
  
  // Test trackable lemma identification
  await testTrackableLemmas();

  // Final summary
  console.log('=' .repeat(60));
  console.log('🏁 FINAL TEST SUMMARY');
  console.log('=' .repeat(60));
  
  const totalPassed = spanishResults.passed + frenchResults.passed + germanResults.passed + sentenceResults.passed;
  const totalTests = spanishResults.total + frenchResults.total + germanResults.total + sentenceResults.total;
  
  console.log(`Spanish Lemmatization: ${spanishResults.passed}/${spanishResults.total} (${Math.round((spanishResults.passed/spanishResults.total)*100)}%)`);
  console.log(`French Lemmatization: ${frenchResults.passed}/${frenchResults.total} (${Math.round((frenchResults.passed/frenchResults.total)*100)}%)`);
  console.log(`German Lemmatization: ${germanResults.passed}/${germanResults.total} (${Math.round((germanResults.passed/germanResults.total)*100)}%)`);
  console.log(`Sentence Processing: ${sentenceResults.passed}/${sentenceResults.total} (${Math.round((sentenceResults.passed/sentenceResults.total)*100)}%)`);
  console.log(`\nOverall: ${totalPassed}/${totalTests} tests passed (${Math.round((totalPassed/totalTests)*100)}%)`);
  
  const overallSuccess = (totalPassed / totalTests) >= 0.7; // 70% success threshold
  console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS IMPROVEMENT'}`);
  
  if (overallSuccess) {
    console.log('\n🎉 Lemmatization Service is working well!');
    console.log('✅ Conjugated forms are properly reduced to base forms');
    console.log('✅ Multi-language support is functional');
    console.log('✅ Sentence-level processing works correctly');
    console.log('✅ Ready for integration with vocabulary tracking');
  } else {
    console.log('\n💡 Recommendations for improvement:');
    console.log('- Add more irregular verb patterns');
    console.log('- Improve confidence scoring');
    console.log('- Add dictionary lookup for common irregular forms');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests };
