#!/usr/bin/env node

/**
 * GCSE Vocabulary Import Script
 * 
 * This script reads a CSV file containing GCSE Spanish vocabulary
 * and imports it into the Supabase database.
 * 
 * Usage: node scripts/import-gcse-vocabulary.js [csv-file-path]
 * Example: node scripts/import-gcse-vocabulary.js data/vocabulary/gcse-spanish-vocabulary.csv
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Load environment variables first
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
 * Parse CSV content into array of objects using proper CSV parser
 */
function parseCSV(csvContent) {
  try {
    // Remove BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, '');
    
    // Parse CSV with proper handling of quotes, commas, and special characters
    const records = parse(cleanContent, {
      columns: true, // Use first row as column headers
      skip_empty_lines: true,
      trim: true,
      quote: '"',
      delimiter: ',',
      escape: '"',
      relax_column_count: true, // Allow inconsistent column counts
      cast: (value, { column }) => {
        // Clean up values
        if (typeof value === 'string') {
          return value.trim();
        }
        return value;
      }
    });
    
    console.log(`📋 Parsed ${records.length} records from CSV`);
    
    // Log column headers for debugging
    if (records.length > 0) {
      console.log('📝 Column headers found:', Object.keys(records[0]));
    }
    
    return records;
    
  } catch (error) {
    console.error('❌ CSV parsing error:', error.message);
    throw new Error(`Failed to parse CSV: ${error.message}`);
  }
}

/**
 * Import vocabulary items using the database function
 */
async function importVocabularyItems(vocabularyData) {
  console.log(`📚 Starting import of ${vocabularyData.length} vocabulary items...`);
  
  let successCount = 0;
  let errorCount = 0;
  const errors = [];
  
  for (const [index, item] of vocabularyData.entries()) {
    try {
      // Map CSV columns to expected parameters with better debugging
      const theme = item['Theme'] || item['theme'] || '';
      const topic = item['Topic'] || item['topic'] || '';
      const partOfSpeech = item['Part_of_Speech'] || item['Part of Speech'] || item['part_of_speech'] || '';
      const spanishTerm = item['Headword_Spanish'] || item['Headword Spanish'] || item['headword_spanish'] || item['word'] || '';
      const englishTranslation = item['English_Equivalent'] || item['English Equivalent'] || item['english_equivalent'] || item['translation'] || '';
      
      // Debug logging for first few items
      if (index < 3) {
        console.log(`\n🔍 Row ${index + 1} mapping:`);
        console.log(`  Spanish: "${spanishTerm}" (from: ${Object.keys(item).find(k => item[k] === spanishTerm)})`);
        console.log(`  English: "${englishTranslation}" (from: ${Object.keys(item).find(k => item[k] === englishTranslation)})`);
        console.log(`  Theme: "${theme}"`);
        console.log(`  Topic: "${topic}"`);
        console.log(`  Part of Speech: "${partOfSpeech}"`);
        console.log(`  All fields:`, Object.keys(item));
      }
      
      if (!spanishTerm || !englishTranslation) {
        console.warn(`⚠️  Skipping row ${index + 2}: Missing Spanish term or English translation`);
        console.warn(`    Available fields:`, Object.keys(item));
        console.warn(`    Row data:`, item);
        continue;
      }
      
      // Call the database function to import this vocabulary item
      const { error } = await supabase.rpc('import_gcse_vocabulary', {
        theme_name: theme,
        topic_name: topic,
        part_of_speech: partOfSpeech,
        spanish_term: spanishTerm,
        english_translation: englishTranslation
      });
      
      if (error) {
        console.error(`❌ Error importing "${spanishTerm}":`, error.message);
        errors.push({ term: spanishTerm, error: error.message });
        errorCount++;
      } else {
        successCount++;
        if (successCount % 50 === 0) {
          console.log(`✅ Imported ${successCount} items...`);
        }
      }
      
    } catch (err) {
      console.error(`❌ Unexpected error with row ${index + 2}:`, err.message);
      errorCount++;
    }
  }
  
  console.log('\n📊 Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} items`);
  console.log(`❌ Failed to import: ${errorCount} items`);
  
  if (errors.length > 0) {
    console.log('\n🔍 Errors encountered:');
    errors.slice(0, 10).forEach(err => {
      console.log(`  - ${err.term}: ${err.error}`);
    });
    if (errors.length > 10) {
      console.log(`  ... and ${errors.length - 10} more errors`);
    }
  }
  
  return { successCount, errorCount };
}

/**
 * Main execution function
 */
async function main() {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.log('Usage: node scripts/import-gcse-vocabulary.js [csv-file-path]');
    console.log('Example: node scripts/import-gcse-vocabulary.js data/vocabulary/gcse-spanish-vocabulary.csv');
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
    const vocabularyData = parseCSV(csvContent);
    
    console.log(`📋 Found ${vocabularyData.length} vocabulary entries`);
    
    // Show preview of first few items
    if (vocabularyData.length > 0) {
      console.log('\n🔍 Preview of data:');
      console.log('Headers:', Object.keys(vocabularyData[0]));
      
      // Show first item with field mapping
      console.log('\n📋 First item field mapping:');
      const firstItem = vocabularyData[0];
      Object.keys(firstItem).forEach(key => {
        const value = firstItem[key];
        if (value && value.length > 0) {
          console.log(`  ${key}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
        }
      });
      
      // Check for potential issues
      console.log('\n🔍 Checking for potential issues:');
      const headers = Object.keys(firstItem);
      
      // Check if word/spanish term is in the expected place
      const wordFields = headers.filter(h => h.toLowerCase().includes('word') || h.toLowerCase().includes('spanish') || h.toLowerCase().includes('headword'));
      console.log(`  Word/Spanish fields found: ${wordFields.join(', ')}`);
      
      // Check if translation is in the expected place
      const translationFields = headers.filter(h => h.toLowerCase().includes('translation') || h.toLowerCase().includes('english') || h.toLowerCase().includes('equivalent'));
      console.log(`  Translation/English fields found: ${translationFields.join(', ')}`);
      
      // Check for suspicious shifts (tags in word column, etc.)
      const firstWord = firstItem[wordFields[0]] || firstItem['word'] || '';
      if (firstWord.includes(';') || firstWord.includes('greeting') || firstWord.includes('polite')) {
        console.log('  ⚠️  WARNING: First word contains tags/metadata - possible column shift detected!');
        console.log(`     First word value: "${firstWord}"`);
      }
      
      if (vocabularyData.length > 1) {
        console.log('\nSecond item:', vocabularyData[1]);
      }
      
      // Ask for confirmation
      console.log('\n❓ Does this look correct? Press Ctrl+C to abort or wait 5 seconds to continue...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Import the data
    const result = await importVocabularyItems(vocabularyData);
    
    console.log('\n🎉 Import complete!');
    
  } catch (error) {
    console.error('❌ Failed to import vocabulary:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
} 