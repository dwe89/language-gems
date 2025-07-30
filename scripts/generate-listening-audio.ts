import { createClient } from '@supabase/supabase-js';
import { GeminiTTSService, getVoiceForLanguageAndGender, detectGenderFromName, GEMINI_VOICES } from '../src/services/geminiTTS';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced voice variety system for different languages and question types
const VOICE_VARIETY = {
  fr: {
    // French voices - variety for different question types
    narrative: ['Aoede', 'Callirrhoe', 'Laomedeia', 'Umbriel', 'Sulafat'],
    conversational: ['Schedar', 'Despina', 'Achird', 'Vindemiatrix', 'Sadachbia'],
    formal: ['Iapetus', 'Algieba', 'Gacrux', 'Pulcherrima', 'Sadaltager'],
    dictation: ['Kore', 'Charon', 'Rasalgethi', 'Achernar', 'Alnilam']
  },
  de: {
    // German voices - variety for different question types
    narrative: ['Charon', 'Rasalgethi', 'Sadachbia', 'Enceladus', 'Autonoe'],
    conversational: ['Leda', 'Puck', 'Zubenelgenubi', 'Fenrir', 'Orus'],
    formal: ['Iapetus', 'Algieba', 'Gacrux', 'Erinome', 'Algenib'],
    dictation: ['Kore', 'Aoede', 'Despina', 'Schedar', 'Achernar']
  },
  es: {
    // Spanish voices - keep existing variety
    narrative: ['Kore', 'Charon', 'Rasalgethi', 'Achernar', 'Vindemiatrix'],
    conversational: ['Puck', 'Aoede', 'Laomedeia', 'Achird', 'Sulafat'],
    formal: ['Iapetus', 'Algieba', 'Gacrux', 'Sadaltager', 'Alnilam'],
    dictation: ['Schedar', 'Despina', 'Pulcherrima', 'Erinome', 'Algenib']
  }
};

// Question type to voice category mapping
const QUESTION_TYPE_VOICE_MAPPING: Record<string, keyof typeof VOICE_VARIETY.fr> = {
  'letter-matching': 'narrative',
  'multiple-choice': 'conversational',
  'lifestyle-grid': 'conversational',
  'opinion-rating': 'conversational',
  'open-response': 'formal',
  'activity-timing': 'conversational',
  'multi-part': 'formal',
  'dictation': 'dictation'
};

// Voice selection with variety - no repeats in same session
let usedVoices: Set<string> = new Set();

function selectVoiceWithVariety(language: string, questionType: string, questionNumber: number): string {
  const langVoices = VOICE_VARIETY[language as keyof typeof VOICE_VARIETY];
  if (!langVoices) {
    return getVoiceForLanguageAndGender(language, 'neutral');
  }

  const voiceCategory = QUESTION_TYPE_VOICE_MAPPING[questionType] || 'conversational';
  const availableVoices = langVoices[voiceCategory];

  // Filter out recently used voices to ensure variety
  const unusedVoices = availableVoices.filter(voice => !usedVoices.has(voice));

  // If all voices have been used, reset the used set
  if (unusedVoices.length === 0) {
    usedVoices.clear();
    console.log('🔄 Resetting voice variety pool');
  }

  // Select voice based on question number for consistency within same question type
  const voicesToChooseFrom = unusedVoices.length > 0 ? unusedVoices : availableVoices;
  const selectedVoice = voicesToChooseFrom[questionNumber % voicesToChooseFrom.length];

  // Mark voice as used
  usedVoices.add(selectedVoice);

  console.log(`🎭 Selected voice: ${selectedVoice} (${voiceCategory} style for ${questionType})`);
  return selectedVoice;
}

interface ListeningQuestion {
  id: string;
  title: string;
  audio_text: string;
  audio_url: string | null;
  tts_config: any;
  assessment_id: string;
  question_number: number;
}

