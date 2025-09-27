// Test script for vocabulary test creation
// Run this in the browser console on the vocabulary tests page

async function testVocabularyTestCreation() {
  console.log('🧪 Starting vocabulary test creation test...');
  
  try {
    // Step 1: Navigate to create test view
    console.log('📍 Step 1: Navigating to create test view...');
    if (typeof window.goToCreateTest === 'function') {
      window.goToCreateTest();
      console.log('✅ Successfully navigated to create test view');
      
      // Wait a bit for the component to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Test vocabulary test creation
      console.log('📍 Step 2: Testing vocabulary test creation...');
      if (typeof window.testVocabularyTestCreation === 'function') {
        const result = await window.testVocabularyTestCreation();
        if (result) {
          console.log('🎉 SUCCESS: Vocabulary test created successfully!');
          console.log('Test ID:', result);
        } else {
          console.log('❌ FAILED: Test creation returned null');
        }
      } else {
        console.log('❌ FAILED: testVocabularyTestCreation function not available');
        console.log('Available window functions:', Object.keys(window).filter(key => key.includes('test') || key.includes('vocabulary')));
      }
    } else {
      console.log('❌ FAILED: goToCreateTest function not available');
      console.log('Available window functions:', Object.keys(window).filter(key => key.includes('go') || key.includes('create')));
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

// Auto-run the test
console.log('🚀 Vocabulary Test Creation Test Script Loaded');
console.log('Run testVocabularyTestCreation() to start the test');

// Make it available globally
window.testVocabularyTestCreation = testVocabularyTestCreation;
