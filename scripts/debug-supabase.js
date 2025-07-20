#!/usr/bin/env node

/**
 * Debug script to test Supabase connection and query
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Environment check:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');

if (!supabaseUrl) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
    process.exit(1);
}

// Try with service role key first, fallback to anon key
const supabaseKey = supabaseServiceKey || supabaseAnonKey;
if (!supabaseKey) {
    console.error('Missing both service role key and anon key');
    process.exit(1);
}

console.log('Using key type:', supabaseServiceKey ? 'SERVICE_ROLE' : 'ANON');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
    try {
        console.log('\n🔍 Testing Supabase connection...');
        
        // Test basic query
        const { data: testData, error: testError } = await supabase
            .from('centralized_vocabulary')
            .select('id')
            .limit(1);
        
        if (testError) {
            console.error('Supabase connection error:', testError);
            return;
        }
        
        console.log('✓ Supabase connection successful');
        
        // Test vocabulary count
        console.log('\n📊 Checking vocabulary counts...');
        
        const { data: allVocab, error: allError } = await supabase
            .from('centralized_vocabulary')
            .select('id, language, word, category, audio_url')
            .in('language', ['es', 'fr']);
        
        if (allError) {
            console.error('Error fetching vocabulary:', allError);
            return;
        }
        
        console.log(`Total vocabulary words: ${allVocab.length}`);
        
        // Check audio_url status
        const withAudio = allVocab.filter(v => v.audio_url !== null);
        const withoutAudio = allVocab.filter(v => v.audio_url === null);
        
        console.log(`Words with audio: ${withAudio.length}`);
        console.log(`Words without audio: ${withoutAudio.length}`);
        
        if (withAudio.length > 0) {
            console.log('\nSample words with audio:');
            withAudio.slice(0, 3).forEach(v => {
                console.log(`- ${v.word} (${v.language}): ${v.audio_url}`);
            });
        }
        
        if (withoutAudio.length > 0) {
            console.log('\nSample words without audio:');
            withoutAudio.slice(0, 5).forEach(v => {
                console.log(`- ${v.id}: ${v.word} (${v.language}/${v.category})`);
            });
        }
        
        // Test specific query used in the script
        console.log('\n🔍 Testing specific query from script...');
        const { data: scriptData, error: scriptError } = await supabase
            .from('centralized_vocabulary')
            .select('id, language, word, category')
            .is('audio_url', null)
            .in('language', ['es', 'fr'])
            .order('language')
            .order('category')
            .order('word');

        if (scriptError) {
            console.error('Script query error:', scriptError);
            return;
        }
        
        console.log(`Script query returned: ${scriptData.length} words`);
        if (scriptData.length > 0) {
            console.log('First few results:');
            scriptData.slice(0, 3).forEach(v => {
                console.log(`- ${v.id}: ${v.word} (${v.language}/${v.category})`);
            });
        }
        
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

testSupabaseConnection();
