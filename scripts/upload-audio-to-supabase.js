#!/usr/bin/env node

/**
 * Upload locally generated audio files to Supabase Storage
 * and update the database with proper Supabase Storage URLs
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for full access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const AUDIO_DIR = path.join(process.cwd(), 'public', 'audio', 'vocabulary');
const BUCKET_NAME = 'audio';

async function ensureBucketExists() {
    console.log('🪣 Checking if audio bucket exists...');
    
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
        console.error('Error listing buckets:', listError);
        throw listError;
    }

    const audioBucket = buckets?.find(bucket => bucket.name === BUCKET_NAME);
    
    if (!audioBucket) {
        console.log('Creating audio bucket...');
        const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
            public: true,
            allowedMimeTypes: ['audio/mpeg', 'audio/mp3'],
            fileSizeLimit: 10 * 1024 * 1024 // 10MB
        });
        
        if (createError) {
            console.error('Error creating bucket:', createError);
            throw createError;
        }
        console.log('✓ Audio bucket created successfully');
    } else {
        console.log('✓ Audio bucket already exists');
    }
}

async function uploadFileToSupabase(localPath, supabasePath) {
    try {
        const fileBuffer = await fs.readFile(localPath);
        
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(supabasePath, fileBuffer, {
                contentType: 'audio/mpeg',
                upsert: true // Overwrite if exists
            });

        if (error) {
            console.error(`✗ Failed to upload ${supabasePath}:`, error.message);
            return null;
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(supabasePath);

        console.log(`✓ Uploaded: ${supabasePath}`);
        return urlData.publicUrl;
    } catch (error) {
        console.error(`✗ Error uploading ${supabasePath}:`, error.message);
        return null;
    }
}

async function getLocalAudioFiles() {
    try {
        const files = await fs.readdir(AUDIO_DIR);
        return files.filter(file => file.endsWith('.mp3'));
    } catch (error) {
        console.error('Error reading audio directory:', error);
        return [];
    }
}

async function updateDatabaseWithSupabaseUrls() {
    console.log('\n📝 Updating database with Supabase Storage URLs...');
    
    // Get all vocabulary words that currently have local audio URLs
    const { data: vocabularyWords, error } = await supabase
        .from('centralized_vocabulary')
        .select('id, language, word, category, audio_url')
        .like('audio_url', '/audio/vocabulary/%');

    if (error) {
        console.error('Error fetching vocabulary words:', error);
        return;
    }

    console.log(`Found ${vocabularyWords.length} words with local audio URLs to update`);

    let successCount = 0;
    let errorCount = 0;

    for (const vocab of vocabularyWords) {
        const filename = vocab.audio_url.split('/').pop(); // Get filename from URL
        const supabasePath = `vocabulary/${filename}`;
        
        // Get the public URL for this file
        const { data: urlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(supabasePath);

        // Update the database with the Supabase Storage URL
        const { error: updateError } = await supabase
            .from('centralized_vocabulary')
            .update({ audio_url: urlData.publicUrl })
            .eq('id', vocab.id);

        if (updateError) {
            console.error(`✗ Failed to update ${vocab.word}:`, updateError.message);
            errorCount++;
        } else {
            console.log(`✓ Updated ${vocab.word} (${vocab.language}) with Supabase URL`);
            successCount++;
        }
    }

    console.log(`\n📊 Database Update Summary:`);
    console.log(`✓ Successfully updated: ${successCount} words`);
    console.log(`✗ Failed: ${errorCount} words`);
}

async function uploadAllAudioFiles() {
    console.log('🎵 Starting audio file upload to Supabase Storage...\n');

    // Ensure bucket exists
    await ensureBucketExists();

    // Get all local audio files
    const audioFiles = await getLocalAudioFiles();
    
    if (audioFiles.length === 0) {
        console.log('No audio files found in local directory');
        return;
    }

    console.log(`Found ${audioFiles.length} audio files to upload`);

    let successCount = 0;
    let errorCount = 0;

    // Upload files in batches to avoid overwhelming the server
    const BATCH_SIZE = 10;
    const DELAY_MS = 500; // 500ms delay between batches

    for (let i = 0; i < audioFiles.length; i += BATCH_SIZE) {
        const batch = audioFiles.slice(i, i + BATCH_SIZE);
        
        console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(audioFiles.length/BATCH_SIZE)}:`);

        // Process batch in parallel
        const batchPromises = batch.map(async (filename) => {
            const localPath = path.join(AUDIO_DIR, filename);
            const supabasePath = `vocabulary/${filename}`;
            
            const publicUrl = await uploadFileToSupabase(localPath, supabasePath);
            return publicUrl ? true : false;
        });

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
        if (i + BATCH_SIZE < audioFiles.length) {
            console.log(`Waiting ${DELAY_MS}ms before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    console.log(`\n📊 Upload Summary:`);
    console.log(`✓ Successfully uploaded: ${successCount} files`);
    console.log(`✗ Failed: ${errorCount} files`);
    console.log(`📁 Files uploaded to: ${BUCKET_NAME}/vocabulary/`);

    // Update database with Supabase URLs
    if (successCount > 0) {
        await updateDatabaseWithSupabaseUrls();
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Upload interrupted by user');
    process.exit(0);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
});

// Run the script
if (require.main === module) {
    uploadAllAudioFiles().catch(error => {
        console.error('Script failed:', error);
        process.exit(1);
    });
}

module.exports = { uploadAllAudioFiles };
