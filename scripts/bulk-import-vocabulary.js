#!/usr/bin/env node

/**
 * Bulk Vocabulary Import Script
 * 
 * This script imports vocabulary from a CSV file with the standard vocabulary template format
 * into the centralized_vocabulary table with proper audio generation.
 * 
 * Usage: node scripts/bulk-import-vocabulary.js [csv-file-path]
 * Example: node scripts/bulk-import-vocabulary.js vocabtoupload.csv
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
    
    console.log(`📋 Parsed ${records.length} records from CSV`);
    
    // Filter out empty rows and validate required fields
    const validRecords = records.filter(record => {
      return record.word && record.word.trim() && 
             record.translation && record.translation.trim() &&
             record.language && record.language.trim();
    });
    
    console.log(`✅ ${validRecords.length} valid vocabulary items found`);
    
    return validRecords;
    
  } catch (error) {
    console.error('❌ CSV parsing error:', error.message);
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
}

/**
 * Import vocabulary items in batches
 */
async function importVocabularyBatch(vocabularyData) {
  console.log(`🚀 Starting bulk import of ${vocabularyData.length} vocabulary items...`);
  
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  const errors = [];
  
  // Process in batches to avoid overwhelming the database
  const BATCH_SIZE = 50;
  const DELAY_MS = 1000; // 1 second between batches
  
  for (let i = 0; i < vocabularyData.length; i += BATCH_SIZE) {
    const batch = vocabularyData.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(vocabularyData.length / BATCH_SIZE);
    
    console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
    
    // Process each item in the batch
    for (const [index, item] of batch.entries()) {
      try {
        const itemNumber = i + index + 1;
        
        // Check for duplicates first
        const { data: existing, error: duplicateCheckError } = await supabase
          .from('centralized_vocabulary')
          .select('id')
          .eq('word', item.word)
          .eq('language', item.language.toLowerCase())
          .limit(1);
        
        if (duplicateCheckError) {
          console.error(`❌ Error checking duplicate for "${item.word}":`, duplicateCheckError.message);
          errors.push({ item: item.word, error: duplicateCheckError.message });
          errorCount++;
          continue;
        }
        
        if (existing && existing.length > 0) {
          console.log(`⚠️  Skipping duplicate: ${item.word} (${item.language})`);
          duplicateCount++;
          continue;
        }
        
        // Prepare vocabulary item for insertion
        const vocabularyItem = {
          word: item.word,
          translation: item.translation,
          language: item.language.toLowerCase(),
          category: item.category || null,
          subcategory: item.subcategory || null,
          part_of_speech: item.part_of_speech || null,
          curriculum_level: item.curriculum_level || null,
          example_sentence: item.example_sentence || null,
          example_translation: item.example_translation || null,
          gender: item.gender || null,
          article: item.article || null,
          base_word: item.base_word || null
        };
        
        // Insert into database
        const { data: inserted, error: insertError } = await supabase
          .from('centralized_vocabulary')
          .insert(vocabularyItem)
          .select()
          .single();
        
        if (insertError) {
          console.error(`❌ Error inserting "${item.word}":`, insertError.message);
          errors.push({ item: item.word, error: insertError.message });
          errorCount++;
          continue;
        }
        
        console.log(`✅ [${itemNumber}/${vocabularyData.length}] Imported: ${item.word} (${item.language})`);
        successCount++;
        
        // Small delay between individual inserts to avoid overwhelming DB
        if (index < batch.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        
      } catch (error) {
        console.error(`❌ Unexpected error with "${item.word}":`, error.message);
        errors.push({ item: item.word, error: error.message });
        errorCount++;
      }
    }
    
    // Delay between batches (except for the last batch)
    if (i + BATCH_SIZE < vocabularyData.length) {
      console.log(`⏸️  Waiting ${DELAY_MS}ms before next batch...`);
      await new Promise(resolve => setTimeout(resolve, DELAY_MS));
    }
  }
  
  // Summary
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} items`);
  console.log(`⚠️  Duplicates skipped: ${duplicateCount} items`);
  console.log(`❌ Failed to import: ${errorCount} items`);
  console.log(`📋 Total processed: ${successCount + duplicateCount + errorCount} items`);
  
  if (errors.length > 0) {
    console.log('\n🔍 First 10 errors encountered:');
    errors.slice(0, 10).forEach(err => {
      console.log(`  - ${err.item}: ${err.error}`);
    });
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`);
    }
  }
  
  return { successCount, errorCount, duplicateCount };
}

/**
 * Main execution function
 */
async function main() {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.log('📋 Bulk Vocabulary Import');
    console.log('========================');
    console.log('');
    console.log('Usage: node scripts/bulk-import-vocabulary.js [csv-file-path]');
    console.log('Example: node scripts/bulk-import-vocabulary.js vocabtoupload.csv');
    console.log('');
    console.log('Expected CSV format:');
    console.log('word,translation,language,category,subcategory,part_of_speech,curriculum_level,example_sentence,example_translation,gender,article,base_word');
    console.log('');
    process.exit(1);
  }
  
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
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
    
    // Show preview of first few items
    console.log('\n👀 Preview of first 3 items:');
    vocabularyData.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.word} (${item.language}) → ${item.translation}`);
      if (item.category) console.log(`   Category: ${item.category}${item.subcategory ? ` > ${item.subcategory}` : ''}`);
      if (item.article && item.base_word) console.log(`   Article/Base: ${item.article} / ${item.base_word}`);
    });
    
    // Confirm before proceeding
    console.log(`\n⚠️  About to import ${vocabularyData.length} vocabulary items.`);
    console.log('💡 Note: Audio generation will be handled separately after import.');
    console.log('🔄 Press Ctrl+C to cancel or wait 5 seconds to continue...');
    
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Start the import
    const results = await importVocabularyBatch(vocabularyData);
    
    console.log('\n🎉 Bulk import completed!');
    
    if (results.successCount > 0) {
      console.log('\n🎵 Next steps:');
      console.log('1. Check your vocabulary at http://localhost:3000/admin/vocabulary');
      console.log('2. Generate audio files using: npm run generate-audio');
      console.log('3. Or use the "Generate Missing Audio" button in the admin interface');
    }
    
  } catch (error) {
    console.error('💥 Import failed:', error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Import interrupted by user');
  process.exit(0);
});

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

module.exports = { parseVocabularyCSV, importVocabularyBatch };
