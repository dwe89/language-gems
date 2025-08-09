#!/usr/bin/env node

/**
 * Import Edexcel vocabulary with smart duplicate handling
 * 
 * - Allows duplicates (same word can exist for AQA and Edexcel)
 * - Reuses existing example sentences and audio URLs when word already exists
 * - Maps Edexcel CSV columns to centralized_vocabulary table
 * 
 * Usage: node scripts/import-edexcel-vocabulary.js Edexcel_with_articles_and_cleaned.csv
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase configuration');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Map Edexcel CSV columns to centralized_vocabulary table
 */
function mapEdexcelToCentralizedVocabulary(edexcelRow) {
    return {
        language: edexcelRow.language,
        word: edexcelRow.word,
        translation: edexcelRow.translation,
        part_of_speech: edexcelRow.part_of_speech || null,
        gender: edexcelRow.gender || null,
        curriculum_level: edexcelRow.curriculum_level || 'KS4',
        exam_board_code: edexcelRow.exam_board_code || 'edexcel',
        unit_name: edexcelRow.unit_name || null,
        tier: edexcelRow.tier || null,
        frequency_rank: edexcelRow.frequency_rank ? parseInt(edexcelRow.frequency_rank) : null,
        
        // Fields we'll populate from existing data or leave null
        theme_name: null, // You'll handle this later
        example_sentence: null, // Will be populated from existing word if found
        example_translation: null, // Will be populated from existing word if found
        audio_url: null, // Will be populated from existing word if found
        
        // Derived fields
        article: extractArticle(edexcelRow.word),
        // display_word is a generated column - don't set it
        base_word: extractBaseWord(edexcelRow.word),
        category: null, // Not in Edexcel data
        subcategory: null, // Not in Edexcel data
        word_type: null, // Not in Edexcel data
        is_required: null // Not specified in Edexcel data
    };
}

/**
 * Extract article from word (e.g., "el perro" → "el")
 */
function extractArticle(word) {
    if (!word) return null;
    
    const articles = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'le', 'la', 'les', 'der', 'die', 'das', 'den', 'dem', 'des'];
    const firstWord = word.split(' ')[0].toLowerCase();
    
    return articles.includes(firstWord) ? firstWord : null;
}

/**
 * Extract base word without article (e.g., "el perro" → "perro")
 */
function extractBaseWord(word) {
    if (!word) return word;
    
    const articles = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'le', 'la', 'les', 'der', 'die', 'das', 'den', 'dem', 'des'];
    const words = word.split(' ');
    
    if (words.length > 1 && articles.includes(words[0].toLowerCase())) {
        return words.slice(1).join(' ');
    }
    
    return word;
}

/**
 * Find existing vocabulary entry with same word and language
 */
async function findExistingVocabulary(word, language) {
    const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('example_sentence, example_translation, audio_url')
        .eq('word', word)
        .eq('language', language)
        .not('example_sentence', 'is', null)
        .limit(1);
    
    if (error) {
        console.warn(`⚠️  Error checking existing vocabulary for "${word}":`, error.message);
        return null;
    }
    
    return data && data.length > 0 ? data[0] : null;
}

/**
 * Import vocabulary items in batches
 */
