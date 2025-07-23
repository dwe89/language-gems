#!/usr/bin/env node

/**
 * Analyze vocabulary CSV for database constraint violations
 */

const fs = require('fs');
const { parse } = require('csv-parse/sync');

// Database column constraints
const CONSTRAINTS = {
  language: 5,        // varchar(5)
  category: 50,       // varchar(50)
  part_of_speech: 20, // varchar(20)
  article: 10,        // varchar(10)
  base_word: 255,     // varchar(255)
  display_word: 255   // varchar(255)
};

function analyzeCSV(filePath) {
  try {
    console.log(`🔍 Analyzing CSV file: ${filePath}`);
    
    const csvContent = fs.readFileSync(filePath, 'utf8');
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
    
    console.log(`📋 Total records: ${records.length}`);
    
    const violations = [];
    
    records.forEach((record, index) => {
      const lineNumber = index + 2; // +2 because index starts at 0 and we skip header
      
      // Check each constraint
      Object.entries(CONSTRAINTS).forEach(([field, maxLength]) => {
        const value = record[field];
        if (value && value.length > maxLength) {
          violations.push({
            line: lineNumber,
            word: record.word,
            field: field,
            value: value,
            length: value.length,
            maxLength: maxLength,
            excess: value.length - maxLength
          });
        }
      });
    });
    
    console.log(`\n📊 Analysis Results:`);
    console.log(`❌ Constraint violations found: ${violations.length}`);
    
    if (violations.length > 0) {
      console.log(`\n🔍 Violations by field:`);
      const byField = violations.reduce((acc, v) => {
        if (!acc[v.field]) acc[v.field] = [];
        acc[v.field].push(v);
        return acc;
      }, {});
      
      Object.entries(byField).forEach(([field, violations]) => {
        console.log(`\n${field} (max: ${CONSTRAINTS[field]} chars) - ${violations.length} violations:`);
        violations.forEach(v => {
          console.log(`  Line ${v.line}: "${v.word}" - "${v.value}" (${v.length} chars, ${v.excess} over limit)`);
        });
      });
      
      console.log(`\n💡 Solutions:`);
      console.log(`1. Increase database column limits`);
      console.log(`2. Truncate data during import`);
      console.log(`3. Skip problematic entries`);
      
    } else {
      console.log(`✅ No constraint violations found!`);
      console.log(`The 75 import failures might be due to other issues like:`);
      console.log(`- Network timeouts`);
      console.log(`- Special characters or encoding issues`);
      console.log(`- Database connection issues`);
    }
    
  } catch (error) {
    console.error('❌ Error analyzing CSV:', error.message);
  }
}

// Get file path from command line
const filePath = process.argv[2] || 'free time.csv';

if (!fs.existsSync(filePath)) {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

analyzeCSV(filePath);
