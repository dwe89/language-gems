import { GeminiTTSService, BRITISH_FEMALE_VOICE } from '../src/services/geminiTTS';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testIntroAudio() {
  console.log('🧪 Testing introduction audio generation...');
  
  const flashService = new GeminiTTSService(false); // Use Flash model
  
  try {
    console.log('🎵 Testing simple single-speaker audio...');
    const simpleResult = await flashService.generateSingleSpeakerAudio(
      'Question 1',
      { voiceName: BRITISH_FEMALE_VOICE },
      `test-simple-${Date.now()}.wav`
    );
    console.log(`✅ Simple audio test: SUCCESS - ${simpleResult}`);
    
    console.log('\n🎵 Testing AQA listening audio with intro...');
    const aqaResult = await flashService.generateAQAListeningAudio(
      1,
      'This is a test of the main content.',
      { voiceName: 'Puck' },
      `test-aqa-${Date.now()}.wav`,
      false
    );
    console.log(`✅ AQA audio test: SUCCESS - ${aqaResult}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testIntroAudio()
    .then(() => {
      console.log('\n🎉 Introduction audio testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

export { testIntroAudio };
