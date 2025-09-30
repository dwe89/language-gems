// Quick test for the contact API
const testContactAPI = async () => {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Message',
    message: 'This is a test message to verify the contact form API is working.',
    contactType: 'general'
  };

  try {
    const response = await fetch('http://localhost:3001/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Contact API test successful!');
      console.log('Response:', result);
    } else {
      console.log('❌ Contact API test failed!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ Contact API test error:', error);
  }
};

// Run the test
testContactAPI();