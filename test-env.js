const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

console.log('Environment variables check:');
console.log('GOOGLE_AI_API_KEY exists:', !!process.env.GOOGLE_AI_API_KEY);
console.log('GOOGLE_AI_API_KEY length:', process.env.GOOGLE_AI_API_KEY?.length || 0);
console.log('GOOGLE_AI_API_KEY starts with:', process.env.GOOGLE_AI_API_KEY?.substring(0, 10) || 'undefined');

// Test if it's a valid format
if (process.env.GOOGLE_AI_API_KEY) {
  const isValidFormat = process.env.GOOGLE_AI_API_KEY.startsWith('AIza');
  console.log('Valid Google API key format:', isValidFormat);
} else {
  console.log('❌ GOOGLE_AI_API_KEY is not loaded!');
}