async function generateAudioForFoundationQuestions() {
  console.log('🎵 Starting audio generation for Foundation level listening questions...');

  try {
    // Get Foundation level questions that need audio generation with assessment language info
    // Only process questions that don't have audio_url AND haven't been processed yet
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select(`
        id, title, audio_text, audio_url, tts_config, assessment_id, question_number, question_type,
        aqa_listening_assessments!inner(language, level)
      `)
      .is('audio_url', null)
      .not('audio_text', 'is', null)
      .eq('aqa_listening_assessments.level', 'foundation');

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No questions need audio generation');
      return;
    }

    console.log(`📊 Found ${questions.length} Foundation level questions that need audio generation`);

    // Filter out questions that have the same audio_text as questions that already have audio
    const { data: existingAudioQuestions, error: existingError } = await supabase
      .from('aqa_listening_questions')
      .select('audio_text, audio_url')
      .not('audio_url', 'is', null)
      .not('audio_text', 'is', null);

    if (existingError) {
      throw existingError;
    }

    const existingAudioTexts = new Set(existingAudioQuestions?.map(q => q.audio_text) || []);

    // Filter questions to avoid duplicating audio for same content
    const questionsToProcess = questions.filter(q => !existingAudioTexts.has(q.audio_text));

    console.log(`🔍 Filtered to ${questionsToProcess.length} unique questions (${questions.length - questionsToProcess.length} skipped as duplicates)`);

    // Copy audio URLs for questions with duplicate content
    const duplicateQuestions = questions.filter(q => existingAudioTexts.has(q.audio_text));
    let copiedCount = 0;

    for (const duplicateQuestion of duplicateQuestions) {
      const existingQuestion = existingAudioQuestions?.find(eq => eq.audio_text === duplicateQuestion.audio_text);
      if (existingQuestion?.audio_url) {
        const { error: copyError } = await supabase
          .from('aqa_listening_questions')
          .update({ audio_url: existingQuestion.audio_url })
          .eq('id', duplicateQuestion.id);

        if (!copyError) {
          console.log(`📋 Copied audio URL for duplicate question: ${duplicateQuestion.title}`);
          copiedCount++;
        }
      }
    }

    if (copiedCount > 0) {
      console.log(`📋 Copied audio URLs for ${copiedCount} duplicate questions`);
    }

    const ttsService = new GeminiTTSService(false); // Use Flash model to conserve quota

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questionsToProcess.length; i++) {
      const question = questionsToProcess[i];
      try {
        console.log(`\n🎯 Processing question ${i + 1}/${questionsToProcess.length}: ${question.title}`);
        console.log(`📝 Audio text length: ${question.audio_text?.length || 0} characters`);
        console.log(`🆔 Question ID: ${question.id}, Assessment: ${question.assessment_id}`);
        // Removed debug logging to clean up output

        if (!question.audio_text) {
          console.log('⚠️ Skipping question with no audio text');
          continue;
        }

        // Get language from assessment - fix the nested structure
        const language = (question as any).aqa_listening_assessments?.language || 'es';
        console.log(`🌍 Detected language: ${language} (from assessment ${question.assessment_id})`);

        // ENABLE 2-SPEAKER MODE (limit to 2 speakers max for Gemini Flash TTS)
        const originalSpeakerCount = question.tts_config?.speakers?.length || 1;
        const isMultiSpeaker = originalSpeakerCount > 1; // Enable multi-speaker mode

        if (originalSpeakerCount > 2) {
          console.log(`⚠️ Content has ${originalSpeakerCount} speakers - will use 2-speaker mode (Gemini Flash limitation)`);
        } else if (originalSpeakerCount === 2) {
          console.log(`🎭 Perfect! Content has 2 speakers - using multi-speaker mode`);
        } else {
          console.log(`🎤 Single-speaker content`);
        }

        const filename = `listening-${question.assessment_id}-q${question.question_number}-${question.id}`;

        console.log(`🎵 Generating AQA listening audio (no intro)...`);
        console.log(`🌍 Language: ${language}, Multi-speaker: ${isMultiSpeaker}`);

        // Voice selection based on speaker mode
        let selectedVoice: string;
        let speakers = question.tts_config?.speakers;

        if (isMultiSpeaker && speakers && speakers.length > 1) {
          // Multi-speaker mode: Use 2 different voices (limit to first 2 speakers)
          const limitedSpeakers = speakers.slice(0, 2);
          console.log(`🎭 Multi-speaker mode: Using ${limitedSpeakers.length} voices`);

          speakers = limitedSpeakers.map((speaker: any, index: number) => {
            const gender = detectGenderFromName(speaker.name);
            // Use different voice selection for each speaker to ensure variety
            const speakerVoice = selectVoiceWithVariety(language, question.question_type, question.question_number + index);
            console.log(`🎭 Speaker ${index + 1} "${speaker.name}" (${gender}) → voice: ${speakerVoice}`);
            return {
              ...speaker,
              voiceName: speakerVoice
            };
          });

          // For the TTS config, use the first speaker's voice
          selectedVoice = speakers[0].voiceName;
        } else {
          // Single-speaker mode: Use variety-based voice selection
          selectedVoice = selectVoiceWithVariety(language, question.question_type, question.question_number);
          console.log(`🎤 Single-speaker mode: ${selectedVoice} for ${question.question_type} Q${question.question_number}`);
        }

        // Use the new AQA listening audio method (simplified - no intro)
        // Add retry logic for rate limit errors
        let retryCount = 0;
        const maxRetries = 3;
        let audioUrl: string = '';

        while (retryCount <= maxRetries) {
          try {
            audioUrl = await ttsService.generateAQAListeningAudio(
              question.question_number,
              question.audio_text,
              {
                voiceName: selectedVoice, // Use the variety-selected voice
                language: language, // Explicitly pass the language
                style: question.tts_config?.style || 'natural and clear',
                tone: question.tts_config?.tone || 'neutral',
                pace: 'very_slow' // VERY slow pace for language learners
              },
              filename,
              isMultiSpeaker,
              speakers
            );
            break; // Success, exit retry loop
          } catch (retryError: any) {
            if (retryError.status === 429 && retryCount < maxRetries) {
              retryCount++;
              const waitTime = Math.pow(2, retryCount) * 5000; // Exponential backoff: 10s, 20s, 40s
              console.log(`⏳ Rate limit hit. Retry ${retryCount}/${maxRetries} in ${waitTime/1000}s...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
            } else {
              throw retryError; // Re-throw if not rate limit or max retries reached
            }
          }
        }

        if (!audioUrl) {
          throw new Error('Failed to generate audio after all retries');
        }

        // Update the database with the audio URL
        const { error: updateError } = await supabase
          .from('aqa_listening_questions')
          .update({ audio_url: audioUrl })
          .eq('id', question.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Successfully generated and stored audio for: ${question.title}`);
        console.log(`🔗 Audio URL: ${audioUrl}`);
        successCount++;

        // The TTS service now handles rate limiting internally, but add a small buffer
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: any) {
        console.error(`❌ Error processing question ${question.title}:`, error);
        errorCount++;

        // If we hit daily quota, stop processing and provide helpful message
        if (error.message?.includes('Daily quota exceeded')) {
          console.log('\n🛑 Daily quota exhausted. Stopping audio generation.');
          console.log('💡 Solutions:');
          console.log('   1. Wait until tomorrow (quota resets daily)');
          console.log('   2. Upgrade your Google AI plan for higher quotas');
          console.log('   3. Use a different API key if available');
          console.log(`\n📊 Progress: ${successCount} successful, ${errorCount} failed out of ${questionsToProcess.length} total`);
          break;
        }
      }
    }

    console.log('\n📊 Audio generation summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

    if (errorCount > 0 && successCount > 0) {
      console.log('\n🔄 To resume generation later, simply run this script again.');
      console.log('   It will automatically skip questions that already have audio.');
    }

  } catch (error) {
    console.error('❌ Fatal error during audio generation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateAudioForFoundationQuestions()
    .then(() => {
      console.log('🎉 Foundation audio generation completed!');
      process.exit(0);
    })
    .catch((error: any) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { generateAudioForFoundationQuestions };
