/**
 * Debug Script for Lemmatization Issues
 * 
 * This script helps debug why lemmatization isn't working in the enhanced vocabulary tracking
 */

import { createClient } from '@supabase/supabase-js';
import { LemmatizationService } from '../src/services/LemmatizationService';
import { MWEVocabularyTrackingService } from '../src/services/MWEVocabularyTrackingService';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function debugLemmatization() {
  console.log('🔍 Debugging Lemmatization Process...\n');

  const lemmatizer = new LemmatizationService(supabase);
  const trackingService = new MWEVocabularyTrackingService(supabase);

  // Test individual lemmatization
  console.log('📋 Step 1: Testing individual word lemmatization...');
  
  const testWords = [
    { word: 'prefiero', language: 'es', expected: 'preferir' },
    { word: 'comer', language: 'es', expected: 'comer' },
    { word: 'pizza', language: 'es', expected: 'pizza' }
  ];

  for (const test of testWords) {
    try {
      const result = await lemmatizer.lemmatizeWord(test.word, test.language);
      console.log(`   "${test.word}" → "${result.lemma}" (expected: "${test.expected}")`);
      console.log(`      Method: ${result.method}, Confidence: ${result.confidence}`);
      
      // Check if the lemma exists in vocabulary
      const { data: vocabCheck, error } = await supabase
        .from('centralized_vocabulary')
        .select('word, translation')
        .eq('word', result.lemma)
        .eq('language', test.language)
        .eq('should_track_for_fsrs', true)
        .single();
      
      if (!error && vocabCheck) {
        console.log(`      ✅ Lemma "${result.lemma}" found in vocabulary: "${vocabCheck.translation}"`);
      } else {
        console.log(`      ❌ Lemma "${result.lemma}" NOT found in vocabulary`);
      }
    } catch (error) {
      console.log(`   ❌ Error lemmatizing "${test.word}": ${error}`);
    }
    console.log('');
  }

  // Test sentence lemmatization
  console.log('📋 Step 2: Testing sentence lemmatization...');
  
  const testSentence = 'Prefiero comer pizza';
  console.log(`   Sentence: "${testSentence}"`);
  
  try {
    const sentenceResult = await lemmatizer.lemmatizeSentence(testSentence, 'es');
    console.log(`   Processing time: ${sentenceResult.processingTimeMs}ms`);
    console.log(`   Lemmatized words:`);
    
    sentenceResult.lemmatizedWords.forEach(word => {
      console.log(`      "${word.originalWord}" → "${word.lemma}" (${word.method}, confidence: ${word.confidence})`);
    });
  } catch (error) {
    console.log(`   ❌ Error in sentence lemmatization: ${error}`);
  }

  // Test trackable lemmas
  console.log('\n📋 Step 3: Testing trackable lemma identification...');
  
  try {
    const trackableLemmas = await lemmatizer.getTrackableLemmas(testSentence, 'es');
    console.log(`   Found ${trackableLemmas.length} trackable lemmas:`);
    
    trackableLemmas.forEach(lemma => {
      console.log(`      "${lemma.originalWord}" → "${lemma.lemma}" (ID: ${lemma.vocabularyId})`);
    });
  } catch (error) {
    console.log(`   ❌ Error getting trackable lemmas: ${error}`);
  }

  // Test enhanced vocabulary tracking
  console.log('\n📋 Step 4: Testing enhanced vocabulary tracking...');
  
  try {
    const enhancedResult = await trackingService.parseSentenceWithLemmatization(testSentence, 'es');
    console.log(`   Enhanced parsing results:`);
    console.log(`      - Matches: ${enhancedResult.vocabularyMatches.length}`);
    console.log(`      - Coverage: ${enhancedResult.coveragePercentage}%`);
    console.log(`      - Found words: ${enhancedResult.vocabularyMatches.map(m => m.word).join(', ')}`);
    
    // Show lemmatization details
    const lemmatizedMatches = enhancedResult.vocabularyMatches.filter(m => m.originalForm);
    if (lemmatizedMatches.length > 0) {
      console.log(`      - Lemmatized matches:`);
      lemmatizedMatches.forEach(match => {
        console.log(`        * "${match.originalForm}" → "${match.lemmatizedForm}" (${match.lemmatizationMethod})`);
      });
    } else {
      console.log(`      - No lemmatized matches found`);
    }
  } catch (error) {
    console.log(`   ❌ Error in enhanced vocabulary tracking: ${error}`);
  }

  // Test vocabulary lookup
  console.log('\n📋 Step 5: Testing vocabulary lookup...');
  
  const testLemmas = ['preferir', 'comer', 'pizza'];
  for (const lemma of testLemmas) {
    try {
      const { data: vocabData, error } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, translation, should_track_for_fsrs')
        .eq('word', lemma)
        .eq('language', 'es')
        .eq('should_track_for_fsrs', true);
      
      if (!error && vocabData && vocabData.length > 0) {
        console.log(`   ✅ "${lemma}" found in vocabulary (${vocabData.length} entries):`);
        vocabData.forEach(entry => {
          console.log(`      - ID: ${entry.id}, Translation: "${entry.translation}"`);
        });
      } else {
        console.log(`   ❌ "${lemma}" NOT found in vocabulary`);
        if (error) console.log(`      Error: ${error.message}`);
      }
    } catch (error) {
      console.log(`   ❌ Error looking up "${lemma}": ${error}`);
    }
  }
}

