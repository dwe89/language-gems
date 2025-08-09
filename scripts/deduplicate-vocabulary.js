#!/usr/bin/env node

/**
 * Vocabulary Deduplication Script for LanguageGems
 * 
 * This script removes duplicates from vocabulary CSV files by:
 * 1. Identifying duplicates by word + language + part_of_speech
 * 2. Merging metadata intelligently (themes, tiers, etc.)
 * 3. Preserving the best example sentences
 * 4. Logging all deduplication actions
 * 
 * Usage: node scripts/deduplicate-vocabulary.js [input-csv] [output-csv]
 */

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

/**
 * Create unique key for vocabulary item
 */
function createUniqueKey(item) {
  return `${item.language}|${item.part_of_speech}|${item.word}`.toLowerCase();
}

/**
 * Merge duplicate vocabulary items intelligently
 */
function mergeDuplicates(duplicates) {
  if (duplicates.length === 1) return duplicates[0];
  
  // Use first item as base
  const merged = { ...duplicates[0] };
  
  // Collect all unique values for mergeable fields
  const themes = new Set();
  const units = new Set();
  const examBoards = new Set();
  const tiers = new Set();
  
  let bestExampleSentence = '';
  let bestExampleTranslation = '';
  let shortestSentenceLength = Infinity;
  
  duplicates.forEach(item => {
    // Collect themes and units
    if (item.theme_name) themes.add(item.theme_name);
    if (item.unit_name) units.add(item.unit_name);
    if (item.exam_board_code) examBoards.add(item.exam_board_code);
    if (item.tier) tiers.add(item.tier);
    
    // Find best example sentence (shortest, most appropriate for GCSE)
    if (item.example_sentence && item.example_sentence.length > 0) {
      const sentenceLength = item.example_sentence.split(' ').length;
      if (sentenceLength < shortestSentenceLength && sentenceLength >= 6) {
        shortestSentenceLength = sentenceLength;
        bestExampleSentence = item.example_sentence;
        bestExampleTranslation = item.example_translation;
      }
    }
    
    // Prefer non-empty translations
    if (!merged.translation || merged.translation.length < item.translation.length) {
      merged.translation = item.translation;
    }
    
    // Prefer items marked as required
    if (item.is_required === true || item.is_required === 'true') {
      merged.is_required = true;
    }
  });
  
  // Merge collected values
  merged.theme_name = Array.from(themes).join('; ');
  merged.unit_name = Array.from(units).join('; ');
  merged.exam_board_code = Array.from(examBoards).join('; ');
  merged.tier = Array.from(tiers).join('; ');
  
  // Use best example sentence
  if (bestExampleSentence) {
    merged.example_sentence = bestExampleSentence;
    merged.example_translation = bestExampleTranslation;
  }
  
  return merged;
}

/**
 * Deduplicate vocabulary data
 */
function deduplicateVocabulary(vocabularyData) {
  const duplicateGroups = {};
  const deduplicationLog = [];
  
  // Group by unique key
  vocabularyData.forEach(item => {
    const key = createUniqueKey(item);
    if (!duplicateGroups[key]) {
      duplicateGroups[key] = [];
    }
    duplicateGroups[key].push(item);
  });
  
  // Process each group
  const deduplicatedData = [];
  let totalDuplicatesRemoved = 0;
  
  Object.entries(duplicateGroups).forEach(([key, items]) => {
    if (items.length > 1) {
      // Log duplicate found
      deduplicationLog.push({
        key,
        word: items[0].word,
        language: items[0].language,
        duplicateCount: items.length,
        themes: [...new Set(items.map(i => i.theme_name).filter(Boolean))],
        tiers: [...new Set(items.map(i => i.tier).filter(Boolean))],
        action: 'merged'
      });
      
      totalDuplicatesRemoved += items.length - 1;
    }
    
    // Merge and add to deduplicated data
    const merged = mergeDuplicates(items);
    deduplicatedData.push(merged);
  });
  
  return {
    deduplicatedData,
    deduplicationLog,
    totalDuplicatesRemoved,
    originalCount: vocabularyData.length,
    finalCount: deduplicatedData.length
  };
}

/**
 * Main execution function
 */
async function main() {
  const inputFile = process.argv[2];
  const outputFile = process.argv[3];
  
  if (!inputFile || !outputFile) {
    console.log('📋 Vocabulary Deduplication Tool');
    console.log('=================================');
    console.log('');
    console.log('Usage: node scripts/deduplicate-vocabulary.js [input-csv] [output-csv]');
    console.log('Example: node scripts/deduplicate-vocabulary.js GCSE_processed_with_sentences.csv GCSE_deduplicated.csv');
    console.log('');
    process.exit(1);
  }
  
  if (!fs.existsSync(inputFile)) {
    console.error(`❌ Input file not found: ${inputFile}`);
    process.exit(1);
  }

  try {
    console.log(`📖 Reading vocabulary file: ${inputFile}`);
    const csvContent = fs.readFileSync(inputFile, 'utf-8');
    
    // Parse CSV
    const vocabularyData = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`📊 Original vocabulary entries: ${vocabularyData.length}`);
    
    // Deduplicate
    console.log('🔍 Analyzing duplicates...');
    const result = deduplicateVocabulary(vocabularyData);
    
    // Log results
    console.log('\n📈 Deduplication Results:');
    console.log(`   Original entries: ${result.originalCount}`);
    console.log(`   Final entries: ${result.finalCount}`);
    console.log(`   Duplicates removed: ${result.totalDuplicatesRemoved}`);
    console.log(`   Reduction: ${((result.totalDuplicatesRemoved / result.originalCount) * 100).toFixed(1)}%`);
    
    if (result.deduplicationLog.length > 0) {
      console.log('\n🔄 Duplicate Groups Found:');
      result.deduplicationLog.slice(0, 10).forEach(log => {
        console.log(`   "${log.word}" (${log.language}) - ${log.duplicateCount} duplicates`);
        console.log(`     Themes: ${log.themes.join(', ')}`);
        console.log(`     Tiers: ${log.tiers.join(', ')}`);
      });
      
      if (result.deduplicationLog.length > 10) {
        console.log(`   ... and ${result.deduplicationLog.length - 10} more duplicate groups`);
      }
    }
    
    // Write deduplicated CSV
    const csvOutput = stringify(result.deduplicatedData, {
      header: true,
      columns: [
        'language', 'part_of_speech', 'word', 'translation', 'word_type', 
        'gender', 'article', 'display_word', 'example_sentence', 'example_translation',
        'exam_board_code', 'theme_name', 'unit_name', 'tier', 'is_required', 'curriculum_level'
      ]
    });
    
    fs.writeFileSync(outputFile, csvOutput);
    
    // Write deduplication log
    const logFile = outputFile.replace('.csv', '_deduplication_log.json');
    fs.writeFileSync(logFile, JSON.stringify(result.deduplicationLog, null, 2));
    
    console.log(`\n✅ Deduplication completed!`);
    console.log(`📄 Clean vocabulary saved to: ${outputFile}`);
    console.log(`📋 Deduplication log saved to: ${logFile}`);
    console.log(`\n🎯 Next steps:`);
    console.log(`1. Review the deduplication log to verify merging decisions`);
    console.log(`2. Import using: node scripts/bulk-import-vocabulary.js ${outputFile}`);
    console.log(`3. Generate audio files using: node scripts/generate-vocabulary-audio.js`);

  } catch (error) {
    console.error('\n❌ Error during deduplication:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  createUniqueKey,
  mergeDuplicates,
  deduplicateVocabulary
};
