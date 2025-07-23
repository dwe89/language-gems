#!/usr/bin/env node

/**
 * CSV File Splitter
 * 
 * This script splits a large CSV file into smaller chunks for safer web upload.
 * 
 * Usage: node scripts/split-csv.js [input-file] [chunk-size]
 * Example: node scripts/split-csv.js vocabulary.csv 500
 */

const fs = require('fs');
const path = require('path');

function splitCSV(inputFile, chunkSize = 500) {
  console.log(`📂 Splitting ${inputFile} into chunks of ${chunkSize} rows...`);
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ File not found: ${inputFile}`);
    process.exit(1);
  }
  
  // Read the CSV file
  const csvContent = fs.readFileSync(inputFile, 'utf-8');
  const lines = csvContent.split('\n');
  
  // Get header row
  const header = lines[0];
  const dataLines = lines.slice(1).filter(line => line.trim()); // Remove empty lines
  
  console.log(`📊 Total data rows: ${dataLines.length}`);
  console.log(`📝 Header: ${header}`);
  
  const totalChunks = Math.ceil(dataLines.length / chunkSize);
  console.log(`🔄 Creating ${totalChunks} chunks...`);
  
  // Create output directory
  const inputBaseName = path.basename(inputFile, '.csv');
  const outputDir = `${inputBaseName}_chunks`;
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }
  
  // Split into chunks
  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, dataLines.length);
    const chunkData = dataLines.slice(start, end);
    
    // Create chunk content with header
    const chunkContent = [header, ...chunkData].join('\n');
    
    // Write chunk file
    const chunkFileName = `${outputDir}/${inputBaseName}_chunk_${i + 1}_of_${totalChunks}.csv`;
    fs.writeFileSync(chunkFileName, chunkContent);
    
    console.log(`✅ Created ${chunkFileName} (${chunkData.length} rows)`);
  }
  
  console.log(`\n🎉 Successfully split into ${totalChunks} files in ${outputDir}/`);
  console.log(`📋 Upload order recommendation:`);
  for (let i = 0; i < totalChunks; i++) {
    console.log(`   ${i + 1}. ${inputBaseName}_chunk_${i + 1}_of_${totalChunks}.csv`);
  }
  console.log(`\n💡 Tip: Upload one chunk at a time through your admin interface`);
  console.log(`⚠️  Consider disabling auto-audio generation for faster uploads`);
}

// Main script logic
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📋 CSV File Splitter');
    console.log('===================');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/split-csv.js [input-file] [chunk-size]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/split-csv.js vocabulary.csv 500');
    console.log('  node scripts/split-csv.js large-vocab.csv 1000');
    console.log('');
    console.log('Default chunk size: 500 rows');
    process.exit(1);
  }
  
  const inputFile = args[0];
  const chunkSize = parseInt(args[1]) || 500;
  
  splitCSV(inputFile, chunkSize);
}

module.exports = { splitCSV };
