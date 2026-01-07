// Quick test to see what data endpoints are returning
const fetch = require('node-fetch');

async function testEndpoints() {
  const classId = 'be8ed3df-edfc-48c9-8956-6adc2ac1e39b';
  const teacherId = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c';
  
  try {
    console.log('🔍 Testing vocabulary analytics endpoint...');
    const vocabResponse = await fetch(`http://localhost:3001/api/dashboard/vocabulary/analytics?teacherId=${teacherId}&classId=${classId}`, {
      headers: { 'Cookie': 'sb-ojaaszphmuswrjtvpmcd-auth-token=...' }
    });
    
    if (vocabResponse.ok) {
      const vocabData = await vocabResponse.json();
      console.log('✅ Vocabulary Analytics:', {
        totalStudents: vocabData.analytics?.classStats?.totalStudents,
        totalWords: vocabData.analytics?.classStats?.totalWords,
        proficientWords: vocabData.analytics?.classStats?.proficientWords,
        learningWords: vocabData.analytics?.classStats?.learningWords,
        strugglingWords: vocabData.analytics?.classStats?.strugglingWords
      });
    }
    
    console.log('\n🔍 Testing class summary endpoint...');
    const summaryResponse = await fetch(`http://localhost:3001/api/teacher-analytics/class-summary?teacherId=${teacherId}&classId=${classId}`, {
      headers: { 'Cookie': 'sb-ojaaszphmuswrjtvpmcd-auth-token=...' }
    });
    
    if (summaryResponse.ok) {
      const summaryData = await summaryResponse.json();
      console.log('✅ Class Summary:', {
        urgentInterventionsCount: summaryData.urgentInterventions?.length,
        sampleStudent: summaryData.urgentInterventions?.[0]
      });
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testEndpoints();
