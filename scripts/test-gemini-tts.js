#!/usr/bin/env node

/**
 * Test script for Google Gemini 2.5 Pro Preview TTS
 * 
 * This script tests the Gemini TTS integration for Language Gems
 * 
 * Usage:
 *   node scripts/test-gemini-tts.js
 *   node scripts/test-gemini-tts.js --language spanish
 *   node scripts/test-gemini-tts.js --multi-speaker
 */

require('dotenv').config({ path: '.env.local' });

async function testGeminiTTS() {
  console.log('🧪 Testing Google Gemini 2.5 Pro Preview TTS Integration');
  console.log('=' .repeat(60));

  // Check environment variables
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error('❌ GOOGLE_AI_API_KEY not found in environment variables');
    console.log('Please add your Google AI API key to .env.local:');
    console.log('GOOGLE_AI_API_KEY=your_api_key_here');
    process.exit(1);
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ Supabase configuration missing');
    process.exit(1);
  }

  console.log('✅ Environment variables configured');

  try {
    // Test the API endpoint
    console.log('\n🔍 Testing Gemini TTS API endpoint...');
    
    const testUrl = 'http://localhost:3000/api/admin/generate-gemini-audio';
    
    // Test single speaker
    console.log('Testing single speaker TTS...');
    const singleSpeakerResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: 'Hello, this is a test of the Gemini text-to-speech system for Language Gems exams.',
        language: 'english',
        questionId: 'test_single',
        type: 'exam',
        voiceName: 'Puck',
        options: {
          includeInstructions: true,
          speakingSpeed: 'normal',
          tone: 'neutral'
        }
      }),
    });

    if (singleSpeakerResponse.ok) {
      const data = await singleSpeakerResponse.json();
      console.log('✅ Single speaker test successful');
      console.log(`   Audio URL: ${data.audioUrl}`);
    } else {
      console.error('❌ Single speaker test failed');
      const error = await singleSpeakerResponse.text();
      console.error(`   Error: ${error}`);
    }

    // Test multi-speaker
    console.log('\nTesting multi-speaker TTS...');
    const multiSpeakerResponse = await fetch(testUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: `Listen to this conversation:
               Teacher: Good morning, class. Today we will practice listening comprehension.
               Student: Excuse me, could you repeat that more slowly?
               Teacher: Of course. We will practice listening comprehension today.`,
        language: 'english',
        questionId: 'test_multi',
        type: 'multi',
        speakers: [
          { name: 'Teacher', voiceName: 'Kore' },
          { name: 'Student', voiceName: 'Puck' }
        ]
      }),
    });

    if (multiSpeakerResponse.ok) {
      const data = await multiSpeakerResponse.json();
      console.log('✅ Multi-speaker test successful');
      console.log(`   Audio URL: ${data.audioUrl}`);
    } else {
      console.error('❌ Multi-speaker test failed');
      const error = await multiSpeakerResponse.text();
      console.error(`   Error: ${error}`);
    }

    // Test different languages
    console.log('\nTesting different languages...');
    const languages = [
      { code: 'spanish', text: 'Hola, esto es una prueba del sistema de texto a voz para exámenes de idiomas.' },
      { code: 'french', text: 'Bonjour, ceci est un test du système de synthèse vocale pour les examens de langues.' },
      { code: 'german', text: 'Hallo, dies ist ein Test des Text-zu-Sprache-Systems für Sprachprüfungen.' }
    ];

    for (const lang of languages) {
      console.log(`Testing ${lang.code}...`);
      const langResponse = await fetch(testUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: lang.text,
          language: lang.code,
          questionId: `test_${lang.code}`,
          type: 'exam',
          options: {
            includeInstructions: false,
            speakingSpeed: 'normal',
            tone: 'neutral'
          }
        }),
      });

      if (langResponse.ok) {
        const data = await langResponse.json();
        console.log(`✅ ${lang.code} test successful`);
        console.log(`   Audio URL: ${data.audioUrl}`);
      } else {
        console.error(`❌ ${lang.code} test failed`);
      }
    }

    console.log('\n🎉 Gemini TTS testing completed!');
    console.log('\nNext steps:');
    console.log('1. Check the generated audio files in your Supabase storage');
    console.log('2. Test the audio playback in your exam components');
    console.log('3. Configure voice preferences for different question types');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  }
}

// Run the test
if (require.main === module) {
  testGeminiTTS().catch(console.error);
}

module.exports = { testGeminiTTS };
