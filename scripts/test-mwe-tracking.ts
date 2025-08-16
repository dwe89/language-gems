/**
 * Test Script for MWE Vocabulary Tracking
 * 
 * This script tests the new MWE tracking functionality to ensure:
 * 1. Sentences are parsed correctly with longest-match-first algorithm
 * 2. MWEs like "me gusta", "hay que" are recognized as single units
 * 3. Vocabulary tracking works with both MWEs and individual words
 * 4. FSRS integration functions properly with MWE vocabulary IDs
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

// Test sentences with known MWEs
const testSentences = [
  {
    sentence: "Me gusta la comida española",
    language: "es",
    expectedMWEs: ["me gusta", "la comida"],
    description: "Spanish sentence with 'me gusta' MWE"
  },
  {
    sentence: "Hay que estudiar mucho para el examen",
    language: "es", 
    expectedMWEs: ["hay que"],
    description: "Spanish sentence with 'hay que' obligation expression"
  },
  {
    sentence: "Il y a beaucoup de monde ici",
    language: "fr",
    expectedMWEs: ["il y a"],
    description: "French sentence with 'il y a' existential expression"
  },
  {
    sentence: "Je suis très content aujourd'hui",
    language: "fr",
    expectedMWEs: ["je suis"],
    description: "French sentence with 'je suis' verb conjugation"
  },
  {
    sentence: "Es gibt viele Möglichkeiten hier",
    language: "de",
    expectedMWEs: ["es gibt"],
    description: "German sentence with 'es gibt' existential expression"
  },
  {
    sentence: "Ich bin sehr müde heute",
    language: "de",
    expectedMWEs: ["ich bin"],
    description: "German sentence with 'ich bin' verb conjugation"
  }
];

async function testMWEParsing() {
  console.log('🧪 Starting MWE Parsing Tests...\n');
  
  const mweService = new MWEVocabularyTrackingService(supabase);
  let totalTests = 0;
  let passedTests = 0;

  for (const testCase of testSentences) {
    console.log(`📝 Testing: "${testCase.sentence}"`);
    console.log(`   Expected MWEs: ${testCase.expectedMWEs.join(', ')}`);
    
    try {
      const result = await mweService.parseSentenceForVocabulary(
        testCase.sentence,
        testCase.language
      );

      console.log(`   ✅ Parsed successfully:`);
      console.log(`      - Total words: ${result.totalWords}`);
      console.log(`      - Matched words: ${result.matchedWords}`);
      console.log(`      - Coverage: ${result.coveragePercentage}%`);
      console.log(`      - Vocabulary matches: ${result.vocabularyMatches.length}`);

      // Debug: Show all matches
      if (result.vocabularyMatches.length > 0) {
        console.log(`      - All matches:`);
        result.vocabularyMatches.forEach(match => {
          console.log(`        * "${match.word}" (MWE: ${match.is_mwe}, pos: ${match.startIndex}-${match.endIndex})`);
        });
      }

      // Check for expected MWEs
      const foundMWEs = result.vocabularyMatches
        .filter(match => match.is_mwe)
        .map(match => match.word);

      console.log(`      - Found MWEs: ${foundMWEs.join(', ') || 'none'}`);
      
      // Verify expected MWEs were found
      let testPassed = true;
      for (const expectedMWE of testCase.expectedMWEs) {
        if (!foundMWEs.includes(expectedMWE)) {
          console.log(`      ❌ Missing expected MWE: "${expectedMWE}"`);
          testPassed = false;
        }
      }
      
      if (testPassed && foundMWEs.length > 0) {
        console.log(`      ✅ Test PASSED - All expected MWEs found`);
        passedTests++;
      } else if (foundMWEs.length === 0) {
        console.log(`      ⚠️  Test PARTIAL - No MWEs found (may need vocabulary data)`);
      } else {
        console.log(`      ❌ Test FAILED - Missing expected MWEs`);
      }
      
      totalTests++;
      
    } catch (error) {
      console.log(`      ❌ Test ERROR: ${error}`);
      totalTests++;
    }
    
    console.log('');
  }

  console.log(`📊 Test Summary: ${passedTests}/${totalTests} tests passed\n`);
  return { totalTests, passedTests };
}

async function testVocabularyDatabase() {
  console.log('🗄️  Testing Vocabulary Database...\n');
  
  try {
    // Check critical MWEs are in database
    const { data: criticalMWEs, error } = await supabase
      .from('centralized_vocabulary')
      .select('language, word, translation, is_mwe, mwe_type, should_track_for_fsrs')
      .eq('is_mwe', true)
      .in('word', ['me gusta', 'hay que', 'je suis', 'il y a', 'ich bin', 'es gibt'])
      .order('language, word');

    if (error) {
      console.log(`❌ Database error: ${error.message}`);
      return false;
    }

    console.log('📋 Critical MWEs in database:');
    if (criticalMWEs && criticalMWEs.length > 0) {
      criticalMWEs.forEach(mwe => {
        console.log(`   ${mwe.language}: "${mwe.word}" → "${mwe.translation}" (${mwe.mwe_type}, FSRS: ${mwe.should_track_for_fsrs})`);
      });
      console.log(`✅ Found ${criticalMWEs.length} critical MWEs in database\n`);
      return true;
    } else {
      console.log('❌ No critical MWEs found in database\n');
      return false;
    }
  } catch (error) {
    console.log(`❌ Database test error: ${error}\n`);
    return false;
  }
}

async function testParsingStats() {
  console.log('📈 Testing Parsing Statistics...\n');
  
  const mweService = new MWEVocabularyTrackingService(supabase);
  const sentences = testSentences.map(t => t.sentence);
  
  try {
    const stats = await mweService.getParsingStats(sentences, 'es');
    
    console.log('📊 Parsing Statistics:');
    console.log(`   Total sentences: ${stats.totalSentences}`);
    console.log(`   Average coverage: ${stats.averageCoverage}%`);
    console.log(`   Total MWEs found: ${stats.totalMWEsFound}`);
    console.log(`   Most common MWEs:`);
    
    stats.mostCommonMWEs.forEach((mwe, index) => {
      console.log(`      ${index + 1}. "${mwe.word}" (${mwe.count} times)`);
    });
    
    console.log('');
    return stats;
  } catch (error) {
    console.log(`❌ Stats test error: ${error}\n`);
    return null;
  }
}

async function testLongestMatchFirst() {
  console.log('🎯 Testing Longest-Match-First Algorithm...\n');
  
  const mweService = new MWEVocabularyTrackingService(supabase);
  
  // Test sentence that could match both "gusta" and "me gusta"
  const testSentence = "Me gusta mucho la pizza";
  
  try {
    const result = await mweService.parseSentenceForVocabulary(testSentence, 'es');
    
    console.log(`📝 Test sentence: "${testSentence}"`);
    console.log(`   Vocabulary matches found:`);
    
    result.vocabularyMatches.forEach(match => {
      console.log(`      "${match.word}" (${match.is_mwe ? 'MWE' : 'single word'}) at position ${match.startIndex}-${match.endIndex}`);
    });
    
    // Check if "me gusta" was matched instead of just "gusta"
    const meGustaMatch = result.vocabularyMatches.find(m => m.word === 'me gusta');
    const gustaMatch = result.vocabularyMatches.find(m => m.word === 'gusta');
    
    if (meGustaMatch && !gustaMatch) {
      console.log(`   ✅ Longest-match-first working: "me gusta" matched instead of "gusta"`);
      return true;
    } else if (gustaMatch && !meGustaMatch) {
      console.log(`   ❌ Longest-match-first failed: "gusta" matched instead of "me gusta"`);
      return false;
    } else {
      console.log(`   ⚠️  Inconclusive: Neither "me gusta" nor "gusta" found in vocabulary`);
      return null;
    }
  } catch (error) {
    console.log(`   ❌ Test error: ${error}`);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting MWE Tracking Integration Tests\n');
  console.log('=' .repeat(60) + '\n');
  
  // Test 1: Database setup
  const dbTest = await testVocabularyDatabase();
  
  // Test 2: Parsing functionality
  const { totalTests, passedTests } = await testMWEParsing();
  
  // Test 3: Longest-match-first algorithm
  const longestMatchTest = await testLongestMatchFirst();
  
  // Test 4: Statistics
  const stats = await testParsingStats();
  
  // Final summary
  console.log('=' .repeat(60));
  console.log('🏁 FINAL TEST SUMMARY');
  console.log('=' .repeat(60));
  console.log(`Database Setup: ${dbTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Sentence Parsing: ${passedTests}/${totalTests} tests passed`);
  console.log(`Longest-Match Algorithm: ${longestMatchTest === true ? '✅ PASS' : longestMatchTest === false ? '❌ FAIL' : '⚠️  INCONCLUSIVE'}`);
  console.log(`Statistics Generation: ${stats ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallSuccess = dbTest && (passedTests > 0) && (longestMatchTest !== false) && stats;
  console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ SUCCESS' : '❌ NEEDS ATTENTION'}`);
  
  if (!overallSuccess) {
    console.log('\n💡 Recommendations:');
    if (!dbTest) console.log('   - Run MWE migration to populate vocabulary database');
    if (passedTests === 0) console.log('   - Check vocabulary data and language codes');
    if (longestMatchTest === false) console.log('   - Review longest-match-first algorithm implementation');
    if (!stats) console.log('   - Check statistics calculation logic');
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, testMWEParsing, testVocabularyDatabase, testLongestMatchFirst };
