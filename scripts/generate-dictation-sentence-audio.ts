import { createClient } from '@supabase/supabase-js';
import { GeminiTTSService } from '../src/services/geminiTTS';
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

interface DictationQuestion {
  id: string;
  title: string;
  question_data: {
    sentences: Array<{
      id: string;
      text: string;
      correctText: string;
      acceptableVariations?: string[];
    }>;
  };
  tts_config: any;
  assessment_id: string;
  question_number: number;
}

async function generateDictationSentenceAudio() {
  console.log('🎵 Generating separate audio files for dictation sentences...');
  
  try {
    // Get all dictation questions
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select('id, title, question_data, tts_config, assessment_id, question_number')
      .eq('question_type', 'dictation')
      .is('sentence_audio_urls', null);

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No dictation questions need sentence audio generation');
      return;
    }

    console.log(`📊 Found ${questions.length} dictation questions to process`);

    const ttsService = new GeminiTTSService(true); // Use Pro model for better quality

    let successCount = 0;
    let errorCount = 0;

    for (const question of questions as DictationQuestion[]) {
      try {
        console.log(`\n🎯 Processing dictation: ${question.title}`);
        
        if (!question.question_data?.sentences) {
          console.log('⚠️ No sentences found in question data');
          continue;
        }

        const sentences = question.question_data.sentences;
        console.log(`📝 Found ${sentences.length} sentences to process`);

        const sentenceAudioUrls: Record<string, string> = {};

        // Generate audio for each sentence
        for (let i = 0; i < sentences.length; i++) {
          const sentence = sentences[i];
          console.log(`\n  🎤 Processing sentence ${i + 1}: "${sentence.text}"`);

          try {
            // Create filename for this specific sentence
            const filename = `dictation-${question.assessment_id}-q${question.question_number}-s${i + 1}-${sentence.id}`;

            // Generate audio with question number introduction
            const audioUrl = await ttsService.generateAQAListeningAudio(
              question.question_number,
              sentence.text,
              {
                voiceName: question.tts_config?.voiceName || 'Kore',
                style: question.tts_config?.style || 'natural and clear',
                tone: question.tts_config?.tone || 'neutral',
                pace: question.tts_config?.pace || 'slow' // Slower pace for dictation
              },
              filename,
              false, // Single speaker for dictation
              undefined
            );

            sentenceAudioUrls[sentence.id] = audioUrl;
            console.log(`    ✅ Generated audio for sentence ${i + 1}: ${audioUrl}`);

            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (error) {
            console.error(`    ❌ Error generating audio for sentence ${i + 1}:`, error);
            throw error; // Re-throw to fail the whole question
          }
        }

        // Update the database with the sentence audio URLs
        const { error: updateError } = await supabase
          .from('aqa_listening_questions')
          .update({ sentence_audio_urls: sentenceAudioUrls })
          .eq('id', question.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Successfully generated ${sentences.length} sentence audio files for: ${question.title}`);
        console.log(`🔗 Sentence audio URLs:`, sentenceAudioUrls);
        successCount++;

      } catch (error) {
        console.error(`❌ Error processing dictation question ${question.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Dictation sentence audio generation summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during dictation sentence audio generation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  generateDictationSentenceAudio()
    .then(() => {
      console.log('🎉 Dictation sentence audio generation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { generateDictationSentenceAudio };
