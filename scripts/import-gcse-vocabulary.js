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
 * Parse CSV content into array of objects
 */
function parseCSV(csvContent) {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;
    
    // Handle CSV parsing with potential commas in quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim().replace(/"/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/"/g, ''));
    
    if (values.length >= 3) {
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      data.push(row);
    }
  }
  
  return data;
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
      // Map CSV columns to expected parameters
      const theme = item['Theme'] || item['theme'] || '';
      const topic = item['Topic'] || item['topic'] || '';
      const partOfSpeech = item['Part_of_Speech'] || item['Part of Speech'] || item['part_of_speech'] || '';
      const spanishTerm = item['Headword_Spanish'] || item['Headword Spanish'] || item['headword_spanish'] || '';
      const englishTranslation = item['English_Equivalent'] || item['English Equivalent'] || item['english_equivalent'] || '';
      
      if (!spanishTerm || !englishTranslation) {
        console.warn(`⚠️  Skipping row ${index + 2}: Missing Spanish term or English translation`);
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
      console.log('First item:', vocabularyData[0]);
      
      if (vocabularyData.length > 1) {
        console.log('Second item:', vocabularyData[1]);
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