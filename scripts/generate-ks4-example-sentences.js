#!/usr/bin/env node

/**
 * Generate Example Sentences for KS4 Vocabulary
 * 
 * This script reads the KS4 CSV file and generates contextual example sentences
 * for each vocabulary word using OpenAI API, then creates an enhanced CSV
 * ready for import into the centralized_vocabulary table.
 * 
 * Usage: node scripts/generate-ks4-example-sentences.js [csv-file-path]
 * Example: node scripts/generate-ks4-example-sentences.js GCSE_processed.csv
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID,
  project: process.env.OPENAI_PROJECT_ID,
});

// Language configuration
const LANGUAGE_CONFIG = {
  'es': {
    name: 'Spanish',
    code: 'es',
    level: 'GCSE/KS4',
    grammar_notes: 'Use appropriate gender agreements, verb conjugations, and formal/informal registers'
  },
  'fr': {
    name: 'French',
    code: 'fr', 
    level: 'GCSE/KS4',
    grammar_notes: 'Use appropriate gender agreements, verb conjugations, and formal/informal registers'
  },
  'de': {
    name: 'German',
    code: 'de',
    level: 'GCSE/KS4', 
    grammar_notes: 'Use appropriate gender agreements, case system (Nominativ, Akkusativ, Dativ, Genitiv), and verb conjugations'
  }
};

/**
 * Parse CSV content into vocabulary objects
 */
