import { GeminiTTSService } from '../src/services/geminiTTS';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testTTSModels() {
  console.log('🧪 Testing Gemini TTS models...');
  
  // Test Flash model
  console.log('\n📱 Testing Flash model (gemini-2.5-flash-preview-tts)...');
  try {
    const flashService = new GeminiTTSService(false);
    const flashResult = await flashService.testTTS();
    console.log(`✅ Flash model test: ${flashResult ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.error('❌ Flash model test FAILED:', error);
  }
  
  // Test Pro model
  console.log('\n🏆 Testing Pro model (gemini-2.5-pro-preview-tts)...');
  try {
    const proService = new GeminiTTSService(true);
    const proResult = await proService.testTTS();
    console.log(`✅ Pro model test: ${proResult ? 'PASSED' : 'FAILED'}`);
  } catch (error) {
    console.error('❌ Pro model test FAILED:', error);
  }
}

// Run the test
if (require.main === module) {
  testTTSModels()
    .then(() => {
      console.log('\n🎉 TTS model testing completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test script failed:', error);
      process.exit(1);
    });
}

export { testTTSModels };
