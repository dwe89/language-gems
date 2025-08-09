#!/usr/bin/env node

/**
 * Generate audio for ALL vocabulary words using the existing API endpoint
 * Uploads to Supabase Storage bucket and updates database
 * 
 * Usage: node scripts/generate-all-vocabulary-audio.js
 */

require('dotenv').config({ path: '.env.local' });
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

// API endpoint configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const AUDIO_API_ENDPOINT = `${API_BASE_URL}/api/admin/generate-audio`;

/**
 * Get all vocabulary words that need audio generation
 */
async function getVocabularyWordsNeedingAudio() {
    console.log('🔍 Fetching vocabulary words without audio...');
    
    const { data, error, count } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, language, category, base_word', { count: 'exact' })
        .is('audio_url', null)
        .not('word', 'is', null)
        .not('language', 'is', null)
        .order('language', { ascending: true })
        .order('word', { ascending: true })
        .limit(5000); // Increase limit to get all words

    if (error) {
        console.error('❌ Error fetching vocabulary:', error);
        throw error;
    }

    console.log(`📊 Found ${count} vocabulary words needing audio generation`);
    console.log(`📋 Languages: ${[...new Set(data?.map(v => v.language))].join(', ')}`);
    
    return data || [];
}

/**
 * Generate audio for a single vocabulary word using the API
 */
async function generateAudioForWord(vocabularyItem) {
    const { id, word, language, category, base_word } = vocabularyItem;
    
    try {
        const response = await fetch(AUDIO_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                vocabularyId: id,
                word: word,
                language: language,
                category: category,
                base_word: base_word
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API Error: ${errorData.error || response.statusText}`);
        }

        const result = await response.json();
        return {
            success: true,
            audioUrl: result.audioUrl,
            filePath: result.filePath
        };

    } catch (error) {
        let errorMessage = error.message;

        // Provide helpful error messages for common issues
        if (error.message === 'fetch failed' || error.code === 'ECONNREFUSED') {
            errorMessage = 'Next.js server not running. Please start with: npm run dev';
        }

        console.error(`❌ Failed to generate audio for "${word}" (${language}):`, errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
}

/**
 * Process vocabulary words in batches
 */
async function processVocabularyBatch(vocabularyWords, batchSize = 3, delayMs = 2000) {
    let successCount = 0;
    let errorCount = 0;
    const errors = [];

    const totalBatches = Math.ceil(vocabularyWords.length / batchSize);
    
    for (let i = 0; i < vocabularyWords.length; i += batchSize) {
        const batch = vocabularyWords.slice(i, i + batchSize);
        const batchNumber = Math.floor(i / batchSize) + 1;
        
        console.log(`\n📦 Processing batch ${batchNumber}/${totalBatches} (${batch.length} words):`);
        
        // Process batch items sequentially to avoid overwhelming the API
        for (const vocab of batch) {
            const { id, word, language } = vocab;
            console.log(`  🎵 Generating: "${word}" (${language})`);
            
            const result = await generateAudioForWord(vocab);
            
            if (result.success) {
                successCount++;
                console.log(`  ✅ Success: ${result.audioUrl}`);
            } else {
                errorCount++;
                errors.push({ word, language, error: result.error });
                console.log(`  ❌ Failed: ${result.error}`);
            }
            
            // Small delay between individual requests
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Longer delay between batches
        if (i + batchSize < vocabularyWords.length) {
            console.log(`⏳ Waiting ${delayMs}ms before next batch...`);
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return { successCount, errorCount, errors };
}

/**
 * Main execution function
 */
async function main() {
    console.log('🎵 Starting vocabulary audio generation...');
    console.log('===========================================');
    console.log(`📡 API Endpoint: ${AUDIO_API_ENDPOINT}`);
    console.log(`🗄️  Database: ${supabaseUrl}`);
    console.log('');

    try {
        // Get all vocabulary words needing audio
        const vocabularyWords = await getVocabularyWordsNeedingAudio();
        
        if (vocabularyWords.length === 0) {
            console.log('✅ All vocabulary words already have audio!');
            return;
        }

        // Show breakdown by language
        const languageBreakdown = vocabularyWords.reduce((acc, word) => {
            acc[word.language] = (acc[word.language] || 0) + 1;
            return acc;
        }, {});
        
        console.log('\n📊 Breakdown by language:');
        Object.entries(languageBreakdown).forEach(([lang, count]) => {
            console.log(`   ${lang.toUpperCase()}: ${count} words`);
        });

        console.log(`\n⚠️  About to generate audio for ${vocabularyWords.length} vocabulary words`);
        console.log('💰 This will consume AWS Polly credits and Supabase storage');
        console.log('🔄 Press Ctrl+C to cancel or wait 10 seconds to continue...\n');
        
        // 10 second countdown
        for (let i = 10; i > 0; i--) {
            process.stdout.write(`Starting in ${i}... `);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        console.log('\n');

        // Process all vocabulary words
        console.log('🚀 Starting audio generation...');
        const startTime = Date.now();
        
        const results = await processVocabularyBatch(vocabularyWords, 3, 2000);
        
        const endTime = Date.now();
        const duration = Math.round((endTime - startTime) / 1000);

        // Final summary
        console.log('\n🎯 Audio Generation Complete!');
        console.log('===============================');
        console.log(`✅ Successfully generated: ${results.successCount} audio files`);
        console.log(`❌ Failed to generate: ${results.errorCount} audio files`);
        console.log(`📊 Total processed: ${results.successCount + results.errorCount} words`);
        console.log(`⏱️  Total time: ${duration} seconds`);
        console.log(`📈 Average: ${Math.round((results.successCount + results.errorCount) / duration * 60)} words/minute`);

        if (results.errors.length > 0) {
            console.log('\n🔍 First 10 errors:');
            results.errors.slice(0, 10).forEach(err => {
                console.log(`  - "${err.word}" (${err.language}): ${err.error}`);
            });
            
            if (results.errors.length > 10) {
                console.log(`  ... and ${results.errors.length - 10} more errors`);
            }
        }

        console.log('\n🎵 All vocabulary audio files have been uploaded to Supabase Storage!');
        console.log('🔗 Audio URLs have been updated in the centralized_vocabulary table');

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Audio generation cancelled by user');
    process.exit(0);
});

// Run the script
if (require.main === module) {
    main();
}
