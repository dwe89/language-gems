#!/usr/bin/env node

/**
 * CSV Debug Test Script
 * 
 * This script helps debug CSV parsing issues by showing exactly how 
 * your CSV file is being parsed and where data might be shifting.
 */

const fs = require('fs');
const { parse } = require('csv-parse/sync');

function debugCSV(filePath) {
  console.log('🔍 CSV Debug Analysis');
  console.log('====================\n');
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }
  
  try {
    // Read file
    console.log(`📖 Reading: ${filePath}`);
    const csvContent = fs.readFileSync(filePath, 'utf-8');
    
    // Check for BOM
    const hasBOM = csvContent.charCodeAt(0) === 0xFEFF;
    console.log(`📄 File size: ${csvContent.length} chars, BOM: ${hasBOM ? 'Yes' : 'No'}`);
    
    // Remove BOM if present
    const cleanContent = csvContent.replace(/^\uFEFF/, '');
    
    // Parse CSV
    const records = parse(cleanContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      quote: '"',
      delimiter: ',',
      escape: '"',
      relax_column_count: true
    });
    
    console.log(`📊 Parsed ${records.length} records\n`);
    
    if (records.length === 0) {
      console.log('❌ No records found');
      return;
    }
    
    // Show headers
    const headers = Object.keys(records[0]);
    console.log('📋 Headers found:');
    headers.forEach((header, index) => {
      console.log(`  ${index + 1}. "${header}"`);
    });
    
    // Show first few rows in detail
    console.log('\n📝 First 3 rows (detailed):');
    records.slice(0, 3).forEach((record, index) => {
      console.log(`\n--- Row ${index + 1} ---`);
      headers.forEach(header => {
        const value = record[header];
        if (value && value.length > 0) {
          console.log(`  ${header}: "${value}"`);
        } else {
          console.log(`  ${header}: [empty]`);
        }
      });
    });
    
    // Check for common issues
    console.log('\n🔍 Issue Detection:');
    
    // Check for tags in word column
    const firstRecord = records[0];
    const possibleWordFields = ['word', 'Headword_Spanish', 'headword_spanish', 'spanish_term'];
    let wordField = null;
    let wordValue = '';
    
    for (const field of possibleWordFields) {
      if (firstRecord[field]) {
        wordField = field;
        wordValue = firstRecord[field];
        break;
      }
    }
    
    if (wordField) {
      console.log(`✅ Word field detected: "${wordField}" = "${wordValue}"`);
      
      if (wordValue.includes(';') || wordValue.includes('greeting') || wordValue.includes('polite') || wordValue.includes('basic')) {
        console.log('⚠️  WARNING: Word field contains metadata/tags - possible column shift!');
      }
    } else {
      console.log('❌ No recognizable word field found');
    }
    
    // Check column count consistency
    const columnCounts = records.map(record => Object.keys(record).length);
    const uniqueCounts = [...new Set(columnCounts)];
    
    if (uniqueCounts.length > 1) {
      console.log(`⚠️  WARNING: Inconsistent column counts found: ${uniqueCounts.join(', ')}`);
    } else {
      console.log(`✅ Consistent column count: ${uniqueCounts[0]} columns`);
    }
    
    // Check for empty key names (sign of parsing issues)
    const emptyKeys = headers.filter(h => !h || h.trim() === '');
    if (emptyKeys.length > 0) {
      console.log(`⚠️  WARNING: ${emptyKeys.length} empty column headers found`);
    }
    
    console.log('\n✅ Debug analysis complete');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the script
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Usage: node scripts/debug-csv.js [csv-file-path]');
    console.log('Example: node scripts/debug-csv.js Vocab_final.csv');
    process.exit(1);
  }
  
  debugCSV(filePath);
}

module.exports = { debugCSV };
