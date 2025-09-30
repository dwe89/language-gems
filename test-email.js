// Test email delivery
const testEmail = async (recipient) => {
  try {
    const response = await fetch('http://localhost:3001/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient: recipient
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Test email sent successfully!');
      console.log('Details:', result);
      console.log(`📧 Check your inbox at: ${result.recipient}`);
      console.log(`📬 Message ID: ${result.messageId}`);
    } else {
      console.log('❌ Test email failed!');
      console.log('Error:', result);
    }
  } catch (error) {
    console.log('❌ Test email error:', error);
  }
};

// Replace with your actual email address
const YOUR_EMAIL = process.argv[2] || 'support@languagegems.com';

console.log(`🧪 Testing email delivery to: ${YOUR_EMAIL}`);
console.log('📝 This will help diagnose email delivery issues...\n');

testEmail(YOUR_EMAIL);