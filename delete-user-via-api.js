require('dotenv').config({ path: '.env.local' });

async function deleteProblematicUser() {
  try {
    const response = await fetch('http://localhost:3001/api/admin/delete-account', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: '1015a1fb-8c80-41e3-8f7c-f01c7f6c490c',
        userType: 'teacher'
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Account deletion successful!');
      console.log('Results:', data.cleanupResults?.join('\n'));
    } else {
      console.error('❌ Account deletion failed:', data.error);
      if (data.cleanupResults) {
        console.log('Cleanup results:', data.cleanupResults.join('\n'));
      }
    }
  } catch (error) {
    console.error('Error calling deletion API:', error);
  }
}

deleteProblematicUser();
