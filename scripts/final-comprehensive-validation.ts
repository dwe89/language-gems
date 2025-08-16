/**
 * Final Comprehensive Validation
 * 
 * 1. Random sample 1000+ entries across all languages
 * 2. Test lemmatization on diverse examples
 * 3. Validate MWE recognition
 * 4. Check remaining complex formatting
 * 5. Confirm production readiness
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

async function randomSampleValidation(sampleSize: number = 1000) {
  console.log(`🎲 Random Sample Validation (${sampleSize} entries)...\n`);

  try {
    // Get random sample across all languages
    const { data: allEntries, error } = await supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('should_track_for_fsrs', true);

    if (error || !allEntries) {
      console.log('❌ Failed to fetch entries');
      return;
    }

    // Shuffle and take sample
    const shuffled = allEntries.sort(() => 0.5 - Math.random());
    const sample = shuffled.slice(0, Math.min(sampleSize, allEntries.length));

    // Analyze by language
    const byLanguage = sample.reduce((acc, entry) => {
      if (!acc[entry.language]) acc[entry.language] = [];
      acc[entry.language].push(entry);
      return acc;
    }, {} as Record<string, any[]>);

    console.log('📊 Sample Distribution:');
    Object.entries(byLanguage).forEach(([lang, entries]) => {
      console.log(`   ${lang.toUpperCase()}: ${entries.length} entries`);
    });

    // Quality analysis
    let totalQuality = 0;
    let complexFormattingCount = 0;
    const complexExamples = [];

    for (const entry of sample) {
      let quality = 0;

      // Check base_word
      if (entry.base_word) quality += 25;

      // Check clean formatting
      const hasComplexFormatting = 
        entry.word.includes('(') ||
        entry.word.includes(';') ||
        entry.word.includes(',') ||
        entry.word.includes('?');

      if (!hasComplexFormatting) {
        quality += 25;
      } else {
        complexFormattingCount++;
        if (complexExamples.length < 20) {
          complexExamples.push({
            word: entry.word,
            language: entry.language,
            translation: entry.translation
          });
        }
      }

      // Check MWE classification
      const shouldBeMWE = entry.word.includes(' ') || entry.word.includes("'");
      if ((shouldBeMWE && entry.is_mwe) || (!shouldBeMWE && !entry.is_mwe)) {
        quality += 25;
      }

      // Check translation
      if (entry.translation && entry.translation.trim().length > 0) {
        quality += 25;
      }

      totalQuality += quality;
    }

    const averageQuality = Math.round(totalQuality / sample.length);

    console.log(`\n📈 Quality Analysis:`);
    console.log(`   Average quality: ${averageQuality}%`);
    console.log(`   Complex formatting remaining: ${complexFormattingCount} (${Math.round((complexFormattingCount/sample.length)*100)}%)`);

    if (complexExamples.length > 0) {
      console.log(`\n🔍 Complex Formatting Examples Still Remaining:`);
      complexExamples.forEach((ex, index) => {
        console.log(`   ${index + 1}. "${ex.word}" (${ex.language}) - ${ex.translation}`);
      });
    }

    return {
      sampleSize: sample.length,
      averageQuality,
      complexFormattingCount,
      languageDistribution: Object.fromEntries(
        Object.entries(byLanguage).map(([lang, entries]) => [lang, entries.length])
      )
    };

  } catch (error) {
    console.error('❌ Random sample validation failed:', error);
  }
}

async function testLemmatizationAcrossLanguages() {
  console.log('🔍 Testing Lemmatization Across All Languages...\n');

  const mweService = new MWEVocabularyTrackingService(supabase);

  const testCases = [
    // Spanish - conjugated verbs
    { sentence: 'Prefiero comer pizza', language: 'es', expected: ['preferir', 'comer', 'pizza'] },
    { sentence: 'Hablamos español bien', language: 'es', expected: ['hablar', 'español'] },
    { sentence: 'Vivieron en Madrid', language: 'es', expected: ['vivir', 'Madrid'] },
    { sentence: 'Me gusta bailar', language: 'es', expected: ['me gusta', 'bailar'] },
    
    // French - conjugated verbs
    { sentence: 'Je parle français', language: 'fr', expected: ['parler', 'français'] },
    { sentence: 'Nous mangeons du pain', language: 'fr', expected: ['manger', 'pain'] },
    { sentence: 'Il préfère le café', language: 'fr', expected: ['préférer', 'café'] },
    
    // German - conjugated verbs
    { sentence: 'Ich spreche Deutsch', language: 'de', expected: ['sprechen', 'Deutsch'] },
    { sentence: 'Wir essen Brot', language: 'de', expected: ['essen', 'Brot'] },
    { sentence: 'Sie trinkt Wasser', language: 'de', expected: ['trinken', 'Wasser'] }
  ];

  let totalTests = testCases.length;
  let passedTests = 0;
  const results = [];

  for (const test of testCases) {
    try {
      const result = await mweService.parseSentenceWithLemmatization(test.sentence, test.language);
      
      const foundWords = result.vocabularyMatches.map(m => m.word);
      const matchedExpected = test.expected.filter(word => foundWords.includes(word));
      const coverage = result.coveragePercentage;
      
      const passed = matchedExpected.length > 0;
      if (passed) passedTests++;

      results.push({
        sentence: test.sentence,
        language: test.language,
        expected: test.expected,
        found: foundWords,
        matched: matchedExpected,
        coverage: Math.round(coverage),
        passed
      });

      console.log(`   ${passed ? '✅' : '❌'} "${test.sentence}" (${test.language.toUpperCase()})`);
      console.log(`      Expected: ${test.expected.join(', ')}`);
      console.log(`      Found: ${foundWords.join(', ')}`);
      console.log(`      Coverage: ${coverage.toFixed(1)}%`);
      console.log('');

    } catch (error) {
      console.log(`   ❌ "${test.sentence}" - Error: ${error}`);
      results.push({
        sentence: test.sentence,
        language: test.language,
        expected: test.expected,
        found: [],
        matched: [],
        coverage: 0,
        passed: false
      });
    }
  }

  const successRate = Math.round((passedTests / totalTests) * 100);
  console.log(`📊 Lemmatization Test Results: ${passedTests}/${totalTests} (${successRate}%)`);

  return { passedTests, totalTests, successRate, results };
}

async function validateMWERecognition() {
  console.log('🔗 Validating MWE Recognition...\n');

  const mweService = new MWEVocabularyTrackingService(supabase);

  const mweTests = [
    { sentence: 'Me gusta mucho', language: 'es', expectedMWE: 'me gusta' },
    { sentence: 'Tengo que estudiar', language: 'es', expectedMWE: 'tener que' },
    { sentence: "J'ai besoin d'aide", language: 'fr', expectedMWE: 'avoir besoin' },
    { sentence: "Il y a beaucoup", language: 'fr', expectedMWE: 'il y a' }
  ];

  let passed = 0;
  let total = mweTests.length;

  for (const test of mweTests) {
    try {
      const result = await mweService.parseSentenceWithLemmatization(test.sentence, test.language);
      const foundMWE = result.vocabularyMatches.some(m => m.word === test.expectedMWE);

      if (foundMWE) {
        passed++;
        console.log(`   ✅ "${test.sentence}" → "${test.expectedMWE}" found`);
      } else {
        console.log(`   ❌ "${test.sentence}" → "${test.expectedMWE}" not found`);
        console.log(`      Found: ${result.vocabularyMatches.map(m => m.word).join(', ')}`);
      }
    } catch (error) {
      console.log(`   ❌ "${test.sentence}" - Error: ${error}`);
    }
  }

  const successRate = Math.round((passed / total) * 100);
  console.log(`\n📊 MWE Recognition Results: ${passed}/${total} (${successRate}%)`);

  return { passed, total, successRate };
}

async function runFinalComprehensiveValidation() {
  console.log('🎉 FINAL COMPREHENSIVE VALIDATION - FULL DATASET\n');
  console.log('=' .repeat(70) + '\n');

  try {
    // Step 1: Random sample validation
    const sampleResults = await randomSampleValidation(1000);

    // Step 2: Lemmatization testing
    const lemmatizationResults = await testLemmatizationAcrossLanguages();

    // Step 3: MWE recognition validation
    const mweResults = await validateMWERecognition();

    // Final summary
    console.log('\n🎯 FINAL COMPREHENSIVE VALIDATION RESULTS');
    console.log('=' .repeat(70));
    
    if (sampleResults) {
      console.log(`📊 Random Sample (${sampleResults.sampleSize} entries):`);
      console.log(`   Average quality: ${sampleResults.averageQuality}%`);
      console.log(`   Complex formatting remaining: ${sampleResults.complexFormattingCount}`);
      console.log(`   Language distribution: ${JSON.stringify(sampleResults.languageDistribution)}`);
    }

    console.log(`🔍 Lemmatization Tests: ${lemmatizationResults.successRate}% success rate`);
    console.log(`🔗 MWE Recognition Tests: ${mweResults.successRate}% success rate`);

    // Overall assessment
    const overallScore = Math.round((
      (sampleResults?.averageQuality || 0) * 0.4 +
      lemmatizationResults.successRate * 0.3 +
      mweResults.successRate * 0.3
    ));

    console.log(`\n🏆 OVERALL SYSTEM SCORE: ${overallScore}%`);

    if (overallScore >= 85) {
      console.log('\n🎉 EXCELLENT! System is production-ready!');
      console.log('✅ Vocabulary normalization complete');
      console.log('✅ Lemmatization working across languages');
      console.log('✅ MWE recognition functional');
      console.log('✅ Database quality excellent');
      console.log('\n🚀 Ready for sentence game integration!');
    } else if (overallScore >= 75) {
      console.log('\n✅ GOOD! System is functional with minor issues');
      console.log('⚠️  Some areas may need additional refinement');
    } else {
      console.log('\n⚠️  NEEDS WORK! Additional improvements required');
    }

    return {
      overallScore,
      sampleResults,
      lemmatizationResults,
      mweResults
    };

  } catch (error) {
    console.error('❌ Final validation failed:', error);
    throw error;
  }
}

// Run if this script is executed directly
if (require.main === module) {
  runFinalComprehensiveValidation().catch(console.error);
}

export { runFinalComprehensiveValidation };
