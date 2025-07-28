#!/usr/bin/env node

/**
 * Verification script for Google Gemini 2.5 TTS setup
 * 
 * This script verifies the setup without making API calls
 * 
 * Usage:
 *   node scripts/verify-gemini-setup.js
 */

require('dotenv').config({ path: '.env.local' });

function verifyGeminiSetup() {
  console.log('🔍 Verifying Google Gemini 2.5 TTS Setup');
  console.log('=' .repeat(50));

  let allGood = true;

  // Check environment variables
  console.log('\n📋 Checking Environment Variables:');
  
  if (process.env.GOOGLE_AI_API_KEY) {
    console.log('✅ GOOGLE_AI_API_KEY is set');
    const keyPreview = process.env.GOOGLE_AI_API_KEY.substring(0, 10) + '...';
    console.log(`   Preview: ${keyPreview}`);
  } else {
    console.log('❌ GOOGLE_AI_API_KEY is missing');
    console.log('   Please add your Google AI API key to .env.local:');
    console.log('   GOOGLE_AI_API_KEY=your_api_key_here');
    allGood = false;
  }

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
  } else {
    console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
    allGood = false;
  }

  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.log('✅ SUPABASE_SERVICE_ROLE_KEY is set');
  } else {
    console.log('❌ SUPABASE_SERVICE_ROLE_KEY is missing');
    allGood = false;
  }

  // Check required files
  console.log('\n📁 Checking Required Files:');
  
  const fs = require('fs');
  const path = require('path');
  
  const requiredFiles = [
    'src/services/geminiTTS.ts',
    'src/app/api/admin/generate-gemini-audio/route.ts',
    'src/data/gemini-tts-exam-questions.ts'
  ];

  requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(process.cwd(), file))) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} is missing`);
      allGood = false;
    }
  });

  // Check dependencies
  console.log('\n📦 Checking Dependencies:');
  
  try {
    const packageJson = require('../package.json');
    
    if (packageJson.dependencies['@google/generative-ai']) {
      console.log('✅ @google/generative-ai is installed');
    } else {
      console.log('❌ @google/generative-ai is not installed');
      console.log('   Run: npm install @google/generative-ai');
      allGood = false;
    }

    if (packageJson.dependencies['@supabase/supabase-js']) {
      console.log('✅ @supabase/supabase-js is installed');
    } else {
      console.log('❌ @supabase/supabase-js is not installed');
      allGood = false;
    }
  } catch (error) {
    console.log('❌ Could not read package.json');
    allGood = false;
  }

  // Summary
  console.log('\n📊 Setup Summary:');
  if (allGood) {
    console.log('🎉 All checks passed! Your Gemini TTS setup is ready.');
    console.log('\nNext steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Test the API endpoint: GET http://localhost:3000/api/admin/generate-gemini-audio');
    console.log('3. Try generating audio in your exam components');
    console.log('\nNote: Be mindful of rate limits on the free tier:');
    console.log('- Gemini 2.5 Flash TTS: More generous limits');
    console.log('- Gemini 2.5 Pro TTS: More restrictive limits');
  } else {
    console.log('❌ Setup incomplete. Please fix the issues above.');
    process.exit(1);
  }

  // Rate limit information
  console.log('\n⚠️  Rate Limit Information:');
  console.log('Free tier limits for TTS models:');
  console.log('- Requests per minute: Limited');
  console.log('- Requests per day: Limited');
  console.log('- Consider upgrading to paid tier for production use');
  console.log('- Use Flash model for better rate limits during development');

  // Usage examples
  console.log('\n💡 Usage Examples:');
  console.log('Single speaker:');
  console.log(`
POST /api/admin/generate-gemini-audio
{
  "text": "Hello, this is a test.",
  "language": "english",
  "type": "single",
  "voiceName": "Puck"
}
  `);

  console.log('Multi-speaker:');
  console.log(`
POST /api/admin/generate-gemini-audio
{
  "text": "Teacher: Good morning. Student: Hello!",
  "language": "english", 
  "type": "multi",
  "speakers": [
    {"name": "Teacher", "voiceName": "Kore"},
    {"name": "Student", "voiceName": "Puck"}
  ]
}
  `);

  console.log('Exam question:');
  console.log(`
POST /api/admin/generate-gemini-audio
{
  "text": "Listen to the following conversation.",
  "language": "spanish",
  "questionId": "q1",
  "type": "exam",
  "options": {
    "includeInstructions": true,
    "speakingSpeed": "normal",
    "tone": "neutral"
  }
}
  `);
}

// Run the verification
if (require.main === module) {
  verifyGeminiSetup();
}

module.exports = { verifyGeminiSetup };
