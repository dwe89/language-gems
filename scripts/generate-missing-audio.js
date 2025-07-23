#!/usr/bin/env node

/**
 * Bulk Audio Generation Script
 * 
 * This script finds all vocabulary entries without audio and generates audio for them
 * using AWS Polly through the existing API endpoint.
 * 
 * Usage: node scripts/generate-missing-audio.js [--language=es|fr|de|all] [--batch-size=10] [--delay=2000]
 */

const fs = require('fs');
const https = require('https');
const http = require('http');
const { URL } = require('url');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Import Supabase client
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  language: 'all',
  batchSize: 50,
  delay: 500, // 0.5 seconds between batches
  maxRetries: 2,
  parallel: false // Set to true for concurrent processing within batches
};

args.forEach(arg => {
  if (arg.startsWith('--language=')) {
    options.language = arg.split('=')[1];
  } else if (arg.startsWith('--batch-size=')) {
    options.batchSize = parseInt(arg.split('=')[1]);
  } else if (arg.startsWith('--delay=')) {
    options.delay = parseInt(arg.split('=')[1]);
  } else if (arg === '--parallel') {
    options.parallel = true;
  }
});

/**
 * Make HTTP request to generate audio
 */
function makeRequest(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const lib = urlObj.protocol === 'https:' ? https : http;
    
    const req = lib.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(result);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${result.error || data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, raw: data });
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * Generate audio for a single vocabulary item
 */
async function generateAudioForItem(item, retryCount = 0) {
  try {
    const payload = {
      word: item.word,
      language: item.language,
      vocabularyId: item.id,
      category: item.category || 'general',
      base_word: item.base_word || item.word
    };
    
    const result = await makeRequest(`${baseUrl}/api/admin/generate-audio`, payload);
    
    if (!result.success) {
      throw new Error(result.error || 'Audio generation failed');
    }
    
    return {
      success: true,
      audioUrl: result.audioUrl,
      message: result.message
    };
    
  } catch (error) {
    if (retryCount < options.maxRetries) {
      console.log(`⚠️  Retry ${retryCount + 1}/${options.maxRetries} for "${item.word}": ${error.message}`);
      await new Promise(resolve => setTimeout(resolve, 300 * (retryCount + 1))); // Faster exponential backoff
      return generateAudioForItem(item, retryCount + 1);
    }
    
    throw error;
  }
}

/**
 * Get vocabulary items without audio
 */
async function getVocabularyWithoutAudio(language = 'all') {
  console.log(`🔍 Finding vocabulary items without audio...${language !== 'all' ? ` (Language: ${language.toUpperCase()})` : ''}`);
  
  let query = supabase
    .from('centralized_vocabulary')
    .select('id, word, language, category, subcategory, base_word')
    .is('audio_url', null)
    .order('language', { ascending: true })
    .order('word', { ascending: true });
  
  if (language !== 'all') {
    query = query.eq('language', language.toLowerCase());
  }
  
  const { data: vocabularyItems, error } = await query;
  
  if (error) {
    throw new Error(`Failed to fetch vocabulary items: ${error.message}`);
  }
  
  return vocabularyItems || [];
}

/**
 * Get current audio generation statistics
 */
async function getAudioStats() {
  console.log('📊 Getting audio generation statistics...');
  
  const { data: stats, error } = await supabase
    .from('centralized_vocabulary')
    .select('language, audio_url')
    .not('audio_url', 'is', null);
  
  if (error) {
    console.error('❌ Failed to get stats:', error.message);
    return {};
  }
  
  const statsByLanguage = stats.reduce((acc, item) => {
    const lang = item.language.toUpperCase();
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});
  
  console.log('📈 Current audio coverage:');
  Object.entries(statsByLanguage).forEach(([lang, count]) => {
    console.log(`   ${lang}: ${count} items with audio`);
  });
  
  return statsByLanguage;
}

/**
 * Main execution function
 */
