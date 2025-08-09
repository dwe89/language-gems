#!/usr/bin/env node

/**
 * Generate audio files for vocabulary words using AWS Polly
 * and update the database with audio URLs
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { PollyClient, SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { cleanWordForAudio } = require('./audio-word-cleaner');

// Check for required environment variables
const requiredVars = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    console.error('Missing required environment variables:', missingVars.join(', '));
    console.error('Please set these environment variables and try again.');
    console.error('Current environment:', { 
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'MISSING',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'MISSING',
        AWS_REGION: process.env.AWS_REGION || 'MISSING'
    });
    process.exit(1);
}

// Configure AWS Polly
const polly = new PollyClient({
    region: process.env.AWS_REGION || 'eu-west-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    process.exit(1);
}

// Use service role key for full database access
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
if (!supabaseKey) {
    console.error('Missing Supabase service role key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Voice mapping for different languages
const VOICE_MAP = {
    'es': 'Lucia',     // Spanish female voice
    'fr': 'Celine',    // French female voice
    'de': 'Marlene',   // German female voice
    'en': 'Emma'       // English female voice (fallback)
};

// Create audio directory if it doesn't exist
const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio', 'vocabulary');

async function ensureDirectoryExists(dirPath) {
    try {
        await fs.access(dirPath);
    } catch {
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`Created directory: ${dirPath}`);
    }
}

async function generateAudio(text, language, outputPath) {
    const voice = VOICE_MAP[language] || VOICE_MAP.en;
    
    // First try with neural engine
    let params = {
        Text: text,
        OutputFormat: 'mp3',
        VoiceId: voice,
        Engine: 'neural',
        LanguageCode: getLanguageCode(language)
    };

    try {
        console.log(`Generating audio for "${text}" in ${language} using voice ${voice}...`);
        
        const command = new SynthesizeSpeechCommand(params);
        const result = await polly.send(command);
        
        if (result.AudioStream) {
            const audioBuffer = Buffer.concat(await result.AudioStream.toArray());
            await fs.writeFile(outputPath, audioBuffer);
        } else {
            throw new Error('No audio stream received');
        }
        
        console.log(`✓ Audio generated: ${outputPath}`);
        return true;
    } catch (error) {
        // If neural engine fails, try with standard engine
        if (error.message && error.message.includes('does not support the selected engine')) {
            try {
                console.log(`  Retrying with standard engine for "${text}"...`);
                params.Engine = 'standard';
                const command = new SynthesizeSpeechCommand(params);
                const result = await polly.send(command);
                
                if (result.AudioStream) {
                    const audioBuffer = Buffer.concat(await result.AudioStream.toArray());
                    await fs.writeFile(outputPath, audioBuffer);
                } else {
                    throw new Error('No audio stream received');
                }
                
                console.log(`✓ Audio generated (standard): ${outputPath}`);
                return true;
            } catch (fallbackError) {
                console.error(`✗ Error generating audio for "${text}" (fallback):`, fallbackError.message);
                return false;
            }
        } else {
            console.error(`✗ Error generating audio for "${text}":`, error.message);
            return false;
        }
    }
}

function getLanguageCode(language) {
    const codes = {
        'es': 'es-ES',
        'fr': 'fr-FR', 
        'de': 'de-DE',
        'en': 'en-US'
    };
    return codes[language] || 'en-US';
}

function sanitizeFilename(text) {
    // Replace spaces and special characters with underscores
    return text
        .toLowerCase()
        .replace(/[àáâãäå]/g, 'a')
        .replace(/[èéêë]/g, 'e')
        .replace(/[ìíîï]/g, 'i')
        .replace(/[òóôõö]/g, 'o')
        .replace(/[ùúûü]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

async function getVocabularyWords() {
    console.log('Fetching vocabulary words without audio...');
    
    const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('id, language, word, category')
        .is('audio_url', null)
        .in('language', ['es', 'fr']) // Only French and Spanish as requested
        .order('language')
        .order('category')
        .order('word');

    if (error) {
        console.error('Error fetching vocabulary:', error);
        return [];
    }

    console.log(`Found ${data.length} words needing audio generation`);
    return data;
}

async function updateAudioUrl(vocabularyId, audioUrl) {
    const { error } = await supabase
        .from('centralized_vocabulary')
        .update({ audio_url: audioUrl })
        .eq('id', vocabularyId);

    if (error) {
        console.error(`Error updating audio URL for vocabulary ID ${vocabularyId}:`, error);
        return false;
    }

    return true;
}

async function generateAllAudio() {
    console.log('🎵 Starting vocabulary audio generation...\n');

    // Ensure audio directory exists
    await ensureDirectoryExists(AUDIO_DIR);

    // Get all vocabulary words needing audio
    const vocabularyWords = await getVocabularyWords();
    
    if (vocabularyWords.length === 0) {
        console.log('No vocabulary words need audio generation.');
        return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Process words in batches to avoid hitting rate limits
    const BATCH_SIZE = 5;
    const DELAY_MS = 1000; // 1 second delay between batches

    for (let i = 0; i < vocabularyWords.length; i += BATCH_SIZE) {
        const batch = vocabularyWords.slice(i, i + BATCH_SIZE);
        
        console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(vocabularyWords.length/BATCH_SIZE)}:`);

        // Process batch in parallel
        const batchPromises = batch.map(async (vocab) => {
            const { id, language, word, category } = vocab;

            // Clean word for audio generation (remove grammatical notation)
            const audioWord = cleanWordForAudio(word, language);
            console.log(`  Processing: "${word}" → "${audioWord}" (${language})`);

            // Create sanitized filename
            const sanitizedWord = sanitizeFilename(word);
            const filename = `${language}_${category}_${sanitizedWord}.mp3`;
            const filePath = path.join(AUDIO_DIR, filename);
            const audioUrl = `/audio/vocabulary/${filename}`;

            // Generate audio file using cleaned word
            const success = await generateAudio(audioWord, language, filePath);
            
            if (success) {
                // Update database with audio URL
                const updated = await updateAudioUrl(id, audioUrl);
                if (updated) {
                    console.log(`✓ Updated database for "${word}" (${language})`);
                    return true;
                } else {
                    console.log(`✗ Failed to update database for "${word}" (${language})`);
                    return false;
                }
            }
            
            return false;
        });

        // Wait for batch to complete
        const results = await Promise.allSettled(batchPromises);
        
        // Count results
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                successCount++;
            } else {
                errorCount++;
            }
        });

        // Add delay between batches (except for the last batch)
        if (i + BATCH_SIZE < vocabularyWords.length) {
            console.log(`Waiting ${DELAY_MS}ms before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    console.log('\n📊 Audio Generation Summary:');
    console.log(`✓ Successfully processed: ${successCount} words`);
    console.log(`✗ Failed: ${errorCount} words`);
    console.log(`📁 Audio files saved to: ${AUDIO_DIR}`);
    
    if (successCount > 0) {
        console.log('\n🎉 Audio generation completed! All vocabulary words now have audio URLs in the database.');
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Audio generation interrupted by user');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});

// Run the script
if (require.main === module) {
    generateAllAudio().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { generateAllAudio };