function parseVocabularyCSV(csvContent) {
  try {
    // Remove BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, '');
    
    // Parse CSV with proper handling
    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      quote: '"',
      delimiter: ',',
      escape: '"',
      relax_column_count: true,
      cast: (value) => {
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      }
    });

    console.log(`📊 Parsed ${records.length} vocabulary entries from CSV`);
    
    // Log language distribution
    const languageCount = records.reduce((acc, record) => {
      acc[record.language] = (acc[record.language] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Language distribution:');
    Object.entries(languageCount).forEach(([lang, count]) => {
      console.log(`   ${LANGUAGE_CONFIG[lang]?.name || lang}: ${count} entries`);
    });

    return records;
  } catch (error) {
    console.error('❌ Error parsing CSV:', error.message);
    throw error;
  }
}

/**
 * Generate example sentences for a batch of vocabulary words
 */
async function generateSentenceBatch(vocabularyBatch, batchNumber, totalBatches) {
  const language = vocabularyBatch[0].language;
  const langConfig = LANGUAGE_CONFIG[language];
  
  console.log(`\n🤖 Generating sentences for batch ${batchNumber}/${totalBatches} (${language.toUpperCase()}) - ${vocabularyBatch.length} words`);

  // Create the prompt for OpenAI
  const prompt = `You are an expert ${langConfig.name} teacher creating example sentences for GCSE/KS4 level students.

For each vocabulary word provided, create:
1. An example sentence in ${langConfig.name} that demonstrates the word in context
2. An accurate English translation of that sentence

Requirements:
- Sentences should be appropriate for ${langConfig.level} level students
- Use natural, conversational language that students would encounter
- ${langConfig.grammar_notes}
- Keep sentences between 6-10 words for clarity
- Make sentences relevant to the theme/topic context when possible
- Ensure translations are natural English, not word-for-word

Return ONLY a JSON array with this exact structure:
[
  {
    "word": "exact word from input",
    "example_sentence_original": "sentence in ${langConfig.name}",
    "example_sentence_translation": "natural English translation"
  }
]

Vocabulary words to process:
${vocabularyBatch.map((item, index) => 
  `${index + 1}. Word: "${item.word}" | Translation: "${item.translation}" | Part of speech: "${item['Part of speech']}" | Theme: "${item.theme_name}" | Topic: "${item['theme_name.1']}"`
).join('\n')}`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { 
          role: 'system', 
          content: `You are an expert ${langConfig.name} teacher. Always return valid JSON arrays only. No additional text or explanations.` 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const responseContent = completion.choices[0].message.content;
    
    // Parse the JSON response
    let generatedSentences;
    try {
      generatedSentences = JSON.parse(responseContent);
    } catch (parseError) {
      console.error('❌ Failed to parse OpenAI response as JSON:', parseError.message);
      console.error('Response content:', responseContent);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Validate response structure
    if (!Array.isArray(generatedSentences)) {
      throw new Error('OpenAI response is not an array');
    }

    if (generatedSentences.length !== vocabularyBatch.length) {
      console.warn(`⚠️  Expected ${vocabularyBatch.length} sentences, got ${generatedSentences.length}`);
    }

    // Map generated sentences back to vocabulary items
    const enhancedVocabulary = vocabularyBatch.map((item, index) => {
      const generated = generatedSentences.find(s => s.word === item.word) || generatedSentences[index];
      
      return {
        ...item,
        example_sentence_original: generated?.example_sentence_original || '',
        example_sentence_translation: generated?.example_sentence_translation || ''
      };
    });

    console.log(`✅ Generated ${generatedSentences.length} example sentences`);
    return enhancedVocabulary;

  } catch (error) {
    console.error(`❌ Error generating sentences for batch ${batchNumber}:`, error.message);
    
    // Return original vocabulary with empty sentences as fallback
    return vocabularyBatch.map(item => ({
      ...item,
      example_sentence_original: '',
      example_sentence_translation: ''
    }));
  }
}

/**
 * Save checkpoint to prevent data loss
 */
function saveCheckpoint(enhancedVocabulary, checkpointNumber) {
  const checkpointFile = `checkpoint_${checkpointNumber}_${Date.now()}.json`;
  fs.writeFileSync(checkpointFile, JSON.stringify(enhancedVocabulary, null, 2));
  console.log(`💾 Checkpoint saved: ${checkpointFile} (${enhancedVocabulary.length} entries)`);
  return checkpointFile;
}

/**
 * Process vocabulary in batches with rate limiting and checkpoints
 */
async function processVocabularyWithSentences(vocabularyData) {
  const BATCH_SIZE = 50; // Process 50 words at a time - MUCH FASTER!
  const DELAY_BETWEEN_BATCHES = 100; // 0.1 second delay - BLAZING FAST!
  const CHECKPOINT_INTERVAL = 10; // Save checkpoint every 10 batches (every 500 words)

  // Group by language for better context
  const groupedByLanguage = vocabularyData.reduce((acc, item) => {
    if (!acc[item.language]) acc[item.language] = [];
    acc[item.language].push(item);
    return acc;
  }, {});

  const enhancedVocabulary = [];
  let totalBatchesProcessed = 0;
  
  for (const [language, items] of Object.entries(groupedByLanguage)) {
    console.log(`\n🔄 Processing ${items.length} ${language.toUpperCase()} vocabulary entries...`);
    
    // Process in batches
    const batches = [];
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      batches.push(items.slice(i, i + BATCH_SIZE));
    }
    
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const enhancedBatch = await generateSentenceBatch(batch, i + 1, batches.length);
      enhancedVocabulary.push(...enhancedBatch);
      totalBatchesProcessed++;

      // Save checkpoint every CHECKPOINT_INTERVAL batches
      if (totalBatchesProcessed % CHECKPOINT_INTERVAL === 0) {
        saveCheckpoint(enhancedVocabulary, totalBatchesProcessed);
      }

      // Rate limiting delay (except for last batch)
      if (i < batches.length - 1) {
        console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES/1000}s before next batch...`);
        await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
      }
    }

    // Save final checkpoint for this language
    console.log(`💾 Saving final checkpoint for ${language.toUpperCase()}...`);
    saveCheckpoint(enhancedVocabulary, `${language}_final`);
  }

  // Save final checkpoint with all languages
  console.log('💾 Saving final checkpoint with all languages...');
  saveCheckpoint(enhancedVocabulary, 'all_languages_final');

  return enhancedVocabulary;
}

/**
 * Clean and prepare data for database import
 */
function prepareForImport(vocabularyData) {
  return vocabularyData.map(item => ({
    language: item.language,
    part_of_speech: item['Part of speech'],
    word: item.word,
    translation: item.translation,
    word_type: item.word_type || '',
    gender: item.gender || '',
    article: item.article || '',
    display_word: item.display_word,
    example_sentence: item.example_sentence_original,
    example_translation: item.example_sentence_translation,
    exam_board_code: item.exam_board_code,
    theme_name: item.theme_name,
    unit_name: item['theme_name.1'], // Map theme_name.1 to unit_name
    tier: item.tier,
    is_required: item.is_required === 'True' || item.is_required === true,
    curriculum_level: 'KS4' // Set for all entries
  }));
}

/**
 * Main execution function
 */
async function main() {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.log('📋 KS4 Example Sentence Generator');
    console.log('==================================');
    console.log('');
    console.log('Usage: node scripts/generate-ks4-example-sentences.js [csv-file-path]');
    console.log('Example: node scripts/generate-ks4-example-sentences.js GCSE_processed.csv');
    console.log('');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  // Check OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    console.error('Please add your OpenAI API key to .env.local');
    process.exit(1);
  }

  try {
    console.log(`📖 Reading CSV file: ${csvFilePath}`);
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    console.log('🔍 Parsing CSV content...');
    const vocabularyData = parseVocabularyCSV(csvContent);
    
    if (vocabularyData.length === 0) {
      console.log('❌ No valid vocabulary items found in CSV');
      process.exit(1);
    }

    // Confirm before proceeding
    console.log(`\n⚠️  About to generate example sentences for ${vocabularyData.length} vocabulary items using OpenAI API.`);
    console.log('💰 This will consume OpenAI API credits. Estimated cost: ~$2-5 USD');
    console.log('🔄 Press Ctrl+C to cancel or wait 10 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 10000));

    // Generate example sentences
    console.log('\n🚀 Starting sentence generation...');
    const enhancedVocabulary = await processVocabularyWithSentences(vocabularyData);
    
    // Prepare data for import
    const importReadyData = prepareForImport(enhancedVocabulary);
    
    // Generate output filename
    const inputBasename = path.basename(csvFilePath, path.extname(csvFilePath));
    const outputFilename = `${inputBasename}_with_sentences.csv`;
    const outputPath = path.join(path.dirname(csvFilePath), outputFilename);
    
    // Write enhanced CSV
    const csvOutput = stringify(importReadyData, {
      header: true,
      columns: [
        'language', 'part_of_speech', 'word', 'translation', 'word_type', 
        'gender', 'article', 'display_word', 'example_sentence', 'example_translation',
        'exam_board_code', 'theme_name', 'unit_name', 'tier', 'is_required', 'curriculum_level'
      ]
    });
    
    fs.writeFileSync(outputPath, csvOutput);
    
    console.log('\n🎉 Sentence generation completed!');
    console.log(`📄 Enhanced CSV saved to: ${outputPath}`);
    console.log(`📊 Total entries processed: ${importReadyData.length}`);
    
    // Show sample of generated sentences
    console.log('\n📝 Sample generated sentences:');
    const samples = importReadyData.filter(item => item.example_sentence).slice(0, 3);
    samples.forEach((item, index) => {
      console.log(`${index + 1}. ${item.word} (${item.language})`);
      console.log(`   Original: ${item.example_sentence}`);
      console.log(`   Translation: ${item.example_translation}`);
    });
    
    console.log('\n🎵 Next steps:');
    console.log('1. Review the generated sentences in the output file');
    console.log('2. Import using: node scripts/bulk-import-vocabulary.js ' + outputFilename);
    console.log('3. Generate audio files using: node scripts/generate-vocabulary-audio.js');

  } catch (error) {
    console.error('\n❌ Error during sentence generation:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  parseVocabularyCSV,
  generateSentenceBatch,
  processVocabularyWithSentences,
  prepareForImport
};