async function importVocabularyBatch(vocabularyData) {
    console.log(`🚀 Starting import of ${vocabularyData.length} Edexcel vocabulary items...`);
    
    let successCount = 0;
    let errorCount = 0;
    let reuseCount = 0;
    const errors = [];
    
    const BATCH_SIZE = 50;
    const DELAY_MS = 1000;
    
    for (let i = 0; i < vocabularyData.length; i += BATCH_SIZE) {
        const batch = vocabularyData.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(vocabularyData.length / BATCH_SIZE);
        
        console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
        
        for (const [index, item] of batch.entries()) {
            try {
                const itemNumber = i + index + 1;
                
                // Check for existing vocabulary with same word and language
                const existing = await findExistingVocabulary(item.word, item.language);
                
                if (existing) {
                    // Reuse existing example sentence and audio
                    item.example_sentence = existing.example_sentence;
                    item.example_translation = existing.example_translation;
                    item.audio_url = existing.audio_url;
                    reuseCount++;
                    console.log(`🔄 [${itemNumber}/${vocabularyData.length}] Reusing content: ${item.word} (${item.language})`);
                } else {
                    console.log(`➕ [${itemNumber}/${vocabularyData.length}] New word: ${item.word} (${item.language})`);
                }
                
                // Insert into database (always insert, even if word exists - this allows duplicates)
                const { error: insertError } = await supabase
                    .from('centralized_vocabulary')
                    .insert(item);
                
                if (insertError) {
                    console.error(`❌ Error inserting "${item.word}":`, insertError.message);
                    errors.push({ item: item.word, error: insertError.message });
                    errorCount++;
                } else {
                    successCount++;
                }
                
            } catch (error) {
                console.error(`❌ Error processing "${item.word}":`, error.message);
                errors.push({ item: item.word, error: error.message });
                errorCount++;
            }
        }
        
        // Delay between batches
        if (i + BATCH_SIZE < vocabularyData.length) {
            console.log(`⏸️  Waiting ${DELAY_MS}ms before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }
    
    return { successCount, errorCount, reuseCount, errors };
}

/**
 * Main execution function
 */
async function main() {
    const csvFile = process.argv[2];
    
    if (!csvFile) {
        console.log('📋 Edexcel Vocabulary Import Tool');
        console.log('==================================');
        console.log('');
        console.log('Usage: node scripts/import-edexcel-vocabulary.js [csv-file]');
        console.log('Example: node scripts/import-edexcel-vocabulary.js Edexcel_with_articles_and_cleaned.csv');
        console.log('');
        process.exit(1);
    }
    
    if (!fs.existsSync(csvFile)) {
        console.error(`❌ CSV file not found: ${csvFile}`);
        process.exit(1);
    }

    try {
        console.log('📖 Reading Edexcel vocabulary CSV...');
        const csvContent = fs.readFileSync(csvFile, 'utf-8');
        
        // Parse CSV
        const records = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });
        
        console.log(`📊 Parsed ${records.length} vocabulary entries from CSV`);
        
        // Show language breakdown
        const languageBreakdown = records.reduce((acc, record) => {
            acc[record.language] = (acc[record.language] || 0) + 1;
            return acc;
        }, {});
        
        console.log('\n📈 Language distribution:');
        Object.entries(languageBreakdown).forEach(([lang, count]) => {
            console.log(`   ${lang.toUpperCase()}: ${count} entries`);
        });
        
        // Map to centralized vocabulary format
        console.log('\n🔄 Mapping Edexcel data to centralized vocabulary format...');
        const vocabularyData = records.map(mapEdexcelToCentralizedVocabulary);
        
        console.log(`✅ Mapped ${vocabularyData.length} vocabulary items`);
        
        // Preview first few items
        console.log('\n👀 Preview of first 3 items:');
        vocabularyData.slice(0, 3).forEach((item, index) => {
            console.log(`${index + 1}. ${item.word} (${item.language}) → ${item.translation}`);
            console.log(`   Exam Board: ${item.exam_board_code}, Tier: ${item.tier}, Unit: ${item.unit_name}`);
        });
        
        console.log(`\n⚠️  About to import ${vocabularyData.length} Edexcel vocabulary items`);
        console.log('🔄 Duplicates are allowed (same word can exist for AQA and Edexcel)');
        console.log('♻️  Will reuse existing example sentences and audio when available');
        console.log('🔄 Press Ctrl+C to cancel or wait 5 seconds to continue...\n');
        
        // 5 second countdown
        for (let i = 5; i > 0; i--) {
            process.stdout.write(`Starting in ${i}... `);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('\n');
        
        // Import vocabulary
        const startTime = Date.now();
        const results = await importVocabularyBatch(vocabularyData);
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);
        
        // Final summary
        console.log('\n🎯 Edexcel Import Complete!');
        console.log('============================');
        console.log(`✅ Successfully imported: ${results.successCount} items`);
        console.log(`♻️  Reused existing content: ${results.reuseCount} items`);
        console.log(`❌ Failed to import: ${results.errorCount} items`);
        console.log(`📊 Total processed: ${results.successCount + results.errorCount} items`);
        console.log(`⏱️  Total time: ${duration} seconds`);
        
        if (results.errors.length > 0) {
            console.log('\n🔍 First 10 errors:');
            results.errors.slice(0, 10).forEach(err => {
                console.log(`  - ${err.item}: ${err.error}`);
            });
            
            if (results.errors.length > 10) {
                console.log(`  ... and ${results.errors.length - 10} more errors`);
            }
        }
        
        console.log('\n🎉 Edexcel vocabulary has been imported to centralized_vocabulary!');
        console.log('📝 Note: theme_name is empty - you can populate this later');
        console.log('🎵 Words with existing audio/sentences have been reused automatically');

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Import cancelled by user');
    process.exit(0);
});

// Run the script
if (require.main === module) {
    main();
}
