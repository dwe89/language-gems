#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Temple contexts for theming
const TEMPLE_CONTEXTS = [
  'Ancient tablet discovered in the inner sanctum',
  'Hieroglyphic inscription on the temple wall',
  'Sacred text carved into volcanic stone',
  'Mysterious rune found in the lava chamber',
  'Ancient prophecy etched in obsidian',
  'Temple guardian\'s forgotten message',
  'Ritual inscription on the altar stone',
  'Lost scripture from the fire priests',
  'Ancient warning carved in granite',
  'Sacred verse from the temple archives'
];

// Restoration prompts
const RESTORATION_PROMPTS = [
  'Restore the ancient inscription to unlock its secrets',
  'Complete the sacred text to reveal its meaning',
  'Fill in the missing runes to activate the tablet',
  'Reconstruct the prophecy to understand its power',
  'Restore the temple message to its original form',
  'Complete the ancient warning to heed its wisdom',
  'Fill the gaps to reveal the hidden knowledge',
  'Reconstruct the sacred verse to unlock the chamber'
];

// Function to create word gaps in sentences
function createWordGaps(sentence: string, language: string): {
  sentenceWithGaps: string;
  missingWords: string[];
  gapPositions: number[];
} {
  const words = sentence.split(' ');
  const totalWords = words.length;
  
  // Determine number of gaps based on sentence length
  let numGaps = 1;
  if (totalWords >= 8) numGaps = 2;
  if (totalWords >= 12) numGaps = 3;
  
  // Select random positions for gaps (avoid first and last word)
  const availablePositions = Array.from({ length: totalWords - 2 }, (_, i) => i + 1);
  const gapPositions: number[] = [];
  const missingWords: string[] = [];
  
  // Randomly select gap positions
  for (let i = 0; i < numGaps && availablePositions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * availablePositions.length);
    const position = availablePositions.splice(randomIndex, 1)[0];
    gapPositions.push(position);
  }
  
  // Sort positions to maintain order
  gapPositions.sort((a, b) => a - b);
  
  // Create sentence with gaps and collect missing words
  const wordsWithGaps = [...words];
  gapPositions.forEach((position, index) => {
    missingWords.push(words[position]);
    wordsWithGaps[position] = `[GAP${index + 1}]`;
  });
  
  return {
    sentenceWithGaps: wordsWithGaps.join(' '),
    missingWords,
    gapPositions
  };
}

// Function to generate distractor words
function generateDistractors(correctWord: string, language: string, allWords: string[]): string[] {
  const distractors: string[] = [];
  
  // Get words of similar length
  const similarLengthWords = allWords.filter(word => 
    Math.abs(word.length - correctWord.length) <= 2 && 
    word.toLowerCase() !== correctWord.toLowerCase()
  );
  
  // Add 2-3 distractors
  const numDistractors = Math.min(3, similarLengthWords.length);
  const shuffled = similarLengthWords.sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < numDistractors; i++) {
    if (shuffled[i] && !distractors.includes(shuffled[i])) {
      distractors.push(shuffled[i]);
    }
  }
  
  // If we don't have enough distractors, add some generic ones based on language
  const genericDistractors = {
    spanish: ['el', 'la', 'un', 'una', 'es', 'son', 'muy', 'más', 'con', 'por'],
    french: ['le', 'la', 'un', 'une', 'est', 'sont', 'très', 'plus', 'avec', 'pour'],
    german: ['der', 'die', 'das', 'ein', 'eine', 'ist', 'sind', 'sehr', 'mehr', 'mit']
  };
  
  const langDistractors = genericDistractors[language as keyof typeof genericDistractors] || [];
  
  while (distractors.length < 3 && langDistractors.length > 0) {
    const randomDistractor = langDistractors[Math.floor(Math.random() * langDistractors.length)];
    if (!distractors.includes(randomDistractor) && randomDistractor !== correctWord.toLowerCase()) {
      distractors.push(randomDistractor);
    }
  }
  
  return distractors;
}

