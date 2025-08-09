#!/usr/bin/env tsx

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

interface EdexcelQuestion {
  id: string;
  assessment_id: string;
  question_number: number;
  question_type: string;
  section: string;
  title: string;
  audio_text: string;
  audio_url?: string;
  tts_config?: any;
  language?: string;
  level?: string;
  identifier?: string;
}

// Voice variety for different speakers
const VOICE_VARIETY = {
  spanish: ['Aoede', 'Puck', 'Kore', 'Rasalgethi'],
  french: ['Aoede', 'Puck', 'Kore', 'Rasalgethi'],
  german: ['Aoede', 'Puck', 'Kore', 'Rasalgethi']
};

let voiceIndex = 0;

function getNextVoice(language: string): string {
  const voices = VOICE_VARIETY[language as keyof typeof VOICE_VARIETY] || VOICE_VARIETY.spanish;
  const voice = voices[voiceIndex % voices.length];
  voiceIndex++;
  return voice;
}

// Track shared audio URLs for crossover questions
const sharedAudioUrls = new Map<string, string>();

async function generateEdexcelListeningAudio(
  language: string = 'es',
  level?: string,
  dryRun: boolean = false,
  maxQuestions?: number
) {
  try {
    console.log(`🎵 Starting Edexcel Listening Audio Generation`);
    console.log(`🌍 Language: ${language}`);
    console.log(`📊 Level: ${level || 'all'}`);
    console.log(`🔍 Dry run: ${dryRun ? 'Yes' : 'No'}`);
    console.log(`📝 Max questions: ${maxQuestions || 'unlimited'}\n`);

    // Initialize TTS service
    const ttsService = new GeminiTTSService(false); // Use Flash model for better rate limits

    // Build query
    let query = supabase
      .from('edexcel_listening_questions')
      .select(`
        *,
        edexcel_listening_assessments!inner(language, level, identifier)
      `)
      .eq('edexcel_listening_assessments.language', language)
      .order('question_number');

    if (level) {
      query = query.eq('edexcel_listening_assessments.level', level);
    }

    if (maxQuestions) {
      query = query.limit(maxQuestions);
    }

    const { data: questions, error } = await query;

    if (error) {
      console.error('❌ Error fetching questions:', error);
      return;
    }

    if (!questions || questions.length === 0) {
      console.log('⚠️ No questions found matching criteria');
      return;
    }

    console.log(`📚 Found ${questions.length} questions to process\n`);

    // Group questions by crossover status
    const crossoverQuestions = new Map<string, EdexcelQuestion[]>();
    const uniqueQuestions: EdexcelQuestion[] = [];

    for (const question of questions) {
      const q = question as any;
      const questionData: EdexcelQuestion = {
        id: q.id,
        assessment_id: q.assessment_id,
        question_number: q.question_number,
        question_type: q.question_type,
        section: q.section,
        title: q.title,
        audio_text: q.audio_text,
        audio_url: q.audio_url,
        tts_config: q.tts_config,
        language: q.edexcel_listening_assessments.language,
        level: q.edexcel_listening_assessments.level,
        identifier: q.edexcel_listening_assessments.identifier
      };

      // Check if this is a crossover question by comparing audio_text
      const audioTextKey = q.audio_text?.trim();
      if (audioTextKey) {
        if (crossoverQuestions.has(audioTextKey)) {
          crossoverQuestions.get(audioTextKey)!.push(questionData);
        } else {
          crossoverQuestions.set(audioTextKey, [questionData]);
        }
      } else {
        uniqueQuestions.push(questionData);
      }
    }

    // Identify actual crossover questions (appear in multiple assessments)
    const actualCrossovers: EdexcelQuestion[][] = [];
    const singleQuestions: EdexcelQuestion[] = [];

    for (const [audioText, questionGroup] of crossoverQuestions.entries()) {
      if (questionGroup.length > 1) {
        actualCrossovers.push(questionGroup);
        console.log(`🔄 Crossover question found: "${questionGroup[0].title}" (${questionGroup.length} instances)`);
      } else {
        singleQuestions.push(questionGroup[0]);
      }
    }

    console.log(`\n📊 Question Analysis:`);
    console.log(`- Crossover question groups: ${actualCrossovers.length}`);
    console.log(`- Single questions: ${singleQuestions.length + uniqueQuestions.length}`);
    console.log(`- Total audio files to generate: ${actualCrossovers.length + singleQuestions.length + uniqueQuestions.length}\n`);

    if (dryRun) {
      console.log('🔍 DRY RUN - No audio will be generated\n');
      
      // Show what would be generated
      for (const crossoverGroup of actualCrossovers) {
        const representative = crossoverGroup[0];
        console.log(`🔄 Would generate crossover audio: Q${representative.question_number} - ${representative.title}`);
        console.log(`   Levels: ${crossoverGroup.map(q => `${q.level} Q${q.question_number}`).join(', ')}`);
      }

      for (const question of [...singleQuestions, ...uniqueQuestions]) {
        console.log(`🎵 Would generate single audio: ${question.level} Q${question.question_number} - ${question.title}`);
      }

      console.log('\n✅ Dry run completed');
      return;
    }

    let processedCount = 0;
    let errorCount = 0;

    // Process crossover questions first (generate once, use multiple times)
    for (const crossoverGroup of actualCrossovers) {
      const representative = crossoverGroup[0];
      
      console.log(`\n🔄 Processing crossover question: "${representative.title}"`);
      console.log(`   Instances: ${crossoverGroup.map(q => `${q.level} Q${q.question_number}`).join(', ')}`);

      try {
        // Check if any question in the group already has audio
        const existingAudio = crossoverGroup.find(q => q.audio_url);
        let audioUrl: string;

        if (existingAudio?.audio_url) {
          console.log(`   ♻️ Using existing audio: ${existingAudio.audio_url}`);
          audioUrl = existingAudio.audio_url;
        } else {
          // Generate new audio
          const isMultiSpeaker = representative.tts_config?.multiSpeaker || false;
          const speakers = representative.tts_config?.speakers;

          console.log(`   🎵 Generating new audio...`);
          console.log(`   🎭 Multi-speaker: ${isMultiSpeaker}`);

          const filename = `edexcel-crossover-${representative.question_type}-${representative.id}`;

          if (isMultiSpeaker && speakers) {
            audioUrl = await ttsService.generateEdexcelListeningAudio(
              representative.question_number,
              representative.audio_text,
              {
                voiceName: speakers[0]?.voiceName || 'Puck',
                language: representative.language || 'spanish',
                style: representative.tts_config?.style || 'natural and clear',
                tone: 'neutral',
                pace: 'slow'
              },
              filename,
              true,
              speakers
            );
          } else {
            const selectedVoice = representative.tts_config?.voiceName || getNextVoice(representative.language || 'spanish');
            audioUrl = await ttsService.generateEdexcelListeningAudio(
              representative.question_number,
              representative.audio_text,
              {
                voiceName: selectedVoice,
                language: representative.language || 'spanish',
                style: representative.tts_config?.style || 'natural and clear',
                tone: 'neutral',
                pace: 'slow'
              },
              filename,
              false
            );
          }
        }

        // Update all questions in the crossover group with the same audio URL
        for (const question of crossoverGroup) {
          const { error: updateError } = await supabase
            .from('edexcel_listening_questions')
            .update({ audio_url: audioUrl })
            .eq('id', question.id);

          if (updateError) {
            console.error(`   ❌ Error updating question ${question.id}:`, updateError);
            errorCount++;
          } else {
            console.log(`   ✅ Updated ${question.level} Q${question.question_number}`);
          }
        }

        processedCount++;
        console.log(`   🎉 Crossover group completed: ${audioUrl}`);

      } catch (error) {
        console.error(`   ❌ Error processing crossover group:`, error);
        errorCount++;
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Process single questions
    for (const question of [...singleQuestions, ...uniqueQuestions]) {
      console.log(`\n🎵 Processing ${question.level} Q${question.question_number}: "${question.title}"`);

      try {
        // Skip if already has audio
        if (question.audio_url) {
          console.log(`   ♻️ Already has audio: ${question.audio_url}`);
          continue;
        }

        const isMultiSpeaker = question.tts_config?.multiSpeaker || false;
        const speakers = question.tts_config?.speakers;

        console.log(`   🎭 Multi-speaker: ${isMultiSpeaker}`);

        const filename = `edexcel-${question.level}-q${question.question_number}-${question.id}`;

        let audioUrl: string;

        if (isMultiSpeaker && speakers) {
          audioUrl = await ttsService.generateEdexcelListeningAudio(
            question.question_number,
            question.audio_text,
            {
              voiceName: speakers[0]?.voiceName || 'Puck',
              language: question.language || 'spanish',
              style: question.tts_config?.style || 'natural and clear',
              tone: 'neutral',
              pace: 'slow'
            },
            filename,
            true,
            speakers
          );
        } else {
          const selectedVoice = question.tts_config?.voiceName || getNextVoice(question.language || 'spanish');
          audioUrl = await ttsService.generateEdexcelListeningAudio(
            question.question_number,
            question.audio_text,
            {
              voiceName: selectedVoice,
              language: question.language || 'spanish',
              style: question.tts_config?.style || 'natural and clear',
              tone: 'neutral',
              pace: 'slow'
            },
            filename,
            false
          );
        }

        // Update question with audio URL
        const { error: updateError } = await supabase
          .from('edexcel_listening_questions')
          .update({ audio_url: audioUrl })
          .eq('id', question.id);

        if (updateError) {
          console.error(`   ❌ Error updating question:`, updateError);
          errorCount++;
        } else {
          console.log(`   ✅ Generated and saved: ${audioUrl}`);
          processedCount++;
        }

      } catch (error) {
        console.error(`   ❌ Error processing question:`, error);
        errorCount++;
      }

      // Rate limiting delay
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`\n🎉 Edexcel Listening Audio Generation completed!`);
    console.log(`\n📊 Summary:`);
    console.log(`- Questions processed: ${processedCount}`);
    console.log(`- Errors: ${errorCount}`);
    console.log(`- Crossover groups: ${actualCrossovers.length}`);
    console.log(`- Single questions: ${singleQuestions.length + uniqueQuestions.length}`);

  } catch (error) {
    console.error('❌ Error in audio generation:', error);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const language = args.find(arg => arg.startsWith('--language='))?.split('=')[1] || 'es';
  const level = args.find(arg => arg.startsWith('--level='))?.split('=')[1];
  const dryRun = args.includes('--dry-run');
  const maxQuestions = parseInt(args.find(arg => arg.startsWith('--max='))?.split('=')[1] || '0') || undefined;

  generateEdexcelListeningAudio(language, level, dryRun, maxQuestions)
    .then(() => {
      console.log('\n✅ Audio generation script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Audio generation script failed:', error);
      process.exit(1);
    });
}

export { generateEdexcelListeningAudio };
