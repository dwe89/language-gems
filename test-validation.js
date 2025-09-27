// Test script to verify the validation fix for slash separators
// Run this in the browser console to test the validation logic

// Import the validation function (this would need to be adjusted for actual usage)
// For now, let's recreate the core logic to test

function testValidation() {
  console.log('🧪 Testing validation fix for slash separators...');
  
  // Test cases
  const testCases = [
    {
      userAnswer: 'children / sons',
      correctAnswer: 'children / sons',
      expected: true,
      description: 'Exact match with slash separator'
    },
    {
      userAnswer: 'children',
      correctAnswer: 'children / sons', 
      expected: true,
      description: 'First part of slash separator'
    },
    {
      userAnswer: 'sons',
      correctAnswer: 'children / sons',
      expected: true, 
      description: 'Second part of slash separator'
    },
    {
      userAnswer: 'kids',
      correctAnswer: 'children / sons',
      expected: false,
      description: 'Invalid answer'
    }
  ];

  // Simplified validation logic for testing
  function validateAnswerSimplified(userAnswer, correctAnswer) {
    const removeAccents = (text) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    
    const cleanAndNormalize = (text) => {
      let newText = text.toLowerCase();
      newText = newText.replace(/\s*\([^)]+\)/g, ' ').trim();
      newText = newText.replace(/[¿¡?!.,;:()[\]{}«»]/g, '');
      return newText.replace(/\s+/g, ' ').trim();
    };

    // Split answers with multiple delimiters including slash
    let baseAnswers = correctAnswer
      .split(/[,|;\/]|\s+I\s+|\s+and\s+|\s+or\s+/i)
      .map(ans => ans.trim())
      .filter(ans => ans.length > 0);

    const possibleAnswers = new Set();
    
    // IMPORTANT: Add the original answer (before splitting) as a valid option
    const originalCleaned = cleanAndNormalize(correctAnswer);
    if (originalCleaned) {
      possibleAnswers.add(originalCleaned);
    }

    // Add split parts
    baseAnswers.forEach(answer => {
      const cleaned = cleanAndNormalize(answer);
      if (cleaned) {
        possibleAnswers.add(cleaned);
      }
    });

    const finalPossibleAnswers = Array.from(possibleAnswers);
    const userClean = cleanAndNormalize(userAnswer);
    const userCleanNoAccents = removeAccents(userClean);

    // Check for match
    const isCorrect = finalPossibleAnswers.some(pa => removeAccents(pa) === userCleanNoAccents);

    return {
      isCorrect,
      possibleAnswers: finalPossibleAnswers,
      userClean,
      originalCleaned
    };
  }

  // Run tests
  testCases.forEach((testCase, index) => {
    const result = validateAnswerSimplified(testCase.userAnswer, testCase.correctAnswer);
    const passed = result.isCorrect === testCase.expected;
    
    console.log(`Test ${index + 1}: ${testCase.description}`);
    console.log(`  User: "${testCase.userAnswer}" | Correct: "${testCase.correctAnswer}"`);
    console.log(`  Expected: ${testCase.expected} | Got: ${result.isCorrect} | ${passed ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`  Possible answers: [${result.possibleAnswers.join(', ')}]`);
    console.log(`  User cleaned: "${result.userClean}"`);
    console.log('');
  });
}

// Run the test
testValidation();