async function populateWordRestoreSentences() {
  console.log('🏛️ Starting Word Restore sentence population...');
  
  let totalInserted = 0;
  let totalErrors = 0;

  // Clear existing word restore sentences
  console.log('🧹 Clearing existing word restore sentences...');
  const { error: deleteError } = await supabase
    .from('word_restore_sentences')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('❌ Error clearing existing sentences:', deleteError);
  } else {
    console.log('✅ Existing word restore sentences cleared');
  }

  // Also clear existing options
  const { error: deleteOptionsError } = await supabase
    .from('word_restore_options')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteOptionsError) {
    console.error('❌ Error clearing existing options:', deleteOptionsError);
  }

  // Get existing sentences from the sentences table
  const { data: existingSentences, error: fetchError } = await supabase
    .from('sentences')
    .select('*')
    .eq('curriculum_level', 'KS3')
    .eq('is_active', true)
    .eq('is_public', true);

  if (fetchError) {
    console.error('❌ Error fetching existing sentences:', fetchError);
    return;
  }

  if (!existingSentences || existingSentences.length === 0) {
    console.error('❌ No existing sentences found to convert');
    return;
  }

  console.log(`📚 Found ${existingSentences.length} sentences to convert`);

  // Collect all words for generating distractors
  const allWordsByLanguage: { [key: string]: string[] } = {
    spanish: [],
    french: [],
    german: []
  };

  existingSentences.forEach(sentence => {
    const words = sentence.source_sentence.split(' ').map((w: string) => w.replace(/[.,!?;:]/, ''));
    allWordsByLanguage[sentence.source_language].push(...words);
  });

  // Process each sentence
  for (const sentence of existingSentences) {
    try {
      console.log(`🔄 Processing: "${sentence.source_sentence.substring(0, 50)}..."`);
      
      // Create word gaps
      const { sentenceWithGaps, missingWords, gapPositions } = createWordGaps(
        sentence.source_sentence, 
        sentence.source_language
      );

      // Create word restore sentence record
      const wordRestoreData = {
        source_language: sentence.source_language,
        complete_sentence: sentence.source_sentence,
        sentence_with_gaps: sentenceWithGaps,
        missing_words: missingWords,
        gap_positions: gapPositions,
        category: sentence.category,
        subcategory: sentence.subcategory,
        difficulty_level: sentence.difficulty_level,
        curriculum_level: sentence.curriculum_level,
        temple_context: TEMPLE_CONTEXTS[Math.floor(Math.random() * TEMPLE_CONTEXTS.length)],
        restoration_prompt: RESTORATION_PROMPTS[Math.floor(Math.random() * RESTORATION_PROMPTS.length)],
        temple_difficulty: Math.floor(Math.random() * 3) + 1,
        word_count: sentence.word_count,
        gap_count: missingWords.length,
        complexity_score: Math.min(sentence.word_count + missingWords.length, 10),
        is_active: true,
        is_public: true
      };

      const { data: insertedSentence, error: insertError } = await supabase
        .from('word_restore_sentences')
        .insert([wordRestoreData])
        .select()
        .single();

      if (insertError) {
        console.log(`❌ Error inserting sentence: ${insertError.message}`);
        totalErrors++;
        continue;
      }

      console.log(`✅ Inserted sentence with ${missingWords.length} gaps`);
      totalInserted++;

      // Create options for each gap
      for (let gapIndex = 0; gapIndex < missingWords.length; gapIndex++) {
        const correctWord = missingWords[gapIndex];
        const distractors = generateDistractors(
          correctWord, 
          sentence.source_language, 
          allWordsByLanguage[sentence.source_language]
        );

        // Insert correct option
        const correctOption = {
          sentence_id: insertedSentence.id,
          gap_index: gapIndex,
          option_text: correctWord,
          is_correct: true
        };

        const { error: correctOptionError } = await supabase
          .from('word_restore_options')
          .insert([correctOption]);

        if (correctOptionError) {
          console.log(`❌ Error inserting correct option: ${correctOptionError.message}`);
          totalErrors++;
        }

        // Insert distractor options
        for (const distractor of distractors) {
          const distractorOption = {
            sentence_id: insertedSentence.id,
            gap_index: gapIndex,
            option_text: distractor,
            is_correct: false
          };

          const { error: distractorError } = await supabase
            .from('word_restore_options')
            .insert([distractorOption]);

          if (distractorError) {
            console.log(`❌ Error inserting distractor: ${distractorError.message}`);
            totalErrors++;
          }
        }
      }

    } catch (err) {
      console.error('❌ Error processing sentence:', err);
      totalErrors++;
    }
  }

  console.log('\n🎯 Word Restore population complete!');
  console.log(`✅ Successfully converted: ${totalInserted} sentences`);
  console.log(`❌ Errors encountered: ${totalErrors}`);
  
  if (totalInserted > 0) {
    console.log('\n🏛️ Lava Temple: Word Restore sentences ready!');
    console.log('📊 Features:');
    console.log('   • Sentences with strategic word gaps');
    console.log('   • Multiple choice options for each gap');
    console.log('   • Temple-themed contexts and prompts');
    console.log('   • Difficulty-appropriate gap placement');
  }
}

// Run the population
populateWordRestoreSentences()
  .then(() => {
    console.log('✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
