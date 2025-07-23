/**
 * Test script for Amazon Polly voices
 * Tests the new neural voices: Spanish Lucia, French Lea, German Vicki
 */

const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
require('dotenv').config({ path: '.env.local' });

// Voice configurations
const VOICE_CONFIGS = {
  spanish: {
    languageCode: 'es-ES',
    voiceId: 'Lucia',
    engine: 'neural'
  },
  french: {
    languageCode: 'fr-FR', 
    voiceId: 'Lea',
    engine: 'neural'
  },
  german: {
    languageCode: 'de-DE',
    voiceId: 'Vicki', 
    engine: 'neural'
  }
};

async function testPollyVoices() {
  console.log('🎯 Testing Amazon Polly Neural Voices');
  console.log('='.repeat(50));

  // Initialize Polly client
  const pollyClient = new PollyClient({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
  });

  // Test phrases for each language
  const testPhrases = {
    spanish: {
      text: 'Hola, soy Lucia. Me gusta enseñar español.',
      voice: 'Lucia',
      language: 'Spanish'
    },
    french: {
      text: 'Bonjour, je suis Lea. J\'aime enseigner le français.',
      voice: 'Lea', 
      language: 'French'
    },
    german: {
      text: 'Hallo, ich bin Vicki. Ich unterrichte gerne Deutsch.',
      voice: 'Vicki',
      language: 'German'
    }
  };

  console.log('📋 Testing these configurations:');
  console.log('• Spanish: Neural Lucia');
  console.log('• French: Neural Lea');
  console.log('• German: Neural Vicki');
  console.log('');

  let allTestsPassed = true;

  // Test each language
  for (const [langCode, config] of Object.entries(testPhrases)) {
    try {
      console.log(`🧪 Testing ${config.language} (${config.voice})...`);
      console.log(`   Text: "${config.text}"`);

      const startTime = Date.now();
      
      // Create Polly command
      const voiceConfig = VOICE_CONFIGS[langCode];
      const command = new SynthesizeSpeechCommand({
        Text: config.text,
        VoiceId: voiceConfig.voiceId,
        Engine: voiceConfig.engine,
        LanguageCode: voiceConfig.languageCode,
        OutputFormat: 'mp3',
        SampleRate: '22050',
        TextType: 'text'
      });

      // Execute the command
      const response = await pollyClient.send(command);
      
      const endTime = Date.now();
      const duration = endTime - startTime;

      if (response.AudioStream) {
        const audioData = await response.AudioStream.transformToByteArray();
        console.log(`   ✅ SUCCESS - Generated ${audioData.length} bytes in ${duration}ms`);
        console.log(`   🎵 Audio format: ${response.ContentType}`);
      } else {
        console.log(`   ❌ FAILED - No audio stream returned`);
        allTestsPassed = false;
      }

    } catch (error) {
      console.log(`   ❌ FAILED - ${error.message}`);
      if (error.name === 'InvalidParameterException') {
        console.log(`   💡 Hint: Check if voice "${config.voice}" supports neural engine`);
      }
      allTestsPassed = false;
    }

    console.log(''); // Empty line for readability
  }

  // Test credentials
  console.log('🔐 Testing AWS credentials...');
  try {
    const testCommand = new SynthesizeSpeechCommand({
      Text: 'Test',
      VoiceId: 'Lucia',
      Engine: 'neural',
      LanguageCode: 'es-ES',
      OutputFormat: 'mp3'
    });
    
    await pollyClient.send(testCommand);
    console.log('   ✅ AWS credentials are valid');
  } catch (error) {
    console.log(`   ❌ AWS credentials error: ${error.message}`);
    allTestsPassed = false;
  }

  // Overall result
  console.log('='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED! Amazon Polly is working correctly.');
    console.log('✅ Neural voices are configured and functional:');
    console.log('   • Spanish: Lucia');
    console.log('   • French: Lea');
    console.log('   • German: Vicki');
  } else {
    console.log('❌ SOME TESTS FAILED. Please check your configuration.');
    console.log('🔍 Verify:');
    console.log('   • AWS credentials in .env.local');
    console.log('   • AWS region is correct (currently: ' + (process.env.AWS_REGION || 'eu-west-1') + ')');
    console.log('   • Voice names are correct');
  }

  console.log('');
  console.log('💡 Environment variables loaded:');
  console.log(`   AWS_REGION: ${process.env.AWS_REGION || 'not set (using eu-west-1)'}`);
  console.log(`   AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'set' : 'not set'}`);
  console.log(`   AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'set' : 'not set'}`);
}

// Run the test
testPollyVoices().catch(console.error);