async function generateMissingAudio() {
  console.log('🎵 Starting bulk audio generation for vocabulary without audio...');
  console.log(`📋 Configuration:`);
  console.log(`   Language filter: ${options.language}`);
  console.log(`   Batch size: ${options.batchSize}`);
  console.log(`   Delay between batches: ${options.delay}ms`);
  console.log(`   Max retries: ${options.maxRetries}`);
  console.log('');
  
  try {
    // Get initial stats
    await getAudioStats();
    
    // Get vocabulary items without audio
    const vocabularyItems = await getVocabularyWithoutAudio(options.language);
    
    if (vocabularyItems.length === 0) {
      console.log('✅ All vocabulary items already have audio! Nothing to do.');
      return;
    }
    
    console.log(`\n🎯 Found ${vocabularyItems.length} vocabulary items without audio`);
    
    // Group by language for better reporting
    const byLanguage = vocabularyItems.reduce((acc, item) => {
      const lang = item.language.toUpperCase();
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📋 Items to process by language:');
    Object.entries(byLanguage).forEach(([lang, count]) => {
      console.log(`   ${lang}: ${count} items`);
    });
    
    // Process in batches
    let successCount = 0;
    let errorCount = 0;
    const errors = [];
    
    const totalBatches = Math.ceil(vocabularyItems.length / options.batchSize);
    
    for (let i = 0; i < vocabularyItems.length; i += options.batchSize) {
      const batch = vocabularyItems.slice(i, i + options.batchSize);
      const batchNumber = Math.floor(i / options.batchSize) + 1;
      
      console.log(`\n🎵 Processing batch ${batchNumber}/${totalBatches} (${batch.length} items)...`);
      
      if (options.parallel) {
        // Process all items in the batch concurrently
        const promises = batch.map(async (item, index) => {
          const itemNumber = i + index + 1;
          try {
            console.log(`   [${itemNumber}/${vocabularyItems.length}] Generating audio for "${item.word}" (${item.language.toUpperCase()})...`);
            
            const result = await generateAudioForItem(item);
            
            if (result.success) {
              console.log(`   ✅ Success: ${item.word} → ${result.audioUrl}`);
              return { success: true, item };
            } else {
              console.log(`   ❌ Failed: ${item.word}`);
              return { success: false, item, error: 'Generation failed' };
            }
          } catch (error) {
            console.log(`   ❌ Error: ${item.word} - ${error.message}`);
            return { success: false, item, error: error.message };
          }
        });
        
        const results = await Promise.all(promises);
        
        results.forEach(result => {
          if (result.success) {
            successCount++;
          } else {
            errors.push({ item: result.item.word, error: result.error });
            errorCount++;
          }
        });
        
      } else {
        // Process each item in the batch sequentially
        for (const [index, item] of batch.entries()) {
          const itemNumber = i + index + 1;
          
          try {
            console.log(`   [${itemNumber}/${vocabularyItems.length}] Generating audio for "${item.word}" (${item.language.toUpperCase()})...`);
            
            const result = await generateAudioForItem(item);
            
            if (result.success) {
              console.log(`   ✅ Success: ${item.word} → ${result.audioUrl}`);
              successCount++;
            } else {
              console.log(`   ❌ Failed: ${item.word}`);
              errors.push({ item: item.word, error: 'Generation failed' });
              errorCount++;
            }
            
            // Small delay between individual items to avoid overwhelming the API
            if (index < batch.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500ms to 100ms
            }
            
          } catch (error) {
            console.log(`   ❌ Error: ${item.word} - ${error.message}`);
            errors.push({ item: item.word, error: error.message });
            errorCount++;
          }
        }
      }
      
      // Delay between batches (except for the last batch)
      if (i + options.batchSize < vocabularyItems.length) {
        console.log(`   ⏸️  Waiting ${options.delay}ms before next batch...`);
        await new Promise(resolve => setTimeout(resolve, options.delay));
      }
    }
    
    // Final summary
    console.log('\n🎉 Audio Generation Complete!');
    console.log('📊 Summary:');
    console.log(`   ✅ Successfully generated: ${successCount} audio files`);
    console.log(`   ❌ Failed: ${errorCount} items`);
    console.log(`   📋 Total processed: ${vocabularyItems.length} items`);
    
    if (errors.length > 0) {
      console.log('\n🔍 Errors encountered:');
      errors.slice(0, 10).forEach(err => {
        console.log(`   - ${err.item}: ${err.error}`);
      });
      if (errors.length > 10) {
        console.log(`   ... and ${errors.length - 10} more errors`);
      }
    }
    
    // Get final stats
    console.log('\n📈 Updated audio coverage:');
    await getAudioStats();
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

// Show usage if help requested
if (args.includes('--help') || args.includes('-h')) {
  console.log(`
🎵 Bulk Audio Generation Script

Usage: node scripts/generate-missing-audio.js [options]

Options:
  --language=LANG     Generate audio for specific language (es, fr, de, or all)
                      Default: all
  --batch-size=N      Number of items to process per batch
                      Default: 10
  --delay=MS          Delay between batches in milliseconds
                      Default: 500
  --parallel          Process items within each batch concurrently (faster)
  --help, -h          Show this help message

Examples:
  node scripts/generate-missing-audio.js
  node scripts/generate-missing-audio.js --language=es
  node scripts/generate-missing-audio.js --language=fr --batch-size=20 --delay=1000
  node scripts/generate-missing-audio.js --parallel --batch-size=100
`);
  process.exit(0);
}

// Run the script
generateMissingAudio();
