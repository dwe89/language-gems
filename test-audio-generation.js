#!/usr/bin/env node

/**
 * Test AWS Polly Audio Generation
 * 
 * This script tests if AWS Polly is working correctly and helps diagnose issues
 */

const AWS = require('aws-sdk');
require('dotenv').config({ path: '.env.local' });

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

async function testPolly() {
  console.log('🔊 Testing AWS Polly configuration...');
  
  // Check AWS credentials
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.error('❌ AWS credentials not found in environment variables');
    return;
  }
  
  console.log('✅ AWS credentials found');
  console.log(`📍 Region: ${process.env.AWS_REGION || 'us-east-1'}`);
  
  const polly = new AWS.Polly();
  
  try {
    // Test 1: List available voices
    console.log('\n🎤 Testing voice availability...');
    const voices = await polly.describeVoices().promise();
    console.log(`✅ Found ${voices.Voices.length} available voices`);
    
    // Show Spanish, French, and German voices
    const targetLanguages = ['es', 'fr', 'de'];
    targetLanguages.forEach(lang => {
      const langVoices = voices.Voices.filter(v => v.LanguageCode.startsWith(lang));
      console.log(`  ${lang.toUpperCase()}: ${langVoices.map(v => `${v.Name} (${v.Engine})`).join(', ')}`);
    });
    
    // Test 2: Simple synthesis
    console.log('\n🗣️  Testing speech synthesis...');
    const testParams = {
      Text: 'Hola',
      OutputFormat: 'mp3',
      VoiceId: 'Lucia',
      Engine: 'neural'
    };
    
    const result = await polly.synthesizeSpeech(testParams).promise();
    
    if (result.AudioStream) {
      const audioBuffer = Buffer.from(result.AudioStream);
      console.log(`✅ Audio synthesis successful! Generated ${audioBuffer.length} bytes`);
    } else {
      console.error('❌ No audio stream received');
    }
    
  } catch (error) {
    console.error('❌ AWS Polly error:', error.message);
    
    if (error.code === 'UnrecognizedClientException') {
      console.error('💡 This usually means AWS credentials are invalid');
    } else if (error.code === 'AccessDeniedException') {
      console.error('💡 This means your AWS account doesn\'t have permission to use Polly');
    } else if (error.code === 'ThrottlingException') {
      console.error('💡 You\'ve hit AWS Polly rate limits - too many requests');
    } else if (error.code === 'ServiceUnavailableException') {
      console.error('💡 AWS Polly service is temporarily unavailable');
    }
    
    console.error('Full error details:', error);
  }
}

// Test Supabase storage as well
async function testSupabaseStorage() {
  console.log('\n🗄️  Testing Supabase storage...');
  
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Test storage bucket access
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('❌ Supabase storage error:', error.message);
      return;
    }
    
    console.log(`✅ Found ${buckets.length} storage buckets`);
    const audioBucket = buckets.find(b => b.name === 'audio');
    
    if (audioBucket) {
      console.log('✅ Audio bucket exists and is accessible');
    } else {
      console.error('❌ Audio bucket not found');
    }
    
  } catch (error) {
    console.error('❌ Supabase storage test failed:', error.message);
  }
}

async function runTests() {
  await testPolly();
  await testSupabaseStorage();
}

runTests();
