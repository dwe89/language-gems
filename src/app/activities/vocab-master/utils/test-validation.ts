/**
 * Test file for enhanced answer validation
 * Run this to verify the validation system works correctly
 */

import { validateAnswerEnhanced, getAnswerSimilarity } from './answerValidation';

// Test cases for enhanced validation
const testCases = [
  // Basic matching
  { user: 'happy', correct: 'happy', expected: true, description: 'Exact match' },
  { user: 'Happy', correct: 'happy', expected: true, description: 'Case insensitive' },
  { user: 'HAPPY', correct: 'happy', expected: true, description: 'All caps' },
  
  // Synonyms
  { user: 'joyful', correct: 'happy', expected: true, description: 'Synonym match' },
  { user: 'cheerful', correct: 'happy', expected: true, description: 'Another synonym' },
  { user: 'glad', correct: 'happy', expected: true, description: 'Third synonym' },
  
  // Regional variations
  { user: 'grey', correct: 'gray', expected: true, description: 'British to American' },
  { user: 'color', correct: 'colour', expected: true, description: 'American to British' },
  { user: 'center', correct: 'centre', expected: true, description: 'American spelling' },
  
  // Parenthetical variations
  { user: 'athlete', correct: 'athlete (female)', expected: true, description: 'Parenthetical content ignored' },
  { user: 'athlete (female)', correct: 'athlete', expected: true, description: 'Reverse parenthetical' },
  
  // Punctuation and accents
  { user: 'hello!', correct: 'hello', expected: true, description: 'Punctuation removed' },
  { user: 'café', correct: 'cafe', expected: true, description: 'Accents normalized' },
  
  // Multiple answers with OR
  { user: 'cat', correct: 'cat or dog', expected: true, description: 'OR variation - first option' },
  { user: 'dog', correct: 'cat or dog', expected: true, description: 'OR variation - second option' },
  
  // Slash variations
  { user: 'he', correct: 'he/she', expected: true, description: 'Slash variation - first' },
  { user: 'she', correct: 'he/she', expected: true, description: 'Slash variation - second' },
  
  // Contractions
  { user: 'do not', correct: "don't", expected: true, description: 'Contraction expansion' },
  { user: "can't", correct: 'cannot', expected: true, description: 'Contraction to full form' },
  
  // Negative cases
  { user: 'sad', correct: 'happy', expected: false, description: 'Opposite word' },
  { user: 'completely wrong', correct: 'happy', expected: false, description: 'Unrelated word' },
  { user: '', correct: 'happy', expected: false, description: 'Empty answer' },
];

// Run tests
export function runValidationTests() {
  console.log('🧪 Running Enhanced Answer Validation Tests...\n');
  
  let passed = 0;
  let failed = 0;
  
  testCases.forEach((testCase, index) => {
    const result = validateAnswerEnhanced(testCase.user, testCase.correct, 'en', true);
    const success = result.isCorrect === testCase.expected;
    
    if (success) {
      passed++;
      console.log(`✅ Test ${index + 1}: ${testCase.description}`);
    } else {
      failed++;
      console.log(`❌ Test ${index + 1}: ${testCase.description}`);
      console.log(`   Expected: ${testCase.expected}, Got: ${result.isCorrect}`);
      console.log(`   User: "${testCase.user}", Correct: "${testCase.correct}"`);
    }
  });
  
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! Enhanced validation is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the validation logic.');
  }
  
  return { passed, failed };
}

// Test similarity function
export function testSimilarity() {
  console.log('\n🔍 Testing Answer Similarity Function...\n');
  
  const similarityTests = [
    { user: 'happy', correct: 'happy', expected: 1.0 },
    { user: 'happ', correct: 'happy', expected: 0.8 },
    { user: 'sad', correct: 'happy', expected: 0.2 },
    { user: '', correct: 'happy', expected: 0.0 },
  ];
  
  similarityTests.forEach((test, index) => {
    const similarity = getAnswerSimilarity(test.user, test.correct);
    const close = Math.abs(similarity - test.expected) < 0.1;
    
    if (close) {
      console.log(`✅ Similarity Test ${index + 1}: "${test.user}" vs "${test.correct}" = ${similarity.toFixed(2)}`);
    } else {
      console.log(`❌ Similarity Test ${index + 1}: Expected ~${test.expected}, Got ${similarity.toFixed(2)}`);
    }
  });
}

// Run all tests if this file is executed directly
if (typeof window === 'undefined') {
  runValidationTests();
  testSimilarity();
}
