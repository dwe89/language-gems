#!/usr/bin/env node

/**
 * CSV Encoding Fix Script
 * 
 * This script fixes encoding issues in CSV files exported from Excel on Mac.
 * Excel on Mac often exports CSV files with Mac Roman or Latin-1 encoding instead of UTF-8,
 * which causes accented characters to be corrupted.
 * 
 * Usage: node scripts/fix-csv-encoding.js [input-file] [output-file]
 * Example: node scripts/fix-csv-encoding.js input.csv output-fixed.csv
 */

const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

/**
 * Detect the encoding of a CSV file by looking for common patterns
 */
function detectEncoding(buffer) {
  const encodings = ['utf8', 'latin1', 'windows-1252', 'macroman'];
  let bestEncoding = 'utf8';
  let bestScore = 0;
  
  for (const encoding of encodings) {
    try {
      const text = iconv.decode(buffer, encoding);
      let score = 0;
      
      // Count properly decoded accented characters
      const accentedChars = text.match(/[áéíóúñüÁÉÍÓÚÑÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜç]/g);
      if (accentedChars) {
        score += accentedChars.length * 10;
      }
      
      // Penalize question marks and replacement characters (signs of bad encoding)
      const badChars = text.match(/[�?]/g);
      if (badChars) {
        score -= badChars.length * 5;
      }
      
      // Bonus for valid CSV structure
      const lines = text.split('\n');
      if (lines.length > 1) {
        const firstLine = lines[0];
        const commas = (firstLine.match(/,/g) || []).length;
        if (commas > 0) {
          score += commas;
        }
      }
      
      console.log(`${encoding}: score ${score} (accented chars: ${accentedChars ? accentedChars.length : 0})`);
      
      if (score > bestScore) {
        bestScore = score;
        bestEncoding = encoding;
      }
    } catch (error) {
      console.log(`${encoding}: failed to decode`);
    }
  }
  
  return bestEncoding;
}

/**
 * Fix encoding in a CSV file
 */
function fixCSVEncoding(inputFile, outputFile) {
  console.log(`🔍 Reading file: ${inputFile}`);
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Read file as buffer
  const buffer = fs.readFileSync(inputFile);
  
  console.log('🧪 Detecting encoding...');
  const detectedEncoding = detectEncoding(buffer);
  console.log(`✅ Detected encoding: ${detectedEncoding}`);
  
  // Decode with detected encoding and re-encode as UTF-8
  const text = iconv.decode(buffer, detectedEncoding);
  const utf8Buffer = iconv.encode(text, 'utf8');
  
  // Write the fixed file
  fs.writeFileSync(outputFile, utf8Buffer);
  
  console.log(`✅ Fixed file saved as: ${outputFile}`);
  
  // Show preview of fixed content
  const lines = text.split('\n').slice(0, 5);
  console.log('\n🔍 Preview of fixed content:');
  lines.forEach((line, index) => {
    if (line.trim()) {
      console.log(`${index + 1}: ${line.substring(0, 100)}${line.length > 100 ? '...' : ''}`);
    }
  });
  
  // Count accented characters in fixed file
  const accentedChars = text.match(/[áéíóúñüÁÉÍÓÚÑÜàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛäëïöüÄËÏÖÜç]/g);
  console.log(`\n📊 Found ${accentedChars ? accentedChars.length : 0} accented characters in fixed file`);
}

/**
 * Batch fix multiple CSV files
 */
function batchFixCSVFiles(directory) {
  console.log(`🔍 Looking for CSV files in: ${directory}`);
  
  if (!fs.existsSync(directory)) {
    console.error(`❌ Directory not found: ${directory}`);
    process.exit(1);
  }
  
  const files = fs.readdirSync(directory);
  const csvFiles = files.filter(file => file.toLowerCase().endsWith('.csv'));
  
  console.log(`📁 Found ${csvFiles.length} CSV files`);
  
  csvFiles.forEach(file => {
    const inputPath = path.join(directory, file);
    const outputPath = path.join(directory, file.replace('.csv', '_fixed.csv'));
    
    console.log(`\n🔧 Processing: ${file}`);
    fixCSVEncoding(inputPath, outputPath);
  });
  
  console.log('\n🎉 Batch processing complete!');
}

// Main script logic
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 CSV Encoding Fix Tool');
    console.log('========================');
    console.log('');
    console.log('Usage:');
    console.log('  Single file: node scripts/fix-csv-encoding.js input.csv output.csv');
    console.log('  Batch mode:  node scripts/fix-csv-encoding.js --batch [directory]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/fix-csv-encoding.js Vocab.csv Vocab_fixed.csv');
    console.log('  node scripts/fix-csv-encoding.js --batch ./data/vocabulary/');
    console.log('');
    process.exit(1);
  }
  
  if (args[0] === '--batch') {
    const directory = args[1] || '.';
    batchFixCSVFiles(directory);
  } else {
    const inputFile = args[0];
    const outputFile = args[1] || inputFile.replace('.csv', '_encoding_fixed.csv');
    fixCSVEncoding(inputFile, outputFile);
  }
}

module.exports = { fixCSVEncoding, detectEncoding };