async function debugWordsMatchWithLemmatization() {
  console.log('\n🔍 Debugging wordsMatchWithLemmatization...\n');

  const trackingService = new MWEVocabularyTrackingService(supabase);
  
  // Test the private method by accessing it through reflection
  const testCases = [
    {
      sentenceWords: ['prefiero'],
      vocabWords: ['preferir'],
      language: 'es',
      description: 'Single word: prefiero vs preferir'
    },
    {
      sentenceWords: ['me', 'gusta'],
      vocabWords: ['me', 'gusta'],
      language: 'es',
      description: 'MWE: me gusta (exact match)'
    }
  ];

  for (const testCase of testCases) {
    console.log(`Testing: ${testCase.description}`);
    console.log(`   Sentence words: [${testCase.sentenceWords.join(', ')}]`);
    console.log(`   Vocab words: [${testCase.vocabWords.join(', ')}]`);
    
    try {
      // We can't access private methods directly, so let's test the lemmatization service directly
      const lemmatizer = new LemmatizationService(supabase);
      
      for (let i = 0; i < testCase.sentenceWords.length; i++) {
        const sentenceWord = testCase.sentenceWords[i];
        const vocabWord = testCase.vocabWords[i];
        
        if (sentenceWord === vocabWord) {
          console.log(`   ✅ Direct match: "${sentenceWord}" === "${vocabWord}"`);
        } else {
          const lemmaResult = await lemmatizer.lemmatizeWord(sentenceWord, testCase.language);
          console.log(`   🔄 Lemmatization: "${sentenceWord}" → "${lemmaResult.lemma}"`);
          
          if (lemmaResult.lemma === vocabWord) {
            console.log(`   ✅ Lemma match: "${lemmaResult.lemma}" === "${vocabWord}"`);
          } else {
            console.log(`   ❌ No match: "${lemmaResult.lemma}" !== "${vocabWord}"`);
          }
        }
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
    }
    console.log('');
  }
}

async function runDebugTests() {
  console.log('🚀 Starting Lemmatization Debug Tests\n');
  console.log('=' .repeat(60) + '\n');

  await debugLemmatization();
  await debugWordsMatchWithLemmatization();

  console.log('\n' + '=' .repeat(60));
  console.log('🏁 DEBUG COMPLETE');
  console.log('=' .repeat(60));
}

// Run tests if this script is executed directly
if (require.main === module) {
  runDebugTests().catch(console.error);
}

export { runDebugTests };
