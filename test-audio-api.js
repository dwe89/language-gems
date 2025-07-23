#!/usr/bin/env node

/**
 * Test Audio Generation API Endpoint
 * 
 * This script makes a direct API call to test audio generation
 */

const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function testAudioAPI() {
  console.log('🔊 Testing audio generation API endpoint...');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const apiUrl = `${baseUrl}/api/admin/generate-audio`;
  
  // Test with a simple Spanish word
  const testPayload = {
    word: 'hola',
    language: 'es',
    vocabularyId: 'test-id-123',
    category: 'test',
    base_word: 'hola'
  };
  
  try {
    console.log('📤 Making API request...');
    console.log('URL:', apiUrl);
    console.log('Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log(`📨 Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    console.log('📨 Response body:', responseText);
    
    if (!response.ok) {
      console.error('❌ API request failed');
      
      // Try to parse as JSON for more details
      try {
        const errorData = JSON.parse(responseText);
        console.error('Error details:', errorData);
      } catch (e) {
        console.error('Raw error response:', responseText);
      }
    } else {
      console.log('✅ API request successful!');
      
      try {
        const result = JSON.parse(responseText);
        console.log('Success details:', result);
      } catch (e) {
        console.log('Response was not JSON:', responseText);
      }
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

// Also test with one of the recently imported vocabulary items
async function testWithRealVocabulary() {
  console.log('\n🔍 Testing with real vocabulary item...');
  
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Get a recently imported vocabulary item
    const { data: vocabularyItems, error } = await supabase
      .from('centralized_vocabulary')
      .select('id, word, language, category, base_word')
      .eq('language', 'es')
      .is('audio_url', null)
      .limit(1);
    
    if (error) {
      console.error('❌ Failed to fetch vocabulary item:', error.message);
      return;
    }
    
    if (!vocabularyItems || vocabularyItems.length === 0) {
      console.log('⚠️  No Spanish vocabulary items without audio found');
      return;
    }
    
    const item = vocabularyItems[0];
    console.log(`📝 Testing with vocabulary item: ${item.word} (${item.language})`);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/admin/generate-audio`;
    
    const payload = {
      word: item.word,
      language: item.language,
      vocabularyId: item.id,
      category: item.category,
      base_word: item.base_word
    };
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    console.log(`📨 Response status: ${response.status} ${response.statusText}`);
    
    const responseText = await response.text();
    
    if (!response.ok) {
      console.error('❌ Real vocabulary test failed');
      console.error('Response:', responseText);
    } else {
      console.log('✅ Real vocabulary test successful!');
      const result = JSON.parse(responseText);
      console.log('Audio URL:', result.audioUrl);
    }
    
  } catch (error) {
    console.error('❌ Real vocabulary test error:', error.message);
  }
}

async function runTests() {
  await testAudioAPI();
  await testWithRealVocabulary();
}

runTests();
