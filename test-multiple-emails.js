// Test email delivery to different email addresses
const testMultipleEmails = async (emails) => {
  for (const email of emails) {
    console.log(`\n🧪 Testing email delivery to: ${email}`);
    
    const testData = {
      name: 'Email Test User',
      email: 'test@example.com',
      subject: `Email Delivery Test - ${new Date().toLocaleTimeString()}`,
      message: `This is a test message to verify email delivery to ${email}. If you receive this, the system is working correctly!`,
      contactType: 'support'
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
        console.log('✅ Email test successful!');
        console.log(`📧 Check inbox at: ${email}`);
        console.log(`📬 Submission ID: ${result.submissionId}`);
      } else {
        console.log('❌ Email test failed!');
        console.log('Error:', result);
      }
    } catch (error) {
      console.log('❌ Email test error:', error.message);
    }
    
    // Wait 2 seconds between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
};

// Test with multiple email addresses
const emailsToTest = [
  'support@languagegems.com',  // Your Zoho mail
  // Add a Gmail or other email provider here to compare
  // 'your-test-email@gmail.com'
];

console.log('🔍 Testing email delivery to multiple addresses...');
console.log('⏰ This will help identify if the issue is specific to Zoho Mail.\n');

testMultipleEmails(emailsToTest);