#!/usr/bin/env node

/**
 * Retry Failed Vocabulary Import Script
 * 
 * This script attempts to import the vocabulary entries that failed during the bulk import
 * due to database column length constraints.
 * 
 * Usage: node scripts/retry-failed-imports.js [csv-file-path]
 */

const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Specific line numbers that had constraint violations
const FAILED_LINES = [
  2136, 2138, 2155, 2175, 2194,  // language field issues
  2155, // article field issue (same line as language issue)
  3075, 3076, 3077, 3082, 3083, 3084, 3085, 3086, 3087, 3088, 3089, 3095, 3096, 3097, 3098, 3099, 3100, 3105, 3106, 3107, 3108, 3109,
  3130, 3131, 3132, 3133, 3134, 3135, 3155, 3156, 3157, 3160, 3161, 3184,
  3416, 3417, 3418, 3419, 3420, 3421, 3422, 3423, 3424, 3425, 3426, 3427, 3428, 3429, 3430, 3431, 3432, 3433, 3434, 3435, 3436, 3437, 3438, 3439, 3440, 3441, 3442, 3443, 3444, 3445,
  3449, 3450, 3454, 3455, 3460, 3461
];

async function retryFailedImports(csvPath) {
  console.log(`🔄 Retrying failed imports from: ${csvPath}`);
  
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const cleanContent = csvContent.replace(/^\uFEFF/, '');
  
  const records = parse(cleanContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    quote: '"',
    delimiter: ',',
    escape: '"',
    relax_column_count: true
  });
  
  console.log(`📋 Total records in CSV: ${records.length}`);
  
  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;
  const errors = [];
  
  // Only process the specific failed lines
  for (const lineNumber of FAILED_LINES) {
    const recordIndex = lineNumber - 2; // Convert line number to array index
    
    if (recordIndex < 0 || recordIndex >= records.length) {
      console.log(`⚠️  Line ${lineNumber} is out of range`);
      continue;
    }
    
    const item = records[recordIndex];
    
    // Skip if required fields are missing
    if (!item.word || !item.translation || !item.language) {
      console.log(`⚠️  Line ${lineNumber}: Missing required fields, skipping`);
      errorCount++;
      continue;
    }
    
    try {
      // Check for duplicates first
      const { data: existing, error: duplicateCheckError } = await supabase
        .from('centralized_vocabulary')
        .select('id')
        .eq('word', item.word)
        .eq('language', item.language.toLowerCase())
        .limit(1);
      
      if (duplicateCheckError) {
        console.error(`❌ Error checking duplicate for line ${lineNumber} "${item.word}":`, duplicateCheckError.message);
        errors.push({ line: lineNumber, item: item.word, error: duplicateCheckError.message });
        errorCount++;
        continue;
      }
      
      if (existing && existing.length > 0) {
        console.log(`⚠️  Line ${lineNumber}: Duplicate already exists: ${item.word} (${item.language})`);
        duplicateCount++;
        continue;
      }
      
      // Prepare vocabulary item for insertion with data validation
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
        console.error(`❌ Line ${lineNumber}: Error inserting "${item.word}":`, insertError.message);
        errors.push({ line: lineNumber, item: item.word, error: insertError.message });
        errorCount++;
        continue;
      }
      
      console.log(`✅ Line ${lineNumber}: Successfully imported: ${item.word} (${item.language})`);
      successCount++;
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Line ${lineNumber}: Unexpected error with "${item.word}":`, error.message);
      errors.push({ line: lineNumber, item: item.word, error: error.message });
      errorCount++;
    }
  }
  
  // Summary
  console.log('\n📊 Retry Import Summary:');
  console.log(`✅ Successfully imported: ${successCount} items`);
  console.log(`⚠️  Duplicates skipped: ${duplicateCount} items`);
  console.log(`❌ Still failed: ${errorCount} items`);
  console.log(`📋 Total attempted: ${FAILED_LINES.length} items`);
  
  if (errors.length > 0) {
    console.log('\n🔍 Remaining errors:');
    errors.forEach(err => {
      console.log(`  Line ${err.line} - ${err.item}: ${err.error}`);
    });
  }
  
  return { successCount, errorCount, duplicateCount };
}

// Get file path from command line
const csvPath = process.argv[2] || 'vocabtoupload.csv';

if (!fs.existsSync(csvPath)) {
  console.error(`❌ File not found: ${csvPath}`);
  process.exit(1);
}

retryFailedImports(csvPath);
