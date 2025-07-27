// Test script to verify assignment API functionality
// Run with: node test-assignment-api.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';
const ASSIGNMENT_ID = '3b399df5-78e9-4932-a4f9-3c7932df0203';

async function testAssignmentRetrieval() {
  console.log('Testing assignment retrieval API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/assignments/${ASSIGNMENT_ID}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real test, you'd need to include proper authentication cookies
      }
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Assignment retrieval successful');
      return data;
    } else {
      console.log('❌ Assignment retrieval failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

async function testVocabularyRetrieval() {
  console.log('\nTesting vocabulary retrieval API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/assignments/${ASSIGNMENT_ID}/vocabulary`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Vocabulary response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Vocabulary retrieval successful');
      console.log(`Found ${data.vocabulary?.length || 0} vocabulary items`);
      return data;
    } else {
      console.log('❌ Vocabulary retrieval failed:', data.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Network error:', error.message);
    return null;
  }
}

async function runTests() {
  console.log('🧪 Starting Assignment API Tests\n');
  
  const assignmentData = await testAssignmentRetrieval();
  const vocabularyData = await testVocabularyRetrieval();
  
  console.log('\n📊 Test Summary:');
  console.log('Assignment retrieval:', assignmentData ? '✅ PASS' : '❌ FAIL');
  console.log('Vocabulary retrieval:', vocabularyData ? '✅ PASS' : '❌ FAIL');
  
  if (assignmentData && vocabularyData) {
    console.log('\n🎉 All tests passed! Assignment system is working.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the logs above for details.');
  }
}

// Run the tests
runTests().catch(console.error);
